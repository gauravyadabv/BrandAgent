import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AGENT_DEFINITIONS, DEFAULT_BRAND } from "@/lib/constants";
import type {
  Agent,
  BrandProfile,
  CampaignCycle,
  CampaignMetrics,
  LogEntry,
  Task,
  Transaction,
} from "@/lib/types";

type ActiveTab = "overview" | "agents" | "transactions" | "content" | "analytics" | "arc-reports" | "config";

type DashboardStore = {
  brand: BrandProfile;
  agents: Agent[];
  campaign: CampaignCycle | null;
  transactions: Transaction[];
  logs: LogEntry[];
  tasks: Task[];
  metrics: CampaignMetrics | null;
  isRunning: boolean;
  activeTab: ActiveTab;
  totalCycles: number;
  totalTxCount: number;
  totalUsdcSpent: number;
  setBrand: (brand: BrandProfile) => void;
  setAgents: (updater: Agent[] | ((prev: Agent[]) => Agent[])) => void;
  setCampaign: (campaign: CampaignCycle | null) => void;
  setTransactions: (updater: Transaction[] | ((prev: Transaction[]) => Transaction[])) => void;
  setLogs: (updater: LogEntry[] | ((prev: LogEntry[]) => LogEntry[])) => void;
  setTasks: (updater: Task[] | ((prev: Task[]) => Task[])) => void;
  setMetrics: (metrics: CampaignMetrics | null) => void;
  setIsRunning: (value: boolean) => void;
  setActiveTab: (tab: ActiveTab) => void;
  incrementTotalCycles: () => void;
  incrementTotalTxCount: () => void;
  incrementTotalUsdcSpent: (amount: number) => void;
};

function createInitialAgents(): Agent[] {
  return AGENT_DEFINITIONS.map((definition) => ({
    ...definition,
    walletAddress: "",
    status: "idle",
    usdcBalance: 0,
    totalEarned: 0,
    tasksCompleted: 0,
    lastActivity: new Date().toISOString(),
  }));
}

export function resetAgentsToIdle(agents: Agent[], resetCompletedCount = false): Agent[] {
  return agents.map((agent) => ({
    ...agent,
    status: "idle",
    ...(resetCompletedCount ? { tasksCompleted: 0 } : {}),
  }));
}

export const useDashboardStore = create<DashboardStore>()(
  (set) => ({
    brand: DEFAULT_BRAND,
    agents: createInitialAgents(),
    campaign: null,
    transactions: [],
    logs: [],
    tasks: [],
    metrics: null,
    isRunning: false,
    activeTab: "overview",
    totalCycles: 0,
    totalTxCount: 0,
    totalUsdcSpent: 0,
    setBrand: (brand) => set({ brand }),
    setAgents: (updater) =>
      set((state) => ({
        agents: typeof updater === "function" ? updater(state.agents) : updater,
      })),
    setCampaign: (campaign) => set({ campaign }),
    setTransactions: (updater) =>
      set((state) => ({
        transactions:
          typeof updater === "function" ? updater(state.transactions) : updater,
      })),
    setLogs: (updater) =>
      set((state) => ({
        logs: typeof updater === "function" ? updater(state.logs) : updater,
      })),
    setTasks: (updater) =>
      set((state) => ({
        tasks: typeof updater === "function" ? updater(state.tasks) : updater,
      })),
    setMetrics: (metrics) => set({ metrics }),
    setIsRunning: (isRunning) => set({ isRunning }),
    setActiveTab: (activeTab) => set({ activeTab }),
    incrementTotalCycles: () => set((state) => ({ totalCycles: state.totalCycles + 1 })),
    incrementTotalTxCount: () => set((state) => ({ totalTxCount: state.totalTxCount + 1 })),
    incrementTotalUsdcSpent: (amount) =>
      set((state) => ({ totalUsdcSpent: state.totalUsdcSpent + amount })),
  })
);
