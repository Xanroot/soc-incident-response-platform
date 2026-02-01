import { NextResponse } from "next/server";
import { incidents } from "@/app/api/incidents/store";

export async function GET() {
  // Collect all timeline events with incident context
  const events = incidents.flatMap((incident) =>
    (incident.timeline ?? []).map((t) => ({
      incidentId: incident.id,
      title: incident.title,
      message: t.message,
      time: t.time,
    }))
  );

  // Sort newest first
  events.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  // Return latest 5 activities
  return NextResponse.json(events.slice(0, 5));
}
