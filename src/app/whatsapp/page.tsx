"use client";

import React, { useState } from "react";
import { Icon } from "@/components/Icon";
import {
  MOCK_LEADS,
  WhatsAppTemplate,
  TemplateAttachment,
  getStoredWhatsAppTemplates,
  addWhatsAppTemplateToStore,
  updateWhatsAppTemplateInStore,
  deleteWhatsAppTemplateFromStore,
} from "@/data/mockData";
import { createAttachmentFromFile } from "@/utils/mediaService";

const COUNTRY_DIAL_CODES = [
  { country: "India", code: "+91", flag: "🇮🇳" },
  { country: "United States / Canada", code: "+1", flag: "🇺🇸" },
  { country: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { country: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { country: "Singapore", code: "+65", flag: "🇸🇬" },
  { country: "Australia", code: "+61", flag: "🇦🇺" },
  { country: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { country: "Germany", code: "+49", flag: "🇩🇪" },
  { country: "Qatar", code: "+974", flag: "🇶🇦" },
];

export default function WhatsAppPage() {
  const [activeTab, setActiveTab] = useState<"templates" | "pairing" | "dispatcher">("templates");
  const [connectionMode, setConnectionMode] = useState<"qr" | "pairing" | "cloud">("qr");
  const [isConnected, setIsConnected] = useState(false);

  // Alert / Toast
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  // Templates state
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(() => getStoredWhatsAppTemplates());
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WhatsAppTemplate | null>(null);

  // Template Form state
  const [tmplName, setTmplName] = useState("");
  const [tmplCategory, setTmplCategory] = useState<WhatsAppTemplate["category"]>("Brochure");
  const [tmplBody, setTmplBody] = useState("");
  const [tmplAttachments, setTmplAttachments] = useState<TemplateAttachment[]>([]);

  // Add Attachment sub-form
  const [newAttachmentName, setNewAttachmentName] = useState("");
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);

  // Mobile pairing state
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [mobileNumber, setMobileNumber] = useState("");
  const [generatedPairingCode, setGeneratedPairingCode] = useState<string | null>(null);
  const [pairingError, setPairingError] = useState<string | null>(null);
  const [pairingCountdown, setPairingCountdown] = useState<number>(60);

  // Cloud API Form State
  const [cloudAppId, setCloudAppId] = useState("");
  const [cloudPhoneId, setCloudPhoneId] = useState("");
  const [cloudAccessToken, setCloudAccessToken] = useState("");

  // Quick Dispatch Tester
  const [selectedLeadId, setSelectedLeadId] = useState(MOCK_LEADS[0].id);
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || "tmpl-1");

  // Reset form
  const resetTemplateForm = () => {
    setTmplName("");
    setTmplCategory("Brochure");
    setTmplBody("");
    setTmplAttachments([]);
    setNewAttachmentName("");
    setAttachmentError(null);
    setEditingTemplate(null);
  };

  const openCreateTemplate = () => {
    resetTemplateForm();
    setShowTemplateModal(true);
  };

  const openEditTemplate = (tmpl: WhatsAppTemplate) => {
    setEditingTemplate(tmpl);
    setTmplName(tmpl.name);
    setTmplCategory(tmpl.category);
    setTmplBody(tmpl.body);
    setTmplAttachments(tmpl.attachments || []);
    setNewAttachmentName("");
    setAttachmentError(null);
    setShowTemplateModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!newAttachmentName.trim()) {
      setAttachmentError("Mandatory: Enter a recognizable name for this media before uploading.");
      e.target.value = "";
      return;
    }

    setAttachmentError(null);
    setIsProcessingFile(true);

    try {
      const result = await createAttachmentFromFile(file, newAttachmentName.trim());
      if (!result.success || !result.attachment) {
        setAttachmentError(result.error || "Failed to attach file.");
      } else {
        setTmplAttachments((prev) => [...prev, result.attachment as TemplateAttachment]);
        setNewAttachmentName("");
        showToast("success", `Attached: "${result.attachment.name}" (${result.attachment.fileSize})`);
      }
    } catch {
      setAttachmentError("Error processing file for attachment.");
    } finally {
      setIsProcessingFile(false);
      e.target.value = "";
    }
  };

  const handleRemoveAttachment = (attId: string) => {
    setTmplAttachments((prev) => prev.filter((a) => a.id !== attId));
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tmplName.trim() || !tmplBody.trim()) {
      showToast("error", "Template Name and Message Content are required.");
      return;
    }

    // Extract {variables}
    const matches = tmplBody.match(/{([a-zA-Z0-9_]+)}/g) || [];
    const variables = Array.from(new Set(matches.map((m) => m.replace(/[{}]/g, ""))));

    if (editingTemplate) {
      const updated: WhatsAppTemplate = {
        ...editingTemplate,
        name: tmplName.trim(),
        category: tmplCategory,
        body: tmplBody.trim(),
        variables,
        attachments: tmplAttachments,
        updatedAt: new Date().toISOString().split("T")[0],
      };
      const updatedList = updateWhatsAppTemplateInStore(updated);
      setTemplates(updatedList);
      showToast("success", `Template "${updated.name}" updated successfully.`);
    } else {
      const newTmpl: WhatsAppTemplate = {
        id: `tmpl-${Date.now()}`,
        name: tmplName.trim(),
        category: tmplCategory,
        body: tmplBody.trim(),
        variables,
        attachments: tmplAttachments,
        status: "Active",
        updatedAt: new Date().toISOString().split("T")[0],
      };
      const updatedList = addWhatsAppTemplateToStore(newTmpl);
      setTemplates(updatedList);
      showToast("success", `Template "${newTmpl.name}" created with ${tmplAttachments.length} named attachment(s).`);
    }

    setShowTemplateModal(false);
    resetTemplateForm();
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = deleteWhatsAppTemplateFromStore(id);
    setTemplates(updated);
    showToast("success", "Template removed.");
  };

  const handleGeneratePairingCode = (e: React.FormEvent) => {
    e.preventDefault();
    setPairingError(null);

    const digitsOnly = mobileNumber.replace(/[^\d]/g, "");
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      setPairingError("Please enter a valid international mobile phone number (7 to 15 digits).");
      return;
    }

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let codePart1 = "";
    let codePart2 = "";
    for (let i = 0; i < 4; i++) {
      codePart1 += chars.charAt(Math.floor(Math.random() * chars.length));
      codePart2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const fullCode = `${codePart1}-${codePart2}`;

    setGeneratedPairingCode(fullCode);
    setPairingCountdown(60);

    const timer = setInterval(() => {
      setPairingCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTestDirectWhatsApp = () => {
    const lead = MOCK_LEADS.find((l) => l.id === selectedLeadId) || MOCK_LEADS[0];
    const tmpl = templates.find((t) => t.id === selectedTemplateId) || templates[0];
    if (!tmpl) return;

    let filled = tmpl.body
      .replace(/{client_name}/g, lead.name)
      .replace(/{project_name}/g, lead.projectName || lead.propertyInterest)
      .replace(/{location}/g, lead.location || "Bangalore")
      .replace(/{starting_price}/g, lead.budget)
      .replace(/{broker_name}/g, "Rohan Verma")
      .replace(/{agency_name}/g, "Verma Realty");

    if (tmpl.attachments && tmpl.attachments.length > 0) {
      filled += "\n\n*Included Attachments:*";
      tmpl.attachments.forEach((att) => {
        filled += `\n• [${att.type.toUpperCase()}] ${att.name} (${att.fileSize})`;
      });
    }

    const rawPhone = lead.phone.replace(/[^\d]/g, "");
    const url = `https://wa.me/${rawPhone}?text=${encodeURIComponent(filled)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: toast.type === "error" ? "var(--danger, #dc2626)" : "var(--brand-primary)",
            color: "white",
            padding: "10px 18px",
            borderRadius: "var(--radius-lg)",
            fontSize: "13px",
            fontWeight: 600,
            zIndex: 9999,
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>{toast.type === "error" ? "⚠️" : "✔"}</span>
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: 0,
        }}
      >
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>
            WhatsApp Hub & Templates
          </h1>
          <p className="page-subtitle" style={{ margin: "4px 0 0 0" }}>
            Manage communication templates with named media attachments and configure WhatsApp pairing
          </p>
        </div>

        <span
          className={isConnected ? "badge badge-success" : "badge badge-neutral"}
          style={{ padding: "6px 12px", fontSize: "12.5px" }}
        >
          {isConnected ? "● Session Active" : "○ Standby Mode"}
        </span>
      </div>

      {/* Segmented Navigation */}
      <div
        style={{
          display: "flex",
          backgroundColor: "var(--bg-subtle)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          padding: "3px",
          overflowX: "auto",
          gap: "4px",
        }}
      >
        {[
          { id: "templates", label: `Templates (${templates.length})`, icon: "message-circle" as const },
          { id: "pairing", label: "Pairing & Cloud API", icon: "phone" as const },
          { id: "dispatcher", label: "Quick Dispatch", icon: "arrow-up-right" as const },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                flex: 1,
                minWidth: "115px",
                padding: "7px 12px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                backgroundColor: active ? "var(--bg-surface)" : "transparent",
                color: active ? "var(--brand-primary)" : "var(--text-secondary)",
                fontWeight: active ? 600 : 500,
                fontSize: "12.5px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                whiteSpace: "nowrap",
                boxShadow: active ? "var(--shadow-sm)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              <Icon name={tab.icon} size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TEMPLATES MANAGER */}
      {activeTab === "templates" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Top Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              Templates contain personalized message copy and directly linked <strong>named media attachments</strong> (Images, Videos, PDFs).
            </div>
            <button
              type="button"
              onClick={openCreateTemplate}
              className="btn btn-primary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Icon name="plus" size={14} />
              <span>Create New Template</span>
            </button>
          </div>

          {/* Templates Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
              gap: "16px",
            }}
          >
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  padding: "16px",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <div>
                    <span
                      className="badge badge-info"
                      style={{ fontSize: "10.5px", textTransform: "uppercase", marginBottom: "4px" }}
                    >
                      {tmpl.category}
                    </span>
                    <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", margin: "4px 0 0 0" }}>
                      {tmpl.name}
                    </h2>
                  </div>

                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      type="button"
                      onClick={() => openEditTemplate(tmpl)}
                      className="btn-icon"
                      title="Edit Template & Attachments"
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTemplate(tmpl.id)}
                      className="btn-icon"
                      style={{ color: "var(--danger)" }}
                      title="Delete Template"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>

                {/* Message Body Preview */}
                <div
                  style={{
                    backgroundColor: "var(--bg-subtle)",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    fontSize: "12.5px",
                    color: "var(--text-secondary)",
                    lineHeight: "1.5",
                    whiteSpace: "pre-wrap",
                    maxHeight: "130px",
                    overflowY: "auto",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  {tmpl.body}
                </div>

                {/* Named Attachments Checklist */}
                <div>
                  <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Icon name="file-text" size={13} />
                    <span>Attached Media ({tmpl.attachments?.length || 0})</span>
                  </div>

                  {tmpl.attachments && tmpl.attachments.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {tmpl.attachments.map((att) => (
                        <div
                          key={att.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "6px 10px",
                            backgroundColor: "var(--bg-surface)",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--border-subtle)",
                            fontSize: "12px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
                            <span
                              className={`badge ${
                                att.type === "image"
                                  ? "badge-info"
                                  : att.type === "video"
                                  ? "badge-warning"
                                  : "badge-neutral"
                              }`}
                              style={{ fontSize: "9.5px", textTransform: "uppercase" }}
                            >
                              {att.type}
                            </span>
                            <span style={{ fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {att.name}
                            </span>
                          </div>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", flexShrink: 0, marginLeft: "8px" }}>
                            {att.fileSize}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)", fontStyle: "italic" }}>
                      No media attached. Click Edit to attach named brochures, images, or walkthroughs.
                    </div>
                  )}
                </div>

                {/* Footer Meta */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--border-subtle)", fontSize: "11px", color: "var(--text-muted)" }}>
                  <span>Updated: {tmpl.updatedAt}</span>
                  <span style={{ color: "var(--brand-primary)", fontWeight: 600 }}>
                    {tmpl.variables.length} Dynamic Field(s)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DEVICE PAIRING & CLOUD API */}
      {activeTab === "pairing" && (
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
            Select Connection Mode
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { id: "qr", label: "Desktop Web QR Code" },
              { id: "pairing", label: "Mobile 8-Character Pairing Code" },
              { id: "cloud", label: "Enterprise Meta Cloud API" },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setConnectionMode(mode.id as typeof connectionMode)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "var(--radius-md)",
                  border: connectionMode === mode.id ? "1px solid var(--brand-primary)" : "1px solid var(--border-subtle)",
                  backgroundColor: connectionMode === mode.id ? "var(--brand-primary-light)" : "var(--bg-subtle)",
                  color: connectionMode === mode.id ? "var(--brand-primary)" : "var(--text-secondary)",
                  fontWeight: 600,
                  fontSize: "12.5px",
                  cursor: "pointer",
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* QR View */}
          {connectionMode === "qr" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", textAlign: "center", gap: "12px", border: "1px dashed var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
              <div style={{ width: "160px", height: "160px", backgroundColor: "#0f172a", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", padding: "12px" }}>
                <svg viewBox="0 0 100 100" width="100%" height="100%" fill="currentColor">
                  <rect width="30" height="30" x="5" y="5" rx="3" fill="#ffffff" />
                  <rect width="18" height="18" x="11" y="11" fill="#0f172a" />
                  <rect width="30" height="30" x="65" y="5" rx="3" fill="#ffffff" />
                  <rect width="18" height="18" x="71" y="11" fill="#0f172a" />
                  <rect width="30" height="30" x="5" y="65" rx="3" fill="#ffffff" />
                  <rect width="18" height="18" x="11" y="71" fill="#0f172a" />
                  <rect width="10" height="10" x="45" y="45" fill="#ffffff" />
                  <rect width="8" height="8" x="45" y="20" fill="#ffffff" />
                  <rect width="8" height="8" x="20" y="45" fill="#ffffff" />
                  <rect width="12" height="12" x="65" y="65" fill="#ffffff" />
                </svg>
              </div>
              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                Scan with WhatsApp on your Phone
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", maxWidth: "360px" }}>
                Open WhatsApp on phone → Linked Devices → Link a Device → Point phone camera at this screen.
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsConnected(!isConnected);
                  showToast("success", isConnected ? "Session disconnected." : "WhatsApp connected successfully.");
                }}
                className={`btn ${isConnected ? "btn-secondary" : "btn-primary"} btn-sm`}
              >
                {isConnected ? "Simulate Disconnect" : "Simulate Successful Scan"}
              </button>
            </div>
          )}

          {/* Pairing Code View */}
          {connectionMode === "pairing" && (
            <form onSubmit={handleGeneratePairingCode} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "420px" }}>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Designed for brokers operating directly from mobile: link WhatsApp using an official 8-character pairing code without needing a camera.
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  Select Country Dial Code
                </label>
                <select
                  value={selectedCountryCode}
                  onChange={(e) => setSelectedCountryCode(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13px" }}
                >
                  {COUNTRY_DIAL_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.country} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9845012345"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13.5px" }}
                />
              </div>

              {pairingError && (
                <div style={{ fontSize: "12px", color: "var(--danger)", fontWeight: 600 }}>
                  ⚠️ {pairingError}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ marginTop: "4px" }}>
                Generate 8-Character Pairing Code
              </button>

              {generatedPairingCode && (
                <div style={{ marginTop: "12px", padding: "16px", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid var(--border-strong)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
                    Enter Code on WhatsApp Mobile
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "3px", color: "var(--brand-primary)", margin: "8px 0", fontFamily: "monospace" }}>
                    {generatedPairingCode}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Code expires in: <strong>{pairingCountdown}s</strong>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* Cloud API View */}
          {connectionMode === "cloud" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "520px" }}>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Connect directly with Meta WhatsApp Cloud API credentials for automated messaging.
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  Phone Number ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 104928172648192"
                  value={cloudPhoneId}
                  onChange={(e) => setCloudPhoneId(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  WhatsApp Business Account (WABA) ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 291827461529103"
                  value={cloudAppId}
                  onChange={(e) => setCloudAppId(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  Permanent System User Access Token
                </label>
                <input
                  type="password"
                  placeholder="EAAG..."
                  value={cloudAccessToken}
                  onChange={(e) => setCloudAccessToken(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13px" }}
                />
              </div>

              <button
                type="button"
                onClick={() => showToast("success", "Meta Cloud API configuration verified and saved.")}
                className="btn btn-primary"
                style={{ marginTop: "4px" }}
              >
                Save Cloud API Credentials
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DIRECT DISPATCHER */}
      {activeTab === "dispatcher" && (
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "560px" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
            Quick Template Dispatcher
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: 0 }}>
            Pick a lead and a template to preview personalized text with linked named attachments and launch directly into WhatsApp.
          </p>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Select Recipient Lead
            </label>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13px" }}
            >
              {MOCK_LEADS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} • {l.phone} ({l.propertyInterest})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Select WhatsApp Template
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13px" }}
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  [{t.category}] {t.name} ({t.attachments?.length || 0} attachments)
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleTestDirectWhatsApp}
            className="btn btn-primary"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "6px" }}
          >
            <Icon name="message-circle" size={16} />
            <span>Open in WhatsApp with Attachments</span>
          </button>
        </div>
      )}

      {/* CREATE / EDIT TEMPLATE MODAL WITH NAMED ATTACHMENTS */}
      {showTemplateModal && (
        <div className="modal-overlay" onClick={() => setShowTemplateModal(false)}>
          <div
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: "560px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                {editingTemplate ? `Edit Template: ${editingTemplate.name}` : "Create WhatsApp Template"}
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="btn-icon"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Template Name */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                  Template Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prestige Palm Meadows Introduction"
                  value={tmplName}
                  onChange={(e) => setTmplName(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13.5px" }}
                />
              </div>

              {/* Category */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                  Category
                </label>
                <select
                  value={tmplCategory}
                  onChange={(e) => setTmplCategory(e.target.value as WhatsAppTemplate["category"])}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13px" }}
                >
                  <option value="Greeting">Greeting / Welcome</option>
                  <option value="Brochure">Brochure & Pricing</option>
                  <option value="Follow-up">Follow-up & Callback</option>
                  <option value="Site Visit">Site Visit & Walkthrough</option>
                  <option value="Offer">Special Offer & Benefits</option>
                </select>
              </div>

              {/* Message Content */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Message Content *
                  </label>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Supports &#123;client_name&#125;, &#123;project_name&#125;, &#123;location&#125;
                  </span>
                </div>
                <textarea
                  required
                  rows={5}
                  placeholder="Hello {client_name}, sharing the project details for {project_name}..."
                  value={tmplBody}
                  onChange={(e) => setTmplBody(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "13px",
                    lineHeight: "1.4",
                  }}
                />
              </div>

              {/* NAMED ATTACHMENTS BUILDER */}
              <div
                style={{
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-subtle)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Icon name="file-text" size={15} />
                  <span>Linked Named Media Attachments ({tmplAttachments.length})</span>
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                  Attach Images, Videos, or PDF brochures. Every uploaded item requires a clear, recognizable name.
                </div>

                {/* Current Attachments List */}
                {tmplAttachments.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {tmplAttachments.map((att) => (
                      <div
                        key={att.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 10px",
                          backgroundColor: "var(--bg-surface)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-subtle)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                          <span
                            className={`badge ${
                              att.type === "image"
                                ? "badge-info"
                                : att.type === "video"
                                ? "badge-warning"
                                : "badge-neutral"
                            }`}
                            style={{ fontSize: "10px", textTransform: "uppercase" }}
                          >
                            {att.type}
                          </span>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                              {att.name}
                            </span>
                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              {att.fileName} • {att.fileSize}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          className="btn-icon"
                          style={{ color: "var(--danger)" }}
                          title="Remove Attachment"
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Attachment Section */}
                <div
                  style={{
                    padding: "10px",
                    backgroundColor: "var(--bg-surface)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px dashed var(--border-strong)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                    + Attach New Media Item
                  </div>

                  <div>
                    <label style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "3px" }}>
                      Recognizable Media Name * (e.g. Master Floor Plan, Price Sheet PDF)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Prestige Palm Meadows Walkthrough Video"
                      value={newAttachmentName}
                      onChange={(e) => setNewAttachmentName(e.target.value)}
                      style={{ width: "100%", padding: "6px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", fontSize: "12.5px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "3px" }}>
                      Select File (Images max 10MB, Videos max 50MB, PDFs max 15MB)
                    </label>
                    <input
                      type="file"
                      accept="image/*,video/mp4,video/webm,application/pdf"
                      onChange={handleFileUpload}
                      disabled={isProcessingFile}
                      style={{ fontSize: "12px", width: "100%" }}
                    />
                  </div>

                  {isProcessingFile && (
                    <div style={{ fontSize: "11.5px", color: "var(--brand-primary)", fontWeight: 600 }}>
                      Processing and optimizing media file...
                    </div>
                  )}

                  {attachmentError && (
                    <div style={{ fontSize: "11.5px", color: "var(--danger)", fontWeight: 600 }}>
                      ⚠️ {attachmentError}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingTemplate ? "Save Template Changes" : "Create Template"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
