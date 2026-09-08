"use client";

import React, { useState } from "react";
import { User, IncentivePlan, assignIncentiveToUser } from "@/data/teamData";
import { logActivity } from "@/utils/activityService";
import Icon from "@/components/Icon";

interface AssignIncentiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  allPlans: IncentivePlan[];
  currentPlanId?: string;
  onAssigned: () => void;
}

export default function AssignIncentiveModal({
  isOpen,
  onClose,
  user,
  allPlans,
  currentPlanId,
  onAssigned,
}: AssignIncentiveModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(() => currentPlanId || allPlans[0]?.id || "");
  const [effectiveFrom, setEffectiveFrom] = useState<string>(() => new Date().toISOString().split("T")[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId) return;

    assignIncentiveToUser(user.id, selectedPlanId, effectiveFrom);
    const plan = allPlans.find((p) => p.id === selectedPlanId);

    logActivity({
      action: "incentive_assigned",
      module: "team",
      entityType: "user",
      entityId: user.id,
      entityName: user.name,
      type: "audit",
      metadata: {
        incentivePlanId: selectedPlanId,
        incentivePlanName: plan?.name,
        effectiveFrom,
      },
    });

    onAssigned();
    onClose();
  };

  return (
    <div className="modal-overlay-nested" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "520px" }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--success-light)",
                color: "var(--success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="award" size={18} />
            </div>
            <div>
              <h2 className="modal-header-title">
                Assign Incentive Structure
              </h2>
              <p className="modal-header-desc">
                For {user.name} ({user.jobTitle})
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
            <div className="form-group">
              <label className="form-label">
                Select Incentive Plan
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "260px", overflowY: "auto" }}>
                {allPlans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <label
                      key={plan.id}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${isSelected ? "var(--brand-primary)" : "var(--border-subtle)"}`,
                        backgroundColor: isSelected ? "var(--brand-primary-light)" : "var(--bg-surface)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <input
                        type="radio"
                        name="assignIncentiveRadio"
                        checked={isSelected}
                        onChange={() => setSelectedPlanId(plan.id)}
                        style={{ marginTop: "3px" }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                            {plan.name}
                          </span>
                          <span className="badge badge-success" style={{ fontSize: "9.5px", textTransform: "uppercase" }}>
                            {plan.type.replace("_", " ")}
                          </span>
                        </div>
                        {plan.description && (
                          <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                            {plan.description}
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Effective Date
              </label>
              <input
                type="date"
                value={effectiveFrom}
                onChange={(e) => setEffectiveFrom(e.target.value)}
                className="form-input"
              />
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
              disabled={!selectedPlanId}
              className="btn btn-primary btn-sm"
              style={{ minWidth: "140px" }}
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
