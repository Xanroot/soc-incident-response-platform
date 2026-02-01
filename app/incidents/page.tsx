"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "../components/AuthGuard";

/* ---------- Types ---------- */
type Incident = {
  id: string;
  title: string;
  severity: string;
  status: string;
  createdAt: string;
  assignedAnalyst?: string;
};

/* ---------- Page ---------- */
export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    fetch("/api/incidents")
      .then((res) => res.json())
      .then(setIncidents);
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Incidents</h1>

          {incidents.length === 0 && (
            <p className="text-gray-500">
              No incidents created yet
            </p>
          )}

          <ul className="space-y-3">
            {incidents.map((incident) => (
              <li
                key={incident.id}
                className="bg-white border rounded p-4 hover:bg-gray-50"
              >
                <Link
                  href={`/incidents/${incident.id}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {incident.title}
                </Link>

                <div className="mt-1 text-sm text-gray-600">
                  <span className="mr-4">
                    <strong>Severity:</strong> {incident.severity}
                  </span>

                  <span className="mr-4">
                    <strong>Status:</strong> {incident.status}
                  </span>

                  <span>
                    <strong>Analyst:</strong>{" "}
                    {incident.assignedAnalyst ? (
                      incident.assignedAnalyst
                    ) : (
                      <span className="italic text-gray-400">
                        Unassigned
                      </span>
                    )}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AuthGuard>
  );
}
