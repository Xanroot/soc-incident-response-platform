"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "../../components/AuthGuard";

/* ---------- Static Analyst List ---------- */
const ANALYSTS = ["Xohel", "zxlfxqar", "xanxekftw"];

/* ---------- Use Case Context ---------- */
const USE_CASE_CONTEXT: Record<string, Record<string, string>> = {
  Phishing: {
    "Attack Vector": "Email",
    "User Interaction": "Required",
    "Primary Risk": "Credential Theft",
    "Detection Source": "Email Gateway / Azure AD",
    "MITRE Tactic": "Initial Access",
  },
  Malware: {
    "Attack Vector": "Endpoint",
    "Execution Method": "Malicious Binary / Script",
    "Primary Risk": "System Compromise",
    "Detection Source": "EDR / Antivirus",
    "MITRE Tactic": "Execution",
  },
  Bruteforce: {
    "Attack Vector": "Network",
    "Authentication Target": "VPN / AD / SSH",
    "Primary Risk": "Account Compromise",
    "Detection Source": "Network IDS / Firewall",
    "MITRE Tactic": "Credential Access",
  },
};

/* ---------- Types ---------- */
type TimelineEvent = {
  time: string;
  message: string;
};

type Incident = {
  id: string;
  title: string;
  severity: string;
  status: "Open" | "In Progress" | "Closed";
  createdAt: string;
  assignedAnalyst?: string;
  notes?: string;
  timeline?: TimelineEvent[];
};

/* ---------- Page ---------- */
export default function IncidentDetailsPage() {
  const params = useParams();
  const incidentId = params?.id as string;

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!incidentId) return;

    fetch(`/api/incidents/${incidentId}`)
      .then((res) => res.json())
      .then((data) => {
        setIncident(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [incidentId]);

  async function updateStatus(newStatus: "In Progress" | "Closed") {
    const res = await fetch(`/api/incidents/${incidentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    const updated = await res.json();
    setIncident(updated);
  }

  if (loading) {
    return <p className="text-gray-500 p-6">Loading incident...</p>;
  }

  if (!incident) {
    return <p className="text-red-600 p-6">Incident not found</p>;
  }

  /* ---------- Infer Use Case ---------- */
  const useCase =
    incident.title.toLowerCase().includes("phishing")
      ? "Phishing"
      : incident.title.toLowerCase().includes("malware")
      ? "Malware"
      : incident.title.toLowerCase().includes("bruteforce")
      ? "Bruteforce"
      : null;

  const contextData = useCase ? USE_CASE_CONTEXT[useCase] : null;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* ---------- Breadcrumb ---------- */}
          <nav className="text-sm text-gray-600">
            <Link href="/dashboard" className="hover:underline text-blue-600">
              Dashboard
            </Link>{" "}
            →{" "}
            <Link href="/incidents" className="hover:underline text-blue-600">
              Incidents
            </Link>{" "}
            → <span className="text-gray-800 font-medium">Incident</span>
          </nav>

          {/* ---------- Summary ---------- */}
          <div className="bg-white rounded shadow p-4">
            <h1 className="text-2xl font-bold">{incident.title}</h1>
            <p className="text-gray-600">Incident ID: {incident.id}</p>
          </div>

          {/* ---------- Status ---------- */}
          <div className="bg-white rounded shadow p-4 flex flex-wrap gap-6">
            <p><strong>Status:</strong> {incident.status}</p>
            <p><strong>Severity:</strong> {incident.severity}</p>
            <p><strong>Assigned Analyst:</strong> {incident.assignedAnalyst ?? "Unassigned"}</p>
            <p><strong>Created:</strong> {new Date(incident.createdAt).toLocaleString()}</p>
          </div>

          {/* ---------- Actions ---------- */}
          <div className="bg-white rounded shadow p-4 flex gap-4">
            {incident.status === "Open" && (
              <button
                onClick={() => updateStatus("In Progress")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Start Investigation
              </button>
            )}

            {incident.status !== "Closed" && (
              <button
                onClick={() => updateStatus("Closed")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Close Incident
              </button>
            )}
          </div>

          {/* ---------- Use Case Context ---------- */}
          {contextData && (
            <div className="bg-blue-50 border border-blue-200 rounded shadow p-4">
              <h2 className="font-semibold text-blue-800 mb-2">
                Use Case Context ({useCase})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {Object.entries(contextData).map(([key, value]) => (
                  <div key={key} className="flex">
                    <span className="font-medium text-gray-700 w-44">
                      {key}:
                    </span>
                    <span className="text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------- Analyst Assignment ---------- */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">Assign Analyst</h2>

            <select
              className="border rounded p-2"
              value={incident.assignedAnalyst ?? "Unassigned"}
              onChange={async (e) => {
                const res = await fetch(`/api/incidents/${incidentId}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ assignedAnalyst: e.target.value }),
                });

                const updated = await res.json();
                setIncident(updated);
              }}
            >
              <option value="Unassigned">Unassigned</option>
              {ANALYSTS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* ---------- Analyst Notes ---------- */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">Analyst Notes</h2>

            <textarea
              className="w-full border rounded p-2 min-h-30"
              placeholder="Add investigation notes..."
              value={incident.notes ?? ""}
              onChange={(e) =>
                setIncident({ ...incident, notes: e.target.value })
              }
            />

            <button
              onClick={async () => {
                const res = await fetch(`/api/incidents/${incidentId}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ notes: incident.notes }),
                });

                const updated = await res.json();
                setIncident(updated);
              }}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Notes
            </button>
          </div>

          {/* ---------- Timeline ---------- */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">Incident Timeline</h2>

            {(!incident.timeline || incident.timeline.length === 0) && (
              <p className="text-gray-500 text-sm">No timeline events yet</p>
            )}

            <ul className="border-l pl-4 space-y-3">
              {incident.timeline?.map((event, index) => (
                <li key={index}>
                  <span className="text-sm text-gray-500">
                    {new Date(event.time).toLocaleString()}
                  </span>
                  <p>{event.message}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </AuthGuard>
  );
}
