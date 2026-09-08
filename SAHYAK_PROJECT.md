# SAHYAK CRM

## Project Overview

SAHYAK is a mobile-first Real Estate CRM designed to streamline relationship management, lead tracking, site visit coordination, and deal pipelines for solo real estate professionals.

**Current product context:**
Mobile-first Real Estate CRM.

**Initial target:**
- Solo Real Estate Agents
- Independent Property Brokers
- Real Estate Consultants
- Channel Partners

---

# Current Development Stage

Strict Requirement Audit, Unified Products, Focused Settings & WhatsApp Template Correction Phase (Completed & Fully Verified)

---

# Technology Stack

- **Framework**: Next.js 16.3.4 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Library**: React 19.2.8 & React DOM 19.2.8
- **Styling**: Vanilla CSS (`globals.css`, CSS Modules capable, CSS variables design system, `@media print` luxury document layout)
- **Linter**: ESLint 9 (with `eslint-config-next`)
- **PWA & Offline**: Web App Manifest (`src/app/manifest.ts`), Cache API Service Worker (`public/sw.js`), Offline detection (`useSyncExternalStore`)

---

# Project Structure

```text
crm-mobile/
├── public/
│   ├── icons/
│   │   ├── icon-192.png       # PWA Application Icon (192x192)
│   │   └── icon-512.png       # PWA Application Icon (512x512)
│   └── sw.js                  # Cache-first / Stale-while-revalidate Service Worker
├── src/
│   ├── app/
│   │   ├── analytics/
│   │   │   └── page.tsx       # Sales Analytics overview screen
│   │   ├── follow-ups/
│   │   │   └── page.tsx       # Follow-ups schedule (overdue, today, upcoming) with mandatory reschedule & close reason modals
│   │   ├── groups/
│   │   │   └── page.tsx       # Buyer Groups & investor segments
│   │   ├── integrations/
│   │   │   └── page.tsx       # Lead channel integrations overview (Not Connected)
│   │   ├── leads/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx   # Dynamic Lead Profile & management workspace
│   │   │   └── page.tsx       # Leads directory, search, filter, and preview cards
│   │   ├── more/
│   │   │   └── page.tsx       # Mobile menu accessing secondary sections
│   │   ├── pipeline/
│   │   │   └── page.tsx       # Dynamic Kanban sales pipeline flow with safe stage controls
│   │   ├── products/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx   # Dynamic Project detail & configuration view
│   │   │   └── page.tsx       # Single Unified Products & Projects inventory catalog
│   │   ├── settings/
│   │   │   └── page.tsx       # Focused Settings: Broker Profile & Lead Form Fields Customization
│   │   ├── site-visits/
│   │   │   └── page.tsx       # Site visits schedule and walkthroughs
│   │   ├── whatsapp/
│   │   │   └── page.tsx       # WhatsApp: 5 Ready-Made Templates, Template Creator with Named Attachments, & Multi-Device Pairing
│   │   ├── favicon.ico        # Root application icon
│   │   ├── globals.css        # Design tokens, typography, layout & component styles
│   │   ├── layout.tsx         # Root layout with viewport, metadata, and AppShell
│   │   ├── manifest.ts        # Next.js App Router Web App Manifest
│   │   └── page.tsx           # Dashboard main overview
│   ├── components/
│   │   ├── common/
│   │   │   └── ClientBrochureModal.tsx # Client-facing luxury document & printable brochure generator
│   │   ├── leads/
│   │   │   ├── ConvertLeadModal.tsx    # Unit-configuration deal conversion & incentive calculator
│   │   │   ├── FollowUpSection.tsx     # Strict follow-up scheduler, mandatory reschedule & close reasons, history logger, & chime
│   │   │   ├── LeadCard.tsx            # Mobile-first lead card with quick Call/WhatsApp & details
│   │   │   ├── LeadForm.tsx            # Dynamic lead form with configurable custom fields
│   │   │   ├── LeadProfile.tsx         # Tabbed lead detail workspace & site visit booking
│   │   │   └── WhatsAppSection.tsx     # WhatsApp interaction with named template attachments & client brochure trigger
│   │   ├── products/
│   │   │   ├── ProjectDetail.tsx       # 6-tab comprehensive real estate project workspace
│   │   │   └── ProjectForm.tsx         # 8-section accordion project & configuration builder
│   │   ├── AppShell.tsx       # Responsive shell (Desktop Sidebar, Mobile BottomNav, QuickAdd)
│   │   ├── Icon.tsx           # Zero-dependency SVG icon system
│   │   └── PwaRegister.tsx    # Service Worker registration & subtle network status pill
│   ├── data/
│   │   └── mockData.ts        # Single source of truth: types, mock datasets, and localStorage stores
│   └── utils/
│       └── mediaService.ts    # File type/size validator, HTML5 Canvas compressor, & template attachment creator
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── SAHYAK_PROJECT.md          # Central Project Memory & Single Source of Truth
```

---

# Installed Dependencies

### Production Dependencies
- `next`: `16.3.4`
- `react`: `19.2.8`
- `react-dom`: `19.2.8`

### Development Dependencies
- `@types/node`: `^20`
- `@types/react`: `^19`
- `@types/react-dom`: `^19`
- `eslint`: `^9`
- `eslint-config-next`: `16.3.4`
- `typescript`: `^5`

*Note: Zero additional third-party dependencies were installed. All components, icons, and styling were implemented natively.*

---

# Architecture Decisions

### Decision: Zero-Dependency Native SVG Icon System
- **Reason**: To eliminate bundle bloat and external package maintenance, a dedicated `src/components/Icon.tsx` component was created with only the icons actually needed.
- **Stage**: Frontend Foundation Phase

### Decision: Adaptive Single-Codebase Shell Architecture
- **Reason**: Implemented `AppShell.tsx` adapting seamlessly across viewports:
  - Mobile (< 768px): Sticky top header with brand and title, bottom navigation bar (Home, Leads, + Add, Follow-ups, More), slide-up Quick Add sheet.
  - Desktop (>= 768px): Sticky left sidebar with grouped navigation (Core, Outreach, Management) and user identity card.
- **Stage**: Frontend Foundation Phase

### Decision: Native Next.js App Router PWA Manifest (`manifest.ts`)
- **Reason**: Built-in Next.js metadata route generating `/manifest.webmanifest` with standalone display mode, theme colors, and icons.
- **Stage**: Frontend Foundation Phase

### Decision: Safe Dual-Strategy Offline Service Worker (`public/sw.js`)
- **Reason**: Employs Network-First with Cache Fallback for HTML navigation requests (ensuring users always see fresh routes while offline visits fall back to cached shell), and Stale-While-Revalidate for static assets, eliminating stale code bugs.
- **Stage**: Frontend Foundation Phase

### Decision: React 19 `useSyncExternalStore` for Network State
- **Reason**: Follows React 19 concurrent guidelines for external browser stores (`navigator.onLine`) without triggering cascading renders.
- **Stage**: Frontend Foundation Phase

### Decision: Single Unified Products & Projects Catalog (Elimination of Artificial Packages Split)
- **Reason**: Products and Packages were unnecessarily separated into parallel systems. In SAHYAK CRM, real estate projects and their sellable unit configurations (`ProductConfiguration`) represent the single true product model. The artificial "Packages" split, separate package components, redundant data models, and separate tabs were completely eliminated. Brokers manage their entire inventory seamlessly from a single unified Products & Projects area (`/products`).
- **Stage**: Strict Requirement Audit & Frontend Correction Phase

### Decision: Focused Profile & Settings Architecture
- **Reason**: The Settings area had been over-engineered with unrelated tabs (Pipeline, Packages, WhatsApp, Media). The actual requirement is simple: allow the broker to configure the relevant Lead Form fields and maintain their Broker Profile branding. Unrelated functionality was removed. Pipeline stays in `/pipeline`, Templates stay in `/whatsapp`, and Settings is cleanly focused on Broker Profile and Lead Form Fields Configuration.
- **Stage**: Strict Requirement Audit & Frontend Correction Phase

### Decision: WhatsApp Templates with Named Attachments Owned Directly by Templates
- **Reason**: WhatsApp templates belong inside the WhatsApp workflow (`/whatsapp`), not hidden in Settings. Furthermore, maintaining a detached global media library caused confusion ("which file belongs to which template?"). In SAHYAK CRM, each `WhatsAppTemplate` directly owns its `attachments: TemplateAttachment[]`. Every uploaded media item requires a user-defined name (e.g., "Prestige Palm Meadows Master Elevation") alongside its file type (Image, Video, PDF) and size, ensuring clear visibility across creation, editing, and client communication.
- **Stage**: Strict Requirement Audit & Frontend Correction Phase

### Decision: Mandatory Reason Validation for Follow-up Reschedule, Close, and Cancellation
- **Reason**: To maintain CRM data integrity and prevent undocumented drops in client callback commitments, Follow-up actions strictly enforce validation:
  - Rescheduling an active follow-up requires both New Date, New Time, and a mandatory Reason for Rescheduling (`<textarea required>`).
  - Closing or cancelling a follow-up requires a mandatory Reason / Note (`<textarea required>`).
  - Blank or whitespace-only submissions are blocked by client-side validation across both Lead Profile and the global Follow-ups Schedule.
- **Stage**: Strict Requirement Audit & Frontend Correction Phase

### Decision: System Fields vs Custom Fields for Lead Form Customization
- **Reason**: To allow brokers to customize their intake workflow without breaking CRM logic, lead fields are partitioned into `isSystem: true` (e.g., Client Name, Phone, Budget, Status, Acquisition Source) and `isSystem: false` (custom text, number, select, date, textarea fields). System fields are protected against deletion and cannot be orphaned. Custom fields are persisted to `lead.customFields` preserving full backward compatibility.
- **Stage**: CRM Customization & Media Management Phase

### Decision: Native CSS Print Layout for Luxury Client-Facing PDF Brochures (`ClientBrochureModal.tsx`)
- **Reason**: Heavy JavaScript PDF generation libraries (*e.g., pdfmake, jsPDF, html2canvas*) add megabytes of bundle bloat, often fail in mobile Safari/Chrome, and suffer from font rendering issues. SAHYAK CRM generates client-facing luxury presentation documents using semantic HTML with embedded `@media print` stylesheets and CSS page break rules. Brokers can view instant previews, trigger high-fidelity browser PDF printing, and share personalized brochures via WhatsApp in 1 click.
- **Stage**: CRM Customization & Media Management Phase

### Decision: Dual-Flow WhatsApp Architecture (Desktop QR + Mobile 8-Char Pairing Code + Meta Cloud API Config)
- **Reason**: Clearly distinguishes client-side simulation from real multi-device connection. Desktop users connect via simulated WebSocket QR codes. Mobile users (who cannot scan their own screens) utilize the official 8-character pairing code flow with international dialing codes and E.164 phone normalization. For enterprise production, a full Meta WhatsApp Cloud API credentials configuration (Phone Number ID, WABA ID, Permanent Access Token) is provided.
- **Stage**: CRM Customization & Media Management Phase

---

# Implemented UI / Pages

### 1. Dashboard (`/`)
- Key Metrics cards (Total Leads: 124, Today's Follow-ups: 6, Today's Site Visits: 2, Deals Converted: 4, Pipeline Value: ₹18.4 Cr).
- Today's Priorities section (Overdue follow-ups highlighted in danger badge, Today's calls, Today's property site visits with quick phone action buttons).
- Pipeline Stage Overview bar displaying lead distribution across 7 stages.
- Recent Leads preview list with status badges and quick contact actions.

### 2. Leads (`/leads`)
- Full real estate lead management directory with responsive header, active count badge (`{leads.length} Total Leads`), and "+ Add Lead" modal button.
- Real-time search matching buyer name, phone number, location, project name, property interest, and acquisition source.
- Status filter pills (`All`, `Hot`, `Warm`, `Cold`, `Qualified`) with contextual match counter and empty search reset.
- Mobile-first `LeadCard` components displaying client name, status badge, budget tag, location chip, project association, follow-up & site visit schedule alerts, phone number, and direct Call (`tel:`) and WhatsApp (`wa.me`) quick actions.
- Interactive `LeadForm` modal / bottom sheet supporting client name, international phone code (`+91`, `+1`, `+971`, etc.), location, budget selector, project catalog dropdown (reusing `MOCK_PROJECTS`), property interest type, lead temperature, acquisition source, and conditional follow-up & site-visit scheduling toggles.
- Client-side reactive state prepending newly submitted leads immediately to the top of the list.

### 3. Sales Pipeline (`/pipeline`)
- Dynamic Kanban sales pipeline flow powered by central store (`getStoredPipelineStages()`).
- Horizontal scrolling Kanban stage flow on mobile and structured stage columns on desktop.
- Stages: New Inquiry, Contacted, Interested, Follow-up, Site Visit, Negotiation, Converted (or custom configured stages).
- Interactive lead stage moves: Quick move backward/forward directly between columns without opening edit modals.
- Stage controls: Reorder stages left/right, and safe stage deletion (prohibits deleting stages with active leads).

### 4. Follow-ups (`/follow-ups`)
- Segmented tabs: Overdue, Today, Upcoming.
- Action cards with scheduled time, client details, agenda notes, and Call Now (`tel:`), WhatsApp (`wa.me`), Reschedule (with mandatory reason modal), and Close / Cancel (with mandatory note modal).
- Enforces strict reason documentation before any reschedule or cancellation is processed.

### 5. Site Visits (`/site-visits`)
- Segmented tabs: Scheduled Today, Upcoming, Completed.
- Property cards displaying project name, unit type, location, buyer contact, and Call / Directions / Mark Completed actions.

### 6. WhatsApp (`/whatsapp`)
- **Template Management**: Reusable broker templates with category badges and placeholder variables (`{client_name}`, `{project_name}`, `{location}`). Pre-seeded with 5 ready-made professional real estate templates with named attachments. Includes "+ Create Template" and Edit Template modal supporting multiple attachments with user-defined names.
- **Connection Mode switcher**:
  - **Desktop Web QR Flow**: Simulated WebSocket pairing code generator with dynamic QR visual, real-time countdown timer, and automatic reconnection states.
  - **Mobile 8-Character Pairing Code Flow**: Designed for mobile brokers who cannot scan a QR on the same screen. Includes international country dial code selector (India +91, USA +1, UAE +971, UK +44, Singapore +65), E.164 phone normalization, and official 8-character pairing code display.
  - **Meta Cloud API (Enterprise / Cloud Setup)**: Configuration panel for Phone Number ID, WhatsApp Business Account (WABA) ID, and Permanent Access Token.
- **Direct Dispatcher**: Interactive test message generator with pre-filled wa.me links.

### 7. Buyer Groups (`/groups`)
- Buyer and investor segment cards (Luxury Villa Prospects, IT Corridor 2BHK Seekers, Commercial Investors).
- Member counts, segment tags, and Create Group action placeholder.

### 8. Products & Projects (`/products` & `/products/[id]`)
- Single unified Products & Projects catalog. Zero unnecessary separation or duplicate package systems.
- Search by developer, project name, location, or configuration. Filter by type (Apartment, Villa, Plot, Commercial) and status (Ready to Move, Under Construction, Pre Launch).
- Rich project cards with developer, project type, status badge, location, configuration tags, starting price & price range, inventory availability progress bars, quick Share Brochure, Edit Project, and View Project Details. Grid template columns optimized with `minmax(min(100%, 300px), 1fr)` to prevent horizontal overflow on narrow 320px–360px mobile viewports.
- Dynamic project detail route (`/products/[id]`) structured into 6 focused CRM tabs: Overview & Specs, Configurations, Pricing & Payment Plans, Inventory Health, Amenities, Brochures & Documents, styled as sleek, lightweight segmented controls with smooth horizontal scrolling.
- **Single Form Architecture for Add + Edit (`ProjectForm.tsx`)**: Reusable single form logic `<ProjectForm mode="add" ... />` and `<ProjectForm mode="edit" initialProject={project} project={project} ... />`. No parallel edit architecture or duplicate form code.
- **Critical Data Integrity on Edit**: Deep-copies and preserves all existing configurations, inventory allocation (Available, Booked, Blocked, Sold), pricing tiers, payment milestones, specifications, connectivity landmarks, and discounts. Spreads existing project payload (`...(currentProject || {})`) to guarantee zero data loss. Includes dedicated inputs and previews for `coverImage`, `country`, and `brochureUrl`. Updates the existing record in-place via `updateProjectInStore` with the exact project ID, strictly preventing duplicate records.
- **Client Brochure Generator Modal (`ClientBrochureModal.tsx`)**: Instant preview of luxury branded document with printable `@media print` styling, RERA details, pricing tables, amenities, and 1-click WhatsApp brochure dispatch.

### 9. Sales Analytics (`/analytics`)
- High-level KPIs (Closing Cycle: 24 Days, Visit-to-Deal: 22.2%, Commission Won: ₹9.6 L).
- Lead acquisition source distribution with proportional visual bars.
- Real estate conversion funnel stage progression.

### 10. Integrations (`/integrations`)
- Meta Lead Ads, Google Ads, Website Forms, and Property Portals cards.
- All channels explicitly and clearly marked as `Not Connected`.

### 11. Profile & Settings (`/settings`)
- Focused, 2-Tab CRM Customization Area:
  1. **Broker Profile**: Full name, phone, email, agency name, RERA registration number, physical office address, website, designation, and notification toggles.
  2. **Lead Form Fields**: System field protections (`isSystem: true` fields cannot be deleted or renamed into invalid keys), custom field builder (add, edit, disable, reorder, required/optional toggles, select options).
- Streamlined tab bar using a lightweight, minimal segmented control (`Broker Profile` vs `Lead Form Fields`), eliminating visual heaviness and preventing text wrapping on narrow mobile screens.
- All unrelated tabs (pipeline, packages, whatsapp, media) removed from settings to keep it simple, focused, and purposeful.

### 12. More Menu (`/more`)
- Mobile grid navigation accessing all secondary sections with quick category grouping and broker profile summary.

---

# PWA Implementation

- **Manifest**: `src/app/manifest.ts` providing application identity (`SAHYAK CRM`), short name (`SAHYAK`), theme color (`#1e40af`), background color (`#f8fafc`), standalone display mode, portrait orientation, and icons.
- **Icons**: Generated `public/icons/icon-192.png` and `public/icons/icon-512.png`.
- **Registration**: Registered in `src/components/PwaRegister.tsx` on window load in production environments.
- **Subtle Indicator**: Displays online/offline network pill in the top header.

---

# Offline Support

### Implemented
- **Cached Application Shell**: Core HTML shell, favicon, manifest, and icons are pre-cached during service worker install.
- **Static Asset Caching**: Next.js static bundles, styles, and images are cached using Stale-While-Revalidate.
- **Offline Shell Availability**: When offline, navigation requests fall back to cached matching pages or the root application shell.
- **Live Network Status**: Real-time browser connectivity detection.

### Not Implemented (By Design — Frontend Only)
- Real CRM database synchronization.
- Cloud data persistence.
- Offline record mutation sync.
- Conflict resolution.

---

# Configuration

- **Path Alias**: `@/*` mapped to `./src/*` in `tsconfig.json`.
- **TypeScript**: Strict mode enabled with React 19 JSX runtime.
- **Next.js**: Version 16.3.4 with Turbopack bundler.
- **ESLint**: ESLint 9 flat configuration with React hooks and TypeScript presets.

---

# Known Issues

- Visual verification via Antigravity browser subagent could not initialize Playwright browser context due to an external environment driver download 404 (`playwright-1.57.0-win32_x64.zip`). All application routes were verified directly via local HTTP requests and Next.js static build checks (all returned HTTP 200).

---

# Lead Section Implementation

### 1. Plan Review & Corrections
- **Codebase Audit**: Evaluated existing mock data in `src/data/mockData.ts`, styling patterns in `src/app/globals.css`, and existing navigation integration in `src/components/AppShell.tsx`.
- **Correction 1 (Dataset Reuse & Avoiding Duplication)**: Verified that `MOCK_PROJECTS` already exists in `src/data/mockData.ts`. Instead of creating any parallel or duplicate property dataset, `LeadForm.tsx` imports and directly reuses `MOCK_PROJECTS` for property and project selection.
- **Correction 2 (Lead Interface Safe Extension)**: Reused the established `Lead` type in `mockData.ts` and extended it with optional fields (`countryCode`, `location`, `projectId`, `projectName`, `interestType`, `followUp`, and `siteVisit`). Preserved full backwards compatibility with Dashboard (`/`) and Sales Pipeline (`/pipeline`).
- **Correction 3 (Balanced Component Architecture)**: Avoided creating an over-fragmented hierarchy of tiny sub-components (no separate input components). Structured the feature cleanly into `src/app/leads/page.tsx` (state coordination & filtering), `src/components/leads/LeadCard.tsx` (card presentation & quick actions), and `src/components/leads/LeadForm.tsx` (mobile sheet / modal form).

### 2. Implemented Features
1. **Lead Directory & Overview**:
   - Header with page title, descriptive subtitle, total leads counter pill (`{leads.length} Total Leads`), and "+ Add Lead" action button.
   - Reactive success toast notification upon adding a new lead.
2. **Real-time Client Search**:
   - Instantly filters leads across: client name, phone number, buyer location, property interest, project name, and acquisition source.
3. **Status Filter Tabs**:
   - Filter pills (`All`, `Hot`, `Warm`, `Cold`, `Qualified`) with active selection styling, matched result counts, and contextual reset buttons.
4. **Mobile Bottom Sheet / Modal Add Lead Form**:
   - **Client Name**: Required text input.
   - **Phone Number**: International-ready country code selector (`+91`, `+1`, `+971`, `+44`, `+65`) + phone number input.
   - **Location**: Buyer city/suburb input (e.g., Whitefield, Bangalore).
   - **Budget Selection**: Real estate budget ranges (`₹50L – ₹75L`, `₹75L – ₹1.2 Cr`, `₹1.2 Cr – ₹2 Cr`, `₹2 Cr – ₹3.5 Cr`, `₹3.5 Cr+`).
   - **Property / Project Selection**: Dropdown populated directly from `MOCK_PROJECTS`.
   - **Property Interest Type**: Options for `Apartment`, `Villa`, `Plot`, `Commercial`, `Office`, and `Retail`.
   - **Lead Temperature / Status**: `Hot`, `Warm`, `Cold`, `Qualified`.
   - **Lead Source**: `Direct Call`, `Meta Ads`, `Google Ads`, `Referral`, `Website Form`, `MagicBricks / 99acres`, `Walk-in`.
   - **Follow-up Required Toggle**: Interactive Yes/No switch revealing Date and Time pickers when enabled.
   - **Schedule Site Visit Toggle**: Interactive Yes/No switch revealing Date and Time pickers when enabled.
5. **Form Submission & State Management**:
   - Clean React `useState` handling in `src/app/leads/page.tsx`. New leads are prepended (`[newLead, ...prev]`) so they appear immediately at the top of the directory.
6. **Lead Card Visual Hierarchy**:
   - Client name, temperature status badge, source tag, and budget.
   - Location pin chip, property type tag, and catalog project reference.
   - Scheduled follow-up and site visit alerts with dedicated icons.
   - One-tap communication: native `tel:` Call button and WhatsApp `wa.me` direct chat button.

### 3. Architecture & Data Reuse Decisions
- **Reuse Priority**: Reused existing CSS design tokens from `globals.css` (modal classes `modal-overlay` and `modal-sheet`, button classes `btn`, `btn-primary`, `btn-secondary`, and badge utilities). Reused SVG icon component `Icon.tsx`.
- **Zero New Dependencies**: Implemented strictly using Next.js 16.3.4, React 19.2.8, TypeScript, and Vanilla CSS. No form, UI, or state management libraries installed.
- **Frontend-Only Scope**: Pure client-side state without backend APIs or persistent databases.

### 4. Files Created, Modified, Removed
- **Created**:
  - `src/components/leads/LeadCard.tsx`: Mobile-first lead card component with visual hierarchy, info chips, and Call / WhatsApp actions.
  - `src/components/leads/LeadForm.tsx`: Mobile bottom sheet / modal with all 8 real estate lead input fields and conditional follow-up / site visit pickers.
- **Modified**:
  - `src/data/mockData.ts`: Extended `Lead` interface with optional location, project reference, interest type, follow-up, and site visit fields. Enriched existing mock leads with realistic real estate sample values.
  - `src/app/leads/page.tsx`: Integrated dynamic state management, search, status filters, card rendering, and form trigger.
- **Removed**:
  - None.

---

# Lead Profile & Advanced Lead Management Phase

### 1. Pre-Implementation Audit & Scope Decisions
- **Audit Findings**:
  - `AppShell.tsx` previously contained a 250+ line "Quick Add Lead" modal with its own isolated state and duplicated fields (`name`, `phone`, `property`, `status`, `notes`).
  - `src/app/leads/page.tsx` contained the full 8-field `LeadForm.tsx`.
  - Having two separate lead creation experiences violated single-responsibility and UX consistency principles.
- **Unified Add Lead Decision**:
  - Completely removed the redundant "Quick Add Lead" form and state from `AppShell.tsx`.
  - Replaced the AppShell center action button (`+`) and bottom navigation "+ Add" with `<Link href="/leads?add=true">`.
  - Standardized all entry points (AppShell desktop button, mobile center navigation, leads page header button, empty directory CTA) to trigger the single, comprehensive `LeadForm.tsx`.
  - Added support for `mode="add"` vs `mode="edit"` with `initialLead` in `LeadForm.tsx` for seamless lead updating without form code duplication.

### 2. Cross-Page State Architecture (Frontend-Only Prototype)
- **Minimal Shared Store Pattern**:
  - Added `getStoredLeads()`, `getLeadById(id)`, `addLeadToStore(lead)`, and `updateLeadInStore(lead)` directly in `src/data/mockData.ts`.
  - Synchronizes across `/leads` and `/leads/[id]` routes using an in-memory module-level cache backed transparently by browser `localStorage` when available on client.
  - Zero heavy third-party state libraries (no Redux, Zustand, MobX, or Recoil).
  - Preserved backward compatibility with Dashboard and Sales Pipeline.

### 3. Dedicated Lead Profile Route (`/leads/[id]`)
- **Route & Layout**: Implemented `src/app/leads/[id]/page.tsx` with dynamic lookup and friendly fallback error card when an ID is not found.
- **Profile Header**:
  - Client name, temperature status badge (`Hot`, `Warm`, `Cold`, `Qualified`), acquisition source, phone number, and location.
  - Quick action bar: Mobile-optimized `Call` (`tel:`), `WhatsApp` (`wa.me`), and `Edit Lead` modal trigger.
- **Lead Assignment & Transfer**:
  - Displays currently assigned broker/advisor (defaults to current user or assigned agent).
  - Transfer Lead modal powered by `MOCK_AGENTS` (`Rohan Verma`, `Priya Nambiar`, `Vikram Malhotra`, `Ananya Iyer`). Updates frontend state and logs an entry to the Lead Activity Timeline.
- **Pipeline Progression Track**:
  - Directly reuses `MOCK_PIPELINE_STAGES` as the single source of truth (`new`, `contacted`, `interested`, `followup`, `sitevisit`, `negotiation`, `converted`).
  - Visual stage tracker with active stage highlight, stage advancement button, and automatic status synchronization.
- **Segmented Workspace Tabs**:
  - `Overview & Timeline`: Property requirement profile, intake details, and chronological activity timeline.
  - `Follow-up & Visits`: Mandatory-rule follow-up scheduling, due alerts, completion notes, history, and site visit booking.
  - `WhatsApp Chat`: Simulated CRM conversation thread with template selector, project cards, and custom offer generation.
  - `Notes & Recordings`: Custom broker notes with author attribution, browser-native call recording file upload and audio playback.
  - `Deal Conversion`: Available when lead is won/converted, showing project, final sale value, and calculated incentive.

### 4. Follow-up Management Rules & In-App Alert
- **Mandatory Creation Requirements**:
  - **Follow-up = YES**: Both `Date` and `Exact Time` are strictly mandatory before submission.
  - **Follow-up = NO**: The broker must provide a documented explanation in "Why is follow-up not required?" (mandatory textarea).
- **Mandatory Completion Rule**:
  - Follow-ups cannot be completed simply by clicking "Complete".
  - Requires submitting an outcome note (e.g. "Client requested callback tomorrow", "Interested in 3BHK", "Budget revised").
  - Logs completion with timestamp into `followUpHistory`.
- **In-App Due Alert & Web Audio Chime**:
  - Monitors scheduled follow-up time while the web application is open and active (lightweight 15-second interval check).
  - Prominently displays `FOLLOW-UP DUE` banner/modal with client name, phone number, scheduled time, and immediate Call/WhatsApp/Note/Reschedule actions.
  - Generates a native dual-tone audio chime using the Web Audio API (`AudioContext` / `OscillatorNode`) without any external audio library.
  - Employs duplicate prevention tracking to ensure an alert triggers once per due event.
  - **Documented Browser Limitation**: Clear notice that browser autoplay policies require prior user interaction to play sound, and web apps cannot run alarms in the background if the tab or browser is closed.

### 5. WhatsApp CRM Communication Interface (Simulated UI)
- **Frontend-Only Scope**: Explicitly labeled as a CRM workflow simulation. No real WhatsApp API, Twilio, or Meta Cloud API integration.
- **Connection State**: Interactive "Connect WhatsApp" simulation toggle displaying connection status badge.
- **Conversation UI**:
  - Client message bubble display and interactive outbound composer.
  - **Send Template**: Template picker reusing `MOCK_WHATSAPP_TEMPLATES` from `src/data/mockData.ts` with dynamic tag substitution (`{{client_name}}`, `{{project_name}}`, `{{location}}`, `{{time}}`).
  - **Send Project**: Reuses `MOCK_PROJECTS` as the single source of truth. Allows broker to attach a rich project card (developer, type, location, price, amenities, status) into the chat.
  - **Send Offer**: Custom offer card creator with Offer Title and Description.

### 6. Call Audio / Recording Upload
- **Native File Upload**: Standard `<input type="file" accept="audio/mp3,audio/wav,audio/m4a">`.
- **Playback**: Standard `<audio controls>` player.
- **Memory Management**: Tracks all created `URL.createObjectURL()` references and cleans them up via `URL.revokeObjectURL()` on component unmount to prevent memory leaks.

### 7. Lead Conversion & Incentive System
- **Mandatory Conversion Fields**:
  - Converting a lead to Won mandates selecting an associated project from `MOCK_PROJECTS`.
  - Mandates a Final Sale Value.
- **Pricing Options**:
  - **Option 1 (Project Price)**: Automatically populates from `project.basePrice` / `project.basePriceFormatted`.
  - **Option 2 (Custom Final Price)**: Allows custom negotiated transaction amounts (discounts, premiums, negotiated values).
- **Project-Specific Incentive Rules (No Universal 2% Assumption)**:
  - Extended `MOCK_PROJECTS` with individual project incentive rules:
    - *Prestige Palm Meadows*: 2.0% percentage incentive.
    - *Godrej Woods*: 2.5% percentage incentive.
    - *Sobha Dream Acres*: 2.0% percentage incentive.
    - *Brigade Tech Gardens*: ₹3,50,000 flat incentive.
  - Dynamically calculates the estimated broker incentive upon entering or selecting the sale price.

### 8. Single Source of Truth & Zero Duplication Audit
- **Projects**: 100% reused from `MOCK_PROJECTS`.
- **Pipeline Stages**: 100% reused from `MOCK_PIPELINE_STAGES`.
- **Agents**: Shared `MOCK_AGENTS` in `mockData.ts`.
- **WhatsApp Templates**: Shared `MOCK_WHATSAPP_TEMPLATES` in `mockData.ts`.
- **Styling**: 100% reused existing `globals.css` design system, CSS variables, and native utility classes. Added `arrow-left` and `edit` SVGs to `Icon.tsx`.
- **Zero New Dependencies**: 0 packages added to `package.json`.

---

# Advanced Project, Product & Real Estate Inventory Management

### 1. Fundamental Domain Architecture: Project ≠ Product Configuration
In real estate domain modelling, a fundamental hierarchy must be maintained:
- **Project (Parent)**: The overall land development, master community, or commercial scheme developed by a builder (e.g., *Prestige Palm Meadows*, *Godrej Woods*, *Green Valley Smart City Plots*). Contains master attributes: Developer, RERA ID, total land parcel acreage, project status, overall location, master amenities, specifications, connectivity, and payment schemes.
- **Product Configuration (Sellable Inventory Unit)**: Specific sellable unit variants inside that development. Examples:
  - *Residential Apartments*: 2 BHK Compact (1,150 sq ft), 3 BHK Luxury (1,850 sq ft), 4 BHK Penthouse (3,200 sq ft).
  - *Plotted Developments*: 100 Sq. Yard Plot, 150 Sq. Yard Plot, 200 Sq. Yard Corner Plot.
  - *Commercial*: Retail Anchor Store (2,500 sq ft), Grade-A Office Suite (5,000 sq ft).
- Each configuration holds its own area, rate per unit area, base price, selling price, and inventory distribution breakdown.

### 2. Comprehensive Data Models (`src/data/mockData.ts`)
- **`ProductConfiguration`**:
  ```typescript
  export interface ProductConfiguration {
    id: string;
    name: string; // e.g. "3 BHK Luxury Suite", "150 Sq. Yard East Facing"
    type: string; // "2 BHK", "3 BHK", "Plot", "Villa", "Retail", "Office"
    description?: string;
    area: number;
    areaUnit: "Sq. Ft." | "Sq. Yard" | "Sq. Meter" | "Acre" | "Hectare";
    minimumArea?: number;
    maximumArea?: number;
    quantity: number; // Total units
    availableQuantity: number;
    bookedQuantity: number;
    blockedQuantity: number;
    soldQuantity: number;
    basePrice: number; // Numeric INR
    marketPrice?: number;
    sellingPrice?: number;
    pricePerUnit?: number; // e.g. ₹6,500 / Sq. Ft.
    status?: "Available" | "Limited Availability" | "Blocked" | "Sold Out";
  }
  ```
- **`ProjectItem`**:
  - Identity: `id`, `name` (Mandatory), `developer` (Mandatory), `developerDescription`, `developerWebsite`, `reraNumber`.
  - Type & Status: `projectType` (`ProjectType`), `projectStatus` (`ProjectStatus`), `shortDescription`, `description`.
  - Location: `location` (Mandatory), `fullAddress`, `city`, `state`, `country`, `pincode`, `landmark`, `googleMapsUrl`.
  - Scale / Dimensions: `totalLandArea`, `landAreaUnit`, `totalInventory`, `totalPhases`, `totalBlocks`, `totalTowers`, `totalFloors`, `totalApartments`, `totalPlots`, `totalVillas`, `totalCommercialUnits`.
  - Configurations: `configurations: ProductConfiguration[]`.
  - Pricing: `startingPrice`, `priceRange`, `basePrice`, `basePriceFormatted`, `marketPrice`, `sellingPrice`, `pricePerSqFt`, `pricePerSqYard`, `additionalCharges: ProjectAdditionalCharge[]`, `discounts: ProjectDiscount[]`.
  - Payment Plans: `paymentPlans: ProjectPaymentPlan[]` (Down Payment, Construction Linked, Possession Linked, Custom) with milestone schedules.
  - Features: `amenities: string[]`, `highlights: string[]`, `specifications: ProjectSpecification[]`, `connectivity: ProjectConnectivity[]`.
  - Legacy Compatibility: `availableUnits`, `status`, `type`, `incentive: ProjectIncentive`.

### 3. Single Source of Truth & Project Store Architecture
To avoid fragmented or duplicate data across the CRM, all modules read from and write to a single centralized project store:
- **Central Store Location**: `src/data/mockData.ts`
- **Storage Layer**: In-memory dataset (`MOCK_PROJECTS`) combined with persistent browser storage (`localStorage` key: `"sahyak_crm_projects_v1"`).
- **Core Store Helpers**:
  - `getStoredProjects(): ProjectItem[]`: Retrieves active project catalog with automatic fallback to initial seed projects.
  - `getProjectById(id: string): ProjectItem | undefined`: Looks up single project by ID.
  - `saveStoredProjects(projects: ProjectItem[]): void`: Serializes and persists project list.
  - `addProjectToStore(newProject: ProjectItem): ProjectItem[]`: Prepend/inserts new project, syncs storage, returns updated list.
  - `updateProjectInStore(updatedProject: ProjectItem): ProjectItem[]`: Updates existing project by ID in-place and persists.
  - `deleteProjectFromStore(id: string): ProjectItem[]`: Removes project from store.

### 4. Dynamic Project Type Adaptation
Forms and detail pages adapt dynamically to the selected `ProjectType`:
- **Residential Apartment / Independent Floor**: Displays Towers, Floor Elevation, and Total Residential Apartments fields.
- **Plotted Development**: Adapts scale inputs to Sanctioned Plots and default unit measures to `Sq. Yard`.
- **Villa / Gated Community**: Adapts scale inputs to Total Gated Villas.
- **Commercial / Retail / Office / Warehouse**: Adapts scale inputs to Total Commercial / Retail Suites.

### 5. Strict Inventory Validation Rules
- **Rule**: For every configuration, the sum of constituent inventory allocations must never exceed the total quantity:
  $$\text{availableQuantity} + \text{bookedQuantity} + \text{blockedQuantity} + \text{soldQuantity} \le \text{quantity}$$
- **Form Enforcement**: `ProjectForm.tsx` blocks submission and displays an explicit contextual error message if any configuration violates this condition.
- **Health Indicators**: `ProjectDetail.tsx` visually renders inventory health progress bars:
  - Green: Available units percentage
  - Amber: Booked units percentage
  - Red: Sold units percentage

### 6. Real Estate Pricing Architecture
- **Multi-Level Pricing**:
  - Project level: Starting price label, formatted range display (`₹75 L – ₹1.3 Cr`), base numeric price, market benchmark comparison.
  - Configuration level: Area × Rate Per Unit (`pricePerUnit`), with support for manual base/selling price overrides.
  - Additional Charges: PLC (Preferential Location Charges), Covered Parking, Clubhouse Membership, Maintenance deposits.
  - Brokerage Commission: Project-specific incentive rules (`percentage` or `fixed` flat rupee value).
- **Safe Fallbacks**: Formatted currency helper `formatCurrency()` guards against `NaN` or undefined prices across all modals and cards.

### 7. Payment Plans & Milestone Schedules
- Supports 4 real estate financing structures:
  - **Construction Linked Plan (CLP)**: Milestone-based payments tied to structural progress (e.g. Booking 10%, Foundation 20%, Plinth 20%, Structure 30%, Possession 20%).
  - **Down Payment Plan**: Upfront payment discount structure.
  - **Possession Linked Plan (PLP)**: Deferred payment tied to handover.
  - **Custom Plan**: Broker-defined milestone percentages and stages.

### 8. CRM-Wide Integration Audit
Every module referencing real estate projects was audited and refactored to consume the centralized project store:
1. **Products Directory (`src/app/products/page.tsx`)**:
   - Lists all projects from `getStoredProjects()`.
   - Real-time search by project name, developer, locality, or configuration name.
   - Filter pills for Property Types and Construction Statuses.
   - Triggers `ProjectForm` modal for both creating new projects and editing existing projects.
2. **Project Detail Page (`src/app/products/[id]/page.tsx` & `ProjectDetail.tsx`)**:
   - Comprehensive dedicated workspace with 6 tabs (Overview & Specs, Configurations, Pricing & Plans, Inventory Health, Amenities, Brochures & Documents).
   - In-place project editing and brochure sharing.
3. **Unified Lead Form (`src/components/leads/LeadForm.tsx`)**:
   - Project catalog dropdown dynamically populated via `getStoredProjects()`.
   - Creating or editing projects in `/products` immediately reflects in lead interest options.
4. **Lead Profile & Site Visits (`src/components/leads/LeadProfile.tsx`)**:
   - Site visit booking dialog selects from the central project store.
5. **WhatsApp CRM Simulation (`src/components/leads/WhatsAppSection.tsx`)**:
   - "+ Send Project" modal lists projects from the central store with rich cards displaying developer, unit types, and inventory.
6. **Deal Conversion & Incentive Calculation (`src/components/leads/ConvertLeadModal.tsx`)**:
   - Allows selecting project and specific unit configuration.
   - Auto-populates transaction value based on configuration price, project base price, or custom price.
   - Computes broker incentive dynamically using project-specific incentive rules.

---

## Change: Profile & CRM Customization, Media Management, Packages & WhatsApp System Phase
- **What changed**:
  - Implemented `src/utils/mediaService.ts`: Real file type verification (images, MP4/WEBP videos, PDFs), file size limits (10MB image, 50MB video, 15MB PDF), security blocking of executable extensions, HTML5 Canvas proportional downscaling & image compression (max 1600px, 0.78 quality), and localStorage metadata catalog (`sahyak_crm_media_meta_v1`).
  - Created `src/components/common/ClientBrochureModal.tsx`: Generates client-facing luxury presentation documents for Projects and Packages with native `@media print` styling, company letterhead, RERA registration, configuration pricing matrix, amenities, and 1-click WhatsApp brochure sharing. Synchronous validation prevents render cascading warnings.
  - Implemented Curated Packages module: `PackageCard.tsx`, `PackageFormModal.tsx`, integrated into `/products` and `/settings`. Entities reference parent project IDs, preventing duplicate datasets, and auto-calculate savings amount and percentage.
  - Implemented Lead Form Fields Customization: Protected system fields (`isSystem: true`) prevent breaking critical CRM logic. Custom fields are editable, togglable, orderable, and dynamically rendered in `LeadForm.tsx`, saving to `lead.customFields`.
  - Implemented Pipeline Stage Management: Dynamic Kanban board in `/pipeline` reading from `getStoredPipelineStages()`. Settings manager allows adding, renaming, reordering, and safely deleting stages (prohibits deleting stages with active leads to prevent orphaned records).
  - Implemented WhatsApp Connection & Template Architecture:
    - Desktop QR flow with simulated WebSocket state machine.
    - Mobile 8-character pairing code flow with international dialing codes and E.164 normalization.
    - Enterprise Meta WhatsApp Cloud API credentials configuration panel.
    - Reusable template system referencing projects and packages with dynamic variable substitution (`{client_name}`, `{project_name}`, `{location}`).
  - Refactored `/settings` into a 6-tab control center (Broker Profile, Lead Fields, Pipeline, Packages, WhatsApp, Media & Storage).
  - Extended `src/components/Icon.tsx` with `"sliders"`, `"upload-cloud"`, `"printer"`, `"copy"`, `"briefcase"`.
- **Why**: Deliver business-level CRM customization, secure media handling, reusable templates, multi-device WhatsApp pairing, and luxury client-facing brochures without external dependencies.
- **Files affected**:
  - `src/utils/mediaService.ts`
  - `src/components/common/ClientBrochureModal.tsx`
  - `src/components/packages/PackageCard.tsx`
  - `src/components/packages/PackageFormModal.tsx`
  - `src/app/settings/page.tsx`
  - `src/app/pipeline/page.tsx`
  - `src/app/whatsapp/page.tsx`
  - `src/app/products/page.tsx`
  - `src/components/leads/LeadForm.tsx`
  - `src/components/leads/WhatsAppSection.tsx`
  - `src/components/Icon.tsx`
  - `src/data/mockData.ts`
  - `SAHYAK_PROJECT.md`
  - `walkthrough.md`
- **Verification**:
  - `node ./node_modules/eslint/bin/eslint.js .`: Passed with 0 errors and 0 warnings.
  - `node ./node_modules/next/dist/bin/next build`: Passed with exit code 0. All 16 routes prerendered and dynamic routes generated cleanly.

## Change: Advanced Project, Product & Real Estate Inventory Management Phase
- **What changed**:
  - Transformed `/products` from simple static cards into a comprehensive real estate Project & Inventory Management workspace with multi-field search, type & status filters, and Add Project modal.
  - Created dynamic route `src/app/products/[id]/page.tsx` and modular workspace `src/components/products/ProjectDetail.tsx` featuring 6 dedicated CRM tabs (Overview, Configurations, Pricing, Inventory Health, Amenities, Brochures).
  - Created `src/components/products/ProjectForm.tsx` supporting 8 accordion sections, dynamic project-type adaptation, multi-configuration builder, strict inventory validation, pricing calculation, additional charges, payment plans, multi-select amenities, specifications, and connectivity.
  - Extended `src/data/mockData.ts` with real-estate domain types (`ProductConfiguration`, `ProjectType`, `ProjectStatus`, `ProjectAdditionalCharge`, `ProjectMilestone`, `ProjectPaymentPlan`, `ProjectSpecification`, `ProjectConnectivity`), enriched existing projects, added Plotted Development seed project, and implemented central project store helpers (`getStoredProjects`, `getProjectById`, `saveStoredProjects`, `addProjectToStore`, `updateProjectInStore`, `deleteProjectFromStore`).
  - Audited and updated CRM modules (`LeadForm.tsx`, `ConvertLeadModal.tsx`, `WhatsAppSection.tsx`, `LeadProfile.tsx`) to consume the centralized project store, eliminating duplicate project datasets and enabling configuration-level deal conversion.
  - Added `"trash"` and `"file-text"` SVG icons to `src/components/Icon.tsx`.
- **Why**: Implement a scalable, real-estate-focused Project, Product Configuration, Pricing, and Inventory Management system adhering strictly to the `Project ≠ Product Configuration` domain hierarchy with zero external libraries.
- **Files affected**:
  - `src/data/mockData.ts`
  - `src/components/Icon.tsx`
  - `src/components/products/ProjectForm.tsx`
  - `src/components/products/ProjectDetail.tsx`
  - `src/app/products/page.tsx`
  - `src/app/products/[id]/page.tsx`
  - `src/components/leads/LeadForm.tsx`
  - `src/components/leads/ConvertLeadModal.tsx`
  - `src/components/leads/WhatsAppSection.tsx`
  - `src/components/leads/LeadProfile.tsx`
  - `SAHYAK_PROJECT.md`
- **Verification**:
  - `node ./node_modules/eslint/bin/eslint.js .`: Passed with 0 errors and 0 warnings.
  - `node ./node_modules/next/dist/bin/next build`: Passed with exit code 0. Compiled successfully in Turbopack, 16 static routes + dynamic routes `/products/[id]` and `/leads/[id]` generated cleanly.
  - Verification of strict inventory validation: Mismatch prevents submission and displays error banner.

## Change: Lead Profile & Advanced Lead Management Phase
- **What changed**:
  - Removed duplicate "Quick Add Lead" form and state from `src/components/AppShell.tsx` (over 250 lines of duplicate code removed). Unified all creation triggers to navigate to `/leads?add=true`.

  - Enhanced `src/components/leads/LeadForm.tsx` to support both `mode="add"` and `mode="edit"` with initial values. Enforced mandatory Date+Time for Follow-up YES, and mandatory reason for Follow-up NO.
  - Created dynamic route `src/app/leads/[id]/page.tsx` and modular profile workspace `src/components/leads/LeadProfile.tsx`.
  - Created `src/components/leads/FollowUpSection.tsx` with strict scheduling validation, mandatory completion notes, history logging, and in-app due alert with Web Audio chime.
  - Created `src/components/leads/WhatsAppSection.tsx` with simulated conversation UI, template insertion, project sharing (`MOCK_PROJECTS`), and custom offer card creation.
  - Created `src/components/leads/ConvertLeadModal.tsx` with mandatory project selection, project price vs custom price, and dynamic calculation based on project-specific incentive rules.
  - Extended `src/data/mockData.ts` with `basePrice` and `incentive` configurations on `MOCK_PROJECTS`, `MOCK_AGENTS`, `MOCK_WHATSAPP_TEMPLATES`, and lightweight client-side store synchronization (`getStoredLeads`, `getLeadById`, `addLeadToStore`, `updateLeadInStore`).
  - Added `"arrow-left"` and `"edit"` SVGs to `src/components/Icon.tsx`.
- **Why**: Implement comprehensive Lead Profile workspace, enforce strict real estate CRM follow-up rules, unify lead entry, and support project-linked deal conversion with incentive calculation.
- **Files affected**:
  - `src/components/AppShell.tsx`
  - `src/components/Icon.tsx`
  - `src/data/mockData.ts`
  - `src/app/leads/page.tsx`
  - `src/app/leads/[id]/page.tsx`
  - `src/components/leads/LeadCard.tsx`
  - `src/components/leads/LeadForm.tsx`
  - `src/components/leads/LeadProfile.tsx`
  - `src/components/leads/FollowUpSection.tsx`
  - `src/components/leads/WhatsAppSection.tsx`
  - `src/components/leads/ConvertLeadModal.tsx`
  - `src/app/whatsapp/page.tsx`
  - `SAHYAK_PROJECT.md`
- **Verification**:
  - `npm run lint` (`eslint .`): Passed with 0 errors and 0 warnings.
  - `npm run build` (`next build`): Production build succeeded with Turbopack (all 16 routes prerendered, dynamic `/leads/[id]` verified).
  - HTTP checks: `/leads` and `/leads/lead-1` both verified with HTTP status 200 and full content rendering.

## Change: Lead Section Implementation Phase
- **What changed**:
  - Safely extended `Lead` interface in `src/data/mockData.ts` with optional real estate properties (`countryCode`, `location`, `projectId`, `projectName`, `interestType`, `followUp`, `siteVisit`).
  - Created `src/components/leads/LeadCard.tsx` providing responsive lead display, status badges, budget tags, follow-up/site-visit highlights, and direct Call / WhatsApp buttons.
  - Created `src/components/leads/LeadForm.tsx` providing mobile-first modal dialog with 8 required real estate lead inputs and interactive Yes/No toggles for follow-up and site visit scheduling. Reused `MOCK_PROJECTS` from `mockData.ts`.
  - Refactored `src/app/leads/page.tsx` with reactive `leads` state, multi-field search, status filter pills, dynamic count badges, and empty state reset.
- **Why**: Implement a complete, mobile-first Lead Management section tailored for solo real estate professionals with zero external libraries.
- **Files affected**:
  - `src/data/mockData.ts`
  - `src/app/leads/page.tsx`
  - `src/components/leads/LeadCard.tsx`
  - `src/components/leads/LeadForm.tsx`
  - `SAHYAK_PROJECT.md`
- **Verification**:
  - `npm run lint`: Passed with 0 errors and 0 warnings.
  - `npm run build`: Production build succeeded with Turbopack (16 static routes prerendered).
  - HTTP checks: `/leads` verified returning HTTP 200 with dynamic lead list and modal elements.

## Change: Frontend Foundation Phase Implementation
- **What changed**:
  - Established shared design system and tokens in `src/app/globals.css`.
  - Created realistic real estate mock datasets in `src/data/mockData.ts`.
  - Built zero-dependency SVG icon system in `src/components/Icon.tsx`.
  - Implemented responsive `AppShell.tsx` (desktop sidebar, mobile bottom navigation, Quick Add modal).
  - Built PWA manifest (`src/app/manifest.ts`), icons (`public/icons/`), service worker (`public/sw.js`), and registration component (`src/components/PwaRegister.tsx`).
  - Implemented all 12 overview screens: Dashboard, Leads, Pipeline, Follow-ups, Site Visits, WhatsApp, Groups, Products & Projects, Sales Analytics, Integrations, Profile & Settings, More.
  - Wrapped `layout.tsx` with `AppShell` and viewport meta tags.
- **Why**: Establish complete frontend UI architecture, navigation, and mobile-first experience for SAHYAK CRM.
- **Files affected**:
  - `src/app/globals.css`
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/app/manifest.ts`
  - `src/app/leads/page.tsx`
  - `src/app/pipeline/page.tsx`
  - `src/app/follow-ups/page.tsx`
  - `src/app/site-visits/page.tsx`
  - `src/app/whatsapp/page.tsx`
  - `src/app/groups/page.tsx`
  - `src/app/products/page.tsx`
  - `src/app/analytics/page.tsx`
  - `src/app/integrations/page.tsx`
  - `src/app/settings/page.tsx`
  - `src/app/more/page.tsx`
  - `src/components/AppShell.tsx`
  - `src/components/Icon.tsx`
  - `src/components/PwaRegister.tsx`
  - `src/data/mockData.ts`
  - `public/sw.js`
  - `public/icons/icon-192.png`
  - `public/icons/icon-512.png`
  - `SAHYAK_PROJECT.md`
- **Verification**:
  - `npm run lint`: Passed with 0 errors and 0 warnings.
  - `npm run build`: Production build succeeded with Turbopack (16 static routes prerendered).
  - HTTP checks: All 14 endpoints verified with HTTP status 200.

---

## Change: Strict Requirement Audit & Minimal Frontend Correction Phase
- **What changed**:
  1. **Requirement A (Unified Products & Removal of Packages Split)**: Completely removed the artificial Products vs. Packages split. Deleted `PackageCard.tsx`, `PackageFormModal.tsx`, `PackageItem` model, `MOCK_PACKAGES`, package storage accessors (`getStoredPackages`, etc.), and package tabs. Unified `/products` into a clean Products & Projects inventory catalog.
  2. **Requirement B (Settings Scope Correction)**: Stripped out unrelated tabs (Pipeline, Packages, WhatsApp, Media) from `/settings`. Reduced `/settings` to two focused tabs: Broker Profile branding and Lead Form Fields Configuration.
  3. **Requirement C & D (WhatsApp Templates in WhatsApp Section & 5 Default Real Estate Templates)**: Re-anchored WhatsApp template management in `/whatsapp`. Seeded 5 realistic, professional ready-made real estate templates (`Initial Lead Response`, `Project Information & Verified Brochure`, `Post-Discussion Follow-up`, `Site Visit Confirmation`, `Special Festival Benefit`).
  4. **Requirement E, F, G, H (Named Attachments Owned by Templates)**: Each template directly owns its attachments (`TemplateAttachment[]`). Every uploaded item requires a mandatory user-defined name (e.g., "Prestige Palm Meadows Master Elevation") along with its type (Image, Video, PDF) and size. Templates display their attachments in creation, editing, template gallery, simulated chat bubbles, and lead profile WhatsApp sharing.
  5. **Requirement I (Simplified Media Validation)**: Removed unnecessary separate global media management system; retained client-side file size and format validation (10MB image, 50MB video, 15MB PDF) and HTML5 Canvas compression strictly for template attachments.
  6. **Requirement J, K, L (Follow-up Mandatory Reasons)**: Enforced strict validation:
     - Rescheduling an active follow-up strictly requires New Date, New Time, and a mandatory Reason for Rescheduling (`<textarea required>`).
     - Closing / Cancelling an active follow-up strictly requires a mandatory Reason / Note (`<textarea required>`).
     - Added Close / Cancel Follow-up actions and modal to both Lead Profile (`FollowUpSection.tsx`) and global schedule (`/follow-ups/page.tsx`).
  7. **Zero Dead Code**: Traced and completely deleted all orphaned package and media library references across the entire codebase.
- **Why**: Strictly align the codebase with core user requirements, eliminate over-engineered systems, prevent artificial domain splits, and enforce CRM follow-up data integrity.
- **Files affected**:
  - `src/data/mockData.ts` (Modified)
  - `src/utils/mediaService.ts` (Modified)
  - `src/components/common/ClientBrochureModal.tsx` (Modified)
  - `src/components/Icon.tsx` (Modified)
  - `src/components/leads/WhatsAppSection.tsx` (Modified)
  - `src/components/leads/FollowUpSection.tsx` (Modified)
  - `src/app/products/page.tsx` (Modified)
  - `src/app/settings/page.tsx` (Modified)
  - `src/app/whatsapp/page.tsx` (Modified)
  - `src/app/follow-ups/page.tsx` (Modified)
  - `src/components/packages/PackageCard.tsx` (Deleted)
  - `src/components/packages/PackageFormModal.tsx` (Deleted)
  - `SAHYAK_PROJECT.md` (Modified)
- **Verification**:
  - `node ./node_modules/eslint/bin/eslint.js .`: Exited with code 0 (Errors: 0, Warnings: 0).
  - `node ./node_modules/next/dist/bin/next build`: Exited with code 0. Compiled successfully with Turbopack, 16 static routes + dynamic routes generated cleanly.

---

# Last Audit

- **Date / Stage**: Strict Audit + Project Form Editing + Mobile UI Refinement Phase
- **What was audited**:
  1. Project Form Add vs. Edit flow: Investigated why projects could not be edited properly after creation. Found `ProjectForm.tsx` constructed `projectPayload` without spreading `currentProject`, losing `coverImage`, `images`, `brochureUrl`, `priceListUrl`, and `discounts`. Found missing inputs for cover image and brochure URL.
  2. Single Form Architecture: Verified that `ProjectForm` supports both `mode="add"` and `mode="edit"`, accepting both `initialProject` and `project` props without duplicate forms.
  3. Packages cleanup audit: Ran recursive codebase checks across all `.ts` and `.tsx` files in `src/`. Confirmed 0 package models, 0 package components, 0 package imports, and 0 package references remain.
  4. Mobile UI Audit (320px–412px): Audited tabs, cards, and modal forms across `/products`, `/settings`, `/whatsapp`, `/follow-ups`, `/site-visits`, and `LeadProfile.tsx`.
- **Problems found**:
  1. `ProjectForm.tsx` payload omitted `...(initialProject || {})`, silently discarding media links, brochures, discounts, and custom properties during project edits.
  2. `ProjectForm.tsx` lacked dedicated form controls for Project Cover Image (`coverImage`), Country (`country`), and Official Digital Brochure URL (`brochureUrl`).
  3. Heavy, boxy tab styling with high-contrast saturated primary buttons overwhelmed screens in `/settings`, `/whatsapp`, `/follow-ups`, `/site-visits`, and `ProjectForm.tsx`.
  4. Long tab label "Lead Form Fields Configuration" wrapped awkwardly on mobile viewports (<390px).
  5. `gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))"` in `/products` and `/whatsapp` caused horizontal overflow on 320px screens.
- **Problems fixed**:
  1. Fixed `ProjectForm.tsx`: Preloads all project attributes cleanly. Spreads `...(currentProject || {})` in `handleSubmit` and preserves existing project ID in edit mode, ensuring `updateProjectInStore` updates in-place without duplicating projects.
  2. Added inputs for `coverImage` (with live preview) in Step 1, `country` in Step 2, and `brochureUrl` in Step 7.
  3. Re-engineered tabs across `/settings`, `/whatsapp`, `/follow-ups`, `/site-visits`, `LeadProfile.tsx`, `ProjectDetail.tsx`, and `ProjectForm.tsx` into lightweight, modern segmented controls with subtle elevation and border states.
  4. Shortened settings tab label to "Lead Form Fields" to ensure zero text wrapping on mobile.
  5. Updated catalog and template grids to `minmax(min(100%, 300px), 1fr)` to eliminate horizontal scrolling on mobile viewports down to 320px.
- **Verification**:
  - `node ./node_modules/eslint/bin/eslint.js .`: Exited with code 0 (Errors: 0, Warnings: 0).
  - `node ./node_modules/next/dist/bin/next build`: Exited with code 0. Production build compiled cleanly with Turbopack, 16 static routes + dynamic routes generated.
  - Zero package code residue in codebase. Single-form architecture preserved. Domain principle `Project ≠ Product Configuration` strictly maintained.

---

# Lead Import, Smart Mapping & Export Architecture

## 1. Overview

SAHYAK CRM includes a production-grade, client-side **Lead Import + Lead Export + Analytics Export system** built on `xlsx@0.18.5` (SheetJS Community Edition). The system adheres strictly to the frontend-only, mobile-first design system with zero external API dependencies, zero fake AI claims, and full respect for browser storage limits.

---

## 2. Smart Lead Import Engine (`src/utils/leadImport.ts`)

- **Supported Formats**: `.csv`, `.xlsx`, `.xls` (with multi-sheet Excel workbook detection and interactive sheet switching).
- **Header Normalization**: Strips punctuation, hyphens, underscores, extra spaces, and normalizes casing while preserving original column labels for visual preview.
- **Deterministic Smart Mapping ("AI-Assisted Mapping")**:
  - Compares normalized spreadsheet headers against a weighted synonym dictionary for all 10 system fields:
    - `name`: "Full Name", "Client Name", "Customer Name", "Lead Name", "Prospect Name", "Buyer"
    - `phone`: "Mobile", "Mobile Number", "Phone Number", "Contact", "WhatsApp", "Cell"
    - `email`: "Email Address", "Mail", "E-mail"
    - `propertyInterest`: "Project", "Interested Project", "Requirement", "Property"
    - `budget`: "Price Range", "Investment", "Budget Range", "Max Price"
    - `status`: "Lead Status", "Stage", "Disposition", "State"
    - `source`: "Lead Source", "Channel", "Platform", "UTM Source", "Campaign", "Ad Set"
    - `location`: "City", "Preferred Location", "Town", "Region", "Address"
    - `assignedTo`: "Advisor", "Agent", "Sales Rep", "Owner", "Executive"
    - `notes`: "Remarks", "Comments", "Description", "Feedback"
  - Dynamically includes all active custom fields from `getStoredLeadFieldConfigs()`.
  - Assigns confidence tiers: `High Confidence` (exact match), `Medium Confidence` (substring/synonym match), or `No Match`.
  - Transparent user override: The user can modify any column's destination or map unmapped columns to `Notes` or active custom fields.
- **Mapping Templates**:
  - Saved in localStorage key: `sahyak_crm_import_mappings_v1`.
  - Supports saving custom column-to-field configurations (e.g. "Meta Lead Ads Export", "Website Leads").
  - Auto-suggests and matches saved templates upon file upload.
- **Sanitization & Validation**:
  - Phone numbers: Safely parses string or Excel numeric formats, detects scientific notation, removes formatting characters while preserving international `+` prefixes, and extracts normalized digits for matching.
  - Emails: Validates standard regex pattern `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
  - Required fields: Name and Phone are strictly mandatory. Missing values trigger an `Invalid` row status.
  - Row categorization: `Ready`, `Needs Attention`, `Duplicate`, and `Invalid`.
- **Two-Tier Duplicate Detection**:
  - Matches against **Existing CRM Leads** (`getStoredLeads()`).
  - Matches against **Other rows in the same uploaded file**.
  - Priority 1: Normalized phone digits.
  - Priority 2: Normalized email address.
  - Strategy selector: `Skip Duplicates` (default) vs. `Import Duplicates Anyway`.
- **Safe Batch Insertion (`addBatchLeadsToStore`)**:
  - Performs a single read-merge-write to `localStorage` key `sahyak_crm_leads_v1`, avoiding serial browser write stalls.
  - Chunks UI progress (100–250 leads per progress tick) to keep mobile rendering responsive.
  - Generates immutable unique IDs (`lead_timestamp_random`) and tags leads with `importBatchId` and `importedAt`.
- **Browser Storage Safeguards**:
  - Displays a transparent browser storage notice warning that imports reside in `localStorage`.
- **Error Reporting**:
  - Generates downloadable CSV error report containing original row number, raw data, import status, and specific failure/skip reasons.

---

## 3. Lead Export System (`src/utils/leadExport.ts` & `ExportLeadsModal.tsx`)

- **Supported Formats**: Excel (`.xlsx`) and CSV (`.csv`).
- **Export Scope**:
  - `Current Filtered Leads`: Exports the exact filtered subset matching active search terms and status filters.
  - `All Leads`: Exports the entire lead database.
- **Field Selection**:
  - Interactive checklist supporting all standard CRM attributes: Client Name, Phone, Email, Property Interest, Budget, Status, Source, Location, Assigned Advisor, Pipeline Stage, Created Date, Property Type, Follow-up Schedule, and Site Visit Schedule.
  - Dynamically includes all active custom fields from `getStoredLeadFieldConfigs()`.
  - Actions: `Select All` and `Clear Optional`.
- **Date-Stamped Filenames**: `sahyak-leads-YYYY-MM-DD.xlsx` or `sahyak-filtered-leads-YYYY-MM-DD.csv`.

---

## 4. Shared Analytics Engine & Export (`src/utils/analyticsData.ts` & `src/utils/analyticsExport.ts`)

- **Single Source of Truth**:
  - `calculateAnalytics(leads, dateRange)` provides identical metrics to both the visible Analytics UI (`/analytics`) and the Export engine, guaranteeing 100% calculation parity.
  - Supported date ranges: `Today`, `This Week`, `This Month`, and `All Time`.
  - Calculations include: Average closing cycle, visit-to-deal conversion ratio, commission value won, lead sources breakdown (counts, percentage shares, chart colors), conversion funnel stages and drop-offs, and filtered lead records.
- **Excel Multi-Sheet Export (`.xlsx`)**:
  - Sheet 1: `Executive Summary` (KPIs, deal counts, closing velocity, commission values).
  - Sheet 2: `Lead Sources` (Source names, inquiry counts, percentage shares).
  - Sheet 3: `Conversion Funnel` (Funnel stages, lead counts, drop-off retention rates).
  - Sheet 4: `Raw Leads Data` (Full table of leads included in the active period).
- **CSV Export (`.csv`)**:
  - Dataset selector: Executive Summary KPIs, Lead Sources Performance, Conversion Funnel Stages, or Raw Leads Data.

---

## 5. Storage Keys Reference

| Key | Purpose |
| --- | --- |
| `sahyak_crm_leads_v1` | Core lead records (extended with `email?`, `importBatchId?`, `importedAt?`, `assignedToUserId?`, `assignedTeamId?`) |
| `sahyak_crm_import_mappings_v1` | Reusable smart column mapping templates |
| `sahyak_lead_field_configs_v1` | System and custom lead field definitions |

---

# Team & Multi-User Architecture

## 1. Architectural Philosophy: 100% Company-Defined Structure

SAHYAK CRM does **NOT** hardcode or enforce predefined corporate hierarchies or fixed role titles such as "Super Admin", "Admin", "Manager", "Sales Manager", "Sales Executive", or "Viewer". Real estate brokerages and developer firms vary widely in their internal structure:

- One brokerage may employ: *Founder*, *Sales Head*, *Team Leader*, *Property Consultant*, *Telecaller*.
- Another firm may use: *CEO*, *Closing Manager*, *Relationship Manager*, *Lead Qualifier*.
- A lean agency may operate with a completely flat structure with zero manager hierarchy.

SAHYAK's architecture is completely **flexible and company-defined**:
1. **Teams**: Created with custom names, descriptions, optional team leads (managers are never mandatory), and assigned members.
2. **Designations / Roles**: Act purely as **reusable permission templates**. Companies name them whatever they wish and assign any arbitrary combination of granular permissions.
3. **Users / Members**: Belong to an organization, are assigned to a team and a designation, can have their status toggled (active/inactive for historical referential integrity), and can have individual permission overrides and custom incentive plans.
4. **Individual Permission Overrides**: Any individual user can be granted additional permissions or have inherited designation permissions revoked.
5. **Effective Permissions Calculation**:
   $$\text{Effective Permissions} = (\text{Base Designation Permissions} \setminus \text{Revoked Overrides}) \cup \text{Granted Overrides}$$
6. **Incentive Structures**: Decoupled from designations; companies create reusable incentive plans (Fixed amount, % of deal value, % of brokerage, Slabs, Targets, Custom) and assign them to users with effective dates.
7. **Performance & Activity Tracking**: Computes live KPIs (leads, follow-ups, visits, deals won, value, estimated commission) and distinguishes normal business activities from sensitive audit events.

```
Organization / Company (Workspace Context)
├── Teams (Custom Name, Optional Lead, Members)
├── Custom Designations / Roles (Reusable Permission Templates)
│   └── 14 Granular Permission Categories (40+ Actions)
├── Users / Team Members
│   ├── Profile (Name, Email, Phone, Title, Avatar)
│   ├── Team Assignment (teamId)
│   ├── Designation Assignment (designationId)
│   ├── Individual Permission Overrides (Grant / Revoke)
│   ├── Incentive Assignments (Plan ID, Custom Overrides, Effective Dates)
│   └── Status (Active / Inactive - No Hard Deletes)
├── Performance Tracking (User & Team Level Conversion, Velocity, Incentives)
├── Activity Logging (Business Operations)
└── Audit Logging (Sensitive Permission, Team, Role, & Status Mutations)
```

---

## 2. Granular Permission Registry (`src/config/permissions.ts`)

Permissions are granular, self-documenting identifiers categorized across 14 functional CRM modules:

| Category | Category Name | Granular Permission IDs | Description |
| --- | --- | --- | --- |
| 1 | `DASHBOARD` | `dashboard.view`, `dashboard.export` | View overview KPIs, conversion metrics, and export executive reports |
| 2 | `LEADS` | `leads.view_own`, `leads.view_team`, `leads.view_all`, `leads.create`, `leads.edit_own`, `leads.edit_all`, `leads.delete`, `leads.assign`, `leads.import`, `leads.export` | Comprehensive lead lifecycle, ownership boundaries, bulk import/export |
| 3 | `PIPELINE` | `pipeline.view_own`, `pipeline.view_team`, `pipeline.view_all`, `pipeline.edit_stages`, `pipeline.move_deals` | Kanban board visibility, stage progression, deal movements |
| 4 | `PROJECTS & PRODUCTS` | `projects.view`, `projects.create`, `projects.edit`, `projects.delete` | Real estate inventory, project creation, unit availability |
| 5 | `FOLLOW-UPS` | `followups.view_own`, `followups.view_all`, `followups.manage` | Client calls, meetings, reminders, task completions |
| 6 | `SITE VISITS` | `site_visits.view_own`, `site_visits.view_all`, `site_visits.schedule`, `site_visits.conduct` | Property walkthroughs, visit feedback, cab arrangements |
| 7 | `WHATSAPP` | `whatsapp.send`, `whatsapp.templates_view`, `whatsapp.templates_manage`, `whatsapp.broadcast` | Direct messaging, brochure sharing, template configuration |
| 8 | `ANALYTICS` | `analytics.view_basic`, `analytics.view_advanced`, `analytics.export` | Performance insights, closing cycles, multi-sheet export |
| 9 | `GROUPS` | `groups.view`, `groups.manage` | Buyer groups, broadcast segmentation |
| 10 | `INTEGRATIONS` | `integrations.view`, `integrations.manage` | Meta Ads, Google Ads, Webhook endpoints |
| 11 | `TEAM MANAGEMENT` | `team.members_view`, `team.members_manage`, `team.teams_manage`, `team.designations_manage`, `team.permissions_override` | Team setup, member invitations, custom designation editing |
| 12 | `SETTINGS` | `settings.view`, `settings.manage` | Company details, lead field configurations, pipeline stages |
| 13 | `DATA IMPORT & EXPORT`| `data.import`, `data.export` | Global CSV/Excel imports and batch exports |
| 14 | `BILLING & PLAN` | `billing.view`, `billing.manage` | Workspace subscription, invoices (future-ready tiering) |

---

## 3. Data Models & Entity Relationships (`src/data/teamData.ts`)

All entities use stable string IDs and foreign keys to prepare for future relational database migration:

### User
```typescript
interface User {
  id: string;                      // e.g. "user_rohan"
  organizationId: string;          // e.g. "org_sahyak_main"
  name: string;
  email: string;
  phone: string;
  avatarInitials: string;
  designationId: string;           // Foreign key -> DesignationRole.id
  jobTitle: string;                // Free-text display title chosen by company
  teamId?: string;                 // Foreign key -> Team.id
  status: "active" | "inactive";   // Historical records preserved upon deactivation
  joiningDate: string;             // ISO string
  createdAt: string;
  updatedAt: string;
}
```

### Team
```typescript
interface Team {
  id: string;                      // e.g. "team_luxury"
  organizationId: string;
  name: string;                    // e.g. "Luxury Residential Specialists"
  description: string;
  teamLeadUserId?: string;         // Optional! Managers are never enforced
  createdAt: string;
  updatedAt: string;
}
```

### DesignationRole (Reusable Permission Template)
```typescript
interface DesignationRole {
  id: string;                      // e.g. "role_senior_consultant"
  organizationId: string;
  name: string;                    // Custom company designation name
  description: string;
  permissions: string[];           // Array of permission IDs from permissions registry
  createdAt: string;
  updatedAt: string;
}
```

### UserPermissionOverride
```typescript
interface UserPermissionOverride {
  id: string;
  userId: string;
  grantedPermissionIds: string[];  // Additional permissions granted beyond base designation
  revokedPermissionIds: string[];  // Permissions revoked from base designation
  updatedAt: string;
}
```

### IncentivePlan & Assignment
```typescript
type IncentiveType =
  | "fixed_per_deal"
  | "percent_deal_value"
  | "percent_brokerage"
  | "slab_based"
  | "target_based"
  | "custom";

interface IncentivePlan {
  id: string;
  organizationId: string;
  name: string;
  type: IncentiveType;
  description: string;
  rules: {
    fixedAmount?: number;
    percentValue?: number;
    brokerageSharePercent?: number;
    slabs?: { minAmount: number; maxAmount?: number; percent: number }[];
    targetQuarterly?: number;
    bonusAmount?: number;
    customFormulaText?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserIncentiveAssignment {
  id: string;
  userId: string;
  planId: string;
  effectiveFrom: string;
  effectiveTo?: string;
  customOverrides?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
```

### ActivityLog & Sensitive Audit Trail
```typescript
interface ActivityLog {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  type: "activity" | "audit";     // Business activity vs sensitive audit event
  action: string;
  module: string;
  entityType: string;
  entityId: string;
  entityName: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}
```

---

## 4. Permission & Entitlement Services (`src/utils/permissionService.ts`)

- **`getUserEffectivePermissions(user)`**: Combines the user's base designation permissions with user-specific overrides. Explicit revocations strictly take precedence over inherited base permissions.
- **`hasPermission(user, permissionId)`**: Checks if the user's effective permissions include the requested action.
- **`canAccessModule(user, moduleName)`**: Verifies whether the user has at least one permission within a functional module.
- **`hasFeature(featureKey)`**: Lightweight feature entitlement layer (`team_management`, `advanced_permissions`, `incentive_management`, `audit_logging`, `custom_roles`). Currently enabled for frontend prototype; seamlessly connects to backend subscription plans later.

---

## 5. Performance Calculation Engine (`src/utils/performanceService.ts`)

Computes real-time sales performance metrics from live CRM records (`sahyak_crm_leads_v1`):
- **User Performance**:
  - Total Leads Assigned
  - Active Pipeline Leads
  - Follow-up Adherence & Completion Rate
  - Scheduled & Completed Site Visits
  - Converted Deals Won
  - Total Closed Deal Value
  - Estimated Incentive Accrual (calculated via assigned incentive plan rules)
- **Team Performance**:
  - Aggregates metrics for all active members belonging to `teamId`
  - Team Conversion Rate
  - Total Pipeline Volume

---

## 6. Activity & Audit Trail Engine (`src/utils/activityService.ts`)

- **Dual-Stream Logging**:
  - `type: "activity"`: Business actions (Lead created, lead imported, status changed, follow-up logged).
  - `type: "audit"`: Sensitive governance actions (Permission override granted, designation modified, team membership changed, user status toggled).
- **Auto-Pruning**: Automatically retains the latest 200 entries to prevent browser `localStorage` bloat.
- **Interactive Multi-Factor Filtering**: Filters logs by user, module, activity type, and date range.

---

## 7. Storage Keys Reference

| Key | Purpose |
| --- | --- |
| `sahyak_crm_users_v1` | User profiles, team affiliations, designations, and active/inactive statuses |
| `sahyak_crm_teams_v1` | Generic company teams and optional team lead associations |
| `sahyak_crm_roles_v1` | Company-defined designation templates and their default permissions |
| `sahyak_crm_overrides_v1` | Individual user granted and revoked permission overrides |
| `sahyak_crm_incentives_v1` | Reusable incentive calculation plans |
| `sahyak_crm_user_incentives_v1` | User-to-plan assignments with effective dates and custom parameters |
| `sahyak_crm_activity_logs_v1` | Activity and sensitive audit events (auto-pruned to 200 items) |
| `sahyak_crm_current_user_v1` | Active simulated user ID for interactive prototype switching |

---

## 8. Backend Migration Blueprint

To transition SAHYAK CRM from the client-side prototype to a multi-tenant cloud SaaS backend, follow this roadmap:

### A. Authentication & Identity Layer
- **Separation of Identity & Profile**: Use an external identity provider (e.g. Supabase Auth, Auth0, Firebase Auth, or NextAuth/Auth.js). The authentication identity provides `auth_id` (JWT token), while the CRM database maintains the `User` record mapped via `auth_user_id`.
- **Session Tokens**: Pass JSON Web Tokens (JWT) containing `sub` (userId) and `org_id` (organizationId) in the `Authorization: Bearer <token>` header.

### B. Relational Database Schema & Foreign Keys (PostgreSQL)
```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    plan_tier VARCHAR(50) DEFAULT 'starter',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    team_lead_user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE designations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE designation_permissions (
    designation_id UUID NOT NULL REFERENCES designations(id) ON DELETE CASCADE,
    permission_id VARCHAR(100) NOT NULL,
    PRIMARY KEY (designation_id, permission_id)
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    auth_user_id VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    designation_id UUID REFERENCES designations(id),
    job_title VARCHAR(150),
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    joining_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_permission_overrides (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_id VARCHAR(100) NOT NULL,
    is_granted BOOLEAN NOT NULL, -- true for grant, false for revoke
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, permission_id)
);

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    assigned_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### C. Server-Side API Authorization & Middleware
- **Middleware Guard**: Every API route extracts `organization_id` and `user_id` from the verified session JWT.
- **Permission Check**: Before executing mutations (e.g. `POST /api/leads`), the backend queries the user's cached effective permissions:
  ```typescript
  export async function authorize(userId: string, requiredPermission: string) {
    const effective = await getCachedEffectivePermissions(userId);
    if (!effective.has(requiredPermission)) {
      throw new ForbiddenError(`Missing required permission: ${requiredPermission}`);
    }
  }
  ```
- **Data Scope Enforcement**: Queries for leads or pipeline items apply data ownership clauses:
  - If user has `leads.view_all`: `WHERE organization_id = $orgId`
  - If user has `leads.view_team`: `WHERE organization_id = $orgId AND assigned_team_id = $userTeamId`
  - If user has `leads.view_own`: `WHERE organization_id = $orgId AND assigned_to_user_id = $userId`

### D. Organization Multi-Tenancy & Data Isolation
- **Row-Level Security (RLS)**: In PostgreSQL, enable RLS on all tenant tables:
  ```sql
  ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
  CREATE POLICY tenant_isolation_policy ON leads
    FOR ALL
    USING (organization_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);
  ```
- **Audit Logging Immutability**: Store audit logs in an append-only table (or write to AWS CloudWatch / Google Cloud Logging) with write-only credentials to prevent tampering.



