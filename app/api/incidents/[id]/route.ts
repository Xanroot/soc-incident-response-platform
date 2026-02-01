import { NextResponse } from "next/server";
import { incidents } from "@/app/api/incidents/store";
import type { Incident } from "@/types/incident";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const incident = incidents.find((i: Incident) => i.id === id);

  if (!incident) {
    return NextResponse.json(
      { error: "Incident not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(incident);
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const incident = incidents.find((i: Incident) => i.id === id);

  if (!incident) {
    return NextResponse.json(
      { error: "Incident not found" },
      { status: 404 }
    );
  }

  // Ensure timeline exists
  incident.timeline = incident.timeline ?? [];

  /* ---------- Status Update ---------- */
  if (body.status) {
    incident.status = body.status;
    incident.timeline.push({
      time: new Date().toISOString(),
      message: `Status changed to ${body.status}`,
    });
  }

  /* ---------- Analyst Assignment ---------- */
  if (body.assignedAnalyst) {
    incident.assignedAnalyst = body.assignedAnalyst;
    incident.timeline.push({
      time: new Date().toISOString(),
      message: `Incident assigned to analyst ${body.assignedAnalyst}`,
    });
  }

  /* ---------- Analyst Notes Update ---------- */
  if (typeof body.notes === "string") {
    incident.notes = body.notes;
    incident.timeline.push({
      time: new Date().toISOString(),
      message: "Analyst notes updated",
    });
  }

  return NextResponse.json(incident);
}
