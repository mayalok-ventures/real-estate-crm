"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProjectItem, getProjectById, updateProjectInStore } from "@/data/mockData";
import { ProjectDetail } from "@/components/products/ProjectDetail";

export default function ProjectDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [projectOverride, setProjectOverride] = useState<ProjectItem | null>(null);

  const currentProject =
    projectOverride && projectOverride.id === id
      ? projectOverride
      : (id ? getProjectById(id) || null : null);

  const handleUpdateProject = (updatedProject: ProjectItem) => {
    updateProjectInStore(updatedProject);
    setProjectOverride(updatedProject);
  };

  if (!currentProject) {
    return (
      <div className="card" style={{ padding: "40px 20px", textAlign: "center", margin: "20px auto", maxWidth: "480px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "var(--danger-light)",
            color: "var(--danger)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "12px",
          }}
        >
          <Icon name="x" size={24} />
        </div>
        <h1 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
          Project Not Found
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px", marginBottom: "18px" }}>
          The requested project profile ({id}) could not be located in your active catalog.
        </p>
        <Link href="/products" className="btn btn-primary btn-sm">
          Return to Projects & Inventory
        </Link>
      </div>
    );
  }

  return <ProjectDetail key={currentProject.id} project={currentProject} onUpdateProject={handleUpdateProject} />;
}
