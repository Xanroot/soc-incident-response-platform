import { NextResponse } from "next/server";
import alerts from "@/data/alerts.json";

export async function GET() {
  return NextResponse.json(alerts);
}
