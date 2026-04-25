"use client";

import type { CampaignMetrics } from "@/lib/types";

interface HeroStatsProps {
  totalCycles: number;
  totalTxCount: number;
  totalUsdcSpent: number;
  metrics: CampaignMetrics | null;
  isRunning: boolean;
}

// Clean SVG icons — no emojis
const STAT_ICONS = {
  cycles: (color: string) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  ),
  chain: (color: string) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  ),
  dollar: (color: string) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
  reach: (color: string) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </svg>
  ),
  engagement: (color: string) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  verify: (color: string) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
};

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
      icon: STAT_ICONS.cycles,
      color: "#6366F1",
      sub: isRunning ? "Running..." : totalCycles === 0 ? "Click Run Campaign" : "Completed",
    },
    {
      label: "Arc L1 Transactions",
      value: totalTxCount.toString(),
      icon: STAT_ICONS.chain,
      color: "#7C3AED",
      sub: `${Math.max(0, 50 - Math.min(totalTxCount, 50))} more for hackathon target`,
    },
    {
      label: "USDC Spent",
      value: `$${totalUsdcSpent.toFixed(4)}`,
      icon: STAT_ICONS.dollar,
      color: "#00D395",
      sub: "Via Circle Nanopayments",
    },
    {
      label: "Total Reach",
      value: metrics?.reachTotal ? metrics.reachTotal.toLocaleString() : "—",
      icon: STAT_ICONS.reach,
      color: "#06B6D4",
      sub: metrics ? `${metrics.postsPublished} posts published` : "Awaiting campaign",
    },
    {
      label: "Engagement Rate",
      value: metrics?.engagementRate
        ? `${(metrics.engagementRate * 100).toFixed(2)}%`
        : "—",
      icon: STAT_ICONS.engagement,
      color: "#10B981",
      sub: metrics
        ? metrics.engagementRate >= 0.035
          ? "Above target"
          : "Below 3.5% target"
        : "Target: 3.5%",
    },
    {
      label: "Verification Rate",
      value: metrics?.postVerificationRate
        ? `${(metrics.postVerificationRate * 100).toFixed(0)}%`
        : "—",
      icon: STAT_ICONS.verify,
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
        marginBottom: 16,
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="stat-card"
          style={{
            position: "relative",
            overflow: "hidden",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Subtle color glow bg */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `${stat.color}12`,
              filter: "blur(28px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            {/* SVG icon in a tinted circle */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `${stat.color}14`,
                border: `1px solid ${stat.color}28`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {stat.icon(stat.color)}
            </div>

            <div
              className="stat-value"
              style={{
                background: `linear-gradient(135deg, ${stat.color}, #e2e8f0)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: stat.value.length > 7 ? "1.6rem" : "2.2rem",
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
