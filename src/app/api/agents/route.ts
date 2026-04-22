/**
 * BrandAgent Agents API
 * 
 * Retrieves the status of all 6 autonomous agents:
 * 1. Orchestrator - Decomposes campaigns into tasks (Gemini 1.5 Pro)
 * 2. Creator - Generates platform-native content (Gemini 1.5 Pro)
 * 3. Website - Crawls brand website for fresh content (Tinyfish API)
 * 4. Social Media - Posts to all platforms and extracts KPIs (Tinyfish + platform APIs)
 * 5. Verifier - Confirms post delivery and authorizes payments (Gemini Flash)
 * 6. Analytics - Generates performance reports (Gemini Flash)
 * 
 * Each agent has a dedicated USDC wallet on Arc L1 for autonomous payments.
 */

import { NextResponse } from "next/server";
import { AGENT_DEFINITIONS } from "@/lib/constants";
import { getWalletBalance } from "@/lib/payments/circle";
import type { Agent } from "@/lib/types";

// ─── GET /api/agents ──────────────────────────────────────────────────────────
export async function GET() {
  try {
    const agents: Agent[] = await Promise.all(
      AGENT_DEFINITIONS.map(async (def) => {
        const balance = await getWalletBalance(def.walletId);
        return {
          ...def,
          status: "idle" as const,
          usdcBalance: balance,
          totalEarned: 0,
          tasksCompleted: 0,
          lastActivity: new Date().toISOString(),
        };
      })
    );

    return NextResponse.json({ success: true, data: agents });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
