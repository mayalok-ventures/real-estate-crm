export interface MetricOverview {
  totalLeads: number;
  totalFollowUps: number;
  todayFollowUps: number;
  todaySiteVisits: number;
  convertedDeals: number;
  pipelineValue: string;
}

export interface LeadNote {
  id: string;
  text: string;
  date: string;
  author: string;
}

export interface FollowUpHistoryItem {
  id: string;
  date: string;
  time: string;
  note: string;
  completedAt: string;
}

export interface CallRecordingItem {
  id: string;
  name: string;
  url: string;
  size: string;
  date: string;
}

export interface LeadConversion {
  projectId: string;
  projectName: string;
  finalPrice: string;
  numericFinalPrice: number;
  incentiveLabel: string;
  calculatedIncentive: string;
  date: string;
}

export interface LeadActivity {
  id: string;
  title: string;
  time: string;
  type: "created" | "assigned" | "followup" | "sitevisit" | "note" | "audio" | "converted";
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  countryCode?: string;
  location?: string;
  propertyInterest: string;
  projectId?: string;
  projectName?: string;
  interestType?: "Apartment" | "Villa" | "Plot" | "Commercial" | "Office" | "Retail";
  budget: string;
  status: "Hot" | "Warm" | "Cold" | "Qualified" | "Converted";
  source: string;
  createdAt: string;
  assignedTo?: string;
  assignedToUserId?: string;
  assignedTeamId?: string;
  pipelineStage?: string;
  followUp?: {
    required: boolean;
    date?: string;
    time?: string;
  };
  noFollowUpReason?: string;
  followUpHistory?: FollowUpHistoryItem[];
  siteVisit?: {
    scheduled: boolean;
    date?: string;
    time?: string;
    notes?: string;
  };
  notesList?: LeadNote[];
  recordings?: CallRecordingItem[];
  conversion?: LeadConversion;
  activities?: LeadActivity[];
  customFields?: Record<string, unknown>;
  email?: string;
  importBatchId?: string;
  importedAt?: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  leadCount: number;
  totalValue: string;
  color: string;
  probability?: number;
  description?: string;
  order?: number;
}

export type LeadFieldType =
  | "text"
  | "number"
  | "email"
  | "phone"
  | "select"
  | "multiselect"
  | "date"
  | "textarea";

export interface LeadFieldConfig {
  id: string;
  name: string; // Key in lead or customFields
  label: string;
  type: LeadFieldType;
  required: boolean;
  isSystem: boolean; // System fields cannot be deleted
  isActive: boolean;
  placeholder?: string;
  options?: string[]; // for select / multiselect
  order: number;
  section?: "basic" | "preference" | "schedule" | "custom";
}

export interface TemplateAttachment {
  id: string;
  name: string; // User-defined recognizable name (e.g., "Prestige Palm Meadows Cover Image", "Price List PDF")
  type: "image" | "video" | "pdf";
  fileName: string;
  fileSize: string;
  url: string;
}

export interface BrokerProfile {
  fullName: string;
  phone: string;
  email: string;
  agencyName: string;
  reraNumber?: string;
  city?: string;
  address?: string;
  website?: string;
  designation?: string;
  notificationsEnabled: boolean;
  soundAlerts: boolean;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: "Greeting" | "Brochure" | "Follow-up" | "Site Visit" | "Offer";
  body: string;
  variables: string[];
  attachments: TemplateAttachment[];
  status: "Active" | "Draft";
  updatedAt: string;
}

export interface FollowUpItem {
  id: string;
  clientName: string;
  phone: string;
  property: string;
  time: string;
  dateType: "overdue" | "today" | "upcoming";
  notes: string;
  priority: "High" | "Medium" | "Normal";
}

export interface SiteVisitItem {
  id: string;
  clientName: string;
  phone: string;
  projectName: string;
  unitType: string;
  time: string;
  status: "scheduled" | "completed" | "upcoming";
  location: string;
}

export interface ProjectIncentive {
  type: "percentage" | "fixed";
  value: number;
  label: string;
}

export interface ProductConfiguration {
  id: string;
  name: string; // e.g. "2 BHK Standard", "3 BHK Luxury", "150 Sq. Yard East Facing"
  type: string; // e.g. "2 BHK", "3 BHK", "Plot", "Villa", "Retail", "Office"
  description?: string;
  area: number; // e.g. 1450
  areaUnit: "Sq. Ft." | "Sq. Yard" | "Sq. Meter" | "Acre" | "Hectare";
  minimumArea?: number;
  maximumArea?: number;

  // Inventory quantities
  quantity: number; // Total units
  availableQuantity: number;
  bookedQuantity: number;
  blockedQuantity: number;
  soldQuantity: number;

  // Pricing
  basePrice: number; // Numeric value in INR
  marketPrice?: number;
  sellingPrice?: number;
  pricePerUnit?: number; // e.g. ₹8,500 / Sq. Ft. or ₹18,000 / Sq. Yard
  status?: "Available" | "Limited Availability" | "Blocked" | "Sold Out";
}

export type ProjectType =
  | "Residential Apartment"
  | "Villa"
  | "Plotted Development"
  | "Independent Floor"
  | "Commercial"
  | "Retail"
  | "Office"
  | "Warehouse"
  | "Mixed Use"
  | "Other";

export type ProjectStatus =
  | "Pre Launch"
  | "Under Construction"
  | "Ready to Move"
  | "Ready To Move"
  | "Completed"
  | "Sold Out"
  | "Coming Soon";

export interface ProjectAdditionalCharge {
  id: string;
  name: string;
  amount: number;
  type?: "fixed" | "percentage";
}

export interface ProjectDiscount {
  id: string;
  name: string;
  amount: number;
  type: "fixed" | "percentage";
}

export interface ProjectMilestone {
  id: string;
  name: string;
  percentage: number;
}

export interface ProjectPaymentPlan {
  id: string;
  name: string;
  type: "Down Payment" | "Construction Linked" | "Possession Linked" | "Custom";
  description?: string;
  milestones?: ProjectMilestone[];
}

export interface ProjectSpecification {
  id: string;
  name: string;
  value: string;
}

export interface ProjectConnectivity {
  id: string;
  name: string;
  distance: string;
}

export interface ProjectItem {
  id: string;
  name: string; // Mandatory
  developer: string; // Mandatory
  developerDescription?: string;
  developerWebsite?: string;
  reraNumber?: string;
  projectType: ProjectType;
  projectStatus: ProjectStatus;
  shortDescription?: string;
  description?: string;

  // Location
  location: string; // Mandatory (e.g. "Whitefield, Bangalore")
  fullAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  landmark?: string;
  googleMapsUrl?: string;

  // Scale / Dimensions
  totalLandArea?: number;
  landAreaUnit?: "Acres" | "Square Feet" | "Square Yards" | "Hectares";
  totalInventory?: number;
  totalPhases?: number;
  totalBlocks?: number;
  totalTowers?: number;
  totalFloors?: number;
  totalApartments?: number;
  totalPlots?: number;
  totalVillas?: number;
  totalCommercialUnits?: number;

  // Configurations / Products
  configurations: ProductConfiguration[];

  // Pricing
  startingPrice?: string; // e.g. "₹75 L"
  priceRange: string; // e.g. "₹75 L – ₹1.3 Cr" (existing field preserved)
  basePrice: number; // e.g. 7500000 (existing field preserved)
  basePriceFormatted: string; // e.g. "₹75 L" (existing field preserved)
  marketPrice?: number;
  sellingPrice?: number;
  pricePerSqFt?: number;
  pricePerSqYard?: number;
  additionalCharges?: ProjectAdditionalCharge[];
  discounts?: ProjectDiscount[];

  // Payment Plans
  paymentPlans?: ProjectPaymentPlan[];

  // Features
  amenities: string[];
  highlights: string[];
  specifications?: ProjectSpecification[];
  connectivity?: ProjectConnectivity[];

  // Sales & Brokerage (Existing fields preserved)
  availableUnits: number;
  status: ProjectStatus;
  type: string; // e.g. "4BHK Luxury Villas"
  incentive: ProjectIncentive;

  // Media
  coverImage?: string;
  images?: string[];
  brochureUrl?: string;
  priceListUrl?: string;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface GroupItem {
  id: string;
  name: string;
  memberCount: number;
  description: string;
  tag: string;
}

export interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  status: "Not Connected";
  category: string;
}

export interface AgentItem {
  id: string;
  name: string;
  role: string;
  initials: string;
}

export const MOCK_METRICS: MetricOverview = {
  totalLeads: 124,
  totalFollowUps: 28,
  todayFollowUps: 6,
  todaySiteVisits: 2,
  convertedDeals: 4,
  pipelineValue: "₹18.4 Cr",
};

export const MOCK_AGENTS: AgentItem[] = [
  { id: "agent-1", name: "Rohan Verma", role: "Broker / Consultant (You)", initials: "RV" },
  { id: "agent-2", name: "Priya Nambiar", role: "Property Specialist - East Bangalore", initials: "PN" },
  { id: "agent-3", name: "Amit Kulkarni", role: "Commercial & Retail Consultant", initials: "AK" },
  { id: "agent-4", name: "Sunita Rao", role: "Luxury Residential Advisor", initials: "SR" },
];

export const MOCK_PIPELINE_STAGES: PipelineStage[] = [
  { id: "new", name: "New Inquiry", leadCount: 22, totalValue: "₹3.4 Cr", color: "#3b82f6", order: 1, probability: 10, description: "Fresh inbound buyer inquiries from portals, ads, or direct calls" },
  { id: "contacted", name: "Contacted", leadCount: 16, totalValue: "₹2.8 Cr", color: "#6366f1", order: 2, probability: 25, description: "First discovery call completed; buyer requirements clarified" },
  { id: "interested", name: "Interested", leadCount: 12, totalValue: "₹2.1 Cr", color: "#8b5cf6", order: 3, probability: 40, description: "Project brochures and floor plans shortlisted with buyer" },
  { id: "followup", name: "Follow-up", leadCount: 9, totalValue: "₹1.9 Cr", color: "#d97706", order: 4, probability: 50, description: "Active callback scheduled; clarifying financing and unit selection" },
  { id: "sitevisit", name: "Site Visit", leadCount: 5, totalValue: "₹3.2 Cr", color: "#0284c7", order: 5, probability: 70, description: "Physical or virtual walkthrough scheduled/completed on site" },
  { id: "negotiation", name: "Negotiation", leadCount: 3, totalValue: "₹2.6 Cr", color: "#ea580c", order: 6, probability: 85, description: "Final price negotiation, unit block request, and payment terms" },
  { id: "converted", name: "Converted", leadCount: 4, totalValue: "₹2.4 Cr", color: "#059669", order: 7, probability: 100, description: "Booking amount received and deal registered (Won)" },
];

export const MOCK_LEAD_FIELD_CONFIGS: LeadFieldConfig[] = [
  // System Fields (Protected from deletion)
  { id: "f-name", name: "name", label: "Client Full Name", type: "text", required: true, isSystem: true, isActive: true, placeholder: "e.g. Rajesh Malhotra", order: 1, section: "basic" },
  { id: "f-phone", name: "phone", label: "Phone Number", type: "phone", required: true, isSystem: true, isActive: true, placeholder: "e.g. 9876543210", order: 2, section: "basic" },
  { id: "f-location", name: "location", label: "Buyer Location / City", type: "text", required: false, isSystem: true, isActive: true, placeholder: "e.g. Whitefield, Bangalore", order: 3, section: "basic" },
  { id: "f-budget", name: "budget", label: "Approximate Budget", type: "select", required: true, isSystem: true, isActive: true, options: ["₹50L – ₹75L", "₹75L – ₹1.2 Cr", "₹1.2 Cr – ₹2 Cr", "₹2 Cr – ₹3.5 Cr", "₹3.5 Cr+"], order: 4, section: "preference" },
  { id: "f-project", name: "projectId", label: "Interested Catalog Project", type: "select", required: false, isSystem: true, isActive: true, order: 5, section: "preference" },
  { id: "f-interest", name: "interestType", label: "Property Type Interest", type: "select", required: true, isSystem: true, isActive: true, options: ["Apartment", "Villa", "Plot", "Commercial", "Office", "Retail"], order: 6, section: "preference" },
  { id: "f-status", name: "status", label: "Lead Temperature / Status", type: "select", required: true, isSystem: true, isActive: true, options: ["Hot", "Warm", "Cold", "Qualified"], order: 7, section: "preference" },
  { id: "f-source", name: "source", label: "Acquisition Source", type: "select", required: true, isSystem: true, isActive: true, options: ["Direct Call", "Meta Ads", "Google Ads", "Referral", "Website Form", "MagicBricks / 99acres", "Walk-in"], order: 8, section: "preference" },
  { id: "f-followup", name: "followUp", label: "Follow-up Scheduling", type: "text", required: false, isSystem: true, isActive: true, order: 9, section: "schedule" },
  { id: "f-sitevisit", name: "siteVisit", label: "Site Visit Scheduling", type: "text", required: false, isSystem: true, isActive: true, order: 10, section: "schedule" },

  // Custom Fields (Broker can add, edit, disable, or remove)
  {
    id: "f-custom-1",
    name: "investmentPurpose",
    label: "Purchase Objective / Purpose",
    type: "select",
    required: false,
    isSystem: false,
    isActive: true,
    placeholder: "Select purpose",
    options: ["Primary Residence (End-Use)", "Capital Growth / Investment", "Rental Income Generation", "Weekend / Vacation Villa"],
    order: 11,
    section: "custom",
  },
  {
    id: "f-custom-2",
    name: "possessionTimeline",
    label: "Target Possession Timeline",
    type: "select",
    required: false,
    isSystem: false,
    isActive: true,
    placeholder: "Select timeline",
    options: ["Immediate / Ready to Move", "Within 3 to 6 Months", "Within 1 Year", "Under Construction (2-3 Years)"],
    order: 12,
    section: "custom",
  },
  {
    id: "f-custom-3",
    name: "fundingMode",
    label: "Financing & Funding Mode",
    type: "select",
    required: false,
    isSystem: false,
    isActive: true,
    placeholder: "Select financing method",
    options: ["Pre-Approved Bank Loan", "Home Loan Assistance Required", "Self-Funded / Cash Liquidity", "NRI Foreign Inward Remittance"],
    order: 13,
    section: "custom",
  },
];

export const MOCK_BROKER_PROFILE: BrokerProfile = {
  fullName: "Rohan Verma",
  phone: "+91 98450 88776",
  email: "rohan.verma@realtor.in",
  agencyName: "Verma Realty Advisory & Consultants",
  reraNumber: "PRM/KA/RERA/1251/AGENT/2024/0082",
  city: "Bangalore",
  address: "Suite 402, Prestige Meridian Tower, MG Road, Bangalore 560001",
  website: "https://vermarealty.in",
  designation: "Principal Consultant & Licensed Channel Partner",
  notificationsEnabled: true,
  soundAlerts: true,
};

export const MOCK_WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: "tmpl-1",
    name: "Initial Lead Response / Welcome",
    category: "Greeting",
    body: "Hello {client_name},\n\nThank you for reaching out regarding {project_name}. I am {broker_name} with {agency_name}.\n\nI have received your inquiry for properties in {location}. Are you available for a brief 2-minute call today to discuss your exact preferences and budget?\n\nBest regards,\n{broker_name}\n{agency_name}",
    variables: ["client_name", "project_name", "location", "broker_name", "agency_name"],
    attachments: [
      {
        id: "att-1",
        name: "Verma Realty Agency Profile & Credentials",
        type: "image",
        fileName: "agency-credentials.jpg",
        fileSize: "480 KB",
        url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
      },
    ],
    status: "Active",
    updatedAt: "2026-09-08",
  },
  {
    id: "tmpl-2",
    name: "Project Information & Verified Brochure",
    category: "Brochure",
    body: "Namaste {client_name},\n\nSharing the verified project details and inventory pricing for *{project_name}* ({location}) as discussed.\n\nKey Highlights:\n• Starting from {starting_price}\n• 100% RERA Approved & Clear Title\n• Premium Amenities & Strategic Connectivity\n\nPlease find the attached official brochure and inventory price list. Would tomorrow 11:00 AM or 4:00 PM work for an on-site walkthrough?\n\nWarm regards,\n{broker_name}\n{agency_name}",
    variables: ["client_name", "project_name", "location", "starting_price", "broker_name", "agency_name"],
    attachments: [
      {
        id: "att-2",
        name: "Official Verified Project Brochure PDF",
        type: "pdf",
        fileName: "verified-project-brochure.pdf",
        fileSize: "4.8 MB",
        url: "/documents/project-brochure.pdf",
      },
      {
        id: "att-3",
        name: "Master Elevation & Project Rendering",
        type: "image",
        fileName: "master-elevation.jpg",
        fileSize: "1.4 MB",
        url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "att-4",
        name: "Configuration Inventory & Price Sheet PDF",
        type: "pdf",
        fileName: "inventory-price-sheet.pdf",
        fileSize: "1.2 MB",
        url: "/documents/price-sheet.pdf",
      },
    ],
    status: "Active",
    updatedAt: "2026-09-08",
  },
  {
    id: "tmpl-3",
    name: "Post-Discussion Follow-up & Unit Blocking",
    category: "Follow-up",
    body: "Hi {client_name},\n\nFollowing up on our discussion regarding {project_name}. We currently have high demand for configurations in your budget band ({starting_price}).\n\nI have blocked priority reservation options for 24 hours at the discussed terms. Would you like to review the bank loan EMI calculation sheet or discuss the payment schedule?\n\nBest regards,\n{broker_name}",
    variables: ["client_name", "project_name", "starting_price", "broker_name"],
    attachments: [
      {
        id: "att-5",
        name: "Standard Floor Layout & Unit Plan",
        type: "image",
        fileName: "unit-layout-plan.jpg",
        fileSize: "920 KB",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      },
    ],
    status: "Active",
    updatedAt: "2026-09-08",
  },
  {
    id: "tmpl-4",
    name: "Site Visit Confirmation & Directions",
    category: "Site Visit",
    body: "Dear {client_name},\n\nYour site visit for *{project_name}* is confirmed for *{visit_date}* at *{visit_time}*.\n\n📍 Location Pin: {location_url}\n📞 Site Executive Contact: {broker_phone}\n\nPlease find the attached site approach video and location map. Looking forward to hosting you!\n\nBest regards,\n{broker_name}",
    variables: ["client_name", "project_name", "visit_date", "visit_time", "location_url", "broker_phone", "broker_name"],
    attachments: [
      {
        id: "att-6",
        name: "Site Location & Route Map",
        type: "image",
        fileName: "site-route-map.png",
        fileSize: "680 KB",
        url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "att-7",
        name: "Site Approach & Driving Route Walkthrough Video",
        type: "video",
        fileName: "site-approach-video.mp4",
        fileSize: "14.2 MB",
        url: "/videos/site-approach.mp4",
      },
    ],
    status: "Active",
    updatedAt: "2026-09-08",
  },
  {
    id: "tmpl-5",
    name: "Special Festival Benefit & Re-engagement",
    category: "Offer",
    body: "Hello {client_name},\n\nExclusive update on *{project_name}*: The developer has announced a limited-period festival benefit scheme:\n\n• Zero Stamp Duty & Free Modular Kitchen Allotment\n• Direct Developer Price Protection on Bookings this month\n• Flexible 20:80 Possession-Linked Financing Option\n\nReview the attached festival incentive summary. Would you like to schedule a private walkthrough before inventory closes?\n\nWarm regards,\n{broker_name}",
    variables: ["client_name", "project_name", "broker_name"],
    attachments: [
      {
        id: "att-8",
        name: "Festival Benefit Terms & Incentive Summary PDF",
        type: "pdf",
        fileName: "festival-offer-terms.pdf",
        fileSize: "2.1 MB",
        url: "/documents/festival-offer.pdf",
      },
      {
        id: "att-9",
        name: "Festival Scheme Feature Highlights Banner",
        type: "image",
        fileName: "festival-benefit-banner.jpg",
        fileSize: "850 KB",
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      },
    ],
    status: "Active",
    updatedAt: "2026-09-08",
  },
];

export const MOCK_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Rajesh Malhotra",
    phone: "+91 98450 12345",
    countryCode: "+91",
    location: "Whitefield, Bangalore",
    propertyInterest: "3BHK Luxury - Whitefield",
    projectId: "proj-1",
    projectName: "Prestige Palm Meadows",
    interestType: "Apartment",
    budget: "₹1.8 Cr",
    status: "Hot",
    source: "Meta Ads",
    createdAt: "2 hrs ago",
    assignedTo: "Rohan Verma",
    pipelineStage: "followup",
    followUp: {
      required: true,
      date: "Today",
      time: "4:00 PM",
    },
    siteVisit: {
      scheduled: true,
      date: "Tomorrow",
      time: "11:00 AM",
      notes: "Client bringing spouse and architect to review interior wall flexibility.",
    },
    notesList: [
      {
        id: "note-1",
        text: "Client specifically requested high floor with park view. Pre-approved for ₹1.5 Cr home loan with HDFC.",
        date: "2026-09-08 • 10:30 AM",
        author: "Rohan Verma",
      },
      {
        id: "note-2",
        text: "Discussed builder discount options. Willing to close this month if parking bay charges are bundled.",
        date: "2026-09-07 • 04:15 PM",
        author: "Rohan Verma",
      },
    ],
    followUpHistory: [
      {
        id: "fuh-1",
        date: "2026-09-06",
        time: "11:00 AM",
        note: "Initial discovery call conducted. Shared brochure and payment schedule via WhatsApp.",
        completedAt: "2026-09-06 • 11:15 AM",
      },
    ],
    recordings: [
      {
        id: "rec-1",
        name: "Discovery_Call_Rajesh_Malhotra.mp3",
        url: "",
        size: "2.4 MB",
        date: "2026-09-06 • 11:12 AM",
      },
    ],
    activities: [
      { id: "act-1", title: "Lead Inquired via Meta Ads", time: "Sep 6, 2026 • 10:00 AM", type: "created" },
      { id: "act-2", title: "Assigned to Rohan Verma", time: "Sep 6, 2026 • 10:15 AM", type: "assigned" },
      { id: "act-3", title: "Discovery Call Completed", time: "Sep 6, 2026 • 11:15 AM", type: "followup" },
      { id: "act-4", title: "Site Visit Scheduled for Tomorrow 11:00 AM", time: "Sep 7, 2026 • 04:30 PM", type: "sitevisit" },
    ],
  },
  {
    id: "lead-2",
    name: "Ananya Desai",
    phone: "+91 97310 98765",
    countryCode: "+91",
    location: "Electronic City, Bangalore",
    propertyInterest: "2BHK - Electronic City",
    projectId: "proj-2",
    projectName: "Godrej Park Retreat",
    interestType: "Apartment",
    budget: "₹85 L",
    status: "Warm",
    source: "Google Ads",
    createdAt: "5 hrs ago",
    assignedTo: "Priya Nambiar",
    pipelineStage: "sitevisit",
    followUp: {
      required: true,
      date: "Today",
      time: "11:30 AM",
    },
    siteVisit: {
      scheduled: true,
      date: "Today",
      time: "5:30 PM",
      notes: "Client arriving from Sarjapur office at 5:15 PM.",
    },
    notesList: [
      {
        id: "note-3",
        text: "First-time home buyer looking for possession within 6 months. Interested in Tower B 12th floor.",
        date: "2026-09-08 • 09:15 AM",
        author: "Priya Nambiar",
      },
    ],
    activities: [
      { id: "act-5", title: "Lead Captured via Google Ads", time: "Sep 7, 2026 • 03:00 PM", type: "created" },
      { id: "act-6", title: "Assigned to Priya Nambiar", time: "Sep 7, 2026 • 03:15 PM", type: "assigned" },
      { id: "act-7", title: "Site Visit Scheduled for Today 5:30 PM", time: "Sep 7, 2026 • 06:00 PM", type: "sitevisit" },
    ],
  },
  {
    id: "lead-3",
    name: "Vikram Reddy",
    phone: "+91 99001 22334",
    countryCode: "+91",
    location: "North Bangalore",
    propertyInterest: "4BHK Villa - North Bangalore",
    projectId: "proj-1",
    projectName: "Prestige Palm Meadows",
    interestType: "Villa",
    budget: "₹3.5 Cr",
    status: "Hot",
    source: "Referral",
    createdAt: "Yesterday",
    assignedTo: "Sunita Rao",
    pipelineStage: "negotiation",
    followUp: {
      required: true,
      date: "Today",
      time: "3:30 PM",
    },
    siteVisit: {
      scheduled: true,
      date: "Today",
      time: "4:30 PM",
    },
    notesList: [
      {
        id: "note-4",
        text: "Ready to place token advance if east-facing corner plot is finalized.",
        date: "2026-09-07 • 05:00 PM",
        author: "Sunita Rao",
      },
    ],
    activities: [
      { id: "act-8", title: "Lead Inquired via Client Referral", time: "Sep 6, 2026 • 02:00 PM", type: "created" },
      { id: "act-9", title: "Advanced to Negotiation Stage", time: "Sep 7, 2026 • 05:30 PM", type: "assigned" },
    ],
  },
  {
    id: "lead-4",
    name: "Sneha Kapoor",
    phone: "+91 98860 55443",
    countryCode: "+91",
    location: "Sarjapur Road, Bangalore",
    propertyInterest: "2BHK - Sarjapur Road",
    projectId: "proj-2",
    projectName: "Godrej Park Retreat",
    interestType: "Apartment",
    budget: "₹65 L",
    status: "Cold",
    source: "Website Form",
    createdAt: "2 days ago",
    assignedTo: "Rohan Verma",
    pipelineStage: "contacted",
    noFollowUpReason: "Client postponed search until Diwali bonus announcement.",
    followUp: {
      required: false,
    },
    notesList: [
      {
        id: "note-5",
        text: "Client requested not to call until next quarter.",
        date: "2026-09-06 • 04:00 PM",
        author: "Rohan Verma",
      },
    ],
    activities: [
      { id: "act-10", title: "Lead Inquired via Website Form", time: "Sep 6, 2026 • 09:30 AM", type: "created" },
      { id: "act-11", title: "Follow-up marked not required (Client requested delay)", time: "Sep 6, 2026 • 04:00 PM", type: "followup" },
    ],
  },
  {
    id: "lead-5",
    name: "Arvind Swamy",
    phone: "+91 94480 33221",
    countryCode: "+91",
    location: "Indiranagar, Bangalore",
    propertyInterest: "Penthouse - Indiranagar",
    projectId: "proj-3",
    projectName: "Sobha Dream Acres",
    interestType: "Apartment",
    budget: "₹2.4 Cr",
    status: "Qualified",
    source: "WhatsApp",
    createdAt: "3 days ago",
    assignedTo: "Rohan Verma",
    pipelineStage: "interested",
    followUp: {
      required: true,
      date: "Tomorrow",
      time: "10:00 AM",
    },
    activities: [
      { id: "act-12", title: "Inquiry received via WhatsApp", time: "Sep 5, 2026 • 11:00 AM", type: "created" },
    ],
  },
  {
    id: "lead-6",
    name: "Farhan Akhtar",
    phone: "+91 96110 77889",
    countryCode: "+91",
    location: "Outer Ring Road, Bangalore",
    propertyInterest: "Commercial Retail Shop",
    projectId: "proj-4",
    projectName: "Brigade Tech Square Commercial",
    interestType: "Commercial",
    budget: "₹1.2 Cr",
    status: "Warm",
    source: "Direct Call",
    createdAt: "4 days ago",
    assignedTo: "Amit Kulkarni",
    pipelineStage: "contacted",
    activities: [
      { id: "act-13", title: "Inbound Direct Call Received", time: "Sep 4, 2026 • 02:30 PM", type: "created" },
      { id: "act-14", title: "Assigned to Amit Kulkarni", time: "Sep 4, 2026 • 03:00 PM", type: "assigned" },
    ],
  },
];

export const MOCK_FOLLOW_UPS: FollowUpItem[] = [
  {
    id: "fu-1",
    clientName: "Rajesh Malhotra",
    phone: "+91 98450 12345",
    property: "3BHK Whitefield",
    time: "Yesterday, 4:00 PM",
    dateType: "overdue",
    notes: "Discuss discounted parking allotment and floor selection",
    priority: "High",
  },
  {
    id: "fu-2",
    clientName: "Sneha Kapoor",
    phone: "+91 98860 55443",
    property: "2BHK Sarjapur",
    time: "2 days ago",
    dateType: "overdue",
    notes: "Send updated payment schedule and bank approval list",
    priority: "Normal",
  },
  {
    id: "fu-3",
    clientName: "Ananya Desai",
    phone: "+91 97310 98765",
    property: "2BHK Electronic City",
    time: "Today, 11:30 AM",
    dateType: "today",
    notes: "Clarify possession timeline and maintenance charges",
    priority: "High",
  },
  {
    id: "fu-4",
    clientName: "Vikram Reddy",
    phone: "+91 99001 22334",
    property: "4BHK Villa North",
    time: "Today, 3:30 PM",
    dateType: "today",
    notes: "Confirm site visit timing for family",
    priority: "High",
  },
  {
    id: "fu-5",
    clientName: "Arvind Swamy",
    phone: "+91 94480 33221",
    property: "Penthouse Indiranagar",
    time: "Tomorrow, 10:00 AM",
    dateType: "upcoming",
    notes: "Share title deed legal opinion copy",
    priority: "Medium",
  },
];

export const MOCK_SITE_VISITS: SiteVisitItem[] = [
  {
    id: "sv-1",
    clientName: "Vikram Reddy",
    phone: "+91 99001 22334",
    projectName: "Prestige Palm Meadows",
    unitType: "Villa #14 (East Facing)",
    time: "Today, 4:30 PM",
    status: "scheduled",
    location: "Whitefield, Bangalore",
  },
  {
    id: "sv-2",
    clientName: "Ananya Desai",
    phone: "+91 97310 98765",
    projectName: "Godrej Park Retreat",
    unitType: "Tower B - 1204 (2BHK)",
    time: "Today, 5:30 PM",
    status: "scheduled",
    location: "Sarjapur Road, Bangalore",
  },
  {
    id: "sv-3",
    clientName: "Rajesh Malhotra",
    phone: "+91 98450 12345",
    projectName: "Sobha Dream Acres",
    unitType: "Wing 4 - 802 (3BHK)",
    time: "Yesterday, 11:00 AM",
    status: "completed",
    location: "Panathur Road, Bangalore",
  },
  {
    id: "sv-4",
    clientName: "Arvind Swamy",
    phone: "+91 94480 33221",
    projectName: "Brigade Gateway Residenza",
    unitType: "Penthouse #1901",
    time: "Sunday, 2:00 PM",
    status: "upcoming",
    location: "Rajajinagar, Bangalore",
  },
];

export const MOCK_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    name: "Prestige Palm Meadows",
    developer: "Prestige Group",
    developerDescription: "India's premier real estate developer with over 35 years of excellence across luxury residential, commercial, and retail developments.",
    developerWebsite: "https://www.prestigeconstructions.com",
    reraNumber: "PRM/KA/RERA/1251/310/PR/170915/000234",
    projectType: "Villa",
    projectStatus: "Ready to Move",
    shortDescription: "Ultra-luxury gated villa community with private pools, Victorian clubhouse, and serene landscaping.",
    description: "Prestige Palm Meadows offers quintessential luxury living nestled in the heart of Whitefield. Designed for discerning homeowners, each independent villa boasts private landscaped gardens, imported marble flooring, state-of-the-art home automation, and expansive sunlit terraces.",
    location: "Whitefield, Bangalore",
    fullAddress: "Ramagondanahalli, Varthur Main Road, Whitefield, Bengaluru, Karnataka 560066",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    pincode: "560066",
    landmark: "Opposite Forum South Bangalore & Near Columbia Asia Hospital",
    googleMapsUrl: "https://maps.google.com/?q=Prestige+Palm+Meadows+Whitefield",
    totalLandArea: 100,
    landAreaUnit: "Acres",
    totalInventory: 50,
    totalPhases: 3,
    totalVillas: 50,
    configurations: [
      {
        id: "cfg-101",
        name: "4 BHK Classic Villa",
        type: "Villa",
        description: "Double-height living room, modular kitchen, servant quarters, and private lawn.",
        area: 3850,
        areaUnit: "Sq. Ft.",
        quantity: 25,
        availableQuantity: 4,
        bookedQuantity: 18,
        blockedQuantity: 2,
        soldQuantity: 1,
        basePrice: 32000000,
        sellingPrice: 32000000,
        pricePerUnit: 8311,
        status: "Available",
      },
      {
        id: "cfg-102",
        name: "4 BHK Signature Villa with Pool",
        type: "Villa",
        description: "Spacious layout with personal swimming pool, timber deck, and 2-car garage.",
        area: 4500,
        areaUnit: "Sq. Ft.",
        quantity: 15,
        availableQuantity: 2,
        bookedQuantity: 11,
        blockedQuantity: 1,
        soldQuantity: 1,
        basePrice: 42000000,
        sellingPrice: 42000000,
        pricePerUnit: 9333,
        status: "Limited Availability",
      },
      {
        id: "cfg-103",
        name: "5 BHK Imperial Estate",
        type: "Villa",
        description: "Grand triplex villa with private elevator, home cinema room, and gazebo terrace.",
        area: 5600,
        areaUnit: "Sq. Ft.",
        quantity: 10,
        availableQuantity: 0,
        bookedQuantity: 8,
        blockedQuantity: 0,
        soldQuantity: 2,
        basePrice: 48000000,
        sellingPrice: 48000000,
        pricePerUnit: 8571,
        status: "Sold Out",
      },
    ],
    startingPrice: "₹3.2 Cr",
    priceRange: "₹3.2 Cr – ₹4.8 Cr",
    basePrice: 32000000,
    basePriceFormatted: "₹3.2 Cr",
    marketPrice: 35000000,
    sellingPrice: 32000000,
    pricePerSqFt: 8311,
    additionalCharges: [
      { id: "chg-1", name: "Clubhouse Life Membership", amount: 500000, type: "fixed" },
      { id: "chg-2", name: "2 Covered Car Parks", amount: 600000, type: "fixed" },
      { id: "chg-3", name: "Advance Maintenance (2 Years)", amount: 350000, type: "fixed" },
    ],
    paymentPlans: [
      {
        id: "plan-1",
        name: "Ready Possession Plan",
        type: "Down Payment",
        description: "10% Booking, 15% within 30 days, 75% on Registration & Key Handover.",
        milestones: [
          { id: "m-1", name: "Booking Amount", percentage: 10 },
          { id: "m-2", name: "Agreement within 30 Days", percentage: 15 },
          { id: "m-3", name: "On Registration & Handover", percentage: 75 },
        ],
      },
    ],
    amenities: [
      "Swimming Pool",
      "Gym",
      "Clubhouse",
      "Park",
      "Security",
      "CCTV",
      "Power Backup",
      "Tennis Court",
      "Jogging Track",
      "Squash Court",
      "Children's Play Area",
      "Visitor Parking",
    ],
    highlights: [
      "100-Acre Gated Community",
      "Ready to Move In with OC",
      "Private Swimming Pools",
      "A-Khata & 100% Clear Titles",
      "Adjacent to Whitefield IT Hub",
    ],
    specifications: [
      { id: "sp-1", name: "Structure", value: "Seismic Zone II compliant RCC framed structure" },
      { id: "sp-2", name: "Flooring", value: "Italian marble in living, engineered wood in bedrooms" },
      { id: "sp-3", name: "Windows", value: "Heavy-gauge anodized aluminum with mosquito mesh" },
      { id: "sp-4", name: "Home Automation", value: "Smart lighting, climate control, and digital door locks" },
    ],
    connectivity: [
      { id: "cn-1", name: "Whitefield Metro Station", distance: "2.5 KM" },
      { id: "cn-2", name: "ITPB Tech Park", distance: "4.0 KM" },
      { id: "cn-3", name: "Columbia Asia Hospital", distance: "1.2 KM" },
      { id: "cn-4", name: "Kempegowda Int'l Airport", distance: "38 KM" },
    ],
    availableUnits: 6,
    status: "Ready to Move",
    type: "4BHK Luxury Villas",
    incentive: {
      type: "percentage",
      value: 2.0,
      label: "2.0% Villa Brokerage Incentive",
    },
    createdAt: "2026-08-15",
    updatedAt: "2026-09-07",
  },
  {
    id: "proj-2",
    name: "Godrej Park Retreat",
    developer: "Godrej Properties",
    developerDescription: "Godrej Properties brings the Godrej philosophy of innovation, sustainability, and excellence to the real estate industry.",
    developerWebsite: "https://www.godrejproperties.com",
    reraNumber: "PRM/KA/RERA/1251/308/PR/211222/004598",
    projectType: "Residential Apartment",
    projectStatus: "Under Construction",
    shortDescription: "Forest-themed high-rise apartments on Sarjapur Road with 28,000 sq.ft clubhouse and 85% open greens.",
    description: "Godrej Park Retreat is an urban oasis offering curated 2 & 3 BHK residences situated right along Sarjapur Road. Featuring world-class amenities, low-density towers, and expansive views of lush natural landscapes.",
    location: "Sarjapur Road, Bangalore",
    fullAddress: "Carmelaram, Sarjapur Main Road, Chikkakannalli, Bengaluru, Karnataka 560035",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    pincode: "560035",
    landmark: "Near RGA Tech Park & Wipro SEZ",
    googleMapsUrl: "https://maps.google.com/?q=Godrej+Park+Retreat+Sarjapur",
    totalLandArea: 13,
    landAreaUnit: "Acres",
    totalInventory: 120,
    totalPhases: 2,
    totalTowers: 8,
    totalFloors: 24,
    totalApartments: 120,
    configurations: [
      {
        id: "cfg-201",
        name: "2 BHK Comfort",
        type: "2 BHK",
        description: "Efficiently planned 2-bed apartment with open balcony and utility space.",
        area: 980,
        areaUnit: "Sq. Ft.",
        quantity: 50,
        availableQuantity: 8,
        bookedQuantity: 35,
        blockedQuantity: 4,
        soldQuantity: 3,
        basePrice: 7500000,
        sellingPrice: 7500000,
        pricePerUnit: 7653,
        status: "Available",
      },
      {
        id: "cfg-202",
        name: "3 BHK Premium",
        type: "3 BHK",
        description: "Corner 3-bed home with 3 balconies, wide foyer, and park views.",
        area: 1250,
        areaUnit: "Sq. Ft.",
        quantity: 45,
        availableQuantity: 7,
        bookedQuantity: 32,
        blockedQuantity: 3,
        soldQuantity: 3,
        basePrice: 9800000,
        sellingPrice: 9800000,
        pricePerUnit: 7840,
        status: "Available",
      },
      {
        id: "cfg-203",
        name: "3 BHK Luxe + Maid Room",
        type: "3 BHK",
        description: "Expansive luxury configuration with dedicated helper quarter and large dining area.",
        area: 1450,
        areaUnit: "Sq. Ft.",
        quantity: 25,
        availableQuantity: 3,
        bookedQuantity: 18,
        blockedQuantity: 2,
        soldQuantity: 2,
        basePrice: 13000000,
        sellingPrice: 13000000,
        pricePerUnit: 8965,
        status: "Limited Availability",
      },
    ],
    startingPrice: "₹75 L",
    priceRange: "₹75 L – ₹1.3 Cr",
    basePrice: 7500000,
    basePriceFormatted: "₹75 L",
    marketPrice: 8200000,
    sellingPrice: 7500000,
    pricePerSqFt: 7653,
    additionalCharges: [
      { id: "chg-201", name: "Covered Car Parking", amount: 350000, type: "fixed" },
      { id: "chg-202", name: "Clubhouse & Sports Infrastructure", amount: 250000, type: "fixed" },
      { id: "chg-203", name: "Advance Maintenance (1 Year)", amount: 180000, type: "fixed" },
    ],
    paymentPlans: [
      {
        id: "plan-201",
        name: "Construction Linked Milestone Plan",
        type: "Construction Linked",
        description: "10% Booking, 10% Foundation, 40% Slab Progress, 30% Finishing, 10% Possession.",
        milestones: [
          { id: "m-21", name: "Booking Amount", percentage: 10 },
          { id: "m-22", name: "Foundation Completion", percentage: 10 },
          { id: "m-23", name: "Slab Level Progress", percentage: 40 },
          { id: "m-24", name: "Flooring & Finishing", percentage: 30 },
          { id: "m-25", name: "Key Handover", percentage: 10 },
        ],
      },
    ],
    amenities: [
      "Swimming Pool",
      "Gym",
      "Clubhouse",
      "Park",
      "Security",
      "CCTV",
      "Lift",
      "Power Backup",
      "Children's Play Area",
      "Cricket Pitch",
      "Jogging Track",
      "Yoga Pavilion",
    ],
    highlights: [
      "Forest-Themed Landscaping",
      "85% Open Green Space",
      "Walking Distance to RGA Tech Park",
      "RERA Approved Phase 1 & 2",
      "28,000 Sq. Ft. Grand Clubhouse",
    ],
    specifications: [
      { id: "sp-21", name: "Flooring", value: "Vitrified tiles in living & dining, anti-skid tiles in balconies" },
      { id: "sp-22", name: "Kitchen", value: "Granite platform with stainless steel sink & glazed tile dado" },
      { id: "sp-23", name: "Fittings", value: "Jaguar or equivalent premium chrome-plated fittings" },
    ],
    connectivity: [
      { id: "cn-21", name: "RGA Tech Park", distance: "1.5 KM" },
      { id: "cn-22", name: "Wipro Corporate SEZ", distance: "3.2 KM" },
      { id: "cn-23", name: "Carmelaram Railway Station", distance: "2.8 KM" },
      { id: "cn-24", name: "Outer Ring Road (Bellandur)", distance: "6.0 KM" },
    ],
    availableUnits: 18,
    status: "Under Construction",
    type: "2 & 3BHK Premium Apartments",
    incentive: {
      type: "percentage",
      value: 2.5,
      label: "2.5% Fast Mover Bonus",
    },
    createdAt: "2026-08-20",
    updatedAt: "2026-09-07",
  },
  {
    id: "proj-3",
    name: "Sobha Dream Acres",
    developer: "Sobha Developers",
    developerDescription: "Renowned for backward integration and German precast construction technology ensuring precision delivery.",
    developerWebsite: "https://www.sobha.com",
    reraNumber: "PRM/KA/RERA/1251/310/PR/170916/000155",
    projectType: "Residential Apartment",
    projectStatus: "Ready to Move",
    shortDescription: "High-precision precast high-rise community with 5 expansive clubhouses and world-class sports facilities.",
    description: "Sobha Dream Acres in Panathur Main Road offers German precast construction technology ensuring flawless finish and superior structural integrity. Over 80% open greens with 5 independent clubhouses and swift access to Outer Ring Road.",
    location: "Panathur Main Road, Bangalore",
    fullAddress: "Panathur - Balagere Road, Off Marathahalli-Sarjapur ORR, Bengaluru, Karnataka 560087",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    pincode: "560087",
    landmark: "Near Cessna Business Park & Varthur Lake",
    googleMapsUrl: "https://maps.google.com/?q=Sobha+Dream+Acres+Panathur",
    totalLandArea: 81,
    landAreaUnit: "Acres",
    totalInventory: 80,
    totalPhases: 5,
    totalTowers: 12,
    totalFloors: 14,
    totalApartments: 80,
    configurations: [
      {
        id: "cfg-301",
        name: "2 BHK Standard Wing",
        type: "2 BHK",
        description: "Compact precast apartment with optimized carpet efficiency.",
        area: 1012,
        areaUnit: "Sq. Ft.",
        quantity: 45,
        availableQuantity: 6,
        bookedQuantity: 34,
        blockedQuantity: 2,
        soldQuantity: 3,
        basePrice: 8200000,
        sellingPrice: 8200000,
        pricePerUnit: 8102,
        status: "Available",
      },
      {
        id: "cfg-302",
        name: "2 BHK Large Lake View",
        type: "2 BHK",
        description: "Higher-floor residence with panoramic views of Varthur Lake and private deck.",
        area: 1205,
        areaUnit: "Sq. Ft.",
        quantity: 35,
        availableQuantity: 5,
        bookedQuantity: 26,
        blockedQuantity: 2,
        soldQuantity: 2,
        basePrice: 11000000,
        sellingPrice: 11000000,
        pricePerUnit: 9128,
        status: "Available",
      },
    ],
    startingPrice: "₹82 L",
    priceRange: "₹82 L – ₹1.1 Cr",
    basePrice: 8200000,
    basePriceFormatted: "₹82 L",
    marketPrice: 9000000,
    sellingPrice: 8200000,
    pricePerSqFt: 8102,
    additionalCharges: [
      { id: "chg-301", name: "Covered Parking", amount: 300000, type: "fixed" },
      { id: "chg-302", name: "Clubhouse Access & Sports Pass", amount: 200000, type: "fixed" },
    ],
    paymentPlans: [
      {
        id: "plan-301",
        name: "Immediate Move-in Plan",
        type: "Down Payment",
        description: "20% Down payment, 80% through bank loan sanction on OC.",
        milestones: [
          { id: "m-31", name: "Booking & Agreement", percentage: 20 },
          { id: "m-32", name: "Registration & Disbursement", percentage: 80 },
        ],
      },
    ],
    amenities: [
      "Swimming Pool",
      "Gym",
      "Clubhouse",
      "Park",
      "Security",
      "CCTV",
      "Power Backup",
      "Badminton Court",
      "Basketball Court",
      "Supermarket",
      "Clinic",
      "Visitor Parking",
    ],
    highlights: [
      "German Precast Construction",
      "5 Grand Clubhouses",
      "80% Open Greenery",
      "Minutes from Outer Ring Road IT Hub",
      "Ready to Move in with Full OC",
    ],
    specifications: [
      { id: "sp-31", name: "Structure", value: "Precast concrete wall and slab system" },
      { id: "sp-32", name: "Doors", value: "Engineered timber door frame with flush shutter" },
    ],
    connectivity: [
      { id: "cn-31", name: "Cessna Business Park", distance: "3.5 KM" },
      { id: "cn-32", name: "Marathahalli Bridge", distance: "5.0 KM" },
      { id: "cn-33", name: "Prestige Tech Park", distance: "4.2 KM" },
    ],
    availableUnits: 11,
    status: "Ready to Move",
    type: "2BHK High-rise Apartments",
    incentive: {
      type: "percentage",
      value: 2.0,
      label: "2.0% Standard Incentive",
    },
    createdAt: "2026-08-10",
    updatedAt: "2026-09-05",
  },
  {
    id: "proj-4",
    name: "Brigade Tech Square Commercial",
    developer: "Brigade Group",
    developerDescription: "Leading South Indian real estate developer recognized for grade-A tech parks and retail destinations.",
    developerWebsite: "https://www.brigadegroup.com",
    reraNumber: "PRM/KA/RERA/1251/310/PR/190823/002821",
    projectType: "Commercial",
    projectStatus: "Under Construction",
    shortDescription: "LEED Gold certified commercial office suites & high-street retail storefronts on Outer Ring Road.",
    description: "Brigade Tech Square is an iconic commercial landmark offering Grade-A office spaces and prime double-height retail shops along the bustling Outer Ring Road corridor. Designed with high floor-to-ceiling heights, multi-level basements, and double-glazed façade.",
    location: "Outer Ring Road, Bangalore",
    fullAddress: "Bellandur Outer Ring Road, Marathahalli-Sarjapur Junction, Bengaluru, Karnataka 560103",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    pincode: "560103",
    landmark: "Opposite Ecospace Tech Park",
    googleMapsUrl: "https://maps.google.com/?q=Brigade+Tech+Square+Bellandur",
    totalLandArea: 8,
    landAreaUnit: "Acres",
    totalInventory: 20,
    totalPhases: 1,
    totalFloors: 11,
    totalCommercialUnits: 20,
    configurations: [
      {
        id: "cfg-401",
        name: "Retail Boutique Storefront",
        type: "Retail",
        description: "Double-height ground floor retail unit with high pedestrian footfall frontage.",
        area: 650,
        areaUnit: "Sq. Ft.",
        quantity: 8,
        availableQuantity: 2,
        bookedQuantity: 5,
        blockedQuantity: 1,
        soldQuantity: 0,
        basePrice: 15000000,
        sellingPrice: 15000000,
        pricePerUnit: 23076,
        status: "Available",
      },
      {
        id: "cfg-402",
        name: "Grade-A Corporate Suite",
        type: "Office",
        description: "Mid-level corporate office space with column-free design and high-speed fiber conduits.",
        area: 1850,
        areaUnit: "Sq. Ft.",
        quantity: 8,
        availableQuantity: 1,
        bookedQuantity: 6,
        blockedQuantity: 0,
        soldQuantity: 1,
        basePrice: 32000000,
        sellingPrice: 32000000,
        pricePerUnit: 17297,
        status: "Limited Availability",
      },
      {
        id: "cfg-403",
        name: "Full Commercial Floorplate",
        type: "Commercial",
        description: "Full-floor office plate ideal for MNC regional headquarters or tech operations.",
        area: 3400,
        areaUnit: "Sq. Ft.",
        quantity: 4,
        availableQuantity: 1,
        bookedQuantity: 2,
        blockedQuantity: 1,
        soldQuantity: 0,
        basePrice: 55000000,
        sellingPrice: 55000000,
        pricePerUnit: 16176,
        status: "Available",
      },
    ],
    startingPrice: "₹1.5 Cr",
    priceRange: "₹1.5 Cr – ₹5.5 Cr",
    basePrice: 15000000,
    basePriceFormatted: "₹1.5 Cr",
    marketPrice: 16500000,
    sellingPrice: 15000000,
    pricePerSqFt: 23076,
    additionalCharges: [
      { id: "chg-401", name: "Basement Reserved Car Parking (Per Bay)", amount: 500000, type: "fixed" },
      { id: "chg-402", name: "HVAC & Chiller Connection", amount: 450000, type: "fixed" },
    ],
    paymentPlans: [
      {
        id: "plan-401",
        name: "Investor Milestone Plan",
        type: "Construction Linked",
        description: "20% on booking, 40% on civil structure, 40% on façade completion.",
        milestones: [
          { id: "m-41", name: "Initial Booking", percentage: 20 },
          { id: "m-42", name: "Structure Completion", percentage: 40 },
          { id: "m-43", name: "Façade & Fit-out Handover", percentage: 40 },
        ],
      },
    ],
    amenities: [
      "24/7 Security",
      "CCTV",
      "Lift",
      "Power Backup",
      "Visitor Parking",
      "Multi-level Basement Parking",
      "Central HVAC",
      "Cafeteria & Food Court",
      "Fire Fighting System",
    ],
    highlights: [
      "LEED Gold Green Certified",
      "Prime Outer Ring Road Frontage",
      "High Rental Yield Potential (7.5%+)",
      "Double-Glazed Soundproof Façade",
      "Direct Metro Station Connectivity",
    ],
    specifications: [
      { id: "sp-41", name: "Façade", value: "DGU unitized glass curtain wall system" },
      { id: "sp-42", name: "Elevators", value: "High-speed destination-controlled passenger elevators" },
      { id: "sp-43", name: "Power", value: "100% DG backup with synchronized panel" },
    ],
    connectivity: [
      { id: "cn-41", name: "Bellandur Metro Station", distance: "200 M" },
      { id: "cn-42", name: "Ecospace Business Park", distance: "500 M" },
      { id: "cn-43", name: "Koramangala", distance: "6.5 KM" },
    ],
    availableUnits: 4,
    status: "Under Construction",
    type: "Grade-A Office & Retail",
    incentive: {
      type: "fixed",
      value: 350000,
      label: "₹3,50,000 Flat Commercial Incentive",
    },
    createdAt: "2026-08-01",
    updatedAt: "2026-09-06",
  },
  {
    id: "proj-5",
    name: "Green Valley Smart City Plots",
    developer: "Green Valley Infratech",
    developerDescription: "Pioneering planned township living and plotted infra developments in North Bangalore.",
    developerWebsite: "https://www.greenvalleyinfra.com",
    reraNumber: "PRM/KA/RERA/1250/303/PR/230118/005612",
    projectType: "Plotted Development",
    projectStatus: "Pre Launch",
    shortDescription: "BIAAPA approved plotted development in Devanahalli with underground cabling, wide asphalted roads, and theme parks.",
    description: "Green Valley Smart City is an expansive 45-acre master-planned residential layout located in the high-growth Devanahalli corridor. Featuring villa plots with 40ft and 60ft wide tree-lined boulevards, underground drainage, and modern smart city infrastructure.",
    location: "Devanahalli, North Bangalore",
    fullAddress: "Near Bangalore International Airport, Devanahalli Town, Bengaluru Rural, Karnataka 562110",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    pincode: "562110",
    landmark: "15 Mins from Kempegowda International Airport",
    googleMapsUrl: "https://maps.google.com/?q=Devanahalli+Bangalore",
    totalLandArea: 45,
    landAreaUnit: "Acres",
    totalInventory: 150,
    totalPhases: 3,
    totalPlots: 150,
    configurations: [
      {
        id: "cfg-501",
        name: "100 Sq. Yard Plot (30×30)",
        type: "Plot",
        description: "Standard east-facing plot ideal for compact independent villa construction.",
        area: 100,
        areaUnit: "Sq. Yard",
        quantity: 60,
        availableQuantity: 22,
        bookedQuantity: 32,
        blockedQuantity: 4,
        soldQuantity: 2,
        basePrice: 4200000,
        sellingPrice: 4200000,
        pricePerUnit: 42000,
        status: "Available",
      },
      {
        id: "cfg-502",
        name: "150 Sq. Yard Plot (30×45)",
        type: "Plot",
        description: "Most popular 3 BHK villa plot size facing landscaped park boulevard.",
        area: 150,
        areaUnit: "Sq. Yard",
        quantity: 50,
        availableQuantity: 16,
        bookedQuantity: 28,
        blockedQuantity: 3,
        soldQuantity: 3,
        basePrice: 6300000,
        sellingPrice: 6300000,
        pricePerUnit: 42000,
        status: "Available",
      },
      {
        id: "cfg-503",
        name: "200 Sq. Yard Plot (30×60)",
        type: "Plot",
        description: "Premium large plot with dual road frontage and generous setback.",
        area: 200,
        areaUnit: "Sq. Yard",
        quantity: 25,
        availableQuantity: 7,
        bookedQuantity: 15,
        blockedQuantity: 2,
        soldQuantity: 1,
        basePrice: 8400000,
        sellingPrice: 8400000,
        pricePerUnit: 42000,
        status: "Available",
      },
      {
        id: "cfg-504",
        name: "250 Sq. Yard Corner Plot",
        type: "Plot",
        description: "Exclusive corner property overlooking main 60ft entrance boulevard.",
        area: 250,
        areaUnit: "Sq. Yard",
        quantity: 15,
        availableQuantity: 3,
        bookedQuantity: 10,
        blockedQuantity: 1,
        soldQuantity: 1,
        basePrice: 11250000,
        sellingPrice: 11250000,
        pricePerUnit: 45000,
        status: "Limited Availability",
      },
    ],
    startingPrice: "₹42 L",
    priceRange: "₹42 L – ₹1.12 Cr",
    basePrice: 4200000,
    basePriceFormatted: "₹42 L",
    marketPrice: 4600000,
    sellingPrice: 4200000,
    pricePerSqYard: 42000,
    additionalCharges: [
      { id: "chg-501", name: "Corner Plot PLC (10%)", amount: 420000, type: "fixed" },
      { id: "chg-502", name: "Park Facing PLC (5%)", amount: 210000, type: "fixed" },
      { id: "chg-503", name: "Layout Infrastructure Maintenance (3 Years)", amount: 120000, type: "fixed" },
    ],
    paymentPlans: [
      {
        id: "plan-501",
        name: "Fast Registration Scheme",
        type: "Down Payment",
        description: "10% on booking, 40% within 30 days, 50% on Registration.",
        milestones: [
          { id: "m-51", name: "Booking Amount", percentage: 10 },
          { id: "m-52", name: "Within 30 Days", percentage: 40 },
          { id: "m-53", name: "At Land Registration", percentage: 50 },
        ],
      },
    ],
    amenities: [
      "Clubhouse",
      "Park",
      "Security",
      "CCTV",
      "Children's Play Area",
      "Jogging Track",
      "Rainwater Harvesting",
      "Underground Drainage",
      "Overhead Water Tank",
    ],
    highlights: [
      "BIAAPA Approved Layout",
      "15 Mins to Kempegowda Airport",
      "Underground Cabling & LED Streetlights",
      "Bank Loan Approved by SBI & HDFC",
      "Immediate Registration & Khata",
    ],
    specifications: [
      { id: "sp-51", name: "Roads", value: "40 & 60 ft wide asphalted roads with concrete kerb stones" },
      { id: "sp-52", name: "Utilities", value: "Underground sanitary & electrical conduits to each plot" },
      { id: "sp-53", name: "Water Supply", value: "Dual water supply network with rainwater harvesting" },
    ],
    connectivity: [
      { id: "cn-51", name: "Kempegowda Int'l Airport", distance: "12 KM" },
      { id: "cn-52", name: "Devanahalli DC Office", distance: "3.5 KM" },
      { id: "cn-53", name: "Upcoming Blue Line Metro", distance: "5.0 KM" },
    ],
    availableUnits: 48,
    status: "Pre Launch",
    type: "Plotted Development (100 - 250 Sq. Yd.)",
    incentive: {
      type: "percentage",
      value: 3.0,
      label: "3.0% North Bangalore Plot Incentive",
    },
    createdAt: "2026-09-01",
    updatedAt: "2026-09-07",
  },
];

export const MOCK_GROUPS: GroupItem[] = [
  {
    id: "grp-1",
    name: "Whitefield Luxury Villa Prospects",
    memberCount: 16,
    description: "High-net-worth individuals looking for ready villas in Whitefield / Outer Ring Road",
    tag: "Luxury",
  },
  {
    id: "grp-2",
    name: "IT Corridor 2BHK First-time Buyers",
    memberCount: 32,
    description: "Tech professionals seeking ₹65L - ₹90L homes near Electronic City and Bellandur",
    tag: "Residential",
  },
  {
    id: "grp-3",
    name: "Commercial Rental Yield Investors",
    memberCount: 11,
    description: "Investors looking for pre-leased retail shops or Grade-A office units with 7%+ yield",
    tag: "Commercial",
  },
];

export const MOCK_INTEGRATIONS: IntegrationItem[] = [
  {
    id: "int-1",
    name: "Meta Lead Ads",
    description: "Automatically capture Facebook & Instagram lead forms directly into SAHYAK leads.",
    status: "Not Connected",
    category: "Paid Advertising",
  },
  {
    id: "int-2",
    name: "Google Ads Lead Extensions",
    description: "Sync search and display campaign lead submissions in real-time.",
    status: "Not Connected",
    category: "Paid Advertising",
  },
  {
    id: "int-3",
    name: "Website Webhook / Forms",
    description: "Connect your broker website inquiry forms via simple HTTP POST endpoint.",
    status: "Not Connected",
    category: "Inbound Capture",
  },
  {
    id: "int-4",
    name: "Property Portals (99acres / MagicBricks)",
    description: "Fetch buyer inquiries generated from property listings automatically.",
    status: "Not Connected",
    category: "Marketplace Portals",
  },
];

// --- Simple in-memory & localStorage store helper for frontend prototype ---
const STORAGE_KEY = "sahyak_crm_leads_v1";

export function getStoredLeads(): Lead[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
  }
  return MOCK_LEADS;
}

export function getLeadById(id: string): Lead | undefined {
  const allLeads = getStoredLeads();
  return allLeads.find((l) => l.id === id);
}

export function saveStoredLeads(leads: Lead[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch {
      // Ignore storage errors
    }
  }
}

export function addLeadToStore(newLead: Lead): Lead[] {
  const current = getStoredLeads();
  const updated = [newLead, ...current.filter((l) => l.id !== newLead.id)];
  saveStoredLeads(updated);
  return updated;
}

export function addBatchLeadsToStore(newLeads: Lead[]): Lead[] {
  const current = getStoredLeads();
  const existingIds = new Set(current.map((l) => l.id));
  const uniqueNewLeads = newLeads.filter((l) => !existingIds.has(l.id));
  const updated = [...uniqueNewLeads, ...current];
  saveStoredLeads(updated);
  return updated;
}

export function updateLeadInStore(updatedLead: Lead): Lead[] {
  const current = getStoredLeads();
  const index = current.findIndex((l) => l.id === updatedLead.id);
  let updated: Lead[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = updatedLead;
  } else {
    updated = [updatedLead, ...current];
  }
  saveStoredLeads(updated);
  return updated;
}

// --- Simple in-memory & localStorage project store helper ---
const PROJECTS_STORAGE_KEY = "sahyak_crm_projects_v1";

export function getStoredProjects(): ProjectItem[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
  }
  return MOCK_PROJECTS;
}

export function getProjectById(id: string): ProjectItem | undefined {
  const allProjects = getStoredProjects();
  return allProjects.find((p) => p.id === id);
}

export function saveStoredProjects(projects: ProjectItem[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // Ignore storage errors
    }
  }
}

export function addProjectToStore(newProject: ProjectItem): ProjectItem[] {
  const current = getStoredProjects();
  const updated = [newProject, ...current.filter((p) => p.id !== newProject.id)];
  saveStoredProjects(updated);
  return updated;
}

export function updateProjectInStore(updatedProject: ProjectItem): ProjectItem[] {
  const current = getStoredProjects();
  const index = current.findIndex((p) => p.id === updatedProject.id);
  let updated: ProjectItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = updatedProject;
  } else {
    updated = [updatedProject, ...current];
  }
  saveStoredProjects(updated);
  return updated;
}

export function deleteProjectFromStore(id: string): ProjectItem[] {
  const current = getStoredProjects();
  const updated = current.filter((p) => p.id !== id);
  saveStoredProjects(updated);
  return updated;
}

// --- Pipeline Store Helpers ---
const PIPELINE_STORAGE_KEY = "sahyak_crm_pipeline_stages_v1";

export function getStoredPipelineStages(): PipelineStage[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(PIPELINE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
  }
  return MOCK_PIPELINE_STAGES;
}

export function saveStoredPipelineStages(stages: PipelineStage[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PIPELINE_STORAGE_KEY, JSON.stringify(stages));
    } catch {
      // Ignore
    }
  }
}

export function addPipelineStageToStore(newStage: PipelineStage): PipelineStage[] {
  const current = getStoredPipelineStages();
  const updated = [...current, newStage];
  saveStoredPipelineStages(updated);
  return updated;
}

export function updatePipelineStageInStore(updatedStage: PipelineStage): PipelineStage[] {
  const current = getStoredPipelineStages();
  const index = current.findIndex((s) => s.id === updatedStage.id);
  let updated: PipelineStage[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = updatedStage;
  } else {
    updated = [...current, updatedStage];
  }
  saveStoredPipelineStages(updated);
  return updated;
}

export function deletePipelineStageFromStore(id: string): { success: boolean; message?: string; updatedStages: PipelineStage[] } {
  const leads = getStoredLeads();
  const leadsInStage = leads.filter((l) => l.pipelineStage === id);
  if (leadsInStage.length > 0) {
    return {
      success: false,
      message: `Cannot delete stage "${id}". It contains ${leadsInStage.length} active lead(s). Please migrate these leads to another stage before deleting.`,
      updatedStages: getStoredPipelineStages(),
    };
  }
  const current = getStoredPipelineStages();
  const updated = current.filter((s) => s.id !== id);
  saveStoredPipelineStages(updated);
  return {
    success: true,
    updatedStages: updated,
  };
}

// --- Lead Field Config Store Helpers ---
const LEAD_FIELDS_STORAGE_KEY = "sahyak_crm_lead_fields_v1";

export function getStoredLeadFieldConfigs(): LeadFieldConfig[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LEAD_FIELDS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
  }
  return MOCK_LEAD_FIELD_CONFIGS;
}

export function saveStoredLeadFieldConfigs(configs: LeadFieldConfig[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LEAD_FIELDS_STORAGE_KEY, JSON.stringify(configs));
    } catch {
      // Ignore
    }
  }
}

export function addLeadFieldConfigToStore(newConfig: LeadFieldConfig): LeadFieldConfig[] {
  const current = getStoredLeadFieldConfigs();
  const updated = [...current, newConfig];
  saveStoredLeadFieldConfigs(updated);
  return updated;
}

export function updateLeadFieldConfigInStore(updatedConfig: LeadFieldConfig): LeadFieldConfig[] {
  const current = getStoredLeadFieldConfigs();
  const index = current.findIndex((c) => c.id === updatedConfig.id);
  let updated: LeadFieldConfig[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = updatedConfig;
  } else {
    updated = [...current, updatedConfig];
  }
  saveStoredLeadFieldConfigs(updated);
  return updated;
}

export function deleteLeadFieldConfigFromStore(id: string): { success: boolean; message?: string; updatedConfigs: LeadFieldConfig[] } {
  const current = getStoredLeadFieldConfigs();
  const target = current.find((c) => c.id === id);
  if (!target) {
    return { success: false, message: "Field not found.", updatedConfigs: current };
  }
  if (target.isSystem) {
    return {
      success: false,
      message: `System field "${target.label}" cannot be deleted as it is critical for CRM integrity. You may disable it if optional.`,
      updatedConfigs: current,
    };
  }
  const updated = current.filter((c) => c.id !== id);
  saveStoredLeadFieldConfigs(updated);
  return { success: true, updatedConfigs: updated };
}

// --- WhatsApp Templates Store Helpers ---
const TEMPLATES_STORAGE_KEY = "sahyak_crm_whatsapp_templates_v1";

export function getStoredWhatsAppTemplates(): WhatsAppTemplate[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
  }
  return MOCK_WHATSAPP_TEMPLATES;
}

export function saveStoredWhatsAppTemplates(templates: WhatsAppTemplate[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    } catch {
      // Ignore
    }
  }
}

export function addWhatsAppTemplateToStore(newTemplate: WhatsAppTemplate): WhatsAppTemplate[] {
  const current = getStoredWhatsAppTemplates();
  const updated = [newTemplate, ...current.filter((t) => t.id !== newTemplate.id)];
  saveStoredWhatsAppTemplates(updated);
  return updated;
}

export function updateWhatsAppTemplateInStore(updatedTemplate: WhatsAppTemplate): WhatsAppTemplate[] {
  const current = getStoredWhatsAppTemplates();
  const index = current.findIndex((t) => t.id === updatedTemplate.id);
  let updated: WhatsAppTemplate[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = updatedTemplate;
  } else {
    updated = [updatedTemplate, ...current];
  }
  saveStoredWhatsAppTemplates(updated);
  return updated;
}

export function deleteWhatsAppTemplateFromStore(id: string): WhatsAppTemplate[] {
  const current = getStoredWhatsAppTemplates();
  const updated = current.filter((t) => t.id !== id);
  saveStoredWhatsAppTemplates(updated);
  return updated;
}

// --- Broker Profile Store Helpers ---
const BROKER_PROFILE_STORAGE_KEY = "sahyak_crm_broker_profile_v1";

export function getStoredBrokerProfile(): BrokerProfile {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(BROKER_PROFILE_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
  }
  return MOCK_BROKER_PROFILE;
}

export function saveStoredBrokerProfile(profile: BrokerProfile): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(BROKER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  }
}

