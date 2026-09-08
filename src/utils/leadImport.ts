import * as XLSX from "xlsx";
import {
  Lead,
  LeadFieldConfig,
  getStoredLeads,
  getStoredLeadFieldConfigs,
} from "@/data/mockData";

export interface SpreadsheetFileInfo {
  fileName: string;
  fileSize: string;
  sheetNames: string[];
  workbook: XLSX.WorkBook;
}

export interface SheetData {
  sheetName: string;
  headers: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  colCount: number;
}

export type MappingConfidence = "high" | "medium" | "none";

export interface ColumnMappingItem {
  originalHeader: string;
  normalizedHeader: string;
  targetField: string; // "name", "phone", "email", etc., or "custom:field_name", or "ignore"
  targetLabel: string;
  confidence: MappingConfidence;
  isCustom?: boolean;
}

export interface MappingTemplate {
  id: string;
  name: string;
  mapping: Record<string, string>; // originalHeader -> targetField
  createdAt: string;
}

export interface ValidatedRow {
  rowNumber: number;
  originalData: Record<string, unknown>;
  mappedLead?: Partial<Lead>;
  status: "ready" | "needs_attention" | "duplicate" | "invalid";
  issues: string[];
  duplicateReason?: string;
  existingLeadMatch?: Lead;
}

export interface ImportValidationSummary {
  totalRows: number;
  readyCount: number;
  duplicateCount: number;
  needsAttentionCount: number;
  invalidCount: number;
  rows: ValidatedRow[];
}

const MAPPINGS_STORAGE_KEY = "sahyak_crm_import_mappings_v1";

// Normalizes header text for matching
export function normalizeHeader(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[_\-]+/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Synonyms dictionary for standard CRM lead fields
const STANDARD_FIELD_SYNONYMS: Record<string, string[]> = {
  name: [
    "name",
    "full name",
    "fullname",
    "client name",
    "clientname",
    "customer name",
    "customername",
    "lead name",
    "leadname",
    "prospect name",
    "prospect",
    "first name",
    "contact name",
    "buyer name",
    "applicant name",
  ],
  phone: [
    "phone",
    "phone number",
    "phonenumber",
    "mobile",
    "mobile number",
    "mobilenumber",
    "contact",
    "contact number",
    "contact no",
    "mobile no",
    "whatsapp",
    "whatsapp number",
    "tel",
    "telephone",
    "cell",
    "cellphone",
    "primary phone",
  ],
  email: [
    "email",
    "email address",
    "emailaddress",
    "mail",
    "e mail",
    "email id",
    "emailid",
    "electronic mail",
  ],
  propertyInterest: [
    "project",
    "project name",
    "projectname",
    "property",
    "property name",
    "property interest",
    "interested project",
    "interested property",
    "interested in",
    "requirement",
    "project requirement",
    "preferred project",
  ],
  budget: [
    "budget",
    "price range",
    "investment",
    "budget range",
    "approx budget",
    "target budget",
    "ticket size",
    "maximum budget",
  ],
  status: [
    "status",
    "lead status",
    "leadstatus",
    "stage",
    "lead stage",
    "temperature",
    "priority",
  ],
  source: [
    "source",
    "lead source",
    "leadsource",
    "channel",
    "platform",
    "acquisition source",
    "campaign",
    "campaign name",
    "ad name",
    "ad set",
    "utm source",
    "media source",
  ],
  location: [
    "city",
    "location",
    "area",
    "locality",
    "buyer location",
    "address",
    "preferred location",
    "preferred city",
  ],
  assignedTo: [
    "assigned to",
    "assignedto",
    "agent",
    "advisor",
    "owner",
    "assigned agent",
    "consultant",
    "executive",
  ],
  interestType: [
    "property type",
    "propertytype",
    "type",
    "unit type",
    "interest type",
    "configuration type",
  ],
  notes: [
    "notes",
    "remarks",
    "comment",
    "comments",
    "message",
    "description",
    "requirement details",
    "feedback",
  ],
};

// Safe phone normalization for duplicate matching (extracts numeric digits)
export function normalizePhoneForMatching(raw: unknown): string {
  if (raw === null || raw === undefined) return "";
  let str = String(raw).trim();
  if (typeof raw === "number" && !Number.isNaN(raw)) {
    str = raw.toLocaleString("fullwide", { useGrouping: false });
  }
  const digitsOnly = str.replace(/[^\d]/g, "");
  if (digitsOnly.length >= 10) {
    return digitsOnly.slice(-10);
  }
  return digitsOnly;
}

// Display phone cleaner preserving country code if present
export function formatDisplayPhone(raw: unknown): string {
  if (raw === null || raw === undefined) return "";
  let str = String(raw).trim();
  if (typeof raw === "number" && !Number.isNaN(raw)) {
    str = raw.toLocaleString("fullwide", { useGrouping: false });
  }
  return str.replace(/[\(\)]/g, "").replace(/\s+/g, " ").trim();
}

// Standard email validation
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

// Reads file buffer and extracts sheets info
export async function readSpreadsheetFile(file: File): Promise<SpreadsheetFileInfo> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, {
    type: "array",
    cellDates: true,
    cellText: false,
  });

  const sizeKb = (file.size / 1024).toFixed(1);
  const sizeFormatted = file.size > 1048576 ? `${(file.size / 1048576).toFixed(1)} MB` : `${sizeKb} KB`;

  return {
    fileName: file.name,
    fileSize: sizeFormatted,
    sheetNames: workbook.SheetNames,
    workbook,
  };
}

// Reads data rows and headers from selected sheet
export function readSheetData(workbook: XLSX.WorkBook, sheetName: string): SheetData {
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    return { sheetName, headers: [], rows: [], rowCount: 0, colCount: 0 };
  }

  const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: "",
    raw: false,
    dateNF: "YYYY-MM-DD",
  });

  if (rawData.length === 0) {
    return { sheetName, headers: [], rows: [], rowCount: 0, colCount: 0 };
  }

  const headersSet = new Set<string>();
  rawData.forEach((row) => {
    Object.keys(row).forEach((k) => {
      const cleanKey = k.trim();
      if (cleanKey && !cleanKey.startsWith("__EMPTY")) {
        headersSet.add(cleanKey);
      }
    });
  });

  const headers = Array.from(headersSet);
  return {
    sheetName,
    headers,
    rows: rawData,
    rowCount: rawData.length,
    colCount: headers.length,
  };
}

// Performs smart/intelligent column mapping
export function generateSmartColumnMappings(
  headers: string[],
  customFieldConfigs: LeadFieldConfig[] = getStoredLeadFieldConfigs()
): ColumnMappingItem[] {
  const activeCustomFields = customFieldConfigs.filter((c) => !c.isSystem && c.isActive);

  return headers.map((origHeader) => {
    const norm = normalizeHeader(origHeader);

    // 1. Try standard fields exact synonym match
    for (const [fieldKey, synonyms] of Object.entries(STANDARD_FIELD_SYNONYMS)) {
      if (synonyms.includes(norm)) {
        return {
          originalHeader: origHeader,
          normalizedHeader: norm,
          targetField: fieldKey,
          targetLabel: getStandardFieldLabel(fieldKey),
          confidence: "high",
        };
      }
    }

    // 2. Try custom field matches
    for (const cf of activeCustomFields) {
      const cfNormName = normalizeHeader(cf.name);
      const cfNormLabel = normalizeHeader(cf.label);
      if (norm === cfNormName || norm === cfNormLabel) {
        return {
          originalHeader: origHeader,
          normalizedHeader: norm,
          targetField: `custom:${cf.name}`,
          targetLabel: `${cf.label} (Custom)`,
          confidence: "high",
          isCustom: true,
        };
      }
    }

    // 3. Try partial substring matching for standard fields
    for (const [fieldKey, synonyms] of Object.entries(STANDARD_FIELD_SYNONYMS)) {
      const match = synonyms.some((syn) => norm.includes(syn) || syn.includes(norm));
      if (match) {
        return {
          originalHeader: origHeader,
          normalizedHeader: norm,
          targetField: fieldKey,
          targetLabel: getStandardFieldLabel(fieldKey),
          confidence: "medium",
        };
      }
    }

    // 4. Try partial match for custom fields
    for (const cf of activeCustomFields) {
      const cfNormName = normalizeHeader(cf.name);
      const cfNormLabel = normalizeHeader(cf.label);
      if (norm.includes(cfNormName) || norm.includes(cfNormLabel)) {
        return {
          originalHeader: origHeader,
          normalizedHeader: norm,
          targetField: `custom:${cf.name}`,
          targetLabel: `${cf.label} (Custom)`,
          confidence: "medium",
          isCustom: true,
        };
      }
    }

    // No match -> Ignore
    return {
      originalHeader: origHeader,
      normalizedHeader: norm,
      targetField: "ignore",
      targetLabel: "Ignore Column",
      confidence: "none",
    };
  });
}

export function getStandardFieldLabel(fieldKey: string): string {
  switch (fieldKey) {
    case "name":
      return "Client Name *";
    case "phone":
      return "Phone Number *";
    case "email":
      return "Email Address";
    case "propertyInterest":
      return "Property Interest";
    case "budget":
      return "Approximate Budget";
    case "status":
      return "Lead Status";
    case "source":
      return "Acquisition Source";
    case "location":
      return "City / Location";
    case "assignedTo":
      return "Assigned Advisor";
    case "interestType":
      return "Property Type (e.g. Villa, Apartment)";
    case "notes":
      return "Notes & Requirements";
    default:
      return fieldKey;
  }
}

// --- Mapping Templates Storage ---
export function getSavedMappingTemplates(): MappingTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MAPPINGS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMappingTemplate(name: string, mapping: Record<string, string>): MappingTemplate[] {
  const current = getSavedMappingTemplates();
  const newTemplate: MappingTemplate = {
    id: `map-${Date.now()}`,
    name: name.trim() || `Template ${current.length + 1}`,
    mapping,
    createdAt: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
  };
  const updated = [newTemplate, ...current.filter((t) => t.name !== newTemplate.name)];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(MAPPINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // safe ignore
    }
  }
  return updated;
}

export function deleteMappingTemplate(id: string): MappingTemplate[] {
  const current = getSavedMappingTemplates();
  const updated = current.filter((t) => t.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(MAPPINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // safe ignore
    }
  }
  return updated;
}

// --- Data Validation & Duplicate Detection ---
export function validateAndDetectDuplicates(
  rows: Record<string, unknown>[],
  columnMappings: ColumnMappingItem[],
  existingLeads: Lead[] = getStoredLeads()
): ImportValidationSummary {
  const existingByPhone = new Map<string, Lead>();
  const existingByEmail = new Map<string, Lead>();

  existingLeads.forEach((l) => {
    const pNorm = normalizePhoneForMatching(l.phone);
    if (pNorm) existingByPhone.set(pNorm, l);

    if (l.email) {
      existingByEmail.set(l.email.trim().toLowerCase(), l);
    }
  });

  const seenFilePhones = new Set<string>();
  const seenFileEmails = new Set<string>();

  const validatedRows: ValidatedRow[] = [];
  let readyCount = 0;
  let duplicateCount = 0;
  let needsAttentionCount = 0;
  let invalidCount = 0;

  const mappingMap = new Map<string, string>();
  columnMappings.forEach((m) => {
    if (m.targetField && m.targetField !== "ignore") {
      mappingMap.set(m.originalHeader, m.targetField);
    }
  });

  rows.forEach((row, idx) => {
    const rowNumber = idx + 2;
    const mapped: Record<string, unknown> = {};
    const customFields: Record<string, unknown> = {};

    for (const [colName, targetField] of mappingMap.entries()) {
      const val = row[colName];
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        if (targetField.startsWith("custom:")) {
          const customKey = targetField.replace("custom:", "");
          customFields[customKey] = typeof val === "string" ? val.trim() : val;
        } else {
          mapped[targetField] = typeof val === "string" ? val.trim() : val;
        }
      }
    }

    const name = String(mapped.name || "").trim();
    const rawPhone = mapped.phone;
    const phone = formatDisplayPhone(rawPhone);
    const phoneNorm = normalizePhoneForMatching(rawPhone);
    const email = mapped.email ? String(mapped.email).trim().toLowerCase() : undefined;

    const issues: string[] = [];
    let isInvalid = false;
    let isDuplicate = false;
    let duplicateReason: string | undefined;
    let existingMatch: Lead | undefined;

    // 1. Mandatory Field Checks (Name and Phone)
    if (!name) {
      issues.push("Missing required Client Name");
      isInvalid = true;
    }

    if (!phone || phoneNorm.length < 7) {
      issues.push("Missing or invalid Phone Number (minimum 7 digits required)");
      isInvalid = true;
    }

    // 2. Email format validation (non-fatal, adds warning if invalid)
    if (email && !isValidEmail(email)) {
      issues.push(`Invalid email format: "${email}"`);
    }

    // 3. Duplicate Detection against existing CRM database
    if (phoneNorm && existingByPhone.has(phoneNorm)) {
      isDuplicate = true;
      existingMatch = existingByPhone.get(phoneNorm);
      duplicateReason = `Phone number matches existing CRM lead "${existingMatch?.name}"`;
    } else if (email && existingByEmail.has(email)) {
      isDuplicate = true;
      existingMatch = existingByEmail.get(email);
      duplicateReason = `Email address matches existing CRM lead "${existingMatch?.name}"`;
    }

    // 4. Duplicate Detection within uploaded spreadsheet
    if (!isDuplicate && phoneNorm) {
      if (seenFilePhones.has(phoneNorm)) {
        isDuplicate = true;
        duplicateReason = "Duplicate phone number found earlier in this uploaded file";
      } else {
        seenFilePhones.add(phoneNorm);
      }
    }

    if (!isDuplicate && email) {
      if (seenFileEmails.has(email)) {
        isDuplicate = true;
        duplicateReason = "Duplicate email address found earlier in this uploaded file";
      } else {
        seenFileEmails.add(email);
      }
    }

    let status: ValidatedRow["status"] = "ready";
    if (isInvalid) {
      status = "invalid";
      invalidCount++;
    } else if (isDuplicate) {
      status = "duplicate";
      duplicateCount++;
    } else if (issues.length > 0) {
      status = "needs_attention";
      needsAttentionCount++;
    } else {
      status = "ready";
      readyCount++;
    }

    const mappedLead: Partial<Lead> = {
      name,
      phone,
      email,
      propertyInterest: String(mapped.propertyInterest || "General Inquiry"),
      budget: String(mapped.budget || "₹75L – ₹1.2 Cr"),
      status: (mapped.status as Lead["status"]) || "Warm",
      source: String(mapped.source || "Imported"),
      location: mapped.location ? String(mapped.location) : undefined,
      assignedTo: mapped.assignedTo ? String(mapped.assignedTo) : "Rohan Verma",
      interestType: (mapped.interestType as Lead["interestType"]) || "Apartment",
      customFields: Object.keys(customFields).length > 0 ? customFields : undefined,
    };

    validatedRows.push({
      rowNumber,
      originalData: row,
      mappedLead,
      status,
      issues,
      duplicateReason,
      existingLeadMatch: existingMatch,
    });
  });

  return {
    totalRows: rows.length,
    readyCount,
    duplicateCount,
    needsAttentionCount,
    invalidCount,
    rows: validatedRows,
  };
}

// Converts a validated row into a production-ready Lead entity
export function buildLeadEntityFromImport(
  validatedRow: ValidatedRow,
  batchId: string,
  index: number
): Lead {
  const m = validatedRow.mappedLead || {};
  const id = `lead-imp-${Date.now()}-${index + 1}`;

  return {
    id,
    name: m.name || "Unnamed Prospect",
    phone: m.phone || "",
    email: m.email,
    location: m.location,
    propertyInterest: m.propertyInterest || "General Inquiry",
    budget: m.budget || "₹75L – ₹1.2 Cr",
    status: m.status || "Warm",
    source: m.source || "Imported",
    createdAt: new Date().toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    assignedTo: m.assignedTo || "Rohan Verma",
    pipelineStage: "new",
    interestType: m.interestType || "Apartment",
    followUp: {
      required: true,
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      time: "11:00 AM",
    },
    customFields: m.customFields,
    importBatchId: batchId,
    importedAt: new Date().toISOString(),
    notesList: [
      {
        id: `note-imp-${Date.now()}-${index + 1}`,
        text: `Lead imported via spreadsheet batch #${batchId}. Source: ${m.source || "Imported"}.`,
        date: new Date().toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        author: "System Import",
      },
    ],
    activities: [
      {
        id: `act-imp-${Date.now()}-${index + 1}`,
        title: `Lead imported into CRM via batch #${batchId}`,
        time: "Just now",
        type: "created",
      },
    ],
  };
}

// Generates and downloads a CSV report for failed / skipped rows
export function downloadErrorReportCsv(
  problemRows: ValidatedRow[],
  originalFileName: string
): void {
  if (problemRows.length === 0) return;

  const sampleOriginal = problemRows[0].originalData || {};
  const originalColKeys = Object.keys(sampleOriginal);

  const csvRows: string[] = [];
  const headerLine = ["Row Number", "Import Status", "Failure / Skip Reason", ...originalColKeys]
    .map((h) => `"${h.replace(/"/g, '""')}"`)
    .join(",");
  csvRows.push(headerLine);

  problemRows.forEach((p) => {
    const reason = p.duplicateReason || p.issues.join("; ") || "Validation failed";
    const values = [
      String(p.rowNumber),
      p.status.toUpperCase(),
      reason,
      ...originalColKeys.map((k) => String(p.originalData[k] ?? "")),
    ];
    const line = values.map((v) => `"${v.replace(/"/g, '""')}"`).join(",");
    csvRows.push(line);
  });

  const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));
  const cleanBase = originalFileName.replace(/\.[^/.]+$/, "");
  const downloadName = `error-report-${cleanBase}-${new Date().toISOString().split("T")[0]}.csv`;

  const link = document.createElement("a");
  link.setAttribute("href", csvContent);
  link.setAttribute("download", downloadName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
