"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type {
  Agent,
  CampaignCycle,
  Transaction,
  LogEntry,
  BrandProfile,
  CampaignMetrics,
  Task,
} from "@/lib/types";
import { DEFAULT_BRAND, AGENT_DEFINITIONS } from "@/lib/constants";
import AgentGrid from "@/components/AgentGrid";
import TransactionFeed from "@/components/TransactionFeed";
import KpiDashboard from "@/components/KpiDashboard";
import ActivityLog from "@/components/ActivityLog";
import BrandConfig from "@/components/BrandConfig";
import ContentPreview from "@/components/ContentPreview";
import Header from "@/components/Header";
import HeroStats from "@/components/HeroStats";
import AgentFlowDiagram from "@/components/AgentFlowDiagram";

export default function Dashboard() {
  const [brand, setBrand] = useState<BrandProfile>(DEFAULT_BRAND);
  const [agents, setAgents] = useState<Agent[]>(
    AGENT_DEFINITIONS.map((d) => ({
      ...d,
      status: "idle",
      usdcBalance: 0.25,
      totalEarned: 0,
      tasksCompleted: 0,
      lastActivity: new Date().toISOString(),
    }))
  );
  const [campaign, setCampaign] = useState<CampaignCycle | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "agents" | "transactions" | "content" | "analytics" | "config"
  >("overview");
  const [totalCycles, setTotalCycles] = useState(0);
  const [totalTxCount, setTotalTxCount] = useState(0);
  const [totalUsdcSpent, setTotalUsdcSpent] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  // ── Update agent status based on running tasks ───────────────────────────
  const updateAgentStatus = useCallback(
    (task: Task) => {
      setAgents((prev) =>
        prev.map((a) => {
          if (a.id === task.agentId) {
            const isRunning = task.status === "running";
            const isDone = task.status === "completed" || task.status === "failed";
            return {
              ...a,
              status: isRunning ? "running" : isDone ? "success" : a.status,
              tasksCompleted: isDone ? a.tasksCompleted + 1 : a.tasksCompleted,
              lastActivity: new Date().toISOString(),
            };
          }
          return a;
        })
      );
    },
    []
  );

  // ── Run Campaign ─────────────────────────────────────────────────────────
  const runCampaign = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    setTasks([]);
    setTransactions([]);
    setMetrics(null);

    // Reset agents to idle
    setAgents((prev) =>
      prev.map((a) => ({ ...a, status: "idle", tasksCompleted: 0 }))
    );

    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/campaign/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand }),
        signal: abortRef.current.signal,
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event = JSON.parse(line.slice(6));

              if (event.type === "log") {
                const log = event.data as LogEntry;
                setLogs((prev) => [...prev.slice(-199), log]);
              } else if (event.type === "task_update") {
                const task = event.data as Task;
                setTasks((prev) => {
                  const existing = prev.findIndex((t) => t.id === task.id);
                  if (existing >= 0) {
                    const next = [...prev];
                    next[existing] = task;
                    return next;
                  }
                  return [...prev, task];
                });
                updateAgentStatus(task);
              } else if (event.type === "transaction") {
                const tx = event.data as Transaction;
                setTransactions((prev) => [tx, ...prev.slice(0, 99)]);
                setTotalTxCount((n) => n + 1);
                setTotalUsdcSpent((n) => n + tx.amount);
                // Update agent wallet balance
                setAgents((prev) =>
                  prev.map((a) => {
                    if (a.id === tx.to) {
                      return {
                        ...a,
                        totalEarned: a.totalEarned + tx.amount,
                        usdcBalance: a.usdcBalance + tx.amount,
                      };
                    }
                    if (a.id === tx.from) {
                      return {
                        ...a,
                        usdcBalance: Math.max(0, a.usdcBalance - tx.amount),
                      };
                    }
                    return a;
                  })
                );
              } else if (event.type === "metrics") {
                setMetrics(event.data as CampaignMetrics);
              } else if (event.type === "cycle_complete") {
                const cycle = event.data as CampaignCycle;
                setCampaign(cycle);
                setTotalCycles((n) => n + 1);
                // Reset agents to idle
                setAgents((prev) =>
                  prev.map((a) => ({ ...a, status: "idle" }))
                );
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Campaign error:", err);
      }
    } finally {
      setIsRunning(false);
      setAgents((prev) => prev.map((a) => ({ ...a, status: "idle" })));
    }
  }, [isRunning, brand, updateAgentStatus]);

  const stopCampaign = () => {
    abortRef.current?.abort();
  };

  // ── Summary stats ─────────────────────────────────────────────────────────
  const sessionStats = {
    totalCycles,
    totalTxCount,
    totalUsdcSpent,
    avgEngagement: metrics?.engagementRate
      ? (metrics.engagementRate * 100).toFixed(2) + "%"
      : "—",
    totalReach: metrics?.reachTotal?.toLocaleString() || "—",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Header
        brand={brand}
        isRunning={isRunning}
        totalTxCount={totalTxCount}
        onRun={runCampaign}
        onStop={stopCampaign}
      />

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 24px 60px" }}>

        {/* ── Hero Stats Bar ───────────────────────────────────────────── */}
        <HeroStats
          totalCycles={totalCycles}
          totalTxCount={totalTxCount}
          totalUsdcSpent={totalUsdcSpent}
          metrics={metrics}
          isRunning={isRunning}
        />

        {/* ── Tab Navigation ───────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 28,
            padding: "6px",
            background: "rgba(17,24,39,0.6)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            width: "fit-content",
          }}
        >
          {(
            [
              { key: "overview", label: "⚡ Overview" },
              { key: "agents", label: "🤖 Agents" },
              { key: "transactions", label: "💸 Transactions" },
              { key: "content", label: "✍️ Content" },
              { key: "analytics", label: "📊 Analytics" },
              { key: "config", label: "⚙️ Config" },
            ] as { key: typeof activeTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ──────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "auto auto",
              gap: 20,
            }}
          >
            {/* Agent Flow Diagram */}
            <div style={{ gridColumn: "1 / -1" }}>
              <AgentFlowDiagram agents={agents} tasks={tasks} isRunning={isRunning} />
            </div>

            {/* Activity Log */}
            <div className="glass-card" style={{ padding: 20, maxHeight: 420, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>🔴 Live Activity Log</h3>
                {isRunning && (
                  <span className="live-badge">
                    <span className="live-dot" />
                    Live
                  </span>
                )}
              </div>
              <ActivityLog logs={logs} />
            </div>

            {/* Transaction Feed */}
            <div className="glass-card" style={{ padding: 20, maxHeight: 420, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>⛓️ Arc L1 Transactions</h3>
                <span style={{ fontSize: 12, color: "var(--accent-emerald)", fontWeight: 600 }}>
                  {totalTxCount} on-chain
                </span>
              </div>
              <TransactionFeed transactions={transactions.slice(0, 8)} />
            </div>
          </div>
        )}

        {activeTab === "agents" && (
          <AgentGrid agents={agents} tasks={tasks} />
        )}

        {activeTab === "transactions" && (
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>⛓️ On-Chain Transaction History</h2>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {transactions.length} transactions · ${totalUsdcSpent.toFixed(4)} USDC total
                </span>
                <span className="arc-badge">Arc L1</span>
              </div>
            </div>
            <TransactionFeed transactions={transactions} showAll />
          </div>
        )}

        {activeTab === "content" && (
          <ContentPreview content={campaign?.content || []} tasks={tasks} isRunning={isRunning} />
        )}

        {activeTab === "analytics" && (
          <KpiDashboard metrics={metrics} campaign={campaign} totalUsdcSpent={totalUsdcSpent} transactions={transactions} />
        )}

        {activeTab === "config" && (
          <BrandConfig brand={brand} onUpdate={setBrand} />
        )}
      </div>
    </div>
  );
}
