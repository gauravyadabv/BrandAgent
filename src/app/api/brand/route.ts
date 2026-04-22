/**
 * BrandAgent Brand Configuration API
 * 
 * Endpoints for managing brand profiles. In production, this would integrate
 * with a database (Supabase, Firebase, etc.). Currently stores in memory.
 * 
 * GET  - Retrieve current brand profile
 * PUT  - Update brand configuration (channels, KPI targets, budget, etc.)
 */

import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_BRAND } from "@/lib/constants";
import type { BrandProfile } from "@/lib/types";

// In-memory brand store (production would use a DB)
let currentBrand: BrandProfile = DEFAULT_BRAND;

export async function GET() {
  return NextResponse.json({ success: true, data: currentBrand });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    currentBrand = { ...currentBrand, ...body };
    return NextResponse.json({ success: true, data: currentBrand });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 400 }
    );
  }
}
