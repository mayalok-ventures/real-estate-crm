"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProjectItem } from "@/data/mockData";
import { ProjectForm } from "./ProjectForm";

interface ProjectDetailProps {
  project: ProjectItem;
  onUpdateProject: (updatedProject: ProjectItem) => void;
}

export function ProjectDetail({ project, onUpdateProject }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "configurations" | "pricing" | "inventory" | "amenities" | "documents"
  >("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  const handleShare = () => {
    const text = `Explore ${project.name} by ${project.developer} at ${project.location}. Starting from ${project.startingPrice || project.priceRange}.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setShareToast("Project link & summary copied to clipboard!");
      setTimeout(() => setShareToast(null), 3000);
    } else {
      alert(text);
    }
  };

  const totalUnits = project.totalInventory || project.configurations.reduce((acc, c) => acc + (c.quantity || 0), 0) || 1;
  const availableUnits = project.configurations.reduce((acc, c) => acc + (c.availableQuantity || 0), 0);
  const bookedUnits = project.configurations.reduce((acc, c) => acc + (c.bookedQuantity || 0), 0);
  const blockedUnits = project.configurations.reduce((acc, c) => acc + (c.blockedQuantity || 0), 0);
  const soldUnits = project.configurations.reduce((acc, c) => acc + (c.soldQuantity || 0), 0);

  const availablePercent = Math.min(100, Math.round((availableUnits / totalUnits) * 100));
  const bookedPercent = Math.min(100, Math.round((bookedUnits / totalUnits) * 100));
  const soldPercent = Math.min(100, Math.round((soldUnits / totalUnits) * 100));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Toast Notification */}
      {shareToast && (
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
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
          }}
        >
          ✓ {shareToast}
        </div>
      )}

      {/* Top Breadcrumb Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <Link
          href="/products"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "var(--brand-primary)",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <Icon name="arrow-left" size={16} />
          <span>Back to Projects & Inventory</span>
        </Link>
        <span className="badge badge-info" style={{ fontSize: "11px" }}>
          {project.projectType}
        </span>
      </div>

      {/* Project Master Header Card */}
      <div className="card" style={{ padding: "18px 20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
              <h1 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                {project.name}
              </h1>
              <span
                className={`badge ${
                  project.status === "Ready to Move" || project.status === "Ready To Move"
                    ? "badge-success"
                    : project.status === "Under Construction"
                    ? "badge-warning"
                    : "badge-info"
                }`}
                style={{ fontSize: "12px" }}
              >
                {project.status}
              </span>
            </div>

            <div style={{ fontSize: "14px", color: "var(--brand-primary)", fontWeight: 700 }}>
              By {project.developer}
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "4px",
              }}
            >
              <Icon name="map-pin" size={14} />
              <span>{project.location}</span>
              {project.landmark && <span style={{ color: "var(--text-muted)" }}>• {project.landmark}</span>}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="btn btn-primary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Icon name="edit" size={15} />
              <span>Edit Project</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="btn btn-secondary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Icon name="arrow-up-right" size={15} />
              <span>Share Brochure</span>
            </button>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "10px",
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "14px",
            marginTop: "6px",
          }}
        >
          <div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Starting Price</div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--brand-primary)" }}>
              {project.startingPrice || project.basePriceFormatted || project.priceRange}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Available Units</div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--success)" }}>
              {availableUnits} <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>/ {totalUnits}</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Configurations</div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)" }}>
              {project.configurations.length} Types
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Land Area</div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)" }}>
              {project.totalLandArea ? `${project.totalLandArea} ${project.landAreaUnit || "Acres"}` : "Master Plan"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Broker Incentive</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--brand-primary)" }}>
              {project.incentive.label}
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Workspace Navigation Tabs */}
      <div
        style={{
          display: "flex",
          backgroundColor: "var(--bg-subtle)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          padding: "3px",
          overflowX: "auto",
          gap: "3px",
        }}
      >
        {[
          { id: "overview", label: "Overview & Specs" },
          { id: "configurations", label: `Configurations (${project.configurations.length})` },
          { id: "pricing", label: "Pricing & Plans" },
          { id: "inventory", label: "Inventory Health" },
          { id: "amenities", label: `Amenities (${project.amenities.length})` },
          { id: "documents", label: "Brochures & Docs" },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: active ? 600 : 500,
                borderRadius: "var(--radius-sm)",
                backgroundColor: active ? "var(--bg-surface)" : "transparent",
                color: active ? "var(--brand-primary)" : "var(--text-secondary)",
                boxShadow: active ? "var(--shadow-sm)" : "none",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Overview & Specs */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="grid-2">
            {/* Description & Developer Profile */}
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
                Project Overview & Developer
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>
                {project.description || project.shortDescription || "No detailed description provided."}
              </p>
              {project.developerDescription && (
                <div style={{ fontSize: "12px", color: "var(--text-muted)", backgroundColor: "var(--bg-subtle)", padding: "10px", borderRadius: "var(--radius-sm)", marginBottom: "10px" }}>
                  <strong>About {project.developer}:</strong> {project.developerDescription}
                </div>
              )}
              {project.reraNumber && (
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="badge badge-info" style={{ fontSize: "10.5px" }}>RERA Approved</span>
                  <span>{project.reraNumber}</span>
                </div>
              )}
            </div>

            {/* Scale, Elevation & Structural Specs */}
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
                Project Elevation & Structure Details
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Project Type:</span>
                  <strong style={{ color: "var(--text-primary)" }}>{project.projectType}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Development Status:</span>
                  <strong style={{ color: "var(--text-primary)" }}>{project.status}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Total Land Parcel:</span>
                  <strong style={{ color: "var(--text-primary)" }}>
                    {project.totalLandArea ? `${project.totalLandArea} ${project.landAreaUnit || "Acres"}` : "N/A"}
                  </strong>
                </div>
                {project.totalTowers && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Towers / Blocks:</span>
                    <strong style={{ color: "var(--text-primary)" }}>{project.totalTowers} Towers</strong>
                  </div>
                )}
                {project.totalFloors && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Building Elevation:</span>
                    <strong style={{ color: "var(--text-primary)" }}>{project.totalFloors} Floors</strong>
                  </div>
                )}
                {project.totalPlots && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Total Plots:</span>
                    <strong style={{ color: "var(--text-primary)" }}>{project.totalPlots} Plots</strong>
                  </div>
                )}
                {project.totalVillas && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Total Villas:</span>
                    <strong style={{ color: "var(--text-primary)" }}>{project.totalVillas} Villas</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Highlights & USPs */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
                Key Selling Highlights & USPs
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "8px" }}>
                {project.highlights.map((hl, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "var(--bg-subtle)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: "var(--brand-primary)" }}>✓</span>
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Specifications */}
          {project.specifications && project.specifications.length > 0 && (
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
                Technical Building Specifications
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px" }}>
                {project.specifications.map((spec) => (
                  <div key={spec.id} style={{ border: "1px solid var(--border-subtle)", padding: "10px", borderRadius: "var(--radius-sm)" }}>
                    <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--brand-primary)", textTransform: "uppercase" }}>
                      {spec.name}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-primary)", marginTop: "2px" }}>
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Connectivity */}
          {project.connectivity && project.connectivity.length > 0 && (
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
                Transit Connectivity & Nearby Landmarks
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
                {project.connectivity.map((con) => (
                  <div key={con.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>📍 {con.name}</span>
                    <strong style={{ color: "var(--brand-primary)" }}>{con.distance}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Configurations (Parent -> Child Architecture) */}
      {activeTab === "configurations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                Product Configurations in {project.name}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Sellable unit types with individual carpet area, pricing, and live inventory status
              </div>
            </div>
            <button type="button" onClick={() => setShowEditModal(true)} className="btn btn-secondary btn-sm">
              <Icon name="plus" size={13} />
              <span>Manage Configurations</span>
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {project.configurations.map((cfg) => (
              <div key={cfg.id} className="card" style={{ padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                          {cfg.name}
                        </h3>
                        <span
                          className={`badge ${
                            cfg.status === "Available"
                              ? "badge-success"
                              : cfg.status === "Limited Availability"
                              ? "badge-warning"
                              : "badge-danger"
                          }`}
                          style={{ fontSize: "11px" }}
                        >
                          {cfg.status || "Available"}
                        </span>
                      </div>
                      <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                        Unit Type: <strong>{cfg.type}</strong> • Carpet Area: <strong>{cfg.area} {cfg.areaUnit}</strong>
                        {cfg.pricePerUnit && <span> • ₹{cfg.pricePerUnit.toLocaleString("en-IN")} / {cfg.areaUnit}</span>}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "17px", fontWeight: 800, color: "var(--brand-primary)" }}>
                        ₹{cfg.sellingPrice ? (cfg.sellingPrice >= 10000000 ? `${(cfg.sellingPrice / 10000000).toFixed(2)} Cr` : `${Math.round(cfg.sellingPrice / 100000)} L`) : "Price on Request"}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                        Base: ₹{cfg.basePrice?.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  {cfg.description && (
                    <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginBottom: "12px", lineHeight: 1.5 }}>
                      {cfg.description}
                    </p>
                  )}

                  {/* Inventory Status Pill Box */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
                      gap: "8px",
                      backgroundColor: "var(--bg-subtle)",
                      padding: "10px",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Total Units</div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {cfg.quantity}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "10.5px", color: "var(--success)" }}>Available</div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--success)" }}>
                        {cfg.availableQuantity}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "10.5px", color: "var(--brand-primary)" }}>Booked</div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--brand-primary)" }}>
                        {cfg.bookedQuantity}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "10.5px", color: "var(--warning)" }}>Blocked</div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--warning)" }}>
                        {cfg.blockedQuantity}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "10.5px", color: "var(--danger)" }}>Sold Out</div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--danger)" }}>
                        {cfg.soldQuantity}
                      </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Pricing & Payment Plans */}
      {activeTab === "pricing" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Price Overview Card */}
          <div className="card" style={{ padding: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>
              Project Pricing Matrix
            </div>
            <div className="grid-2">
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Starting Price:</span>
                  <strong style={{ color: "var(--brand-primary)" }}>{project.startingPrice || project.basePriceFormatted}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Price Range:</span>
                  <strong style={{ color: "var(--text-primary)" }}>{project.priceRange}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Catalog Base Price:</span>
                  <strong style={{ color: "var(--text-primary)" }}>₹{project.basePrice.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                {project.pricePerSqFt && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Rate Per Sq. Ft:</span>
                    <strong style={{ color: "var(--text-primary)" }}>₹{project.pricePerSqFt.toLocaleString("en-IN")}</strong>
                  </div>
                )}
                {project.pricePerSqYard && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Rate Per Sq. Yard:</span>
                    <strong style={{ color: "var(--text-primary)" }}>₹{project.pricePerSqYard.toLocaleString("en-IN")}</strong>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Brokerage Commission Rule:</span>
                  <strong style={{ color: "var(--brand-primary)" }}>{project.incentive.label}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Charges */}
          {project.additionalCharges && project.additionalCharges.length > 0 && (
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
                Additional & Ancillary Charges
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {project.additionalCharges.map((chg) => (
                  <div
                    key={chg.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      backgroundColor: "var(--bg-subtle)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "13px",
                    }}
                  >
                    <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{chg.name}</span>
                    <strong style={{ color: "var(--text-primary)" }}>₹{chg.amount.toLocaleString("en-IN")}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Plans */}
          {project.paymentPlans && project.paymentPlans.length > 0 && (
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
                Sanctioned Payment Plan Schemes
              </div>
              {project.paymentPlans.map((plan) => (
                <div key={plan.id} style={{ border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "12px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <strong style={{ fontSize: "14px", color: "var(--text-primary)" }}>{plan.name}</strong>
                    <span className="badge badge-info" style={{ fontSize: "11px" }}>{plan.type}</span>
                  </div>
                  {plan.description && (
                    <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginBottom: "10px" }}>
                      {plan.description}
                    </div>
                  )}
                  {plan.milestones && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {plan.milestones.map((ms) => (
                        <div key={ms.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", borderBottom: "1px dashed var(--border-subtle)", paddingBottom: "4px" }}>
                          <span style={{ color: "var(--text-secondary)" }}>{ms.name}</span>
                          <strong style={{ color: "var(--brand-primary)" }}>{ms.percentage}%</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Inventory Health */}
      {activeTab === "inventory" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Visual Health Card */}
          <div className="card" style={{ padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                Total Project Inventory Health
              </div>
              <span className="badge badge-success" style={{ fontSize: "12px" }}>
                {availableUnits} Units Available
              </span>
            </div>

            {/* Segmented Progress Bar */}
            <div
              style={{
                height: "12px",
                borderRadius: "6px",
                backgroundColor: "#e5e7eb",
                display: "flex",
                overflow: "hidden",
                marginBottom: "16px",
              }}
            >
              <div style={{ width: `${availablePercent}%`, backgroundColor: "var(--success)" }} title={`Available: ${availableUnits} (${availablePercent}%)`} />
              <div style={{ width: `${bookedPercent}%`, backgroundColor: "var(--brand-primary)" }} title={`Booked: ${bookedUnits} (${bookedPercent}%)`} />
              <div style={{ width: `${soldPercent}%`, backgroundColor: "var(--danger)" }} title={`Sold: ${soldUnits} (${soldPercent}%)`} />
            </div>

            {/* Legend & Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "10px" }}>
              <div style={{ padding: "10px", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Total Sanctioned</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>{totalUnits}</div>
              </div>
              <div style={{ padding: "10px", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontSize: "11px", color: "var(--success)" }}>Available for Sale</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--success)" }}>{availableUnits}</div>
              </div>
              <div style={{ padding: "10px", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontSize: "11px", color: "var(--brand-primary)" }}>Under Booking</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--brand-primary)" }}>{bookedUnits}</div>
              </div>
              <div style={{ padding: "10px", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontSize: "11px", color: "var(--warning)" }}>Token Blocked</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--warning)" }}>{blockedUnits}</div>
              </div>
              <div style={{ padding: "10px", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontSize: "11px", color: "var(--danger)" }}>Registered & Sold</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--danger)" }}>{soldUnits}</div>
              </div>
            </div>
          </div>

          {/* Configuration Inventory Breakdown Table */}
          <div className="card" style={{ padding: "16px", overflowX: "auto" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>
              Unit Configuration Availability Breakdown
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                  <th style={{ padding: "8px" }}>Configuration</th>
                  <th style={{ padding: "8px" }}>Area</th>
                  <th style={{ padding: "8px" }}>Total</th>
                  <th style={{ padding: "8px", color: "var(--success)" }}>Available</th>
                  <th style={{ padding: "8px" }}>Booked</th>
                  <th style={{ padding: "8px" }}>Sold</th>
                  <th style={{ padding: "8px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {project.configurations.map((cfg) => (
                  <tr key={cfg.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "10px 8px", fontWeight: 700, color: "var(--text-primary)" }}>{cfg.name}</td>
                    <td style={{ padding: "10px 8px", color: "var(--text-secondary)" }}>{cfg.area} {cfg.areaUnit}</td>
                    <td style={{ padding: "10px 8px", fontWeight: 600 }}>{cfg.quantity}</td>
                    <td style={{ padding: "10px 8px", fontWeight: 700, color: "var(--success)" }}>{cfg.availableQuantity}</td>
                    <td style={{ padding: "10px 8px" }}>{cfg.bookedQuantity}</td>
                    <td style={{ padding: "10px 8px" }}>{cfg.soldQuantity}</td>
                    <td style={{ padding: "10px 8px" }}>
                      <span
                        className={`badge ${
                          cfg.status === "Available"
                            ? "badge-success"
                            : cfg.status === "Limited Availability"
                            ? "badge-warning"
                            : "badge-danger"
                        }`}
                        style={{ fontSize: "10.5px" }}
                      >
                        {cfg.status || "Available"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Amenities */}
      {activeTab === "amenities" && (
        <div className="card" style={{ padding: "18px" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>
            Included Project Amenities ({project.amenities.length})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
            {project.amenities.map((amenity, idx) => (
              <div
                key={idx}
                style={{
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-surface)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: "var(--brand-primary-light)",
                    color: "var(--brand-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                  }}
                >
                  ✓
                </div>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Brochures & Documents (Frontend simulation) */}
      {activeTab === "documents" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-subtle)",
              fontSize: "12.5px",
              color: "var(--text-secondary)",
            }}
          >
            ℹ️ <strong>Collateral Repository:</strong> Digital brochures, floor plan catalogues, and verified price sheets ready for instant client sharing.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
            {[
              { title: "Official Project Brochure", format: "PDF (18.4 MB)", tag: "High-Res" },
              { title: "Unit Configurations & Floor Plans", format: "PDF (12.1 MB)", tag: "Floorplans" },
              { title: "Latest Rate Card & Payment Scheme", format: "PDF (3.5 MB)", tag: "Price List" },
              { title: "RERA Registration Certificate", format: "PDF (1.8 MB)", tag: "Compliance" },
            ].map((doc, dIdx) => (
              <div key={dIdx} className="card" style={{ padding: "14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <span className="badge badge-info" style={{ fontSize: "10.5px" }}>{doc.tag}</span>
                    <Icon name="file-text" size={18} />
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                    {doc.title}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{doc.format}</div>
                </div>

                <div style={{ display: "flex", gap: "6px", marginTop: "14px" }}>
                  <button type="button" onClick={handleShare} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    Share Link
                  </button>
                  <button type="button" onClick={() => alert(`Simulating download of ${doc.title}`)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <ProjectForm
          mode="edit"
          initialProject={project}
          onSave={(updated) => {
            onUpdateProject(updated);
            setShowEditModal(false);
          }}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}
