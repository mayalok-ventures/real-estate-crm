import React from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Lead } from "@/data/mockData";

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
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

  // Strip non-digits for wa.me link
  const rawPhone = lead.phone.replace(/[^0-9]/g, "");

  return (
    <div
      className="card card-clickable"
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
      }}
    >
      {/* Clickable Card Body linking to Lead Profile */}
      <Link
        href={`/leads/${lead.id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Top Header: Client Name, Status Badge, Source, Budget */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div style={{ minWidth: 0, flex: "1 1 180px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                {lead.name}
              </span>
              <span className={`badge ${badgeClass}`}>{lead.status}</span>
              <span className="badge badge-neutral">{lead.source}</span>
            </div>

            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
              <strong>{lead.propertyInterest}</strong>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--brand-primary)" }}>
              {lead.budget}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
              {lead.createdAt}
            </div>
          </div>
        </div>

        {/* Middle Details: Location & Interest Type Chips */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            fontSize: "12px",
            color: "var(--text-secondary)",
          }}
        >
          {lead.location && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Icon name="map-pin" size={13} />
              <span>{lead.location}</span>
            </div>
          )}

          {lead.interestType && (
            <>
              <span style={{ color: "var(--border-strong)" }}>•</span>
              <span
                style={{
                  backgroundColor: "var(--bg-subtle)",
                  padding: "1px 6px",
                  borderRadius: "var(--radius-xs)",
                  fontWeight: 600,
                }}
              >
                {lead.interestType}
              </span>
            </>
          )}

          {lead.projectName && (
            <>
              <span style={{ color: "var(--border-strong)" }}>•</span>
              <span style={{ color: "var(--text-muted)" }}>Project: {lead.projectName}</span>
            </>
          )}

          {lead.assignedTo && (
            <>
              <span style={{ color: "var(--border-strong)" }}>•</span>
              <span style={{ color: "var(--text-muted)" }}>Agent: {lead.assignedTo}</span>
            </>
          )}
        </div>

        {/* Scheduled Follow-up or Site Visit Highlights */}
        {(lead.followUp?.required || lead.siteVisit?.scheduled) && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              padding: "8px 10px",
              backgroundColor: "var(--bg-subtle)",
              borderRadius: "var(--radius-md)",
              fontSize: "11.5px",
            }}
          >
            {lead.followUp?.required && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--warning)" }}>
                <Icon name="clock" size={12} />
                <span>
                  Follow-up: <strong>{lead.followUp.date} {lead.followUp.time}</strong>
                </span>
              </div>
            )}

            {lead.siteVisit?.scheduled && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--info)" }}>
                <Icon name="map-pin" size={12} />
                <span>
                  Site Visit: <strong>{lead.siteVisit.date} {lead.siteVisit.time}</strong>
                </span>
              </div>
            )}
          </div>
        )}
      </Link>

      {/* Action Footer: Phone Number, Call, WhatsApp */}
      <div
        style={{
          paddingTop: "10px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
          {lead.phone}
        </span>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <a
            href={`tel:${lead.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="btn btn-secondary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            title="Call Client"
          >
            <Icon name="phone" size={13} />
            <span>Call</span>
          </a>

          <a
            href={`https://wa.me/${rawPhone}`}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            title="Chat on WhatsApp"
          >
            <Icon name="message-circle" size={13} />
            <span>WhatsApp</span>
          </a>

          <Link
            href={`/leads/${lead.id}`}
            className="btn btn-primary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            <span>View Profile</span>
            <Icon name="chevron-right" size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
