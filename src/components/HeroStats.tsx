"use client";

import type { CampaignMetrics } from "@/lib/types";

interface HeroStatsProps {
  totalCycles: number;
  totalTxCount: number;
  totalUsdcSpent: number;
  metrics: CampaignMetrics | null;
  isRunning: boolean;
}

export default function HeroStats({
  totalCycles,
  totalTxCount,
  totalUsdcSpent,
  metrics,
  isRunning,
}: HeroStatsProps) {
  const stats = [
    {
      label: "Campaign Cycles",
      value: totalCycles.toString(),
      icon: "🔄",
      color: "#6366F1",
      sub: isRunning ? "Running..." : totalCycles === 0 ? "Click Run Campaign" : "Completed",
    },
    {
      label: "Arc L1 Transactions",
      value: totalTxCount.toString(),
      icon: "⛓️",
      color: "#7C3AED",
      sub: `${(50 - Math.min(totalTxCount, 50))} more for hackathon target`,
    },
    {
      label: "USDC Spent",
      value: `$${totalUsdcSpent.toFixed(4)}`,
      icon: "💵",
      color: "#00D395",
      sub: "Via Circle Nanopayments",
    },
    {
      label: "Total Reach",
      value: metrics?.reachTotal ? metrics.reachTotal.toLocaleString() : "—",
      icon: "📡",
      color: "#06B6D4",
      sub: metrics ? `${metrics.postsPublished} posts published` : "Awaiting campaign",
    },
    {
      label: "Engagement Rate",
      value: metrics?.engagementRate
        ? `${(metrics.engagementRate * 100).toFixed(2)}%`
        : "—",
      icon: "📈",
      color: "#10B981",
      sub: metrics
        ? metrics.engagementRate >= 0.035
          ? "✅ Above target"
          : "Below 3.5% target"
        : "Target: 3.5%",
    },
    {
      label: "Verification Rate",
      value: metrics?.postVerificationRate
        ? `${(metrics.postVerificationRate * 100).toFixed(0)}%`
        : "—",
      icon: "✅",
      color: "#F59E0B",
      sub: "AI Verifier Agent",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: 12,
        marginBottom: 28,
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="stat-card"
          style={{
            position: "relative",
            overflow: "visible",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Glow bg */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: `${stat.color}15`,
              filter: "blur(30px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 24 }}>{stat.icon}</div>
            <div
              className="stat-value"
              style={{
                background: `linear-gradient(135deg, ${stat.color}, #ffffff)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {stat.value}
            </div>
            <div className="stat-label section-header">{stat.label}</div>
            <div className="body-text" style={{ fontSize: 11, marginTop: 2 }}>
              {stat.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
