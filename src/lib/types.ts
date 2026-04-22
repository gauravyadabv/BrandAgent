// ─── Brand Configuration ───────────────────────────────────────────────────
export interface BrandProfile {
  id: string;
  brand: string;
  website: string;
  channels: {
    website?: string;
    fb_page?: string;
    instagram?: string;
    tiktok?: string;
    x_twitter?: string;
    threads?: string;
  };
  brand_voice: string;
  posting_schedule: {
    frequency: string;
    times: string[];
    timezone: string;
  };
  kpi_targets: {
    engagement_rate: number;
    reach_growth_weekly: number;
    website_traffic_ctr: number;
  };
  usdc_budget_per_cycle: number;
  max_daily_cycles: number;
}

// ─── Agent Types ────────────────────────────────────────────────────────────
export type AgentId =
  | "orchestrator"
  | "creator"
  | "website"
  | "social"
  | "verifier"
  | "analytics";

export type AgentStatus = "idle" | "running" | "success" | "error" | "waiting";

export interface Agent {
  id: AgentId;
  name: string;
  description: string;
  walletId: string;
  walletAddress: string;
  status: AgentStatus;
  usdcBalance: number;
  totalEarned: number;
  tasksCompleted: number;
  lastActivity?: string;
}

// ─── Task Types ─────────────────────────────────────────────────────────────
export type TaskType =
  | "content_creation"
  | "website_crawl"
  | "social_post"
  | "kpi_extraction"
  | "post_verification"
  | "analytics_report";

export type TaskStatus = "pending" | "running" | "completed" | "failed";

export interface Task {
  id: string;
  type: TaskType;
  agentId: AgentId;
  status: TaskStatus;
  payload: Record<string, unknown>;
  result?: Record<string, unknown>;
  paymentAmount: number;
  txHash?: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

// ─── Content Types ──────────────────────────────────────────────────────────
export type Platform =
  | "instagram"
  | "facebook"
  | "x_twitter"
  | "tiktok"
  | "threads"
  | "website";

export interface GeneratedContent {
  platform: Platform;
  caption: string;
  hashtags: string[];
  imagePrompt: string;
  callToAction: string;
  tone: string;
  characterCount: number;
}

// ─── Campaign Types ─────────────────────────────────────────────────────────
export type CampaignStatus =
  | "idle"
  | "initializing"
  | "running"
  | "completed"
  | "failed";

export interface CampaignCycle {
  id: string;
  brandId: string;
  status: CampaignStatus;
  tasks: Task[];
  content: GeneratedContent[];
  metrics: CampaignMetrics;
  totalUsdcSpent: number;
  onChainTxCount: number;
  startedAt: string;
  completedAt?: string;
  logs: LogEntry[];
}

export interface CampaignMetrics {
  postsPublished: number;
  contentQualityScore: number;
  reachTotal: number;
  engagementRate: number;
  followerDelta: number;
  websiteCtr: number;
  usdcSpent: number;
  costPerPost: number;
  costPer1kReach: number;
  arcTransactions: number;
  postVerificationRate: number;
}

// ─── Transaction Types ───────────────────────────────────────────────────────
export interface Transaction {
  id: string;
  txHash: string;
  from: AgentId;
  to: AgentId;
  amount: number;
  currency: "USDC";
  taskType: TaskType;
  timestamp: string;
  status: "pending" | "confirmed" | "failed";
  arcExplorerUrl?: string;
  blockNumber?: number;
}

// ─── KPI / Analytics ────────────────────────────────────────────────────────
export interface KpiSnapshot {
  timestamp: string;
  platform: Platform;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  engagementRate: number;
  followerCount: number;
}

export interface WebsiteData {
  url: string;
  title: string;
  articles: { title: string; url: string; summary: string }[];
  seoScore: number;
  crawledAt: string;
}

// ─── Log Types ──────────────────────────────────────────────────────────────
export type LogLevel = "info" | "success" | "warning" | "error" | "payment";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  agentId?: AgentId;
  message: string;
  data?: Record<string, unknown>;
}

// ─── Dashboard State ─────────────────────────────────────────────────────────
export interface DashboardState {
  brand: BrandProfile | null;
  agents: Agent[];
  campaign: CampaignCycle | null;
  transactions: Transaction[];
  logs: LogEntry[];
  kpiHistory: KpiSnapshot[];
  isRunning: boolean;
}

// ─── API Responses ───────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── Payment Flow ───────────────────────────────────────────────────────────
export interface PaymentInstruction {
  from: AgentId;
  to: AgentId;
  amount: number;
  taskId: string;
  taskType: TaskType;
}

export interface PaymentResult {
  txHash: string;
  amount: number;
  timestamp: string;
  status: "confirmed";
  arcExplorerUrl: string;
}
