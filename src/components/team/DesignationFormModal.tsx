"use client";

import React, { useState } from "react";
import { ALL_PERMISSIONS, CATEGORY_ORDER, PermissionCategory, getPermissionsByCategory } from "@/config/permissions";
import { DesignationRole, addDesignationToStore, updateDesignationInStore } from "@/data/teamData";
import { logActivity } from "@/utils/activityService";
import Icon from "@/components/Icon";

interface DesignationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  designationToEdit?: DesignationRole | null;
  onSaved: (designation: DesignationRole) => void;
}

export default function DesignationFormModal({
  isOpen,
  onClose,
  designationToEdit,
  onSaved,
}: DesignationFormModalProps) {
  const [name, setName] = useState<string>(() => designationToEdit?.name || "");
  const [description, setDescription] = useState<string>(() => designationToEdit?.description || "");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    () => designationToEdit?.permissionIds || []
  );
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    LEADS: true,
    PIPELINE: true,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const permissionsByCategory = getPermissionsByCategory();

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  const selectCategoryAll = (cat: PermissionCategory, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const ids = (permissionsByCategory[cat] || []).map((p) => p.id);
    setSelectedPermissions((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const clearCategoryAll = (cat: PermissionCategory, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const ids = new Set((permissionsByCategory[cat] || []).map((p) => p.id));
    setSelectedPermissions((prev) => prev.filter((id) => !ids.has(id)));
  };

  const handleSelectAllGlobal = () => {
    setSelectedPermissions(ALL_PERMISSIONS.map((p) => p.id));
  };

  const handleClearAllGlobal = () => {
    setSelectedPermissions([]);
  };

  const handleExpandAll = () => {
    const exp: Record<string, boolean> = {};
    CATEGORY_ORDER.forEach((c) => { exp[c] = true; });
    setExpandedCategories(exp);
  };

  const handleCollapseAll = () => {
    setExpandedCategories({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Please enter a designation title / role name.");
      return;
    }

    if (designationToEdit) {
      const updated: DesignationRole = {
        ...designationToEdit,
        name: name.trim(),
        description: description.trim(),
        permissionIds: selectedPermissions,
        updatedAt: new Date().toISOString(),
      };
      updateDesignationInStore(updated);
      logActivity({
        action: "designation_updated",
        module: "team",
        entityType: "designation",
        entityId: updated.id,
        entityName: updated.name,
        type: "audit",
        metadata: { permissionsCount: selectedPermissions.length },
      });
      onSaved(updated);
    } else {
      const created = addDesignationToStore({
        name: name.trim(),
        description: description.trim(),
        permissionIds: selectedPermissions,
      });
      logActivity({
        action: "designation_created",
        module: "team",
        entityType: "designation",
        entityId: created.id,
        entityName: created.name,
        type: "audit",
        metadata: { permissionsCount: selectedPermissions.length },
      });
      onSaved(created);
    }

    onClose();
  };

  return (
    <div className="modal-overlay-nested" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "680px" }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--brand-primary-light)",
                color: "var(--brand-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="shield" size={18} />
            </div>
            <div>
              <h2 className="modal-header-title">
                {designationToEdit ? "Edit Designation / Role" : "Create Custom Designation"}
              </h2>
              <p className="modal-header-desc">
                Define reusable permission template for your organization
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-icon"
            aria-label="Close modal"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          <div className="modal-body">
            {errorMessage && (
              <div className="form-error">
                {errorMessage}
              </div>
            )}

            {/* Designation Title */}
            <div className="form-group">
              <label className="form-label">
                Designation Title <span className="form-label-required">*</span>
              </label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Senior Property Advisor, Sales Closer, Telecaller"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
              />
              <span className="form-hint">
                Companies can define any arbitrary title. No rigid super admin or manager roles enforced.
              </span>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Role Description / Scope
              </label>
              <textarea
                rows={2}
                className="form-textarea"
                placeholder="Briefly describe responsibilities and level of authority..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Permissions Section */}
            <div className="form-group" style={{ gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                <div>
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    Permissions Attached ({selectedPermissions.length} of {ALL_PERMISSIONS.length})
                  </label>
                  <span className="form-hint">
                    Members with this designation will inherit all checked permissions by default.
                  </span>
                </div>
              </div>

              {/* Permissions Action Toolbar */}
              <div className="permission-toolbar">
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={handleSelectAllGlobal}
                    className="btn-toolbar-action"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllGlobal}
                    className="btn-toolbar-action"
                  >
                    Clear All
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={handleExpandAll}
                    className="btn-toolbar-action"
                  >
                    Expand All
                  </button>
                  <button
                    type="button"
                    onClick={handleCollapseAll}
                    className="btn-toolbar-action"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              {/* Category Accordion List */}
              <div style={{ maxHeight: "360px", overflowY: "auto", paddingRight: "4px" }}>
                {CATEGORY_ORDER.map((cat) => {
                  const perms = permissionsByCategory[cat] || [];
                  const activeCount = perms.filter((p) => selectedPermissions.includes(p.id)).length;
                  const isExpanded = !!expandedCategories[cat];

                  return (
                    <div key={cat} className="permission-cat-card">
                      {/* Accordion Category Header */}
                      <div
                        className={`permission-cat-header ${isExpanded ? "expanded" : ""}`}
                        onClick={() => toggleCategory(cat)}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Icon
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={14}
                          />
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                            {cat}
                          </span>
                          <span
                            className="badge badge-info"
                            style={{ fontSize: "10px", padding: "1px 6px" }}
                          >
                            {activeCount} / {perms.length} active
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => selectCategoryAll(cat, e)}
                            className="btn-toolbar-action"
                            style={{ fontSize: "10px", padding: "2px 6px" }}
                          >
                            All
                          </button>
                          <button
                            type="button"
                            onClick={(e) => clearCategoryAll(cat, e)}
                            className="btn-toolbar-action"
                            style={{ fontSize: "10px", padding: "2px 6px" }}
                          >
                            None
                          </button>
                        </div>
                      </div>

                      {/* Permission Items */}
                      {isExpanded && (
                        <div>
                          {perms.map((perm) => {
                            const isChecked = selectedPermissions.includes(perm.id);
                            return (
                              <div
                                key={perm.id}
                                className="permission-item-row"
                                onClick={() => togglePermission(perm.id)}
                              >
                                <input
                                  type="checkbox"
                                  className="permission-checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(perm.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  id={`perm-${perm.id}`}
                                />
                                <label
                                  htmlFor={`perm-${perm.id}`}
                                  style={{ cursor: "pointer", flex: 1, minWidth: 0 }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>
                                    {perm.label}
                                  </div>
                                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "1px", lineHeight: 1.35 }}>
                                    {perm.description}
                                  </div>
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ minWidth: "140px" }}
            >
              {designationToEdit ? "Update Designation" : "Save Designation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
