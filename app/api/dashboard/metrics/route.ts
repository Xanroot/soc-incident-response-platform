import { NextResponse } from "next/server";
import { incidents } from "@/app/api/incidents/store";

export async function GET() {
  const total = incidents.length;

  const open = incidents.filter(i => i.status === "Open").length;
  const inProgress = incidents.filter(i => i.status === "In Progress").length;
  const closed = incidents.filter(i => i.status === "Closed").length;

  return NextResponse.json({
    totalIncidents: total,
    open,
    inProgress,
    closed,
  });
}
