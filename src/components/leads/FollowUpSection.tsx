"use client";

import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@/components/Icon";
import { Lead, FollowUpHistoryItem } from "@/data/mockData";

interface FollowUpSectionProps {
  lead: Lead;
  onUpdateLead: (updatedLead: Lead) => void;
}

export function FollowUpSection({ lead, onUpdateLead }: FollowUpSectionProps) {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(lead.followUp?.date || "");
  const [scheduleTime, setScheduleTime] = useState(lead.followUp?.time || "");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [completionNote, setCompletionNote] = useState("");
  const [dueAlertLead, setDueAlertLead] = useState<Lead | null>(null);

  // Track if this follow-up has already triggered an in-app alert to avoid duplicate alarms
  const alertedIdsRef = useRef<Set<string>>(new Set());

  // Web Audio native chime synthesizer (Zero external dependencies)
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // Audio autoplay policy might restrict without prior interaction; safely ignored
    }
  };

  // Check for due follow-up on mount or state change
  useEffect(() => {
    if (lead.followUp?.required && lead.followUp.date && lead.followUp.time) {
      const followUpKey = `${lead.id}-${lead.followUp.date}-${lead.followUp.time}`;
      // Trigger in-app alert if date includes "Today" or matching date and not already alerted
      const isDue = lead.followUp.date.toLowerCase().includes("today") || lead.followUp.date.toLowerCase().includes("yesterday");
      if (isDue && !alertedIdsRef.current.has(followUpKey)) {
        alertedIdsRef.current.add(followUpKey);
        setDueAlertLead(lead);
        playChime();
      }
    }
  }, [lead]);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleDate || !scheduleTime) {
      alert("Both Date and Time are mandatory for scheduling a follow-up.");
      return;
    }

    const isReschedule = Boolean(lead.followUp?.required);
    if (isReschedule && !rescheduleReason.trim()) {
      alert("Mandatory: You must provide a reason for rescheduling this follow-up.");
      return;
    }

    const activityTitle = isReschedule
      ? `Follow-up Rescheduled to ${scheduleDate} at ${scheduleTime}. Reason: "${rescheduleReason.trim()}"`
      : `Follow-up Scheduled for ${scheduleDate} at ${scheduleTime}`;

    const updatedLead: Lead = {
      ...lead,
      followUp: {
        required: true,
        date: scheduleDate,
        time: scheduleTime,
      },
      noFollowUpReason: undefined,
      activities: [
        ...(lead.activities || []),
        {
          id: `act-${Date.now()}`,
          title: activityTitle,
          time: "Just now",
          type: "followup",
        },
      ],
    };

    onUpdateLead(updatedLead);
    setRescheduleReason("");
    setShowScheduleModal(false);
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      alert("Mandatory: You must provide a reason / note to close or cancel this follow-up.");
      return;
    }

    const newHistoryItem: FollowUpHistoryItem = {
      id: `fuh-${Date.now()}`,
      date: lead.followUp?.date || "Today",
      time: lead.followUp?.time || "Scheduled",
      note: `Closed/Cancelled: ${cancelReason.trim()}`,
      completedAt: new Date().toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedLead: Lead = {
      ...lead,
      followUp: {
        required: false,
      },
      noFollowUpReason: cancelReason.trim(),
      followUpHistory: [newHistoryItem, ...(lead.followUpHistory || [])],
      activities: [
        ...(lead.activities || []),
        {
          id: `act-${Date.now()}`,
          title: `Follow-up Closed / Cancelled: "${cancelReason.trim().slice(0, 35)}..."`,
          time: "Just now",
          type: "followup",
        },
      ],
    };

    onUpdateLead(updatedLead);
    setCancelReason("");
    setShowCancelModal(false);
    setDueAlertLead(null);
  };

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completionNote.trim()) {
      alert("Mandatory: You must enter a follow-up outcome note to mark it complete.");
      return;
    }

    const newHistoryItem: FollowUpHistoryItem = {
      id: `fuh-${Date.now()}`,
      date: lead.followUp?.date || "Today",
      time: lead.followUp?.time || "Scheduled",
      note: completionNote.trim(),
      completedAt: new Date().toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedLead: Lead = {
      ...lead,
      followUp: {
        required: false,
      },
      noFollowUpReason: "Previous follow-up completed with client outcome note.",
      followUpHistory: [newHistoryItem, ...(lead.followUpHistory || [])],
      activities: [
        ...(lead.activities || []),
        {
          id: `act-${Date.now()}`,
          title: `Follow-up Completed: "${completionNote.trim().slice(0, 35)}..."`,
          time: "Just now",
          type: "followup",
        },
      ],
    };

    onUpdateLead(updatedLead);
    setCompletionNote("");
    setShowCompleteModal(false);
    setDueAlertLead(null);
  };

  const rawPhone = lead.phone.replace(/[^0-9]/g, "");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Current Follow-up Card */}
      <div className="card" style={{ padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icon name="clock" size={18} />
              <span>Follow-up Status</span>
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Schedule, track client callback commitments & document outcomes
            </div>
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            {lead.followUp?.required ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowCompleteModal(true)}
                  className="btn btn-primary btn-sm"
                  style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <Icon name="check" size={14} />
                  <span>Complete</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRescheduleReason("");
                    setShowScheduleModal(true);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Reschedule
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCancelReason("");
                    setShowCancelModal(true);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ color: "var(--danger)", borderColor: "var(--danger-border)" }}
                >
                  Close / Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setRescheduleReason("");
                  setShowScheduleModal(true);
                }}
                className="btn btn-primary btn-sm"
                style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <Icon name="plus" size={14} />
                <span>Schedule Follow-up</span>
              </button>
            )}
          </div>
        </div>

        {lead.followUp?.required ? (
          <div
            style={{
              padding: "12px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--warning-light)",
              border: "1px solid var(--warning-border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--warning)" }}>
                ACTIVE FOLLOW-UP SCHEDULED
              </div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-primary)", marginTop: "2px" }}>
                {lead.followUp.date} at {lead.followUp.time}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                Client: {lead.name} • {lead.phone}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setDueAlertLead(lead);
                playChime();
              }}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: "11px" }}
              title="Test in-app alert banner & chime"
            >
              Test Alert Chime
            </button>
          </div>
        ) : (
          <div
            style={{
              padding: "12px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-subtle)",
              border: "1px solid var(--border-subtle)",
              fontSize: "13px",
              color: "var(--text-secondary)",
            }}
          >
            <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
              No Active Follow-up Scheduled
            </div>
            <div>
              <strong>Documented Reason:</strong> {lead.noFollowUpReason || "No active pending follow-up."}
            </div>
          </div>
        )}
      </div>

      {/* Follow-up History */}
      <div className="card" style={{ padding: "16px" }}>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>
          Follow-up Outcome History ({lead.followUpHistory?.length || 0})
        </div>

        {lead.followUpHistory && lead.followUpHistory.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {lead.followUpHistory.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "12px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-subtle)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span className="badge badge-success" style={{ fontSize: "11px" }}>
                    Completed
                  </span>
                  <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                    {item.completedAt}
                  </span>
                </div>
                <p style={{ fontSize: "13.5px", color: "var(--text-primary)", margin: "4px 0", lineHeight: "1.4" }}>
                  {item.note}
                </p>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Scheduled Slot: {item.date} • {item.time}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "16px 0" }}>
            No past follow-up history logged yet for this prospect.
          </div>
        )}
      </div>

      {/* 1. Schedule / Reschedule Modal */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: "460px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                {lead.followUp?.required ? "Reschedule Follow-up" : "Schedule New Follow-up"}
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="btn-icon"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  Follow-up Date <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="date"
                  required
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
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
                  Exact Time <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="time"
                  required
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
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

              {lead.followUp?.required && (
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                    Reason for Rescheduling <span style={{ color: "var(--danger)" }}>* (Mandatory)</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Client requested callback on weekend, or client traveling till Friday..."
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "13.5px",
                      lineHeight: "1.4",
                      backgroundColor: "var(--bg-surface)",
                    }}
                  />
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Validation strictly requires documenting why this follow-up was rescheduled.
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {lead.followUp?.required ? "Confirm Reschedule" : "Save Schedule"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
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
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
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
                onClick={() => setShowCancelModal(false)}
                className="btn-icon"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginBottom: "12px" }}>
              Client: <strong>{lead.name}</strong> • Scheduled slot: <strong>{lead.followUp?.date} {lead.followUp?.time}</strong>
            </div>

            <form onSubmit={handleCancelSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                  Reason / Note for Closing or Cancellation <span style={{ color: "var(--danger)" }}>* (Mandatory)</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Client requested to stop follow-ups, client bought elsewhere, or invalid contact number..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
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
                  A follow-up cannot be closed or cancelled without documenting the mandatory reason.
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button type="submit" className="btn btn-danger" style={{ flex: 1 }}>
                  Confirm Close / Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Completion Modal with Mandatory Note */}
      {showCompleteModal && (
        <div className="modal-overlay" onClick={() => setShowCompleteModal(false)}>
          <div
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: "480px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                Complete Follow-up & Record Outcome
              </div>
              <button
                type="button"
                onClick={() => setShowCompleteModal(false)}
                className="btn-icon"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginBottom: "12px" }}>
              Client: <strong>{lead.name}</strong> • Scheduled slot: <strong>{lead.followUp?.date} {lead.followUp?.time}</strong>
            </div>

            <form onSubmit={handleCompleteSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                  Follow-up Outcome Note <span style={{ color: "var(--danger)" }}>* (Mandatory)</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Client requested callback tomorrow with floor plan pricing, or client visited site and approved 3BHK unit..."
                  value={completionNote}
                  onChange={(e) => setCompletionNote(e.target.value)}
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
                  A follow-up cannot be completed without documenting the conversation or outcome.
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Confirm & Mark Complete
                </button>
                <button
                  type="button"
                  onClick={() => setShowCompleteModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. In-App Due Alert / Alarm Banner Dialog */}
      {dueAlertLead && (
        <div className="modal-overlay" onClick={() => setDueAlertLead(null)}>
          <div
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            style={{
              maxWidth: "480px",
              borderTop: "4px solid var(--danger)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span className="badge badge-danger" style={{ fontSize: "11.5px", fontWeight: 800 }}>
                  FOLLOW-UP DUE NOW
                </span>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", marginTop: "4px" }}>
                  {dueAlertLead.name}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  Scheduled: <strong>{dueAlertLead.followUp?.date} {dueAlertLead.followUp?.time}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDueAlertLead(null)}
                className="btn-icon"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <div
              style={{
                padding: "10px 12px",
                backgroundColor: "var(--bg-subtle)",
                borderRadius: "var(--radius-md)",
                fontSize: "12.5px",
                color: "var(--text-secondary)",
                marginBottom: "16px",
              }}
            >
              Interest: <strong>{dueAlertLead.propertyInterest}</strong> • Phone: <strong>{dueAlertLead.phone}</strong>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <a
                  href={`tel:${dueAlertLead.phone}`}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
                >
                  <Icon name="phone" size={14} />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/${rawPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
                >
                  <Icon name="message-circle" size={14} />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setDueAlertLead(null);
                    setShowCompleteModal(true);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  Add Follow-up Note & Complete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDueAlertLead(null);
                    setShowScheduleModal(true);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Reschedule
                </button>
              </div>
            </div>

            <div style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", marginTop: "12px" }}>
              Note: In-app alerts trigger while application is active. Background alarms require future server push notifications.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
