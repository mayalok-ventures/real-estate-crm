import { Icon } from "@/components/Icon";
import { MOCK_GROUPS } from "@/data/mockData";

export default function GroupsPage() {
  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 className="page-title">Buyer Groups & Segments</h1>
          <p className="page-subtitle">Organize buyers by budget, location preference & investment intent</p>
        </div>
        <button type="button" className="btn btn-primary btn-sm">
          <Icon name="plus" size={14} />
          <span>Create Group</span>
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid-3" style={{ marginBottom: "var(--space-6)" }}>
        {MOCK_GROUPS.map((group) => (
          <div key={group.id} className="card card-clickable" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <span className="badge badge-info">{group.tag}</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                  {group.memberCount} Contacts
                </span>
              </div>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                {group.name}
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                {group.description}
              </p>
            </div>

            <div
              style={{
                marginTop: "16px",
                paddingTop: "12px",
                borderTop: "1px solid var(--border-subtle)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button type="button" className="btn btn-secondary btn-sm" style={{ padding: "4px 8px" }}>
                Broadcast Message
              </button>
              <button type="button" className="btn btn-secondary btn-sm" style={{ padding: "4px 8px" }}>
                Manage ({group.memberCount})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Callout */}
      <div className="card" style={{ backgroundColor: "var(--bg-subtle)", padding: "16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div style={{ color: "var(--brand-primary)", marginTop: "2px" }}>
          <Icon name="folder" size={20} />
        </div>
        <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          <strong>Segmentation Tip:</strong> Creating micro-segments like <em>&ldquo;Immediate Possession Seekers&rdquo;</em> or <em>&ldquo;Pre-launch Investors&rdquo;</em> helps you close deals faster by broadcasting project launches only to qualified buyers.
        </div>
      </div>
    </div>
  );
}
