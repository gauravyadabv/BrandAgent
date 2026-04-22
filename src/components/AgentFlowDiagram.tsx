"use client";

import type { Agent, Task } from "@/lib/types";
import { AGENT_COLORS } from "@/lib/constants";

interface AgentFlowDiagramProps {
  agents: Agent[];
  tasks: Task[];
  isRunning: boolean;
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

export default function AgentFlowDiagram({ agents, tasks, isRunning }: AgentFlowDiagramProps) {
  const agentById = Object.fromEntries(agents.map((a) => [a.id, a]));
  const lastTaskByAgent: Record<string, Task> = {};
  tasks.forEach((t) => { lastTaskByAgent[t.agentId] = t; });

  const workerIds = ["creator", "website", "social", "verifier", "analytics"];

  return (
    <div
      className="glass-card"
      style={{ padding: 24 }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>⚡ Agent Orchestration Flow</h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Real-time visualization of the multi-agent payment loop · All USDC settles on Arc L1
          </p>
        </div>
        {isRunning && (
          <div className="live-badge">
            <span className="live-dot" />
            LIVE
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
        {/* Orchestrator Node */}
        {(() => {
          const orch = agentById["orchestrator"];
          const color = AGENT_COLORS["orchestrator"];
          const isActive = orch?.status === "running";
          return (
            <div
              className={`flow-node ${isActive ? "active" : ""}`}
              style={{
                flexShrink: 0,
                borderColor: isActive ? color : undefined,
                background: isActive ? `${color}15` : undefined,
                boxShadow: isActive ? `0 0 20px ${color}30` : undefined,
              }}
            >
              <span style={{ fontSize: 18 }}>🧠</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? color : "var(--text-primary)" }}>
                  Orchestrator
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Gemini 1.5 Pro</div>
              </div>
              {isActive && (
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, animation: "pulse 1.5s infinite" }} />
              )}
            </div>
          );
        })()}

        {/* Arrow + payment label */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 4px", flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: "#00D395", fontWeight: 600, whiteSpace: "nowrap", marginBottom: 4 }}>
            USDC Pay
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: 18, lineHeight: 1 }}>→</div>
        </div>

        {/* Worker Nodes */}
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {workerIds.map((id) => {
            const agent = agentById[id];
            const color = AGENT_COLORS[id];
            const isActive = agent?.status === "running";
            const isDone = agent?.status === "success";
            const lastTask = lastTaskByAgent[id];

            return (
              <div
                key={id}
                className={`flow-node ${isActive ? "active" : ""}`}
                style={{
                  flexDirection: "column",
                  gap: 6,
                  minWidth: 100,
                  borderColor: isActive ? color : isDone ? `${color}50` : undefined,
                  background: isActive ? `${color}15` : isDone ? `${color}08` : undefined,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{getAgentIcon(id)}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? color : isDone ? color : "var(--text-primary)" }}>
                      {id.charAt(0).toUpperCase() + id.slice(1)}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {isActive ? "Running" : isDone ? "✓ Done" : "Idle"}
                    </div>
                  </div>
                  {isActive && (
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, animation: "pulse 1s infinite", marginLeft: "auto" }} />
                  )}
                </div>

                {/* USDC earned */}
                {agent && agent.totalEarned > 0 && (
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#00D395",
                      background: "rgba(0,211,149,0.1)",
                      padding: "2px 6px",
                      borderRadius: 4,
                      textAlign: "center",
                    }}
                  >
                    +${agent.totalEarned.toFixed(4)}
                  </div>
                )}

                {/* Last task type */}
                {lastTask && (
                  <div style={{ fontSize: 9, color: "var(--text-muted)", textAlign: "center" }}>
                    {lastTask.type.replace(/_/g, " ")}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Arrow */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 4px", flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: "#A78BFA", fontWeight: 600, whiteSpace: "nowrap", marginBottom: 4 }}>
            Arc L1
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: 18, lineHeight: 1 }}>→</div>
        </div>

        {/* Arc L1 Settlement */}
        <div
          className="flow-node"
          style={{
            flexShrink: 0,
            flexDirection: "column",
            gap: 4,
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.3)",
            minWidth: 100,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>⛓️</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#A78BFA" }}>Arc L1</div>
              <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Settlement</div>
            </div>
          </div>
          <div style={{ fontSize: 10, color: "#A78BFA", fontWeight: 600, textAlign: "center" }}>
            USDC Native
          </div>
        </div>
      </div>

      {/* Bottom legend */}
      <div style={{ display: "flex", gap: 20, marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
        {[
          { color: "#00D395", label: "Circle Nanopayments" },
          { color: "#A78BFA", label: "Arc L1 Settlement" },
          { color: "#6366F1", label: "Gemini AI Reasoning" },
          { color: "#06B6D4", label: "Tinyfish Automation" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
