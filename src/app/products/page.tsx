"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import {
  ProjectItem,
  getStoredProjects,
  addProjectToStore,
  updateProjectInStore,
} from "@/data/mockData";
import { ProjectForm } from "@/components/products/ProjectForm";
import { ClientBrochureModal } from "@/components/common/ClientBrochureModal";

export default function ProductsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(() => getStoredProjects());

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Project Modals state
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // Brochure Modal
  const [brochureProject, setBrochureProject] = useState<ProjectItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Project Handlers
  const handleCreateProject = (newProject: ProjectItem) => {
    const updated = addProjectToStore(newProject);
    setProjects(updated);
    setShowAddProjectModal(false);
    showToast(`Project "${newProject.name}" successfully added to catalog!`);
  };

  const handleUpdateProject = (updatedProj: ProjectItem) => {
    const updated = updateProjectInStore(updatedProj);
    setProjects(updated);
    setEditingProject(null);
    showToast(`Project "${updatedProj.name}" updated successfully!`);
  };

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      project.name.toLowerCase().includes(q) ||
      project.developer.toLowerCase().includes(q) ||
      project.location.toLowerCase().includes(q) ||
      project.projectType.toLowerCase().includes(q) ||
      project.configurations.some(
        (c) => c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q)
      );

    const matchesType =
      selectedType === "All" ||
      (selectedType === "Apartment" && project.projectType === "Residential Apartment") ||
      (selectedType === "Villa" && project.projectType === "Villa") ||
      (selectedType === "Plot" && project.projectType === "Plotted Development") ||
      (selectedType === "Commercial" &&
        (project.projectType === "Commercial" ||
          project.projectType === "Retail" ||
          project.projectType === "Office"));

    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Ready to Move" &&
        (project.status === "Ready to Move" || project.status === "Ready To Move")) ||
      (selectedStatus === "Under Construction" && project.status === "Under Construction") ||
      (selectedStatus === "Pre Launch" && project.status === "Pre Launch");

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "var(--brand-primary)",
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
          <span>✔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: 0,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 className="page-title" style={{ margin: 0 }}>
              Products & Projects Catalog
            </h1>
            <span className="badge badge-info" style={{ fontSize: "11px" }}>
              {projects.length} Total Projects
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: "4px 0 0 0" }}>
            Manage verified real estate developments, unit configurations, and sellable inventory
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddProjectModal(true)}
          className="btn btn-primary btn-sm"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <Icon name="plus" size={15} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div
        className="card"
        style={{
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Search Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--bg-subtle)",
            padding: "8px 12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <Icon name="search" size={16} className="text-secondary" />
          <input
            type="text"
            placeholder="Search projects by name, developer, locality, or unit configuration..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: "none",
              background: "transparent",
              width: "100%",
              outline: "none",
              fontSize: "13.5px",
              color: "var(--text-primary)",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "var(--text-muted)",
              }}
            >
              <Icon name="x" size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {/* Type Filter */}
          <div style={{ display: "flex", gap: "4px", overflowX: "auto", maxWidth: "100%" }}>
            {["All", "Apartment", "Villa", "Plot", "Commercial"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedType(t)}
                style={{
                  padding: "4px 10px",
                  fontSize: "11.5px",
                  fontWeight: selectedType === t ? 700 : 500,
                  borderRadius: "var(--radius-full)",
                  border:
                    selectedType === t
                      ? "1px solid var(--brand-primary)"
                      : "1px solid var(--border-subtle)",
                  backgroundColor:
                    selectedType === t ? "var(--brand-primary-light)" : "var(--bg-surface)",
                  color:
                    selectedType === t ? "var(--brand-primary)" : "var(--text-secondary)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {t === "All" ? "All Types" : t}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div style={{ display: "flex", gap: "4px", overflowX: "auto", maxWidth: "100%" }}>
            {["All", "Ready to Move", "Under Construction", "Pre Launch"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedStatus(s)}
                style={{
                  padding: "4px 10px",
                  fontSize: "11.5px",
                  fontWeight: selectedStatus === s ? 700 : 500,
                  borderRadius: "var(--radius-full)",
                  border:
                    selectedStatus === s
                      ? "1px solid var(--border-strong)"
                      : "1px solid var(--border-subtle)",
                  backgroundColor:
                    selectedStatus === s ? "var(--bg-subtle)" : "var(--bg-surface)",
                  color:
                    selectedStatus === s ? "var(--text-primary)" : "var(--text-secondary)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "40px 20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div style={{ fontSize: "28px" }}>🏢</div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
            No projects found matching your filters
          </div>
          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
            Try adjusting your search keywords or resetting type and status filters.
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedType("All");
              setSelectedStatus("All");
            }}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: "8px" }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
            gap: "16px",
          }}
        >
          {filteredProjects.map((project) => {
            const totalUnits = project.configurations.reduce(
              (acc, c) => acc + (c.quantity || 0),
              0
            );
            const totalAvailable = project.configurations.reduce(
              (acc, c) => acc + (c.availableQuantity || 0),
              0
            );
            const availPercent =
              totalUnits > 0 ? Math.round((totalAvailable / totalUnits) * 100) : 0;

            return (
              <div
                key={project.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: 0,
                  overflow: "hidden",
                  transition: "box-shadow 0.2s ease",
                }}
              >
                {/* Card Top / Header */}
                <div style={{ padding: "16px 16px 12px 16px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "8px",
                      marginBottom: "6px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "var(--brand-primary)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {project.developer}
                      </div>
                      <h2
                        style={{
                          fontSize: "17px",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          margin: "2px 0 0 0",
                        }}
                      >
                        {project.name}
                      </h2>
                    </div>

                    <span
                      className={`badge ${
                        project.status === "Ready to Move" || project.projectStatus === "Ready to Move"
                          ? "badge-success"
                          : project.status === "Under Construction" || project.projectStatus === "Under Construction"
                          ? "badge-warning"
                          : "badge-info"
                      }`}
                      style={{ fontSize: "10.5px", whiteSpace: "nowrap" }}
                    >
                      {project.status || project.projectStatus}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: "12.5px",
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      marginBottom: "12px",
                    }}
                  >
                    <Icon name="map-pin" size={13} />
                    <span>{project.location}</span>
                  </div>

                  {/* Configuration Pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                    {project.configurations.map((cfg) => (
                      <span
                        key={cfg.id}
                        style={{
                          fontSize: "11px",
                          padding: "3px 8px",
                          backgroundColor: "var(--bg-subtle)",
                          borderRadius: "var(--radius-sm)",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border-subtle)",
                        }}
                      >
                        {cfg.name} ({cfg.area} {cfg.areaUnit})
                      </span>
                    ))}
                  </div>

                  {/* Price and Inventory Stats */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      paddingTop: "10px",
                      borderTop: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "10.5px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                        Starting Price
                      </div>
                      <div style={{ fontSize: "17px", fontWeight: 800, color: "var(--brand-primary)" }}>
                        {project.startingPrice || project.priceRange}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "10.5px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                        Inventory Available
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {totalAvailable} of {totalUnits} Units
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      width: "100%",
                      height: "5px",
                      backgroundColor: "var(--bg-subtle)",
                      borderRadius: "var(--radius-full)",
                      marginTop: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${availPercent}%`,
                        height: "100%",
                        backgroundColor:
                          availPercent > 50
                            ? "var(--success)"
                            : availPercent > 20
                            ? "var(--warning)"
                            : "var(--danger)",
                        borderRadius: "var(--radius-full)",
                      }}
                    />
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 16px",
                    backgroundColor: "var(--bg-subtle)",
                    borderTop: "1px solid var(--border-subtle)",
                  }}
                >
                  <Link
                    href={`/products/${project.id}`}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    View Details
                  </Link>

                  <button
                    type="button"
                    onClick={() => setBrochureProject(project)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "6px 10px" }}
                    title="Generate Client Brochure (PDF)"
                    aria-label={`Generate Client Brochure for ${project.name}`}
                  >
                    <Icon name="file-text" size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingProject(project)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "6px 10px" }}
                    title="Edit Project"
                    aria-label={`Edit Project ${project.name}`}
                  >
                    <Icon name="edit" size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <ProjectForm
          mode="add"
          onSave={handleCreateProject}
          onClose={() => setShowAddProjectModal(false)}
        />
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <ProjectForm
          key={editingProject.id}
          mode="edit"
          initialProject={editingProject}
          onSave={handleUpdateProject}
          onClose={() => setEditingProject(null)}
        />
      )}

      {/* Client PDF Brochure Modal */}
      {brochureProject && (
        <ClientBrochureModal
          isOpen={Boolean(brochureProject)}
          onClose={() => setBrochureProject(null)}
          entityType="project"
          projectData={brochureProject}
        />
      )}
    </div>
  );
}
