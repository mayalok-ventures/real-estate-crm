"use client";

import React, { useState } from "react";
import { Lead, LeadFieldConfig, getStoredLeadFieldConfigs } from "@/data/mockData";
import {
  getAllAvailableExportFields,
  exportLeadsToFile,
  ExportFieldOption,
} from "@/utils/leadExport";
import Icon from "@/components/Icon";

interface ExportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredLeads: Lead[];
  allLeads: Lead[];
  isFilterActive: boolean;
}

export default function ExportLeadsModal({
  isOpen,
  onClose,
  filteredLeads,
  allLeads,
  isFilterActive,
}: ExportLeadsModalProps) {
  const [scope, setScope] = useState<"filtered" | "all">(
    isFilterActive ? "filtered" : "all"
  );
  const [format, setFormat] = useState<"xlsx" | "csv">("xlsx");
  const [customConfigs] = useState<LeadFieldConfig[]>(() => getStoredLeadFieldConfigs());
  const [availableFields] = useState<ExportFieldOption[]>(() =>
    getAllAvailableExportFields(getStoredLeadFieldConfigs())
  );
  const [selectedFieldKeys, setSelectedFieldKeys] = useState<string[]>(() =>
    getAllAvailableExportFields(getStoredLeadFieldConfigs()).map((f) => f.key)
  );

  if (!isOpen) return null;

  const activeDataset = scope === "filtered" ? filteredLeads : allLeads;
  const leadCount = activeDataset.length;

  const toggleField = (key: string) => {
    setSelectedFieldKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSelectAll = () => {
    setSelectedFieldKeys(availableFields.map((f) => f.key));
  };

  const handleClearAll = () => {
    // Keep at least name & phone selected
    setSelectedFieldKeys(["name", "phone"]);
  };

  const handleExport = () => {
    if (leadCount === 0) {
      alert("No leads found in the selected scope to export.");
      return;
    }
    if (selectedFieldKeys.length === 0) {
      alert("Please select at least one field to export.");
      return;
    }

    exportLeadsToFile({
      leads: activeDataset,
      format,
      selectedFieldKeys,
      isFiltered: scope === "filtered",
      customConfigs,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-border flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Icon name="download" size={16} />
            </div>
            <div>
              <h2 id="export-modal-title" className="text-base font-bold text-foreground">
                Export Leads
              </h2>
              <p className="text-xs text-muted-foreground">
                Download verified spreadsheet records
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Export Scope */}
          <div>
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
              Export Scope
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setScope("filtered")}
                disabled={!isFilterActive}
                className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                  scope === "filtered"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : isFilterActive
                    ? "border-border bg-white hover:border-slate-300"
                    : "border-border/40 bg-slate-50 text-muted-foreground opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-semibold text-xs text-foreground">
                    Filtered Leads
                  </span>
                  {scope === "filtered" && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-lg font-bold text-foreground">
                  {filteredLeads.length}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {isFilterActive ? "Active directory filters" : "No active filters"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setScope("all")}
                className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                  scope === "all"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-semibold text-xs text-foreground">
                    All Leads
                  </span>
                  {scope === "all" && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-lg font-bold text-foreground">
                  {allLeads.length}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Complete database
                </span>
              </button>
            </div>
          </div>

          {/* Export Format */}
          <div>
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
              File Format
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setFormat("xlsx")}
                className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all ${
                  format === "xlsx"
                    ? "border-emerald-500 bg-emerald-50/40 text-emerald-900 font-semibold ring-1 ring-emerald-500"
                    : "border-border bg-white hover:border-slate-300 text-foreground"
                }`}
              >
                <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Icon name="file-text" size={14} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold leading-tight">Excel (.xlsx)</div>
                  <div className="text-[10px] text-muted-foreground">Recommended</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat("csv")}
                className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all ${
                  format === "csv"
                    ? "border-blue-500 bg-blue-50/40 text-blue-900 font-semibold ring-1 ring-blue-500"
                    : "border-border bg-white hover:border-slate-300 text-foreground"
                }`}
              >
                <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Icon name="file-text" size={14} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold leading-tight">CSV (.csv)</div>
                  <div className="text-[10px] text-muted-foreground">Universal text</div>
                </div>
              </button>
            </div>
          </div>

          {/* Field Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Include Fields ({selectedFieldKeys.length}/{availableFields.length})
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  Select All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
                >
                  Clear Optional
                </button>
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto border border-border rounded-xl p-2.5 space-y-1 bg-slate-50/40">
              {availableFields.map((field) => {
                const isChecked = selectedFieldKeys.includes(field.key);
                return (
                  <label
                    key={field.key}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white cursor-pointer transition-colors text-xs select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleField(field.key)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary"
                    />
                    <span
                      className={`font-medium ${
                        isChecked ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {field.label}
                    </span>
                    {field.isCustom && (
                      <span className="ml-auto text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.2 rounded font-medium">
                        Custom
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
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
            disabled={leadCount === 0 || selectedFieldKeys.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="download" size={14} />
            <span>
              Export {leadCount} {leadCount === 1 ? "Lead" : "Leads"} (.{format})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
