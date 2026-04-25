"use client";

import type { Agent, Task } from "@/lib/types";
import { AGENT_COLORS } from "@/lib/constants";

interface AgentGridProps {
  agents: Agent[];
  tasks: Task[];
  onRefreshBalances: () => void;
  isRefreshingBalances: boolean;
}

function getAgentIcon(id: string) {
  const icons: Record<string, string> = {
    orchestrator: "🧠",
    creator: "✍️",
    website: "🌐",
    social: "📢",
    verifier: "🔍",
    analytics: "📊",
  };
  return icons[id] || "🤖";
}

function StatusBadge({ status }: { status: Agent["status"] }) {
  const config = {
    idle: { label: "Idle", cls: "badge-idle", dot: "pulse-dot-idle" },
    running: { label: "Running", cls: "badge-running", dot: "pulse-dot-running" },
    success: { label: "Done", cls: "badge-success", dot: "pulse-dot-success" },
    error: { label: "Error", cls: "badge-error", dot: "pulse-dot-error" },
    waiting: { label: "Waiting", cls: "badge-waiting", dot: "pulse-dot-idle" },
  };
  const c = config[status] || config.idle;
  return (
    <span className={`badge ${c.cls}`}>
      <span className={`pulse-dot ${c.dot}`} />
      {c.label}
    </span>
  );
}

function formatWalletAddress(address: string): string {
  if (!address) return "Unavailable";
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function AgentGrid({
  agents,
  tasks,
  onRefreshBalances,
  isRefreshingBalances,
}: AgentGridProps) {
  // Get last task per agent
  const lastTaskByAgent: Record<string, Task> = {};
  tasks.forEach((t) => {
    lastTaskByAgent[t.agentId] = t;
  });

  const taskCountByAgent: Record<string, number> = {};
  tasks.forEach((t) => {
    taskCountByAgent[t.agentId] = (taskCountByAgent[t.agentId] || 0) + 1;
  });

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>🤖 Agent Network</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          6 specialized agents · Each with dedicated Circle Programmable Wallet · All payments settle on Arc L1
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {agents.map((agent) => {
          const color = AGENT_COLORS[agent.id] || "#6366F1";
          const lastTask = lastTaskByAgent[agent.id];
          const taskCount = taskCountByAgent[agent.id] || 0;
          const isActive = agent.status === "running";

          return (
            <div
              key={agent.id}
              className="glass-card agent-card"
              style={{
                padding: 20,
                "--card-accent": `linear-gradient(90deg, ${color}, ${color}88)`,
              } as React.CSSProperties}
            >
              {/* Active glow ring */}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    inset: -1,
                    borderRadius: 16,
                    border: `2px solid ${color}60`,
                    boxShadow: `0 0 24px ${color}30`,
                    pointerEvents: "none",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
              )}

              {/* Header Row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: `${color}18`,
                      border: `1px solid ${color}35`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    {getAgentIcon(agent.id)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                      {agent.name}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>
                      Agent #{agent.id.toUpperCase().slice(0, 4)}
                    </div>
                  </div>
                </div>
                <StatusBadge status={agent.status} />
              </div>

              {/* Description */}
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 16 }}>
                {agent.description}
              </p>

              {/* Wallet Info */}
              <div
                style={{
                  padding: "10px 12px",
                  background: "rgba(0,211,149,0.06)",
                  border: "1px solid rgba(0,211,149,0.15)",
                  borderRadius: 10,
                  marginBottom: 14,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>Circle Wallet Balance</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#00D395" }}>
                    ${agent.usdcBalance.toFixed(4)} USDC
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Total Earned</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#34D399" }}>
                    +${agent.totalEarned.toFixed(4)} USDC
                  </span>
                </div>
              </div>

              {/* Task Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                <div
                  style={{
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 800, color }}>
                    {agent.tasksCompleted}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Tasks Done
                  </div>
                </div>
                <div
                  style={{
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#A78BFA" }}>
                    {taskCount}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    This Cycle
                  </div>
                </div>
              </div>

              {/* Last Task */}
              {lastTask && (
                <div
                  style={{
                    padding: "8px 12px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 11,
                    color: "var(--text-muted)",
                  }}
                >
                  <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Last: </span>
                  {lastTask.type.replace(/_/g, " ")}
                  {lastTask.txHash && (
                    <span
                      className="mono"
                      style={{
                        display: "block",
                        marginTop: 4,
                        fontSize: 10,
                        color: "#A78BFA",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lastTask.txHash.slice(0, 20)}...
                    </span>
                  )}
                </div>
              )}

              {/* Wallet Address + Balance */}
              <div
                style={{
                  marginTop: 12,
                  fontSize: 10,
                  color: "var(--text-muted)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: color,
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  <span className="mono" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {formatWalletAddress(agent.walletAddress)}
                  </span>
                </div>

                <div style={{ marginTop: 6, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                    Wallet Balance: <span style={{ color: "#00D395", fontWeight: 700 }}>${agent.usdcBalance.toFixed(2)} USDC</span>
                  </span>
                  <button
                    type="button"
                    onClick={onRefreshBalances}
                    disabled={isRefreshingBalances}
                    className="btn-outline"
                    style={{
                      fontSize: 10,
                      padding: "4px 8px",
                      opacity: isRefreshingBalances ? 0.7 : 1,
                    }}
                  >
                    {isRefreshingBalances ? "Refreshing..." : "↻ Refresh"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
