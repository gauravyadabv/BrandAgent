import type { BrandProfile } from "@/lib/types";
import { runCampaignCycle, type CycleEvent } from "@/lib/campaign/orchestrator";

export async function runCampaignForBrand(
  brand: BrandProfile,
  onEvent?: (event: CycleEvent) => void
) {
  const cycle = await runCampaignCycle(brand, (event) => {
    if (onEvent) onEvent(event);
  });

  return {
    success: cycle.status === "completed",
    cycle,
    logs: cycle.logs,
    transactions: cycle.tasks
      .filter((task) => task.txHash)
      .map((task) => ({
        agent: task.agentId,
        taskType: task.type,
        txHash: task.txHash,
        amount: task.paymentAmount,
      })),
    metrics: cycle.metrics,
    totalTxCount: cycle.onChainTxCount,
    totalUsdcSpent: cycle.totalUsdcSpent,
    blockchain: "ARC L1",
    settlement: "Circle",
    micropaymentModel: "Nanopayments",
  };
}