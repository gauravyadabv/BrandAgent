"use client";

import { useRef, useEffect } from "react";
import type { LogEntry } from "@/lib/types";

interface ActivityLogProps {
  logs: LogEntry[];
}

function getAgentIcon(id?: string) {
  const icons: Record<string, string> = {
    orchestrator: "🧠",
    creator: "✍️",
    website: "🌐",
    social: "📢",
    verifier: "🔍",
    analytics: "📊",
  };
  return id ? (icons[id] || "🤖") : "ℹ️";
}

function getLevelStyle(level: LogEntry["level"]) {
  const styles: Record<LogEntry["level"], { cls: string; indicator: string }> = {
    info: { cls: "log-info", indicator: "#4B5563" },
    success: { cls: "log-success", indicator: "#10B981" },
    warning: { cls: "log-warning", indicator: "#F59E0B" },
    error: { cls: "log-error", indicator: "#EF4444" },
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
          gap: 12,
          color: "var(--text-muted)",
          padding: "30px 0",
        }}
      >
        <div style={{ fontSize: 32 }}>🔴</div>
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

        return (
          <div key={log.id} className={`log-entry ${cls}`}>
            {/* Indicator */}
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

            {/* Agent Icon */}
            {log.agentId && (
              <span
                style={{
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {getAgentIcon(log.agentId)}
              </span>
            )}

            {/* Message */}
            <span
              style={{
                flex: 1,
                wordBreak: "break-word",
                lineHeight: 1.5,
              }}
            >
              {log.message}
            </span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
