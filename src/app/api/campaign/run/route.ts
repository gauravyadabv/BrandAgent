import { NextRequest, NextResponse } from "next/server";
import { runCampaignCycle } from "@/lib/campaign/orchestrator";
import type { BrandProfile } from "@/lib/types";
import { DEFAULT_BRAND } from "@/lib/constants";

// ─── POST /api/campaign/run ─────────────────────────────────a──────────────────
// Launches a full autonomous campaign cycle with streaming Server-Sent Events.
// The client listens on this stream to get real-time agent updates.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const brand: BrandProfile = body.brand || DEFAULT_BRAND;

    // ─── Streaming SSE Response ──────────────────────────────────────────────
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: unknown) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        };

        try {
          await runCampaignCycle(brand, (event) => {
            send(event);
          });
        } catch (err) {
          send({ type: "error", data: { message: String(err) } });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "BrandAgent Campaign API — POST to run a campaign cycle"
  });
}
