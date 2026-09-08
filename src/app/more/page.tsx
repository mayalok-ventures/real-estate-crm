import Link from "next/link";
import { Icon, IconName } from "@/components/Icon";

interface MenuItem {
  title: string;
  description: string;
  href: string;
  icon: IconName;
  badge?: string;
}

const MORE_SECTIONS: { category: string; items: MenuItem[] }[] = [
  {
    category: "Deals & Outings",
    items: [
      {
        title: "Sales Pipeline",
        description: "Visual stage Kanban board and deal flow",
        href: "/pipeline",
        icon: "kanban",
        badge: "₹18.4 Cr",
      },
      {
        title: "Site Visits",
        description: "Scheduled property tours and walkthroughs",
        href: "/site-visits",
        icon: "map-pin",
        badge: "2 Today",
      },
    ],
  },
  {
    category: "Client Engagement & Catalog",
    items: [
      {
        title: "WhatsApp",
        description: "Direct messaging, brochure sharing & templates",
        href: "/whatsapp",
        icon: "message-circle",
      },
      {
        title: "Buyer Groups",
        description: "Investor segments and broadcast lists",
        href: "/groups",
        icon: "folder",
      },
      {
        title: "Products & Projects",
        description: "Real estate inventory and unit availability",
        href: "/products",
        icon: "building",
      },
    ],
  },
  {
    category: "Insights & Configuration",
    items: [
      {
        title: "Team Management",
        description: "Company teams, custom designations, permissions & incentives",
        href: "/team",
        icon: "users",
        badge: "Multi-User",
      },
      {
        title: "Sales Analytics",
        description: "Conversion metrics and lead acquisition channels",
        href: "/analytics",
        icon: "bar-chart",
      },
      {
        title: "Lead Integrations",
        description: "Meta Ads, Google Ads & Webhook connections",
        href: "/integrations",
        icon: "plug",
      },
      {
        title: "Profile & Settings",
        description: "Broker details, notification rules & pipeline stages",
        href: "/settings",
        icon: "settings",
      },
    ],
  },
];

export default function MorePage() {
  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Application Menu</h1>
        <p className="page-subtitle">Access all sections of SAHYAK Real Estate CRM</p>
      </div>

      {/* Broker Mini Profile */}
      <div
        className="card"
        style={{
          marginBottom: "var(--space-6)",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--brand-primary-light)",
            color: "var(--brand-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "18px",
          }}
        >
          RV
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
            Rohan Verma
          </div>
          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
            Independent Real Estate Consultant & Broker
          </div>
          <div style={{ fontSize: "11px", color: "var(--success)", fontWeight: 600, marginTop: "2px" }}>
            SAHYAK Mobile App v0.2.0 • Offline Ready
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {MORE_SECTIONS.map((section) => (
          <div key={section.category}>
            <div
              style={{
                fontSize: "11.5px",
                fontWeight: 700,
                color: "var(--text-muted)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "8px",
                paddingLeft: "4px",
              }}
            >
              {section.category}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="card card-clickable"
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--bg-subtle)",
                        color: "var(--brand-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon name={item.icon} size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "1px" }}>
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {item.badge && (
                      <span className="badge badge-info" style={{ fontSize: "11px" }}>
                        {item.badge}
                      </span>
                    )}
                    <span style={{ color: "var(--text-muted)" }}>
                      <Icon name="chevron-right" size={18} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
