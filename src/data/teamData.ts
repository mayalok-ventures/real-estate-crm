"use client";

import { ALL_PERMISSIONS } from "@/config/permissions";

export interface User {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  employeeId?: string;
  department?: string;
  designationId: string;
  teamId?: string;
  status: "active" | "inactive" | "invited" | "suspended";
  joiningDate: string;
  reportingManagerId?: string;
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string;
  avatarInitials?: string;
  authUserId?: string;
}

export interface Team {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  teamLeadUserId?: string;
  memberUserIds: string[];
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface DesignationRole {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  permissionIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPermissionOverride {
  userId: string;
  grantedPermissionIds: string[];
  revokedPermissionIds: string[];
  updatedAt: string;
}

export interface IncentiveSlab {
  minDeals: number;
  maxDeals: number | null;
  amountPerDeal: number;
}

export interface IncentiveRules {
  fixedAmountPerDeal?: number;
  percentageOfDealValue?: number;
  percentageOfBrokerage?: number;
  slabs?: IncentiveSlab[];
  targetAmount?: number;
  targetIncentiveAmount?: number;
  customNote?: string;
}

export interface IncentivePlan {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  type: "fixed" | "deal_percentage" | "commission_percentage" | "slab" | "target" | "custom";
  rules: IncentiveRules;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface UserIncentiveAssignment {
  id: string;
  userId: string;
  incentivePlanId: string;
  effectiveFrom: string;
  effectiveTo?: string;
  customOverrides?: Record<string, unknown>;
}

export interface ActivityLog {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  type: "activity" | "audit";
  action: string;
  module: string;
  entityType: string;
  entityId: string;
  entityName: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// Storage keys
export const STORAGE_KEYS = {
  USERS: "sahyak_crm_users_v1",
  TEAMS: "sahyak_crm_teams_v1",
  DESIGNATIONS: "sahyak_crm_roles_v1",
  OVERRIDES: "sahyak_crm_user_permission_overrides_v1",
  INCENTIVE_PLANS: "sahyak_crm_incentive_plans_v1",
  USER_INCENTIVES: "sahyak_crm_user_incentives_v1",
  ACTIVITY_LOGS: "sahyak_crm_activity_logs_v1",
  CURRENT_USER: "sahyak_crm_current_user_v1",
} as const;

export const DEFAULT_ORG_ID = "org_sahyak_main";

// Seed Designations (Sample company-defined templates)
export const SEED_DESIGNATIONS: DesignationRole[] = [
  {
    id: "desig_founder",
    organizationId: DEFAULT_ORG_ID,
    name: "Founder & Principal Broker",
    description: "Unrestricted operational, team, and financial management access.",
    permissionIds: ALL_PERMISSIONS.map((p) => p.id),
    createdAt: "2026-08-01T09:00:00.000Z",
    updatedAt: "2026-08-01T09:00:00.000Z",
  },
  {
    id: "desig_sales_lead",
    organizationId: DEFAULT_ORG_ID,
    name: "Sales Lead & Team Manager",
    description: "Oversees team pipeline, assigns leads, views team analytics, and manages site visits.",
    permissionIds: [
      "dashboard.view",
      "leads.view",
      "leads.view_all",
      "leads.create",
      "leads.edit_assigned",
      "leads.edit_all",
      "leads.assign",
      "leads.reassign",
      "leads.import",
      "leads.export",
      "pipeline.view",
      "pipeline.view_all",
      "pipeline.edit",
      "products.view",
      "followups.view",
      "followups.view_all",
      "followups.create",
      "followups.edit",
      "followups.close",
      "site_visits.view",
      "site_visits.create",
      "site_visits.edit",
      "site_visits.complete",
      "whatsapp.view",
      "whatsapp.send",
      "whatsapp.manage_templates",
      "analytics.view",
      "analytics.view_team",
      "analytics.export",
      "groups.view",
      "groups.create",
      "team.view",
    ],
    createdAt: "2026-08-01T09:00:00.000Z",
    updatedAt: "2026-08-01T09:00:00.000Z",
  },
  {
    id: "desig_senior_consultant",
    organizationId: DEFAULT_ORG_ID,
    name: "Senior Property Consultant",
    description: "Manages assigned high-intent prospects, conducts property tours, and closes deals.",
    permissionIds: [
      "dashboard.view",
      "leads.view",
      "leads.create",
      "leads.edit_assigned",
      "leads.export",
      "pipeline.view",
      "pipeline.edit",
      "products.view",
      "followups.view",
      "followups.create",
      "followups.edit",
      "followups.close",
      "site_visits.view",
      "site_visits.create",
      "site_visits.edit",
      "site_visits.complete",
      "whatsapp.view",
      "whatsapp.send",
      "analytics.view",
      "groups.view",
    ],
    createdAt: "2026-08-01T09:00:00.000Z",
    updatedAt: "2026-08-01T09:00:00.000Z",
  },
  {
    id: "desig_relationship_exec",
    organizationId: DEFAULT_ORG_ID,
    name: "Relationship Executive",
    description: "Handles primary client engagement, scheduled call follow-ups, and site visit bookings.",
    permissionIds: [
      "dashboard.view",
      "leads.view",
      "leads.create",
      "leads.edit_assigned",
      "pipeline.view",
      "products.view",
      "followups.view",
      "followups.create",
      "followups.edit",
      "followups.close",
      "site_visits.view",
      "site_visits.create",
      "whatsapp.view",
      "whatsapp.send",
    ],
    createdAt: "2026-08-01T09:00:00.000Z",
    updatedAt: "2026-08-01T09:00:00.000Z",
  },
];

// Seed Teams
export const SEED_TEAMS: Team[] = [
  {
    id: "team_luxury",
    organizationId: DEFAULT_ORG_ID,
    name: "Luxury & High-Rise Advisory",
    description: "Focuses on high-ticket luxury penthouses, duplexes, and premium gated communities.",
    teamLeadUserId: "user_priya",
    memberUserIds: ["user_rohan", "user_priya"],
    status: "active",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "team_commercial",
    organizationId: DEFAULT_ORG_ID,
    name: "Commercial & Plots Division",
    description: "Handles grade-A office spaces, retail showrooms, and development land parcels.",
    teamLeadUserId: "user_amit",
    memberUserIds: ["user_amit"],
    status: "active",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "team_inside_sales",
    organizationId: DEFAULT_ORG_ID,
    name: "Inside Sales & Telecalling",
    description: "Qualifies inbound digital leads from Meta Ads, Google search, and website portals.",
    teamLeadUserId: "user_sunita",
    memberUserIds: ["user_sunita"],
    status: "active",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-01T10:00:00.000Z",
  },
];

// Seed Users (Aligned with existing mock advisors)
export const SEED_USERS: User[] = [
  {
    id: "user_rohan",
    organizationId: DEFAULT_ORG_ID,
    name: "Rohan Verma",
    email: "rohan@vermaestates.in",
    phone: "+91 98201 23456",
    jobTitle: "Founder & Principal Broker",
    employeeId: "EMP-001",
    department: "Executive Management",
    designationId: "desig_founder",
    teamId: "team_luxury",
    status: "active",
    joiningDate: "2024-01-15",
    createdAt: "2026-08-01T09:00:00.000Z",
    updatedAt: "2026-08-01T09:00:00.000Z",
    lastActiveAt: "Just now",
    avatarInitials: "RV",
  },
  {
    id: "user_priya",
    organizationId: DEFAULT_ORG_ID,
    name: "Priya Nambiar",
    email: "priya@vermaestates.in",
    phone: "+91 98450 67890",
    jobTitle: "Sales Lead & Senior Advisor",
    employeeId: "EMP-002",
    department: "Sales",
    designationId: "desig_sales_lead",
    teamId: "team_luxury",
    status: "active",
    joiningDate: "2024-06-01",
    reportingManagerId: "user_rohan",
    createdAt: "2026-08-01T09:00:00.000Z",
    updatedAt: "2026-08-01T09:00:00.000Z",
    lastActiveAt: "10 mins ago",
    avatarInitials: "PN",
  },
  {
    id: "user_amit",
    organizationId: DEFAULT_ORG_ID,
    name: "Amit Kulkarni",
    email: "amit@vermaestates.in",
    phone: "+91 97654 32109",
    jobTitle: "Senior Property Consultant",
    employeeId: "EMP-003",
    department: "Sales",
    designationId: "desig_senior_consultant",
    teamId: "team_commercial",
    status: "active",
    joiningDate: "2024-11-15",
    reportingManagerId: "user_priya",
    createdAt: "2026-08-01T09:00:00.000Z",
    updatedAt: "2026-08-01T09:00:00.000Z",
    lastActiveAt: "25 mins ago",
    avatarInitials: "AK",
  },
  {
    id: "user_sunita",
    organizationId: DEFAULT_ORG_ID,
    name: "Sunita Rao",
    email: "sunita@vermaestates.in",
    phone: "+91 99123 45678",
    jobTitle: "Relationship Executive",
    employeeId: "EMP-004",
    department: "Inside Sales",
    designationId: "desig_relationship_exec",
    teamId: "team_inside_sales",
    status: "active",
    joiningDate: "2025-02-01",
    reportingManagerId: "user_priya",
    createdAt: "2026-08-01T09:00:00.000Z",
    updatedAt: "2026-08-01T09:00:00.000Z",
    lastActiveAt: "1 hour ago",
    avatarInitials: "SR",
  },
];

// Seed Incentive Plans
export const SEED_INCENTIVE_PLANS: IncentivePlan[] = [
  {
    id: "plan_fixed_deal",
    organizationId: DEFAULT_ORG_ID,
    name: "Fixed Deal Closure Bonus",
    description: "Standard payout of ₹5,000 for every successfully closed transaction.",
    type: "fixed",
    rules: { fixedAmountPerDeal: 5000 },
    status: "active",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "plan_brokerage_share",
    organizationId: DEFAULT_ORG_ID,
    name: "10% Brokerage Commission Share",
    description: "10% payout based on total gross agency brokerage earned from the transaction.",
    type: "commission_percentage",
    rules: { percentageOfBrokerage: 10 },
    status: "active",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "plan_slabs",
    organizationId: DEFAULT_ORG_ID,
    name: "Graduated Deal Volume Slabs",
    description: "1–3 deals: ₹2,500 each; 4–7 deals: ₹4,000 each; 8+ deals: ₹6,000 each.",
    type: "slab",
    rules: {
      slabs: [
        { minDeals: 1, maxDeals: 3, amountPerDeal: 2500 },
        { minDeals: 4, maxDeals: 7, amountPerDeal: 4000 },
        { minDeals: 8, maxDeals: null, amountPerDeal: 6000 },
      ],
    },
    status: "active",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "plan_quarterly_target",
    organizationId: DEFAULT_ORG_ID,
    name: "Quarterly ₹1 Cr Value Milestone",
    description: "Lump-sum ₹25,000 reward for achieving ₹1,00,00,000 in aggregate booked value.",
    type: "target",
    rules: {
      targetAmount: 10000000,
      targetIncentiveAmount: 25000,
    },
    status: "active",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-01T10:00:00.000Z",
  },
];

// Seed User Incentive Assignments
export const SEED_USER_INCENTIVES: UserIncentiveAssignment[] = [
  {
    id: "uinc_priya",
    userId: "user_priya",
    incentivePlanId: "plan_brokerage_share",
    effectiveFrom: "2026-01-01",
  },
  {
    id: "uinc_amit",
    userId: "user_amit",
    incentivePlanId: "plan_slabs",
    effectiveFrom: "2026-01-01",
  },
  {
    id: "uinc_sunita",
    userId: "user_sunita",
    incentivePlanId: "plan_fixed_deal",
    effectiveFrom: "2026-01-01",
  },
];

// Seed Activity Logs
export const SEED_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "log_1",
    organizationId: DEFAULT_ORG_ID,
    userId: "user_rohan",
    userName: "Rohan Verma",
    type: "audit",
    action: "team_created",
    module: "team",
    entityType: "team",
    entityId: "team_luxury",
    entityName: "Luxury & High-Rise Advisory",
    createdAt: "2026-09-08T06:30:00.000Z",
  },
  {
    id: "log_2",
    organizationId: DEFAULT_ORG_ID,
    userId: "user_priya",
    userName: "Priya Nambiar",
    type: "activity",
    action: "lead_stage_updated",
    module: "pipeline",
    entityType: "lead",
    entityId: "lead_2",
    entityName: "Vikram Malhotra",
    metadata: { previousStage: "site_visit", newStage: "negotiation" },
    createdAt: "2026-09-08T07:15:00.000Z",
  },
  {
    id: "log_3",
    organizationId: DEFAULT_ORG_ID,
    userId: "user_amit",
    userName: "Amit Kulkarni",
    type: "activity",
    action: "site_visit_completed",
    module: "site_visits",
    entityType: "site_visit",
    entityId: "sv_1",
    entityName: "Rajesh Kulkarni @ The Grand Arch",
    createdAt: "2026-09-08T07:45:00.000Z",
  },
];

// LocalStorage helpers

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

// 1. Users
export function getStoredUsers(): User[] {
  if (!isBrowser()) return SEED_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_USERS;
  } catch {
    return SEED_USERS;
  }
}

export function saveUsers(users: User[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save users to localStorage", e);
  }
}

export function addUserToStore(user: Omit<User, "id" | "createdAt" | "updatedAt">): User {
  const users = getStoredUsers();
  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  const newUser: User = {
    ...user,
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    avatarInitials: initials,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newUser, ...users];
  saveUsers(updated);

  // If assigned to a team, also add to team's memberUserIds
  if (newUser.teamId) {
    const teams = getStoredTeams();
    const teamIndex = teams.findIndex((t) => t.id === newUser.teamId);
    if (teamIndex !== -1 && !teams[teamIndex].memberUserIds.includes(newUser.id)) {
      teams[teamIndex].memberUserIds.push(newUser.id);
      teams[teamIndex].updatedAt = new Date().toISOString();
      saveTeams(teams);
    }
  }

  return newUser;
}

export function updateUserInStore(updatedUser: User): User[] {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === updatedUser.id);
  if (idx === -1) return users;

  const previousTeamId = users[idx].teamId;
  const newTeamId = updatedUser.teamId;

  const list = [...users];
  list[idx] = {
    ...updatedUser,
    updatedAt: new Date().toISOString(),
  };
  saveUsers(list);

  // Synchronize team member list if team changed
  if (previousTeamId !== newTeamId) {
    const teams = getStoredTeams();
    // Remove from previous team
    if (previousTeamId) {
      const prevIdx = teams.findIndex((t) => t.id === previousTeamId);
      if (prevIdx !== -1) {
        teams[prevIdx].memberUserIds = teams[prevIdx].memberUserIds.filter((id) => id !== updatedUser.id);
        teams[prevIdx].updatedAt = new Date().toISOString();
      }
    }
    // Add to new team
    if (newTeamId) {
      const nextIdx = teams.findIndex((t) => t.id === newTeamId);
      if (nextIdx !== -1 && !teams[nextIdx].memberUserIds.includes(updatedUser.id)) {
        teams[nextIdx].memberUserIds.push(updatedUser.id);
        teams[nextIdx].updatedAt = new Date().toISOString();
      }
    }
    saveTeams(teams);
  }

  return list;
}

// 2. Teams
export function getStoredTeams(): Team[] {
  if (!isBrowser()) return SEED_TEAMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEAMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(SEED_TEAMS));
      return SEED_TEAMS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_TEAMS;
  } catch {
    return SEED_TEAMS;
  }
}

export function saveTeams(teams: Team[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  } catch (e) {
    console.error("Failed to save teams to localStorage", e);
  }
}

export function addTeamToStore(teamData: {
  name: string;
  description: string;
  teamLeadUserId?: string;
  memberUserIds: string[];
}): Team {
  const teams = getStoredTeams();
  const newTeam: Team = {
    id: `team_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    organizationId: DEFAULT_ORG_ID,
    name: teamData.name,
    description: teamData.description,
    teamLeadUserId: teamData.teamLeadUserId,
    memberUserIds: teamData.memberUserIds,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [...teams, newTeam];
  saveTeams(updated);

  // Update users' teamId for assigned members
  if (teamData.memberUserIds.length > 0) {
    const users = getStoredUsers();
    let changed = false;
    users.forEach((u) => {
      if (teamData.memberUserIds.includes(u.id) && u.teamId !== newTeam.id) {
        u.teamId = newTeam.id;
        changed = true;
      }
    });
    if (changed) saveUsers(users);
  }

  return newTeam;
}

export function updateTeamInStore(updatedTeam: Team): Team[] {
  const teams = getStoredTeams();
  const idx = teams.findIndex((t) => t.id === updatedTeam.id);
  if (idx === -1) return teams;

  const list = [...teams];
  list[idx] = {
    ...updatedTeam,
    updatedAt: new Date().toISOString(),
  };
  saveTeams(list);

  // Synchronize teamId in users
  const users = getStoredUsers();
  let changed = false;
  users.forEach((u) => {
    const shouldBeInTeam = updatedTeam.memberUserIds.includes(u.id);
    if (shouldBeInTeam && u.teamId !== updatedTeam.id) {
      u.teamId = updatedTeam.id;
      changed = true;
    } else if (!shouldBeInTeam && u.teamId === updatedTeam.id) {
      u.teamId = undefined;
      changed = true;
    }
  });
  if (changed) saveUsers(users);

  return list;
}

export function archiveTeamInStore(teamId: string): Team[] {
  const teams = getStoredTeams();
  const list = teams.map((t) =>
    t.id === teamId ? { ...t, status: "archived" as const, updatedAt: new Date().toISOString() } : t
  );
  saveTeams(list);
  return list;
}

// 3. Designations / Roles (Company-defined permission templates)
export function getStoredDesignations(): DesignationRole[] {
  if (!isBrowser()) return SEED_DESIGNATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DESIGNATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DESIGNATIONS, JSON.stringify(SEED_DESIGNATIONS));
      return SEED_DESIGNATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_DESIGNATIONS;
  } catch {
    return SEED_DESIGNATIONS;
  }
}

export function saveDesignations(designations: DesignationRole[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.DESIGNATIONS, JSON.stringify(designations));
  } catch (e) {
    console.error("Failed to save designations to localStorage", e);
  }
}

export function addDesignationToStore(data: {
  name: string;
  description: string;
  permissionIds: string[];
}): DesignationRole {
  const designations = getStoredDesignations();
  const newDesignation: DesignationRole = {
    id: `desig_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    organizationId: DEFAULT_ORG_ID,
    name: data.name,
    description: data.description,
    permissionIds: data.permissionIds,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [...designations, newDesignation];
  saveDesignations(updated);
  return newDesignation;
}

export function updateDesignationInStore(updated: DesignationRole): DesignationRole[] {
  const list = getStoredDesignations();
  const idx = list.findIndex((d) => d.id === updated.id);
  if (idx === -1) return list;
  list[idx] = {
    ...updated,
    updatedAt: new Date().toISOString(),
  };
  saveDesignations(list);
  return list;
}

export function deleteDesignationFromStore(id: string): { success: boolean; message?: string } {
  const users = getStoredUsers();
  const inUse = users.some((u) => u.designationId === id);
  if (inUse) {
    return {
      success: false,
      message: "Cannot delete designation while members are assigned to it. Please reassign members first.",
    };
  }
  const list = getStoredDesignations().filter((d) => d.id !== id);
  saveDesignations(list);
  return { success: true };
}

// 4. Permission Overrides (Per-user grant/revoke)
export function getStoredPermissionOverrides(): Record<string, UserPermissionOverride> {
  if (!isBrowser()) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OVERRIDES);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function savePermissionOverrides(overrides: Record<string, UserPermissionOverride>): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.OVERRIDES, JSON.stringify(overrides));
  } catch (e) {
    console.error("Failed to save overrides to localStorage", e);
  }
}

export function setUserPermissionOverride(
  userId: string,
  granted: string[],
  revoked: string[]
): UserPermissionOverride {
  const overrides = getStoredPermissionOverrides();
  const record: UserPermissionOverride = {
    userId,
    grantedPermissionIds: Array.from(new Set(granted)),
    revokedPermissionIds: Array.from(new Set(revoked)),
    updatedAt: new Date().toISOString(),
  };
  overrides[userId] = record;
  savePermissionOverrides(overrides);
  return record;
}

// 5. Incentive Plans & User Assignments
export function getStoredIncentivePlans(): IncentivePlan[] {
  if (!isBrowser()) return SEED_INCENTIVE_PLANS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INCENTIVE_PLANS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INCENTIVE_PLANS, JSON.stringify(SEED_INCENTIVE_PLANS));
      return SEED_INCENTIVE_PLANS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_INCENTIVE_PLANS;
  } catch {
    return SEED_INCENTIVE_PLANS;
  }
}

export function saveIncentivePlans(plans: IncentivePlan[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.INCENTIVE_PLANS, JSON.stringify(plans));
  } catch (e) {
    console.error("Failed to save incentive plans to localStorage", e);
  }
}

export function addIncentivePlanToStore(plan: Omit<IncentivePlan, "id" | "organizationId" | "createdAt" | "updatedAt">): IncentivePlan {
  const plans = getStoredIncentivePlans();
  const newPlan: IncentivePlan = {
    ...plan,
    id: `plan_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    organizationId: DEFAULT_ORG_ID,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updated = [...plans, newPlan];
  saveIncentivePlans(updated);
  return newPlan;
}

export function updateIncentivePlanInStore(updated: IncentivePlan): IncentivePlan[] {
  const plans = getStoredIncentivePlans();
  const idx = plans.findIndex((p) => p.id === updated.id);
  if (idx === -1) return plans;
  plans[idx] = {
    ...updated,
    updatedAt: new Date().toISOString(),
  };
  saveIncentivePlans(plans);
  return plans;
}

export function getStoredUserIncentives(): UserIncentiveAssignment[] {
  if (!isBrowser()) return SEED_USER_INCENTIVES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_INCENTIVES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER_INCENTIVES, JSON.stringify(SEED_USER_INCENTIVES));
      return SEED_USER_INCENTIVES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_USER_INCENTIVES;
  } catch {
    return SEED_USER_INCENTIVES;
  }
}

export function saveUserIncentives(list: UserIncentiveAssignment[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_INCENTIVES, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save user incentives to localStorage", e);
  }
}

export function assignIncentiveToUser(userId: string, planId: string, effectiveFrom: string = new Date().toISOString().split("T")[0]): UserIncentiveAssignment {
  const list = getStoredUserIncentives().filter((a) => a.userId !== userId);
  const newAssignment: UserIncentiveAssignment = {
    id: `uinc_${userId}_${Date.now()}`,
    userId,
    incentivePlanId: planId,
    effectiveFrom,
  };
  const updated = [...list, newAssignment];
  saveUserIncentives(updated);
  return newAssignment;
}

// 6. Current User Simulation (For demo / prototype role-testing)
export function getCurrentUser(): User {
  const users = getStoredUsers();
  if (!isBrowser()) return users[0] || SEED_USERS[0];
  try {
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (currentId) {
      const match = users.find((u) => u.id === currentId);
      if (match) return match;
    }
  } catch {}
  // Default to first active user (Rohan Verma)
  const defaultUser = users.find((u) => u.status === "active") || users[0] || SEED_USERS[0];
  if (isBrowser() && defaultUser) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, defaultUser.id);
    } catch {}
  }
  return defaultUser;
}

export function setCurrentUser(userId: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
    window.dispatchEvent(new CustomEvent("sahyak_user_changed", { detail: userId }));
  } catch (e) {
    console.error("Failed to set current user", e);
  }
}
