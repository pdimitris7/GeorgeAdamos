// app/api/prints/all/route.ts
import { NextResponse } from "next/server";
import { getAllPrints } from "@/lib/sanity"; // server module

export const revalidate = 60;

export async function GET() {
  try {
    const data = await getAllPrints();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed" },
      { status: 500 }
    );
  }
}
