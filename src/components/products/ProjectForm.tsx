"use client";

import React, { useState } from "react";
import { Icon } from "@/components/Icon";
import {
  ProjectItem,
  ProductConfiguration,
  ProjectType,
  ProjectStatus,
  ProjectAdditionalCharge,
  ProjectPaymentPlan,
  ProjectSpecification,
  ProjectConnectivity,
  ProjectIncentive,
} from "@/data/mockData";

interface ProjectFormProps {
  mode?: "add" | "edit";
  initialProject?: ProjectItem;
  project?: ProjectItem;
  onSave: (project: ProjectItem) => void;
  onClose: () => void;
}

const DEFAULT_AMENITIES_OPTIONS = [
  "Swimming Pool",
  "Gym",
  "Clubhouse",
  "Park",
  "Garden",
  "Security",
  "CCTV",
  "Parking",
  "Power Backup",
  "Lift",
  "Children's Play Area",
  "Jogging Track",
  "Sports Area",
  "Community Hall",
  "Visitor Parking",
  "Rainwater Harvesting",
  "Underground Drainage",
  "Badminton Court",
  "Tennis Court",
  "Yoga Pavilion",
];

const PROJECT_TYPES: ProjectType[] = [
  "Residential Apartment",
  "Villa",
  "Plotted Development",
  "Independent Floor",
  "Commercial",
  "Retail",
  "Office",
  "Warehouse",
  "Mixed Use",
  "Other",
];

const PROJECT_STATUSES: ProjectStatus[] = [
  "Pre Launch",
  "Under Construction",
  "Ready to Move",
  "Completed",
  "Sold Out",
  "Coming Soon",
];

let formIdCounter = 0;
function getUniqueId(prefix: string): string {
  formIdCounter += 1;
  return `${prefix}-${Date.now()}-${formIdCounter}`;
}

export function ProjectForm({
  mode = "add",
  initialProject,
  project,
  onSave,
  onClose,
}: ProjectFormProps) {
  const currentProject = initialProject || project;
  const isEdit = mode === "edit" && !!currentProject;

  // Active form section tab for accordion navigation
  const [activeSection, setActiveSection] = useState<
    "basic" | "location" | "scale" | "configurations" | "pricing" | "amenities" | "plans_specs" | "commission"
  >("basic");

  // 1. Basic Information
  const [name, setName] = useState(currentProject?.name || "");
  const [developer, setDeveloper] = useState(currentProject?.developer || "");
  const [developerDescription, setDeveloperDescription] = useState(currentProject?.developerDescription || "");
  const [developerWebsite, setDeveloperWebsite] = useState(currentProject?.developerWebsite || "");
  const [reraNumber, setReraNumber] = useState(currentProject?.reraNumber || "");
  const [projectType, setProjectType] = useState<ProjectType>(currentProject?.projectType || "Residential Apartment");
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>(currentProject?.projectStatus || "Under Construction");
  const [shortDescription, setShortDescription] = useState(currentProject?.shortDescription || "");
  const [description, setDescription] = useState(currentProject?.description || "");
  const [coverImage, setCoverImage] = useState(currentProject?.coverImage || "");

  // 2. Location
  const [location, setLocation] = useState(currentProject?.location || "");
  const [fullAddress, setFullAddress] = useState(currentProject?.fullAddress || "");
  const [city, setCity] = useState(currentProject?.city || "Bangalore");
  const [state, setState] = useState(currentProject?.state || "Karnataka");
  const [country, setCountry] = useState(currentProject?.country || "India");
  const [pincode, setPincode] = useState(currentProject?.pincode || "");
  const [landmark, setLandmark] = useState(currentProject?.landmark || "");
  const [googleMapsUrl, setGoogleMapsUrl] = useState(currentProject?.googleMapsUrl || "");

  // 3. Project Scale / Structure
  const [totalLandArea, setTotalLandArea] = useState<string>(
    currentProject?.totalLandArea !== undefined ? String(currentProject.totalLandArea) : ""
  );
  const [landAreaUnit, setLandAreaUnit] = useState<"Acres" | "Square Feet" | "Square Yards" | "Hectares">(
    currentProject?.landAreaUnit || "Acres"
  );
  const [totalTowers, setTotalTowers] = useState<string>(
    currentProject?.totalTowers !== undefined ? String(currentProject.totalTowers) : ""
  );
  const [totalBlocks, setTotalBlocks] = useState<string>(
    currentProject?.totalBlocks !== undefined ? String(currentProject.totalBlocks) : ""
  );
  const [totalFloors, setTotalFloors] = useState<string>(
    currentProject?.totalFloors !== undefined ? String(currentProject.totalFloors) : ""
  );
  const [totalApartments, setTotalApartments] = useState<string>(
    currentProject?.totalApartments !== undefined ? String(currentProject.totalApartments) : ""
  );
  const [totalPlots, setTotalPlots] = useState<string>(
    currentProject?.totalPlots !== undefined ? String(currentProject.totalPlots) : ""
  );
  const [totalVillas, setTotalVillas] = useState<string>(
    currentProject?.totalVillas !== undefined ? String(currentProject.totalVillas) : ""
  );
  const [totalCommercialUnits, setTotalCommercialUnits] = useState<string>(
    currentProject?.totalCommercialUnits !== undefined ? String(currentProject.totalCommercialUnits) : ""
  );
  const [totalPhases, setTotalPhases] = useState<string>(
    currentProject?.totalPhases !== undefined ? String(currentProject.totalPhases) : "1"
  );

  // 4. Configurations (Products)
  const [configurations, setConfigurations] = useState<ProductConfiguration[]>(() => {
    if (currentProject?.configurations && currentProject.configurations.length > 0) {
      return currentProject.configurations.map((c) => ({ ...c }));
    }
    const isPlot = (currentProject?.projectType || projectType) === "Plotted Development";
    return [
      {
        id: "cfg-init-1",
        name: isPlot ? "150 Sq. Yard Plot" : "3 BHK Luxury",
        type: isPlot ? "Plot" : "3 BHK",
        area: isPlot ? 150 : 1450,
        areaUnit: isPlot ? "Sq. Yard" : "Sq. Ft.",
        quantity: 50,
        availableQuantity: 30,
        bookedQuantity: 15,
        blockedQuantity: 3,
        soldQuantity: 2,
        basePrice: isPlot ? 6300000 : 9500000,
        sellingPrice: isPlot ? 6300000 : 9500000,
        pricePerUnit: isPlot ? 42000 : 6551,
        status: "Available",
      },
    ];
  });

  // 5. Pricing
  const [startingPrice, setStartingPrice] = useState(currentProject?.startingPrice || "");
  const [priceRange, setPriceRange] = useState(currentProject?.priceRange || "");
  const [basePrice, setBasePrice] = useState<string>(
    currentProject?.basePrice !== undefined ? String(currentProject.basePrice) : "7500000"
  );
  const [basePriceFormatted, setBasePriceFormatted] = useState(currentProject?.basePriceFormatted || "₹75 L");
  const [marketPrice, setMarketPrice] = useState<string>(
    currentProject?.marketPrice !== undefined ? String(currentProject.marketPrice) : ""
  );
  const [pricePerSqFt, setPricePerSqFt] = useState<string>(
    currentProject?.pricePerSqFt !== undefined ? String(currentProject.pricePerSqFt) : ""
  );
  const [pricePerSqYard, setPricePerSqYard] = useState<string>(
    currentProject?.pricePerSqYard !== undefined ? String(currentProject.pricePerSqYard) : ""
  );
  const [additionalCharges, setAdditionalCharges] = useState<ProjectAdditionalCharge[]>(() =>
    currentProject?.additionalCharges ? currentProject.additionalCharges.map((c) => ({ ...c })) : []
  );

  // 6. Amenities & Highlights
  const [amenities, setAmenities] = useState<string[]>(() =>
    currentProject?.amenities ? [...currentProject.amenities] : ["Security", "Power Backup", "Park"]
  );
  const [customAmenity, setCustomAmenity] = useState("");
  const [highlights, setHighlights] = useState<string[]>(() =>
    currentProject?.highlights ? [...currentProject.highlights] : ["Prime Location", "Gated Community"]
  );
  const [newHighlight, setNewHighlight] = useState("");

  // 7. Specifications & Connectivity & Brochure
  const [specifications, setSpecifications] = useState<ProjectSpecification[]>(() =>
    currentProject?.specifications && currentProject.specifications.length > 0
      ? currentProject.specifications.map((s) => ({ ...s }))
      : [
          { id: "spec-1", name: "Structure", value: "RCC Framed Structure" },
          { id: "spec-2", name: "Flooring", value: "Vitrified Tiles" },
        ]
  );
  const [connectivity, setConnectivity] = useState<ProjectConnectivity[]>(() =>
    currentProject?.connectivity && currentProject.connectivity.length > 0
      ? currentProject.connectivity.map((c) => ({ ...c }))
      : [
          { id: "con-1", name: "Nearest Metro Station", distance: "2.0 KM" },
          { id: "con-2", name: "Airport", distance: "35 KM" },
        ]
  );
  const [brochureUrl, setBrochureUrl] = useState(currentProject?.brochureUrl || "");

  // 8. Payment Plans
  const [paymentPlans, setPaymentPlans] = useState<ProjectPaymentPlan[]>(() =>
    currentProject?.paymentPlans && currentProject.paymentPlans.length > 0
      ? currentProject.paymentPlans.map((p) => ({
          ...p,
          milestones: p.milestones ? p.milestones.map((m) => ({ ...m })) : [],
        }))
      : [
          {
            id: "pp-1",
            name: "Standard Milestone Scheme",
            type: "Construction Linked",
            description: "Milestone based schedule tied to construction progress.",
            milestones: [
              { id: "m-1", name: "Booking Amount", percentage: 10 },
              { id: "m-2", name: "Within 30 Days", percentage: 20 },
              { id: "m-3", name: "Structural Completion", percentage: 50 },
              { id: "m-4", name: "On Possession", percentage: 20 },
            ],
          },
        ]
  );

  // 9. Commission & Incentive
  const [incentiveType, setIncentiveType] = useState<"percentage" | "fixed">(
    currentProject?.incentive?.type || "percentage"
  );
  const [incentiveValue, setIncentiveValue] = useState<string>(
    currentProject?.incentive?.value !== undefined ? String(currentProject.incentive.value) : "2.0"
  );
  const [incentiveLabel, setIncentiveLabel] = useState(
    currentProject?.incentive?.label || "2.0% Standard Brokerage Incentive"
  );

  // Validation state
  const [validationError, setValidationError] = useState<string | null>(null);

  // Handlers for Configurations
  const handleAddConfiguration = () => {
    const isPlot = projectType === "Plotted Development";
    const newConfig: ProductConfiguration = {
      id: getUniqueId("cfg"),
      name: isPlot ? "New Plot Variant" : "New Unit Configuration",
      type: isPlot ? "Plot" : "Apartment",
      area: isPlot ? 150 : 1200,
      areaUnit: isPlot ? "Sq. Yard" : "Sq. Ft.",
      quantity: 10,
      availableQuantity: 10,
      bookedQuantity: 0,
      blockedQuantity: 0,
      soldQuantity: 0,
      basePrice: isPlot ? 6000000 : 8000000,
      sellingPrice: isPlot ? 6000000 : 8000000,
      pricePerUnit: isPlot ? 40000 : 6666,
      status: "Available",
    };
    setConfigurations([...configurations, newConfig]);
  };

  const handleUpdateConfigField = (
    index: number,
    field: keyof ProductConfiguration,
    value: string | number
  ) => {
    const updated = [...configurations];
    const current = { ...updated[index], [field]: value };

    // Auto calculate price if area & pricePerUnit changed
    if (field === "area" || field === "pricePerUnit") {
      const a = field === "area" ? Number(value) : current.area;
      const ppu = field === "pricePerUnit" ? Number(value) : current.pricePerUnit;
      if (a > 0 && ppu && ppu > 0) {
        current.basePrice = Math.round(a * ppu);
        current.sellingPrice = Math.round(a * ppu);
      }
    }

    // Auto derive status based on availability
    const totalQty = current.quantity || 0;
    const availQty = current.availableQuantity || 0;
    if (availQty <= 0) {
      current.status = "Sold Out";
    } else if (availQty < totalQty * 0.15) {
      current.status = "Limited Availability";
    } else {
      current.status = "Available";
    }

    updated[index] = current;
    setConfigurations(updated);
  };

  const handleRemoveConfiguration = (index: number) => {
    if (configurations.length <= 1) {
      alert("A project must contain at least one product configuration.");
      return;
    }
    setConfigurations(configurations.filter((_, i) => i !== index));
  };

  // Amenities handlers
  const toggleAmenity = (item: string) => {
    if (amenities.includes(item)) {
      setAmenities(amenities.filter((a) => a !== item));
    } else {
      setAmenities([...amenities, item]);
    }
  };

  const handleAddCustomAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAmenity.trim()) return;
    if (!amenities.includes(customAmenity.trim())) {
      setAmenities([...amenities, customAmenity.trim()]);
    }
    setCustomAmenity("");
  };

  // Highlights handlers
  const handleAddHighlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHighlight.trim()) return;
    setHighlights([...highlights, newHighlight.trim()]);
    setNewHighlight("");
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  // Specifications handlers
  const handleAddSpec = () => {
    setSpecifications([...specifications, { id: getUniqueId("sp"), name: "", value: "" }]);
  };
  const handleUpdateSpec = (index: number, key: "name" | "value", val: string) => {
    const updated = [...specifications];
    updated[index] = { ...updated[index], [key]: val };
    setSpecifications(updated);
  };
  const handleRemoveSpec = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  // Connectivity handlers
  const handleAddConnectivity = () => {
    setConnectivity([...connectivity, { id: getUniqueId("cn"), name: "", distance: "" }]);
  };
  const handleUpdateConnectivity = (index: number, key: "name" | "distance", val: string) => {
    const updated = [...connectivity];
    updated[index] = { ...updated[index], [key]: val };
    setConnectivity(updated);
  };
  const handleRemoveConnectivity = (index: number) => {
    setConnectivity(connectivity.filter((_, i) => i !== index));
  };

  // Additional Charges handlers
  const handleAddCharge = () => {
    setAdditionalCharges([...additionalCharges, { id: getUniqueId("chg"), name: "", amount: 0, type: "fixed" }]);
  };
  const handleUpdateCharge = (index: number, key: "name" | "amount", val: string | number) => {
    const updated = [...additionalCharges];
    updated[index] = { ...updated[index], [key]: val };
    setAdditionalCharges(updated);
  };
  const handleRemoveCharge = (index: number) => {
    setAdditionalCharges(additionalCharges.filter((_, i) => i !== index));
  };

  // Payment Plan Milestones handlers
  const handleAddMilestone = (planIndex: number) => {
    const updated = [...paymentPlans];
    const plan = { ...updated[planIndex] };
    const milestones = plan.milestones ? [...plan.milestones] : [];
    milestones.push({ id: getUniqueId("m"), name: "New Milestone", percentage: 10 });
    plan.milestones = milestones;
    updated[planIndex] = plan;
    setPaymentPlans(updated);
  };

  const handleUpdateMilestone = (
    planIndex: number,
    msIndex: number,
    key: "name" | "percentage",
    val: string | number
  ) => {
    const updated = [...paymentPlans];
    const plan = { ...updated[planIndex] };
    if (!plan.milestones) return;
    const milestones = [...plan.milestones];
    milestones[msIndex] = { ...milestones[msIndex], [key]: val };
    plan.milestones = milestones;
    updated[planIndex] = plan;
    setPaymentPlans(updated);
  };

  const handleRemoveMilestone = (planIndex: number, msIndex: number) => {
    const updated = [...paymentPlans];
    const plan = { ...updated[planIndex] };
    if (!plan.milestones) return;
    plan.milestones = plan.milestones.filter((_, i) => i !== msIndex);
    updated[planIndex] = plan;
    setPaymentPlans(updated);
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // 1. Mandatory Validations
    if (!name.trim()) {
      setValidationError("Project Name is mandatory.");
      setActiveSection("basic");
      return;
    }
    if (!developer.trim()) {
      setValidationError("Developer / Builder Name is mandatory.");
      setActiveSection("basic");
      return;
    }
    if (!location.trim()) {
      setValidationError("Project Location / Area is mandatory.");
      setActiveSection("location");
      return;
    }

    // 2. Configurations Validation
    if (configurations.length === 0) {
      setValidationError("Please define at least one product configuration.");
      setActiveSection("configurations");
      return;
    }

    for (let i = 0; i < configurations.length; i++) {
      const cfg = configurations[i];
      if (!cfg.name.trim()) {
        setValidationError(`Configuration #${i + 1} is missing a Name.`);
        setActiveSection("configurations");
        return;
      }
      if (cfg.quantity < 0) {
        setValidationError(`Configuration "${cfg.name}" has negative Total Quantity.`);
        setActiveSection("configurations");
        return;
      }
      const sum = (cfg.availableQuantity || 0) + (cfg.bookedQuantity || 0) + (cfg.blockedQuantity || 0) + (cfg.soldQuantity || 0);
      if (sum > cfg.quantity) {
        setValidationError(
          `Inventory mismatch in "${cfg.name}": Available (${cfg.availableQuantity}) + Booked (${cfg.bookedQuantity}) + Blocked (${cfg.blockedQuantity}) + Sold (${cfg.soldQuantity}) = ${sum}, which exceeds Total Quantity (${cfg.quantity}).`
        );
        setActiveSection("configurations");
        return;
      }
    }

    // 3. Compute derived totals
    const computedAvailableUnits = configurations.reduce((sum, c) => sum + (c.availableQuantity || 0), 0);
    const computedTotalInventory = configurations.reduce((sum, c) => sum + (c.quantity || 0), 0);

    // 4. Derive clean price range if empty
    let finalPriceRange = priceRange.trim();
    if (!finalPriceRange && configurations.length > 0) {
      const prices = configurations.map((c) => c.sellingPrice || c.basePrice).filter((p) => p > 0);
      if (prices.length > 0) {
        const minP = Math.min(...prices);
        const maxP = Math.max(...prices);
        const formatCr = (num: number) => {
          if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
          return `₹${Math.round(num / 100000)} L`;
        };
        finalPriceRange = minP === maxP ? formatCr(minP) : `${formatCr(minP)} – ${formatCr(maxP)}`;
      } else {
        finalPriceRange = "Price on Request";
      }
    }

    const numericBasePrice = Number(basePrice) || (configurations[0]?.basePrice ?? 5000000);
    const finalStartingPrice = startingPrice.trim() || (numericBasePrice >= 10000000 ? `₹${(numericBasePrice / 10000000).toFixed(1)} Cr` : `₹${Math.round(numericBasePrice / 100000)} L`);

    const incentiveObj: ProjectIncentive = {
      type: incentiveType,
      value: Number(incentiveValue) || (incentiveType === "percentage" ? 2.0 : 200000),
      label: incentiveLabel.trim() || (incentiveType === "percentage" ? `${incentiveValue}% Broker Incentive` : `₹${incentiveValue} Flat Incentive`),
    };

    const projectPayload: ProjectItem = {
      // 1. Preserve existing properties so unchanged fields, custom fields, discounts, media never disappear
      ...(currentProject || {}),

      // 2. Exact ID preserved in Edit mode
      id: isEdit ? currentProject.id : getUniqueId("proj"),

      // 3. Core fields
      name: name.trim(),
      developer: developer.trim(),
      developerDescription: developerDescription.trim() || undefined,
      developerWebsite: developerWebsite.trim() || undefined,
      reraNumber: reraNumber.trim() || undefined,
      projectType,
      projectStatus,
      shortDescription: shortDescription.trim() || undefined,
      description: description.trim() || undefined,

      // Media
      coverImage: coverImage.trim() || currentProject?.coverImage || undefined,
      images: currentProject?.images || undefined,
      brochureUrl: brochureUrl.trim() || currentProject?.brochureUrl || undefined,
      priceListUrl: currentProject?.priceListUrl || undefined,
      discounts: currentProject?.discounts || undefined,

      // Location
      location: location.trim(),
      fullAddress: fullAddress.trim() || undefined,
      city: city.trim() || "Bangalore",
      state: state.trim() || "Karnataka",
      country: country.trim() || "India",
      pincode: pincode.trim() || undefined,
      landmark: landmark.trim() || undefined,
      googleMapsUrl: googleMapsUrl.trim() || undefined,

      // Scale
      totalLandArea: Number(totalLandArea) || undefined,
      landAreaUnit,
      totalInventory: computedTotalInventory,
      totalPhases: Number(totalPhases) || 1,
      totalTowers: Number(totalTowers) || undefined,
      totalBlocks: Number(totalBlocks) || undefined,
      totalFloors: Number(totalFloors) || undefined,
      totalApartments: Number(totalApartments) || undefined,
      totalPlots: Number(totalPlots) || undefined,
      totalVillas: Number(totalVillas) || undefined,
      totalCommercialUnits: Number(totalCommercialUnits) || undefined,

      // Configurations
      configurations,

      // Pricing
      startingPrice: finalStartingPrice,
      priceRange: finalPriceRange,
      basePrice: numericBasePrice,
      basePriceFormatted: basePriceFormatted.trim() || finalStartingPrice,
      marketPrice: Number(marketPrice) || undefined,
      pricePerSqFt: Number(pricePerSqFt) || undefined,
      pricePerSqYard: Number(pricePerSqYard) || undefined,
      additionalCharges: additionalCharges.length > 0 ? additionalCharges : undefined,

      // Features
      amenities,
      highlights,
      specifications: specifications.filter((s) => s.name && s.value),
      connectivity: connectivity.filter((c) => c.name && c.distance),
      paymentPlans,

      // Backward compatible fields
      availableUnits: computedAvailableUnits,
      status: projectStatus,
      type: `${configurations.map((c) => c.type).filter((v, i, a) => a.indexOf(v) === i).join(", ")} (${projectType})`,
      incentive: incentiveObj,

      createdAt: isEdit ? currentProject.createdAt : new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    onSave(projectPayload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: "840px", maxHeight: "92vh", display: "flex", flexDirection: "column" }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
              {isEdit ? `Edit Project — ${currentProject.name}` : "Create New Real Estate Project"}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Parent Project, Product Configurations, Pricing & Inventory Catalog
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn-icon" aria-label="Close modal">
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div
            style={{
              padding: "10px 16px",
              backgroundColor: "var(--danger-light)",
              color: "var(--danger)",
              fontSize: "12.5px",
              fontWeight: 600,
              borderBottom: "1px solid var(--danger)",
            }}
          >
            ⚠️ {validationError}
          </div>
        )}

        {/* Section Navigation Tabs (Horizontal Scrolling - Lightweight Segmented Style) */}
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            padding: "6px 14px",
            gap: "4px",
            backgroundColor: "var(--bg-subtle)",
            borderBottom: "1px solid var(--border-subtle)",
            flexShrink: 0,
          }}
        >
          {[
            { id: "basic", label: "1. Basic Info" },
            { id: "location", label: "2. Location" },
            { id: "scale", label: "3. Scale & Type" },
            { id: "configurations", label: `4. Configurations (${configurations.length})` },
            { id: "pricing", label: "5. Pricing" },
            { id: "amenities", label: "6. Amenities & USPs" },
            { id: "plans_specs", label: "7. Payment & Specs" },
            { id: "commission", label: "8. Brokerage Incentive" },
          ].map((tab) => {
            const active = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id as typeof activeSection)}
                style={{
                  padding: "6px 11px",
                  fontSize: "12px",
                  fontWeight: active ? 600 : 500,
                  borderRadius: "var(--radius-sm)",
                  whiteSpace: "nowrap",
                  border: active ? "1px solid var(--brand-primary-border)" : "1px solid transparent",
                  backgroundColor: active ? "var(--bg-surface)" : "transparent",
                  color: active ? "var(--brand-primary)" : "var(--text-secondary)",
                  boxShadow: active ? "var(--shadow-sm)" : "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} style={{ overflowY: "auto", padding: "20px", flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* SECTION 1: Basic Information */}
          {activeSection === "basic" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--brand-primary)" }}>
                Step 1: Project Identity & Builder Profile
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Project Name <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prestige Palm Meadows, Godrej Woods"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Developer / Builder Name <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prestige Group, Sobha Developers"
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Project Type <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as ProjectType)}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-surface)" }}
                  >
                    {PROJECT_TYPES.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Project Development Status <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <select
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value as ProjectStatus)}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-surface)" }}
                  >
                    {PROJECT_STATUSES.map((ps) => (
                      <option key={ps} value={ps}>
                        {ps}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    RERA Registration Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PRM/KA/RERA/1251/310/PR/..."
                    value={reraNumber}
                    onChange={(e) => setReraNumber(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Developer Official Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={developerWebsite}
                    onChange={(e) => setDeveloperWebsite(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Developer Profile & Track Record
                </label>
                <input
                  type="text"
                  placeholder="e.g. Renowned Category-A builder with 35+ delivered townships across South India"
                  value={developerDescription}
                  onChange={(e) => setDeveloperDescription(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Short Summary / Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ultra-luxury gated villa community with private pools on Whitefield Main Road"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Detailed Project Description & Narrative
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide complete real estate project overview, architectural vision, masterplan highlights..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Project Cover Image URL
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="url"
                    placeholder="e.g. https://images.unsplash.com/... or local asset URL"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    style={{ flex: 1, padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                  />
                  {coverImage && (
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "var(--radius-sm)",
                        overflow: "hidden",
                        border: "1px solid var(--border-subtle)",
                        flexShrink: 0,
                        backgroundColor: "var(--bg-subtle)",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverImage} alt="Cover Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setActiveSection("location")} className="btn btn-primary btn-sm">
                  Next: Location Details →
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: Location */}
          {activeSection === "location" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--brand-primary)" }}>
                Step 2: Location, Address & Map Coordinates
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Primary Location / Suburb <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Whitefield, Sarjapur Road, Devanahalli"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Prominent Landmark
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Opposite Forum South, Near Metro Station"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Complete Site Address
                </label>
                <textarea
                  rows={2}
                  placeholder="Full postal address with survey numbers and street details..."
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                />
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    City & Country
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{ flex: 1, padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      style={{ width: "110px", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    State & Postal Code
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      style={{ flex: 1, padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      style={{ width: "110px", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Google Maps URL
                </label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/?q=..."
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="button" onClick={() => setActiveSection("basic")} className="btn btn-secondary btn-sm">
                  ← Back: Basic Info
                </button>
                <button type="button" onClick={() => setActiveSection("scale")} className="btn btn-primary btn-sm">
                  Next: Scale & Structure →
                </button>
              </div>
            </div>
          )}

          {/* SECTION 3: Scale & Dynamic Structure */}
          {activeSection === "scale" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--brand-primary)" }}>
                Step 3: Land Scale & Dynamic Structure ({projectType})
              </div>

              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--brand-primary-light)",
                  fontSize: "12.5px",
                  color: "var(--brand-primary)",
                  fontWeight: 600,
                }}
              >
                ℹ️ Displaying tailored fields for <strong>{projectType}</strong>. Change project type in Basic Info to adjust structure.
              </div>

              {/* Universal Land Area Fields */}
              <div className="grid-2">
                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Total Project Land Parcel
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 25"
                      value={totalLandArea}
                      onChange={(e) => setTotalLandArea(e.target.value)}
                      style={{ flex: 1, padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                    />
                    <select
                      value={landAreaUnit}
                      onChange={(e) => setLandAreaUnit(e.target.value as typeof landAreaUnit)}
                      style={{ width: "130px", padding: "9px 10px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-surface)" }}
                    >
                      <option value="Acres">Acres</option>
                      <option value="Square Yards">Sq. Yards</option>
                      <option value="Square Feet">Sq. Feet</option>
                      <option value="Hectares">Hectares</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Development Phases
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 3"
                    value={totalPhases}
                    onChange={(e) => setTotalPhases(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                  />
                </div>
              </div>

              {/* Dynamic Type Fields: Apartment */}
              {(projectType === "Residential Apartment" || projectType === "Independent Floor" || projectType === "Mixed Use") && (
                <div style={{ padding: "12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-surface)" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
                    Apartment Tower & Elevation Hierarchy
                  </div>
                  <div className="grid-2">
                    <div>
                      <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Number of Residential Towers
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 8"
                        value={totalTowers}
                        onChange={(e) => setTotalTowers(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Building Elevation (Floors)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 24 Floors"
                        value={totalFloors}
                        onChange={(e) => setTotalFloors(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: "8px" }}>
                    <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                      Total Residential Apartments / Flats
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 480 Units"
                      value={totalApartments}
                      onChange={(e) => setTotalApartments(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                    />
                  </div>
                </div>
              )}

              {/* Dynamic Type Fields: Plotted Development */}
              {projectType === "Plotted Development" && (
                <div style={{ padding: "12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-surface)" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
                    Plotted Layout Parameters
                  </div>
                  <div className="grid-2">
                    <div>
                      <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Total Sanctioned Plots
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 150 Plots"
                        value={totalPlots}
                        onChange={(e) => setTotalPlots(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Sector / Block Division
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 4 Sectors"
                        value={totalBlocks}
                        onChange={(e) => setTotalBlocks(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Type Fields: Villa */}
              {projectType === "Villa" && (
                <div style={{ padding: "12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-surface)" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
                    Villa Enclave Scale
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                      Total Luxury Villas Planned
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 50 Independent Villas"
                      value={totalVillas}
                      onChange={(e) => setTotalVillas(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                    />
                  </div>
                </div>
              )}

              {/* Dynamic Type Fields: Commercial / Retail / Office */}
              {(projectType === "Commercial" || projectType === "Retail" || projectType === "Office" || projectType === "Warehouse") && (
                <div style={{ padding: "12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-surface)" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
                    Commercial Building Details
                  </div>
                  <div className="grid-2">
                    <div>
                      <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Total Commercial / Retail Units
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 40 Units"
                        value={totalCommercialUnits}
                        onChange={(e) => setTotalCommercialUnits(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Commercial Office Floors
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 11 Floors"
                        value={totalFloors}
                        onChange={(e) => setTotalFloors(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="button" onClick={() => setActiveSection("location")} className="btn btn-secondary btn-sm">
                  ← Back: Location
                </button>
                <button type="button" onClick={() => setActiveSection("configurations")} className="btn btn-primary btn-sm">
                  Next: Configurations & Inventory →
                </button>
              </div>
            </div>
          )}

          {/* SECTION 4: Configurations & Inventory (Parent-Child) */}
          {activeSection === "configurations" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--brand-primary)" }}>
                    Step 4: Product Configurations & Inventory Units
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Project ≠ Product. Define individual sellable units (BHKs, Plots, Office Suites)
                  </div>
                </div>
                <button type="button" onClick={handleAddConfiguration} className="btn btn-primary btn-sm">
                  <Icon name="plus" size={13} />
                  <span>Add Configuration</span>
                </button>
              </div>

              {configurations.map((cfg, idx) => {
                const totalAllocated = (cfg.availableQuantity || 0) + (cfg.bookedQuantity || 0) + (cfg.blockedQuantity || 0) + (cfg.soldQuantity || 0);
                const isOverAllocated = totalAllocated > cfg.quantity;

                return (
                  <div
                    key={cfg.id || idx}
                    className="card"
                    style={{
                      padding: "16px",
                      border: isOverAllocated ? "1px solid var(--danger)" : "1px solid var(--border-subtle)",
                      backgroundColor: isOverAllocated ? "#fff5f5" : "var(--bg-surface)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="badge badge-info" style={{ fontSize: "11px" }}>
                          Config #{idx + 1}
                        </span>
                        <strong style={{ fontSize: "14px", color: "var(--text-primary)" }}>
                          {cfg.name || "Untitled Unit"}
                        </strong>
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
                      <button
                        type="button"
                        onClick={() => handleRemoveConfiguration(idx)}
                        className="btn-icon"
                        title="Remove Configuration"
                        style={{ color: "var(--danger)" }}
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>

                    <div className="grid-2" style={{ gap: "10px", marginBottom: "10px" }}>
                      <div>
                        <label style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "2px" }}>
                          Variant Name (e.g. 3 BHK Luxe, 150 Sq. Yd. East)
                        </label>
                        <input
                          type="text"
                          required
                          value={cfg.name}
                          onChange={(e) => handleUpdateConfigField(idx, "name", e.target.value)}
                          style={{ width: "100%", padding: "7px 10px", fontSize: "13px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "2px" }}>
                          Unit Type (e.g. 2 BHK, 3 BHK, Plot, Retail)
                        </label>
                        <input
                          type="text"
                          value={cfg.type}
                          onChange={(e) => handleUpdateConfigField(idx, "type", e.target.value)}
                          style={{ width: "100%", padding: "7px 10px", fontSize: "13px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                        />
                      </div>
                    </div>

                    <div className="grid-2" style={{ gap: "10px", marginBottom: "10px" }}>
                      <div>
                        <label style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "2px" }}>
                          Unit Area & Unit Measure
                        </label>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <input
                            type="number"
                            step="any"
                            value={cfg.area}
                            onChange={(e) => handleUpdateConfigField(idx, "area", Number(e.target.value))}
                            style={{ flex: 1, padding: "7px 10px", fontSize: "13px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                          />
                          <select
                            value={cfg.areaUnit}
                            onChange={(e) => handleUpdateConfigField(idx, "areaUnit", e.target.value)}
                            style={{ width: "110px", padding: "7px 8px", fontSize: "12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                          >
                            <option value="Sq. Ft.">Sq. Ft.</option>
                            <option value="Sq. Yard">Sq. Yard</option>
                            <option value="Sq. Meter">Sq. Meter</option>
                            <option value="Acre">Acre</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "2px" }}>
                          Rate Per Unit (₹ / {cfg.areaUnit})
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 8500"
                          value={cfg.pricePerUnit || ""}
                          onChange={(e) => handleUpdateConfigField(idx, "pricePerUnit", Number(e.target.value))}
                          style={{ width: "100%", padding: "7px 10px", fontSize: "13px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                        />
                      </div>
                    </div>

                    {/* Pricing with Live Calculation */}
                    <div style={{ backgroundColor: "var(--bg-subtle)", padding: "10px", borderRadius: "var(--radius-sm)", marginBottom: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                          Configuration Base & Selling Price (INR)
                        </span>
                        {cfg.area > 0 && cfg.pricePerUnit && cfg.pricePerUnit > 0 && (
                          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            Calc: {cfg.area} × ₹{cfg.pricePerUnit} = ₹{(cfg.area * cfg.pricePerUnit).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      <div className="grid-2" style={{ gap: "10px" }}>
                        <div>
                          <label style={{ fontSize: "11px", color: "var(--text-secondary)", display: "block", marginBottom: "2px" }}>
                            Final Base Price (₹)
                          </label>
                          <input
                            type="number"
                            value={cfg.basePrice}
                            onChange={(e) => handleUpdateConfigField(idx, "basePrice", Number(e.target.value))}
                            style={{ width: "100%", padding: "7px 10px", fontSize: "13px", fontWeight: 700, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "11px", color: "var(--text-secondary)", display: "block", marginBottom: "2px" }}>
                            Selling Price (₹)
                          </label>
                          <input
                            type="number"
                            value={cfg.sellingPrice || cfg.basePrice}
                            onChange={(e) => handleUpdateConfigField(idx, "sellingPrice", Number(e.target.value))}
                            style={{ width: "100%", padding: "7px 10px", fontSize: "13px", fontWeight: 700, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Inventory Allocation */}
                    <div style={{ borderTop: "1px dashed var(--border-subtle)", paddingTop: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                          Inventory Allocation Breakdown
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: isOverAllocated ? "var(--danger)" : "var(--success)",
                          }}
                        >
                          Allocated: {totalAllocated} / {cfg.quantity}
                        </span>
                      </div>

                      {isOverAllocated && (
                        <div style={{ fontSize: "11.5px", color: "var(--danger)", fontWeight: 600, marginBottom: "6px" }}>
                          ⚠️ Total allocated units ({totalAllocated}) exceeds total quantity ({cfg.quantity})!
                        </div>
                      )}

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: "6px" }}>
                        <div>
                          <label style={{ fontSize: "10.5px", color: "var(--text-muted)", display: "block" }}>Total Qty</label>
                          <input
                            type="number"
                            min="0"
                            value={cfg.quantity}
                            onChange={(e) => handleUpdateConfigField(idx, "quantity", Number(e.target.value))}
                            style={{ width: "100%", padding: "6px 8px", fontSize: "12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "10.5px", color: "var(--success)", display: "block" }}>Available</label>
                          <input
                            type="number"
                            min="0"
                            value={cfg.availableQuantity}
                            onChange={(e) => handleUpdateConfigField(idx, "availableQuantity", Number(e.target.value))}
                            style={{ width: "100%", padding: "6px 8px", fontSize: "12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "10.5px", color: "var(--brand-primary)", display: "block" }}>Booked</label>
                          <input
                            type="number"
                            min="0"
                            value={cfg.bookedQuantity}
                            onChange={(e) => handleUpdateConfigField(idx, "bookedQuantity", Number(e.target.value))}
                            style={{ width: "100%", padding: "6px 8px", fontSize: "12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "10.5px", color: "var(--warning)", display: "block" }}>Blocked</label>
                          <input
                            type="number"
                            min="0"
                            value={cfg.blockedQuantity}
                            onChange={(e) => handleUpdateConfigField(idx, "blockedQuantity", Number(e.target.value))}
                            style={{ width: "100%", padding: "6px 8px", fontSize: "12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "10.5px", color: "var(--danger)", display: "block" }}>Sold</label>
                          <input
                            type="number"
                            min="0"
                            value={cfg.soldQuantity}
                            onChange={(e) => handleUpdateConfigField(idx, "soldQuantity", Number(e.target.value))}
                            style={{ width: "100%", padding: "6px 8px", fontSize: "12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <button type="button" onClick={() => setActiveSection("scale")} className="btn btn-secondary btn-sm">
                  ← Back: Scale
                </button>
                <button type="button" onClick={() => setActiveSection("pricing")} className="btn btn-primary btn-sm">
                  Next: Project Pricing & Charges →
                </button>
              </div>
            </div>
          )}

          {/* SECTION 5: Pricing & Charges */}
          {activeSection === "pricing" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--brand-primary)" }}>
                Step 5: Project-Level Pricing & Ancillary Charges
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Starting Price Label (e.g. ₹75 L, ₹1.2 Cr)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹75 L"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Price Range Display (e.g. ₹75 L – ₹1.3 Cr)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹75 L – ₹1.3 Cr"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Numeric Base Price (For deal conversion calculations) <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 7500000"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Rate per Sq. Ft. or Sq. Yard
                  </label>
                  <input
                    type="number"
                    placeholder={projectType === "Plotted Development" ? "e.g. 42000 / Sq. Yd." : "e.g. 7800 / Sq. Ft."}
                    value={projectType === "Plotted Development" ? pricePerSqYard : pricePerSqFt}
                    onChange={(e) => {
                      if (projectType === "Plotted Development") {
                        setPricePerSqYard(e.target.value);
                      } else {
                        setPricePerSqFt(e.target.value);
                      }
                    }}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Market / Benchmark Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 8200000"
                    value={marketPrice}
                    onChange={(e) => setMarketPrice(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Formatted Base Display (e.g. ₹75 L)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹75 L"
                    value={basePriceFormatted}
                    onChange={(e) => setBasePriceFormatted(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                  />
                </div>
              </div>

              {/* Additional Charges dynamic rows */}
              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Additional Project Charges (PLC, Parking, Clubhouse, Maintenance)
                  </span>
                  <button type="button" onClick={handleAddCharge} className="btn btn-secondary btn-sm">
                    <Icon name="plus" size={13} />
                    <span>Add Charge</span>
                  </button>
                </div>

                {additionalCharges.length === 0 ? (
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>
                    No additional charges specified. Click &quot;Add Charge&quot; to include PLC, car park bays, or clubhouse membership.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {additionalCharges.map((chg, cIdx) => (
                      <div key={chg.id || cIdx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <input
                          type="text"
                          placeholder="Charge Name (e.g. Covered Car Parking)"
                          value={chg.name}
                          onChange={(e) => handleUpdateCharge(cIdx, "name", e.target.value)}
                          style={{ flex: 2, padding: "7px 10px", fontSize: "13px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                        />
                        <input
                          type="number"
                          placeholder="Amount (₹)"
                          value={chg.amount || ""}
                          onChange={(e) => handleUpdateCharge(cIdx, "amount", Number(e.target.value))}
                          style={{ flex: 1, padding: "7px 10px", fontSize: "13px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                        />
                        <button type="button" onClick={() => handleRemoveCharge(cIdx)} className="btn-icon" style={{ color: "var(--danger)" }}>
                          <Icon name="trash" size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <button type="button" onClick={() => setActiveSection("configurations")} className="btn btn-secondary btn-sm">
                  ← Back: Configurations
                </button>
                <button type="button" onClick={() => setActiveSection("amenities")} className="btn btn-primary btn-sm">
                  Next: Amenities & USPs →
                </button>
              </div>
            </div>
          )}

          {/* SECTION 6: Amenities & Highlights */}
          {activeSection === "amenities" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--brand-primary)" }}>
                Step 6: Amenities & Project Highlights
              </div>

              {/* Standard Amenities Multi-select */}
              <div>
                <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                  Select Amenities ({amenities.length} Selected)
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {DEFAULT_AMENITIES_OPTIONS.map((amenity) => {
                    const isSelected = amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        style={{
                          padding: "6px 10px",
                          fontSize: "12px",
                          borderRadius: "var(--radius-md)",
                          border: isSelected ? "1px solid var(--brand-primary)" : "1px solid var(--border-subtle)",
                          backgroundColor: isSelected ? "var(--brand-primary-light)" : "var(--bg-surface)",
                          color: isSelected ? "var(--brand-primary)" : "var(--text-secondary)",
                          cursor: "pointer",
                          fontWeight: isSelected ? 700 : 500,
                        }}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {amenity}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amenity Adder */}
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  <input
                    type="text"
                    placeholder="Add custom amenity..."
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e.target.value)}
                    style={{ flex: 1, padding: "7px 10px", fontSize: "12.5px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                  />
                  <button type="button" onClick={handleAddCustomAmenity} className="btn btn-secondary btn-sm">
                    + Add
                  </button>
                </div>
              </div>

              {/* Highlights & Key Selling Points */}
              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "14px" }}>
                <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                  Project Highlights & USPs ({highlights.length})
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px" }}>
                  {highlights.map((hl, hIdx) => (
                    <div
                      key={hIdx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "6px 10px",
                        backgroundColor: "var(--bg-subtle)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "12.5px",
                      }}
                    >
                      <span>⭐ {hl}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(hIdx)}
                        className="btn-icon"
                        style={{ color: "var(--danger)", padding: "2px" }}
                      >
                        <Icon name="x" size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="e.g. 100% Vastu Compliant, Zero Stamp Duty, 20% Green Cover"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    style={{ flex: 1, padding: "7px 10px", fontSize: "12.5px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                  />
                  <button type="button" onClick={handleAddHighlight} className="btn btn-secondary btn-sm">
                    + Add USP
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <button type="button" onClick={() => setActiveSection("pricing")} className="btn btn-secondary btn-sm">
                  ← Back: Pricing
                </button>
                <button type="button" onClick={() => setActiveSection("plans_specs")} className="btn btn-primary btn-sm">
                  Next: Payment & Specifications →
                </button>
              </div>
            </div>
          )}

          {/* SECTION 7: Payment Plans, Specifications & Connectivity */}
          {activeSection === "plans_specs" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--brand-primary)" }}>
                Step 7: Payment Schemes, Specifications & Nearby Transit
              </div>

              {/* Payment Plans */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                  Payment Plan Milestones
                </div>
                {paymentPlans.map((plan, pIdx) => (
                  <div key={plan.id || pIdx} className="card" style={{ padding: "12px", marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <input
                        type="text"
                        value={plan.name}
                        onChange={(e) => {
                          const updated = [...paymentPlans];
                          updated[pIdx] = { ...updated[pIdx], name: e.target.value };
                          setPaymentPlans(updated);
                        }}
                        style={{ fontWeight: 700, fontSize: "13px", padding: "4px 8px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                      />
                      <button type="button" onClick={() => handleAddMilestone(pIdx)} className="btn btn-secondary btn-sm">
                        + Add Milestone
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {plan.milestones?.map((ms, mIdx) => (
                        <div key={ms.id || mIdx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input
                            type="text"
                            value={ms.name}
                            onChange={(e) => handleUpdateMilestone(pIdx, mIdx, "name", e.target.value)}
                            style={{ flex: 2, padding: "5px 8px", fontSize: "12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                          />
                          <input
                            type="number"
                            value={ms.percentage}
                            onChange={(e) => handleUpdateMilestone(pIdx, mIdx, "percentage", Number(e.target.value))}
                            style={{ width: "70px", padding: "5px 8px", fontSize: "12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                          />
                          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>%</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMilestone(pIdx, mIdx)}
                            className="btn-icon"
                            style={{ color: "var(--danger)" }}
                          >
                            <Icon name="x" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Specifications */}
              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Technical Specifications (Structure, Flooring, Electrical)
                  </span>
                  <button type="button" onClick={handleAddSpec} className="btn btn-secondary btn-sm">
                    + Add Spec
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {specifications.map((spec, sIdx) => (
                    <div key={spec.id || sIdx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="text"
                        placeholder="Feature (e.g. Structure)"
                        value={spec.name}
                        onChange={(e) => handleUpdateSpec(sIdx, "name", e.target.value)}
                        style={{ flex: 1, padding: "6px 8px", fontSize: "12.5px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                      />
                      <input
                        type="text"
                        placeholder="Detail (e.g. RCC Framed Structure)"
                        value={spec.value}
                        onChange={(e) => handleUpdateSpec(sIdx, "value", e.target.value)}
                        style={{ flex: 2, padding: "6px 8px", fontSize: "12.5px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                      />
                      <button type="button" onClick={() => handleRemoveSpec(sIdx)} className="btn-icon" style={{ color: "var(--danger)" }}>
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Connectivity */}
              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Location Connectivity & Nearby Landmarks
                  </span>
                  <button type="button" onClick={handleAddConnectivity} className="btn btn-secondary btn-sm">
                    + Add Landmark
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {connectivity.map((con, cnIdx) => (
                    <div key={con.id || cnIdx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="text"
                        placeholder="Transit / Landmark (e.g. Metro Station)"
                        value={con.name}
                        onChange={(e) => handleUpdateConnectivity(cnIdx, "name", e.target.value)}
                        style={{ flex: 2, padding: "6px 8px", fontSize: "12.5px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                      />
                      <input
                        type="text"
                        placeholder="Distance (e.g. 2.5 KM)"
                        value={con.distance}
                        onChange={(e) => handleUpdateConnectivity(cnIdx, "distance", e.target.value)}
                        style={{ flex: 1, padding: "6px 8px", fontSize: "12.5px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
                      />
                      <button type="button" onClick={() => handleRemoveConnectivity(cnIdx)} className="btn-icon" style={{ color: "var(--danger)" }}>
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Brochure Link */}
              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}>
                <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Official Digital Brochure PDF / Drive URL
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://storage.example.com/brochures/prestige-brochure.pdf"
                  value={brochureUrl}
                  onChange={(e) => setBrochureUrl(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <button type="button" onClick={() => setActiveSection("amenities")} className="btn btn-secondary btn-sm">
                  ← Back: Amenities
                </button>
                <button type="button" onClick={() => setActiveSection("commission")} className="btn btn-primary btn-sm">
                  Next: Brokerage Incentive →
                </button>
              </div>
            </div>
          )}

          {/* SECTION 8: Brokerage Commission / Incentive */}
          {activeSection === "commission" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--brand-primary)" }}>
                Step 8: Brokerage Commission & Incentive Architecture
              </div>

              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-subtle)",
                  fontSize: "12.5px",
                  color: "var(--text-secondary)",
                }}
              >
                ℹ️ Defines the incentive rule used by the SAHYAK <strong>Deal Conversion Modal</strong> when closing leads on this project.
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Commission Structure Type
                  </label>
                  <select
                    value={incentiveType}
                    onChange={(e) => setIncentiveType(e.target.value as "percentage" | "fixed")}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-surface)" }}
                  >
                    <option value="percentage">Percentage Based Commission (%)</option>
                    <option value="fixed">Fixed Lump Sum Payout (₹)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    {incentiveType === "percentage" ? "Commission Rate (%)" : "Flat Payout Value (₹)"}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={incentiveValue}
                    onChange={(e) => setIncentiveValue(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12.5px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Commission Policy / Description Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2.0% Villa Brokerage Incentive or ₹3,50,000 Flat Commercial Commission"
                  value={incentiveLabel}
                  onChange={(e) => setIncentiveLabel(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                />
              </div>

              {/* Commission Preview */}
              <div
                style={{
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px dashed var(--brand-primary)",
                  backgroundColor: "var(--brand-primary-light)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Estimated Broker Earnings on Base Price:</div>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: "var(--brand-primary)" }}>
                    {incentiveType === "percentage"
                      ? `₹${Math.round((Number(basePrice) * Number(incentiveValue)) / 100).toLocaleString("en-IN")}`
                      : `₹${Number(incentiveValue).toLocaleString("en-IN")}`}
                  </div>
                </div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Base: ₹{Number(basePrice).toLocaleString("en-IN")}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <button type="button" onClick={() => setActiveSection("plans_specs")} className="btn btn-secondary btn-sm">
                  ← Back: Plans & Specs
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: "8px 20px" }}>
                  {isEdit ? "Update Project" : "Save & Create Project"}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Modal Footer */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "var(--bg-subtle)",
            flexShrink: 0,
          }}
        >
          <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
              {configurations.length} Configuration(s) defined
            </span>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary btn-sm"
              style={{ padding: "8px 18px", fontWeight: 700 }}
            >
              {isEdit ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
