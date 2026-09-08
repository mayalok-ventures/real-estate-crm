"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import {
  Lead,
  MOCK_AGENTS,
  MOCK_PIPELINE_STAGES,
  ProjectItem,
  getStoredProjects,
  LeadConversion,
  CallRecordingItem,
} from "@/data/mockData";
import { FollowUpSection } from "./FollowUpSection";
import { WhatsAppSection } from "./WhatsAppSection";
import { ConvertLeadModal } from "./ConvertLeadModal";
import { LeadForm } from "./LeadForm";

interface LeadProfileProps {
  initialLead: Lead;
  onUpdateLead: (updatedLead: Lead) => void;
}

let idCounter = 0;
function generateUniqueId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

export function LeadProfile({ initialLead, onUpdateLead }: LeadProfileProps) {
  const [lead, setLead] = useState<Lead>(initialLead);
  const [activeTab, setActiveTab] = useState<"overview" | "followup" | "whatsapp" | "notes_audio" | "conversion">("overview");
  const [projectCatalog] = useState<ProjectItem[]>(() => getStoredProjects());

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showSiteVisitModal, setShowSiteVisitModal] = useState(false);

  // New Note state
  const [newNoteText, setNewNoteText] = useState("");

  // Site Visit state
  const [visitDate, setVisitDate] = useState(lead.siteVisit?.date || "");
  const [visitTime, setVisitTime] = useState(lead.siteVisit?.time || "");
  const [visitNotes, setVisitNotes] = useState(lead.siteVisit?.notes || "");

  // Audio object URLs cleanup tracker
  const createdObjectUrlsRef = useRef<string[]>([]);

  // Clean up object URLs on component unmount
  useEffect(() => {
    const urls = createdObjectUrlsRef.current;
    return () => {
      urls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // Safe ignore
        }
      });
    };
  }, []);

  const handleUpdate = (updated: Lead) => {
    setLead(updated);
    onUpdateLead(updated);
  };

  // Agent Transfer
  const handleTransferAgent = (agentName: string) => {
    const updated: Lead = {
      ...lead,
      assignedTo: agentName,
      activities: [
        ...(lead.activities || []),
        {
          id: generateUniqueId("act"),
          title: `Lead Reassigned to ${agentName}`,
          time: "Just now",
          type: "assigned",
        },
      ],
    };
    handleUpdate(updated);
    setShowTransferModal(false);
  };

  // Pipeline Stage Change
  const handleStageChange = (stageId: string) => {
    const stageObj = MOCK_PIPELINE_STAGES.find((s) => s.id === stageId);
    const updated: Lead = {
      ...lead,
      pipelineStage: stageId,
      status: stageId === "converted" ? "Converted" : lead.status,
      activities: [
        ...(lead.activities || []),
        {
          id: generateUniqueId("act"),
          title: `Pipeline Stage Advanced to "${stageObj?.name || stageId}"`,
          time: "Just now",
          type: "assigned",
        },
      ],
    };
    handleUpdate(updated);
  };

  // Add Custom Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote = {
      id: generateUniqueId("note"),
      text: newNoteText.trim(),
      date: new Date().toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      author: lead.assignedTo || "Rohan Verma",
    };

    const updated: Lead = {
      ...lead,
      notesList: [newNote, ...(lead.notesList || [])],
      activities: [
        ...(lead.activities || []),
        {
          id: generateUniqueId("act"),
          title: `New Note Added: "${newNoteText.trim().slice(0, 30)}..."`,
          time: "Just now",
          type: "note",
        },
      ],
    };

    handleUpdate(updated);
    setNewNoteText("");
  };

  // Audio Upload
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    createdObjectUrlsRef.current.push(objectUrl);

    const newRecording: CallRecordingItem = {
      id: generateUniqueId("rec"),
      name: file.name,
      url: objectUrl,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      date: new Date().toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updated: Lead = {
      ...lead,
      recordings: [newRecording, ...(lead.recordings || [])],
      activities: [
        ...(lead.activities || []),
        {
          id: generateUniqueId("act"),
          title: `Call Audio Uploaded: "${file.name}"`,
          time: "Just now",
          type: "audio",
        },
      ],
    };

    handleUpdate(updated);
    // Reset file input
    e.target.value = "";
  };

  // Site Visit Schedule
  const handleSiteVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitDate || !visitTime) {
      alert("Both Date and Time are mandatory for scheduling a Site Visit.");
      return;
    }

    const updated: Lead = {
      ...lead,
      siteVisit: {
        scheduled: true,
        date: visitDate,
        time: visitTime,
        notes: visitNotes.trim() || undefined,
      },
      pipelineStage: lead.pipelineStage === "new" || lead.pipelineStage === "contacted" ? "sitevisit" : lead.pipelineStage,
      activities: [
        ...(lead.activities || []),
        {
          id: generateUniqueId("act"),
          title: `Site Visit Booked for ${visitDate} at ${visitTime}`,
          time: "Just now",
          type: "sitevisit",
        },
      ],
    };

    handleUpdate(updated);
    setShowSiteVisitModal(false);
  };

  // Convert Lead
  const handleConvertLead = (conversionData: LeadConversion) => {
    const updated: Lead = {
      ...lead,
      status: "Converted",
      pipelineStage: "converted",
      conversion: conversionData,
      activities: [
        ...(lead.activities || []),
        {
          id: generateUniqueId("act"),
          title: `Lead Converted (Won): ${conversionData.finalPrice} at ${conversionData.projectName}`,
          time: "Just now",
          type: "converted",
        },
      ],
    };

    handleUpdate(updated);
  };

  const badgeClass =
    lead.status === "Hot"
      ? "badge-danger"
      : lead.status === "Warm"
      ? "badge-warning"
      : lead.status === "Qualified"
      ? "badge-success"
      : lead.status === "Converted"
      ? "badge-success"
      : "badge-info";

  const rawPhone = lead.phone.replace(/[^0-9]/g, "");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Top Navigation Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <Link
          href="/leads"
          className="btn btn-secondary btn-sm"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <Icon name="arrow-left" size={14} />
          <span>Back to Leads Directory</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {lead.status === "Converted" ? (
            <span className="badge badge-success" style={{ fontSize: "12px", padding: "6px 12px" }}>
              Deal Converted (Won)
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setShowConvertModal(true)}
              className="btn btn-primary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Icon name="check" size={14} />
              <span>Convert Lead</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            <Icon name="edit" size={14} />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* Conversion Banner if Won */}
      {lead.conversion && (
        <div
          className="card"
          style={{
            padding: "16px 20px",
            backgroundColor: "var(--success-light)",
            border: "1px solid var(--success-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--success)", textTransform: "uppercase" }}>
              CLOSED DEAL WON
            </div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", marginTop: "2px" }}>
              {lead.conversion.projectName} • {lead.conversion.finalPrice}
            </div>
            <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Closed on {lead.conversion.date} • Rule: {lead.conversion.incentiveLabel}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Earned Broker Incentive</div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--success)" }}>
              {lead.conversion.calculatedIncentive}
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Lead Profile Header Card */}
      <div className="card" style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                {lead.name}
              </h1>
              <span className={`badge ${badgeClass}`} style={{ fontSize: "12px" }}>
                {lead.status}
              </span>
              <span className="badge badge-neutral" style={{ fontSize: "12px" }}>
                {lead.source}
              </span>
            </div>

            <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--brand-primary)", marginTop: "6px" }}>
              {lead.propertyInterest}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px" }}>
              {lead.location && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Icon name="map-pin" size={14} />
                  <span>{lead.location}</span>
                </div>
              )}
              {lead.interestType && (
                <>
                  <span>•</span>
                  <span>Type: {lead.interestType}</span>
                </>
              )}
              {lead.projectName && (
                <>
                  <span>•</span>
                  <span>Catalog: <strong>{lead.projectName}</strong></span>
                </>
              )}
              <span>•</span>
              <span>Captured {lead.createdAt}</span>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Client Budget</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--brand-primary)" }}>
              {lead.budget}
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div
          style={{
            marginTop: "16px",
            paddingTop: "14px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
            {lead.phone}
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <a
              href={`tel:${lead.phone}`}
              className="btn btn-secondary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <Icon name="phone" size={14} />
              <span>Call Client</span>
            </a>

            <a
              href={`https://wa.me/${rawPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <Icon name="message-circle" size={14} />
              <span>External WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => setActiveTab("whatsapp")}
              className="btn btn-primary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <Icon name="message-circle" size={14} />
              <span>Open CRM Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Lead Assignment / Transfer Bar */}
      <div
        className="card"
        style={{
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          backgroundColor: "var(--bg-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "var(--brand-primary-light)",
              color: "var(--brand-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "12.5px",
            }}
          >
            {lead.assignedTo?.slice(0, 2).toUpperCase() || "RV"}
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Assigned Advisor
            </div>
            <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)" }}>
              {lead.assignedTo || "Rohan Verma"}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTransferModal(true)}
          className="btn btn-secondary btn-sm"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px", backgroundColor: "var(--bg-surface)" }}
        >
          <Icon name="users" size={14} />
          <span>Transfer Lead</span>
        </button>
      </div>

      {/* Section 7: Pipeline Stepper Bar */}
      <div className="card" style={{ padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
            Sales Pipeline Progression
          </div>
          <span className="badge badge-info" style={{ fontSize: "11.5px" }}>
            Stage: {MOCK_PIPELINE_STAGES.find((s) => s.id === lead.pipelineStage)?.name || "New Inquiry"}
          </span>
        </div>

        {/* Progression Track */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {MOCK_PIPELINE_STAGES.map((stage, idx) => {
            const currentStageIndex = MOCK_PIPELINE_STAGES.findIndex((s) => s.id === (lead.pipelineStage || "new"));
            const isPassedOrCurrent = idx <= currentStageIndex;
            const isCurrent = stage.id === lead.pipelineStage;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => handleStageChange(stage.id)}
                title={`Advance to ${stage.name}`}
                style={{
                  flex: 1,
                  minWidth: "100px",
                  padding: "8px 6px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "11px",
                  fontWeight: 700,
                  backgroundColor: isCurrent
                    ? "var(--brand-primary)"
                    : isPassedOrCurrent
                    ? "var(--brand-primary-light)"
                    : "var(--bg-subtle)",
                  color: isCurrent
                    ? "white"
                    : isPassedOrCurrent
                    ? "var(--brand-primary)"
                    : "var(--text-muted)",
                  border: isCurrent
                    ? "1px solid var(--brand-primary)"
                    : "1px solid var(--border-subtle)",
                  cursor: "pointer",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                {idx + 1}. {stage.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div
        style={{
          display: "flex",
          backgroundColor: "var(--bg-subtle)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          padding: "3px",
          overflowX: "auto",
          gap: "3px",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          style={{
            flex: 1,
            minWidth: "115px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: activeTab === "overview" ? 600 : 500,
            borderRadius: "var(--radius-sm)",
            backgroundColor: activeTab === "overview" ? "var(--bg-surface)" : "transparent",
            color: activeTab === "overview" ? "var(--brand-primary)" : "var(--text-secondary)",
            boxShadow: activeTab === "overview" ? "var(--shadow-sm)" : "none",
            border: "none",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.15s ease",
          }}
        >
          Overview & Timeline
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("followup")}
          style={{
            flex: 1,
            minWidth: "115px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: activeTab === "followup" ? 600 : 500,
            borderRadius: "var(--radius-sm)",
            backgroundColor: activeTab === "followup" ? "var(--bg-surface)" : "transparent",
            color: activeTab === "followup" ? "var(--brand-primary)" : "var(--text-secondary)",
            boxShadow: activeTab === "followup" ? "var(--shadow-sm)" : "none",
            border: "none",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.15s ease",
          }}
        >
          Follow-up & Visits
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("whatsapp")}
          style={{
            flex: 1,
            minWidth: "110px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: activeTab === "whatsapp" ? 600 : 500,
            borderRadius: "var(--radius-sm)",
            backgroundColor: activeTab === "whatsapp" ? "var(--bg-surface)" : "transparent",
            color: activeTab === "whatsapp" ? "var(--brand-primary)" : "var(--text-secondary)",
            boxShadow: activeTab === "whatsapp" ? "var(--shadow-sm)" : "none",
            border: "none",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.15s ease",
          }}
        >
          WhatsApp Chat
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notes_audio")}
          style={{
            flex: 1,
            minWidth: "125px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: activeTab === "notes_audio" ? 600 : 500,
            borderRadius: "var(--radius-sm)",
            backgroundColor: activeTab === "notes_audio" ? "var(--bg-surface)" : "transparent",
            color: activeTab === "notes_audio" ? "var(--brand-primary)" : "var(--text-secondary)",
            boxShadow: activeTab === "notes_audio" ? "var(--shadow-sm)" : "none",
            border: "none",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.15s ease",
          }}
        >
          Notes & Audio ({lead.notesList?.length || 0})
        </button>
      </div>

      {/* Tab 1: Overview & Activity Timeline */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Key Facts Summary */}
          <div className="grid-2">
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
                Property & Requirement Profile
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Target Configuration:</span>
                  <strong style={{ color: "var(--text-primary)" }}>{lead.interestType || "Not Specified"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Preferred Area:</span>
                  <strong style={{ color: "var(--text-primary)" }}>{lead.location || "General Bangalore"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Associated Project:</span>
                  <strong style={{ color: "var(--text-primary)" }}>{lead.projectName || "General Inquiry"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Budget Limit:</span>
                  <strong style={{ color: "var(--brand-primary)" }}>{lead.budget}</strong>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
                Lead Intake & Source Details
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Acquisition Source:</span>
                  <strong style={{ color: "var(--text-primary)" }}>{lead.source}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Created Timestamp:</span>
                  <strong style={{ color: "var(--text-primary)" }}>{lead.createdAt}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Advisor In-charge:</span>
                  <strong style={{ color: "var(--text-primary)" }}>{lead.assignedTo || "Rohan Verma"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Deal Status:</span>
                  <strong style={{ color: "var(--text-primary)" }}>{lead.status}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="card" style={{ padding: "16px" }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "14px" }}>
              Lead Activity Timeline
            </div>

            {lead.activities && lead.activities.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderLeft: "2px solid var(--border-subtle)", paddingLeft: "16px", marginLeft: "8px" }}>
                {lead.activities.map((act) => (
                  <div key={act.id} style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "-22px",
                        top: "2px",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "var(--brand-primary)",
                      }}
                    />
                    <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {act.title}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                      {act.time}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>No activities recorded yet.</div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Follow-up & Site Visits */}
      {activeTab === "followup" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Section 3: Follow-up Management */}
          <FollowUpSection lead={lead} onUpdateLead={handleUpdate} />

          {/* Section 8: Site Visit Management */}
          <div className="card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icon name="map-pin" size={18} />
                  <span>Site Visit Schedule</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Schedule and manage physical on-site property walkthroughs
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSiteVisitModal(true)}
                className="btn btn-primary btn-sm"
                style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <Icon name="plus" size={14} />
                <span>{lead.siteVisit?.scheduled ? "Reschedule Visit" : "Schedule Visit"}</span>
              </button>
            </div>

            {lead.siteVisit?.scheduled ? (
              <div
                style={{
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--info-light)",
                  border: "1px solid var(--info-border)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="badge badge-info" style={{ fontSize: "11px" }}>
                    Site Visit Confirmed
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--info)" }}>
                    {lead.siteVisit.date} at {lead.siteVisit.time}
                  </span>
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginTop: "6px" }}>
                  Project: {lead.projectName || lead.propertyInterest}
                </div>
                {lead.siteVisit.notes && (
                  <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Notes: {lead.siteVisit.notes}
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-subtle)",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  textAlign: "center",
                }}
              >
                No property site visit is currently scheduled for {lead.name}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: WhatsApp CRM Chat */}
      {activeTab === "whatsapp" && <WhatsAppSection lead={lead} />}

      {/* Tab 4: Custom Notes & Audio Recordings */}
      {activeTab === "notes_audio" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Section 4: Custom Notes */}
          <div className="card" style={{ padding: "16px" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>
              Advisor Notes ({lead.notesList?.length || 0})
            </div>

            <form onSubmit={handleAddNote} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
              <textarea
                rows={3}
                required
                placeholder="Type a new client note (e.g. Buyer preferences, family feedback, loan status, or specific floor requirement)..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  fontSize: "13.5px",
                  lineHeight: "1.4",
                  backgroundColor: "var(--bg-surface)",
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn btn-primary btn-sm">
                  + Add Note
                </button>
              </div>
            </form>

            {/* Notes List */}
            {lead.notesList && lead.notesList.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {lead.notesList.map((note) => (
                  <div
                    key={note.id}
                    style={{
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--bg-subtle)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div style={{ fontSize: "13.5px", color: "var(--text-primary)", lineHeight: "1.4" }}>
                      {note.text}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px", display: "flex", justifyContent: "space-between" }}>
                      <span>Author: {note.author}</span>
                      <span>{note.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "10px 0" }}>
                No notes logged yet.
              </div>
            )}
          </div>

          {/* Section 6: Call Audio Recordings */}
          <div className="card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Call Audio Recordings ({lead.recordings?.length || 0})
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Attach existing call recordings (.mp3, .wav, .m4a) for verification and review
                </div>
              </div>

              <label className="btn btn-secondary btn-sm" style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Icon name="plus" size={14} />
                <span>Upload Audio</span>
                <input
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a"
                  onChange={handleAudioUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {lead.recordings && lead.recordings.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {lead.recordings.map((rec) => (
                  <div
                    key={rec.id}
                    style={{
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--bg-subtle)",
                      border: "1px solid var(--border-subtle)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                      <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {rec.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        {rec.size} • {rec.date}
                      </div>
                    </div>

                    {rec.url ? (
                      <audio controls src={rec.url} style={{ width: "100%", height: "36px" }}>
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontStyle: "italic" }}>
                        Pre-loaded discovery call metadata (Upload audio to test native player playback)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "16px 0" }}>
                No call recordings uploaded for this lead yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODALS --- */}

      {/* 1. Edit Lead Modal (Reusing LeadForm in edit mode) */}
      <LeadForm
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        initialLead={lead}
        onUpdateLead={handleUpdate}
        mode="edit"
      />

      {/* 2. Transfer Lead / Change Advisor Modal */}
      {showTransferModal && (
        <div className="modal-overlay" onClick={() => setShowTransferModal(false)}>
          <div
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: "440px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                Transfer Lead Ownership
              </div>
              <button type="button" onClick={() => setShowTransferModal(false)} className="btn-icon">
                <Icon name="x" size={18} />
              </button>
            </div>

            <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginBottom: "14px" }}>
              Select a licensed property consultant to assign <strong>{lead.name}</strong>:
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {MOCK_AGENTS.map((agent) => (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => handleTransferAgent(agent.name)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: lead.assignedTo === agent.name ? "var(--brand-primary-light)" : "var(--bg-surface)",
                    border: `1px solid ${lead.assignedTo === agent.name ? "var(--brand-primary)" : "var(--border-subtle)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                      {agent.name}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                      {agent.role}
                    </div>
                  </div>
                  {lead.assignedTo === agent.name && (
                    <span className="badge badge-success" style={{ fontSize: "10.5px" }}>
                      Current Owner
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Site Visit Modal */}
      {showSiteVisitModal && (
        <div className="modal-overlay" onClick={() => setShowSiteVisitModal(false)}>
          <div
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: "460px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                Book Property Site Visit
              </div>
              <button type="button" onClick={() => setShowSiteVisitModal(false)} className="btn-icon">
                <Icon name="x" size={18} />
              </button>
            </div>

            <form onSubmit={handleSiteVisitSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="grid-2">
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Visit Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "13px",
                      backgroundColor: "var(--bg-surface)",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Exact Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "13px",
                      backgroundColor: "var(--bg-surface)",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  Selected Catalog Project
                </label>
                <select
                  defaultValue={lead.projectId || projectCatalog[0]?.id || ""}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "13px",
                    backgroundColor: "var(--bg-surface)",
                  }}
                >
                  {projectCatalog.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.location} • {p.projectType || p.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  Visit Notes & Party Details
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Client visiting with family, key needed from site sales office"
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "13px",
                    backgroundColor: "var(--bg-surface)",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Confirm Site Visit
                </button>
                <button type="button" onClick={() => setShowSiteVisitModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Convert Lead Modal */}
      <ConvertLeadModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        lead={lead}
        onConvert={handleConvertLead}
      />
    </div>
  );
}
