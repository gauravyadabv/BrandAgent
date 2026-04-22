"use client";

import { useState } from "react";
import type { BrandProfile } from "@/lib/types";

interface BrandConfigProps {
  brand: BrandProfile;
  onUpdate: (brand: BrandProfile) => void;
}

export default function BrandConfig({ brand, onUpdate }: BrandConfigProps) {
  const [form, setForm] = useState<BrandProfile>(brand);
  const [saved, setSaved] = useState(false);

  const update = (path: string, value: string | number) => {
    setForm((prev) => {
      const clone = JSON.parse(JSON.stringify(prev)) as BrandProfile;
      const keys = path.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = clone;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  const save = async () => {
    onUpdate(form);
    await fetch("/api/brand", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => {});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--text-primary)",
    fontSize: 13,
    outline: "none",
    fontFamily: "Inter, sans-serif",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    color: "var(--text-muted)",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 6,
    display: "block",
  };

  const sectionStyle: React.CSSProperties = {
    padding: 20,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    marginBottom: 16,
  };

  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>⚙️ Brand Configuration</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
            Configure your FMCG brand profile. These settings control all agent behavior.
          </p>
        </div>
        <button
          id="btn-save-config"
          className="btn-primary"
          onClick={save}
          style={{
            background: saved
              ? "linear-gradient(135deg, #10B981, #34D399)"
              : undefined,
          }}
        >
          {saved ? "✅ Saved!" : "💾 Save Configuration"}
        </button>
      </div>

      {/* Brand Identity */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#818CF8" }}>🏢 Brand Identity</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={labelStyle}>Brand Name</label>
            <input
              id="input-brand-name"
              style={fieldStyle}
              value={form.brand}
              onChange={(e) => update("brand", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Website URL</label>
            <input
              id="input-brand-website"
              style={fieldStyle}
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Brand Voice</label>
            <input
              id="input-brand-voice"
              style={fieldStyle}
              value={form.brand_voice}
              onChange={(e) => update("brand_voice", e.target.value)}
              placeholder="e.g. Ayurvedic, natural, family-first, trustworthy, warm"
            />
          </div>
        </div>
      </div>

      {/* Social Channels */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#06B6D4" }}>📱 Social Channels</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {(["fb_page", "instagram", "x_twitter", "tiktok", "threads"] as const).map((ch) => (
            <div key={ch}>
              <label style={labelStyle}>{ch.replace("_", " ")}</label>
              <input
                id={`input-channel-${ch}`}
                style={fieldStyle}
                value={form.channels[ch] || ""}
                onChange={(e) => update(`channels.${ch}`, e.target.value)}
                placeholder={`@handle`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Posting Schedule */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#10B981" }}>📅 Posting Schedule</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          <div>
            <label style={labelStyle}>Frequency</label>
            <select
              id="input-posting-frequency"
              style={{ ...fieldStyle, appearance: "none" }}
              value={form.posting_schedule.frequency}
              onChange={(e) => update("posting_schedule.frequency", e.target.value)}
            >
              <option value="1x_daily">1x Daily</option>
              <option value="2x_daily">2x Daily</option>
              <option value="3x_daily">3x Daily</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Morning Post Time</label>
            <input
              id="input-time-morning"
              type="time"
              style={fieldStyle}
              value={form.posting_schedule.times[0]}
              onChange={(e) => {
                const times = [...form.posting_schedule.times];
                times[0] = e.target.value;
                update("posting_schedule.times", times.join(","));
              }}
            />
          </div>
          <div>
            <label style={labelStyle}>Evening Post Time</label>
            <input
              id="input-time-evening"
              type="time"
              style={fieldStyle}
              value={form.posting_schedule.times[1] || "18:00"}
              onChange={(e) => {
                const times = [...form.posting_schedule.times];
                times[1] = e.target.value;
                update("posting_schedule.times", times.join(","));
              }}
            />
          </div>
        </div>
      </div>

      {/* KPI Targets */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#F59E0B" }}>🎯 KPI Targets</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          <div>
            <label style={labelStyle}>Engagement Rate Target (%)</label>
            <input
              id="input-kpi-engagement"
              type="number"
              step="0.001"
              min="0"
              max="1"
              style={fieldStyle}
              value={form.kpi_targets.engagement_rate}
              onChange={(e) => update("kpi_targets.engagement_rate", parseFloat(e.target.value))}
            />
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
              Current: {(form.kpi_targets.engagement_rate * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <label style={labelStyle}>Weekly Reach Growth (%)</label>
            <input
              id="input-kpi-reach"
              type="number"
              step="0.001"
              min="0"
              max="1"
              style={fieldStyle}
              value={form.kpi_targets.reach_growth_weekly}
              onChange={(e) => update("kpi_targets.reach_growth_weekly", parseFloat(e.target.value))}
            />
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
              Current: {(form.kpi_targets.reach_growth_weekly * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <label style={labelStyle}>Website Traffic CTR (%)</label>
            <input
              id="input-kpi-ctr"
              type="number"
              step="0.001"
              min="0"
              max="1"
              style={fieldStyle}
              value={form.kpi_targets.website_traffic_ctr}
              onChange={(e) => update("kpi_targets.website_traffic_ctr", parseFloat(e.target.value))}
            />
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
              Current: {(form.kpi_targets.website_traffic_ctr * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Budget */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#00D395" }}>💵 USDC Budget</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={labelStyle}>USDC Budget per Cycle ($)</label>
            <input
              id="input-usdc-budget"
              type="number"
              step="0.001"
              min="0.001"
              style={fieldStyle}
              value={form.usdc_budget_per_cycle}
              onChange={(e) => update("usdc_budget_per_cycle", parseFloat(e.target.value))}
            />
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
              ~14 transactions per cycle at $0.001–$0.005 each
            </div>
          </div>
          <div>
            <label style={labelStyle}>Max Daily Cycles</label>
            <input
              id="input-max-cycles"
              type="number"
              min="1"
              max="10"
              style={fieldStyle}
              value={form.max_daily_cycles}
              onChange={(e) => update("max_daily_cycles", parseInt(e.target.value))}
            />
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
              {form.max_daily_cycles} cycles × $0.025 = ${(form.max_daily_cycles * 0.025).toFixed(3)} USDC/day
            </div>
          </div>
        </div>
      </div>

      {/* JSON Preview */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--text-secondary)" }}>
          📄 Brand Profile JSON
        </h3>
        <pre
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            background: "rgba(0,0,0,0.3)",
            padding: 14,
            borderRadius: 10,
            overflow: "auto",
            maxHeight: 200,
            lineHeight: 1.6,
          }}
        >
          {JSON.stringify(form, null, 2)}
        </pre>
      </div>
    </div>
  );
}
