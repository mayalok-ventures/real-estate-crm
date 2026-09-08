import Link from "next/link";
import { Icon } from "@/components/Icon";
import {
  MOCK_METRICS,
  MOCK_PIPELINE_STAGES,
  MOCK_FOLLOW_UPS,
  MOCK_SITE_VISITS,
  MOCK_LEADS,
} from "@/data/mockData";

export default function DashboardPage() {
  const overdueFollowUps = MOCK_FOLLOW_UPS.filter((f) => f.dateType === "overdue");
  const todayFollowUps = MOCK_FOLLOW_UPS.filter((f) => f.dateType === "today");
  const todayVisits = MOCK_SITE_VISITS.filter((v) => v.time.includes("Today"));

  return (
    <div>
      {/* Welcome & High Level Status */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 className="page-title">Daily Sales Overview</h1>
          <p className="page-subtitle">Real estate pipeline, pending follow-ups & site visits</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link href="/leads" className="btn btn-secondary btn-sm">
            <Icon name="search" size={14} />
            Search Leads
          </Link>
        </div>
      </div>

      {/* 1. Key Metrics Grid */}
      <section style={{ marginBottom: "var(--space-6)" }}>
        <div className="grid-4">
          <div className="card" style={{ padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>TOTAL LEADS</span>
              <span style={{ color: "var(--brand-primary)" }}><Icon name="users" size={16} /></span>
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)" }}>
              {MOCK_METRICS.totalLeads}
            </div>
            <div style={{ fontSize: "11px", color: "var(--success)", fontWeight: 600, marginTop: "2px" }}>
              +14 this week
            </div>
          </div>

          <div className="card" style={{ padding: "14px", borderLeft: "3px solid var(--warning)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>TODAY&apos;S CALLS</span>
              <span style={{ color: "var(--warning)" }}><Icon name="clock" size={16} /></span>
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)" }}>
              {MOCK_METRICS.todayFollowUps}
            </div>
            <div style={{ fontSize: "11px", color: "var(--danger)", fontWeight: 600, marginTop: "2px" }}>
              {overdueFollowUps.length} overdue
            </div>
          </div>

          <div className="card" style={{ padding: "14px", borderLeft: "3px solid var(--brand-primary)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>SITE VISITS</span>
              <span style={{ color: "var(--brand-primary)" }}><Icon name="map-pin" size={16} /></span>
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)" }}>
              {MOCK_METRICS.todaySiteVisits}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 500, marginTop: "2px" }}>
              2 scheduled today
            </div>
          </div>

          <div className="card" style={{ padding: "14px", borderLeft: "3px solid var(--success)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>DEALS CONVERTED</span>
              <span style={{ color: "var(--success)" }}><Icon name="check" size={16} /></span>
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)" }}>
              {MOCK_METRICS.convertedDeals}
            </div>
            <div style={{ fontSize: "11px", color: "var(--success)", fontWeight: 600, marginTop: "2px" }}>
              {MOCK_METRICS.pipelineValue} pipeline
            </div>
          </div>
        </div>
      </section>

      {/* 2. Today's Priorities (Overdue + Today's Calls & Site Visits) */}
      <section style={{ marginBottom: "var(--space-6)" }}>
        <div className="section-title">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Today&apos;s Priorities</span>
            <span className="badge badge-danger">{overdueFollowUps.length} Overdue</span>
          </div>
          <Link href="/follow-ups" style={{ fontSize: "12px", color: "var(--brand-primary)", fontWeight: 600 }}>
            View all →
          </Link>
        </div>

        <div className="grid-2">
          {/* Actionable Follow-up List */}
          <div className="card">
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Icon name="clock" size={16} />
              <span>Pending Calls & Follow-ups</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {overdueFollowUps.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--danger-light)",
                    border: "1px solid var(--danger-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: "13.5px", color: "var(--text-primary)" }}>
                        {item.clientName}
                      </span>
                      <span className="badge badge-danger">Overdue</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {item.property} • {item.notes}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    <a
                      href={`tel:${item.phone}`}
                      className="btn-icon"
                      style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--danger-border)", color: "var(--danger)" }}
                      title="Call Client"
                    >
                      <Icon name="phone" size={16} />
                    </a>
                  </div>
                </div>
              ))}

              {todayFollowUps.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--bg-subtle)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: "13.5px", color: "var(--text-primary)" }}>
                        {item.clientName}
                      </span>
                      <span className="badge badge-warning">{item.time}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {item.property} • {item.notes}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    <a
                      href={`tel:${item.phone}`}
                      className="btn-icon"
                      style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
                      title="Call Client"
                    >
                      <Icon name="phone" size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Site Visits */}
          <div className="card">
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Icon name="map-pin" size={16} />
              <span>Today&apos;s Property Site Visits</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {todayVisits.length > 0 ? (
                todayVisits.map((visit) => (
                  <div
                    key={visit.id}
                    style={{
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--bg-subtle)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
                        {visit.projectName}
                      </span>
                      <span className="badge badge-info">{visit.time}</span>
                    </div>
                    <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                      Client: <strong>{visit.clientName}</strong> ({visit.unitType})
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Icon name="map-pin" size={12} />
                      <span>{visit.location}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                  No more visits scheduled for today.
                </div>
              )}

              <Link
                href="/site-visits"
                className="btn btn-secondary btn-sm"
                style={{ width: "100%", justifyContent: "center", marginTop: "4px" }}
              >
                Schedule / View All Visits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pipeline Overview Bar */}
      <section style={{ marginBottom: "var(--space-6)" }}>
        <div className="section-title">
          <span>Pipeline Stage Overview</span>
          <Link href="/pipeline" style={{ fontSize: "12px", color: "var(--brand-primary)", fontWeight: 600 }}>
            Open Board →
          </Link>
        </div>

        <div className="card" style={{ padding: "16px" }}>
          {/* Horizontal scroll on mobile for stage pills */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "8px",
            }}
          >
            {MOCK_PIPELINE_STAGES.map((stage) => (
              <div
                key={stage.id}
                style={{
                  padding: "10px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-subtle)",
                  borderTop: `3px solid ${stage.color}`,
                }}
              >
                <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", fontWeight: 600 }}>
                  {stage.name}
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", marginTop: "2px" }}>
                  {stage.leadCount}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
                  {stage.totalValue}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Recent Leads Preview */}
      <section>
        <div className="section-title">
          <span>Recent Inquiries & Leads</span>
          <Link href="/leads" style={{ fontSize: "12px", color: "var(--brand-primary)", fontWeight: 600 }}>
            View all 124 leads →
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {MOCK_LEADS.slice(0, 4).map((lead) => {
            const badgeClass =
              lead.status === "Hot"
                ? "badge-danger"
                : lead.status === "Warm"
                ? "badge-warning"
                : "badge-info";

            return (
              <div
                key={lead.id}
                className="card card-clickable"
                style={{
                  padding: "12px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div style={{ minWidth: "160px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
                      {lead.name}
                    </span>
                    <span className={`badge ${badgeClass}`}>{lead.status}</span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {lead.propertyInterest} • Budget: <strong>{lead.budget}</strong>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="badge badge-neutral">{lead.source}</span>
                  <a
                    href={`tel:${lead.phone}`}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "4px 10px" }}
                  >
                    <Icon name="phone" size={13} />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
