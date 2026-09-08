"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Team,
  DesignationRole,
  IncentivePlan,
  ActivityLog,
  getStoredUsers,
  getStoredTeams,
  getStoredDesignations,
  getStoredIncentivePlans,
  updateUserInStore,
} from "@/data/teamData";
import { getStoredLeads, Lead } from "@/data/mockData";
import { getUserPerformance, getTeamPerformance } from "@/utils/performanceService";
import { getStoredActivities, filterActivities, logActivity } from "@/utils/activityService";
import UserFormModal from "@/components/team/UserFormModal";
import TeamFormModal from "@/components/team/TeamFormModal";
import DesignationFormModal from "@/components/team/DesignationFormModal";
import IncentivePlanModal from "@/components/team/IncentivePlanModal";
import AssignIncentiveModal from "@/components/team/AssignIncentiveModal";
import Icon from "@/components/Icon";
import { useHydrated } from "@/utils/useHydrated";

type TeamTab = "members" | "teams" | "designations" | "incentives" | "activity";

export default function TeamManagementPage() {
  const isHydrated = useHydrated();
  const [activeTab, setActiveTab] = useState<TeamTab>("members");

  // Core Data
  const [users, setUsers] = useState<User[]>(() => getStoredUsers());
  const [teams, setTeams] = useState<Team[]>(() => getStoredTeams());
  const [designations, setDesignations] = useState<DesignationRole[]>(() => getStoredDesignations());
  const [incentivePlans, setIncentivePlans] = useState<IncentivePlan[]>(() => getStoredIncentivePlans());
  const [activities, setActivities] = useState<ActivityLog[]>(() => getStoredActivities());
  const [leads, setLeads] = useState<Lead[]>(() => getStoredLeads());

  // Filters for Members Tab
  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [designationFilter, setDesignationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Filters for Activity Tab
  const [activityUserFilter, setActivityUserFilter] = useState("all");
  const [activityModuleFilter, setActivityModuleFilter] = useState("all");
  const [activityTypeFilter, setActivityTypeFilter] = useState<"all" | "activity" | "audit">("all");
  const [activityDateRange, setActivityDateRange] = useState<"today" | "this_week" | "this_month" | "all_time">("this_month");

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState<Team | null>(null);

  const [isDesignationModalOpen, setIsDesignationModalOpen] = useState(false);
  const [designationToEdit, setDesignationToEdit] = useState<DesignationRole | null>(null);

  const [isIncentiveModalOpen, setIsIncentiveModalOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<IncentivePlan | null>(null);

  const [isAssignIncentiveOpen, setIsAssignIncentiveOpen] = useState(false);
  const [userForIncentive, setUserForIncentive] = useState<User | null>(null);

  // Setup guidance & designation preview state
  const [isSetupDismissed, setIsSetupDismissed] = useState(false);
  const [expandedDesignationIds, setExpandedDesignationIds] = useState<string[]>([]);

  const toggleExpandDesignation = (id: string) => {
    setExpandedDesignationIds((prev) =>
      prev.includes(id) ? prev.filter((dId) => dId !== id) : [...prev, id]
    );
  };

  const refreshAll = () => {
    setUsers(getStoredUsers());
    setTeams(getStoredTeams());
    setDesignations(getStoredDesignations());
    setIncentivePlans(getStoredIncentivePlans());
    setActivities(getStoredActivities());
    setLeads(getStoredLeads());
  };

  const handleToggleUserStatus = (user: User) => {
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

  // Filtered members
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q) ||
      u.jobTitle.toLowerCase().includes(q);

    const matchesTeam = teamFilter === "all" || u.teamId === teamFilter;
    const matchesDesig = designationFilter === "all" || u.designationId === designationFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && u.status === "active") ||
      (statusFilter === "inactive" && u.status !== "active");

    return matchesQuery && matchesTeam && matchesDesig && matchesStatus;
  });

  // Filtered activities
  const filteredActivities = filterActivities(activities, {
    userId: activityUserFilter !== "all" ? activityUserFilter : undefined,
    module: activityModuleFilter !== "all" ? activityModuleFilter : undefined,
    type: activityTypeFilter !== "all" ? activityTypeFilter : undefined,
    dateRange: activityDateRange,
  });

  if (!isHydrated) {
    return (
      <div className="space-y-4" style={{ padding: "8px 0" }}>
        <div className="card" style={{ height: "70px", backgroundColor: "var(--bg-subtle)" }} />
        <div className="card" style={{ height: "130px", backgroundColor: "var(--bg-subtle)" }} />
        <div className="card" style={{ height: "260px", backgroundColor: "var(--bg-subtle)" }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Page Header */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 className="page-title" style={{ margin: 0 }}>Team & Organization</h1>
            <span className="badge badge-info" style={{ fontSize: "11px" }}>
              {users.length} {users.length === 1 ? "Member" : "Members"}
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: "4px 0 0 0" }}>
            Manage company members, teams, custom designations, permissions & incentives
          </p>
        </div>

        {/* Action Buttons dynamically tailored for active tab on Desktop & Mobile */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {activeTab === "members" && (
            <>
              <button
                type="button"
                onClick={() => {
                  setDesignationToEdit(null);
                  setIsDesignationModalOpen(true);
                }}
                className="btn btn-secondary btn-sm"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Icon name="shield" size={14} />
                <span>Create Designation</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserToEdit(null);
                  setIsUserModalOpen(true);
                }}
                className="btn btn-primary btn-sm"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Icon name="user-plus" size={14} />
                <span>Add Member</span>
              </button>
            </>
          )}

          {activeTab === "teams" && (
            <button
              type="button"
              onClick={() => {
                setTeamToEdit(null);
                setIsTeamModalOpen(true);
              }}
              className="btn btn-primary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Icon name="plus" size={14} />
              <span>Create Team</span>
            </button>
          )}

          {activeTab === "designations" && (
            <button
              type="button"
              onClick={() => {
                setDesignationToEdit(null);
                setIsDesignationModalOpen(true);
              }}
              className="btn btn-primary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Icon name="plus" size={14} />
              <span>Create Designation</span>
            </button>
          )}

          {activeTab === "incentives" && (
            <button
              type="button"
              onClick={() => {
                setPlanToEdit(null);
                setIsIncentiveModalOpen(true);
              }}
              className="btn btn-primary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Icon name="plus" size={14} />
              <span>New Incentive Plan</span>
            </button>
          )}
        </div>
      </div>

      {/* Onboarding Guide (Only for Empty Organization) */}
      {!isSetupDismissed && (designations.length === 0 || users.length === 0) && (
        <div
          className="card"
          style={{
            padding: "14px 16px",
            backgroundColor: "var(--brand-primary-light)",
            borderColor: "var(--brand-primary-border)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  backgroundColor: "var(--brand-primary)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="award" size={15} />
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Set Up Your Organization
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                  Follow 3 steps: Create custom designations & teams, then add your members
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSetupDismissed(true)}
              style={{ color: "var(--text-muted)", padding: "4px" }}
              aria-label="Dismiss setup banner"
            >
              <Icon name="close" size={14} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px" }}>
            <button
              type="button"
              onClick={() => {
                setDesignationToEdit(null);
                setIsDesignationModalOpen(true);
              }}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: "space-between", backgroundColor: "white", fontSize: "12px" }}
            >
              <span>1. Create Designation</span>
              <span style={{ color: "var(--brand-primary)", fontWeight: 700 }}>+</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTeamToEdit(null);
                setIsTeamModalOpen(true);
              }}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: "space-between", backgroundColor: "white", fontSize: "12px" }}
            >
              <span>2. Create Team</span>
              <span style={{ color: "var(--brand-primary)", fontWeight: 700 }}>+</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUserToEdit(null);
                setIsUserModalOpen(true);
              }}
              className="btn btn-primary btn-sm"
              style={{ justifyContent: "space-between", fontSize: "12px" }}
            >
              <span>3. Add Member</span>
              <span style={{ fontWeight: 700 }}>+</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Tabs Navigation */}
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
          { id: "members", label: "Members", count: users.length, icon: "users" as const },
          { id: "teams", label: "Teams", count: teams.filter((t) => t.status === "active").length, icon: "building" as const },
          { id: "designations", label: "Designations & Permissions", count: designations.length, icon: "shield" as const },
          { id: "incentives", label: "Incentives", count: incentivePlans.length, icon: "award" as const },
          { id: "activity", label: "Activity & Audit", count: activities.length, icon: "activity" as const },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TeamTab)}
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
            </button>
          );
        })}
      </div>

      {/* TAB 1: MEMBERS */}
      {activeTab === "members" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Search & Filter Bar */}
          <div
            className="card"
            style={{
              padding: "12px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {/* Search Box */}
              <div style={{ position: "relative", flex: 1, minWidth: "220px", maxWidth: "380px" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    display: "flex",
                    pointerEvents: "none",
                  }}
                >
                  <Icon name="search" size={14} />
                </span>
                <input
                  type="text"
                  placeholder="Search by name, email, phone, role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    paddingLeft: "32px",
                    paddingRight: "12px",
                    paddingTop: "7px",
                    paddingBottom: "7px",
                    fontSize: "12px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    outline: "none",
                    backgroundColor: "white",
                  }}
                />
              </div>

              {/* Filters */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  style={{
                    padding: "6px 10px",
                    fontSize: "12px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "white",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="all">All Teams</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>

                <select
                  value={designationFilter}
                  onChange={(e) => setDesignationFilter(e.target.value)}
                  style={{
                    padding: "6px 10px",
                    fontSize: "12px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "white",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="all">All Designations</option>
                  {designations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                  style={{
                    padding: "6px 10px",
                    fontSize: "12px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "white",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>

                {(searchQuery || teamFilter !== "all" || designationFilter !== "all" || statusFilter !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setTeamFilter("all");
                      setDesignationFilter("all");
                      setStatusFilter("all");
                    }}
                    style={{
                      fontSize: "12px",
                      color: "var(--brand-primary)",
                      fontWeight: 600,
                      padding: "4px 8px",
                      textDecoration: "underline",
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Members Grid / Empty State */}
          {users.length === 0 ? (
            <div
              className="card"
              style={{
                padding: "48px 20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderStyle: "dashed",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  backgroundColor: "var(--brand-primary-light)",
                  color: "var(--brand-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px",
                }}
              >
                <Icon name="users" size={24} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>No Team Members Yet</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "4px 0 16px 0", maxWidth: "360px" }}>
                Add your real estate advisors, consultants, and telecallers to start collaborating on leads.
              </p>
              <button
                type="button"
                onClick={() => {
                  setUserToEdit(null);
                  setIsUserModalOpen(true);
                }}
                className="btn btn-primary btn-sm"
              >
                <Icon name="user-plus" size={15} />
                <span>Add First Member</span>
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="card" style={{ padding: "36px 16px", textAlign: "center", fontSize: "13px", color: "var(--text-secondary)" }}>
              <p>No team members match your active filters.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setTeamFilter("all");
                  setDesignationFilter("all");
                  setStatusFilter("all");
                }}
                style={{ marginTop: "8px", fontSize: "12px", color: "var(--brand-primary)", fontWeight: 600 }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {filteredUsers.map((user) => {
                const desig = designations.find((d) => d.id === user.designationId);
                const team = teams.find((t) => t.id === user.teamId);
                const perf = getUserPerformance(user, leads);

                return (
                  <div
                    key={user.id}
                    className="card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "16px",
                      opacity: user.status === "active" ? 1 : 0.75,
                      gap: "12px",
                    }}
                  >
                    <div>
                      {/* Top: Avatar + Name + Status */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "9999px",
                              backgroundColor: "var(--brand-primary-light)",
                              color: "var(--brand-primary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              fontSize: "13px",
                              flexShrink: 0,
                            }}
                          >
                            {user.avatarInitials || user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              <Link href={`/team/${user.id}`} style={{ color: "inherit" }}>
                                {user.name}
                              </Link>
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {user.jobTitle}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`badge ${user.status === "active" ? "badge-success" : "badge-neutral"}`}
                          style={{ fontSize: "10px", textTransform: "capitalize", flexShrink: 0 }}
                        >
                          {user.status}
                        </span>
                      </div>

                      {/* Email and Meta */}
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "8px", display: "flex", flexDirection: "column", gap: "2px" }}>
                        {user.email && (
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {user.email}
                          </span>
                        )}
                        {user.phone && <span>{user.phone}</span>}
                      </div>

                      {/* Tags: Designation & Team */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                        <span className="badge badge-info" style={{ fontSize: "10px" }}>
                          {desig?.name || "No Designation"}
                        </span>
                        {team && (
                          <span className="badge badge-neutral" style={{ fontSize: "10px" }}>
                            {team.name}
                          </span>
                        )}
                        {user.joiningDate && (
                          <span style={{ fontSize: "10px", color: "var(--text-muted)", marginLeft: "auto", alignSelf: "center" }}>
                            Joined {user.joiningDate}
                          </span>
                        )}
                      </div>

                      {/* Performance Mini-Stats */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "6px",
                          padding: "8px 10px",
                          backgroundColor: "var(--bg-subtle)",
                          borderRadius: "var(--radius-md)",
                          textAlign: "center",
                          fontSize: "11px",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Leads</div>
                          <div style={{ fontWeight: 700, color: "var(--text-primary)" }} suppressHydrationWarning>{perf.totalLeads}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Deals</div>
                          <div style={{ fontWeight: 700, color: "var(--success)" }} suppressHydrationWarning>{perf.convertedLeads}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Incentive</div>
                          <div style={{ fontWeight: 700, color: "var(--brand-primary)" }} suppressHydrationWarning>{perf.estimatedIncentiveFormatted}</div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "10px",
                        borderTop: "1px solid var(--border-subtle)",
                        fontSize: "12px",
                      }}
                    >
                      <Link
                        href={`/team/${user.id}`}
                        style={{ fontWeight: 600, color: "var(--brand-primary)", fontSize: "11px" }}
                      >
                        View Profile →
                      </Link>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setUserForIncentive(user);
                            setIsAssignIncentiveOpen(true);
                          }}
                          className="btn-icon"
                          style={{ width: "28px", height: "28px", minHeight: "28px" }}
                          title="Incentive Plan"
                        >
                          <Icon name="award" size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setUserToEdit(user);
                            setIsUserModalOpen(true);
                          }}
                          className="btn-icon"
                          style={{ width: "28px", height: "28px", minHeight: "28px" }}
                          title="Edit Member & Permissions"
                        >
                          <Icon name="edit" size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(user)}
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: "var(--radius-sm)",
                            color: user.status === "active" ? "var(--text-muted)" : "var(--success)",
                          }}
                          title={user.status === "active" ? "Deactivate access" : "Activate access"}
                        >
                          {user.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TEAMS */}
      {activeTab === "teams" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {teams.filter((t) => t.status === "active").length === 0 ? (
            <div
              className="card"
              style={{
                padding: "48px 20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderStyle: "dashed",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  backgroundColor: "var(--brand-primary-light)",
                  color: "var(--brand-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px",
                }}
              >
                <Icon name="building" size={24} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>No Teams Created Yet</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "4px 0 16px 0", maxWidth: "380px" }}>
                Teams organize members by territory, project vertical, or department with dedicated team leads.
              </p>
              <button
                type="button"
                onClick={() => {
                  setTeamToEdit(null);
                  setIsTeamModalOpen(true);
                }}
                className="btn btn-primary btn-sm"
              >
                <Icon name="plus" size={14} />
                <span>Create First Team</span>
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {teams
                .filter((t) => t.status === "active")
                .map((team) => {
                  const perf = getTeamPerformance(team, users, leads);
                  const leadUser = users.find((u) => u.id === team.teamLeadUserId);

                  return (
                    <div
                      key={team.id}
                      className="card"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "16px",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "6px" }}>
                          <div>
                            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{team.name}</h3>
                            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                              Lead: <strong style={{ color: "var(--text-primary)" }}>{leadUser ? leadUser.name : "Flat (No lead)"}</strong>
                            </div>
                          </div>
                          <span className="badge badge-info" style={{ fontSize: "10px" }}>
                            {team.memberUserIds.length} {team.memberUserIds.length === 1 ? "Member" : "Members"}
                          </span>
                        </div>

                        {team.description && (
                          <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "6px 0 10px 0", lineHeight: 1.4 }}>
                            {team.description}
                          </p>
                        )}

                        {/* Performance Snapshot */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "6px",
                            padding: "8px 10px",
                            backgroundColor: "var(--bg-subtle)",
                            borderRadius: "var(--radius-md)",
                            textAlign: "center",
                            fontSize: "11px",
                            marginBottom: "8px",
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Team Leads</div>
                            <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{perf.totalLeads}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Deals</div>
                            <div style={{ fontWeight: 700, color: "var(--success)" }}>{perf.convertedLeads}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Rate</div>
                            <div style={{ fontWeight: 700, color: "var(--brand-primary)" }}>{perf.conversionRate}</div>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingTop: "10px",
                          borderTop: "1px solid var(--border-subtle)",
                          fontSize: "12px",
                        }}
                      >
                        <div style={{ display: "flex", gap: "2px" }}>
                          {team.memberUserIds.slice(0, 4).map((uid) => {
                            const m = users.find((u) => u.id === uid);
                            return (
                              <span
                                key={uid}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "24px",
                                  height: "24px",
                                  borderRadius: "9999px",
                                  backgroundColor: "var(--bg-subtle)",
                                  color: "var(--text-secondary)",
                                  fontSize: "10px",
                                  fontWeight: 700,
                                  border: "1px solid white",
                                }}
                                title={m?.name}
                              >
                                {m?.avatarInitials || m?.name.slice(0, 2).toUpperCase()}
                              </span>
                            );
                          })}
                          {team.memberUserIds.length > 4 && (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "24px",
                                height: "24px",
                                borderRadius: "9999px",
                                backgroundColor: "var(--brand-primary-light)",
                                color: "var(--brand-primary)",
                                fontSize: "10px",
                                fontWeight: 700,
                              }}
                            >
                              +{team.memberUserIds.length - 4}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setTeamToEdit(team);
                            setIsTeamModalOpen(true);
                          }}
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "var(--brand-primary)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Icon name="edit" size={13} />
                          <span>Manage Team</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DESIGNATIONS & PERMISSIONS */}
      {activeTab === "designations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "var(--brand-primary-light)",
              border: "1px solid var(--brand-primary-border)",
              borderRadius: "var(--radius-lg)",
              fontSize: "12px",
              color: "var(--brand-primary)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Icon name="shield" size={16} />
            <span>
              <strong>Company-Defined Designations</strong>: Create any custom role and define granular access permissions.
            </span>
          </div>

          {designations.length === 0 ? (
            <div
              className="card"
              style={{
                padding: "48px 20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderStyle: "dashed",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  backgroundColor: "var(--brand-primary-light)",
                  color: "var(--brand-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px",
                }}
              >
                <Icon name="shield" size={24} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>No Designations Yet</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "4px 0 16px 0", maxWidth: "380px" }}>
                Create custom designations for your organization (e.g., Property Consultant, Telecaller, Sales Closer) and define their access.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDesignationToEdit(null);
                  setIsDesignationModalOpen(true);
                }}
                className="btn btn-primary btn-sm"
              >
                <Icon name="plus" size={14} />
                <span>Create First Designation</span>
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
              {designations.map((desig) => {
                const memberCount = users.filter((u) => u.designationId === desig.id).length;
                const isExpanded = expandedDesignationIds.includes(desig.id);

                return (
                  <div
                    key={desig.id}
                    className="card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "16px",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              backgroundColor: "var(--brand-primary-light)",
                              color: "var(--brand-primary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Icon name="shield" size={16} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{desig.name}</h3>
                            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "1px" }}>
                              {desig.permissionIds.length} permissions &bull; {memberCount} {memberCount === 1 ? "member assigned" : "members assigned"}
                            </div>
                          </div>
                        </div>
                        <span className="badge badge-info" style={{ fontSize: "10px" }}>
                          {memberCount} Assigned
                        </span>
                      </div>

                      {desig.description && (
                        <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "6px 0 10px 0", lineHeight: 1.4 }}>
                          {desig.description}
                        </p>
                      )}

                      {/* Permissions preview */}
                      <div
                        style={{
                          padding: "10px 12px",
                          backgroundColor: "var(--bg-subtle)",
                          borderRadius: "var(--radius-md)",
                          fontSize: "11px",
                          marginBottom: "8px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px", fontWeight: 600 }}>
                          <span>Default Permissions ({desig.permissionIds.length})</span>
                          <button
                            type="button"
                            onClick={() => toggleExpandDesignation(desig.id)}
                            style={{ fontSize: "11px", color: "var(--brand-primary)", fontWeight: 600 }}
                          >
                            {isExpanded ? "Collapse" : "View All"}
                          </button>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "4px",
                            maxHeight: isExpanded ? "240px" : "68px",
                            overflowY: isExpanded ? "auto" : "hidden",
                          }}
                        >
                          {(isExpanded ? desig.permissionIds : desig.permissionIds.slice(0, 8)).map((pid) => (
                            <span
                              key={pid}
                              style={{
                                fontSize: "10px",
                                backgroundColor: "white",
                                border: "1px solid var(--border-subtle)",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                color: "var(--text-secondary)",
                                fontFamily: "monospace",
                              }}
                            >
                              {pid}
                            </span>
                          ))}
                          {!isExpanded && desig.permissionIds.length > 8 && (
                            <span style={{ fontSize: "10px", color: "var(--text-muted)", padding: "2px 4px", fontWeight: 600 }}>
                              +{desig.permissionIds.length - 8} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "10px",
                        borderTop: "1px solid var(--border-subtle)",
                        fontSize: "12px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleExpandDesignation(desig.id)}
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "var(--text-secondary)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size={13} />
                        <span>{isExpanded ? "Hide Permissions" : "View Permissions"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDesignationToEdit(desig);
                          setIsDesignationModalOpen(true);
                        }}
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "var(--brand-primary)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Icon name="edit" size={13} />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: INCENTIVES */}
      {activeTab === "incentives" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {incentivePlans.map((plan) => {
              return (
                <div
                  key={plan.id}
                  className="card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "16px",
                    gap: "12px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            backgroundColor: "var(--success-light)",
                            color: "var(--success)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Icon name="award" size={16} />
                        </div>
                        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{plan.name}</h3>
                      </div>
                      <span className="badge badge-success" style={{ fontSize: "10px", textTransform: "uppercase" }}>
                        {plan.type.replace("_", " ")}
                      </span>
                    </div>

                    {plan.description && (
                      <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "6px 0 10px 0", lineHeight: 1.4 }}>
                        {plan.description}
                      </p>
                    )}

                    <div
                      style={{
                        padding: "10px 12px",
                        backgroundColor: "var(--bg-subtle)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      {plan.type === "fixed" && (
                        <div>
                          Payout: <strong>₹{plan.rules.fixedAmountPerDeal?.toLocaleString("en-IN")} per deal</strong>
                        </div>
                      )}
                      {plan.type === "commission_percentage" && (
                        <div>
                          Commission Share: <strong>{plan.rules.percentageOfBrokerage}% of gross brokerage</strong>
                        </div>
                      )}
                      {plan.type === "deal_percentage" && (
                        <div>
                          Deal Value Share: <strong>{plan.rules.percentageOfDealValue}% of agreement value</strong>
                        </div>
                      )}
                      {plan.type === "slab" && (
                        <div style={{ fontSize: "11px" }}>
                          Tiered Rates: <strong>1-3 deals ₹2.5k</strong> • <strong>4-7 deals ₹4k</strong> • <strong>8+ deals ₹6k</strong>
                        </div>
                      )}
                      {plan.type === "target" && (
                        <div style={{ fontSize: "11px" }}>
                          Target Sales: <strong>₹{((plan.rules.targetAmount || 10000000) / 10000000).toFixed(1)} Cr</strong> &rarr; Bonus: <strong>₹{plan.rules.targetIncentiveAmount?.toLocaleString("en-IN")}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "10px",
                      borderTop: "1px solid var(--border-subtle)",
                      fontSize: "12px",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Status: Active Plan
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPlanToEdit(plan);
                        setIsIncentiveModalOpen(true);
                      }}
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--brand-primary)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Icon name="edit" size={13} />
                      <span>Edit Structure</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: ACTIVITY & AUDIT */}
      {activeTab === "activity" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Filters Bar */}
          <div className="card" style={{ padding: "12px 16px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px", fontSize: "12px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
              <select
                value={activityUserFilter}
                onChange={(e) => setActivityUserFilter(e.target.value)}
                style={{
                  padding: "6px 10px",
                  fontSize: "12px",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "white",
                }}
              >
                <option value="all">All Actors / Users</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <select
                value={activityModuleFilter}
                onChange={(e) => setActivityModuleFilter(e.target.value)}
                style={{
                  padding: "6px 10px",
                  fontSize: "12px",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "white",
                }}
              >
                <option value="all">All Modules</option>
                <option value="leads">Leads</option>
                <option value="pipeline">Pipeline</option>
                <option value="followups">Follow-ups</option>
                <option value="site_visits">Site Visits</option>
                <option value="team">Team & Access</option>
              </select>

              <select
                value={activityTypeFilter}
                onChange={(e) => setActivityTypeFilter(e.target.value as "all" | "activity" | "audit")}
                style={{
                  padding: "6px 10px",
                  fontSize: "12px",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "white",
                }}
              >
                <option value="all">All Log Types</option>
                <option value="activity">CRM Actions</option>
                <option value="audit">Audit Events</option>
              </select>
            </div>

            {/* Date Range Selector */}
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
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 600,
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

          {/* Activity Timeline */}
          <div className="card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {filteredActivities.length > 0 ? (
              filteredActivities.map((act) => {
                const isAudit = act.type === "audit";
                return (
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
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        backgroundColor: isAudit ? "var(--brand-primary-light)" : "var(--info-light)",
                        color: isAudit ? "var(--brand-primary)" : "var(--info)",
                      }}
                    >
                      <Icon name={isAudit ? "shield" : "activity"} size={16} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                        <div style={{ fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {act.userName} &bull;{" "}
                          <span style={{ textTransform: "capitalize", fontWeight: 500, color: "var(--text-secondary)" }}>
                            {act.action.replace(/_/g, " ")}
                          </span>
                        </div>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)", flexShrink: 0, fontFamily: "monospace" }}>
                          {new Date(act.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                        Target: <strong style={{ color: "var(--text-primary)" }}>{act.entityName}</strong> ({act.entityType})
                      </div>

                      {act.metadata && (
                        <div style={{ marginTop: "4px", fontSize: "10px", color: "var(--text-secondary)", fontFamily: "monospace", backgroundColor: "var(--bg-subtle)", padding: "4px 8px", borderRadius: "4px", overflowX: "auto" }}>
                          {JSON.stringify(act.metadata)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-secondary)", fontSize: "13px" }}>
                No activity logs found for the selected filters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        userToEdit={userToEdit}
        allTeams={teams}
        allDesignations={designations}
        allUsers={users}
        allIncentivePlans={incentivePlans}
        onSaved={refreshAll}
        onDesignationCreated={refreshAll}
        onTeamCreated={refreshAll}
      />

      <TeamFormModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        teamToEdit={teamToEdit}
        allUsers={users}
        onSaved={refreshAll}
      />

      <DesignationFormModal
        isOpen={isDesignationModalOpen}
        onClose={() => setIsDesignationModalOpen(false)}
        designationToEdit={designationToEdit}
        onSaved={refreshAll}
      />

      <IncentivePlanModal
        isOpen={isIncentiveModalOpen}
        onClose={() => setIsIncentiveModalOpen(false)}
        planToEdit={planToEdit}
        onSaved={refreshAll}
      />

      {userForIncentive && (
        <AssignIncentiveModal
          isOpen={isAssignIncentiveOpen}
          onClose={() => {
            setIsAssignIncentiveOpen(false);
            setUserForIncentive(null);
          }}
          user={userForIncentive}
          allPlans={incentivePlans}
          onAssigned={refreshAll}
        />
      )}
    </div>
  );
}
