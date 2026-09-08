"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  User,
  getStoredUsers,
  getStoredTeams,
  getStoredDesignations,
  getStoredIncentivePlans,
  updateUserInStore,
} from "@/data/teamData";
import { getStoredLeads, Lead } from "@/data/mockData";
import { getEffectivePermissionsDetail } from "@/utils/permissionService";
import { getUserPerformance } from "@/utils/performanceService";
import { getStoredActivities, filterActivities, logActivity } from "@/utils/activityService";
import { CATEGORY_ORDER } from "@/config/permissions";
import UserFormModal from "@/components/team/UserFormModal";
import AssignIncentiveModal from "@/components/team/AssignIncentiveModal";
import Icon from "@/components/Icon";
import { useHydrated } from "@/utils/useHydrated";

type UserWorkspaceTab = "profile" | "permissions" | "performance" | "activity";

export default function UserDetailPage() {
  const routeParams = useParams();
  const userId = (routeParams?.id as string) || "";

  const isHydrated = useHydrated();
  const [activeTab, setActiveTab] = useState<UserWorkspaceTab>("profile");
  const [users, setUsers] = useState<User[]>(() => getStoredUsers());
  const [teams, setTeams] = useState(() => getStoredTeams());
  const [designations, setDesignations] = useState(() => getStoredDesignations());
  const [incentivePlans, setIncentivePlans] = useState(() => getStoredIncentivePlans());
  const [activities, setActivities] = useState(() => getStoredActivities());
  const [leads, setLeads] = useState<Lead[]>(() => getStoredLeads());

  const [activityDateRange, setActivityDateRange] = useState<"today" | "this_week" | "this_month" | "all_time">("this_month");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignIncentiveOpen, setIsAssignIncentiveOpen] = useState(false);

  const refreshAll = () => {
    setUsers(getStoredUsers());
    setTeams(getStoredTeams());
    setDesignations(getStoredDesignations());
    setIncentivePlans(getStoredIncentivePlans());
    setActivities(getStoredActivities());
    setLeads(getStoredLeads());
  };

  const user = users.find((u) => u.id === userId);

  if (!isHydrated) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "8px 0" }}>
        <div className="card" style={{ height: "64px", backgroundColor: "var(--bg-subtle)" }} />
        <div className="card" style={{ height: "160px", backgroundColor: "var(--bg-subtle)" }} />
        <div className="card" style={{ height: "300px", backgroundColor: "var(--bg-subtle)" }} />
      </div>
    );
  }

  if (!user) {
    notFound();
  }

  const designation = designations.find((d) => d.id === user.designationId);
  const team = teams.find((t) => t.id === user.teamId);
  const manager = users.find((u) => u.id === user.reportingManagerId);

  const perf = getUserPerformance(user, leads);
  const permissionDetails = getEffectivePermissionsDetail(user);

  const userActivities = filterActivities(activities, {
    userId: user.id,
    dateRange: activityDateRange,
  });

  const handleToggleStatus = () => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    const updated: User = { ...user, status: newStatus, updatedAt: new Date().toISOString() };
    updateUserInStore(updated);
    logActivity({
      action: "user_status_changed",
      module: "team",
      entityType: "user",
      entityId: user.id,
      entityName: user.name,
      type: "audit",
      metadata: { previousStatus: user.status, newStatus },
    });
    refreshAll();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Top Breadcrumb & Action Bar */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
        <Link
          href="/team"
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--text-secondary)",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Icon name="arrow-left" size={14} />
          <span>Back to Team Directory</span>
        </Link>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setIsAssignIncentiveOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Icon name="award" size={14} />
            <span>Configure Incentive</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Icon name="edit" size={14} />
            <span>Edit Member</span>
          </button>
        </div>
      </div>

      {/* Member Hero Banner */}
      <div className="card" style={{ padding: "20px" }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--brand-primary-light)",
                color: "var(--brand-primary)",
                fontWeight: 800,
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "1px solid var(--brand-primary-border)",
              }}
            >
              {user.avatarInitials || user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <h1 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  {user.name}
                </h1>
                <span
                  className={`badge ${user.status === "active" ? "badge-success" : "badge-neutral"}`}
                  style={{ fontSize: "10px", textTransform: "capitalize" }}
                >
                  {user.status}
                </span>
              </div>
              <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                {user.jobTitle} &bull; Joined {user.joiningDate}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px", marginTop: "8px" }}>
                <span className="badge badge-info" style={{ fontSize: "10.5px" }}>
                  {designation?.name || "Custom Role"}
                </span>
                {team ? (
                  <span className="badge badge-neutral" style={{ fontSize: "10.5px" }}>
                    {team.name}
                  </span>
                ) : (
                  <span className="badge badge-neutral" style={{ fontSize: "10.5px" }}>
                    Direct Brokerage
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
                Estimated Incentive
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--success)" }} suppressHydrationWarning>
                {perf.estimatedIncentiveFormatted}
              </div>
              <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                {perf.incentivePlanName}
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleStatus}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-subtle)",
                color: user.status === "active" ? "var(--danger)" : "var(--success)",
              }}
            >
              {user.status === "active" ? "Deactivate Account" : "Activate Account"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "4px",
          overflowX: "auto",
        }}
      >
        {[
          { id: "profile", label: "Profile & Employment", icon: "user" as const },
          { id: "permissions", label: "Permissions & Access", icon: "shield" as const },
          { id: "performance", label: "Performance & Incentives", icon: "award" as const },
          { id: "activity", label: "Activity Timeline", count: userActivities.length, icon: "activity" as const },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as UserWorkspaceTab)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "var(--radius-lg)",
                whiteSpace: "nowrap",
                fontSize: "12px",
                fontWeight: isActive ? 700 : 500,
                backgroundColor: isActive ? "var(--brand-primary)" : "transparent",
                color: isActive ? "var(--text-inverse)" : "var(--text-secondary)",
                transition: "all 0.15s ease",
              }}
            >
              <Icon name={tab.icon} size={14} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    fontSize: "10px",
                    padding: "1px 6px",
                    borderRadius: "9999px",
                    fontWeight: 700,
                    backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "var(--bg-subtle)",
                    color: isActive ? "white" : "var(--text-secondary)",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === "profile" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          <div className="card" style={{ padding: "16px" }}>
            <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px", marginBottom: "12px" }}>
              Contact & Identification
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12.5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--bg-subtle)", paddingBottom: "6px" }}>
                <span style={{ color: "var(--text-muted)" }}>Email Address</span>
                <span style={{ fontWeight: 600, color: "var(--text-primary)", fontFamily: "monospace" }}>{user.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--bg-subtle)", paddingBottom: "6px" }}>
                <span style={{ color: "var(--text-muted)" }}>Phone Number</span>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{user.phone}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--bg-subtle)", paddingBottom: "6px" }}>
                <span style={{ color: "var(--text-muted)" }}>Employee ID</span>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{user.employeeId || "N/A"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Department</span>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{user.department || "General Brokerage"}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: "16px" }}>
            <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px", marginBottom: "12px" }}>
              Organization & Hierarchy
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12.5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--bg-subtle)", paddingBottom: "6px" }}>
                <span style={{ color: "var(--text-muted)" }}>Assigned Designation</span>
                <strong style={{ color: "var(--brand-primary)" }}>{designation?.name || "Unassigned"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--bg-subtle)", paddingBottom: "6px" }}>
                <span style={{ color: "var(--text-muted)" }}>Assigned Team</span>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{team?.name || "None"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--bg-subtle)", paddingBottom: "6px" }}>
                <span style={{ color: "var(--text-muted)" }}>Reporting Manager</span>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{manager ? `${manager.name} (${manager.jobTitle})` : "None (Flat structure)"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Date of Joining</span>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{user.joiningDate}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERMISSIONS */}
      {activeTab === "permissions" && (
        <div className="card" style={{ padding: "16px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px", marginBottom: "14px" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
                Effective Access & Granular Permissions
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Base template: <strong style={{ color: "var(--brand-primary)" }}>{designation?.name}</strong> + individual overrides
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="btn btn-secondary btn-sm"
            >
              Modify Overrides
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {CATEGORY_ORDER.map((cat) => {
              const items = permissionDetails.filter((p) => p.permission.category === cat);
              if (items.length === 0) return null;

              return (
                <div key={cat} className="permission-cat-card" style={{ marginBottom: 0 }}>
                  <div className="permission-cat-header" style={{ cursor: "default" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>{cat}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      {items.filter((i) => i.isAllowed).length}/{items.length} Active
                    </span>
                  </div>

                  <div>
                    {items.map(({ permission, isAllowed, source }) => (
                      <div
                        key={permission.id}
                        className="permission-item-row"
                        style={{ backgroundColor: isAllowed ? "white" : "var(--bg-subtle)", opacity: isAllowed ? 1 : 0.65 }}
                      >
                        <span
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "4px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: 700,
                            backgroundColor: isAllowed ? "var(--success-light)" : "var(--border-subtle)",
                            color: isAllowed ? "var(--success)" : "var(--text-muted)",
                            flexShrink: 0,
                            marginTop: "1px",
                          }}
                        >
                          {isAllowed ? "✓" : "×"}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: "12px", color: "var(--text-primary)" }}>
                            {permission.label}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.3 }}>
                            {permission.description}
                          </div>
                        </div>

                        <div style={{ flexShrink: 0 }}>
                          {source === "override_grant" && (
                            <span className="badge badge-success" style={{ fontSize: "9.5px" }}>
                              Custom Granted
                            </span>
                          )}
                          {source === "override_revoke" && (
                            <span className="badge badge-danger" style={{ fontSize: "9.5px" }}>
                              Custom Revoked
                            </span>
                          )}
                          {source === "designation" && (
                            <span className="badge badge-neutral" style={{ fontSize: "9.5px" }}>
                              Designation Default
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PERFORMANCE */}
      {activeTab === "performance" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
            <div className="card" style={{ padding: "14px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>Total Leads Assigned</div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginTop: "4px" }} suppressHydrationWarning>{perf.totalLeads}</div>
              <div style={{ fontSize: "10.5px", fontWeight: 600, color: "var(--success)", marginTop: "2px" }}>{perf.activeLeads} active prospects</div>
            </div>

            <div className="card" style={{ padding: "14px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>Deals Converted</div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--success)", marginTop: "4px" }} suppressHydrationWarning>{perf.convertedLeads}</div>
              <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "2px" }} suppressHydrationWarning>Conversion rate: {perf.conversionRate}</div>
            </div>

            <div className="card" style={{ padding: "14px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>Follow-up Completion</div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginTop: "4px" }} suppressHydrationWarning>{perf.followUpCompletionRate}</div>
              <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "2px" }}>{perf.completedFollowUps} logged calls</div>
            </div>

            <div className="card" style={{ padding: "14px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>Estimated Incentive</div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--brand-primary)", marginTop: "4px" }} suppressHydrationWarning>{perf.estimatedIncentiveFormatted}</div>
              <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "2px" }}>{perf.incentivePlanName}</div>
            </div>
          </div>

          <div className="card" style={{ padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
              Sales Volume & Pipeline Value
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Total Closed Deal Value</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }} suppressHydrationWarning>{perf.totalDealValueFormatted}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Property Tours Conducted</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }} suppressHydrationWarning>{perf.siteVisitsCount} Visits</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVITY */}
      {activeTab === "activity" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", fontSize: "12px" }}>
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
              Recent Actions Log ({userActivities.length})
            </span>
            <div style={{ display: "inline-flex", backgroundColor: "var(--bg-subtle)", padding: "2px", borderRadius: "var(--radius-md)" }}>
              {[
                { id: "today", label: "Today" },
                { id: "this_week", label: "This Week" },
                { id: "this_month", label: "This Month" },
                { id: "all_time", label: "All" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setActivityDateRange(btn.id as "today" | "this_week" | "this_month" | "all_time")}
                  style={{
                    padding: "4px 8px",
                    fontSize: "11px",
                    fontWeight: 600,
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: activityDateRange === btn.id ? "white" : "transparent",
                    color: activityDateRange === btn.id ? "var(--brand-primary)" : "var(--text-secondary)",
                    boxShadow: activityDateRange === btn.id ? "var(--shadow-xs)" : "none",
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {userActivities.length > 0 ? (
              userActivities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "white",
                    fontSize: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "var(--brand-primary-light)",
                      color: "var(--brand-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="activity" size={15} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)", textTransform: "capitalize" }}>
                        {act.action.replace(/_/g, " ")}
                      </div>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                        {new Date(act.createdAt).toLocaleDateString()} &bull; {new Date(act.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      Target: <strong style={{ color: "var(--text-primary)" }}>{act.entityName}</strong> ({act.entityType})
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "12px" }}>
                No activity logs recorded for this member in the selected period.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <UserFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userToEdit={user}
        allTeams={teams}
        allDesignations={designations}
        allUsers={users}
        allIncentivePlans={incentivePlans}
        onSaved={refreshAll}
      />

      <AssignIncentiveModal
        isOpen={isAssignIncentiveOpen}
        onClose={() => setIsAssignIncentiveOpen(false)}
        user={user}
        allPlans={incentivePlans}
        onAssigned={refreshAll}
      />
    </div>
  );
}
