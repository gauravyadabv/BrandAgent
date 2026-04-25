import { NextRequest, NextResponse } from "next/server";

type BrandRecord = {
  id: string;
  companyName: string;
  industry: string;
  website: string;
  createdAt: string;
};

let brands: BrandRecord[] = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    brands,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const companyName = String(body.companyName || "").trim();
    const industry = String(body.industry || "").trim();
    const website = String(body.website || "").trim();

    if (!companyName) {
      return NextResponse.json(
        { success: false, error: "Company name is required." },
        { status: 400 }
      );
    }

    const newBrand: BrandRecord = {
      id: Date.now().toString(),
      companyName,
      industry,
      website,
      createdAt: new Date().toISOString(),
    };

    brands.push(newBrand);

    return NextResponse.json({
      success: true,
      message: "Brand profile created successfully.",
      brand: newBrand,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create brand profile.",
        details: String(error),
      },
      { status: 500 }
    );
  }
}