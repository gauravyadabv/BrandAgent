import type { BrandProfile, Agent } from "./types";

// ─── Default Brand Profile (Dabur India) ────────────────────────────────────
export const DEFAULT_BRAND: BrandProfile = {
  id: "dabur-india",
  brand: "Dabur India",
  website: "https://dabur.com",
  channels: {
    website: "https://dabur.com/blog",
    fb_page: "DaburIndia",
    instagram: "@daburindia",
    tiktok: "@dabur",
    x_twitter: "@DaburIndia",
    threads: "@daburindia",
  },
  brand_voice: "Ayurvedic, natural, family-first, trustworthy, warm",
  posting_schedule: {
    frequency: "2x_daily",
    times: ["09:00", "18:00"],
    timezone: "IST",
  },
  kpi_targets: {
    engagement_rate: 0.035,
    reach_growth_weekly: 0.05,
    website_traffic_ctr: 0.02,
  },
  usdc_budget_per_cycle: 0.025,
  max_daily_cycles: 4,
};

// ─── Agent Definitions ───────────────────────────────────────────────────────
export const AGENT_DEFINITIONS: Omit<
  Agent,
  "status" | "usdcBalance" | "totalEarned" | "tasksCompleted" | "lastActivity"
>[] = [
  {
    id: "orchestrator",
    name: "Orchestrator Agent",
    description: "CMO-level reasoning. Decomposes campaigns into tasks and manages all payments.",
    walletId: process.env.CIRCLE_ORCHESTRATOR_WALLET_ID || "wallet-orch-001",
    walletAddress: "0xORCH...0001",
  },
  {
    id: "creator",
    name: "Creator Agent",
    description: "Generates platform-native content using Gemini 3 Pro. Produces captions, hashtags, and image prompts.",
    walletId: process.env.CIRCLE_CREATOR_WALLET_ID || "wallet-crea-001",
    walletAddress: "0xCREA...0002",
  },
  {
    id: "website",
    name: "Website Agent",
    description: "Crawls brand website via Tinyfish. Extracts articles, verifies SEO health, surfaces content for cross-posting.",
    walletId: process.env.CIRCLE_WEBSITE_WALLET_ID || "wallet-web-001",
    walletAddress: "0xWEB...0003",
  },
  {
    id: "social",
    name: "Social Media Agent",
    description: "Posts content to all 6 platforms using Tinyfish + platform APIs. Extracts real-time KPIs.",
    walletId: process.env.CIRCLE_SOCIAL_WALLET_ID || "wallet-soc-001",
    walletAddress: "0xSOC...0004",
  },
  {
    id: "verifier",
    name: "Verifier Agent",
    description: "Confirms each post is live via DOM/screenshot check using Gemini Flash. Authorizes payment release.",
    walletId: process.env.CIRCLE_VERIFIER_WALLET_ID || "wallet-ver-001",
    walletAddress: "0xVER...0005",
  },
  {
    id: "analytics",
    name: "Analytics Agent",
    description: "Aggregates all KPI data and generates AI-powered performance reports using Gemini Flash.",
    walletId: process.env.CIRCLE_ANALYTICS_WALLET_ID || "wallet-ana-001",
    walletAddress: "0xANA...0006",
  },
];

// ─── Payment Amounts (USDC) ──────────────────────────────────────────────────
export const PAYMENT_AMOUNTS = {
  content_creation: 0.005,
  website_crawl: 0.002,
  social_post: 0.001,
  kpi_extraction: 0.001,
  post_verification: 0.001,
  analytics_report: 0.003,
} as const;

// ─── Arc L1 Config ───────────────────────────────────────────────────────────
export const ARC_CONFIG = {
  explorerUrl: "https://explorer.arc.io",
  rpcUrl: "https://rpc.arc.io",
  chainId: 1234,
  nativeCurrency: "USDC",
};

// ─── Platform Colors ─────────────────────────────────────────────────────────
export const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#E1306C",
  facebook: "#1877F2",
  x_twitter: "#000000",
  tiktok: "#010101",
  threads: "#101010",
  website: "#4F46E5",
};

// ─── Agent Colors ─────────────────────────────────────────────────────────────
export const AGENT_COLORS: Record<string, string> = {
  orchestrator: "#6366F1",
  creator: "#8B5CF6",
  website: "#06B6D4",
  social: "#10B981",
  verifier: "#F59E0B",
  analytics: "#EF4444",
};
