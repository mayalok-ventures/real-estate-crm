"use client";

import React, { useState } from "react";
import { Icon } from "@/components/Icon";
import { MOCK_FOLLOW_UPS, FollowUpItem } from "@/data/mockData";

export default function FollowUpsPage() {
  const [activeTab, setActiveTab] = useState<"overdue" | "today" | "upcoming">("today");
  const [followUps, setFollowUps] = useState<FollowUpItem[]>(MOCK_FOLLOW_UPS);

  // Reschedule state
  const [rescheduleTarget, setRescheduleTarget] = useState<FollowUpItem | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");

  // Close / Cancel state
  const [closeTarget, setCloseTarget] = useState<FollowUpItem | null>(null);
  const [closeReason, setCloseReason] = useState("");

  const overdueItems = followUps.filter((f) => f.dateType === "overdue");
  const todayItems = followUps.filter((f) => f.dateType === "today");
  const upcomingItems = followUps.filter((f) => f.dateType === "upcoming");

  const currentItems =
    activeTab === "overdue"
      ? overdueItems
      : activeTab === "today"
      ? todayItems
      : upcomingItems;

  const handleOpenReschedule = (item: FollowUpItem) => {
    setRescheduleTarget(item);
    setRescheduleDate(new Date().toISOString().split("T")[0]);
    setRescheduleTime("11:00");
    setRescheduleReason("");
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTarget) return;

    if (!rescheduleDate || !rescheduleTime) {
      alert("Both New Date and Time are mandatory for rescheduling.");
      return;
    }

    if (!rescheduleReason.trim()) {
      alert("Mandatory: You must provide a reason for rescheduling this follow-up.");
      return;
    }

    setFollowUps((prev) =>
      prev.map((item) =>
        item.id === rescheduleTarget.id
          ? {
              ...item,
              time: `${rescheduleDate} at ${rescheduleTime}`,
              dateType: "upcoming",
              notes: `${item.notes} | Rescheduled: "${rescheduleReason.trim()}"`,
            }
          : item
      )
    );

    setRescheduleTarget(null);
  };

  const handleOpenClose = (item: FollowUpItem) => {
    setCloseTarget(item);
    setCloseReason("");
  };

  const handleCloseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closeTarget) return;

    if (!closeReason.trim()) {
      alert("Mandatory: You must enter a reason / note to close or cancel this follow-up.");
      return;
    }

    setFollowUps((prev) => prev.filter((item) => item.id !== closeTarget.id));
    setCloseTarget(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 className="page-title">Follow-ups Schedule</h1>
          <p className="page-subtitle">Never drop an inquiry — manage call reminders and client tasks</p>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          backgroundColor: "var(--bg-subtle)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          padding: "3px",
          gap: "4px",
          marginBottom: "var(--space-4)",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("overdue")}
          style={{
            flex: 1,
            padding: "7px 10px",
            fontSize: "12.5px",
            fontWeight: activeTab === "overdue" ? 600 : 500,
            borderRadius: "var(--radius-sm)",
            backgroundColor: activeTab === "overdue" ? "var(--danger-light)" : "transparent",
            color: activeTab === "overdue" ? "var(--danger)" : "var(--text-secondary)",
            boxShadow: activeTab === "overdue" ? "var(--shadow-sm)" : "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <span>Overdue</span>
          <span
            style={{
              padding: "1px 6px",
              borderRadius: "var(--radius-full)",
              backgroundColor: activeTab === "overdue" ? "var(--danger)" : "var(--danger-light)",
              color: activeTab === "overdue" ? "white" : "var(--danger)",
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            {overdueItems.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("today")}
          style={{
            flex: 1,
            padding: "7px 10px",
            fontSize: "12.5px",
            fontWeight: activeTab === "today" ? 600 : 500,
            borderRadius: "var(--radius-sm)",
            backgroundColor: activeTab === "today" ? "var(--brand-primary-light)" : "transparent",
            color: activeTab === "today" ? "var(--brand-primary)" : "var(--text-secondary)",
            boxShadow: activeTab === "today" ? "var(--shadow-sm)" : "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <span>Today</span>
          <span
            style={{
              padding: "1px 6px",
              borderRadius: "var(--radius-full)",
              backgroundColor: activeTab === "today" ? "var(--brand-primary)" : "var(--brand-primary-light)",
              color: activeTab === "today" ? "white" : "var(--brand-primary)",
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            {todayItems.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          style={{
            flex: 1,
            padding: "7px 10px",
            fontSize: "12.5px",
            fontWeight: activeTab === "upcoming" ? 600 : 500,
            borderRadius: "var(--radius-sm)",
            backgroundColor: activeTab === "upcoming" ? "var(--bg-surface)" : "transparent",
            color: activeTab === "upcoming" ? "var(--text-primary)" : "var(--text-secondary)",
            boxShadow: activeTab === "upcoming" ? "var(--shadow-sm)" : "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <span>Upcoming</span>
          <span
            style={{
              padding: "1px 6px",
              borderRadius: "var(--radius-full)",
              backgroundColor: activeTab === "upcoming" ? "var(--border-subtle)" : "var(--bg-surface)",
              color: "var(--text-secondary)",
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            {upcomingItems.length}
          </span>
        </button>
      </div>

      {/* Follow-up Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {currentItems.length > 0 ? (
          currentItems.map((item: FollowUpItem) => {
            const rawPhone = item.phone.replace(/[^0-9]/g, "");
            return (
              <div
                key={item.id}
                className="card"
                style={{
                  padding: "16px",
                  borderLeft: `4px solid ${
                    item.dateType === "overdue"
                      ? "var(--danger)"
                      : item.priority === "High"
                      ? "var(--warning)"
                      : "var(--brand-primary)"
                  }`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {item.clientName}
                      </span>
                      <span className={`badge ${item.priority === "High" ? "badge-danger" : "badge-neutral"}`}>
                        {item.priority} Priority
                      </span>
                    </div>
                    <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      Property: <strong>{item.property}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span
                      className={`badge ${
                        item.dateType === "overdue"
                          ? "badge-danger"
                          : item.dateType === "today"
                          ? "badge-warning"
                          : "badge-info"
                      }`}
                    >
                      {item.time}
                    </span>
                  </div>
                </div>

                {/* Note */}
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    backgroundColor: "var(--bg-subtle)",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    marginBottom: "12px",
                  }}
                >
                  Agenda: {item.notes}
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{item.phone}</span>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <a
                      href={`tel:${item.phone}`}
                      className="btn btn-primary btn-sm"
                      style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      <Icon name="phone" size={13} />
                      <span>Call Now</span>
                    </a>
                    <a
                      href={`https://wa.me/${rawPhone}?text=${encodeURIComponent(`Hello ${item.clientName}, following up regarding your property requirement for ${item.property}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      <Icon name="message-circle" size={13} />
                      <span>WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleOpenReschedule(item)}
                      className="btn btn-secondary btn-sm"
                    >
                      Reschedule
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenClose(item)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: "var(--danger)", borderColor: "var(--danger-border)" }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
            No follow-ups found for this tab.
          </div>
        )}
      </div>

      {/* Reschedule Modal with Mandatory Reason */}
      {rescheduleTarget && (
        <div className="modal-overlay" onClick={() => setRescheduleTarget(null)}>
          <div
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: "460px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                Reschedule Follow-up
              </div>
              <button
                type="button"
                onClick={() => setRescheduleTarget(null)}
                className="btn-icon"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginBottom: "12px" }}>
              Client: <strong>{rescheduleTarget.clientName}</strong> • Property: <strong>{rescheduleTarget.property}</strong>
            </div>

            <form onSubmit={handleRescheduleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  New Follow-up Date <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
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
                  New Time <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="time"
                  required
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
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
                <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                  Reason for Rescheduling <span style={{ color: "var(--danger)" }}>* (Mandatory)</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Client requested callback on Saturday morning, out of station..."
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "13.5px",
                    lineHeight: "1.4",
                    backgroundColor: "var(--bg-surface)",
                  }}
                />
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                  A follow-up cannot be rescheduled without providing a reason.
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Confirm Reschedule
                </button>
                <button
                  type="button"
                  onClick={() => setRescheduleTarget(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Close / Cancel Modal with Mandatory Reason */}
      {closeTarget && (
        <div className="modal-overlay" onClick={() => setCloseTarget(null)}>
          <div
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: "480px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--danger)" }}>
                Close / Cancel Follow-up
              </div>
              <button
                type="button"
                onClick={() => setCloseTarget(null)}
                className="btn-icon"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginBottom: "12px" }}>
              Client: <strong>{closeTarget.clientName}</strong> • Property: <strong>{closeTarget.property}</strong>
            </div>

            <form onSubmit={handleCloseSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                  Reason / Note for Closing <span style={{ color: "var(--danger)" }}>* (Mandatory)</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Client purchased another property, no longer interested, or deal completed..."
                  value={closeReason}
                  onChange={(e) => setCloseReason(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "13.5px",
                    lineHeight: "1.4",
                    backgroundColor: "var(--bg-surface)",
                  }}
                />
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                  Documenting the reason is mandatory to close or cancel this follow-up.
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button type="submit" className="btn btn-danger" style={{ flex: 1 }}>
                  Confirm Close
                </button>
                <button
                  type="button"
                  onClick={() => setCloseTarget(null)}
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
