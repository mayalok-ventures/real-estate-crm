import * as XLSX from "xlsx";
import { AnalyticsDataset } from "./analyticsData";

export type AnalyticsCsvDatasetType = "summary" | "sources" | "funnel" | "raw_leads";

export function exportAnalyticsToExcel(dataset: AnalyticsDataset): void {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Executive Summary KPIs
  const summaryRows = [
    { KPI: "Date Period", Value: dataset.dateRangeLabel },
    { KPI: "Total Inquiries Evaluated", Value: dataset.totalInquiries },
    { KPI: "Avg. Closing Cycle (Days)", Value: `${dataset.avgClosingCycleDays} Days` },
    { KPI: "Visit-to-Deal Conversion Ratio", Value: dataset.visitToDealRatio },
    { KPI: "Deals Converted (Won)", Value: dataset.convertedDealsCount },
    { KPI: "Property Site Visits Executed", Value: dataset.siteVisitsCount },
    { KPI: "Commission Value Won", Value: dataset.commissionWonFormatted },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Executive Summary");

  // Sheet 2: Lead Sources Performance
  const sourcesRows = dataset.leadSources.map((s) => ({
    "Lead Acquisition Source": s.name,
    "Inquiries Count": s.count,
    "Percentage Share": s.share,
  }));
  const sourcesSheet = XLSX.utils.json_to_sheet(sourcesRows);
  XLSX.utils.book_append_sheet(workbook, sourcesSheet, "Lead Sources");

  // Sheet 3: Conversion Funnel
  const funnelRows = dataset.conversionFunnel.map((f) => ({
    "Funnel Stage": f.stage,
    "Lead Count": f.count,
    "Stage Retention Rate": f.dropoff,
  }));
  const funnelSheet = XLSX.utils.json_to_sheet(funnelRows);
  XLSX.utils.book_append_sheet(workbook, funnelSheet, "Conversion Funnel");

  // Sheet 4: Raw Leads Data
  const rawRows = dataset.filteredLeads.map((l) => ({
    "Client Name": l.name,
    "Phone Number": l.phone,
    "Email": l.email || "",
    "Property Interest": l.propertyInterest || l.projectName || "",
    "Budget": l.budget,
    "Status": l.status,
    "Source": l.source,
    "City / Location": l.location || "",
    "Assigned Advisor": l.assignedTo || "Unassigned",
    "Pipeline Stage": l.pipelineStage || "new",
    "Created Date": l.createdAt,
  }));
  const rawSheet = XLSX.utils.json_to_sheet(rawRows);
  XLSX.utils.book_append_sheet(workbook, rawSheet, "Raw Leads Data");

  const todayStr = new Date().toISOString().split("T")[0];
  const fileName = `sahyak-analytics-${dataset.dateRange}-${todayStr}.xlsx`;

  XLSX.writeFile(workbook, fileName, { bookType: "xlsx" });
}

export function exportAnalyticsToCsv(dataset: AnalyticsDataset, datasetType: AnalyticsCsvDatasetType): void {
  const workbook = XLSX.utils.book_new();
  const todayStr = new Date().toISOString().split("T")[0];
  let fileName = "";

  switch (datasetType) {
    case "summary": {
      const summaryRows = [
        { KPI: "Date Period", Value: dataset.dateRangeLabel },
        { KPI: "Total Inquiries Evaluated", Value: dataset.totalInquiries },
        { KPI: "Avg. Closing Cycle (Days)", Value: `${dataset.avgClosingCycleDays} Days` },
        { KPI: "Visit-to-Deal Conversion Ratio", Value: dataset.visitToDealRatio },
        { KPI: "Deals Converted (Won)", Value: dataset.convertedDealsCount },
        { KPI: "Property Site Visits Executed", Value: dataset.siteVisitsCount },
        { KPI: "Commission Value Won", Value: dataset.commissionWonFormatted },
      ];
      const sheet = XLSX.utils.json_to_sheet(summaryRows);
      XLSX.utils.book_append_sheet(workbook, sheet, "Summary");
      fileName = `sahyak-analytics-summary-${dataset.dateRange}-${todayStr}.csv`;
      break;
    }
    case "sources": {
      const sourcesRows = dataset.leadSources.map((s) => ({
        "Lead Acquisition Source": s.name,
        "Inquiries Count": s.count,
        "Percentage Share": s.share,
      }));
      const sheet = XLSX.utils.json_to_sheet(sourcesRows);
      XLSX.utils.book_append_sheet(workbook, sheet, "Sources");
      fileName = `sahyak-analytics-sources-${dataset.dateRange}-${todayStr}.csv`;
      break;
    }
    case "funnel": {
      const funnelRows = dataset.conversionFunnel.map((f) => ({
        "Funnel Stage": f.stage,
        "Lead Count": f.count,
        "Stage Retention Rate": f.dropoff,
      }));
      const sheet = XLSX.utils.json_to_sheet(funnelRows);
      XLSX.utils.book_append_sheet(workbook, sheet, "Funnel");
      fileName = `sahyak-analytics-funnel-${dataset.dateRange}-${todayStr}.csv`;
      break;
    }
    case "raw_leads": {
      const rawRows = dataset.filteredLeads.map((l) => ({
        "Client Name": l.name,
        "Phone Number": l.phone,
        "Email": l.email || "",
        "Property Interest": l.propertyInterest || l.projectName || "",
        "Budget": l.budget,
        "Status": l.status,
        "Source": l.source,
        "City / Location": l.location || "",
        "Assigned Advisor": l.assignedTo || "Unassigned",
        "Pipeline Stage": l.pipelineStage || "new",
        "Created Date": l.createdAt,
      }));
      const sheet = XLSX.utils.json_to_sheet(rawRows);
      XLSX.utils.book_append_sheet(workbook, sheet, "Raw Leads");
      fileName = `sahyak-analytics-raw-leads-${dataset.dateRange}-${todayStr}.csv`;
      break;
    }
  }

  XLSX.writeFile(workbook, fileName, { bookType: "csv" });
}
