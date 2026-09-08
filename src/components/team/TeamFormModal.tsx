"use client";

import React, { useState } from "react";
import { Team, User, addTeamToStore, updateTeamInStore } from "@/data/teamData";
import { logActivity } from "@/utils/activityService";
import Icon from "@/components/Icon";

interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamToEdit?: Team | null;
  allUsers: User[];
  onSaved: (team: Team) => void;
}

export default function TeamFormModal({
  isOpen,
  onClose,
  teamToEdit,
  allUsers,
  onSaved,
}: TeamFormModalProps) {
  const [name, setName] = useState<string>(() => teamToEdit?.name || "");
  const [description, setDescription] = useState<string>(() => teamToEdit?.description || "");
  const [teamLeadUserId, setTeamLeadUserId] = useState<string>(() => teamToEdit?.teamLeadUserId || "");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
    () => teamToEdit?.memberUserIds || []
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleMember = (userId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedMemberIds(allUsers.map((u) => u.id));
  };

  const handleClearAll = () => {
    setSelectedMemberIds([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Please enter a team name.");
      return;
    }

    // Ensure team lead is included in members if selected
    const memberIds = teamLeadUserId && !selectedMemberIds.includes(teamLeadUserId)
      ? [...selectedMemberIds, teamLeadUserId]
      : selectedMemberIds;

    if (teamToEdit) {
      const updated: Team = {
        ...teamToEdit,
        name: name.trim(),
        description: description.trim(),
        teamLeadUserId: teamLeadUserId || undefined,
        memberUserIds: memberIds,
        updatedAt: new Date().toISOString(),
      };
      updateTeamInStore(updated);
      logActivity({
        action: "team_updated",
        module: "team",
        entityType: "team",
        entityId: updated.id,
        entityName: updated.name,
        type: "audit",
        metadata: { membersCount: memberIds.length },
      });
      onSaved(updated);
    } else {
      const created = addTeamToStore({
        name: name.trim(),
        description: description.trim(),
        teamLeadUserId: teamLeadUserId || undefined,
        memberUserIds: memberIds,
      });
      logActivity({
        action: "team_created",
        module: "team",
        entityType: "team",
        entityId: created.id,
        entityName: created.name,
        type: "audit",
        metadata: { membersCount: memberIds.length },
      });
      onSaved(created);
    }

    onClose();
  };

  return (
    <div className="modal-overlay-nested" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "600px" }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--brand-primary-light)",
                color: "var(--brand-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="building" size={18} />
            </div>
            <div>
              <h2 className="modal-header-title">
                {teamToEdit ? "Edit Team" : "Create Company Team"}
              </h2>
              <p className="modal-header-desc">
                Organize members by territory, project vertical, or department
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-icon"
            aria-label="Close modal"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          <div className="modal-body">
            {errorMessage && (
              <div className="form-error">
                {errorMessage}
              </div>
            )}

            {/* Team Name */}
            <div className="form-group">
              <label className="form-label">
                Team Name <span className="form-label-required">*</span>
              </label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. South Delhi Luxury Advisory, Commercial & Plots, Telecalling"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
              />
            </div>

            {/* Team Lead */}
            <div className="form-group">
              <label className="form-label">
                Designated Team Lead (Optional)
              </label>
              <select
                className="form-select"
                value={teamLeadUserId}
                onChange={(e) => setTeamLeadUserId(e.target.value)}
              >
                <option value="">Flat Structure / No specific lead</option>
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.jobTitle})
                  </option>
                ))}
              </select>
              <span className="form-hint">
                Team leads can view aggregated metrics and manage leads for their team.
              </span>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Team Scope / Description
              </label>
              <textarea
                rows={2}
                className="form-textarea"
                placeholder="Briefly describe territory or project focus..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Member Assignment */}
            <div className="form-group">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Assign Members ({selectedMemberIds.length} of {allUsers.length})
                </label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="btn-toolbar-action"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="btn-toolbar-action"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {allUsers.length > 0 ? (
                <div
                  style={{
                    maxHeight: "220px",
                    overflowY: "auto",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    padding: "4px 0",
                  }}
                >
                  {allUsers.map((user) => {
                    const isSelected = selectedMemberIds.includes(user.id);
                    return (
                      <div
                        key={user.id}
                        className="permission-item-row"
                        onClick={() => toggleMember(user.id)}
                        style={{ padding: "8px 12px" }}
                      >
                        <input
                          type="checkbox"
                          className="permission-checkbox"
                          checked={isSelected}
                          onChange={() => toggleMember(user.id)}
                          onClick={(e) => e.stopPropagation()}
                          id={`team-member-${user.id}`}
                        />
                        <label
                          htmlFor={`team-member-${user.id}`}
                          style={{ cursor: "pointer", flex: 1, minWidth: 0 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                            {user.name}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                            {user.jobTitle} &bull; {user.email}
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  No members available to assign. You can assign members after creating the team.
                </p>
              )}
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ minWidth: "130px" }}
            >
              {teamToEdit ? "Update Team" : "Save Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
