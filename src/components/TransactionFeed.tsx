"use client";

import type { Transaction } from "@/lib/types";
import { AGENT_COLORS } from "@/lib/constants";

interface TransactionFeedProps {
  transactions: Transaction[];
  showAll?: boolean;
}

// Clean text abbreviations instead of emojis
const TASK_SHORT: Record<string, string> = {
  content_creation: "Create",
  website_crawl: "Crawl",
  social_post: "Post",
  kpi_extraction: "KPI",
  post_verification: "Verify",
  analytics_report: "Report",
};

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
          padding: "48px 20px",
          color: "var(--text-muted)",
          gap: 10,
        }}
      >
        {/* Clean chain icon */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
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
        maxHeight: showAll ? "none" : 450,
        paddingRight: 4,
      }}
    >
      {transactions.map((tx) => {
        const fromColor = AGENT_COLORS[tx.from] || "#6366F1";
        const toColor = AGENT_COLORS[tx.to] || "#10B981";
        const taskLabel = TASK_SHORT[tx.taskType] || tx.taskType;

        return (
          <div
            key={tx.id}
            className="tx-row"
            style={{ background: `linear-gradient(90deg, ${fromColor}12, transparent)` }}
          >
            {/* Task Type Pill */}
            <div
              style={{
                padding: "3px 8px",
                borderRadius: 6,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                background: `${fromColor}15`,
                border: `1px solid ${fromColor}28`,
                color: fromColor,
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {taskLabel}
            </div>

            {/* From → To */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: fromColor,
                    padding: "1px 6px",
                    background: `${fromColor}12`,
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                  }}
                >
                  {getAgentLabel(tx.from)}
                </span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: toColor,
                    padding: "1px 6px",
                    background: `${toColor}12`,
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                  }}
                >
                  {getAgentLabel(tx.to)}
                </span>
                <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: "auto", whiteSpace: "nowrap" }}>
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
            <div style={{ textAlign: "right", flexShrink: 0 }}>
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
