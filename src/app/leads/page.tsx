"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/Icon";
import { Lead, getStoredLeads, addLeadToStore } from "@/data/mockData";
import { getCurrentUser, User } from "@/data/teamData";
import { hasPermission } from "@/utils/permissionService";
import { logActivity } from "@/utils/activityService";
import { LeadCard } from "@/components/leads/LeadCard";
import { LeadForm } from "@/components/leads/LeadForm";
import ImportLeadsModal from "@/components/leads/ImportLeadsModal";
import ExportLeadsModal from "@/components/leads/ExportLeadsModal";

function LeadsDirectoryContent() {
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUserState] = useState<User>(() => getCurrentUser());
  const [leads, setLeads] = useState<Lead[]>(() => getStoredLeads());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(() => searchParams.get("add") === "true");
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    const handleUserChange = () => {
      setCurrentUserState(getCurrentUser());
    };
    window.addEventListener("sahyak_user_changed", handleUserChange);
    window.addEventListener("storage", handleUserChange);
    return () => {
      window.removeEventListener("sahyak_user_changed", handleUserChange);
      window.removeEventListener("storage", handleUserChange);
    };
  }, []);

  const canCreateLead = hasPermission(currentUser, "leads.create");
  const canImport = hasPermission(currentUser, "leads.import");
  const canExport = hasPermission(currentUser, "leads.export");
  const canViewAll = hasPermission(currentUser, "leads.view_all");

  const filterOptions = ["All", "Hot", "Warm", "Cold", "Qualified", "Converted"];

  const handleAddLead = (newLead: Lead) => {
    const leadToSave: Lead = {
      ...newLead,
      assignedToUserId: newLead.assignedToUserId || currentUser.id,
      assignedTo: newLead.assignedTo || currentUser.name,
      assignedTeamId: newLead.assignedTeamId || currentUser.teamId,
    };
    const updated = addLeadToStore(leadToSave);
    setLeads(updated);

    logActivity({
      action: "Created new lead",
      module: "leads",
      entityType: "lead",
      entityId: leadToSave.id,
      entityName: leadToSave.name,
      metadata: { status: leadToSave.status, propertyInterest: leadToSave.propertyInterest, budget: leadToSave.budget },
    });

    setSuccessBanner(`Lead "${leadToSave.name}" added successfully to your active directory!`);
    setTimeout(() => {
      setSuccessBanner(null);
    }, 4000);
  };

  const handleImportComplete = (importedCount: number) => {
    const updated = getStoredLeads();
    setLeads(updated);

    logActivity({
      action: `Imported ${importedCount} leads`,
      module: "leads",
      entityType: "import_batch",
      entityId: `batch_${Date.now()}`,
      entityName: `Batch Import (${importedCount} leads)`,
      type: "audit",
      metadata: { count: importedCount },
    });

    setSuccessBanner(`Successfully imported ${importedCount} leads into SAHYAK CRM!`);
    setTimeout(() => {
      setSuccessBanner(null);
    }, 5000);
  };

  const visibleLeads = canViewAll
    ? leads
    : leads.filter((l) => l.assignedToUserId === currentUser.id || l.assignedTo === currentUser.name);

  const filteredLeads = visibleLeads.filter((lead: Lead) => {
    const matchesFilter = activeFilter === "All" || lead.status === activeFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      lead.name.toLowerCase().includes(query) ||
      lead.phone.toLowerCase().includes(query) ||
      lead.propertyInterest.toLowerCase().includes(query) ||
      (lead.location && lead.location.toLowerCase().includes(query)) ||
      (lead.projectName && lead.projectName.toLowerCase().includes(query)) ||
      lead.source.toLowerCase().includes(query) ||
      (lead.assignedTo && lead.assignedTo.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      {/* Page Header */}
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1 className="page-title">Leads Directory</h1>
          <p className="page-subtitle">
            Manage buyer inquiries, project preferences, budget & active follow-ups
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {canExport && (
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              title="Export leads to Excel or CSV"
            >
              <Icon name="download" size={14} />
              <span>Export</span>
            </button>
          )}

          {canImport && (
            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              title="Smart Import leads from CSV or Excel"
            >
              <Icon name="upload" size={14} />
              <span>Import</span>
            </button>
          )}

          {canCreateLead && (
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Icon name="plus" size={15} />
              <span>Add Lead</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div
          className="card"
          style={{
            backgroundColor: "var(--success-light)",
            borderColor: "var(--success-border)",
            color: "var(--success)",
            padding: "12px 16px",
            marginBottom: "var(--space-4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "13.5px",
            fontWeight: 600,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Icon name="check" size={18} />
            <span>{successBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            className="btn-icon"
            style={{ color: "var(--success)", width: "24px", height: "24px" }}
          >
            <Icon name="x" size={14} />
          </button>
        </div>
      )}

      {/* Search & Filter Section */}
      <div className="card" style={{ padding: "12px 16px", marginBottom: "var(--space-5)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Search Box */}
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                display: "flex",
              }}
            >
              <Icon name="search" size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by client name, phone number, location, or property..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-search"
            />
          </div>

          {/* Filter Pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "2px" }}>
              {filterOptions.map((filter) => {
                const isSelected = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "12px",
                      fontWeight: 600,
                      backgroundColor: isSelected ? "var(--brand-primary)" : "var(--bg-subtle)",
                      color: isSelected ? "var(--text-inverse)" : "var(--text-secondary)",
                      border: `1px solid ${isSelected ? "var(--brand-primary)" : "var(--border-subtle)"}`,
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>
              Showing {filteredLeads.length} of {leads.length}
            </span>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
        ) : (
          <div
            className="card"
            style={{
              padding: "36px 20px",
              textAlign: "center",
              color: "var(--text-secondary)",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--bg-subtle)",
                color: "var(--text-muted)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <Icon name="search" size={20} />
            </div>
            <p style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-primary)" }}>
              No leads match your criteria
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px", maxWidth: "360px", margin: "4px auto 16px auto" }}>
              Try clearing your search terms or selecting a different status filter to view other prospects.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
              {(searchQuery || activeFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("All");
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Reset Filters
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                className="btn btn-primary btn-sm"
              >
                + Add New Lead
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Unified Add Lead Modal / Sheet */}
      <LeadForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAddLead={handleAddLead}
        mode="add"
      />

      {/* Smart Import Leads Modal */}
      <ImportLeadsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />

      {/* Export Leads Modal */}
      <ExportLeadsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        filteredLeads={filteredLeads}
        allLeads={leads}
        isFilterActive={activeFilter !== "All" || searchQuery.trim().length > 0}
      />
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "20px", color: "var(--text-secondary)" }}>Loading leads directory...</div>}>
      <LeadsDirectoryContent />
    </Suspense>
  );
}
