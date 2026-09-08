"use client";

import React, { useState, useEffect } from "react";
import { getStoredLeads, Lead } from "@/data/mockData";
import { getCurrentUser, getStoredUsers, getStoredTeams, User, Team } from "@/data/teamData";
import { hasPermission } from "@/utils/permissionService";
import {
  calculateAnalytics,
  AnalyticsDateRange,
  AnalyticsDataset,
} from "@/utils/analyticsData";
import ExportAnalyticsModal from "@/components/analytics/ExportAnalyticsModal";
import Icon from "@/components/Icon";

export default function AnalyticsPage() {
  const [currentUser, setCurrentUserState] = useState<User>(() => getCurrentUser());
  const [users] = useState<User[]>(() => getStoredUsers());
  const [teams] = useState<Team[]>(() => getStoredTeams());
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>("this_month");
  const [selectedScope, setSelectedScope] = useState<string>("all");
  const [leads] = useState<Lead[]>(() => getStoredLeads());
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleUserChange = () => {
      setCurrentUserState(getCurrentUser());
    };
    window.addEventListener("sahyak_user_changed", handleUserChange);
    window.addEventListener("storage", handleUserChange);
    return () => {
      window.removeEventListener("sahyak_user_changed", handleUserChange);
      window.removeEventListener("storage", handleUserChange);
    };
  }, []);

  const canExport = hasPermission(currentUser, "analytics.export");

  // Filter leads based on selected team or user scope
  const scopedLeads = leads.filter((l) => {
    if (selectedScope === "all") return true;
    if (selectedScope.startsWith("team_")) {
      const teamId = selectedScope.replace("team_", "");
      return l.assignedTeamId === teamId;
    }
    if (selectedScope.startsWith("user_")) {
      const userId = selectedScope.replace("user_", "");
      const targetUser = users.find((u) => u.id === userId);
      return l.assignedToUserId === userId || (targetUser && l.assignedTo === targetUser.name);
    }
    return true;
  });

  const dataset: AnalyticsDataset = calculateAnalytics(scopedLeads, dateRange);

  const rangeButtons: { id: AnalyticsDateRange; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "this_week", label: "This Week" },
    { id: "this_month", label: "This Month" },
    { id: "all_time", label: "All Time" },
  ];

  return (
    <div>
      {/* Header */}
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1 className="page-title">Sales Analytics</h1>
          <p className="page-subtitle">
            Lead conversion velocity, channel performance & broker metrics
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {/* Scope Selector: All / Team / Advisor */}
          <select
            value={selectedScope}
            aria-label="Filter Analytics by Team or Advisor"
            onChange={(e) => setSelectedScope(e.target.value)}
            className="input-select"
            style={{
              padding: "5px 10px",
              fontSize: "12px",
              fontWeight: 600,
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
            }}
          >
            <option value="all">Entire Company ({leads.length} leads)</option>
            <optgroup label="Filter By Team">
              {teams.map((t) => (
                <option key={t.id} value={`team_${t.id}`}>
                  Team: {t.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Filter By Advisor">
              {users.map((u) => (
                <option key={u.id} value={`user_${u.id}`}>
                  Advisor: {u.name}
                </option>
              ))}
            </optgroup>
          </select>

          {/* Date Range Selector */}
          <div
            style={{
              display: "inline-flex",
              backgroundColor: "var(--bg-subtle)",
              borderRadius: "var(--radius-full)",
              padding: "3px",
              border: "1px solid var(--border-subtle)",
              overflowX: "auto",
              maxWidth: "100%",
            }}
          >
            {rangeButtons.map((btn) => {
              const isSelected = dateRange === btn.id;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setDateRange(btn.id)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "var(--radius-full)",
                    fontSize: "12px",
                    fontWeight: 600,
                    backgroundColor: isSelected ? "var(--brand-primary)" : "transparent",
                    color: isSelected ? "var(--text-inverse)" : "var(--text-secondary)",
                    border: "none",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>

          {/* Export Analytics Action */}
          {canExport && (
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              title="Export analytics report to Excel or CSV"
            >
              <Icon name="download" size={14} />
              <span>Export Analytics</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid-3" style={{ marginBottom: "var(--space-6)" }}>
        <div className="card">
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
            AVG. CLOSING CYCLE
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginTop: "4px",
            }}
          >
            {dataset.avgClosingCycleDays} Days
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "var(--success)",
              fontWeight: 600,
              marginTop: "2px",
            }}
          >
            {dataset.totalInquiries > 0
              ? "Based on vetted inquiries & converted pipeline"
              : "No historical inquiries in selected period"}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
            VISIT-TO-DEAL RATIO
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginTop: "4px",
            }}
          >
            {dataset.visitToDealRatio}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "2px",
            }}
          >
            {dataset.siteVisitsCount > 0
              ? `${dataset.convertedDealsCount} won out of ${dataset.siteVisitsCount} site visits`
              : "No completed site visits in period"}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
            COMMISSION VALUE WON
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "var(--brand-primary)",
              marginTop: "4px",
            }}
          >
            {dataset.commissionWonFormatted}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "var(--success)",
              fontWeight: 600,
              marginTop: "2px",
            }}
          >
            {dataset.commissionSubtitle}
          </div>
        </div>
      </div>

      {/* Lead Acquisition Source Distribution & Conversion Funnel */}
      <div className="grid-2">
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
              Lead Sources Performance
            </div>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {dataset.totalInquiries} total
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {dataset.leadSources.length > 0 ? (
              dataset.leadSources.map((source) => (
                <div key={source.name}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "13px",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                      {source.name}
                    </span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {source.count} leads ({source.share})
                    </span>
                  </div>
                  <div
                    style={{
                      height: "8px",
                      width: "100%",
                      backgroundColor: "var(--bg-subtle)",
                      borderRadius: "var(--radius-full)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: source.share,
                        backgroundColor: source.color,
                        borderRadius: "var(--radius-full)",
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "24px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                No inquiries recorded for {dataset.dateRangeLabel.toLowerCase()}
              </div>
            )}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
              Real Estate Conversion Funnel
            </div>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Pipeline Stages
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {dataset.conversionFunnel.map((item, idx) => {
              const isLast = idx === dataset.conversionFunnel.length - 1;
              return (
                <div
                  key={item.stage}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: isLast ? "var(--success-light)" : "var(--bg-subtle)",
                    border: `1px solid ${
                      isLast ? "var(--success-border)" : "var(--border-subtle)"
                    }`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--text-secondary)",
                        fontSize: "11px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {item.stage}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "13px",
                        color: "var(--text-primary)",
                      }}
                    >
                      {item.count}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        marginLeft: "6px",
                      }}
                    >
                      ({item.dropoff})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Export Analytics Modal */}
      <ExportAnalyticsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        dataset={dataset}
      />
    </div>
  );
}
