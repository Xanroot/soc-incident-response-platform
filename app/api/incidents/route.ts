import { NextResponse } from "next/server";
import { incidents } from "./store";
import type { Incident } from "@/types/incident";

export async function GET() {
  return NextResponse.json(incidents);
}

export async function POST(req: Request) {
  const body = await req.json();

  const newIncident: Incident = {
    id: `INC-${Date.now()}`,
    alertId: body.alertId ?? "UNKNOWN",
    title: body.title ?? "Security Incident",
    severity: body.severity ?? "Medium",
    status: "Open",
    createdAt: new Date().toISOString(),

    // 🧑‍💻 Default analyst
    assignedAnalyst: "Unassigned",

    notes: "",
    timeline: [
      {
        time: new Date().toISOString(),
        message: "Incident created from alert",
      },
    ],
  };

  incidents.push(newIncident);

  return NextResponse.json(newIncident);
}
