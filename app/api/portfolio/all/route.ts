// app/api/portfolio/all/route.ts
import { NextResponse } from "next/server";
import { getAllPortfolioProjects } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getAllPortfolioProjects();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed" },
      { status: 500 }
    );
  }
}
