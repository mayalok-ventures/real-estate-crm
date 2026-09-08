"use client";

import React, { useState } from "react";
import { Icon } from "@/components/Icon";
import {
  ProjectItem,
  ProductConfiguration,
  getStoredBrokerProfile,
} from "@/data/mockData";

export interface ClientBrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: "project" | "product";
  projectData?: ProjectItem;
  productConfigData?: ProductConfiguration;
  parentProject?: ProjectItem;
  clientName?: string;
  clientPhone?: string;
}

export function ClientBrochureModal({
  isOpen,
  onClose,
  entityType,
  projectData,
  productConfigData,
  parentProject,
  clientName,
  clientPhone,
}: ClientBrochureModalProps) {
  const brokerProfile = getStoredBrokerProfile();
  const [copySuccess, setCopySuccess] = useState(false);

  // Direct compliance and dataset validation without cascading effects
  let validationError = "";
  if (entityType === "project" && !projectData) {
    validationError = "Missing Project dataset. Unable to compile client brochure.";
  } else if (entityType === "product" && (!productConfigData || !parentProject)) {
    validationError = "Missing Product Configuration or Parent Project record.";
  } else {
    const targetTitle =
      entityType === "project"
        ? projectData?.name
        : productConfigData?.name;
    if (!targetTitle || !targetTitle.trim()) {
      validationError = "Entity name is missing or invalid.";
    }
  }

  if (!isOpen) return null;

  const handlePrintPdf = () => {
    window.print();
  };

  const generateWhatsAppText = (): string => {
    const broker = brokerProfile;
    const recipient = clientName ? `Hello ${clientName}` : "Hello";

    if (entityType === "project" && projectData) {
      return (
        `${recipient},\n\n` +
        `Sharing the verified client brochure for *${projectData.name}* by ${projectData.developer}.\n\n` +
        `📍 *Location:* ${projectData.location}\n` +
        `💰 *Pricing:* ${projectData.startingPrice || projectData.priceRange}\n` +
        `📐 *Inventory:* ${projectData.availableUnits} unit(s) available\n` +
        (projectData.reraNumber ? `🏛️ *RERA:* ${projectData.reraNumber}\n\n` : "\n") +
        `Key Highlights:\n` +
        (projectData.highlights?.slice(0, 3).map((h) => `• ${h}`).join("\n") || "• Prime high-growth corridor") +
        `\n\nPlease let me know when you would like to schedule an on-site walkthrough.\n\n` +
        `Best regards,\n*${broker.fullName}*\n${broker.agencyName}\n📞 ${broker.phone}`
      );
    }

    if (entityType === "product" && productConfigData && parentProject) {
      return (
        `${recipient},\n\n` +
        `Here are the verified configuration specifications for *${productConfigData.name}* at *${parentProject.name}*:\n\n` +
        `📐 *Super Built-up Area:* ${productConfigData.area} ${productConfigData.areaUnit}\n` +
        `🏷️ *Unit Type:* ${productConfigData.type}\n` +
        `💰 *Offer Price:* ₹${(productConfigData.sellingPrice || productConfigData.basePrice).toLocaleString("en-IN")}\n` +
        `📍 *Location:* ${parentProject.location}\n\n` +
        `Would you like me to share the detailed floor layout plan?\n\n` +
        `Best regards,\n*${broker.fullName}*\n${broker.agencyName}`
      );
    }

    return "Sharing real estate property details.";
  };

  const handleShareWhatsAppDirect = () => {
    const text = encodeURIComponent(generateWhatsAppText());
    let rawPhone = "";
    if (clientPhone) {
      rawPhone = clientPhone.replace(/[^\d]/g, "");
    }
    const targetUrl = rawPhone
      ? `https://wa.me/${rawPhone}?text=${text}`
      : `https://wa.me/?text=${text}`;

    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyText = () => {
    const text = generateWhatsAppText();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
    >
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-brochure-sheet, #printable-brochure-sheet * {
            visibility: visible;
          }
          #printable-brochure-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          maxHeight: "92vh",
          backgroundColor: "var(--bg-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-xl)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <div
          className="no-print"
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "var(--bg-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                display: "inline-flex",
                padding: "6px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--brand-primary-light)",
                color: "var(--brand-primary)",
              }}
            >
              <Icon name="file-text" size={18} />
            </span>
            <div>
              <div style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                Client-Facing Executive Brochure
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                Prepared for: {clientName || "Prospective Client"} • {brokerProfile.agencyName}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: "4px 8px" }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {/* Error State */}
          {validationError && (
            <div
              style={{
                padding: "24px",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--danger-light, #fee2e2)",
                border: "1px solid var(--danger, #ef4444)",
                color: "var(--danger, #b91c1c)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: 800, marginBottom: "6px" }}>
                Brochure Validation Notice
              </div>
              <p style={{ fontSize: "13.5px", marginBottom: "16px" }}>{validationError}</p>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            </div>
          )}

          {/* Ready State: Luxury Client-Facing Brochure Presentation Sheet */}
          {!validationError && (
            <div
              id="printable-brochure-sheet"
              style={{
                backgroundColor: "#ffffff",
                color: "#1e293b",
                border: "1px solid #e2e8f0",
                borderRadius: "var(--radius-lg)",
                padding: "24px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
                fontFamily: "var(--font-sans, system-ui, -apple-system, sans-serif)",
              }}
            >
              {/* Executive Gold/Navy Top Branding Bar */}
              <div
                style={{
                  borderBottom: "2px solid #0f172a",
                  paddingBottom: "14px",
                  marginBottom: "18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      fontWeight: 800,
                      color: "#b45309",
                    }}
                  >
                    Confidential Client Memorandum
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginTop: "2px" }}>
                    {brokerProfile.agencyName}
                  </div>
                  {brokerProfile.reraNumber && (
                    <div style={{ fontSize: "11px", color: "#64748b" }}>
                      RERA Broker ID: {brokerProfile.reraNumber}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>
                    Exclusively Presented For:
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                    {clientName || "Valued Investor"}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>
                    Advisor: {brokerProfile.fullName} • {brokerProfile.phone}
                  </div>
                </div>
              </div>

              {/* Entity-Specific Content */}
              {entityType === "project" && projectData && (
                <div>
                  {/* Hero Title & Pricing */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
                    <div>
                      <div style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a" }}>
                        {projectData.name}
                      </div>
                      <div style={{ fontSize: "13.5px", color: "#475569", marginTop: "2px" }}>
                        By <strong>{projectData.developer}</strong> • {projectData.location}
                      </div>
                      {projectData.reraNumber && (
                        <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>
                          Project RERA: <strong>{projectData.reraNumber}</strong>
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                        Investment Starting At
                      </div>
                      <div style={{ fontSize: "22px", fontWeight: 800, color: "#047857" }}>
                        {projectData.startingPrice || projectData.priceRange}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "#64748b" }}>
                        Status: <strong>{projectData.status || projectData.projectStatus}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#334155", marginBottom: "18px", backgroundColor: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    {projectData.description || projectData.shortDescription || "Premium high-grade real estate asset in prime growth sector."}
                  </p>

                  {/* Highlights Grid */}
                  {projectData.highlights && projectData.highlights.length > 0 && (
                    <div style={{ marginBottom: "18px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#0f172a", marginBottom: "8px" }}>
                        Strategic Property Highlights
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px" }}>
                        {projectData.highlights.map((h, i) => (
                          <div key={i} style={{ fontSize: "12px", color: "#1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ color: "#047857", fontWeight: 800 }}>✔</span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Product Configurations Table */}
                  {projectData.configurations && projectData.configurations.length > 0 && (
                    <div style={{ marginBottom: "18px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#0f172a", marginBottom: "8px" }}>
                        Configuration & Inventory Availability
                      </div>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#0f172a", color: "#ffffff" }}>
                              <th style={{ padding: "8px 10px", textAlign: "left" }}>Unit Type</th>
                              <th style={{ padding: "8px 10px", textAlign: "left" }}>Carpet / Super Area</th>
                              <th style={{ padding: "8px 10px", textAlign: "center" }}>Available</th>
                              <th style={{ padding: "8px 10px", textAlign: "right" }}>Offer Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projectData.configurations.map((cfg) => (
                              <tr key={cfg.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                <td style={{ padding: "8px 10px", fontWeight: 600 }}>{cfg.name}</td>
                                <td style={{ padding: "8px 10px" }}>{cfg.area} {cfg.areaUnit}</td>
                                <td style={{ padding: "8px 10px", textAlign: "center", color: cfg.availableQuantity > 0 ? "#047857" : "#ef4444", fontWeight: 700 }}>
                                  {cfg.availableQuantity} of {cfg.quantity} Units
                                </td>
                                <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700 }}>
                                  ₹{(cfg.sellingPrice || cfg.basePrice).toLocaleString("en-IN")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Amenities List */}
                  {projectData.amenities && projectData.amenities.length > 0 && (
                    <div style={{ marginBottom: "18px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#0f172a", marginBottom: "6px" }}>
                        Community Amenities
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {projectData.amenities.map((amenity, i) => (
                          <span key={i} style={{ fontSize: "11px", padding: "3px 8px", backgroundColor: "#f1f5f9", borderRadius: "4px", color: "#334155", border: "1px solid #e2e8f0" }}>
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Product Configuration Brochure Content */}
              {entityType === "product" && productConfigData && parentProject && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
                    <div>
                      <div style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a" }}>
                        {productConfigData.name}
                      </div>
                      <div style={{ fontSize: "13.5px", color: "#475569" }}>
                        In <strong>{parentProject.name}</strong> • {parentProject.location}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                        Special Offer Price
                      </div>
                      <div style={{ fontSize: "22px", fontWeight: 800, color: "#047857" }}>
                        ₹{(productConfigData.sellingPrice || productConfigData.basePrice).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "18px" }}>
                    <div style={{ padding: "10px", backgroundColor: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>Area & Dimension</div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                        {productConfigData.area} {productConfigData.areaUnit}
                      </div>
                    </div>
                    <div style={{ padding: "10px", backgroundColor: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>Category</div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                        {productConfigData.type}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#334155", marginBottom: "18px" }}>
                    {productConfigData.description || parentProject.description}
                  </p>
                </div>
              )}

              {/* Verified Broker Seal & Legal Disclaimer */}
              <div
                style={{
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: "14px",
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  flexWrap: "wrap",
                  gap: "12px",
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                <div>
                  <div>Issued by: <strong>{brokerProfile.agencyName}</strong></div>
                  <div>Address: {brokerProfile.address || "Bangalore Real Estate Advisory Hub"}</div>
                  <div>Email: {brokerProfile.email} • Direct: {brokerProfile.phone}</div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: "#047857" }}>✔ Verified Inventory Listing</div>
                  <div>Prices subject to statutory registration, stamp duty, & GST as applicable.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        {!validationError && (
          <div
            className="no-print"
            style={{
              padding: "12px 20px",
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              backgroundColor: "var(--bg-subtle)",
            }}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={handlePrintPdf}
                className="btn btn-secondary btn-sm"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Icon name="printer" size={15} />
                <span>Print / Save as PDF</span>
              </button>

              <button
                type="button"
                onClick={handleCopyText}
                className="btn btn-secondary btn-sm"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Icon name="copy" size={15} />
                <span>{copySuccess ? "Copied!" : "Copy Summary"}</span>
              </button>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={handleShareWhatsAppDirect}
                className="btn btn-primary btn-sm"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#25D366",
                  borderColor: "#25D366",
                  color: "white",
                  fontWeight: 700,
                }}
              >
                <Icon name="message-circle" size={16} />
                <span>Send via WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
