"use client";

import type { Transaction } from "@/lib/types";
import { AGENT_COLORS } from "@/lib/constants";

interface TransactionFeedProps {
  transactions: Transaction[];
  showAll?: boolean;
}

function getTaskIcon(taskType: string) {
  const icons: Record<string, string> = {
    content_creation: "✍️",
    website_crawl: "🌐",
    social_post: "📢",
    kpi_extraction: "📊",
    post_verification: "✅",
    analytics_report: "📈",
  };
  return icons[taskType] || "💸";
}

function getAgentLabel(id: string) {
  const labels: Record<string, string> = {
    orchestrator: "Orchestrator",
    creator: "Creator",
    website: "Website",
    social: "Social",
    verifier: "Verifier",
    analytics: "Analytics",
  };
  return labels[id] || id;
}

function timeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return new Date(timestamp).toLocaleTimeString();
}

export default function TransactionFeed({ transactions, showAll }: TransactionFeedProps) {
  if (transactions.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          color: "var(--text-muted)",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 36 }}>⛓️</div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>No transactions yet</div>
        <div style={{ fontSize: 12 }}>Run a campaign to generate on-chain Arc L1 transactions</div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        overflowY: showAll ? "visible" : "auto",
        maxHeight: showAll ? "none" : 300,
        paddingRight: 4,
      }}
    >
      {transactions.map((tx) => {
        const fromColor = AGENT_COLORS[tx.from] || "#6366F1";
        const toColor = AGENT_COLORS[tx.to] || "#10B981";

        return (
          <div key={tx.id} className="tx-row" style={{ background: `linear-gradient(90deg, ${fromColor}15, transparent)` }}>
            {/* Task Icon */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "rgba(255,255,255,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              {getTaskIcon(tx.taskType)}
            </div>

            {/* From → To */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: fromColor,
                    padding: "1px 6px",
                    background: `${fromColor}15`,
                    borderRadius: 4,
                  }}
                >
                  {getAgentLabel(tx.from)}
                </span>
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>→</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: toColor,
                    padding: "1px 6px",
                    background: `${toColor}15`,
                    borderRadius: 4,
                  }}
                >
                  {getAgentLabel(tx.to)}
                </span>
                <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: "auto" }}>
                  {timeAgo(tx.timestamp)}
                </span>
              </div>
              {/* Tx Hash */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  className="mono"
                  style={{
                    fontSize: 10,
                    color: "var(--text-muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}
                >
                  {tx.txHash.slice(0, 28)}...
                </span>
                <a
                  href={tx.arcExplorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="arc-badge"
                  style={{ textDecoration: "none", flexShrink: 0 }}
                >
                  Arc ↗
                </a>
              </div>
            </div>

            {/* Amount */}
            <div
              style={{
                textAlign: "right",
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: "#00D395" }}>
                ${tx.amount.toFixed(4)}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>
                USDC
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
