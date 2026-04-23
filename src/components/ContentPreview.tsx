"use client";

import Image from "next/image";
import { useState } from "react";
import type { GeneratedContent, Task } from "@/lib/types";
import { PLATFORM_COLORS } from "@/lib/constants";

interface ContentPreviewProps {
  content: GeneratedContent[];
  tasks: Task[];
  isRunning: boolean;
}

function getPlatformIcon(platform: string) {
  const icons: Record<string, string> = {
    instagram: "📸",
    facebook: "👥",
    x_twitter: "🐦",
    tiktok: "🎵",
    threads: "🧵",
    website: "🌐",
  };
  return icons[platform] || "📱";
}

export default function ContentPreview({ content, tasks, isRunning }: ContentPreviewProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const postedPlatforms = new Set(
    tasks
      .filter((task) => task.type === "social_post" && task.status === "completed")
      .map((task) => String(task.payload.platform))
  );
  const generatedPlatforms = new Set(
    tasks
      .filter((task) => task.type === "content_creation" && task.status === "completed")
      .map((task) => String(task.payload.platform))
  );

  if (content.length === 0) {
    return (
      <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>AI-Generated Content</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>
          The Creator Agent uses Gemini 2.5 Flash Lite to generate platform-native content
          tailored to your brand voice, channel format, and KPI targets.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {["Instagram", "Facebook", "X/Twitter", "TikTok", "Threads"].map((p) => (
            <div
              key={p}
              style={{
                padding: "6px 14px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const selectedContent = selected ? content.find((c) => c.platform === selected) : content[0];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16 }}>
      {/* Platform List */}
      <div className="glass-card" style={{ padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 12, padding: "0 4px" }}>
          Platforms
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {content.map((c) => {
            const color = PLATFORM_COLORS[c.platform] || "#6366F1";
            const isActive = (selected || content[0].platform) === c.platform;
            return (
              <button
                key={c.platform}
                onClick={() => setSelected(c.platform)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  background: isActive ? `${color}15` : "transparent",
                  border: `1px solid ${isActive ? color + "40" : "transparent"}`,
                  borderRadius: 10,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  boxShadow: isActive ? `0 0 20px ${color}30` : "none",
                }}
              >
                <span style={{ fontSize: 18 }}>{getPlatformIcon(c.platform)}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? color : "var(--text-primary)", textTransform: "capitalize" }}>
                    {c.platform.replace("_", " ")}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    {c.characterCount} chars
                  </div>
                </div>
                {isActive && (
                  <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: color }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Detail */}
      {selectedContent && (
        <div className="glass-card" style={{ padding: 24 }}>
          {/* Platform Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${PLATFORM_COLORS[selectedContent.platform]}20`,
                border: `1px solid ${PLATFORM_COLORS[selectedContent.platform]}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              {getPlatformIcon(selectedContent.platform)}
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, textTransform: "capitalize" }}>
                {selectedContent.platform.replace("_", " ")} Post
              </h3>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Tone: {selectedContent.tone} · {selectedContent.characterCount} characters
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <span className={`badge ${generatedPlatforms.has(selectedContent.platform) ? "badge-success" : ""}`}>
                {generatedPlatforms.has(selectedContent.platform) ? "✓ Generated" : "Generating..."}
              </span>
              <span className={`badge ${postedPlatforms.has(selectedContent.platform) ? "badge-success" : ""}`}>
                {postedPlatforms.has(selectedContent.platform)
                  ? "✓ Posted"
                  : isRunning
                    ? "Posting..."
                    : "Pending Post"}
              </span>
            </div>
          </div>

          {selectedContent.generatedImageUrl && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                Generated Visual
              </div>
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <Image
                  src={selectedContent.generatedImageUrl}
                  alt={`${selectedContent.platform} creative`}
                  width={1200}
                  height={630}
                  unoptimized
                  style={{ display: "block", width: "100%", maxHeight: 360, objectFit: "cover" }}
                />
              </div>
            </div>
          )}

          {/* Caption */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Caption
            </div>
            <div
              style={{
                padding: 16,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                fontSize: 13,
                color: "var(--text-primary)",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {selectedContent.caption}
            </div>
          </div>

          {/* Hashtags */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Hashtags ({selectedContent.hashtags.length})
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {selectedContent.hashtags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "4px 10px",
                    background: `${PLATFORM_COLORS[selectedContent.platform]}15`,
                    border: `1px solid ${PLATFORM_COLORS[selectedContent.platform]}30`,
                    borderRadius: 999,
                    fontSize: 11,
                    color: PLATFORM_COLORS[selectedContent.platform] || "#818CF8",
                    fontWeight: 500,
                  }}
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>

          {/* CTA + Image Prompt */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                Call to Action
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 10,
                  fontSize: 13,
                  color: "#818CF8",
                  fontWeight: 600,
                }}
              >
                {selectedContent.callToAction}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                Image Prompt
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {selectedContent.imagePrompt}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
