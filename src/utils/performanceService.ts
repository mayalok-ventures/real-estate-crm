"use client";

import { Lead } from "@/data/mockData";
import {
  User,
  Team,
  IncentivePlan,
  getStoredIncentivePlans,
  getStoredUserIncentives,
} from "@/data/teamData";

export interface UserPerformanceMetrics {
  userId: string;
  totalLeads: number;
  activeLeads: number;
  hotLeads: number;
  convertedLeads: number;
  conversionRate: string;
  totalFollowUps: number;
  completedFollowUps: number;
  overdueFollowUps: number;
  followUpCompletionRate: string;
  siteVisitsCount: number;
  totalDealValueNumeric: number;
  totalDealValueFormatted: string;
  estimatedIncentiveNumeric: number;
  estimatedIncentiveFormatted: string;
  incentivePlanName: string;
}

export interface TeamPerformanceMetrics {
  teamId: string;
  teamName: string;
  membersCount: number;
  activeMembersCount: number;
  totalLeads: number;
  activeLeads: number;
  convertedLeads: number;
  conversionRate: string;
  totalFollowUps: number;
  siteVisitsCount: number;
  totalDealValueFormatted: string;
  totalEstimatedIncentivesFormatted: string;
}

// Format Indian Rupee values
export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  if (amount > 0) {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
  return "₹0";
}

// Parse currency strings like "₹1.8 Cr", "₹85 L", "1.2 Cr"
function parseCurrencyString(val?: string): number {
  if (!val) return 0;
  const clean = val.replace(/[₹,\s]/g, "").toUpperCase();
  if (clean.endsWith("CR")) {
    const num = parseFloat(clean.replace("CR", ""));
    return Number.isNaN(num) ? 0 : num * 10000000;
  }
  if (clean.endsWith("L") || clean.endsWith("LAC") || clean.endsWith("LAKH")) {
    const num = parseFloat(clean.replace(/L|LAC|LAKH/, ""));
    return Number.isNaN(num) ? 0 : num * 100000;
  }
  const parsed = parseFloat(clean);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function getUserPerformance(user: User, leads: Lead[]): UserPerformanceMetrics {
  // Match leads by assignedToUserId OR by assignedTo name for backward compatibility
  const userLeads = leads.filter(
    (l) =>
      l.assignedToUserId === user.id ||
      (!l.assignedToUserId && l.assignedTo?.toLowerCase() === user.name.toLowerCase())
  );

  const totalLeads = userLeads.length;
  const activeLeads = userLeads.filter(
    (l) => l.status === "Hot" || l.status === "Warm" || l.status === "Qualified"
  ).length;
  const hotLeads = userLeads.filter((l) => l.status === "Hot").length;
  const convertedLeads = userLeads.filter(
    (l) => l.status === "Converted" || l.pipelineStage === "converted" || !!l.conversion
  );
  const convertedCount = convertedLeads.length;
  const conversionRate = totalLeads > 0 ? `${Math.round((convertedCount / totalLeads) * 100)}%` : "0%";

  // Follow-ups
  let totalFollowUps = 0;
  let completedFollowUps = 0;
  let overdueFollowUps = 0;

  userLeads.forEach((l) => {
    if (l.followUp?.required) {
      totalFollowUps += 1;
      if (l.followUp.date?.toLowerCase().includes("overdue") || l.followUp.date?.toLowerCase().includes("yesterday")) {
        overdueFollowUps += 1;
      }
    }
    if (l.followUpHistory && l.followUpHistory.length > 0) {
      totalFollowUps += l.followUpHistory.length;
      completedFollowUps += l.followUpHistory.length;
    }
  });

  const followUpCompletionRate =
    totalFollowUps > 0
      ? `${Math.round((completedFollowUps / totalFollowUps) * 100)}%`
      : "100%";

  // Site visits
  const siteVisitsCount = userLeads.filter((l) => l.siteVisit?.scheduled).length;

  // Deal values
  let totalDealValueNumeric = 0;
  convertedLeads.forEach((l) => {
    if (l.conversion?.numericFinalPrice) {
      totalDealValueNumeric += l.conversion.numericFinalPrice;
    } else {
      totalDealValueNumeric += parseCurrencyString(l.budget);
    }
  });

  // Calculate incentive based on assigned plan
  const userIncentives = getStoredUserIncentives();
  const assignment = userIncentives.find((a) => a.userId === user.id);
  const plans = getStoredIncentivePlans();
  const plan: IncentivePlan | undefined = plans.find((p) => p.id === assignment?.incentivePlanId);

  let estimatedIncentiveNumeric = 0;
  let incentivePlanName = "Unassigned";

  if (plan) {
    incentivePlanName = plan.name;
    switch (plan.type) {
      case "fixed":
        estimatedIncentiveNumeric = convertedCount * (plan.rules.fixedAmountPerDeal || 5000);
        break;
      case "deal_percentage":
        estimatedIncentiveNumeric = Math.round(
          totalDealValueNumeric * ((plan.rules.percentageOfDealValue || 1) / 100)
        );
        break;
      case "commission_percentage": {
        // Average 2% brokerage earned by agency
        const grossBrokerage = totalDealValueNumeric * 0.02;
        estimatedIncentiveNumeric = Math.round(
          grossBrokerage * ((plan.rules.percentageOfBrokerage || 10) / 100)
        );
        break;
      }
      case "slab": {
        const slabs = plan.rules.slabs || [];
        // Find matching slab
        const matchedSlab = slabs.find(
          (s) =>
            convertedCount >= s.minDeals && (s.maxDeals === null || convertedCount <= s.maxDeals)
        );
        const rate = matchedSlab ? matchedSlab.amountPerDeal : 2500;
        estimatedIncentiveNumeric = convertedCount * rate;
        break;
      }
      case "target": {
        const target = plan.rules.targetAmount || 10000000;
        if (totalDealValueNumeric >= target) {
          estimatedIncentiveNumeric = plan.rules.targetIncentiveAmount || 25000;
        } else {
          // Pro-rated preview
          estimatedIncentiveNumeric = Math.round(
            (totalDealValueNumeric / target) * (plan.rules.targetIncentiveAmount || 25000)
          );
        }
        break;
      }
      default:
        estimatedIncentiveNumeric = convertedCount * 5000;
    }
  } else if (convertedCount > 0) {
    // Default fallback estimation if no specific plan assigned
    estimatedIncentiveNumeric = convertedCount * 5000;
    incentivePlanName = "Default (₹5k/deal)";
  }

  return {
    userId: user.id,
    totalLeads,
    activeLeads,
    hotLeads,
    convertedLeads: convertedCount,
    conversionRate,
    totalFollowUps,
    completedFollowUps,
    overdueFollowUps,
    followUpCompletionRate,
    siteVisitsCount,
    totalDealValueNumeric,
    totalDealValueFormatted: formatCurrency(totalDealValueNumeric),
    estimatedIncentiveNumeric,
    estimatedIncentiveFormatted: formatCurrency(estimatedIncentiveNumeric),
    incentivePlanName,
  };
}

export function getTeamPerformance(
  team: Team,
  allUsers: User[],
  leads: Lead[]
): TeamPerformanceMetrics {
  const members = allUsers.filter((u) => team.memberUserIds.includes(u.id));
  const activeMembers = members.filter((u) => u.status === "active");

  const memberMetrics = members.map((m) => getUserPerformance(m, leads));

  const totalLeads = memberMetrics.reduce((acc, m) => acc + m.totalLeads, 0);
  const activeLeads = memberMetrics.reduce((acc, m) => acc + m.activeLeads, 0);
  const convertedLeads = memberMetrics.reduce((acc, m) => acc + m.convertedLeads, 0);
  const totalFollowUps = memberMetrics.reduce((acc, m) => acc + m.totalFollowUps, 0);
  const siteVisitsCount = memberMetrics.reduce((acc, m) => acc + m.siteVisitsCount, 0);
  const totalDealValueNumeric = memberMetrics.reduce((acc, m) => acc + m.totalDealValueNumeric, 0);
  const totalIncentivesNumeric = memberMetrics.reduce(
    (acc, m) => acc + m.estimatedIncentiveNumeric,
    0
  );

  const conversionRate = totalLeads > 0 ? `${Math.round((convertedLeads / totalLeads) * 100)}%` : "0%";

  return {
    teamId: team.id,
    teamName: team.name,
    membersCount: members.length,
    activeMembersCount: activeMembers.length,
    totalLeads,
    activeLeads,
    convertedLeads,
    conversionRate,
    totalFollowUps,
    siteVisitsCount,
    totalDealValueFormatted: formatCurrency(totalDealValueNumeric),
    totalEstimatedIncentivesFormatted: formatCurrency(totalIncentivesNumeric),
  };
}
