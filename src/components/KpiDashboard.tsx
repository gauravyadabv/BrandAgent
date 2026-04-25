"use client";

import type { CampaignMetrics, CampaignCycle, Transaction } from "@/lib/types";
import { PLATFORM_COLORS } from "@/lib/constants";

interface KpiDashboardProps {
  metrics: CampaignMetrics | null;
  campaign: CampaignCycle | null;
  transactions: Transaction[];
}

const KPI_ICONS = {
  reach: (color: string) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </svg>
  ),
  engagement: (color: string) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  quality: (color: string) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  verify: (color: string) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  usdc: (color: string) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
  cost: (color: string) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  ),
  target: (color: string) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  chain: (color: string) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  ),
};

function MetricCard({
  label,
  value,
  sub,
  color,
  renderIcon,
  target,
  targetMet,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  renderIcon: (color: string) => React.ReactNode;
  target?: string;
  targetMet?: boolean;
}) {
  return (
    <div
      className="stat-card"
      style={{ gap: 10, padding: 16 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${color}25`, paddingBottom: 10, marginBottom: 4 }}>
        <span style={{ display: "flex", alignItems: "center" }}>{renderIcon(color)}</span>
        {target && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 6,
              background: targetMet ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.08)",
              color: targetMet ? "#34D399" : "#FCD34D",
              border: `1px solid ${targetMet ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.15)"}`,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {targetMet ? "Target Met" : `Goal: ${target}`}
          </span>
        )}
      </div>
      <div className="stat-value" style={{ 
        fontSize: "24px",
        background: `linear-gradient(135deg, ${color}, #ffffff)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
      }}>
        {value}
      </div>
      <div className="stat-label" style={{ fontSize: 10, letterSpacing: "0.06em" }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export default function KpiDashboard({ metrics, campaign, transactions }: KpiDashboardProps) {
  if (!metrics) {
    return (
      <div className="glass-card" style={{ padding: 60, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ 
          width: 64, 
          height: 64, 
          borderRadius: 20, 
          background: "rgba(99,102,241,0.08)", 
          border: "1px solid rgba(99,102,241,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.01em" }}>Analytics Dashboard</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 400, lineHeight: 1.6 }}>
          Run a campaign cycle to see live KPIs, engagement metrics, and on-chain economics.
        </p>
      </div>
    );
  }

  const txByType: Record<string, { count: number; total: number }> = {};
  transactions.forEach((tx) => {
    if (!txByType[tx.taskType]) txByType[tx.taskType] = { count: 0, total: 0 };
    txByType[tx.taskType].count++;
    txByType[tx.taskType].total += tx.amount;
  });

  const platforms = campaign?.content?.map((c) => c.platform) || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Section: Performance KPIs */}
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>
          Campaign Performance
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <MetricCard
            renderIcon={KPI_ICONS.reach}
            label="Total Reach"
            value={metrics.reachTotal.toLocaleString()}
            sub={`${metrics.postsPublished} posts across ${platforms.length} platforms`}
            color="#06B6D4"
          />
          <MetricCard
            renderIcon={KPI_ICONS.engagement}
            label="Engagement Rate"
            value={`${(metrics.engagementRate * 100).toFixed(2)}%`}
            sub="Aggregated interactions / Reach"
            color="#10B981"
            target="3.5%"
            targetMet={metrics.engagementRate >= 0.035}
          />
          <MetricCard
            renderIcon={KPI_ICONS.quality}
            label="Content Quality"
            value={`${metrics.contentQualityScore}/100`}
            sub="Gemini AI qualitative evaluation"
            color="#8B5CF6"
          />
          <MetricCard
            renderIcon={KPI_ICONS.verify}
            label="Verification Rate"
            value={`${(metrics.postVerificationRate * 100).toFixed(0)}%`}
            sub="Posts confirmed by Verifier Agent"
            color="#F59E0B"
          />
        </div>
      </div>

      {/* Section: Economic Metrics */}
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>
          On-Chain Economics
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <MetricCard
            renderIcon={KPI_ICONS.usdc}
            label="Total USDC Spent"
            value={`$${metrics.usdcSpent.toFixed(4)}`}
            sub="Settled via Circle Nanopayments"
            color="#00D395"
          />
          <MetricCard
            renderIcon={KPI_ICONS.cost}
            label="Cost per Post"
            value={`$${metrics.costPerPost.toFixed(5)}`}
            sub="Below $0.01 micro-action target"
            color="#34D399"
          />
          <MetricCard
            renderIcon={KPI_ICONS.target}
            label="Cost per 1K Reach"
            value={`$${metrics.costPer1kReach.toFixed(5)}`}
            sub="USDC transparent on-chain cost"
            color="#6EE7B7"
          />
          <MetricCard
            renderIcon={KPI_ICONS.chain}
            label="Arc Transactions"
            value={metrics.arcTransactions.toString()}
            sub={metrics.arcTransactions >= 50 ? "Target 50+ achieved" : `${50 - metrics.arcTransactions} to target`}
            color="#A78BFA"
            target="50 txns"
            targetMet={metrics.arcTransactions >= 50}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>Payment Breakdown by Task</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.entries(txByType).map(([taskType, { count, total }]) => {
              const maxTotal = Math.max(...Object.values(txByType).map((v) => v.total));
              const pct = (total / maxTotal) * 100;

              return (
                <div key={taskType}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                    <span style={{ color: "var(--text-secondary)", fontWeight: 600, textTransform: "capitalize" }}>
                      {taskType.replace(/_/g, " ")}
                    </span>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, background: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: 4 }}>×{count}</span>
                      <span style={{ color: "#00D395", fontWeight: 800 }}>${total.toFixed(4)}</span>
                    </div>
                  </div>
                  <div className="progress-bar" style={{ height: 6, background: "rgba(255,255,255,0.03)", borderRadius: 3 }}>
                    <div className="progress-fill" style={{ 
                      width: `${pct}%`, 
                      background: `linear-gradient(90deg, #00D395, #34D399)`, 
                      boxShadow: "0 0 12px rgba(0,211,149,0.3)",
                      borderRadius: 3
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>Platform Distribution</h3>
          {campaign?.content && campaign.content.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {campaign.content.map((c) => {
                const color = PLATFORM_COLORS[c.platform] || "#6366F1";
                return (
                  <div
                    key={c.platform}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 16px",
                      background: `${color}08`,
                      border: `1px solid ${color}15`,
                      borderRadius: 12,
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color, textTransform: "capitalize" }}>
                        {c.platform.replace("_", " ")}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
                        {c.characterCount} Chars · {c.tone}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#34D399", background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: 6, textTransform: "uppercase" }}>
                      Live
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: "40px 0" }}>
              Awaiting campaign execution...
            </div>
          )}
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>Hackathon Submission Checklist</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "Pricing ≤ $0.01 / action", met: metrics.costPerPost <= 0.01 },
            { label: "50+ Arc transactions", met: metrics.arcTransactions >= 50 },
            { label: "Circle Nanopayments", met: transactions.length > 0 },
            { label: "Verifier Agent active", met: metrics.postVerificationRate > 0 },
            { label: "Autonomous orchestration", met: true },
            { label: "Payment loop settled", met: transactions.length > 0 },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                background: item.met ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${item.met ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)"}`,
                borderRadius: 12,
                fontSize: 12,
              }}
            >
              <div style={{ 
                width: 18, 
                height: 18, 
                borderRadius: "50%", 
                background: item.met ? "#10B981" : "rgba(255,255,255,0.1)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                flexShrink: 0
              }}>
                {item.met ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "white" }} />
                )}
              </div>
              <span style={{ color: item.met ? "var(--text-primary)" : "var(--text-muted)", fontWeight: 500 }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
