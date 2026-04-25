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
          padding: "24px 24px 60px",
        }}
      >
        <div
          style={{
            padding: 20,
            marginBottom: 20,
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
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: 8,
              }}
            >
              Active Workspace
            </div>

            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "var(--text-primary)",
                lineHeight: 1.1,
              }}
            >
              {brand.brand}
            </div>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                color: "var(--text-secondary)",
                fontSize: 14,
              }}
            >
              <span>{brand.industry || "General"}</span>
              <span>•</span>
              <span>{brand.website || "No website"}</span>
              <span>•</span>
              <span style={{ color: "#34d399" }}>Circle + Arc L1 enabled</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={handleSwitchCompany}
              style={{
                padding: "12px 16px",
                borderRadius: 14,
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Switch Company
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: "12px 16px",
                borderRadius: 14,
                border: "1px solid rgba(239,68,68,0.22)",
                background: "rgba(239,68,68,0.10)",
                color: "#fecaca",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
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
            marginBottom: 28,
            borderBottom: "1px solid rgba(99,102,241,0.2)",
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

        {activeTab === "overview" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "auto auto",
              gap: 20,
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
                  🔴 Live Activity Log
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
                  ⛓️ Arc L1 Transactions
                </h3>
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
              <TransactionFeed transactions={transactions.slice(0, 8)} />
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
          <div className="glass-card" style={{ padding: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>
                ⛓️ On-Chain Transaction History
              </h2>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span
                  style={{ fontSize: 13, color: "var(--text-secondary)" }}
                >
                  {transactions.length} transactions · $
                  {totalUsdcSpent.toFixed(4)} USDC total
                </span>
                <span className="arc-badge">Arc L1</span>
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

        {activeTab === "config" && (
          <BrandConfig brand={brand} onUpdate={setBrand} />
        )}
      </div>
    </div>
  );
}