"use client";

import type { BrandProfile } from "@/lib/types";

interface HeaderProps {
  brand: BrandProfile;
  isRunning: boolean;
  totalTxCount: number;
  onRun: () => void;
  onStop: () => void;
}

export default function Header({ brand, isRunning, totalTxCount, onRun, onStop }: HeaderProps) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(8,11,20,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
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
          height: 64,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              boxShadow: "0 0 16px rgba(99,102,241,0.4)",
            }}
          >
            🤖
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>
              Brand<span className="gradient-text">Agent</span>
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Autonomous AI · Arc L1
            </div>
          </div>
        </div>

        {/* Center — Brand Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 16px",
            background: "rgba(17,24,39,0.8)",
            border: "1px solid var(--border)",
            borderRadius: 999,
          }}
        >
          <span style={{ fontSize: 16 }}>🌿</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
            {brand.brand}
          </span>
          <span style={{ width: 1, height: 14, background: "var(--border)" }} />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{brand.brand_voice.split(",")[0]}</span>
        </div>

        {/* Right — Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Arc TX Counter */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: 10,
            }}
          >
            <span style={{ fontSize: 14 }}>⛓️</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#A78BFA" }}>
              {totalTxCount} txns
            </span>
          </div>

          {/* USDC Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              background: "rgba(0,211,149,0.08)",
              border: "1px solid rgba(0,211,149,0.2)",
              borderRadius: 10,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: "#00D395" }}>
              USDC
            </span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Arc L1</span>
          </div>

          {/* Run / Stop Button */}
          <button
            id="btn-run-campaign"
            className="btn-primary"
            onClick={isRunning ? onStop : onRun}
            disabled={false}
            style={{
              background: isRunning
                ? "linear-gradient(135deg, #EF4444, #DC2626)"
                : "linear-gradient(135deg, #6366F1, #8B5CF6)",
              padding: "10px 20px",
              fontSize: 13,
            }}
          >
            {isRunning ? (
              <>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#fff",
                    animation: "blink 1s ease-in-out infinite",
                    display: "inline-block",
                  }}
                />
                Stop Campaign
              </>
            ) : (
              <>▶ Run Campaign</>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
