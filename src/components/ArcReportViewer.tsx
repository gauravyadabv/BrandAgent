"use client";

import { useState, useMemo } from "react";
import type { Transaction, TaskType } from "@/lib/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TASK_LABELS: Record<TaskType, string> = {
  website_crawl: "Website Crawl",
  content_creation: "Content Creation",
  social_post: "Social Post",
  kpi_extraction: "KPI Extraction",
  post_verification: "Post Verification",
  analytics_report: "Analytics Report",
};

// Clean SVG Icons for Tasks
const TASK_SVG_ICONS = {
  website_crawl: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
    </svg>
  ),
  content_creation: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  social_post: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  kpi_extraction: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  post_verification: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  analytics_report: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  ),
};

const AGENT_COLORS: Record<string, string> = {
  orchestrator: "#6366F1",
  creator: "#8B5CF6",
  website: "#06B6D4",
  social: "#10B981",
  verifier: "#F59E0B",
  analytics: "#EF4444",
};

function shortenHash(hash: string) {
  if (hash.length <= 14) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    confirmed: { bg: "rgba(16,185,129,0.15)", text: "#34d399" },
    pending: { bg: "rgba(245,158,11,0.15)", text: "#fbbf24" },
    failed: { bg: "rgba(239,68,68,0.15)", text: "#f87171" },
  };
  const c = colors[status] ?? colors.confirmed;
  return (
    <span
      style={{
        padding: "2px 10px",
        borderRadius: 99,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        background: c.bg,
        color: c.text,
      }}
    >
      {status}
    </span>
  );
}

function AgentTag({ id }: { id: string }) {
  const color = AGENT_COLORS[id] ?? "#6366F1";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 8px",
        borderRadius: 6,
        fontSize: 10,
        fontWeight: 700,
        border: `1px solid ${color}30`,
        background: `${color}12`,
        color,
        textTransform: "uppercase",
        letterSpacing: "0.02em"
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }} />
      {id}
    </span>
  );
}

// ─── Single Transaction Report Card ──────────────────────────────────────────

function TransactionReportCard({
  tx,
  index,
}: {
  tx: Transaction;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const explorerUrl = tx.arcExplorerUrl ?? `https://explorer.arc.io/tx/${tx.txHash}`;
  const taskColor = AGENT_COLORS[tx.from] ?? "#6366F1";

  return (
    <div
      style={{
        background: expanded ? "rgba(99,102,241,0.08)" : "rgba(15,23,42,0.55)",
        border: expanded
          ? "1px solid rgba(99,102,241,0.35)"
          : "1px solid rgba(99,102,241,0.12)",
        borderRadius: 14,
        overflow: "hidden",
        transition: "all 0.2s ease",
        marginBottom: 8,
      }}
    >
      {/* ── Collapsed Row ── */}
      <div
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: "grid",
          gridTemplateColumns: "32px 1fr 1fr 100px 110px 80px 32px",
          alignItems: "center",
          gap: 14,
          padding: "14px 20px",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {/* Index */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: "var(--text-muted)",
            opacity: 0.6,
          }}
        >
          {index.toString().padStart(2, '0')}
        </div>

        {/* Task */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{ 
            width: 30, 
            height: 30, 
            borderRadius: 8, 
            background: `${taskColor}12`, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            flexShrink: 0,
            border: `1px solid ${taskColor}25`
          }}>
            {TASK_SVG_ICONS[tx.taskType](taskColor)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {TASK_LABELS[tx.taskType]}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                fontFamily: "'JetBrains Mono', monospace",
                marginTop: 2,
              }}
            >
              {shortenHash(tx.txHash)}
            </div>
          </div>
        </div>

        {/* Agent flow */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AgentTag id={tx.from} />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
          <AgentTag id={tx.to} />
        </div>

        {/* Amount */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: "#34d399",
            textAlign: "right",
          }}
        >
          ${tx.amount.toFixed(4)}
        </div>

        {/* Time */}
        <div
          style={{
            fontSize: 11,
            color: "var(--text-secondary)",
            fontFamily: "'JetBrains Mono', monospace",
            textAlign: "center",
          }}
        >
          {formatTime(tx.timestamp)}
        </div>

        {/* Status */}
        <StatusPill status={tx.status} />

        {/* Chevron */}
        <div
          style={{
            color: "var(--text-muted)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            display: "flex",
            justifyContent: "center"
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* ── Expanded Detail Panel ── */}
      {expanded && (
        <div
          style={{
            borderTop: "1px solid rgba(99,102,241,0.15)",
            padding: "20px 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 24,
            background: "rgba(8,11,20,0.5)",
          }}
        >
          {/* Column 1: Chain Info */}
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#6366F1",
                fontWeight: 800,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
              Arc L1 Chain Info
            </div>
            <InfoRow label="Chain" value="Arc L1 (ID: 1234)" />
            <InfoRow label="Gas Token" value="USDC (native)" />
            <InfoRow
              label="Block #"
              value={tx.blockNumber?.toString() ?? "–"}
            />
            <InfoRow label="Currency" value={tx.currency} />
            <InfoRow label="Network" value="Mainnet" />
          </div>

          {/* Column 2: Transaction Hash */}
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#06B6D4",
                fontWeight: 800,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Transaction Audit
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: "var(--text-secondary)",
                background: "rgba(0,0,0,0.2)",
                padding: "10px",
                borderRadius: 8,
                wordBreak: "break-all",
                lineHeight: 1.6,
                marginBottom: 12,
                border: "1px solid rgba(255,255,255,0.05)"
              }}
            >
              {tx.txHash}
            </div>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid rgba(99,102,241,0.3)",
                background: "rgba(99,102,241,0.12)",
                color: "#a5b4fc",
                fontSize: 12,
                fontWeight: 700,
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View on Arc Explorer
            </a>
          </div>

          {/* Column 3: Payment Summary */}
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#10B981",
                fontWeight: 800,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Payment Summary
            </div>
            <InfoRow label="From Agent" value={tx.from} capitalize />
            <InfoRow label="To Agent" value={tx.to} capitalize />
            <InfoRow label="Amount" value={`$${tx.amount.toFixed(6)} USDC`} />
            <InfoRow label="Task Context" value={TASK_LABELS[tx.taskType]} />
            <InfoRow label="Network Status" value={tx.status} capitalize />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
  capitalize,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 8,
        marginBottom: 8,
        fontSize: 12,
      }}
    >
      <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
      <span
        style={{
          color: "var(--text-primary)",
          fontWeight: 600,
          textAlign: "right",
          textTransform: capitalize ? "capitalize" : "none",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Summary Stats Bar ────────────────────────────────────────────────────────

function SummaryBar({ transactions }: { transactions: Transaction[] }) {
  const totalUsdc = transactions.reduce((s, t) => s + t.amount, 0);
  const byType = transactions.reduce<Record<string, number>>((acc, t) => {
    acc[t.taskType] = (acc[t.taskType] ?? 0) + 1;
    return acc;
  }, {});
  const mostCommon = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    { 
      label: "Total Transactions", 
      value: transactions.length.toString(), 
      color: "#6366F1",
      icon: (color: string) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
      )
    },
    { 
      label: "USDC Settled", 
      value: `$${totalUsdc.toFixed(4)}`, 
      color: "#10B981",
      icon: (color: string) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    },
    { 
      label: "Avg per Txn", 
      value: transactions.length ? `$${(totalUsdc / transactions.length).toFixed(4)}` : "$0", 
      color: "#06B6D4",
      icon: (color: string) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </svg>
      )
    },
    { 
      label: "High Frequency Task", 
      value: mostCommon ? TASK_LABELS[mostCommon[0] as TaskType] : "—", 
      color: "#F59E0B",
      icon: (color: string) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      )
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 24,
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: `linear-gradient(135deg, ${s.color}08, ${s.color}03)`,
            border: `1px solid ${s.color}15`,
            borderRadius: 14,
            padding: "18px",
          }}
        >
          <div style={{ marginBottom: 10 }}>{s.icon(s.color)}</div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: s.color,
              marginBottom: 4,
              letterSpacing: "-0.01em"
            }}
          >
            {s.value}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ArcReportViewerProps {
  transactions: Transaction[];
  totalUsdcSpent: number;
}

export default function ArcReportViewer({ transactions, totalUsdcSpent }: ArcReportViewerProps) {
  const [filterType, setFilterType] = useState<TaskType | "all">("all");
  const [filterAgent, setFilterAgent] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "amount">("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const taskTypes = useMemo<TaskType[]>(
    () => Array.from(new Set(transactions.map((t) => t.taskType))) as TaskType[],
    [transactions]
  );

  const agents = useMemo(
    () => Array.from(new Set(transactions.flatMap((t) => [t.from, t.to]))),
    [transactions]
  );

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filterType !== "all") list = list.filter((t) => t.taskType === filterType);
    if (filterAgent !== "all") list = list.filter((t) => t.from === filterAgent || t.to === filterAgent);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.txHash.toLowerCase().includes(q) ||
          t.from.includes(q) ||
          t.to.includes(q) ||
          TASK_LABELS[t.taskType].toLowerCase().includes(q)
      );
    }
    if (sortOrder === "newest") list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    else if (sortOrder === "oldest") list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    else if (sortOrder === "amount") list.sort((a, b) => b.amount - a.amount);
    return list;
  }, [transactions, filterType, filterAgent, sortOrder, searchQuery]);

  if (transactions.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 24px",
          background: "rgba(15,23,42,0.4)",
          border: "1px solid rgba(99,102,241,0.1)",
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div style={{ 
          width: 64, 
          height: 64, 
          borderRadius: 20, 
          background: "rgba(99,102,241,0.08)", 
          border: "1px solid rgba(99,102,241,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 8,
          }}
        >
          No Arc Reports Yet
        </div>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 360, margin: "0 auto", lineHeight: 1.6 }}>
          Run your first campaign to generate on-chain USDC transactions on Arc L1. Every agent payment creates a verifiable report.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ 
              width: 24, 
              height: 24, 
              borderRadius: 6, 
              background: "rgba(124,58,237,0.12)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em"
              }}
            >
              Arc L1 Report Viewer
            </h2>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 34 }}>
            Every agent action settled on-chain · Full transaction audit trail with explorer verification.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 18px",
            borderRadius: 12,
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.15)",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px #10B981" }} />
          <span style={{ fontSize: 12, color: "#34d399", fontWeight: 800, letterSpacing: "0.02em" }}>
            ${totalUsdcSpent.toFixed(4)} USDC SETTLED
          </span>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <SummaryBar transactions={transactions} />

      {/* ── Filters & Search ── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search hash, agent, task..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 36px",
              borderRadius: 10,
              border: "1px solid rgba(99,102,241,0.2)",
              background: "rgba(15,23,42,0.8)",
              color: "var(--text-primary)",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>

        {/* Task Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as TaskType | "all")}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(99,102,241,0.2)",
            background: "rgba(15,23,42,0.8)",
            color: "var(--text-primary)",
            fontSize: 13,
            cursor: "pointer",
            outline: "none"
          }}
        >
          <option value="all">All Tasks</option>
          {taskTypes.map((t) => (
            <option key={t} value={t}>
              {TASK_LABELS[t]}
            </option>
          ))}
        </select>

        {/* Agent Filter */}
        <select
          value={filterAgent}
          onChange={(e) => setFilterAgent(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(99,102,241,0.2)",
            background: "rgba(15,23,42,0.8)",
            color: "var(--text-primary)",
            fontSize: 13,
            cursor: "pointer",
            outline: "none"
          }}
        >
          <option value="all">All Agents</option>
          {agents.map((a) => (
            <option key={a} value={a} style={{ textTransform: "capitalize" }}>
              {a}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest" | "amount")}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(99,102,241,0.2)",
            background: "rgba(15,23,42,0.8)",
            color: "var(--text-primary)",
            fontSize: 13,
            cursor: "pointer",
            outline: "none"
          }}
        >
          <option value="newest">Recent First</option>
          <option value="oldest">Oldest First</option>
          <option value="amount">Value High-Low</option>
        </select>

        <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginLeft: "auto" }}>
          {filtered.length} of {transactions.length} records
        </span>
      </div>

      {/* ── Column Header ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "32px 1fr 1fr 100px 110px 80px 32px",
          gap: 14,
          padding: "10px 20px",
          marginBottom: 10,
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          borderBottom: "1px solid rgba(255,255,255,0.04)"
        }}
      >
        <div>#</div>
        <div>Activity Context</div>
        <div>Flow</div>
        <div style={{ textAlign: "right" }}>USDC</div>
        <div style={{ textAlign: "center" }}>Timestamp</div>
        <div>Status</div>
        <div />
      </div>

      {/* ── Transaction List ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              color: "var(--text-muted)",
              fontSize: 14,
              fontStyle: "italic"
            }}
          >
            No records match the active filters.
          </div>
        ) : (
          filtered.map((tx, i) => (
            <TransactionReportCard
              key={tx.id}
              tx={tx}
              index={filtered.length - i}
            />
          ))
        )}
      </div>

      {/* ── Footer Note ── */}
      <div
        style={{
          marginTop: 28,
          padding: "16px 20px",
          borderRadius: 14,
          background: "rgba(99,102,241,0.04)",
          border: "1px solid rgba(99,102,241,0.12)",
          fontSize: 12,
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          lineHeight: 1.6
        }}
      >
        <div style={{ 
          width: 20, 
          height: 20, 
          borderRadius: "50%", 
          background: "rgba(99,102,241,0.15)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          flexShrink: 0
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
        <span>
          Immutable ledger of all agent payments on <strong style={{ color: "var(--text-primary)" }}>Arc L1 (ChainID 1234)</strong>. 
          Auditable via <a href="https://explorer.arc.io" target="_blank" rel="noopener noreferrer" style={{ color: "#6366F1", fontWeight: 700, textDecoration: "none" }}>explorer.arc.io</a>. 
          Settlement executed via Circle Programmable Wallets.
        </span>
      </div>
    </div>
  );
}
