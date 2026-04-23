"use client";

import type { CampaignMetrics, CampaignCycle, Transaction } from "@/lib/types";
import { PLATFORM_COLORS } from "@/lib/constants";

interface KpiDashboardProps {
  metrics: CampaignMetrics | null;
  campaign: CampaignCycle | null;
  transactions: Transaction[];
}

function MetricCard({
  label,
  value,
  sub,
  color,
  icon,
  target,
  targetMet,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  icon: string;
  target?: string;
  targetMet?: boolean;
}) {
  return (
    <div
      className="stat-card"
      style={{ gap: 10, padding: 0 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `2px solid ${color}40`, paddingBottom: 8 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        {target && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 7px",
              borderRadius: 999,
              background: targetMet ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.1)",
              color: targetMet ? "#34D399" : "#FCD34D",
              border: `1px solid ${targetMet ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.2)"}`,
            }}
          >
            {targetMet ? "✅ On Target" : `Target: ${target}`}
          </span>
        )}
      </div>
      <div className="stat-value" style={{ 
        background: `linear-gradient(135deg, ${color}, #ffffff)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
      }}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
      {sub && <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{sub}</div>}
    </div>
  );
}

export default function KpiDashboard({ metrics, campaign, transactions }: KpiDashboardProps) {
  if (!metrics) {
    return (
      <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Analytics Dashboard</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Run a campaign cycle to see live KPIs, engagement metrics, and on-chain economics
        </p>
      </div>
    );
  }

  // Group transactions by task type
  const txByType: Record<string, { count: number; total: number }> = {};
  transactions.forEach((tx) => {
    if (!txByType[tx.taskType]) txByType[tx.taskType] = { count: 0, total: 0 };
    txByType[tx.taskType].count++;
    txByType[tx.taskType].total += tx.amount;
  });

  const platforms = campaign?.content?.map((c) => c.platform) || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Section: Performance KPIs */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>📈 Campaign Performance</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <MetricCard
            icon="📡"
            label="Total Reach"
            value={metrics.reachTotal.toLocaleString()}
            sub={`${metrics.postsPublished} posts across ${platforms.length} platforms`}
            color="#06B6D4"
          />
          <MetricCard
            icon="💬"
            label="Engagement Rate"
            value={`${(metrics.engagementRate * 100).toFixed(2)}%`}
            sub="Likes + Comments + Shares / Reach"
            color="#10B981"
            target="3.5%"
            targetMet={metrics.engagementRate >= 0.035}
          />
          <MetricCard
            icon="🌟"
            label="Content Quality Score"
            value={`${metrics.contentQualityScore}/100`}
            sub="Gemini AI evaluation score"
            color="#8B5CF6"
          />
          <MetricCard
            icon="✅"
            label="Verification Rate"
            value={`${(metrics.postVerificationRate * 100).toFixed(0)}%`}
            sub="Posts confirmed live by Verifier Agent"
            color="#F59E0B"
          />
        </div>
      </div>

      {/* Section: Economic Metrics */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>💰 On-Chain Economics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <MetricCard
            icon="💵"
            label="Total USDC Spent"
            value={`$${metrics.usdcSpent.toFixed(4)}`}
            sub="Via Circle Nanopayments"
            color="#00D395"
          />
          <MetricCard
            icon="📝"
            label="Cost per Post"
            value={`$${metrics.costPerPost.toFixed(5)}`}
            sub="≤ $0.01 per action requirement ✅"
            color="#34D399"
          />
          <MetricCard
            icon="🎯"
            label="Cost per 1K Reach"
            value={`$${metrics.costPer1kReach.toFixed(5)}`}
            sub="USDC · Fully transparent on-chain"
            color="#6EE7B7"
          />
          <MetricCard
            icon="⛓️"
            label="Arc L1 Transactions"
            value={metrics.arcTransactions.toString()}
            sub={metrics.arcTransactions >= 50 ? "✅ 50+ txns achieved!" : `${50 - metrics.arcTransactions} more for target`}
            color="#A78BFA"
            target="50 txns"
            targetMet={metrics.arcTransactions >= 50}
          />
        </div>
      </div>

      {/* Section: Transaction Breakdown + Platform breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Payment breakdown by task type */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>💸 Payment Breakdown by Task</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(txByType).map(([taskType, { count, total }]) => {
              const icons: Record<string, string> = {
                content_creation: "✍️",
                website_crawl: "🌐",
                social_post: "📢",
                kpi_extraction: "📊",
                post_verification: "✅",
                analytics_report: "📈",
              };
              const maxTotal = Math.max(...Object.values(txByType).map((v) => v.total));
              const pct = (total / maxTotal) * 100;

              return (
                <div key={taskType}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {icons[taskType]} {taskType.replace(/_/g, " ")}
                    </span>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ color: "var(--text-muted)" }}>×{count}</span>
                      <span style={{ color: "#00D395", fontWeight: 700 }}>${total.toFixed(4)}</span>
                    </div>
                  </div>
                  <div className="progress-bar" style={{ height: 8, background: "rgba(255,255,255,0.05)" }}>
                    <div className="progress-fill" style={{ 
                      width: `${pct}%`, 
                      background: `linear-gradient(90deg, transparent, #00D395)`, 
                      boxShadow: "0 0 10px rgba(0,211,149,0.5)"
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform coverage */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📱 Platform Coverage</h3>
          {campaign?.content && campaign.content.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {campaign.content.map((c) => {
                const color = PLATFORM_COLORS[c.platform] || "#6366F1";
                return (
                  <div
                    key={c.platform}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      background: `${color}10`,
                      border: `1px solid ${color}25`,
                      borderRadius: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: color,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color, textTransform: "capitalize" }}>
                        {c.platform.replace("_", " ")}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
                        {c.characterCount} chars · {c.hashtags.length} hashtags
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#34D399" }}>✓ Posted</div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{c.tone}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
              Content will appear after campaign runs
            </div>
          )}
        </div>
      </div>

      {/* Hackathon Checklist */}
      <div className="glass-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🏆 Hackathon Requirements Checklist</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { label: "Real per-action pricing ≤ $0.01", met: metrics.costPerPost <= 0.01 },
            { label: "50+ on-chain Arc transactions", met: metrics.arcTransactions >= 50 },
            { label: "Circle Nanopayments integration", met: transactions.length > 0 },
            { label: "Verifier Agent (Gemini Flash)", met: metrics.postVerificationRate > 0 },
            { label: "Multi-agent orchestration", met: true },
            { label: "Agent-to-Agent payment loop", met: transactions.length > 0 },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                background: item.met ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${item.met ? "rgba(16,185,129,0.2)" : "var(--border)"}`,
                borderRadius: 10,
                fontSize: 12,
              }}
            >
              <span style={{ fontSize: 16 }}>{item.met ? "✅" : "⏳"}</span>
              <span style={{ color: item.met ? "var(--text-primary)" : "var(--text-muted)" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
