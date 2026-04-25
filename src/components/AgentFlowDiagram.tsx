"use client";

import type { Agent, Task } from "@/lib/types";
import { AGENT_COLORS } from "@/lib/constants";

interface AgentFlowDiagramProps {
  agents: Agent[];
  tasks: Task[];
  isRunning: boolean;
}

const AGENT_ICONS: Record<string, (color: string) => React.ReactNode> = {
  orchestrator: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  creator: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M8.757 15.243l-2.121 2.121m0-10.607l2.121 2.121m7.071 7.071l2.121 2.121" />
    </svg>
  ),
  website: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
    </svg>
  ),
  social: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  ),
  verifier: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  analytics: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
};

export default function AgentFlowDiagram({ agents, tasks, isRunning }: AgentFlowDiagramProps) {
  const agentById = Object.fromEntries(agents.map((a) => [a.id, a]));
  const lastTaskByAgent: Record<string, Task> = {};
  tasks.forEach((t) => { lastTaskByAgent[t.agentId] = t; });

  const workerIds = ["creator", "website", "social", "verifier", "analytics"];

  return (
    <div
      className="glass-card"
      style={{ padding: "16px 20px" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ 
              width: 20, 
              height: 20, 
              borderRadius: 6, 
              background: "rgba(99,102,241,0.15)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Agent Orchestration Flow</h3>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Real-time visualization of the multi-agent payment loop · All USDC settles on Arc L1
          </p>
        </div>
        {isRunning && (
          <div className="live-badge" style={{ padding: "4px 12px", gap: 6 }}>
            <span className="live-dot" />
            LIVE
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 10 }}>
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
                borderColor: isActive ? color : "rgba(99,102,241,0.15)",
                color: isActive ? color : "inherit",
                padding: "10px 14px",
                background: isActive ? "rgba(99,102,241,0.08)" : "transparent"
              }}
            >
              <div style={{ 
                width: 24, 
                height: 24, 
                borderRadius: 6, 
                background: `${color}15`, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: color,
                border: `1px solid ${color}30`
              }}>
                {AGENT_ICONS["orchestrator"](color)}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? color : "var(--text-primary)" }}>
                  Orchestrator
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>
                  ${orch?.usdcBalance?.toFixed(2) ?? "0.00"}
                </div>
              </div>
              {isActive && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 10, border: `2px solid ${color}`, animation: "pulseRing 1.5s infinite" }} />
              )}
            </div>
          );
        })()}

        {/* Arrow + payment label */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 10px", flexShrink: 0, width: 70 }}>
          <div style={{ fontSize: 9, color: "#00D395", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
            USDC Pay
          </div>
          <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none">
            <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(99,102,241,0.25)" strokeWidth="2" strokeDasharray="5,5" className={isRunning ? "animate-dash" : ""} />
            <path d="M92 5l8 5-8 5" fill="none" stroke="rgba(99,102,241,0.25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Worker Nodes */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
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
                  position: "relative",
                  flexDirection: "column",
                  gap: 8,
                  minWidth: 110,
                  padding: "12px",
                  borderColor: isActive ? color : isDone ? `${color}50` : "rgba(255,255,255,0.08)",
                  background: isActive ? `${color}08` : "transparent",
                  color: isActive ? color : "inherit",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ 
                    width: 20, 
                    height: 20, 
                    borderRadius: 5, 
                    background: `${color}15`, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    color: color,
                    border: `1px solid ${color}30`
                  }}>
                    {AGENT_ICONS[id]?.(color)}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? color : isDone ? color : "var(--text-primary)" }}>
                      {id.charAt(0).toUpperCase() + id.slice(1)}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
                      {isActive ? "Running" : isDone ? "Done" : "Idle"}
                    </div>
                  </div>
                  {isActive && (
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 10, border: `2px solid ${color}`, animation: "pulseRing 1.5s infinite", pointerEvents: "none" }} />
                  )}
                </div>

                {/* USDC earned */}
                {agent && agent.totalEarned > 0 && (
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#00D395",
                      background: "rgba(0,211,149,0.08)",
                      padding: "2px 8px",
                      borderRadius: 6,
                      textAlign: "center",
                      border: "1px solid rgba(0,211,149,0.15)"
                    }}
                  >
                    +${agent.totalEarned.toFixed(4)}
                  </div>
                )}

                {/* Last task type */}
                {lastTask && (
                  <div style={{ fontSize: 9, color: "var(--text-muted)", textAlign: "center", fontWeight: 500, opacity: 0.8 }}>
                    {lastTask.type.replace(/_/g, " ")}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Arrow */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 10px", flexShrink: 0, width: 70 }}>
          <div style={{ fontSize: 9, color: "#A78BFA", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
            Arc L1
          </div>
          <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none">
            <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(167,139,250,0.25)" strokeWidth="2" strokeDasharray="5,5" className={isRunning ? "animate-dash" : ""} />
            <path d="M92 5l8 5-8 5" fill="none" stroke="rgba(167,139,250,0.25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Arc L1 Settlement */}
        <div
          className="flow-node"
          style={{
            flexShrink: 0,
            flexDirection: "column",
            gap: 6,
            background: "rgba(124,58,237,0.06)",
            border: "1px solid rgba(124,58,237,0.25)",
            minWidth: 110,
            padding: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ 
              width: 22, 
              height: 22, 
              borderRadius: 6, 
              background: "rgba(124,58,237,0.12)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              flexShrink: 0
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                <line x1="6" y1="10" x2="6" y2="14" />
                <line x1="18" y1="10" x2="18" y2="14" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#A78BFA" }}>Arc L1</div>
              <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>Settlement</div>
            </div>
          </div>
          <div style={{ fontSize: 9, color: "#A78BFA", fontWeight: 700, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            USDC Native
          </div>
        </div>
      </div>

      {/* Bottom legend */}
      <div style={{ display: "flex", gap: 20, marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {[
          { color: "#00D395", label: "Circle Nanopayments" },
          { color: "#A78BFA", label: "Arc L1 Settlement" },
          { color: "#6366F1", label: "Gemini AI Workflow" },
          { color: "#06B6D4", label: "Autonomous Loop" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
