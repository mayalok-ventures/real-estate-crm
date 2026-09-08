"use client";

import React, { useState, useRef } from "react";
import { Icon } from "@/components/Icon";
import {
  Lead,
  getStoredLeads,
  getStoredLeadFieldConfigs,
  addBatchLeadsToStore,
} from "@/data/mockData";
import {
  readSpreadsheetFile,
  readSheetData,
  generateSmartColumnMappings,
  validateAndDetectDuplicates,
  buildLeadEntityFromImport,
  downloadErrorReportCsv,
  getSavedMappingTemplates,
  saveMappingTemplate,
  deleteMappingTemplate,
  SpreadsheetFileInfo,
  SheetData,
  ColumnMappingItem,
  ImportValidationSummary,
  MappingTemplate,
  getStandardFieldLabel,
} from "@/utils/leadImport";

interface ImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (importedCount: number) => void;
}

type ImportStep = "upload" | "preview" | "mapping" | "validation" | "importing" | "complete";

export function ImportLeadsModal({
  isOpen,
  onClose,
  onImportComplete,
}: ImportLeadsModalProps) {
  const [currentStep, setCurrentStep] = useState<ImportStep>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [fileInfo, setFileInfo] = useState<SpreadsheetFileInfo | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [columnMappings, setColumnMappings] = useState<ColumnMappingItem[]>([]);
  const [validationSummary, setValidationSummary] = useState<ImportValidationSummary | null>(null);

  // Duplicate strategy
  const [duplicateStrategy, setDuplicateStrategy] = useState<"skip" | "import_all">("skip");

  // Mapping templates
  const [savedTemplates, setSavedTemplates] = useState<MappingTemplate[]>(() => getSavedMappingTemplates());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [newTemplateName, setNewTemplateName] = useState<string>("");
  const [showSaveTemplateForm, setShowSaveTemplateForm] = useState(false);

  // Import progress
  const [importProgress, setImportProgress] = useState(0);
  const [importedCount, setImportedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    const ext = file.name.toLowerCase().split(".").pop();
    if (ext !== "csv" && ext !== "xlsx" && ext !== "xls") {
      setErrorMessage("Unsupported file format. Please upload a valid CSV (.csv) or Excel (.xlsx, .xls) file.");
      return;
    }

    try {
      const parsedInfo = await readSpreadsheetFile(file);
      setFileInfo(parsedInfo);
      const initialSheet = parsedInfo.sheetNames[0] || "";
      setSelectedSheet(initialSheet);

      const parsedData = readSheetData(parsedInfo.workbook, initialSheet);
      if (parsedData.rowCount === 0) {
        setErrorMessage("The selected sheet contains no data rows.");
        return;
      }

      setSheetData(parsedData);
      // Generate intelligent smart mappings
      const mappings = generateSmartColumnMappings(parsedData.headers, getStoredLeadFieldConfigs());
      setColumnMappings(mappings);
    } catch {
      setErrorMessage("Failed to read the file. Please ensure it is not corrupted or password-protected.");
    }
  };

  const handleSheetChange = (sheetName: string) => {
    if (!fileInfo) return;
    setSelectedSheet(sheetName);
    const parsedData = readSheetData(fileInfo.workbook, sheetName);
    setSheetData(parsedData);
    const mappings = generateSmartColumnMappings(parsedData.headers, getStoredLeadFieldConfigs());
    setColumnMappings(mappings);
  };

  const handleApplyTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (!templateId || !columnMappings.length) return;
    const template = savedTemplates.find((t) => t.id === templateId);
    if (!template) return;

    setColumnMappings((prev) =>
      prev.map((col) => {
        const mappedTarget = template.mapping[col.originalHeader] || template.mapping[col.normalizedHeader];
        if (mappedTarget) {
          return {
            ...col,
            targetField: mappedTarget,
            targetLabel: mappedTarget.startsWith("custom:")
              ? `${mappedTarget.replace("custom:", "")} (Custom)`
              : getStandardFieldLabel(mappedTarget),
            confidence: "high",
          };
        }
        return col;
      })
    );
  };

  const handleSaveCurrentMapping = () => {
    if (!newTemplateName.trim()) return;
    const mapObj: Record<string, string> = {};
    columnMappings.forEach((c) => {
      if (c.targetField && c.targetField !== "ignore") {
        mapObj[c.originalHeader] = c.targetField;
      }
    });
    const updated = saveMappingTemplate(newTemplateName, mapObj);
    setSavedTemplates(updated);
    setNewTemplateName("");
    setShowSaveTemplateForm(false);
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = deleteMappingTemplate(id);
    setSavedTemplates(updated);
    if (selectedTemplateId === id) setSelectedTemplateId("");
  };

  const handleProceedToValidation = () => {
    if (!sheetData) return;
    // Check if at least Name or Phone is mapped
    const hasName = columnMappings.some((m) => m.targetField === "name");
    const hasPhone = columnMappings.some((m) => m.targetField === "phone");

    if (!hasName && !hasPhone) {
      alert("Please map at least the Client Name or Phone Number column before proceeding.");
      return;
    }

    const summary = validateAndDetectDuplicates(sheetData.rows, columnMappings, getStoredLeads());
    setValidationSummary(summary);
    setCurrentStep("validation");
  };

  const handleExecuteImport = async () => {
    if (!validationSummary) return;

    setCurrentStep("importing");
    setImportProgress(10);

    const batchId = `imp-${Date.now().toString().slice(-6)}`;
    const rowsToImport = validationSummary.rows.filter((r) => {
      if (r.status === "invalid") return false;
      if (r.status === "duplicate" && duplicateStrategy === "skip") return false;
      return true;
    });

    const skipped = validationSummary.rows.length - rowsToImport.length;
    setSkippedCount(skipped);

    // Chunked non-blocking processing
    const chunkSize = 150;
    const entities: Lead[] = [];

    for (let i = 0; i < rowsToImport.length; i += chunkSize) {
      const chunk = rowsToImport.slice(i, i + chunkSize);
      chunk.forEach((row, idx) => {
        entities.push(buildLeadEntityFromImport(row, batchId, i + idx));
      });
      const percent = Math.min(95, Math.round(((i + chunk.length) / rowsToImport.length) * 100));
      setImportProgress(percent);
      // Small tick to allow UI to breathe
      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    // Perform single safe batch write to localStorage
    addBatchLeadsToStore(entities);

    setImportedCount(entities.length);
    setImportProgress(100);
    setCurrentStep("complete");
    onImportComplete(entities.length);
  };

  const customFieldConfigs = getStoredLeadFieldConfigs().filter((c) => !c.isSystem && c.isActive);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "760px",
          width: "100%",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          padding: 0,
          overflow: "hidden",
        }}
      >
        {/* Sticky Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                Import Leads
              </h2>
              <span className="badge badge-info" style={{ fontSize: "11px" }}>
                Smart Import
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Step{" "}
              {currentStep === "upload"
                ? "1 of 5: Upload File"
                : currentStep === "preview"
                ? "2 of 5: Preview Data"
                : currentStep === "mapping"
                ? "3 of 5: Column Mapping"
                : currentStep === "validation"
                ? "4 of 5: Validation & Duplicates"
                : "5 of 5: Final Import"}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-icon"
            aria-label="Close modal"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {errorMessage && (
            <div
              style={{
                backgroundColor: "var(--danger-light)",
                border: "1px solid var(--danger-border)",
                color: "var(--danger)",
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                fontSize: "13px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Icon name="alert-triangle" size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Upload */}
          {currentStep === "upload" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFile(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? "var(--brand-primary)" : "var(--border-strong)"}`,
                  borderRadius: "var(--radius-lg)",
                  padding: "36px 20px",
                  textAlign: "center",
                  backgroundColor: isDragging ? "var(--brand-primary-light)" : "var(--bg-subtle)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                  style={{ display: "none" }}
                  aria-label="Choose CSV or Excel file"
                />

                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: "var(--bg-surface)",
                    color: "var(--brand-primary)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "12px",
                    boxShadow: "var(--shadow-xs)",
                  }}
                >
                  <Icon name="upload-cloud" size={24} />
                </div>

                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Choose a CSV or Excel spreadsheet
                </div>
                <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  Drag and drop here, or tap to browse from your device
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
                  Supported formats: <strong>.CSV, .XLSX, .XLS</strong>
                </div>
              </div>

              {/* Uploaded File Info Card */}
              {fileInfo && sheetData && (
                <div
                  className="card"
                  style={{
                    padding: "16px",
                    backgroundColor: "var(--bg-surface)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {fileInfo.fileName}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {fileInfo.fileSize} • {sheetData.rowCount.toLocaleString()} detected rows • {sheetData.colCount} columns
                      </div>
                    </div>
                    <span className="badge badge-success">File Ready</span>
                  </div>

                  {/* Multi-Sheet Selector if Excel */}
                  {fileInfo.sheetNames.length > 1 && (
                    <div style={{ paddingTop: "10px", borderTop: "1px solid var(--border-subtle)" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Select Worksheet to Import:
                      </label>
                      <select
                        value={selectedSheet}
                        onChange={(e) => handleSheetChange(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-subtle)",
                          backgroundColor: "var(--bg-surface)",
                          fontSize: "13px",
                          color: "var(--text-primary)",
                        }}
                      >
                        {fileInfo.sheetNames.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Client-Side Storage Callout */}
              <div
                style={{
                  backgroundColor: "var(--bg-subtle)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 14px",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.4,
                }}
              >
                <strong>Client-Side Processing:</strong> All spreadsheet data is processed locally in your browser. Large datasets (&gt;2,000 rows) are supported, but browser storage limits apply.
              </div>
            </div>
          )}

          {/* STEP 2: Preview Data */}
          {currentStep === "preview" && sheetData && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                    Spreadsheet Preview (First {Math.min(10, sheetData.rowCount)} Rows)
                  </h3>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Verify that columns and data rows parsed accurately
                  </div>
                </div>
                <span className="badge badge-neutral">
                  {sheetData.rowCount} Total Rows
                </span>
              </div>

              {/* Responsive preview container */}
              <div
                style={{
                  overflowX: "auto",
                  maxWidth: "100%",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface)",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "var(--bg-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
                      <th style={{ padding: "8px 12px", color: "var(--text-muted)", fontWeight: 600, width: "40px" }}>#</th>
                      {sheetData.headers.map((h) => (
                        <th key={h} style={{ padding: "8px 12px", color: "var(--text-primary)", fontWeight: 700, whiteSpace: "nowrap" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sheetData.rows.slice(0, 10).map((row, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: idx < 9 ? "1px solid var(--border-subtle)" : "none",
                        }}
                      >
                        <td style={{ padding: "8px 12px", color: "var(--text-muted)", fontSize: "11px" }}>
                          {idx + 1}
                        </td>
                        {sheetData.headers.map((h) => (
                          <td
                            key={h}
                            style={{
                              padding: "8px 12px",
                              color: "var(--text-secondary)",
                              whiteSpace: "nowrap",
                              maxWidth: "200px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {String(row[h] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 3: Smart Column Mapping */}
          {currentStep === "mapping" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                    Column Mapping
                  </h3>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Review intelligent suggestions or map to custom broker fields
                  </div>
                </div>

                {/* Saved Mappings Dropdown */}
                {savedTemplates.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => handleApplyTemplate(e.target.value)}
                      style={{
                        padding: "5px 8px",
                        fontSize: "12px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border-subtle)",
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <option value="">-- Apply Saved Template --</option>
                      {savedTemplates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>

                    {selectedTemplateId && (
                      <button
                        type="button"
                        onClick={() => handleDeleteTemplate(selectedTemplateId)}
                        className="btn-icon"
                        title="Delete this template"
                        aria-label="Delete mapping template"
                        style={{ width: "28px", height: "28px" }}
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Column Mapping Rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {columnMappings.map((col, idx) => (
                  <div
                    key={col.originalHeader}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-subtle)",
                      backgroundColor: "var(--bg-surface)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                          {col.originalHeader}
                        </span>
                        {col.confidence === "high" ? (
                          <span className="badge badge-success" style={{ fontSize: "10px" }}>
                            ✓ High Match
                          </span>
                        ) : col.confidence === "medium" ? (
                          <span className="badge badge-warning" style={{ fontSize: "10px" }}>
                            ~ Suggested
                          </span>
                        ) : (
                          <span className="badge badge-neutral" style={{ fontSize: "10px" }}>
                            Unmapped
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                        Column #{idx + 1}
                      </div>
                    </div>

                    {/* Mapping selector */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, minWidth: "60px" }}>
                        Maps to:
                      </span>
                      <select
                        value={col.targetField}
                        onChange={(e) => {
                          const val = e.target.value;
                          setColumnMappings((prev) =>
                            prev.map((item) =>
                              item.originalHeader === col.originalHeader
                                ? {
                                    ...item,
                                    targetField: val,
                                    targetLabel: val.startsWith("custom:")
                                      ? `${val.replace("custom:", "")} (Custom)`
                                      : getStandardFieldLabel(val),
                                  }
                                : item
                            )
                          );
                        }}
                        style={{
                          flex: 1,
                          padding: "7px 10px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-subtle)",
                          backgroundColor: "var(--bg-surface)",
                          fontSize: "13px",
                          color: "var(--text-primary)",
                        }}
                      >
                        <option value="ignore">(Ignore this column)</option>
                        <optgroup label="Standard CRM Lead Fields">
                          <option value="name">Client Name *</option>
                          <option value="phone">Phone Number *</option>
                          <option value="email">Email Address</option>
                          <option value="propertyInterest">Property / Project Interest</option>
                          <option value="budget">Approx. Budget</option>
                          <option value="status">Lead Status</option>
                          <option value="source">Lead Acquisition Source</option>
                          <option value="location">City / Location</option>
                          <option value="assignedTo">Assigned Advisor</option>
                          <option value="interestType">Property Type (Villa, Apt, Plot)</option>
                          <option value="notes">Notes & Requirements</option>
                        </optgroup>
                        {customFieldConfigs.length > 0 && (
                          <optgroup label="Broker Custom Fields">
                            {customFieldConfigs.map((cf) => (
                              <option key={cf.name} value={`custom:${cf.name}`}>
                                {cf.label} (Custom)
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Mapping Template Section */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-subtle)",
                  border: "1px dashed var(--border-subtle)",
                }}
              >
                {!showSaveTemplateForm ? (
                  <button
                    type="button"
                    onClick={() => setShowSaveTemplateForm(true)}
                    style={{
                      fontSize: "12px",
                      color: "var(--brand-primary)",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Icon name="plus" size={13} />
                    <span>Save this column setup as a reusable template</span>
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <input
                      type="text"
                      placeholder="e.g. Meta Ads Export Template"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                      style={{
                        flex: 1,
                        minWidth: "160px",
                        padding: "6px 10px",
                        fontSize: "12px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSaveCurrentMapping}
                      className="btn btn-primary btn-sm"
                    >
                      Save Template
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSaveTemplateForm(false)}
                      className="btn btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Validation & Duplicate Review */}
          {currentStep === "validation" && validationSummary && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                  Validation & Duplicate Check
                </h3>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Verified against active CRM leads and duplicate spreadsheet entries
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "10px",
                }}
              >
                <div className="card" style={{ padding: "12px", borderLeft: "3px solid var(--success)" }}>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600 }}>READY TO IMPORT</div>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--success)", marginTop: "2px" }}>
                    {validationSummary.readyCount + validationSummary.needsAttentionCount}
                  </div>
                </div>

                <div className="card" style={{ padding: "12px", borderLeft: "3px solid var(--warning)" }}>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600 }}>DUPLICATES</div>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--warning)", marginTop: "2px" }}>
                    {validationSummary.duplicateCount}
                  </div>
                </div>

                <div className="card" style={{ padding: "12px", borderLeft: "3px solid var(--danger)" }}>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600 }}>INVALID ROWS</div>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--danger)", marginTop: "2px" }}>
                    {validationSummary.invalidCount}
                  </div>
                </div>
              </div>

              {/* Duplicate Handling Policy */}
              {validationSummary.duplicateCount > 0 && (
                <div
                  className="card"
                  style={{
                    padding: "14px",
                    backgroundColor: "var(--bg-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Duplicate Handling Option
                  </div>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="dupStrategy"
                        checked={duplicateStrategy === "skip"}
                        onChange={() => setDuplicateStrategy("skip")}
                      />
                      <span>
                        <strong>Skip Duplicates</strong> (Recommended — protects existing data)
                      </span>
                    </label>

                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="dupStrategy"
                        checked={duplicateStrategy === "import_all"}
                        onChange={() => setDuplicateStrategy("import_all")}
                      />
                      <span>Import All Anyway</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Issues Inspection List if duplicates or invalid exist */}
              {(validationSummary.invalidCount > 0 || validationSummary.duplicateCount > 0) && (
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>
                    Flagged Records Preview ({validationSummary.invalidCount + validationSummary.duplicateCount} items)
                  </div>
                  <div
                    style={{
                      maxHeight: "180px",
                      overflowY: "auto",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--bg-surface)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {validationSummary.rows
                      .filter((r) => r.status === "invalid" || r.status === "duplicate")
                      .slice(0, 15)
                      .map((r) => (
                        <div
                          key={r.rowNumber}
                          style={{
                            padding: "8px 12px",
                            borderBottom: "1px solid var(--border-subtle)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "12px",
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                              Row #{r.rowNumber}:
                            </span>{" "}
                            <span style={{ color: "var(--text-secondary)" }}>
                              {String(r.originalData.name || r.originalData.client_name || "Unnamed")}
                            </span>
                            <div style={{ color: r.status === "invalid" ? "var(--danger)" : "var(--warning)", fontSize: "11px", marginTop: "1px" }}>
                              {r.duplicateReason || r.issues.join(", ")}
                            </div>
                          </div>

                          <span className={`badge ${r.status === "invalid" ? "badge-danger" : "badge-warning"}`} style={{ fontSize: "10px" }}>
                            {r.status === "invalid" ? "Invalid" : "Duplicate"}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Importing Progress */}
          {currentStep === "importing" && (
            <div style={{ padding: "40px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
                Importing Leads into CRM...
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", maxWidth: "420px" }}>
                Validating entities, generating unique tracking IDs and saving securely to your local directory.
              </div>

              <div
                style={{
                  width: "100%",
                  maxWidth: "360px",
                  height: "8px",
                  backgroundColor: "var(--bg-subtle)",
                  borderRadius: "var(--radius-full)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${importProgress}%`,
                    height: "100%",
                    backgroundColor: "var(--brand-primary)",
                    transition: "width 0.2s ease",
                  }}
                />
              </div>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                {importProgress}% completed
              </span>
            </div>
          )}

          {/* STEP 6: Complete Summary */}
          {currentStep === "complete" && (
            <div style={{ padding: "30px 10px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--success-light)",
                  color: "var(--success)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="check" size={28} />
              </div>

              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  Import Completed Successfully!
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  Your newly imported prospects are now live across Leads Directory, Pipeline, and Follow-ups.
                </p>
              </div>

              {/* Results Breakdown */}
              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <div className="card" style={{ padding: "10px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--success)" }}>
                    {importedCount}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Leads Imported</div>
                </div>

                <div className="card" style={{ padding: "10px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--warning)" }}>
                    {skippedCount}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Duplicates Skipped</div>
                </div>

                {validationSummary && validationSummary.invalidCount > 0 && (
                  <div className="card" style={{ padding: "10px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--danger)" }}>
                      {validationSummary.invalidCount}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Invalid Rows</div>
                  </div>
                )}
              </div>

              {/* Download Error Report Button if skipped or invalid rows exist */}
              {validationSummary && (validationSummary.invalidCount > 0 || skippedCount > 0) && (
                <button
                  type="button"
                  onClick={() => {
                    const failedRows = validationSummary.rows.filter(
                      (r) => r.status === "invalid" || (r.status === "duplicate" && duplicateStrategy === "skip")
                    );
                    downloadErrorReportCsv(failedRows, fileInfo?.fileName || "leads");
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "6px" }}
                >
                  <Icon name="download" size={14} />
                  <span>Download Error / Skipped Report (CSV)</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sticky Action Footer */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-surface)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {currentStep === "upload" && (
            <>
              <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button
                type="button"
                disabled={!sheetData}
                onClick={() => setCurrentStep("preview")}
                className="btn btn-primary btn-sm"
              >
                Preview Data →
              </button>
            </>
          )}

          {currentStep === "preview" && (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep("upload")}
                className="btn btn-secondary btn-sm"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep("mapping")}
                className="btn btn-primary btn-sm"
              >
                Configure Mapping →
              </button>
            </>
          )}

          {currentStep === "mapping" && (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep("preview")}
                className="btn btn-secondary btn-sm"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleProceedToValidation}
                className="btn btn-primary btn-sm"
              >
                Validate & Check Duplicates →
              </button>
            </>
          )}

          {currentStep === "validation" && (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep("mapping")}
                className="btn btn-secondary btn-sm"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                className="btn btn-primary btn-sm"
                disabled={!validationSummary || validationSummary.readyCount + validationSummary.needsAttentionCount === 0}
              >
                Import Leads Now →
              </button>
            </>
          )}

          {currentStep === "complete" && (
            <button
              type="button"
              onClick={onClose}
              className="btn btn-primary btn-sm"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Done & Return to Directory
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImportLeadsModal;
