"use client";

import { ActivityLog, STORAGE_KEYS, DEFAULT_ORG_ID, getCurrentUser, SEED_ACTIVITY_LOGS } from "@/data/teamData";

const MAX_LOGS = 200;

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function getStoredActivities(): ActivityLog[] {
  if (!isBrowser()) return SEED_ACTIVITY_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(SEED_ACTIVITY_LOGS));
      return SEED_ACTIVITY_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_ACTIVITY_LOGS;
  } catch {
    return SEED_ACTIVITY_LOGS;
  }
}

export function saveActivities(logs: ActivityLog[]): void {
  if (!isBrowser()) return;
  try {
    const pruned = logs.slice(0, MAX_LOGS);
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(pruned));
  } catch (e) {
    console.error("Failed to save activity logs", e);
  }
}

export function logActivity(params: {
  action: string;
  module: string;
  entityType: string;
  entityId: string;
  entityName: string;
  type?: "activity" | "audit";
  metadata?: Record<string, unknown>;
  userId?: string;
  userName?: string;
}): ActivityLog {
  const currentActor = getCurrentUser();
  const userId = params.userId || currentActor.id;
  const userName = params.userName || currentActor.name;

  const newLog: ActivityLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    organizationId: DEFAULT_ORG_ID,
    userId,
    userName,
    type: params.type || "activity",
    action: params.action,
    module: params.module,
    entityType: params.entityType,
    entityId: params.entityId,
    entityName: params.entityName,
    metadata: params.metadata,
    createdAt: new Date().toISOString(),
  };

  const logs = getStoredActivities();
  const updated = [newLog, ...logs];
  saveActivities(updated);

  return newLog;
}

export function filterActivities(
  logs: ActivityLog[],
  filters: {
    userId?: string;
    module?: string;
    type?: "activity" | "audit";
    dateRange?: "today" | "this_week" | "this_month" | "all_time";
  }
): ActivityLog[] {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = startOfDay - now.getDay() * 86400000;
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  return logs.filter((log) => {
    if (filters.userId && log.userId !== filters.userId) return false;
    if (filters.module && filters.module !== "all" && log.module !== filters.module) return false;
    if (filters.type && log.type !== filters.type) return false;

    if (filters.dateRange && filters.dateRange !== "all_time") {
      const time = new Date(log.createdAt).getTime();
      if (Number.isNaN(time)) return true;
      if (filters.dateRange === "today" && time < startOfDay) return false;
      if (filters.dateRange === "this_week" && time < startOfWeek) return false;
      if (filters.dateRange === "this_month" && time < startOfMonth) return false;
    }

    return true;
  });
}
