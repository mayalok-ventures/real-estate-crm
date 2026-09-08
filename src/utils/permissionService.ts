"use client";

import { ALL_PERMISSIONS, PermissionDefinition } from "@/config/permissions";
import {
  User,
  getStoredDesignations,
  getStoredPermissionOverrides,
} from "@/data/teamData";

export function getUserEffectivePermissions(user: User): string[] {
  if (!user || user.status !== "active") return [];

  const designations = getStoredDesignations();
  const designation = designations.find((d) => d.id === user.designationId);
  const basePermissions = new Set(designation ? designation.permissionIds : []);

  const overrides = getStoredPermissionOverrides();
  const userOverride = overrides[user.id];

  if (userOverride) {
    // Add custom grants
    userOverride.grantedPermissionIds?.forEach((p) => basePermissions.add(p));
    // Remove custom revocations
    userOverride.revokedPermissionIds?.forEach((p) => basePermissions.delete(p));
  }

  return Array.from(basePermissions);
}

export function hasPermission(user: User | null | undefined, permissionId: string): boolean {
  if (!user) return false;
  if (user.status !== "active") return false;
  const effective = getUserEffectivePermissions(user);
  return effective.includes(permissionId);
}

export function canAccessModule(user: User | null | undefined, moduleName: string): boolean {
  if (!user) return false;
  if (user.status !== "active") return false;

  const modulePermissionMap: Record<string, string> = {
    dashboard: "dashboard.view",
    leads: "leads.view",
    pipeline: "pipeline.view",
    products: "products.view",
    followups: "followups.view",
    site_visits: "site_visits.view",
    whatsapp: "whatsapp.view",
    analytics: "analytics.view",
    groups: "groups.view",
    integrations: "integrations.view",
    team: "team.view",
    settings: "settings.view",
  };

  const required = modulePermissionMap[moduleName.toLowerCase()];
  if (!required) return true;
  return hasPermission(user, required);
}

export interface PermissionDetailItem {
  permission: PermissionDefinition;
  isAllowed: boolean;
  source: "designation" | "override_grant" | "override_revoke" | "none";
}

export function getEffectivePermissionsDetail(user: User): PermissionDetailItem[] {
  const designations = getStoredDesignations();
  const designation = designations.find((d) => d.id === user.designationId);
  const baseSet = new Set(designation ? designation.permissionIds : []);

  const overrides = getStoredPermissionOverrides();
  const userOverride = overrides[user.id];
  const grantSet = new Set(userOverride?.grantedPermissionIds || []);
  const revokeSet = new Set(userOverride?.revokedPermissionIds || []);

  return ALL_PERMISSIONS.map((perm) => {
    let source: "designation" | "override_grant" | "override_revoke" | "none" = "none";
    let isAllowed = false;

    if (revokeSet.has(perm.id)) {
      source = "override_revoke";
      isAllowed = false;
    } else if (grantSet.has(perm.id)) {
      source = "override_grant";
      isAllowed = true;
    } else if (baseSet.has(perm.id)) {
      source = "designation";
      isAllowed = true;
    }

    return {
      permission: perm,
      isAllowed,
      source,
    };
  });
}

/**
 * Feature Entitlement Gating Abstraction
 * Currently enabled for demo prototype; prepares future backend subscription tier checks.
 */
export function hasFeature(featureKey: string): boolean {
  // Prototype allows full capability. Future backend will enforce subscription plan tiers.
  if (typeof featureKey === "string" && featureKey.length > 0) return true;
  return true;
}

export function getFeatureAccess(featureKey: string): { enabled: boolean; featureKey: string } {
  return {
    enabled: hasFeature(featureKey),
    featureKey,
  };
}
