"use client";

import type { BrandProfile } from "@/lib/types";
import { useDashboardStore } from "@/lib/store/dashboard";

interface HeaderProps {
  brand: BrandProfile;
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
}

export default function Header({ brand, isRunning, onRun, onStop }: HeaderProps) {
  const totalTxCount = useDashboardStore((state) => state.totalTxCount);
  const totalUsdcSpent = useDashboardStore((state) => state.totalUsdcSpent);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(8,11,20,0.95)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(99,102,241,0.12)",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 52,
          gap: 16,
        }}
      >
        {/* ── Logo: "BA" text mark ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 18px rgba(99,102,241,0.4)",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
              BA
            </span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.2, color: "var(--text-primary)" }}>
              Brand<span className="gradient-text">Agent</span>
            </div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1, marginTop: 2 }}>
              Autonomous · Arc L1
            </div>
          </div>
        </div>

        {/* ── Center: Brand pill ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 14px",
            background: "rgba(17,24,39,0.7)",
            border: "1px solid rgba(99,102,241,0.14)",
            borderRadius: 999,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#10B981",
              boxShadow: "0 0 6px #10B981",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>
            {brand.brand}
          </span>
          <span style={{ width: 1, height: 12, background: "rgba(99,102,241,0.2)", flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "var(--text-muted)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {brand?.brand_voice?.split(",")[0] || "No voice"}
          </span>
        </div>

        {/* ── Right: Stats + Controls ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

          {/* Tx counter */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 11px",
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.18)",
              borderRadius: 8,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#A78BFA" }}>
              {totalTxCount} / 50 txns
            </span>
          </div>

          {/* USDC spent */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 11px",
              background: "rgba(0,211,149,0.06)",
              border: "1px solid rgba(0,211,149,0.16)",
              borderRadius: 8,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 800, color: "#00D395", letterSpacing: "-0.01em" }}>
              ${totalUsdcSpent.toFixed(3)}
            </span>
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>USDC</span>
          </div>

          {/* Run / Stop */}
          <button
            id="btn-run-campaign"
            className="btn-primary"
            onClick={isRunning ? onStop : onRun}
            style={{
              background: isRunning
                ? "linear-gradient(135deg, #EF4444, #DC2626)"
                : "linear-gradient(135deg, #6366F1, #8B5CF6)",
              padding: "9px 18px",
              fontSize: 13,
              gap: 7,
            }}
          >
            {isRunning ? (
              <>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.85)",
                    animation: "blink 1s ease-in-out infinite",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                Stop
              </>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Run Campaign
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
