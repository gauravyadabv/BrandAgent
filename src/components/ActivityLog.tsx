"use client";

import { useRef, useEffect } from "react";
import type { LogEntry } from "@/lib/types";

interface ActivityLogProps {
  logs: LogEntry[];
}

// Clean agent initials instead of emoji
const AGENT_ICONS: Record<string, (color: string) => React.ReactNode> = {
  orchestrator: (color) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  creator: (color) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M8.757 15.243l-2.121 2.121m0-10.607l2.121 2.121m7.071 7.071l2.121 2.121" />
    </svg>
  ),
  website: (color) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
    </svg>
  ),
  social: (color) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  ),
  verifier: (color) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  analytics: (color) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
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

function getLevelStyle(level: LogEntry["level"]) {
  const styles: Record<LogEntry["level"], { cls: string; indicator: string }> = {
    info:    { cls: "log-info",    indicator: "#4B5563" },
    success: { cls: "log-success", indicator: "#10B981" },
    warning: { cls: "log-warning", indicator: "#F59E0B" },
    error:   { cls: "log-error",   indicator: "#EF4444" },
    payment: { cls: "log-payment", indicator: "#00D395" },
  };
  return styles[level] || styles.info;
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function ActivityLog({ logs }: ActivityLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (logs.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          color: "var(--text-muted)",
          padding: "30px 0",
        }}
      >
        {/* Terminal/log icon */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
        <div style={{ fontSize: 13, fontWeight: 500 }}>Live activity will appear here</div>
        <div style={{ fontSize: 12 }}>Click &quot;Run Campaign&quot; to start the agent network</div>
      </div>
    );
  }

  return (
    <div
      id="activity-log"
      style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        paddingRight: 4,
      }}
    >
      {logs.map((log) => {
        const { cls, indicator } = getLevelStyle(log.level);
        const agentColor = log.agentId ? AGENT_COLORS[log.agentId] ?? "#64748B" : "#64748B";

        return (
          <div key={log.id} className={`log-entry ${cls}`}>
            {/* Level indicator dot */}
            <div
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: indicator,
                flexShrink: 0,
                marginTop: 7,
                boxShadow: `0 0 4px ${indicator}`,
              }}
            />

            {/* Timestamp */}
            <span
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              {formatTime(log.timestamp)}
            </span>

            {/* Agent badge */}
            {log.agentId && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 18,
                  borderRadius: 4,
                  background: `${agentColor}18`,
                  border: `1px solid ${agentColor}30`,
                  color: agentColor,
                  flexShrink: 0,
                }}
              >
                {AGENT_ICONS[log.agentId]?.(agentColor)}
              </span>
            )}

            {/* Message */}
            <span style={{ flex: 1, wordBreak: "break-word", lineHeight: 1.5 }}>
              {log.message}
            </span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
