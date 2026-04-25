import type { Transaction, AgentId, TaskType } from "../types";

const AGENT_IDS: AgentId[] = ["orchestrator", "creator", "website", "social", "verifier", "analytics"];
const TASK_TYPES: TaskType[] = [
  "content_creation",
  "website_crawl",
  "social_post",
  "kpi_extraction",
  "post_verification",
  "analytics_report",
];

function generateHash() {
  return "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

export const HACKATHON_SEED_TRANSACTIONS: Transaction[] = Array.from({ length: 50 }, (_, i) => {
  const taskType = TASK_TYPES[i % TASK_TYPES.length];
  let from: AgentId = "orchestrator";
  let to: AgentId = "creator";

  if (taskType === "content_creation") { from = "orchestrator"; to = "creator"; }
  else if (taskType === "website_crawl") { from = "orchestrator"; to = "website"; }
  else if (taskType === "social_post") { from = "orchestrator"; to = "social"; }
  else if (taskType === "post_verification") { from = "social"; to = "verifier"; }
  else if (taskType === "analytics_report") { from = "verifier"; to = "analytics"; }
  else if (taskType === "kpi_extraction") { from = "analytics"; to = "orchestrator"; }

  const timestamp = new Date(Date.now() - (50 - i) * 1000 * 60 * 15).toISOString(); // Every 15 mins
  const txHash = generateHash();

  return {
    id: `tx-seed-${i}`,
    txHash,
    from,
    to,
    amount: parseFloat((Math.random() * 0.04 + 0.005).toFixed(4)),
    currency: "USDC" as const,
    taskType,
    timestamp,
    status: "confirmed" as const,
    arcExplorerUrl: `https://explorer.arc.io/tx/${txHash}`,
    blockNumber: 1245000 + i,
  };
}).reverse(); // Most recent first
