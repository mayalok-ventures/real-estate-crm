"use client";

import React, { useState } from "react";
import { Icon } from "@/components/Icon";
import {
  Lead,
  ProjectItem,
  getStoredProjects,
  getStoredLeadFieldConfigs,
  LeadFieldConfig,
} from "@/data/mockData";

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead?: (lead: Lead) => void;
  onUpdateLead?: (lead: Lead) => void;
  initialLead?: Lead | null;
  mode?: "add" | "edit";
}

const BUDGET_OPTIONS = [
  "₹50L – ₹75L",
  "₹75L – ₹1.2 Cr",
  "₹1.2 Cr – ₹2 Cr",
  "₹2 Cr – ₹3.5 Cr",
  "₹3.5 Cr+",
];

const INTEREST_TYPES: ("Apartment" | "Villa" | "Plot" | "Commercial" | "Office" | "Retail")[] = [
  "Apartment",
  "Villa",
  "Plot",
  "Commercial",
  "Office",
  "Retail",
];

const LEAD_STATUSES: ("Hot" | "Warm" | "Cold" | "Qualified")[] = [
  "Hot",
  "Warm",
  "Cold",
  "Qualified",
];

const COUNTRY_CODES = [
  { code: "+91", label: "IN (+91)" },
  { code: "+1", label: "US/CA (+1)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+65", label: "SG (+65)" },
];

const LEAD_SOURCES = [
  "Direct Call",
  "Meta Ads",
  "Google Ads",
  "Referral",
  "Website Form",
  "MagicBricks / 99acres",
  "Walk-in",
];

let leadIdCounter = 500;
function generateNewLeadId(): string {
  leadIdCounter += 1;
  return `lead-${leadIdCounter}`;
}

function LeadFormInner({
  onClose,
  onAddLead,
  onUpdateLead,
  initialLead,
  mode,
}: {
  onClose: () => void;
  onAddLead?: (lead: Lead) => void;
  onUpdateLead?: (lead: Lead) => void;
  initialLead?: Lead | null;
  mode: "add" | "edit";
}) {
  const isEditMode = mode === "edit" && Boolean(initialLead);

  // Extract initial phone without country code
  const initialPhone = initialLead?.phone
    ? initialLead.phone.startsWith(initialLead.countryCode || "+91")
      ? initialLead.phone.replace(initialLead.countryCode || "+91", "").trim()
      : initialLead.phone
    : "";

  const [clientName, setClientName] = useState(initialLead?.name || "");
  const [countryCode, setCountryCode] = useState(initialLead?.countryCode || "+91");
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [location, setLocation] = useState(initialLead?.location || "");
  const [budget, setBudget] = useState(initialLead?.budget || BUDGET_OPTIONS[1]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialLead?.projectId || "");
  const [interestType, setInterestType] = useState<"Apartment" | "Villa" | "Plot" | "Commercial" | "Office" | "Retail">(
    initialLead?.interestType || "Apartment"
  );
  const [leadStatus, setLeadStatus] = useState<"Hot" | "Warm" | "Cold" | "Qualified">(
    initialLead?.status && initialLead.status !== "Converted" ? initialLead.status : "Warm"
  );
  const [leadSource, setLeadSource] = useState(initialLead?.source || "Direct Call");
  const [projectCatalog] = useState<ProjectItem[]>(() => getStoredProjects());
  const [fieldConfigs] = useState<LeadFieldConfig[]>(() => getStoredLeadFieldConfigs());
  const customFields = fieldConfigs.filter((c) => !c.isSystem && c.isActive);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string | number>>(
    () => (initialLead?.customFields as Record<string, string | number>) || {}
  );

  // Follow-up toggle and inputs
  const [followUpRequired, setFollowUpRequired] = useState(Boolean(initialLead?.followUp?.required));
  const [followUpDate, setFollowUpDate] = useState(initialLead?.followUp?.date || "");
  const [followUpTime, setFollowUpTime] = useState(initialLead?.followUp?.time || "");
  const [noFollowUpReason, setNoFollowUpReason] = useState(initialLead?.noFollowUpReason || "");

  // Site Visit toggle and inputs
  const [siteVisitScheduled, setSiteVisitScheduled] = useState(Boolean(initialLead?.siteVisit?.scheduled));
  const [siteVisitDate, setSiteVisitDate] = useState(initialLead?.siteVisit?.date || "");
  const [siteVisitTime, setSiteVisitTime] = useState(initialLead?.siteVisit?.time || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (followUpRequired && (!followUpDate || !followUpTime)) {
      alert("Please select both Date and Time for the scheduled follow-up.");
      return;
    }

    if (!followUpRequired && !noFollowUpReason.trim()) {
      alert("Please provide a reason explaining why follow-up is not required.");
      return;
    }

    const selectedProject = projectCatalog.find((p) => p.id === selectedProjectId);
    const projectName = selectedProject ? selectedProject.name : undefined;
    const propertyInterest = selectedProject
      ? `${selectedProject.projectType || selectedProject.type} - ${selectedProject.name}`
      : `${interestType} in ${location || "Preferred Area"}`;

    if (isEditMode && initialLead) {
      const updatedLead: Lead = {
        ...initialLead,
        name: clientName.trim(),
        countryCode,
        phone: `${countryCode} ${phoneNumber.trim()}`,
        location: location.trim() || undefined,
        propertyInterest,
        projectId: selectedProjectId || undefined,
        projectName,
        interestType,
        budget,
        status: initialLead.status === "Converted" ? "Converted" : leadStatus,
        source: leadSource,
        customFields: customFieldValues,
        followUp: followUpRequired
          ? {
              required: true,
              date: followUpDate,
              time: followUpTime,
            }
          : { required: false },
        noFollowUpReason: !followUpRequired ? noFollowUpReason.trim() : undefined,
        siteVisit: siteVisitScheduled
          ? {
              scheduled: true,
              date: siteVisitDate || "Upcoming Weekend",
              time: siteVisitTime || "4:00 PM",
            }
          : undefined,
        activities: [
          ...(initialLead.activities || []),
          {
            id: `act-${initialLead.id}-${(initialLead.activities?.length || 0) + 1}`,
            title: "Lead Profile Updated",
            time: "Just now",
            type: "created",
          },
        ],
      };

      onUpdateLead?.(updatedLead);
    } else {
      const newId = generateNewLeadId();
      const newLead: Lead = {
        id: newId,
        name: clientName.trim(),
        countryCode,
        phone: `${countryCode} ${phoneNumber.trim()}`,
        location: location.trim() || undefined,
        propertyInterest,
        projectId: selectedProjectId || undefined,
        projectName,
        interestType,
        budget,
        status: leadStatus,
        source: leadSource,
        createdAt: "Just now",
        assignedTo: "Rohan Verma",
        pipelineStage: "new",
        customFields: customFieldValues,
        followUp: followUpRequired
          ? {
              required: true,
              date: followUpDate,
              time: followUpTime,
            }
          : { required: false },
        noFollowUpReason: !followUpRequired ? noFollowUpReason.trim() : undefined,
        siteVisit: siteVisitScheduled
          ? {
              scheduled: true,
              date: siteVisitDate || "Upcoming Weekend",
              time: siteVisitTime || "4:00 PM",
            }
          : undefined,
        notesList: [],
        activities: [
          {
            id: `act-${newId}-1`,
            title: `Lead Captured via ${leadSource}`,
            time: "Just now",
            type: "created",
          },
        ],
      };

      onAddLead?.(newLead);
    }

    onClose();
  };

  return (
    <div
      className="modal-sheet"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-lead-form-title"
      style={{ maxWidth: "560px" }}
    >
      {/* Modal Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div>
          <div id="modal-lead-form-title" style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
            {isEditMode ? "Edit Lead Details" : "Add New Real Estate Lead"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            {isEditMode
              ? "Update client requirements, property preferences, and schedule"
              : "Capture buyer requirements, budget & scheduling in one flow"}
          </div>
        </div>
        <button
          onClick={onClose}
          className="btn-icon"
          aria-label="Close"
          type="button"
        >
          <Icon name="x" size={20} />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* 1. Client Name */}
        <div>
          <label style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
            Client Name <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Rahul Sharma"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="input-search"
            style={{ paddingLeft: "12px" }}
          />
        </div>

        {/* 2. Phone Number (Country Code + Number) */}
        <div>
          <label style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
            Phone Number <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              style={{
                width: "110px",
                padding: "8px 10px",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-surface)",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>

            <input
              type="tel"
              required
              placeholder="e.g. 9876543210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input-search"
              style={{ flex: 1, paddingLeft: "12px" }}
            />
          </div>
        </div>

        {/* 3. Location & Budget Grid */}
        <div className="grid-2">
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Buyer Location / City
            </label>
            <input
              type="text"
              placeholder="e.g. Whitefield, Bangalore"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-search"
              style={{ paddingLeft: "12px" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Approximate Budget
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-surface)",
                fontSize: "13.5px",
                color: "var(--text-primary)",
              }}
            >
              {BUDGET_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Property / Project Selection (From Dynamic Central Project Catalog) */}
        <div>
          <label style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
            Interested Property / Project (from Catalog)
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-surface)",
              fontSize: "13.5px",
              color: "var(--text-primary)",
            }}
          >
            <option value="">-- General Requirement / Not Assigned --</option>
            {projectCatalog.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name} ({proj.location} • {proj.projectType || proj.type})
              </option>
            ))}
          </select>
        </div>

        {/* 5. Client Interest Type & Lead Status */}
        <div className="grid-2">
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Property Type Interest
            </label>
            <select
              value={interestType}
              onChange={(e) => setInterestType(e.target.value as typeof interestType)}
              style={{
                width: "100%",
                padding: "9px 12px",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-surface)",
                fontSize: "13.5px",
                color: "var(--text-primary)",
              }}
            >
              {INTEREST_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Lead Temperature / Status
            </label>
            <select
              value={leadStatus}
              onChange={(e) => setLeadStatus(e.target.value as typeof leadStatus)}
              style={{
                width: "100%",
                padding: "9px 12px",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-surface)",
                fontSize: "13.5px",
                color: "var(--text-primary)",
              }}
            >
              {LEAD_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lead Source */}
        <div>
          <label style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
            Lead Acquisition Source
          </label>
          <select
            value={leadSource}
            onChange={(e) => setLeadSource(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-surface)",
              fontSize: "13.5px",
              color: "var(--text-primary)",
            }}
          >
            {LEAD_SOURCES.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        {/* 6. Follow-up Required Toggle */}
        <div
          style={{
            padding: "12px",
            backgroundColor: "var(--bg-subtle)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                Follow-up Required? <span style={{ color: "var(--danger)" }}>*</span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Set a reminder call schedule or state documented reason
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                type="button"
                onClick={() => setFollowUpRequired(false)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: !followUpRequired ? "var(--bg-surface)" : "transparent",
                  color: !followUpRequired ? "var(--text-primary)" : "var(--text-muted)",
                  border: !followUpRequired ? "1px solid var(--border-strong)" : "1px solid transparent",
                  cursor: "pointer",
                }}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => setFollowUpRequired(true)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: followUpRequired ? "var(--brand-primary)" : "transparent",
                  color: followUpRequired ? "white" : "var(--text-muted)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Yes
              </button>
            </div>
          </div>

          {/* If Yes: Date and Time Inputs (Both Required) */}
          {followUpRequired ? (
            <div className="grid-2" style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid var(--border-subtle)" }}>
              <div>
                <label style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "3px" }}>
                  Follow-up Date <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="date"
                  required={followUpRequired}
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--bg-surface)",
                    fontSize: "13px",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "3px" }}>
                  Exact Follow-up Time <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="time"
                  required={followUpRequired}
                  value={followUpTime}
                  onChange={(e) => setFollowUpTime(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--bg-surface)",
                    fontSize: "13px",
                  }}
                />
              </div>
            </div>
          ) : (
            /* If No: Mandatory Reason */
            <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid var(--border-subtle)" }}>
              <label style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "3px" }}>
                Why is follow-up not required? <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                type="text"
                required={!followUpRequired}
                placeholder="e.g. Client requested callback next quarter, already booked elsewhere, etc."
                value={noFollowUpReason}
                onChange={(e) => setNoFollowUpReason(e.target.value)}
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface)",
                  fontSize: "13px",
                }}
              />
            </div>
          )}
        </div>

        {/* 7. Site Visit Scheduled Toggle */}
        <div
          style={{
            padding: "12px",
            backgroundColor: "var(--bg-subtle)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                Schedule Site Visit?
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Book physical property walkthrough appointment
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                type="button"
                onClick={() => setSiteVisitScheduled(false)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: !siteVisitScheduled ? "var(--bg-surface)" : "transparent",
                  color: !siteVisitScheduled ? "var(--text-primary)" : "var(--text-muted)",
                  border: !siteVisitScheduled ? "1px solid var(--border-strong)" : "1px solid transparent",
                  cursor: "pointer",
                }}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => setSiteVisitScheduled(true)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: siteVisitScheduled ? "var(--brand-primary)" : "transparent",
                  color: siteVisitScheduled ? "white" : "var(--text-muted)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Yes
              </button>
            </div>
          </div>

          {/* If Yes: Date and Time Inputs */}
          {siteVisitScheduled && (
            <div className="grid-2" style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid var(--border-subtle)" }}>
              <div>
                <label style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "3px" }}>
                  Visit Date
                </label>
                <input
                  type="date"
                  value={siteVisitDate}
                  onChange={(e) => setSiteVisitDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--bg-surface)",
                    fontSize: "13px",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "3px" }}>
                  Visit Time
                </label>
                <input
                  type="time"
                  value={siteVisitTime}
                  onChange={(e) => setSiteVisitTime(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--bg-surface)",
                    fontSize: "13px",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Custom Form Fields Configured via CRM Settings */}
        {customFields.length > 0 && (
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "var(--bg-subtle)",
              borderRadius: "var(--radius-md)",
              border: "1px dashed var(--border-subtle)",
            }}
          >
            <div
              style={{
                fontSize: "12.5px",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Icon name="sliders" size={14} />
              <span>Custom Advisory Fields (Broker Configured)</span>
            </div>

            <div className="grid-2">
              {customFields.map((field) => (
                <div key={field.id}>
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    {field.label} {field.required && <span style={{ color: "var(--danger)" }}>*</span>}
                  </label>

                  {field.type === "select" ? (
                    <select
                      value={customFieldValues[field.name] || ""}
                      onChange={(e) =>
                        setCustomFieldValues({
                          ...customFieldValues,
                          [field.name]: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--bg-surface)",
                        fontSize: "12.5px",
                      }}
                      required={field.required}
                    >
                      <option value="">{field.placeholder || "Select option..."}</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      rows={2}
                      value={customFieldValues[field.name] || ""}
                      onChange={(e) =>
                        setCustomFieldValues({
                          ...customFieldValues,
                          [field.name]: e.target.value,
                        })
                      }
                      placeholder={field.placeholder || ""}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "12.5px",
                      }}
                      required={field.required}
                    />
                  ) : (
                    <input
                      type={
                        field.type === "number"
                          ? "number"
                          : field.type === "email"
                          ? "email"
                          : field.type === "date"
                          ? "date"
                          : "text"
                      }
                      value={customFieldValues[field.name] || ""}
                      onChange={(e) =>
                        setCustomFieldValues({
                          ...customFieldValues,
                          [field.name]: e.target.value,
                        })
                      }
                      placeholder={field.placeholder || ""}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "12.5px",
                      }}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div
          style={{
            marginTop: "8px",
            paddingTop: "12px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            type="submit"
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            {isEditMode ? "Save Changes" : "Save Lead"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export function LeadForm({
  isOpen,
  onClose,
  onAddLead,
  onUpdateLead,
  initialLead = null,
  mode = "add",
}: LeadFormProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <LeadFormInner
        key={initialLead ? initialLead.id : "new-lead-form"}
        onClose={onClose}
        onAddLead={onAddLead}
        onUpdateLead={onUpdateLead}
        initialLead={initialLead}
        mode={mode}
      />
    </div>
  );
}
