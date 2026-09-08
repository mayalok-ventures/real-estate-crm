"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Lead, getLeadById, updateLeadInStore } from "@/data/mockData";
import { LeadProfile } from "@/components/leads/LeadProfile";

export default function LeadDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [leadOverride, setLeadOverride] = useState<Lead | null>(null);

  const currentLead = leadOverride && leadOverride.id === id ? leadOverride : getLeadById(id) || null;

  const handleUpdateLead = (updatedLead: Lead) => {
    updateLeadInStore(updatedLead);
    setLeadOverride(updatedLead);
  };

  if (!currentLead) {
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
          Lead Not Found
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px", marginBottom: "18px" }}>
          The requested lead profile ({id}) could not be located in your active directory.
        </p>
        <Link href="/leads" className="btn btn-primary btn-sm">
          Return to Leads Directory
        </Link>
      </div>
    );
  }

  return <LeadProfile initialLead={currentLead} onUpdateLead={handleUpdateLead} />;
}
