"use client";

import React, { useState } from "react";
import { Icon } from "@/components/Icon";
import { Lead, LeadConversion, ProjectItem, ProductConfiguration, getStoredProjects } from "@/data/mockData";

interface ConvertLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onConvert: (conversion: LeadConversion) => void;
}

export function ConvertLeadModal({
  isOpen,
  onClose,
  lead,
  onConvert,
}: ConvertLeadModalProps) {
  const [projects] = useState<ProjectItem[]>(() => getStoredProjects());

  const defaultProjectId = lead.projectId || (projects[0]?.id ?? "");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(defaultProjectId);
  const [selectedConfigId, setSelectedConfigId] = useState<string>("");
  const [priceMode, setPriceMode] = useState<"configuration" | "project" | "custom">("configuration");
  const [customPriceInput, setCustomPriceInput] = useState<string>("12000000");

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Configurations available for this project
  const projectConfigs = selectedProject?.configurations || [];
  const selectedConfig: ProductConfiguration | undefined =
    projectConfigs.find((c) => c.id === selectedConfigId) || projectConfigs[0];

  // Derive default numeric price
  let derivedDefaultPrice = 10000000;
  if (priceMode === "configuration" && selectedConfig) {
    derivedDefaultPrice = selectedConfig.sellingPrice || selectedConfig.basePrice || 10000000;
  } else if (priceMode === "project" && selectedProject) {
    derivedDefaultPrice = selectedProject.basePrice || 10000000;
  } else {
    derivedDefaultPrice = Number(customPriceInput) || 0;
  }

  const numericPrice = priceMode === "custom" ? (Number(customPriceInput) || 0) : derivedDefaultPrice;

  // Derive incentive based on project rule
  let calculatedIncentiveAmount = 0;
  let incentiveRuleLabel = "2.0% Standard Brokerage";

  if (selectedProject?.incentive) {
    if (selectedProject.incentive.type === "percentage") {
      calculatedIncentiveAmount = Math.round((numericPrice * selectedProject.incentive.value) / 100);
      incentiveRuleLabel = `${selectedProject.incentive.value}% (${selectedProject.incentive.label})`;
    } else {
      calculatedIncentiveAmount = selectedProject.incentive.value;
      incentiveRuleLabel = selectedProject.incentive.label;
    }
  } else {
    calculatedIncentiveAmount = Math.round((numericPrice * 2) / 100);
  }

  const formatCurrency = (val: number) => {
    if (isNaN(val) || !val) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProject) {
      alert("Project selection is mandatory for converting a lead.");
      return;
    }

    if (numericPrice <= 0) {
      alert("Final sale value is mandatory and must be greater than zero.");
      return;
    }

    const unitDetails = selectedConfig ? ` (${selectedConfig.name})` : "";

    const conversionData: LeadConversion = {
      projectId: selectedProject.id,
      projectName: `${selectedProject.name}${unitDetails}`,
      finalPrice: formatCurrency(numericPrice),
      numericFinalPrice: numericPrice,
      incentiveLabel: incentiveRuleLabel,
      calculatedIncentive: formatCurrency(calculatedIncentiveAmount),
      date: new Date().toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    onConvert(conversionData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: "540px" }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px" }}>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
              Close & Convert Lead (Mark as Won)
            </div>
            <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Finalize transaction details & compute broker incentive for <strong>{lead.name}</strong>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn-icon">
            <Icon name="x" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* 1. Project Selection (Mandatory, from dynamic Central Projects) */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Selected Real Estate Project <span style={{ color: "var(--danger)" }}>* (Mandatory)</span>
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                const proj = projects.find((p) => p.id === e.target.value);
                if (proj && proj.configurations && proj.configurations.length > 0) {
                  setSelectedConfigId(proj.configurations[0].id);
                }
              }}
              style={{
                width: "100%",
                padding: "9px 12px",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-surface)",
                fontSize: "14px",
                color: "var(--text-primary)",
              }}
            >
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name} ({proj.location} • {proj.projectType || proj.type})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Configuration / Unit Selection */}
          {projectConfigs.length > 0 && (
            <div>
              <label style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Selected Unit Configuration / Inventory Type
              </label>
              <select
                value={selectedConfigId || (projectConfigs[0]?.id ?? "")}
                onChange={(e) => setSelectedConfigId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface)",
                  fontSize: "13.5px",
                  color: "var(--text-primary)",
                }}
              >
                {projectConfigs.map((cfg) => (
                  <option key={cfg.id} value={cfg.id}>
                    {cfg.name} ({cfg.area} {cfg.areaUnit} • {formatCurrency(cfg.sellingPrice || cfg.basePrice)} • {cfg.availableQuantity} available)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 3. Final Price Options */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
              Final Transaction / Sale Value <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <div
              style={{
                display: "flex",
                backgroundColor: "var(--bg-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "3px",
                marginBottom: "10px",
                gap: "2px",
              }}
            >
              {projectConfigs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPriceMode("configuration")}
                  style={{
                    flex: 1,
                    padding: "7px 4px",
                    fontSize: "12px",
                    fontWeight: 600,
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: priceMode === "configuration" ? "var(--bg-surface)" : "transparent",
                    color: priceMode === "configuration" ? "var(--brand-primary)" : "var(--text-secondary)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Unit Config ({selectedConfig ? formatCurrency(selectedConfig.sellingPrice || selectedConfig.basePrice) : ""})
                </button>
              )}
              <button
                type="button"
                onClick={() => setPriceMode("project")}
                style={{
                  flex: 1,
                  padding: "7px 4px",
                  fontSize: "12px",
                  fontWeight: 600,
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: priceMode === "project" ? "var(--bg-surface)" : "transparent",
                  color: priceMode === "project" ? "var(--brand-primary)" : "var(--text-secondary)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Project Base ({selectedProject?.basePriceFormatted || formatCurrency(selectedProject?.basePrice || 0)})
              </button>
              <button
                type="button"
                onClick={() => setPriceMode("custom")}
                style={{
                  flex: 1,
                  padding: "7px 4px",
                  fontSize: "12px",
                  fontWeight: 600,
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: priceMode === "custom" ? "var(--bg-surface)" : "transparent",
                  color: priceMode === "custom" ? "var(--brand-primary)" : "var(--text-secondary)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Custom Price
              </button>
            </div>

            {priceMode === "custom" && (
              <div>
                <input
                  type="number"
                  required
                  min="100000"
                  step="50000"
                  placeholder="Enter final negotiated transaction price in ₹"
                  value={customPriceInput}
                  onChange={(e) => setCustomPriceInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "14px",
                    backgroundColor: "var(--bg-surface)",
                  }}
                />
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                  Entered Value: <strong>{formatCurrency(Number(customPriceInput) || 0)}</strong>
                </div>
              </div>
            )}
          </div>

          {/* 4. Automatic Incentive Calculation Card */}
          <div
            style={{
              padding: "14px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--success-light)",
              border: "1px solid var(--success-border)",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--success)", textTransform: "uppercase" }}>
              Project Incentive Calculation
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", fontSize: "13px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Final Sale Value:</span>
              <strong style={{ color: "var(--text-primary)" }}>{formatCurrency(numericPrice)}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px", fontSize: "13px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Project Incentive Rule:</span>
              <strong style={{ color: "var(--brand-primary)" }}>{incentiveRuleLabel}</strong>
            </div>

            <div
              style={{
                marginTop: "10px",
                paddingTop: "10px",
                borderTop: "1px dashed var(--success-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                Estimated Commission:
              </span>
              <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--success)" }}>
                {formatCurrency(calculatedIncentiveAmount)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1, padding: "10px" }}
            >
              Confirm Deal Won & Convert
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
