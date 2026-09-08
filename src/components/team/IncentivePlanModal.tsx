"use client";

import React, { useState } from "react";
import { IncentivePlan, addIncentivePlanToStore, updateIncentivePlanInStore } from "@/data/teamData";
import { logActivity } from "@/utils/activityService";
import Icon from "@/components/Icon";

interface IncentivePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  planToEdit?: IncentivePlan | null;
  onSaved: (plan: IncentivePlan) => void;
}

export default function IncentivePlanModal({
  isOpen,
  onClose,
  planToEdit,
  onSaved,
}: IncentivePlanModalProps) {
  const [name, setName] = useState<string>(() => planToEdit?.name || "");
  const [description, setDescription] = useState<string>(() => planToEdit?.description || "");
  const [type, setType] = useState<IncentivePlan["type"]>(() => planToEdit?.type || "fixed");

  // Rule parameters
  const [fixedAmount, setFixedAmount] = useState<number>(() => planToEdit?.rules.fixedAmountPerDeal || 5000);
  const [dealPercentage, setDealPercentage] = useState<number>(() => planToEdit?.rules.percentageOfDealValue || 1.5);
  const [brokeragePercentage, setBrokeragePercentage] = useState<number>(() => planToEdit?.rules.percentageOfBrokerage || 10);
  const [targetAmount, setTargetAmount] = useState<number>(() => planToEdit?.rules.targetAmount || 10000000);
  const [targetIncentive, setTargetIncentive] = useState<number>(() => planToEdit?.rules.targetIncentiveAmount || 25000);
  const customNote = planToEdit?.rules.customNote || "";
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Please enter an incentive plan name.");
      return;
    }

    const rules: IncentivePlan["rules"] = {};
    if (type === "fixed") rules.fixedAmountPerDeal = Number(fixedAmount);
    if (type === "deal_percentage") rules.percentageOfDealValue = Number(dealPercentage);
    if (type === "commission_percentage") rules.percentageOfBrokerage = Number(brokeragePercentage);
    if (type === "target") {
      rules.targetAmount = Number(targetAmount);
      rules.targetIncentiveAmount = Number(targetIncentive);
    }
    if (type === "slab") {
      rules.slabs = [
        { minDeals: 1, maxDeals: 3, amountPerDeal: 2500 },
        { minDeals: 4, maxDeals: 7, amountPerDeal: 4000 },
        { minDeals: 8, maxDeals: null, amountPerDeal: 6000 },
      ];
    }
    if (type === "custom") rules.customNote = customNote;

    if (planToEdit) {
      const updated: IncentivePlan = {
        ...planToEdit,
        name: name.trim(),
        description: description.trim(),
        type,
        rules,
        updatedAt: new Date().toISOString(),
      };
      updateIncentivePlanInStore(updated);
      logActivity({
        action: "incentive_plan_updated",
        module: "team",
        entityType: "incentive_plan",
        entityId: updated.id,
        entityName: updated.name,
        type: "audit",
      });
      onSaved(updated);
    } else {
      const created = addIncentivePlanToStore({
        name: name.trim(),
        description: description.trim(),
        type,
        rules,
        status: "active",
      });
      logActivity({
        action: "incentive_plan_created",
        module: "team",
        entityType: "incentive_plan",
        entityId: created.id,
        entityName: created.name,
        type: "audit",
      });
      onSaved(created);
    }

    onClose();
  };

  const planTypes: { id: IncentivePlan["type"]; label: string; desc: string }[] = [
    { id: "fixed", label: "Fixed Amount", desc: "Fixed rupee payout per converted deal" },
    { id: "commission_percentage", label: "% of Brokerage", desc: "Share of gross company brokerage earned" },
    { id: "deal_percentage", label: "% of Deal Value", desc: "Percentage of total property agreement value" },
    { id: "target", label: "Target Bonus", desc: "Lump-sum bonus upon reaching volume milestone" },
    { id: "slab", label: "Tiered Slabs", desc: "Accelerating rate based on monthly deals closed" },
  ];

  return (
    <div className="modal-overlay-nested" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "620px" }}
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
                {planToEdit ? "Edit Incentive Plan" : "Create Incentive Structure"}
              </h2>
              <p className="modal-header-desc">
                Reusable commission & bonus templates assignable to any member
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

            {/* Plan Name */}
            <div className="form-group">
              <label className="form-label">
                Plan Name <span className="form-label-required">*</span>
              </label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Standard Consultant Commission, Senior Closer Bonus, Telecaller Spiff"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
              />
            </div>

            {/* Calculation Model / Type */}
            <div className="form-group">
              <label className="form-label">
                Calculation Model
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "8px" }}>
                {planTypes.map((pt) => {
                  const isSelected = type === pt.id;
                  return (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => setType(pt.id)}
                      style={{
                        padding: "10px 12px",
                        textAlign: "left",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${isSelected ? "var(--brand-primary)" : "var(--border-subtle)"}`,
                        backgroundColor: isSelected ? "var(--brand-primary-light)" : "var(--bg-surface)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ fontSize: "12px", fontWeight: 700, color: isSelected ? "var(--brand-primary)" : "var(--text-primary)" }}>
                        {pt.label}
                      </div>
                      <div style={{ fontSize: "10.5px", color: "var(--text-secondary)", marginTop: "2px", lineHeight: 1.3 }}>
                        {pt.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Type-Specific Parameters */}
            <div
              style={{
                padding: "14px 16px",
                backgroundColor: "var(--bg-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {type === "fixed" && (
                <div className="form-group">
                  <label className="form-label">
                    Payout per Booked Deal (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    className="form-input"
                    value={fixedAmount}
                    onChange={(e) => setFixedAmount(Number(e.target.value))}
                  />
                  <span className="form-hint">
                    Every closed deal credited to this member awards ₹{fixedAmount?.toLocaleString("en-IN")}.
                  </span>
                </div>
              )}

              {type === "commission_percentage" && (
                <div className="form-group">
                  <label className="form-label">
                    Brokerage Share (% of company fee)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    className="form-input"
                    value={brokeragePercentage}
                    onChange={(e) => setBrokeragePercentage(Number(e.target.value))}
                  />
                  <span className="form-hint">
                    Member earns {brokeragePercentage}% of the total commission invoiced to the developer/buyer.
                  </span>
                </div>
              )}

              {type === "deal_percentage" && (
                <div className="form-group">
                  <label className="form-label">
                    Agreement Value Share (% of property price)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    className="form-input"
                    value={dealPercentage}
                    onChange={(e) => setDealPercentage(Number(e.target.value))}
                  />
                  <span className="form-hint">
                    Example: On a ₹1 Cr unit, {dealPercentage}% awards ₹{((10000000 * dealPercentage) / 100).toLocaleString("en-IN")}.
                  </span>
                </div>
              )}

              {type === "target" && (
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Sales Volume Target (₹)
                    </label>
                    <input
                      type="number"
                      step={1000000}
                      className="form-input"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Lump-Sum Bonus (₹)
                    </label>
                    <input
                      type="number"
                      step={5000}
                      className="form-input"
                      value={targetIncentive}
                      onChange={(e) => setTargetIncentive(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}

              {type === "slab" && (
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                    Standard Accelerator Slabs
                  </div>
                  <ul style={{ paddingLeft: "18px", margin: 0, lineHeight: 1.6 }}>
                    <li>1 to 3 deals closed: <strong>₹2,500 per deal</strong></li>
                    <li>4 to 7 deals closed: <strong>₹4,000 per deal</strong></li>
                    <li>8+ deals closed: <strong>₹6,000 per deal</strong></li>
                  </ul>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Plan Description / Terms
              </label>
              <textarea
                rows={2}
                className="form-textarea"
                placeholder="Disbursement timeline, criteria, or eligibility notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              className="btn btn-primary btn-sm"
              style={{ minWidth: "130px" }}
            >
              {planToEdit ? "Update Plan" : "Save Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
