// app/api/media/all/route.ts
import { NextResponse } from "next/server";
import { getAllMediaPosts } from "@/lib/sanity.base";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getAllMediaPosts();
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
