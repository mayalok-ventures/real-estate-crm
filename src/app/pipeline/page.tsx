"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import {
  PipelineStage,
  Lead,
  getStoredPipelineStages,
  saveStoredPipelineStages,
  addPipelineStageToStore,
  updatePipelineStageInStore,
  deletePipelineStageFromStore,
  getStoredLeads,
  updateLeadInStore,
} from "@/data/mockData";

export default function PipelinePage() {
  const [stages, setStages] = useState<PipelineStage[]>(() => getStoredPipelineStages());
  const [leads, setLeads] = useState<Lead[]>(() => getStoredLeads());

  // Modal states
  const [showManageModal, setShowManageModal] = useState(false);
  const [editingStage, setEditingStage] = useState<PipelineStage | null>(null);
  const [isAddingStage, setIsAddingStage] = useState(false);

  // New stage form state
  const [newStageName, setNewStageName] = useState("");
  const [newStageDesc, setNewStageDesc] = useState("");
  const [newStageProbability, setNewStageProbability] = useState("20");
  const [newStageColor, setNewStageColor] = useState("#2563eb");

  // Error / Toast alert
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showAlert = (type: "success" | "error", text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Move lead to another stage
  const handleMoveLead = (lead: Lead, targetStageId: string) => {
    const updatedLead: Lead = {
      ...lead,
      pipelineStage: targetStageId,
      activities: [
        ...(lead.activities || []),
        {
          id: `act-${lead.id}-${Date.now()}`,
          title: `Moved to ${stages.find((s) => s.id === targetStageId)?.name || targetStageId}`,
          time: "Just now",
          type: "followup",
        },
      ],
    };
    const updatedAll = updateLeadInStore(updatedLead);
    setLeads(updatedAll);
    showAlert("success", `Moved ${lead.name} to ${stages.find((s) => s.id === targetStageId)?.name || targetStageId}`);
  };

  // Stage Management Handlers
  const handleMoveStageOrder = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stages.length) return;

    const reordered = [...stages];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    saveStoredPipelineStages(reordered);
    setStages(reordered);
  };

  const handleCreateStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;

    const newStage: PipelineStage = {
      id: `stage-${Date.now()}`,
      name: newStageName.trim(),
      description: newStageDesc.trim() || undefined,
      probability: Number(newStageProbability) || 20,
      color: newStageColor,
      leadCount: 0,
      totalValue: "₹0",
      order: stages.length + 1,
    };

    const updated = addPipelineStageToStore(newStage);
    setStages(updated);
    setIsAddingStage(false);
    setNewStageName("");
    setNewStageDesc("");
    showAlert("success", `Stage "${newStage.name}" added successfully.`);
  };

  const handleUpdateStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStage) return;

    const updated = updatePipelineStageInStore(editingStage);
    setStages(updated);
    setEditingStage(null);
    showAlert("success", `Stage "${editingStage.name}" updated.`);
  };

  const handleDeleteStage = (stageId: string) => {
    const res = deletePipelineStageFromStore(stageId);
    if (!res.success) {
      showAlert("error", res.message || "Cannot delete stage with active leads.");
      return;
    }
    setStages(res.updatedStages);
    showAlert("success", "Stage removed safely.");
  };

  // Group leads by stage
  const leadsByStage: Record<string, Lead[]> = {};
  for (const stage of stages) {
    leadsByStage[stage.id] = leads.filter((l) => (l.pipelineStage || "new") === stage.id);
  }

  // Any orphaned leads whose pipelineStage does not match any current stage
  const orphanedLeads = leads.filter(
    (l) => l.pipelineStage && !stages.some((s) => s.id === l.pipelineStage)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Alert Banner */}
      {alertMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: alertMessage.type === "error" ? "var(--danger, #dc2626)" : "var(--brand-primary)",
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
            maxWidth: "90%",
          }}
        >
          <span>{alertMessage.type === "error" ? "⚠️" : "✔"}</span>
          <span>{alertMessage.text}</span>
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
            Sales Pipeline
          </h1>
          <p className="page-subtitle" style={{ margin: "4px 0 0 0" }}>
            Track real estate deal progression from first inquiry to registry
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span className="badge badge-success" style={{ padding: "6px 12px", fontSize: "12.5px" }}>
            {leads.length} Active Leads Managed
          </span>

          <button
            type="button"
            onClick={() => setShowManageModal(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Icon name="sliders" size={14} />
            <span>Manage Stages</span>
          </button>
        </div>
      </div>

      {/* Orphaned Leads Warning if any */}
      {orphanedLeads.length > 0 && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--warning-light, #fef3c7)",
            border: "1px solid var(--warning, #f59e0b)",
            color: "#92400e",
            fontSize: "12.5px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            ⚠️ Found <strong>{orphanedLeads.length}</strong> lead(s) mapped to decommissioned stages.
          </span>
          <button
            type="button"
            onClick={() => {
              orphanedLeads.forEach((l) => handleMoveLead(l, stages[0]?.id || "new"));
            }}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: "11px", padding: "3px 8px" }}
          >
            Migrate to {stages[0]?.name || "First Stage"}
          </button>
        </div>
      )}

      {/* Pipeline Kanban Board Container */}
      <div
        style={{
          display: "flex",
          gap: "14px",
          overflowX: "auto",
          paddingBottom: "16px",
          scrollSnapType: "x mandatory",
        }}
      >
        {stages.map((stage) => {
          const stageLeads = leadsByStage[stage.id] || [];

          return (
            <div
              key={stage.id}
              style={{
                flex: "0 0 285px",
                scrollSnapAlign: "start",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                flexDirection: "column",
                maxHeight: "calc(100vh - 210px)",
              }}
            >
              {/* Stage Column Header */}
              <div
                style={{
                  padding: "12px 14px",
                  borderBottom: "1px solid var(--border-subtle)",
                  borderTop: `4px solid ${stage.color}`,
                  borderTopLeftRadius: "var(--radius-lg)",
                  borderTopRightRadius: "var(--radius-lg)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
                    {stage.name}
                  </div>
                  {stage.probability !== undefined && (
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
                      Probability: {stage.probability}% {stage.description ? `• ${stage.description}` : ""}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    backgroundColor: "var(--bg-subtle)",
                    color: "var(--text-secondary)",
                    fontWeight: 700,
                    fontSize: "12px",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-full)",
                  }}
                >
                  {stageLeads.length}
                </span>
              </div>

              {/* Stage Cards Container */}
              <div
                style={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  overflowY: "auto",
                  flex: 1,
                }}
              >
                {stageLeads.length > 0 ? (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      style={{
                        padding: "12px",
                        backgroundColor: "var(--bg-app)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-md)",
                        boxShadow: "var(--shadow-xs)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Link
                          href={`/leads/${lead.id}`}
                          style={{
                            fontWeight: 700,
                            fontSize: "13.5px",
                            color: "var(--text-primary)",
                            textDecoration: "none",
                          }}
                        >
                          {lead.name}
                        </Link>
                        <span
                          className={`badge ${
                            lead.status === "Hot"
                              ? "badge-danger"
                              : lead.status === "Warm"
                              ? "badge-warning"
                              : lead.status === "Converted"
                              ? "badge-success"
                              : "badge-info"
                          }`}
                          style={{ fontSize: "10px", padding: "1px 5px" }}
                        >
                          {lead.status}
                        </span>
                      </div>

                      <div style={{ fontSize: "12px", color: "var(--brand-primary)", fontWeight: 600 }}>
                        {lead.propertyInterest}
                      </div>

                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        {lead.phone} {lead.location ? `• ${lead.location}` : ""}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                          {lead.budget}
                        </span>

                        {/* Quick Stage Move Dropdown */}
                        <select
                          value={stage.id}
                          onChange={(e) => handleMoveLead(lead, e.target.value)}
                          style={{
                            fontSize: "11px",
                            padding: "2px 6px",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--border-subtle)",
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--text-secondary)",
                            cursor: "pointer",
                          }}
                        >
                          {stages.map((s) => (
                            <option key={s.id} value={s.id}>
                              Move: {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "24px 12px",
                      textAlign: "center",
                      color: "var(--text-muted)",
                      fontSize: "12px",
                      border: "1px dashed var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    No active deals in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manage Pipeline Stages Modal */}
      {showManageModal && (
        <div className="modal-overlay" onClick={() => setShowManageModal(false)}>
          <div
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: "600px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <div style={{ fontSize: "16.5px", fontWeight: 800, color: "var(--text-primary)" }}>
                  Pipeline Stages Configuration
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Configure sales milestones, probabilities, and sequence order safely.
                </div>
              </div>
              <button type="button" onClick={() => setShowManageModal(false)} className="btn btn-secondary btn-sm">
                ✕
              </button>
            </div>

            {/* Stages List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "360px", overflowY: "auto", marginBottom: "16px" }}>
              {stages.map((stg, index) => {
                const leadCount = (leadsByStage[stg.id] || []).length;
                return (
                  <div
                    key={stg.id}
                    style={{
                      padding: "10px 14px",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--bg-surface)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: stg.color,
                        }}
                      />
                      <div>
                        <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                          {index + 1}. {stg.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          Probability: {stg.probability || 0}% • {leadCount} Active Lead(s)
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {/* Reorder Buttons */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveStageOrder(index, "up")}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "3px 6px", fontSize: "11px" }}
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={index === stages.length - 1}
                        onClick={() => handleMoveStageOrder(index, "down")}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "3px 6px", fontSize: "11px" }}
                        title="Move Down"
                      >
                        ▼
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => setEditingStage(stg)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "3px 8px", fontSize: "11.5px" }}
                      >
                        Edit
                      </button>

                      {/* Safe Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteStage(stg.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "3px 8px", fontSize: "11.5px", color: "var(--danger)" }}
                        title={leadCount > 0 ? "Cannot delete stage with leads" : "Delete Stage"}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Stage Toggle Form */}
            {!isAddingStage && !editingStage && (
              <button
                type="button"
                onClick={() => setIsAddingStage(true)}
                className="btn btn-primary btn-sm"
                style={{ width: "100%" }}
              >
                + Add Pipeline Stage
              </button>
            )}

            {/* Inline Add Stage Form */}
            {isAddingStage && (
              <form onSubmit={handleCreateStage} style={{ padding: "12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-subtle)" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>Add New Stage</div>
                <div className="grid-2" style={{ gap: "8px", marginBottom: "8px" }}>
                  <input
                    type="text"
                    required
                    placeholder="Stage Name (e.g. Legal Verification)"
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    style={{ padding: "7px 10px", fontSize: "12.5px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Win Probability %"
                    value={newStageProbability}
                    onChange={(e) => setNewStageProbability(e.target.value)}
                    style={{ padding: "7px 10px", fontSize: "12.5px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                  <input
                    type="text"
                    placeholder="Short description..."
                    value={newStageDesc}
                    onChange={(e) => setNewStageDesc(e.target.value)}
                    style={{ flex: 1, padding: "7px 10px", fontSize: "12.5px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}
                  />
                  <input
                    type="color"
                    value={newStageColor}
                    onChange={(e) => setNewStageColor(e.target.value)}
                    style={{ width: "36px", height: "32px", border: "none", cursor: "pointer" }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                  <button type="button" onClick={() => setIsAddingStage(false)} className="btn btn-secondary btn-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save Stage
                  </button>
                </div>
              </form>
            )}

            {/* Inline Edit Stage Form */}
            {editingStage && (
              <form onSubmit={handleUpdateStage} style={{ padding: "12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-subtle)" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>Edit Stage: {editingStage.name}</div>
                <div className="grid-2" style={{ gap: "8px", marginBottom: "8px" }}>
                  <input
                    type="text"
                    required
                    value={editingStage.name}
                    onChange={(e) => setEditingStage({ ...editingStage, name: e.target.value })}
                    style={{ padding: "7px 10px", fontSize: "12.5px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingStage.probability || 0}
                    onChange={(e) => setEditingStage({ ...editingStage, probability: Number(e.target.value) })}
                    style={{ padding: "7px 10px", fontSize: "12.5px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                  <input
                    type="text"
                    placeholder="Short description..."
                    value={editingStage.description || ""}
                    onChange={(e) => setEditingStage({ ...editingStage, description: e.target.value })}
                    style={{ flex: 1, padding: "7px 10px", fontSize: "12.5px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}
                  />
                  <input
                    type="color"
                    value={editingStage.color}
                    onChange={(e) => setEditingStage({ ...editingStage, color: e.target.value })}
                    style={{ width: "36px", height: "32px", border: "none", cursor: "pointer" }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                  <button type="button" onClick={() => setEditingStage(null)} className="btn btn-secondary btn-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Update Stage
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
