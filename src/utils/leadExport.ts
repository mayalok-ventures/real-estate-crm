import * as XLSX from "xlsx";
import { Lead, LeadFieldConfig, getStoredLeadFieldConfigs } from "@/data/mockData";

export interface ExportFieldOption {
  key: string;
  label: string;
  isCustom?: boolean;
}

export const DEFAULT_EXPORT_FIELDS: ExportFieldOption[] = [
  { key: "name", label: "Client Name" },
  { key: "phone", label: "Phone Number" },
  { key: "email", label: "Email Address" },
  { key: "propertyInterest", label: "Property Interest" },
  { key: "budget", label: "Approx. Budget" },
  { key: "status", label: "Lead Status" },
  { key: "source", label: "Lead Source" },
  { key: "location", label: "Location / City" },
  { key: "assignedTo", label: "Assigned Advisor" },
  { key: "pipelineStage", label: "Pipeline Stage" },
  { key: "createdAt", label: "Created Date" },
  { key: "interestType", label: "Property Type" },
  { key: "followUp", label: "Follow-up Schedule" },
  { key: "siteVisit", label: "Site Visit Schedule" },
];

export function getAllAvailableExportFields(
  customConfigs: LeadFieldConfig[] = getStoredLeadFieldConfigs()
): ExportFieldOption[] {
  const customFields: ExportFieldOption[] = customConfigs
    .filter((c) => !c.isSystem && c.isActive)
    .map((c) => ({
      key: `custom:${c.name}`,
      label: `${c.label} (Custom)`,
      isCustom: true,
    }));

  return [...DEFAULT_EXPORT_FIELDS, ...customFields];
}

export function exportLeadsToFile({
  leads,
  format,
  selectedFieldKeys,
  isFiltered,
  customConfigs = getStoredLeadFieldConfigs(),
}: {
  leads: Lead[];
  format: "xlsx" | "csv";
  selectedFieldKeys: string[];
  isFiltered: boolean;
  customConfigs?: LeadFieldConfig[];
}): void {
  const allFields = getAllAvailableExportFields(customConfigs);
  const activeFields = allFields.filter((f) => selectedFieldKeys.includes(f.key));

  if (activeFields.length === 0) {
    alert("Please select at least one field to export.");
    return;
  }

  // Build rows based on active field selections
  const exportData = leads.map((lead) => {
    const rowObj: Record<string, string | number> = {};

    activeFields.forEach((field) => {
      if (field.isCustom) {
        const customKey = field.key.replace("custom:", "");
        const val = lead.customFields?.[customKey];
        rowObj[field.label] = val !== undefined && val !== null ? String(val) : "";
      } else {
        switch (field.key) {
          case "name":
            rowObj[field.label] = lead.name;
            break;
          case "phone":
            rowObj[field.label] = lead.phone;
            break;
          case "email":
            rowObj[field.label] = lead.email || "";
            break;
          case "propertyInterest":
            rowObj[field.label] = lead.propertyInterest || lead.projectName || "";
            break;
          case "budget":
            rowObj[field.label] = lead.budget || "";
            break;
          case "status":
            rowObj[field.label] = lead.status;
            break;
          case "source":
            rowObj[field.label] = lead.source;
            break;
          case "location":
            rowObj[field.label] = lead.location || "";
            break;
          case "assignedTo":
            rowObj[field.label] = lead.assignedTo || "Unassigned";
            break;
          case "pipelineStage":
            rowObj[field.label] = lead.pipelineStage || "new";
            break;
          case "createdAt":
            rowObj[field.label] = lead.createdAt;
            break;
          case "interestType":
            rowObj[field.label] = lead.interestType || "Apartment";
            break;
          case "followUp":
            rowObj[field.label] = lead.followUp?.required
              ? `${lead.followUp.date || ""} ${lead.followUp.time || ""}`.trim()
              : lead.noFollowUpReason
              ? `No (${lead.noFollowUpReason})`
              : "No";
            break;
          case "siteVisit":
            rowObj[field.label] = lead.siteVisit?.scheduled
              ? `${lead.siteVisit.date || ""} ${lead.siteVisit.time || ""}`.trim()
              : "None";
            break;
          default:
            rowObj[field.label] = "";
        }
      }
    });

    return rowObj;
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

  const todayStr = new Date().toISOString().split("T")[0];
  const baseName = isFiltered ? `sahyak-filtered-leads-${todayStr}` : `sahyak-leads-${todayStr}`;
  const fileName = `${baseName}.${format}`;

  XLSX.writeFile(workbook, fileName, { bookType: format });
}
