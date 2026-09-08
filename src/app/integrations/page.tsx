import { Icon } from "@/components/Icon";
import { MOCK_INTEGRATIONS } from "@/data/mockData";

export default function IntegrationsPage() {
  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 className="page-title">Lead Ingestion & Integrations</h1>
          <p className="page-subtitle">Connect digital advertising channels and external lead capture forms</p>
        </div>
      </div>

      {/* Notice Callout */}
      <div
        className="card"
        style={{
          backgroundColor: "var(--info-light)",
          borderColor: "var(--info-border)",
          padding: "14px 16px",
          marginBottom: "var(--space-6)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span style={{ color: "var(--info)" }}><Icon name="plug" size={20} /></span>
        <div style={{ fontSize: "13px", color: "var(--text-primary)" }}>
          <strong>Frontend Foundation Phase:</strong> All integrations are currently in disconnected overview mode. Production OAuth and API token configurations will be activated in upcoming phases.
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid-2">
        {MOCK_INTEGRATIONS.map((integration) => (
          <div
            key={integration.id}
            className="card"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "20px",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <span className="badge badge-neutral">{integration.category}</span>
                <span className="badge badge-danger" style={{ fontWeight: 700 }}>
                  {integration.status}
                </span>
              </div>

              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                {integration.name}
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                {integration.description}
              </p>
            </div>

            <div
              style={{
                marginTop: "18px",
                paddingTop: "14px",
                borderTop: "1px solid var(--border-subtle)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                Zero active webhooks
              </span>
              <button type="button" className="btn btn-primary btn-sm">
                Connect Channel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
