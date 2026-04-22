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
            borderLeft: `3px solid ${stat.color}20`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glow bg */}
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: `${stat.color}10`,
              filter: "blur(20px)",
              pointerEvents: "none",
            }}
          />
          <div style={{ fontSize: 22 }}>{stat.icon}</div>
          <div
            className="stat-value"
            style={{ color: stat.color, fontSize: 22 }}
          >
            {stat.value}
          </div>
          <div className="stat-label">{stat.label}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
            {stat.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
