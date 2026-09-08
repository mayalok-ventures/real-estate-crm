"use client";

import React, { useState, useMemo } from "react";
import {
  User,
  Team,
  DesignationRole,
  IncentivePlan,
  addUserToStore,
  updateUserInStore,
  setUserPermissionOverride,
  getStoredPermissionOverrides,
  assignIncentiveToUser,
  getStoredUserIncentives,
} from "@/data/teamData";
import { CATEGORY_ORDER, getPermissionsByCategory } from "@/config/permissions";
import { logActivity } from "@/utils/activityService";
import Icon from "@/components/Icon";
import DesignationFormModal from "./DesignationFormModal";
import TeamFormModal from "./TeamFormModal";
import IncentivePlanModal from "./IncentivePlanModal";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null;
  allTeams: Team[];
  allDesignations: DesignationRole[];
  allUsers: User[];
  allIncentivePlans: IncentivePlan[];
  onSaved: (user: User) => void;
  onDesignationCreated?: (designation: DesignationRole) => void;
  onTeamCreated?: (team: Team) => void;
}

type FormSection = "personal" | "organization" | "permissions" | "incentives";

export default function UserFormModal({
  isOpen,
  onClose,
  userToEdit,
  allTeams,
  allDesignations,
  allUsers,
  allIncentivePlans,
  onSaved,
  onDesignationCreated,
  onTeamCreated,
}: UserFormModalProps) {
  const [activeSection, setActiveSection] = useState<FormSection>("personal");

  // Local state for designations, teams & incentive plans created on-the-fly inside this modal
  const [localDesignations, setLocalDesignations] = useState<DesignationRole[]>([]);
  const [localTeams, setLocalTeams] = useState<Team[]>([]);
  const [localPlans, setLocalPlans] = useState<IncentivePlan[]>([]);

  const [isCreatingDesignation, setIsCreatingDesignation] = useState<boolean>(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState<boolean>(false);
  const [isCreatingPlan, setIsCreatingPlan] = useState<boolean>(false);

  // Merge external + locally created items
  const mergedDesignations = useMemo(() => {
    const map = new Map<string, DesignationRole>();
    allDesignations.forEach((d) => map.set(d.id, d));
    localDesignations.forEach((d) => map.set(d.id, d));
    return Array.from(map.values());
  }, [allDesignations, localDesignations]);

  const mergedTeams = useMemo(() => {
    const map = new Map<string, Team>();
    allTeams.forEach((t) => map.set(t.id, t));
    localTeams.forEach((t) => map.set(t.id, t));
    return Array.from(map.values());
  }, [allTeams, localTeams]);

  const mergedPlans = useMemo(() => {
    const map = new Map<string, IncentivePlan>();
    allIncentivePlans.forEach((p) => map.set(p.id, p));
    localPlans.forEach((p) => map.set(p.id, p));
    return Array.from(map.values());
  }, [allIncentivePlans, localPlans]);

  // Section 1: Personal
  const [name, setName] = useState<string>(() => userToEdit?.name || "");
  const [email, setEmail] = useState<string>(() => userToEdit?.email || "");
  const [phone, setPhone] = useState<string>(() => userToEdit?.phone || "");
  const [jobTitle, setJobTitle] = useState<string>(() => userToEdit?.jobTitle || "");
  const [employeeId, setEmployeeId] = useState<string>(() => userToEdit?.employeeId || "");
  const [department, setDepartment] = useState<string>(() => userToEdit?.department || "");

  // Section 2: Organization
  const [designationId, setDesignationId] = useState<string>(
    () => userToEdit?.designationId || allDesignations[0]?.id || ""
  );
  const [teamId, setTeamId] = useState<string>(() => userToEdit?.teamId || "");
  const [reportingManagerId, setReportingManagerId] = useState<string>(
    () => userToEdit?.reportingManagerId || ""
  );
  const [status, setStatus] = useState<User["status"]>(() => userToEdit?.status || "active");
  const [joiningDate, setJoiningDate] = useState<string>(
    () => userToEdit?.joiningDate || new Date().toISOString().split("T")[0]
  );

  // Section 3: Permission Overrides
  const existingOverrides = userToEdit ? getStoredPermissionOverrides()[userToEdit.id] : undefined;
  const [grantedOverrides, setGrantedOverrides] = useState<string[]>(
    () => existingOverrides?.grantedPermissionIds || []
  );
  const [revokedOverrides, setRevokedOverrides] = useState<string[]>(
    () => existingOverrides?.revokedPermissionIds || []
  );
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({ LEADS: true });

  // Section 4: Incentives
  const currentIncentive = userToEdit
    ? getStoredUserIncentives().find((a) => a.userId === userToEdit.id)
    : undefined;
  const [assignedPlanId, setAssignedPlanId] = useState<string>(
    () => currentIncentive?.incentivePlanId || ""
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDesignationSaved = (newDesig: DesignationRole) => {
    setLocalDesignations((prev) => [...prev, newDesig]);
    setDesignationId(newDesig.id);
    setIsCreatingDesignation(false);
    onDesignationCreated?.(newDesig);
  };

  const handleTeamSaved = (newTeam: Team) => {
    setLocalTeams((prev) => [...prev, newTeam]);
    setTeamId(newTeam.id);
    setIsCreatingTeam(false);
    onTeamCreated?.(newTeam);
  };

  const handlePlanSaved = (newPlan: IncentivePlan) => {
    setLocalPlans((prev) => [...prev, newPlan]);
    setAssignedPlanId(newPlan.id);
    setIsCreatingPlan(false);
  };

  if (!isOpen) return null;

  const permissionsByCategory = getPermissionsByCategory();
  const selectedDesignation = mergedDesignations.find((d) => d.id === designationId);
  const basePermissions = new Set(selectedDesignation?.permissionIds || []);

  const toggleOverride = (permId: string) => {
    const isBase = basePermissions.has(permId);

    if (isBase) {
      if (revokedOverrides.includes(permId)) {
        setRevokedOverrides((prev) => prev.filter((id) => id !== permId));
      } else {
        setRevokedOverrides((prev) => [...prev, permId]);
        setGrantedOverrides((prev) => prev.filter((id) => id !== permId));
      }
    } else {
      if (grantedOverrides.includes(permId)) {
        setGrantedOverrides((prev) => prev.filter((id) => id !== permId));
      } else {
        setGrantedOverrides((prev) => [...prev, permId]);
        setRevokedOverrides((prev) => prev.filter((id) => id !== permId));
      }
    }
  };

  const isPermissionEffective = (permId: string): boolean => {
    if (revokedOverrides.includes(permId)) return false;
    if (grantedOverrides.includes(permId)) return true;
    return basePermissions.has(permId);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      setActiveSection("personal");
      setErrorMessage("Please enter the member's full name.");
      return;
    }
    if (!email.trim() || !phone.trim()) {
      setActiveSection("personal");
      setErrorMessage("Email address and phone number are required.");
      return;
    }
    if (!designationId) {
      setActiveSection("organization");
      setErrorMessage("Please select or create a designation / role for this member.");
      return;
    }

    let savedUser: User;

    if (userToEdit) {
      savedUser = {
        ...userToEdit,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        jobTitle: jobTitle.trim() || selectedDesignation?.name || "Advisor",
        employeeId: employeeId.trim() || undefined,
        department: department.trim() || undefined,
        designationId,
        teamId: teamId || undefined,
        reportingManagerId: reportingManagerId || undefined,
        status,
        joiningDate,
        updatedAt: new Date().toISOString(),
      };
      updateUserInStore(savedUser);
      logActivity({
        action: "user_updated",
        module: "team",
        entityType: "user",
        entityId: savedUser.id,
        entityName: savedUser.name,
        type: "audit",
        metadata: { status, teamId, designationId },
      });
    } else {
      savedUser = addUserToStore({
        organizationId: "org_sahyak_main",
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        jobTitle: jobTitle.trim() || selectedDesignation?.name || "Advisor",
        employeeId: employeeId.trim() || undefined,
        department: department.trim() || undefined,
        designationId,
        teamId: teamId || undefined,
        reportingManagerId: reportingManagerId || undefined,
        status,
        joiningDate,
      });
      logActivity({
        action: "user_created",
        module: "team",
        entityType: "user",
        entityId: savedUser.id,
        entityName: savedUser.name,
        type: "audit",
        metadata: { status, teamId, designationId },
      });
    }

    // Save individual permission overrides
    setUserPermissionOverride(savedUser.id, grantedOverrides, revokedOverrides);

    // Save incentive assignment if selected
    if (assignedPlanId) {
      assignIncentiveToUser(savedUser.id, assignedPlanId, joiningDate);
    }

    onSaved(savedUser);
    onClose();
  };

  const steps: { id: FormSection; num: number; label: string; icon: string }[] = [
    { id: "personal", num: 1, label: "Personal Details", icon: "user" },
    { id: "organization", num: 2, label: "Team & Role", icon: "building" },
    { id: "permissions", num: 3, label: "Access Overrides", icon: "shield" },
    { id: "incentives", num: 4, label: "Incentives", icon: "award" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === activeSection);
  const progressPercent = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
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
              <Icon name="user-plus" size={18} />
            </div>
            <div>
              <h2 className="modal-header-title">
                {userToEdit ? `Edit Member: ${userToEdit.name}` : "Add Team Member"}
              </h2>
              <p className="modal-header-desc">
                Configure profile, team membership, company designation, and access
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

        {/* Stepper Navigation */}
        <div style={{ backgroundColor: "var(--bg-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
          {/* Desktop & Tablet Steps */}
          <div className="stepper-nav">
            {steps.map((step, idx) => {
              const isActive = activeSection === step.id;
              const isPast = idx < currentStepIndex;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setActiveSection(step.id);
                  }}
                  className={`stepper-tab ${isActive ? "active" : ""} ${isPast ? "completed" : ""}`}
                >
                  <span className="stepper-badge">
                    {isPast ? "✓" : step.num}
                  </span>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Progress Bar (Visible on narrow viewports) */}
          <div style={{ height: "3px", width: "100%", backgroundColor: "var(--border-subtle)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${progressPercent}%`,
                backgroundColor: "var(--brand-primary)",
                transition: "width 0.25s ease",
              }}
            />
          </div>
        </div>

        {/* Form Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}
        >
          <div className="modal-body">
            {errorMessage && (
              <div className="form-error">
                {errorMessage}
              </div>
            )}

            {/* STEP 1: PERSONAL DETAILS */}
            {activeSection === "personal" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="form-group">
                  <label className="form-label">
                    Full Name <span className="form-label-required">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Email Address <span className="form-label-required">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      placeholder="rahul@company.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Phone Number <span className="form-label-required">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Job Title / Working Designation
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Senior Luxury Consultant, Telecaller, Sales Closer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                  <span className="form-hint">
                    Display title shown on profile and business cards.
                  </span>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. EMP-104"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Department
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Direct Sales, Telecalling"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: TEAM & ROLE */}
            {activeSection === "organization" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Designation / Role Selector */}
                <div className="form-group">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px", marginBottom: "4px" }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>
                      Company Designation / Role <span className="form-label-required">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCreatingDesignation(true)}
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "var(--brand-primary)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "2px 6px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Icon name="plus" size={12} />
                      <span>Create New Designation</span>
                    </button>
                  </div>

                  {mergedDesignations.length > 0 ? (
                    <select
                      className="form-select"
                      value={designationId}
                      onChange={(e) => {
                        setDesignationId(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                    >
                      <option value="">Select a Designation...</option>
                      {mergedDesignations.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.permissionIds.length} permissions)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div
                      style={{
                        padding: "12px 14px",
                        backgroundColor: "var(--warning-light)",
                        border: "1px solid var(--warning-border)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "12px",
                      }}
                    >
                      <div style={{ fontWeight: 700, color: "var(--warning)", marginBottom: "4px" }}>
                        No Designations Created Yet
                      </div>
                      <p style={{ color: "var(--text-secondary)", margin: "0 0 8px 0" }}>
                        Your company defines custom designations and permissions.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsCreatingDesignation(true)}
                        className="btn btn-primary btn-sm"
                      >
                        <Icon name="plus" size={13} />
                        <span>Create First Designation</span>
                      </button>
                    </div>
                  )}
                  <span className="form-hint">
                    Determines base system permissions for leads, pipeline, site visits, and exports.
                  </span>
                </div>

                {/* Team Selector */}
                <div className="form-group">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px", marginBottom: "4px" }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>
                      Assigned Team
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCreatingTeam(true)}
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "var(--brand-primary)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "2px 6px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Icon name="plus" size={12} />
                      <span>Create New Team</span>
                    </button>
                  </div>

                  <select
                    className="form-select"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                  >
                    <option value="">No Team Assigned (Independent / Direct)</option>
                    {mergedTeams
                      .filter((t) => t.status === "active")
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Reporting Manager */}
                <div className="form-group">
                  <label className="form-label">
                    Reporting Manager
                  </label>
                  <select
                    className="form-select"
                    value={reportingManagerId}
                    onChange={(e) => setReportingManagerId(e.target.value)}
                  >
                    <option value="">None (Flat Structure / Reports to Principal)</option>
                    {allUsers
                      .filter((u) => u.id !== userToEdit?.id)
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.jobTitle})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Status & Joining Date */}
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Account Status
                    </label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as User["status"])}
                    >
                      <option value="active">Active (Can log in & access CRM)</option>
                      <option value="inactive">Inactive (Access suspended)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Joining Date
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ACCESS OVERRIDES */}
            {activeSection === "permissions" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div
                  style={{
                    padding: "12px 14px",
                    backgroundColor: "var(--brand-primary-light)",
                    border: "1px solid var(--brand-primary-border)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "12px",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "var(--brand-primary)", marginBottom: "4px" }}>
                    Inherited from: {selectedDesignation?.name || "No Designation Selected"}
                  </div>
                  <p style={{ color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                    This member automatically receives all <strong>{basePermissions.size} default permissions</strong> configured in their designation. You can customize individual exceptions below.
                  </p>
                </div>

                {/* Overrides Toolbar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Individual Exceptions: {grantedOverrides.length} Custom Granted, {revokedOverrides.length} Custom Revoked
                  </div>
                  {(grantedOverrides.length > 0 || revokedOverrides.length > 0) && (
                    <button
                      type="button"
                      onClick={() => {
                        setGrantedOverrides([]);
                        setRevokedOverrides([]);
                      }}
                      style={{ fontSize: "11px", fontWeight: 600, color: "var(--danger)" }}
                    >
                      Reset All Overrides
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div style={{ maxHeight: "360px", overflowY: "auto", paddingRight: "4px" }}>
                  {CATEGORY_ORDER.map((cat) => {
                    const perms = permissionsByCategory[cat] || [];
                    const isExpanded = !!expandedCats[cat];

                    return (
                      <div key={cat} className="permission-cat-card">
                        <div
                          className={`permission-cat-header ${isExpanded ? "expanded" : ""}`}
                          onClick={() => setExpandedCats((prev) => ({ ...prev, [cat]: !prev[cat] }))}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size={14} />
                            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                              {cat}
                            </span>
                          </div>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            {perms.filter((p) => isPermissionEffective(p.id)).length} / {perms.length} allowed
                          </span>
                        </div>

                        {isExpanded && (
                          <div>
                            {perms.map((perm) => {
                              const isEffective = isPermissionEffective(perm.id);
                              const isBase = basePermissions.has(perm.id);
                              const isGranted = grantedOverrides.includes(perm.id);
                              const isRevoked = revokedOverrides.includes(perm.id);

                              return (
                                <div
                                  key={perm.id}
                                  className="permission-item-row"
                                  onClick={() => toggleOverride(perm.id)}
                                >
                                  <input
                                    type="checkbox"
                                    className="permission-checkbox"
                                    checked={isEffective}
                                    onChange={() => toggleOverride(perm.id)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>
                                        {perm.label}
                                      </span>
                                      {isGranted && (
                                        <span className="badge badge-success" style={{ fontSize: "9px" }}>
                                          Custom Granted
                                        </span>
                                      )}
                                      {isRevoked && (
                                        <span className="badge badge-danger" style={{ fontSize: "9px" }}>
                                          Custom Revoked
                                        </span>
                                      )}
                                      {!isGranted && !isRevoked && isBase && (
                                        <span className="badge badge-neutral" style={{ fontSize: "9px" }}>
                                          Inherited
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "1px" }}>
                                      {perm.description}
                                    </div>
                                  </div>
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
            )}

            {/* STEP 4: INCENTIVES */}
            {activeSection === "incentives" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px", marginBottom: "4px" }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    Incentive & Commission Structure (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCreatingPlan(true)}
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--brand-primary)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "2px 6px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Icon name="plus" size={12} />
                    <span>Create New Plan</span>
                  </button>
                </div>

                <p className="form-hint" style={{ marginTop: "-8px" }}>
                  Calculate commissions and performance bonuses automatically when leads convert into booked deals.
                </p>

                {/* Option 1: No Plan */}
                <label
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    border: `1px solid ${!assignedPlanId ? "var(--brand-primary)" : "var(--border-subtle)"}`,
                    backgroundColor: !assignedPlanId ? "var(--brand-primary-light)" : "var(--bg-surface)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="incentive_choice"
                    checked={!assignedPlanId}
                    onChange={() => setAssignedPlanId("")}
                  />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                      No Incentive Plan
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                      Member receives fixed salary or non-incentive compensation.
                    </div>
                  </div>
                </label>

                {/* Option 2: Choose Existing Plan */}
                {mergedPlans.map((plan) => {
                  const isSelected = assignedPlanId === plan.id;
                  return (
                    <label
                      key={plan.id}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${isSelected ? "var(--brand-primary)" : "var(--border-subtle)"}`,
                        backgroundColor: isSelected ? "var(--brand-primary-light)" : "var(--bg-surface)",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="incentive_choice"
                        checked={isSelected}
                        onChange={() => setAssignedPlanId(plan.id)}
                        style={{ marginTop: "3px" }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                            {plan.name}
                          </span>
                          <span className="badge badge-success" style={{ fontSize: "10px", textTransform: "uppercase" }}>
                            {plan.type.replace("_", " ")}
                          </span>
                        </div>
                        {plan.description && (
                          <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                            {plan.description}
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sticky Navigation Footer */}
          <div className="modal-footer" style={{ flexWrap: "wrap", gap: "8px" }}>
            <div>
              {currentStepIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setActiveSection(steps[currentStepIndex - 1].id);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  ← Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {/* Direct Save Available from Step 2 onwards if name & designation are chosen */}
              {currentStepIndex > 0 && currentStepIndex < steps.length - 1 && (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="btn btn-secondary btn-sm"
                  style={{ color: "var(--brand-primary)", fontWeight: 700 }}
                >
                  Save Member Now
                </button>
              )}

              {currentStepIndex < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    if (activeSection === "personal") {
                      if (!name.trim()) {
                        setErrorMessage("Please enter member full name.");
                        return;
                      }
                      if (!email.trim() || !phone.trim()) {
                        setErrorMessage("Email address and phone number are required.");
                        return;
                      }
                    }
                    setActiveSection(steps[currentStepIndex + 1].id);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <span>Next: {steps[currentStepIndex + 1].label}</span>
                  <span>&rarr;</span>
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ minWidth: "140px" }}
                >
                  {userToEdit ? "Update Member" : "Save Member"}
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Nested Modal: Create Designation on-the-fly */}
        <DesignationFormModal
          isOpen={isCreatingDesignation}
          onClose={() => setIsCreatingDesignation(false)}
          onSaved={handleDesignationSaved}
        />

        {/* Nested Modal: Create Team on-the-fly */}
        <TeamFormModal
          isOpen={isCreatingTeam}
          onClose={() => setIsCreatingTeam(false)}
          allUsers={allUsers}
          onSaved={handleTeamSaved}
        />

        {/* Nested Modal: Create Incentive Plan on-the-fly */}
        <IncentivePlanModal
          isOpen={isCreatingPlan}
          onClose={() => setIsCreatingPlan(false)}
          onSaved={handlePlanSaved}
        />
      </div>
    </div>
  );
}
