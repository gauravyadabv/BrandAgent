"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  Agent,
  CampaignCycle,
  Transaction,
  LogEntry,
  CampaignMetrics,
  Task,
} from "@/lib/types";
import AgentGrid from "@/components/AgentGrid";
import TransactionFeed from "@/components/TransactionFeed";
import KpiDashboard from "@/components/KpiDashboard";
import ActivityLog from "@/components/ActivityLog";
import BrandConfig from "@/components/BrandConfig";
import ContentPreview from "@/components/ContentPreview";
import Header from "@/components/Header";
import HeroStats from "@/components/HeroStats";
import AgentFlowDiagram from "@/components/AgentFlowDiagram";
import ArcReportViewer from "@/components/ArcReportViewer";
import { DEFAULT_BRAND } from "@/lib/constants";
import { resetAgentsToIdle, useDashboardStore } from "@/lib/store/dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  const brand = useDashboardStore((state) => state.brand);
  const setBrand = useDashboardStore((state) => state.setBrand);
  const agents = useDashboardStore((state) => state.agents);
  const setAgents = useDashboardStore((state) => state.setAgents);
  const campaign = useDashboardStore((state) => state.campaign);
  const setCampaign = useDashboardStore((state) => state.setCampaign);
  const transactions = useDashboardStore((state) => state.transactions);
  const setTransactions = useDashboardStore((state) => state.setTransactions);
  const logs = useDashboardStore((state) => state.logs);
  const setLogs = useDashboardStore((state) => state.setLogs);
  const tasks = useDashboardStore((state) => state.tasks);
  const setTasks = useDashboardStore((state) => state.setTasks);
  const metrics = useDashboardStore((state) => state.metrics);
  const setMetrics = useDashboardStore((state) => state.setMetrics);
  const isRunning = useDashboardStore((state) => state.isRunning);
  const setIsRunning = useDashboardStore((state) => state.setIsRunning);
  const activeTab = useDashboardStore((state) => state.activeTab);
  const setActiveTab = useDashboardStore((state) => state.setActiveTab);
  const totalCycles = useDashboardStore((state) => state.totalCycles);
  const incrementTotalCycles = useDashboardStore(
    (state) => state.incrementTotalCycles
  );
  const totalTxCount = useDashboardStore((state) => state.totalTxCount);
  const incrementTotalTxCount = useDashboardStore(
    (state) => state.incrementTotalTxCount
  );
  const totalUsdcSpent = useDashboardStore((state) => state.totalUsdcSpent);
  const incrementTotalUsdcSpent = useDashboardStore(
    (state) => state.incrementTotalUsdcSpent
  );

  const abortRef = useRef<AbortController | null>(null);
  const [isRefreshingBalances, setIsRefreshingBalances] = useState(false);

  useEffect(() => {
    const sessionRaw = localStorage.getItem("brandagent_session");
    const selectedCompanyRaw = localStorage.getItem("brandagent_selected_company");

    if (!sessionRaw) {
      router.replace("/login");
      return;
    }

    if (!selectedCompanyRaw) {
      router.replace("/companies");
      return;
    }

    try {
      const parsedBrand = JSON.parse(selectedCompanyRaw);

      if (parsedBrand) {
        setBrand({
          ...DEFAULT_BRAND,
          ...parsedBrand,
        });

        setLogs([]);
        setTasks([]);
        setTransactions([]);
        setMetrics(null);
        setCampaign(null);
        setIsRunning(false);
        setActiveTab("overview");
      }
    } catch (error) {
      console.error("Failed to parse selected company:", error);
      router.replace("/companies");
      return;
    }

    setAuthChecked(true);
  }, [
    router,
    setBrand,
    setLogs,
    setTasks,
    setTransactions,
    setMetrics,
    setCampaign,
    setIsRunning,
    setActiveTab,
  ]);

  const fetchAgentsFromApi = useCallback(async (): Promise<Agent[] | null> => {
    try {
      const response = await fetch("/api/agents", { cache: "no-store" });
      const payload = (await response.json()) as {
        success: boolean;
        data?: Agent[];
      };

      if (!response.ok || !payload.success || !payload.data) {
        return null;
      }

      return payload.data;
    } catch {
      return null;
    }
  }, []);

  const refreshAgentBalances = useCallback(async () => {
    if (isRefreshingBalances) return;

    setIsRefreshingBalances(true);

    try {
      const latestAgents = await fetchAgentsFromApi();
      if (!latestAgents) return;

      const latestById = Object.fromEntries(
        latestAgents.map((agent) => [agent.id, agent])
      );

      setAgents((prev) =>
        prev.map((agent) => {
          const latest = latestById[agent.id];
          if (!latest) return agent;

          return {
            ...agent,
            walletId: latest.walletId,
            walletAddress: latest.walletAddress,
            usdcBalance: latest.usdcBalance,
          };
        })
      );
    } finally {
      setIsRefreshingBalances(false);
    }
  }, [fetchAgentsFromApi, isRefreshingBalances, setAgents]);

  useEffect(() => {
    if (!authChecked) return;

    let isMounted = true;

    async function loadAgents() {
      const latestAgents = await fetchAgentsFromApi();
      if (!isMounted || !latestAgents) return;
      setAgents(latestAgents);
    }

    void loadAgents();

    return () => {
      isMounted = false;
    };
  }, [authChecked, fetchAgentsFromApi, setAgents]);

  const updateAgentStatus = useCallback(
    (task: Task) => {
      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.id === task.agentId) {
            const runningNow = task.status === "running";
            const isDone =
              task.status === "completed" || task.status === "failed";

            return {
              ...agent,
              status: runningNow ? "running" : isDone ? "success" : agent.status,
              tasksCompleted: isDone
                ? agent.tasksCompleted + 1
                : agent.tasksCompleted,
              lastActivity: new Date().toISOString(),
            };
          }

          return agent;
        })
      );
    },
    [setAgents]
  );

  const runCampaign = useCallback(async () => {
    if (isRunning) return;

    setIsRunning(true);
    setLogs([]);
    setTasks([]);
    setTransactions([]);
    setMetrics(null);

    setAgents((prev) => resetAgentsToIdle(prev, true));

    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/campaign/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand }),
        signal: abortRef.current.signal,
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const block of events) {
          const lines = block
            .split("\n")
            .filter((line) => line.startsWith("data: "));

          for (const line of lines) {
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
                incrementTotalTxCount();
                incrementTotalUsdcSpent(tx.amount);

                setAgents((prev) =>
                  prev.map((agent) => {
                    if (agent.id === tx.to) {
                      return {
                        ...agent,
                        totalEarned: agent.totalEarned + tx.amount,
                        usdcBalance: agent.usdcBalance + tx.amount,
                      };
                    }

                    if (agent.id === tx.from) {
                      return {
                        ...agent,
                        usdcBalance: Math.max(0, agent.usdcBalance - tx.amount),
                      };
                    }

                    return agent;
                  })
                );
              } else if (event.type === "metrics") {
                setMetrics(event.data as CampaignMetrics);
              } else if (event.type === "cycle_complete") {
                const cycle = event.data as CampaignCycle;
                setCampaign(cycle);
                incrementTotalCycles();
                setAgents((prev) => resetAgentsToIdle(prev));
              }
            } catch {
              // ignore malformed event blocks
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
      setAgents((prev) => resetAgentsToIdle(prev));
    }
  }, [
    brand,
    incrementTotalCycles,
    incrementTotalTxCount,
    incrementTotalUsdcSpent,
    isRunning,
    setAgents,
    setCampaign,
    setIsRunning,
    setLogs,
    setMetrics,
    setTasks,
    setTransactions,
    updateAgentStatus,
  ]);

  const stopCampaign = () => {
    abortRef.current?.abort();
  };

  const handleSwitchCompany = () => {
    router.push("/companies");
  };

  const handleLogout = () => {
    localStorage.removeItem("brandagent_session");
    localStorage.removeItem("brandagent_selected_company");
    localStorage.removeItem("brandagent_brand");
    sessionStorage.clear();
    router.replace("/login");
  };

  if (!authChecked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Checking session...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Header
        brand={brand}
        isRunning={isRunning}
        onRun={runCampaign}
        onStop={stopCampaign}
      />

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "16px 20px 40px",
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            background: "rgba(15,23,42,0.7)",
            border: "1px solid rgba(99,102,241,0.15)",
            borderRadius: 16,
            backdropFilter: "blur(20px)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              Active Workspace
            </div>

            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "var(--text-primary)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {brand.brand}
            </div>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                color: "var(--text-secondary)",
                fontSize: 13,
                alignItems: "center",
              }}
            >
              <span>{brand.industry || "General"}</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>{brand.website || "No website"}</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  color: "#34d399",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 5px #34d399", display: "inline-block" }} />
                Circle + Arc L1
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={handleSwitchCompany}
              className="btn-outline"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 3h5v5" />
                <path d="M4 20L21 3" />
                <path d="M21 16v5h-5" />
                <path d="M15 15l6 6" />
                <path d="M4 4l5 5" />
                <path d="M3 16v5h5" />
              </svg>
              Switch Company
            </button>

            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 12,
                border: "1px solid rgba(239,68,68,0.25)",
                background: "rgba(239,68,68,0.06)",
                color: "#f87171",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.12)";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.06)";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <HeroStats
          totalCycles={totalCycles}
          totalTxCount={totalTxCount}
          totalUsdcSpent={totalUsdcSpent}
          metrics={metrics}
          isRunning={isRunning}
        />

        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 20,
            borderBottom: "1px solid rgba(99,102,241,0.2)",
            width: "fit-content",
          }}
        >
          {(
            [
              { key: "overview",     label: "Overview" },
              { key: "agents",       label: "Agents" },
              { key: "transactions", label: "Transactions" },
              { key: "content",      label: "Content" },
              { key: "analytics",    label: "Analytics" },
              { key: "arc-reports",  label: "Arc Reports" },
              { key: "config",       label: "Config" },
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

        {activeTab === "overview" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "auto auto",
              gap: 16,
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <AgentFlowDiagram
                agents={agents}
                tasks={tasks}
                isRunning={isRunning}
              />
            </div>

            <div
              className="glass-card"
              style={{
                padding: 20,
                maxHeight: 420,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  Live Activity Log
                </h3>
                {isRunning && (
                  <span className="live-badge">
                    <span className="live-dot" />
                    Live
                  </span>
                )}
              </div>
              <ActivityLog logs={logs} />
            </div>

            <div
              className="glass-card"
              style={{
                padding: 20,
                maxHeight: 420,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  Arc L1 Transactions
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button 
                    onClick={() => setActiveTab("transactions")}
                    style={{ 
                      fontSize: 11, 
                      color: "var(--accent-indigo)", 
                      background: "none", 
                      border: "none", 
                      cursor: "pointer",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}
                  >
                    View All ↗
                  </button>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--accent-emerald)",
                      fontWeight: 600,
                    }}
                  >
                    {totalTxCount} on-chain
                  </span>
                </div>
              </div>
              <TransactionFeed transactions={transactions.slice(0, 30)} />
            </div>
          </div>
        )}

        {activeTab === "agents" && (
          <AgentGrid
            agents={agents}
            tasks={tasks}
            onRefreshBalances={refreshAgentBalances}
            isRefreshingBalances={isRefreshingBalances}
          />
        )}

        {activeTab === "transactions" && (
          <div className="glass-card" style={{ padding: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>
                  Recent Activity History
                </h3>
                <span className="arc-badge" style={{ fontSize: 10 }}>On-Chain Ledger</span>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span
                  style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}
                >
                  {totalTxCount} Verified TXS · Settled: ${totalUsdcSpent.toFixed(4)} USDC
                </span>
              </div>
            </div>
            <TransactionFeed transactions={transactions} showAll />
          </div>
        )}

        {activeTab === "content" && (
          <ContentPreview
            content={campaign?.content || []}
            tasks={tasks}
            isRunning={isRunning}
          />
        )}

        {activeTab === "analytics" && (
          <KpiDashboard
            metrics={metrics}
            campaign={campaign}
            transactions={transactions}
          />
        )}

        {activeTab === "arc-reports" && (
          <div className="glass-card" style={{ padding: 24 }}>
            <ArcReportViewer
              transactions={transactions}
              totalUsdcSpent={totalUsdcSpent}
            />
          </div>
        )}

        {activeTab === "config" && (
          <BrandConfig brand={brand} onUpdate={setBrand} />
        )}
      </div>
    </div>
  );
}