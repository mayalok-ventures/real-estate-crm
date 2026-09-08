"use client";

import React, { useState } from "react";
import { Icon, IconName } from "@/components/Icon";
import {
  BrokerProfile,
  getStoredBrokerProfile,
  saveStoredBrokerProfile,
  LeadFieldConfig,
  LeadFieldType,
  getStoredLeadFieldConfigs,
  addLeadFieldConfigToStore,
  updateLeadFieldConfigInStore,
  deleteLeadFieldConfigFromStore,
  saveStoredLeadFieldConfigs,
} from "@/data/mockData";

type SettingsTab = "profile" | "lead-fields";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Alert / Toast
  const [alert, setAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const showAlert = (type: "success" | "error", text: string) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 3500);
  };

  // 1. Profile State
  const [profile, setProfile] = useState<BrokerProfile>(() => getStoredBrokerProfile());

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredBrokerProfile(profile);
    showAlert("success", "Broker identity profile updated successfully.");
  };

  // 2. Lead Fields State
  const [leadFields, setLeadFields] = useState<LeadFieldConfig[]>(() => getStoredLeadFieldConfigs());
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [editingField, setEditingField] = useState<LeadFieldConfig | null>(null);

  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState<LeadFieldType>("text");
  const [fieldRequired, setFieldRequired] = useState(false);
  const [fieldPlaceholder, setFieldPlaceholder] = useState("");
  const [fieldOptions, setFieldOptions] = useState("");

  const resetFieldForm = () => {
    setFieldLabel("");
    setFieldName("");
    setFieldType("text");
    setFieldRequired(false);
    setFieldPlaceholder("");
    setFieldOptions("");
    setEditingField(null);
  };

  const openAddField = () => {
    resetFieldForm();
    setShowAddFieldModal(true);
  };

  const openEditField = (f: LeadFieldConfig) => {
    setEditingField(f);
    setFieldLabel(f.label);
    setFieldName(f.name);
    setFieldType(f.type);
    setFieldRequired(f.required);
    setFieldPlaceholder(f.placeholder || "");
    setFieldOptions(f.options ? f.options.join(", ") : "");
    setShowAddFieldModal(true);
  };

  const handleSaveField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldLabel.trim() || !fieldName.trim()) {
      showAlert("error", "Please provide both field label and field identifier name.");
      return;
    }

    const optionsArray =
      fieldType === "select" || fieldType === "multiselect"
        ? fieldOptions
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean)
        : undefined;

    if (editingField) {
      const updatedConfig: LeadFieldConfig = {
        ...editingField,
        label: fieldLabel.trim(),
        name: editingField.isSystem ? editingField.name : fieldName.trim().toLowerCase().replace(/\s+/g, "_"),
        type: editingField.isSystem ? editingField.type : fieldType,
        required: fieldRequired,
        placeholder: fieldPlaceholder.trim() || undefined,
        options: optionsArray,
      };
      const updated = updateLeadFieldConfigInStore(updatedConfig);
      setLeadFields(updated);
      showAlert("success", `Field "${updatedConfig.label}" updated successfully.`);
    } else {
      const newConfig: LeadFieldConfig = {
        id: `field-${Date.now()}`,
        name: fieldName.trim().toLowerCase().replace(/\s+/g, "_"),
        label: fieldLabel.trim(),
        type: fieldType,
        required: fieldRequired,
        isSystem: false,
        isActive: true,
        placeholder: fieldPlaceholder.trim() || undefined,
        options: optionsArray,
        order: leadFields.length + 1,
        section: "custom",
      };
      const updated = addLeadFieldConfigToStore(newConfig);
      setLeadFields(updated);
      showAlert("success", `Custom field "${newConfig.label}" added to Lead Form.`);
    }

    setShowAddFieldModal(false);
    resetFieldForm();
  };

  const handleToggleFieldActive = (f: LeadFieldConfig) => {
    const updated = updateLeadFieldConfigInStore({ ...f, isActive: !f.isActive });
    setLeadFields(updated);
    showAlert("success", `Field "${f.label}" is now ${!f.isActive ? "active" : "disabled"}.`);
  };

  const handleDeleteField = (id: string) => {
    const res = deleteLeadFieldConfigFromStore(id);
    if (!res.success) {
      showAlert("error", res.message || "Failed to delete field.");
    } else {
      setLeadFields(res.updatedConfigs);
      showAlert("success", "Custom field removed from lead form.");
    }
  };

  const handleMoveField = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= leadFields.length) return;

    const list = [...leadFields];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    saveStoredLeadFieldConfigs(reordered);
    setLeadFields(reordered);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Alert Banner */}
      {alert && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: alert.type === "error" ? "var(--danger, #dc2626)" : "var(--brand-primary)",
            color: "white",
            padding: "10px 18px",
            borderRadius: "var(--radius-lg)",
            fontSize: "13px",
            fontWeight: 600,
            zIndex: 9999,
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>{alert.type === "error" ? "⚠️" : "✔"}</span>
          <span>{alert.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <h1 className="page-title">Profile & Form Settings</h1>
        <p className="page-subtitle">
          Manage broker agency branding and customize the Lead intake form fields
        </p>
      </div>

      {/* Segmented Settings Tabs */}
      <div
        style={{
          display: "flex",
          backgroundColor: "var(--bg-subtle)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          padding: "3px",
          gap: "4px",
        }}
      >
        {(
          [
            { id: "profile", label: "Broker Profile", icon: "user" as IconName },
            { id: "lead-fields", label: "Lead Form Fields", icon: "sliders" as IconName },
          ] as const
        ).map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              style={{
                flex: 1,
                padding: "7px 12px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                backgroundColor: active ? "var(--bg-surface)" : "transparent",
                color: active ? "var(--brand-primary)" : "var(--text-secondary)",
                fontWeight: active ? 600 : 500,
                fontSize: "12.5px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                boxShadow: active ? "var(--shadow-sm)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              <Icon name={tab.icon} size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Broker Profile Tab */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Icon name="user" size={17} />
            <span>Broker Identity & Official Agency Branding</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "14px",
            }}
          >
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13.5px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Official Agency / Business Name *
              </label>
              <input
                type="text"
                required
                value={profile.agencyName}
                onChange={(e) => setProfile({ ...profile, agencyName: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13.5px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Primary Mobile Phone *
              </label>
              <input
                type="text"
                required
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13.5px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13.5px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                RERA Agent Registration Number
              </label>
              <input
                type="text"
                value={profile.reraNumber || ""}
                onChange={(e) => setProfile({ ...profile, reraNumber: e.target.value })}
                placeholder="e.g. PRM/KA/RERA/1251/AGENT/2024/0082"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13.5px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Operating City / Region
              </label>
              <input
                type="text"
                value={profile.city || ""}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                placeholder="e.g. Bangalore, Karnataka"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13.5px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Professional Designation
              </label>
              <input
                type="text"
                value={profile.designation || ""}
                onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                placeholder="e.g. Principal Consultant & Licensed Channel Partner"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13.5px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                Office / Business Address
              </label>
              <input
                type="text"
                value={profile.address || ""}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="Office suite, building, street address"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13.5px" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", marginTop: "8px", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px" }}>
              <input
                type="checkbox"
                checked={profile.notificationsEnabled}
                onChange={(e) => setProfile({ ...profile, notificationsEnabled: e.target.checked })}
              />
              <span>Enable Morning Follow-up Notifications</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px" }}>
              <input
                type="checkbox"
                checked={profile.soundAlerts}
                onChange={(e) => setProfile({ ...profile, soundAlerts: e.target.checked })}
              />
              <span>Enable In-App Due Alarm Chime</span>
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn btn-primary" style={{ padding: "8px 24px" }}>
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* 2. Lead Form Custom Fields Configuration Tab */}
      {activeTab === "lead-fields" && (
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                <Icon name="sliders" size={17} />
                <span>Lead Intake Form Fields</span>
              </div>
              <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                Customize the fields shown when adding or editing leads. System-critical fields are protected to guarantee CRM stability.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddField}
              className="btn btn-primary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Icon name="plus" size={14} />
              <span>Add Custom Field</span>
            </button>
          </div>

          {/* Fields Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--bg-subtle)", textAlign: "left", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)" }}>
                  <th style={{ padding: "10px" }}>Order</th>
                  <th style={{ padding: "10px" }}>Field Label</th>
                  <th style={{ padding: "10px" }}>Identifier (Key)</th>
                  <th style={{ padding: "10px" }}>Type</th>
                  <th style={{ padding: "10px" }}>Classification</th>
                  <th style={{ padding: "10px" }}>Requirement</th>
                  <th style={{ padding: "10px" }}>Status</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leadFields.map((field, idx) => (
                  <tr key={field.id} style={{ borderBottom: "1px solid var(--border-subtle)", opacity: field.isActive ? 1 : 0.6 }}>
                    <td style={{ padding: "10px", color: "var(--text-muted)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span>#{field.order || idx + 1}</span>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveField(idx, "up")}
                          style={{ border: "none", background: "none", cursor: idx === 0 ? "default" : "pointer", padding: "1px" }}
                          title="Move up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={idx === leadFields.length - 1}
                          onClick={() => handleMoveField(idx, "down")}
                          style={{ border: "none", background: "none", cursor: idx === leadFields.length - 1 ? "default" : "pointer", padding: "1px" }}
                          title="Move down"
                        >
                          ▼
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: "10px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {field.label}
                    </td>
                    <td style={{ padding: "10px", fontFamily: "monospace", fontSize: "12px", color: "var(--text-secondary)" }}>
                      {field.name}
                    </td>
                    <td style={{ padding: "10px" }}>
                      <span className="badge badge-neutral" style={{ textTransform: "capitalize", fontSize: "11px" }}>
                        {field.type}
                      </span>
                    </td>
                    <td style={{ padding: "10px" }}>
                      {field.isSystem ? (
                        <span className="badge badge-info" style={{ fontSize: "10.5px" }}>
                          System Protected
                        </span>
                      ) : (
                        <span className="badge badge-warning" style={{ fontSize: "10.5px" }}>
                          Custom Field
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "10px" }}>
                      {field.required ? (
                        <span style={{ color: "var(--danger)", fontWeight: 700, fontSize: "12px" }}>* Required</span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Optional</span>
                      )}
                    </td>
                    <td style={{ padding: "10px" }}>
                      <button
                        type="button"
                        onClick={() => handleToggleFieldActive(field)}
                        className={`badge ${field.isActive ? "badge-success" : "badge-neutral"}`}
                        style={{ cursor: "pointer", border: "none" }}
                      >
                        {field.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td style={{ padding: "10px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => openEditField(field)}
                          className="btn-icon"
                          title="Edit Field Configuration"
                          style={{ padding: "4px" }}
                        >
                          <Icon name="edit" size={14} />
                        </button>

                        {!field.isSystem && (
                          <button
                            type="button"
                            onClick={() => handleDeleteField(field.id)}
                            className="btn-icon"
                            title="Delete Custom Field"
                            style={{ padding: "4px", color: "var(--danger)" }}
                          >
                            <Icon name="trash" size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Field Modal */}
      {showAddFieldModal && (
        <div className="modal-overlay" onClick={() => setShowAddFieldModal(false)}>
          <div
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: "480px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                {editingField ? `Configure: ${editingField.label}` : "Add Custom Lead Field"}
              </div>
              <button
                type="button"
                onClick={() => setShowAddFieldModal(false)}
                className="btn-icon"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveField} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  Field Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Preferred Floor Range, Work Location"
                  value={fieldLabel}
                  onChange={(e) => setFieldLabel(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13.5px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  System Key / Identifier *
                </label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingField?.isSystem)}
                  placeholder="e.g. floor_preference"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    backgroundColor: editingField?.isSystem ? "var(--bg-subtle)" : "var(--bg-surface)",
                  }}
                />
                {editingField?.isSystem && (
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                    System keys cannot be altered to protect CRM database integrity.
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  Field Input Type
                </label>
                <select
                  disabled={Boolean(editingField?.isSystem)}
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value as LeadFieldType)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "13px",
                    backgroundColor: editingField?.isSystem ? "var(--bg-subtle)" : "var(--bg-surface)",
                  }}
                >
                  <option value="text">Single-line Text</option>
                  <option value="number">Number</option>
                  <option value="email">Email Address</option>
                  <option value="phone">Phone Number</option>
                  <option value="select">Dropdown Select</option>
                  <option value="multiselect">Multi-select Options</option>
                  <option value="date">Date Picker</option>
                  <option value="textarea">Multi-line Textarea</option>
                </select>
              </div>

              {(fieldType === "select" || fieldType === "multiselect") && (
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Dropdown Options (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Low Floor (1-4), Mid Floor (5-12), Penthouse"
                    value={fieldOptions}
                    onChange={(e) => setFieldOptions(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13.5px" }}
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  Placeholder Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Enter buyer preferred floor..."
                  value={fieldPlaceholder}
                  onChange={(e) => setFieldPlaceholder(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", fontSize: "13.5px" }}
                />
              </div>

              <div style={{ marginTop: "4px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px" }}>
                  <input
                    type="checkbox"
                    checked={fieldRequired}
                    onChange={(e) => setFieldRequired(e.target.checked)}
                  />
                  <span>Mark as Mandatory / Required Field</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingField ? "Save Field" : "Create Field"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddFieldModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
