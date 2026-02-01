"use client";

import { useEffect, useState } from "react";

/* ---------- Correct Alert Type ---------- */
type Alert = {
  id: string;
  title: string;
  source: string;
  severity: string;
  description: string;
  createdAt: string;
};

export default function AlertsTable() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetch("/api/alerts")
      .then((res) => res.json())
      .then((data) => setAlerts(data));
  }, []);

  async function createIncident(alertItem: Alert) {
    await fetch("/api/incidents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        alertId: alertItem.id,
        title: alertItem.title,        // ✅ FIXED
        severity: alertItem.severity,
      }),
    });

    window.alert("Incident created successfully");
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Alert ID</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Source</th>
            <th className="p-2 border">Severity</th>
            <th className="p-2 border">Created</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id} className="hover:bg-gray-50">
              <td className="p-2 border font-mono text-blue-600">
                {alert.id}
              </td>

              <td className="p-2 border">{alert.title}</td>

              <td className="p-2 border">{alert.source}</td>

              <td className="p-2 border font-semibold">
                {alert.severity}
              </td>

              <td className="p-2 border text-sm text-gray-500">
                {new Date(alert.createdAt).toLocaleString()}
              </td>

              <td className="p-2 border">
                <button
                  onClick={() => createIncident(alert)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Create Incident
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
