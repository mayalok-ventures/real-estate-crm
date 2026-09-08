export type PermissionCategory =
  | "DASHBOARD"
  | "LEADS"
  | "PIPELINE"
  | "PROJECTS & PRODUCTS"
  | "FOLLOW-UPS"
  | "SITE VISITS"
  | "WHATSAPP"
  | "ANALYTICS"
  | "GROUPS"
  | "INTEGRATIONS"
  | "TEAM MANAGEMENT"
  | "SETTINGS"
  | "DATA IMPORT & EXPORT"
  | "BILLING & PLAN";

export interface PermissionDefinition {
  id: string;
  category: PermissionCategory;
  label: string;
  description: string;
}

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  // 1. DASHBOARD
  {
    id: "dashboard.view",
    category: "DASHBOARD",
    label: "View Dashboard",
    description: "Access executive summary metrics, urgent follow-ups, and recent activity overview.",
  },

  // 2. LEADS
  {
    id: "leads.view",
    category: "LEADS",
    label: "View Assigned Leads",
    description: "View and filter leads specifically assigned to this user.",
  },
  {
    id: "leads.view_all",
    category: "LEADS",
    label: "View All Leads",
    description: "View all organizational buyer inquiries across all team members.",
  },
  {
    id: "leads.create",
    category: "LEADS",
    label: "Create Leads",
    description: "Add new prospect profiles, contact details, and initial requirements.",
  },
  {
    id: "leads.edit_assigned",
    category: "LEADS",
    label: "Edit Assigned Leads",
    description: "Modify notes, project preferences, budget, and statuses for assigned prospects.",
  },
  {
    id: "leads.edit_all",
    category: "LEADS",
    label: "Edit All Leads",
    description: "Modify any lead record in the organization regardless of assignment.",
  },
  {
    id: "leads.delete",
    category: "LEADS",
    label: "Delete Leads",
    description: "Remove invalid or junk lead records from the active directory.",
  },
  {
    id: "leads.assign",
    category: "LEADS",
    label: "Assign Leads",
    description: "Assign newly received or unassigned leads to team members.",
  },
  {
    id: "leads.reassign",
    category: "LEADS",
    label: "Reassign Leads",
    description: "Change lead advisor assignment from one team member to another.",
  },

  // 3. PIPELINE
  {
    id: "pipeline.view",
    category: "PIPELINE",
    label: "View Personal Pipeline",
    description: "Inspect visual Kanban deal stages for assigned prospects.",
  },
  {
    id: "pipeline.view_all",
    category: "PIPELINE",
    label: "View Team Pipeline",
    description: "Inspect organization-wide Kanban board across all stages.",
  },
  {
    id: "pipeline.edit",
    category: "PIPELINE",
    label: "Advance Deal Stages",
    description: "Drag and transition leads between negotiation, token, and converted stages.",
  },
  {
    id: "pipeline.manage_stages",
    category: "PIPELINE",
    label: "Configure Pipeline Stages",
    description: "Add, reorder, or rename CRM sales pipeline stages.",
  },

  // 4. PROJECTS & PRODUCTS
  {
    id: "products.view",
    category: "PROJECTS & PRODUCTS",
    label: "View Projects & Inventory",
    description: "Browse master catalog, tower units, configurations, and price lists.",
  },
  {
    id: "products.create",
    category: "PROJECTS & PRODUCTS",
    label: "Create Projects & Units",
    description: "Add new developer projects, floor plans, configurations, and amenities.",
  },
  {
    id: "products.edit",
    category: "PROJECTS & PRODUCTS",
    label: "Edit Projects & Inventory",
    description: "Update pricing, unit availability status, brochures, and developer information.",
  },
  {
    id: "products.delete",
    category: "PROJECTS & PRODUCTS",
    label: "Archive/Delete Projects",
    description: "Remove obsolete projects or sold-out inventory listings.",
  },

  // 5. FOLLOW-UPS
  {
    id: "followups.view",
    category: "FOLLOW-UPS",
    label: "View Assigned Follow-ups",
    description: "Access personal follow-up schedules, calls, and meetings due today.",
  },
  {
    id: "followups.view_all",
    category: "FOLLOW-UPS",
    label: "View All Follow-ups",
    description: "Inspect team-wide follow-up queues, overdue tasks, and completion logs.",
  },
  {
    id: "followups.create",
    category: "FOLLOW-UPS",
    label: "Schedule Follow-ups",
    description: "Book new reminder dates, call schedules, and task notes.",
  },
  {
    id: "followups.edit",
    category: "FOLLOW-UPS",
    label: "Reschedule Follow-ups",
    description: "Reschedule existing follow-up tasks with mandatory business reasons.",
  },
  {
    id: "followups.close",
    category: "FOLLOW-UPS",
    label: "Mark Follow-ups Completed",
    description: "Complete and log call outcome notes and next action requirements.",
  },

  // 6. SITE VISITS
  {
    id: "site_visits.view",
    category: "SITE VISITS",
    label: "View Site Visits",
    description: "Inspect scheduled property walkthroughs and tour agendas.",
  },
  {
    id: "site_visits.create",
    category: "SITE VISITS",
    label: "Schedule Site Visits",
    description: "Book buyer visits to developer project sites with pickup and dates.",
  },
  {
    id: "site_visits.edit",
    category: "SITE VISITS",
    label: "Update Site Visits",
    description: "Modify tour timings, accompanying advisors, and meeting locations.",
  },
  {
    id: "site_visits.complete",
    category: "SITE VISITS",
    label: "Record Visit Outcome",
    description: "Log buyer interest feedback and unit preferences following a visit.",
  },

  // 7. WHATSAPP
  {
    id: "whatsapp.view",
    category: "WHATSAPP",
    label: "Access WhatsApp Hub",
    description: "View connected pairing status, chat history, and template list.",
  },
  {
    id: "whatsapp.send",
    category: "WHATSAPP",
    label: "Send WhatsApp Messages",
    description: "Dispatch template messages and digital brochures to buyer prospects.",
  },
  {
    id: "whatsapp.manage_templates",
    category: "WHATSAPP",
    label: "Manage WhatsApp Templates",
    description: "Create, edit, and attach media collateral to reusable outreach templates.",
  },

  // 8. ANALYTICS
  {
    id: "analytics.view",
    category: "ANALYTICS",
    label: "View Personal Analytics",
    description: "Review personal lead velocity, visit-to-deal ratio, and closing days.",
  },
  {
    id: "analytics.view_team",
    category: "ANALYTICS",
    label: "View Team Analytics",
    description: "Compare performance between teams, channels, and conversion funnels.",
  },
  {
    id: "analytics.view_all",
    category: "ANALYTICS",
    label: "View Company Analytics",
    description: "Access executive company-wide revenue, total commission won, and pipeline value.",
  },
  {
    id: "analytics.export",
    category: "ANALYTICS",
    label: "Export Analytics Data",
    description: "Download multi-sheet Excel workbooks and CSV metrics datasets.",
  },

  // 9. GROUPS
  {
    id: "groups.view",
    category: "GROUPS",
    label: "View Buyer Groups",
    description: "Inspect segmented lists (e.g. NRI investors, luxury villa buyers).",
  },
  {
    id: "groups.create",
    category: "GROUPS",
    label: "Create Buyer Groups",
    description: "Build new investor cohorts and targeted broadcast segments.",
  },
  {
    id: "groups.edit",
    category: "GROUPS",
    label: "Edit Buyer Groups",
    description: "Add or remove prospects from curated broadcast lists.",
  },
  {
    id: "groups.delete",
    category: "GROUPS",
    label: "Delete Buyer Groups",
    description: "Remove obsolete broadcast and investor segments.",
  },

  // 10. INTEGRATIONS
  {
    id: "integrations.view",
    category: "INTEGRATIONS",
    label: "View Connected Channels",
    description: "Check status of Meta Ads, Google Discovery, and portal lead webhooks.",
  },
  {
    id: "integrations.manage",
    category: "INTEGRATIONS",
    label: "Configure Integrations",
    description: "Connect or disconnect external API keys, tokens, and lead ingestion webhooks.",
  },

  // 11. TEAM MANAGEMENT
  {
    id: "team.view",
    category: "TEAM MANAGEMENT",
    label: "View Team Directory",
    description: "Browse list of company members, teams, and designations.",
  },
  {
    id: "team.create",
    category: "TEAM MANAGEMENT",
    label: "Create Teams & Designations",
    description: "Set up new custom company teams and role/designation permission templates.",
  },
  {
    id: "team.edit",
    category: "TEAM MANAGEMENT",
    label: "Edit Teams & Designations",
    description: "Modify team members, assigned team leads, and designation permission sets.",
  },
  {
    id: "team.delete",
    category: "TEAM MANAGEMENT",
    label: "Archive Teams",
    description: "Archive retired company teams or deprecated designations.",
  },
  {
    id: "team.manage_users",
    category: "TEAM MANAGEMENT",
    label: "Create & Edit Users",
    description: "Add new employees, edit profiles, assign teams/designations, and toggle active status.",
  },
  {
    id: "team.manage_permissions",
    category: "TEAM MANAGEMENT",
    label: "Grant/Revoke User Overrides",
    description: "Configure custom individual permission overrides beyond designation defaults.",
  },
  {
    id: "team.view_activity",
    category: "TEAM MANAGEMENT",
    label: "View Audit & Activity Logs",
    description: "Inspect timeline of user CRM actions and sensitive administrative events.",
  },
  {
    id: "team.manage_incentives",
    category: "TEAM MANAGEMENT",
    label: "Manage Incentive Structures",
    description: "Create, edit, and assign commission slabs and incentive plans to members.",
  },

  // 12. SETTINGS
  {
    id: "settings.view",
    category: "SETTINGS",
    label: "View Company Settings",
    description: "Review broker business profile, branding, and lead form configuration.",
  },
  {
    id: "settings.edit",
    category: "SETTINGS",
    label: "Modify Company Settings",
    description: "Update company profile, RERA registration, and custom lead field schemas.",
  },

  // 13. DATA IMPORT & EXPORT
  {
    id: "leads.import",
    category: "DATA IMPORT & EXPORT",
    label: "Import Leads from Spreadsheet",
    description: "Upload CSV/Excel files, configure smart column mappings, and batch insert prospects.",
  },
  {
    id: "leads.export",
    category: "DATA IMPORT & EXPORT",
    label: "Export Leads to File",
    description: "Download verified spreadsheet records in Excel (.xlsx) or CSV format.",
  },

  // 14. BILLING & PLAN
  {
    id: "billing.view",
    category: "BILLING & PLAN",
    label: "View Subscription & Plan",
    description: "Inspect organization license tier, renewal dates, and feature access.",
  },
  {
    id: "billing.manage",
    category: "BILLING & PLAN",
    label: "Manage Plan & Add-ons",
    description: "Upgrade subscription package, purchase additional user seats, and view invoices.",
  },
];

export const CATEGORY_ORDER: PermissionCategory[] = [
  "DASHBOARD",
  "LEADS",
  "PIPELINE",
  "PROJECTS & PRODUCTS",
  "FOLLOW-UPS",
  "SITE VISITS",
  "WHATSAPP",
  "ANALYTICS",
  "GROUPS",
  "INTEGRATIONS",
  "TEAM MANAGEMENT",
  "SETTINGS",
  "DATA IMPORT & EXPORT",
  "BILLING & PLAN",
];

export function getAllPermissions(): PermissionDefinition[] {
  return ALL_PERMISSIONS;
}

export function getPermissionsByCategory(): Record<PermissionCategory, PermissionDefinition[]> {
  const map = {} as Record<PermissionCategory, PermissionDefinition[]>;
  for (const cat of CATEGORY_ORDER) {
    map[cat] = [];
  }
  for (const p of ALL_PERMISSIONS) {
    if (!map[p.category]) {
      map[p.category] = [];
    }
    map[p.category].push(p);
  }
  return map;
}

export function getPermissionById(id: string): PermissionDefinition | undefined {
  return ALL_PERMISSIONS.find((p) => p.id === id);
}
