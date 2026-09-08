"use client";

import React, { useState } from "react";
import { AnalyticsDataset } from "@/utils/analyticsData";
import {
  exportAnalyticsToExcel,
  exportAnalyticsToCsv,
  AnalyticsCsvDatasetType,
} from "@/utils/analyticsExport";
import Icon from "@/components/Icon";

interface ExportAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: AnalyticsDataset;
}

export default function ExportAnalyticsModal({
  isOpen,
  onClose,
  dataset,
}: ExportAnalyticsModalProps) {
  const [format, setFormat] = useState<"xlsx" | "csv">("xlsx");
  const [csvDataset, setCsvDataset] = useState<AnalyticsCsvDatasetType>("summary");

  if (!isOpen) return null;

  const handleExport = () => {
    if (format === "xlsx") {
      exportAnalyticsToExcel(dataset);
    } else {
      exportAnalyticsToCsv(dataset, csvDataset);
    }
    onClose();
  };

  const csvOptions: { id: AnalyticsCsvDatasetType; label: string; desc: string }[] = [
    {
      id: "summary",
      label: "Executive Summary KPIs",
      desc: "Closing cycles, deal conversions, visit ratios, commission values",
    },
    {
      id: "sources",
      label: "Lead Sources Performance",
      desc: "Breakdown of inquiries and percentage share per channel",
    },
    {
      id: "funnel",
      label: "Conversion Funnel Stages",
      desc: "Stage counts and drop-off retention rates across pipeline",
    },
    {
      id: "raw_leads",
      label: "Raw Leads Data",
      desc: `Complete record list for current period (${dataset.filteredLeads.length} leads)`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-border flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-analytics-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Icon name="download" size={16} />
            </div>
            <div>
              <h2 id="export-analytics-title" className="text-base font-bold text-foreground">
                Export Analytics Report
              </h2>
              <p className="text-xs text-muted-foreground">
                Active Period: <span className="font-semibold text-foreground">{dataset.dateRangeLabel}</span> ({dataset.totalInquiries} inquiries)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Active Period & Metrics Preview */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div>
              <div className="text-muted-foreground">Period Scope</div>
              <div className="font-bold text-foreground text-sm">{dataset.dateRangeLabel}</div>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground">Commission Won</div>
              <div className="font-bold text-emerald-600 text-sm">{dataset.commissionWonFormatted}</div>
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setFormat("xlsx")}
                className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all text-left ${
                  format === "xlsx"
                    ? "border-emerald-500 bg-emerald-50/40 text-emerald-950 ring-1 ring-emerald-500"
                    : "border-border bg-white hover:border-slate-300 text-foreground"
                }`}
              >
                <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="file-text" size={14} />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Excel (.xlsx)</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    Multi-sheet workbook with all 4 datasets
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat("csv")}
                className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all text-left ${
                  format === "csv"
                    ? "border-blue-500 bg-blue-50/40 text-blue-950 ring-1 ring-blue-500"
                    : "border-border bg-white hover:border-slate-300 text-foreground"
                }`}
              >
                <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="file-text" size={14} />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">CSV (.csv)</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    Single targeted dataset file
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Excel sheets info or CSV dataset selector */}
          {format === "xlsx" ? (
            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Included Workbook Sheets
              </label>
              <div className="border border-border rounded-xl p-3 bg-slate-50/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Sheet 1: Executive Summary KPIs</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Sheet 2: Lead Sources Performance Breakdown</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
                  <span>Sheet 3: Conversion Funnel & Stage Drop-off</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center justify-center shrink-0">4</span>
                  <span>Sheet 4: Raw Leads Data Records</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Select CSV Dataset
              </label>
              <div className="space-y-2">
                {csvOptions.map((opt) => {
                  const isSelected = csvDataset === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCsvDataset(opt.id)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/30 text-blue-950 ring-1 ring-blue-500"
                          : "border-border bg-white hover:border-slate-300 text-foreground"
                      }`}
                    >
                      <input
                        type="radio"
                        name="csvDataset"
                        checked={isSelected}
                        onChange={() => setCsvDataset(opt.id)}
                        className="mt-0.5 w-4 h-4 text-primary focus:ring-primary/20 accent-primary"
                      />
                      <div>
                        <div className="font-semibold text-xs">{opt.label}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Icon name="download" size={14} />
            <span>
              Download Analytics ({format === "xlsx" ? "All Sheets .xlsx" : ".csv"})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
