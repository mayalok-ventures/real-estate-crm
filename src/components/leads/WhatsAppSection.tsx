"use client";

import React, { useState } from "react";
import { Icon } from "@/components/Icon";
import {
  Lead,
  ProjectItem,
  WhatsAppTemplate,
  TemplateAttachment,
  getStoredProjects,
  getStoredWhatsAppTemplates,
} from "@/data/mockData";
import { ClientBrochureModal } from "@/components/common/ClientBrochureModal";

interface ChatMessage {
  id: string;
  sender: "agent" | "client";
  type: "text" | "project" | "offer";
  text?: string;
  project?: ProjectItem;
  offer?: { title: string; description: string };
  templateName?: string;
  attachments?: TemplateAttachment[];
  time: string;
}

interface WhatsAppSectionProps {
  lead: Lead;
}

let msgCounter = 0;
function generateMsgId(): string {
  msgCounter += 1;
  return `msg-${Date.now()}-${msgCounter}`;
}

export function WhatsAppSection({ lead }: WhatsAppSectionProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [inputText, setInputText] = useState("");
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerTitle, setOfferTitle] = useState("");
  const [offerDesc, setOfferDesc] = useState("");

  const [projects] = useState<ProjectItem[]>(() => getStoredProjects());
  const [templates] = useState<WhatsAppTemplate[]>(() => getStoredWhatsAppTemplates());

  const [brochureTarget, setBrochureTarget] = useState<ProjectItem | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "client",
      type: "text",
      text: `Hi, I saw your listing for ${lead.propertyInterest}. Is this ready for site visit?`,
      time: "10:15 AM",
    },
    {
      id: "msg-2",
      sender: "agent",
      type: "text",
      text: `Hello ${lead.name}! Yes, absolutely. We can arrange a walkthrough this week. Would 11:00 AM work best for you?`,
      time: "10:18 AM",
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: generateMsgId(),
      sender: "agent",
      type: "text",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
  };

  const handleSelectTemplate = (tmpl: WhatsAppTemplate) => {
    const filledText = tmpl.body
      .replace(/{client_name}/g, lead.name)
      .replace(/{project_name}/g, lead.projectName || lead.propertyInterest)
      .replace(/{location}/g, lead.location || "Bangalore")
      .replace(/{starting_price}/g, lead.budget || "Best market price")
      .replace(/{unit_type}/g, lead.interestType || "Apartment")
      .replace(/{visit_date}/g, lead.siteVisit?.date || "This Saturday")
      .replace(/{visit_time}/g, lead.siteVisit?.time || "11:00 AM")
      .replace(/{location_url}/g, "https://maps.google.com")
      .replace(/{broker_name}/g, "Rohan Verma")
      .replace(/{agency_name}/g, "Verma Realty")
      .replace(/{broker_phone}/g, "+91 98450 88776");

    const newMsg: ChatMessage = {
      id: generateMsgId(),
      sender: "agent",
      type: "text",
      text: filledText,
      templateName: tmpl.name,
      attachments: tmpl.attachments,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setShowTemplatesModal(false);
  };

  const handleSendProject = (project: ProjectItem) => {
    const newMsg: ChatMessage = {
      id: generateMsgId(),
      sender: "agent",
      type: "project",
      project,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setShowProjectModal(false);
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerTitle.trim()) return;

    const newMsg: ChatMessage = {
      id: generateMsgId(),
      sender: "agent",
      type: "offer",
      offer: {
        title: offerTitle.trim(),
        description: offerDesc.trim() || "Exclusive client incentive terms.",
      },
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setOfferTitle("");
    setOfferDesc("");
    setShowOfferModal(false);
  };

  const rawPhone = lead.phone.replace(/[^\d]/g, "");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Simulation Notice Banner */}
      <div
        style={{
          padding: "10px 14px",
          backgroundColor: isConnected ? "var(--success-light)" : "var(--bg-subtle)",
          borderRadius: "var(--radius-md)",
          border: `1px solid ${isConnected ? "var(--success-border)" : "var(--border-subtle)"}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>💬</span>
          <div>
            <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-primary)" }}>
              {isConnected ? "WhatsApp Session Connected (In-Browser Simulation)" : "WhatsApp CRM Simulation Standby"}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Official Meta Cloud API or persistent backend required for real external messaging. Direct wa.me integration is always available.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          <button
            type="button"
            onClick={() => setIsConnected(!isConnected)}
            className={`btn btn-sm ${isConnected ? "btn-secondary" : "btn-primary"}`}
            style={{ fontSize: "11.5px", padding: "4px 10px" }}
          >
            {isConnected ? "Disconnect" : "Connect Simulated Session"}
          </button>

          <a
            href={`https://wa.me/${rawPhone}?text=${encodeURIComponent(`Hello ${lead.name}, connecting from Verma Realty regarding your inquiry for ${lead.propertyInterest}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: "11.5px", padding: "4px 10px", color: "#25D366", display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            <Icon name="arrow-up-right" size={13} />
            <span>Open wa.me</span>
          </a>
        </div>
      </div>

      {/* WhatsApp Chat Card */}
      <div
        style={{
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#efeae2",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Chat Header */}
        <div
          style={{
            backgroundColor: "#075e54",
            color: "white",
            padding: "10px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                backgroundColor: "#25d366",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              {lead.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700 }}>{lead.name}</div>
              <div style={{ fontSize: "11px", opacity: 0.85 }}>{lead.phone} • Active prospect</div>
            </div>
          </div>

          <div style={{ fontSize: "11px", opacity: 0.9 }}>
            {isConnected ? "● Connected" : "○ Standby"}
          </div>
        </div>

        {/* Message Thread */}
        <div
          style={{
            flex: 1,
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            overflowY: "auto",
            maxHeight: "380px",
          }}
        >
          <div
            style={{
              alignSelf: "center",
              backgroundColor: "rgba(255,255,255,0.85)",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              color: "#54656f",
              marginBottom: "6px",
            }}
          >
            Messages simulated inside SAHYAK CRM. Generate client-facing PDF brochures below.
          </div>

          {messages.map((msg) => {
            const isAgent = msg.sender === "agent";
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: isAgent ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  backgroundColor: isAgent ? "#d9fdd3" : "#ffffff",
                  padding: "8px 12px",
                  borderRadius: isAgent ? "8px 0px 8px 8px" : "0px 8px 8px 8px",
                  boxShadow: "0 1px 1.5px rgba(0,0,0,0.12)",
                  color: "#111b21",
                  fontSize: "13px",
                  lineHeight: "1.4",
                }}
              >
                {/* Text Message */}
                {msg.type === "text" && <div style={{ whiteSpace: "pre-line" }}>{msg.text}</div>}

                {/* Project Message Card */}
                {msg.type === "project" && msg.project && (
                  <div
                    style={{
                      backgroundColor: "white",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      border: "1px solid #e0e0e0",
                      marginTop: "2px",
                    }}
                  >
                    <div style={{ fontSize: "10px", fontWeight: 800, color: "var(--brand-primary)", textTransform: "uppercase" }}>
                      Project Brochure Attachment
                    </div>
                    <div style={{ fontSize: "14.5px", fontWeight: 800, color: "#111827", marginTop: "2px" }}>
                      {msg.project.name}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#4b5563" }}>
                      By {msg.project.developer} • {msg.project.location}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "#047857", marginTop: "3px" }}>
                      {msg.project.startingPrice || msg.project.priceRange || msg.project.basePriceFormatted}
                    </div>
                    <div style={{ marginTop: "8px", display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={() => setBrochureTarget(msg.project || null)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: "11px", padding: "3px 8px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <Icon name="file-text" size={12} />
                        <span>Client Brochure (PDF)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Offer Message Card */}
                {msg.type === "offer" && msg.offer && (
                  <div
                    style={{
                      backgroundColor: "var(--brand-primary-light)",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid var(--brand-primary)",
                      marginTop: "2px",
                    }}
                  >
                    <div style={{ fontSize: "10.5px", fontWeight: 800, color: "var(--brand-primary)", textTransform: "uppercase" }}>
                      Special Broker Deal Offer
                    </div>
                    <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#111827", marginTop: "2px" }}>
                      {msg.offer.title}
                    </div>
                    <div style={{ fontSize: "12px", color: "#374151", marginTop: "2px" }}>
                      {msg.offer.description}
                    </div>
                  </div>
                )}

                {/* Attached Media with User-Defined Names */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div
                    style={{
                      marginTop: "8px",
                      paddingTop: "8px",
                      borderTop: "1px dashed rgba(0,0,0,0.15)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#075e54",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Icon name="file-text" size={12} />
                      <span>Attached Media ({msg.attachments.length})</span>
                    </div>
                    {msg.attachments.map((att) => (
                      <div
                        key={att.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: "rgba(255,255,255,0.75)",
                          padding: "5px 8px",
                          borderRadius: "4px",
                          fontSize: "11.5px",
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Icon
                            name={att.type === "image" ? "image" : att.type === "video" ? "video" : "file-text"}
                            size={13}
                          />
                          <span style={{ fontWeight: 600, color: "#111827" }}>{att.name}</span>
                        </div>
                        <span style={{ fontSize: "10px", color: "#6b7280" }}>
                          {att.type.toUpperCase()} • {typeof att.fileSize === "number" ? `${(att.fileSize / 1024).toFixed(0)}KB` : String(att.fileSize || att.fileName)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    fontSize: "10px",
                    color: "rgba(0,0,0,0.45)",
                    textAlign: "right",
                    marginTop: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "3px",
                  }}
                >
                  <span>{msg.time}</span>
                  {isAgent && <span style={{ color: "#53bdeb" }}>✓✓</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Action Toolbar */}
        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "#f0f2f5",
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            gap: "8px",
            overflowX: "auto",
          }}
        >
          <button
            type="button"
            onClick={() => setShowTemplatesModal(true)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: "11.5px", whiteSpace: "nowrap", padding: "4px 10px", backgroundColor: "white" }}
          >
            + Template
          </button>
          <button
            type="button"
            onClick={() => setShowProjectModal(true)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: "11.5px", whiteSpace: "nowrap", padding: "4px 10px", backgroundColor: "white" }}
          >
            + Project
          </button>
          <button
            type="button"
            onClick={() => setShowOfferModal(true)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: "11.5px", whiteSpace: "nowrap", padding: "4px 10px", backgroundColor: "white" }}
          >
            + Offer
          </button>
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={handleSendMessage}
          style={{
            padding: "8px 12px",
            backgroundColor: "#f0f2f5",
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <input
            type="text"
            placeholder={isConnected ? "Type a WhatsApp message..." : "Type simulated message or click wa.me above..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 14px",
              border: "1px solid #d1d7db",
              borderRadius: "20px",
              backgroundColor: "white",
              fontSize: "13.5px",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#00a884",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Icon name="arrow-up-right" size={16} />
          </button>
        </form>
      </div>

      {/* 1. Templates Modal */}
      {showTemplatesModal && (
        <div className="modal-overlay" onClick={() => setShowTemplatesModal(false)}>
          <div
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: "520px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                Select WhatsApp Template
              </div>
              <button
                type="button"
                onClick={() => setShowTemplatesModal(false)}
                className="btn-icon"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "400px", overflowY: "auto" }}>
              {templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className="card card-clickable"
                  style={{ padding: "12px", border: "1px solid var(--border-subtle)", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                      {tmpl.name}
                    </span>
                    <span className="badge badge-neutral" style={{ fontSize: "10.5px" }}>
                      {tmpl.category}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", whiteSpace: "pre-line", marginBottom: "6px" }}>
                    {tmpl.body.slice(0, 130)}...
                  </div>
                  {tmpl.attachments && tmpl.attachments.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                      {tmpl.attachments.map((att) => (
                        <span
                          key={att.id}
                          style={{
                            fontSize: "10.5px",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            backgroundColor: "var(--bg-subtle)",
                            border: "1px solid var(--border-subtle)",
                            color: "var(--brand-primary)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <Icon name={att.type === "image" ? "image" : att.type === "video" ? "video" : "file-text"} size={10} />
                          <span>{att.name}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Send Project Modal */}
      {showProjectModal && (
        <div className="modal-overlay" onClick={() => setShowProjectModal(false)}>
          <div
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: "500px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                Share Verified Project Brochure
              </div>
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="btn-icon"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "380px", overflowY: "auto" }}>
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => handleSendProject(proj)}
                  className="card card-clickable"
                  style={{ padding: "12px", border: "1px solid var(--border-subtle)", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {proj.name}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "var(--brand-primary)", fontWeight: 600 }}>
                        {proj.developer}
                      </div>
                    </div>
                    <span className="badge badge-success" style={{ fontSize: "11px" }}>
                      {proj.startingPrice || proj.priceRange || proj.basePriceFormatted}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {proj.location} • {proj.projectType || proj.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Send Offer Modal */}
      {showOfferModal && (
        <div className="modal-overlay" onClick={() => setShowOfferModal(false)}>
          <div
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: "460px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                Send Custom Deal Offer
              </div>
              <button
                type="button"
                onClick={() => setShowOfferModal(false)}
                className="btn-icon"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <form onSubmit={handleSendOffer} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  Offer Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Weekend Booking Discount: ₹1.5L Waiver"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "13.5px",
                    backgroundColor: "var(--bg-surface)",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  Offer Details & Conditions
                </label>
                <textarea
                  rows={3}
                  placeholder="Applicable on bookings done before Sunday 6 PM..."
                  value={offerDesc}
                  onChange={(e) => setOfferDesc(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "13.5px",
                    backgroundColor: "var(--bg-surface)",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Send Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Brochure PDF Modal */}
      {brochureTarget && (
        <ClientBrochureModal
          isOpen={Boolean(brochureTarget)}
          onClose={() => setBrochureTarget(null)}
          entityType="project"
          projectData={brochureTarget}
          clientName={lead.name}
          clientPhone={lead.phone}
        />
      )}
    </div>
  );
}
