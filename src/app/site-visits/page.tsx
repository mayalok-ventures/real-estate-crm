"use client";

import React, { useState } from "react";
import { Icon } from "@/components/Icon";
import { MOCK_SITE_VISITS, SiteVisitItem } from "@/data/mockData";

export default function SiteVisitsPage() {
  const [activeTab, setActiveTab] = useState<"scheduled" | "completed" | "upcoming">("scheduled");

  const filteredVisits = MOCK_SITE_VISITS.filter((visit: SiteVisitItem) => visit.status === activeTab);

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 className="page-title">Site Visits</h1>
          <p className="page-subtitle">Schedule, track, and record physical property tours with prospective buyers</p>
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
          onClick={() => setActiveTab("scheduled")}
          style={{
            flex: 1,
            padding: "7px 10px",
            fontSize: "12.5px",
            fontWeight: activeTab === "scheduled" ? 600 : 500,
            borderRadius: "var(--radius-sm)",
            backgroundColor: activeTab === "scheduled" ? "var(--brand-primary-light)" : "transparent",
            color: activeTab === "scheduled" ? "var(--brand-primary)" : "var(--text-secondary)",
            boxShadow: activeTab === "scheduled" ? "var(--shadow-sm)" : "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <span>Scheduled Today</span>
          <span
            style={{
              padding: "1px 6px",
              borderRadius: "var(--radius-full)",
              backgroundColor: activeTab === "scheduled" ? "var(--brand-primary)" : "var(--brand-primary-light)",
              color: activeTab === "scheduled" ? "white" : "var(--brand-primary)",
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            {MOCK_SITE_VISITS.filter((v) => v.status === "scheduled").length}
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
            {MOCK_SITE_VISITS.filter((v) => v.status === "upcoming").length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("completed")}
          style={{
            flex: 1,
            padding: "7px 10px",
            fontSize: "12.5px",
            fontWeight: activeTab === "completed" ? 600 : 500,
            borderRadius: "var(--radius-sm)",
            backgroundColor: activeTab === "completed" ? "var(--success-light)" : "transparent",
            color: activeTab === "completed" ? "var(--success)" : "var(--text-secondary)",
            boxShadow: activeTab === "completed" ? "var(--shadow-sm)" : "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <span>Completed</span>
          <span
            style={{
              padding: "1px 6px",
              borderRadius: "var(--radius-full)",
              backgroundColor: activeTab === "completed" ? "var(--success)" : "var(--success-light)",
              color: activeTab === "completed" ? "white" : "var(--success)",
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            {MOCK_SITE_VISITS.filter((v) => v.status === "completed").length}
          </span>
        </button>
      </div>

      {/* Visits List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filteredVisits.length > 0 ? (
          filteredVisits.map((visit) => (
            <div key={visit.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {visit.projectName}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Unit: <strong>{visit.unitType}</strong>
                  </div>
                </div>

                <div>
                  <span
                    className={`badge ${
                      visit.status === "scheduled"
                        ? "badge-warning"
                        : visit.status === "completed"
                        ? "badge-success"
                        : "badge-info"
                    }`}
                  >
                    {visit.time}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  fontSize: "12.5px",
                  color: "var(--text-secondary)",
                  backgroundColor: "var(--bg-subtle)",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Icon name="user" size={14} />
                  <span>Buyer: <strong>{visit.clientName}</strong> ({visit.phone})</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Icon name="map-pin" size={14} />
                  <span>Location: {visit.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", flexWrap: "wrap" }}>
                <a href={`tel:${visit.phone}`} className="btn btn-secondary btn-sm">
                  <Icon name="phone" size={13} />
                  <span>Call Buyer</span>
                </a>
                <button type="button" className="btn btn-secondary btn-sm">
                  <Icon name="message-circle" size={13} />
                  <span>Send Directions</span>
                </button>
                {visit.status === "scheduled" && (
                  <button type="button" className="btn btn-primary btn-sm">
                    <Icon name="check" size={13} />
                    <span>Mark Completed</span>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
            No site visits recorded in this category.
          </div>
        )}
      </div>
    </div>
  );
}
