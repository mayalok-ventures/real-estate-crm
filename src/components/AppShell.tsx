"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, IconName } from "./Icon";
import { PwaRegister } from "./PwaRegister";
import { getCurrentUser } from "@/data/teamData";

interface NavItem {
  label: string;
  href: string;
  icon: IconName;
  badge?: number | string;
}

const DESKTOP_NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "CORE",
    items: [
      { label: "Dashboard", href: "/", icon: "home" },
      { label: "Leads", href: "/leads", icon: "users", badge: "124" },
      { label: "Pipeline", href: "/pipeline", icon: "kanban" },
      { label: "Follow-ups", href: "/follow-ups", icon: "clock", badge: "6" },
      { label: "Site Visits", href: "/site-visits", icon: "map-pin", badge: "2" },
    ],
  },
  {
    title: "OUTREACH & INVENTORY",
    items: [
      { label: "WhatsApp", href: "/whatsapp", icon: "message-circle" },
      { label: "Groups", href: "/groups", icon: "folder" },
      { label: "Products & Projects", href: "/products", icon: "building" },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { label: "Team Management", href: "/team", icon: "users" },
      { label: "Sales Analytics", href: "/analytics", icon: "bar-chart" },
      { label: "Integrations", href: "/integrations", icon: "plug" },
      { label: "Profile & Settings", href: "/settings", icon: "settings" },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentUser, setCurrentUserState] = React.useState(() => getCurrentUser());

  React.useEffect(() => {
    const handleUserChange = () => {
      setCurrentUserState(getCurrentUser());
    };
    window.addEventListener("sahyak_user_changed", handleUserChange);
    window.addEventListener("storage", handleUserChange);
    return () => {
      window.removeEventListener("sahyak_user_changed", handleUserChange);
      window.removeEventListener("storage", handleUserChange);
    };
  }, []);

  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard";
    if (pathname.startsWith("/team")) return "Team Management";
    if (pathname.startsWith("/leads")) return "Leads";
    if (pathname.startsWith("/pipeline")) return "Sales Pipeline";
    if (pathname.startsWith("/follow-ups")) return "Follow-ups";
    if (pathname.startsWith("/site-visits")) return "Site Visits";
    if (pathname.startsWith("/whatsapp")) return "WhatsApp";
    if (pathname.startsWith("/groups")) return "Buyer Groups";
    if (pathname.startsWith("/products")) return "Products & Projects";
    if (pathname.startsWith("/analytics")) return "Sales Analytics";
    if (pathname.startsWith("/integrations")) return "Integrations";
    if (pathname.startsWith("/settings")) return "Profile & Settings";
    if (pathname.startsWith("/more")) return "More Sections";
    return "SAHYAK CRM";
  };

  return (
    <div className="app-container">
      {/* Desktop Left Sidebar */}
      <aside className="desktop-sidebar">
        {/* Brand Header */}
        <div style={{ padding: "0 8px 16px 8px", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "8px",
                backgroundColor: "var(--brand-primary)",
                color: "var(--text-inverse)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "17px",
              }}
            >
              S
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                SAHYAK
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 500 }}>
                Real Estate CRM
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav style={{ flex: 1, padding: "16px 0", display: "flex", flexDirection: "column", gap: "18px" }}>
          {DESKTOP_NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  letterSpacing: "0.06em",
                  padding: "0 10px 6px 10px",
                }}
              >
                {section.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 10px",
                        borderRadius: "var(--radius-md)",
                        color: isActive ? "var(--brand-primary)" : "var(--text-secondary)",
                        backgroundColor: isActive ? "var(--brand-primary-light)" : "transparent",
                        fontWeight: isActive ? 600 : 500,
                        fontSize: "13.5px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Icon name={item.icon} size={18} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "1px 6px",
                            borderRadius: "var(--radius-full)",
                            backgroundColor: isActive ? "var(--brand-primary)" : "var(--bg-subtle)",
                            color: isActive ? "var(--text-inverse)" : "var(--text-secondary)",
                            fontWeight: 600,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Card */}
        <div
          style={{
            padding: "12px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--bg-subtle)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--brand-primary-light)",
              color: "var(--brand-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "13px",
            }}
          >
            {currentUser.avatarInitials || "RV"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentUser.jobTitle}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Layout */}
      <div className="main-wrapper">
        {/* Top App Bar */}
        <header className="top-bar">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Mobile Brand Mark */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "var(--brand-primary)",
                  display: "inline-block",
                }}
              >
                SAHYAK
              </span>
              <span style={{ color: "var(--border-strong)" }}>•</span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                {getPageTitle()}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <PwaRegister />
            <Link
              href="/leads?add=true"
              className="btn btn-primary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
              aria-label="Add Lead"
            >
              <Icon name="plus" size={16} />
              <span style={{ display: "none" }} className="desktop-add-text">
                Add Lead
              </span>
              <style jsx>{`
                @media (min-width: 640px) {
                  .desktop-add-text {
                    display: inline !important;
                  }
                }
              `}</style>
            </Link>
            <Link
              href="/settings"
              className="btn-icon"
              title="Profile & Settings"
              aria-label="Profile and Settings"
            >
              <Icon name="user" size={18} />
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="content-area">{children}</main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        {/* Tab 1: Home */}
        <Link
          href="/"
          className={`nav-tab ${pathname === "/" ? "active" : ""}`}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <Icon name="home" size={20} />
          <span>Home</span>
        </Link>

        {/* Tab 2: Leads */}
        <Link
          href="/leads"
          className={`nav-tab ${pathname.startsWith("/leads") ? "active" : ""}`}
          aria-current={pathname.startsWith("/leads") ? "page" : undefined}
        >
          <Icon name="users" size={20} />
          <span>Leads</span>
        </Link>

        {/* Center Action: + Add Lead */}
        <div className="nav-tab-add">
          <Link
            href="/leads?add=true"
            className="add-button-round"
            aria-label="Add Lead"
          >
            <Icon name="plus" size={24} />
          </Link>
        </div>

        {/* Tab 3: Follow-ups */}
        <Link
          href="/follow-ups"
          className={`nav-tab ${pathname.startsWith("/follow-ups") ? "active" : ""}`}
          aria-current={pathname.startsWith("/follow-ups") ? "page" : undefined}
        >
          <Icon name="clock" size={20} />
          <span>Follow-ups</span>
        </Link>

        {/* Tab 4: More */}
        <Link
          href="/more"
          className={`nav-tab ${pathname.startsWith("/more") ? "active" : ""}`}
          aria-current={pathname.startsWith("/more") ? "page" : undefined}
        >
          <Icon name="grid" size={20} />
          <span>More</span>
        </Link>
      </nav>
    </div>
  );
}
