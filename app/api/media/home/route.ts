// app/api/media/home/route.ts
import { NextResponse } from "next/server";
import { getHomeMediaPosts } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getHomeMediaPosts();
    // Προαιρετικό debug:
    // console.log("API /media/home ->", data.map(d => ({title: d.title, showOnHome: d.showOnHome})));
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
