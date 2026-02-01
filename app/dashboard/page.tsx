"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "../components/AuthGuard";

/* ---------- Types ---------- */
type Metrics = {
  totalIncidents: number;
  open: number;
  inProgress: number;
  closed: number;
};

type Activity = {
  incidentId: string;
  title: string;
  message: string;
  time: string;
};

/* ---------- Page ---------- */
export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/metrics")
      .then((res) => res.json())
      .then(setMetrics);

    fetch("/api/dashboard/activity")
      .then((res) => res.json())
      .then(setActivity);
  }, []);

  if (!metrics) {
    return <p className="text-gray-500 p-6">Loading dashboard...</p>;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ---------- Header ---------- */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">🛡️ SOC Dashboard</h1>
              <p className="text-sm text-gray-600">
                Security Operations Center – Incident Overview
              </p>
            </div>

            {/* ---------- Navigation ---------- */}
            <div className="flex gap-3">
              <Link
                href="/alerts"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Alerts
              </Link>

              <Link
                href="/incidents"
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Incidents
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem("soc_user");
                  window.location.href = "/login";
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>

          {/* ---------- Metrics ---------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard title="Total Incidents" value={metrics.totalIncidents} />
            <DashboardCard title="Open" value={metrics.open} color="red" />
            <DashboardCard
              title="In Progress"
              value={metrics.inProgress}
              color="yellow"
            />
            <DashboardCard title="Closed" value={metrics.closed} color="green" />
          </div>

          {/* ---------- Recent Activity ---------- */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-3">Recent Activity</h2>

            {activity.length === 0 && (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}

            <ul className="space-y-3">
              {activity.map((a, i) => (
                <li
                  key={i}
                  className="border-l-4 border-blue-500 pl-3 text-sm"
                >
                  <p className="font-medium">{a.title}</p>
                  <p className="text-gray-600">{a.message}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(a.time).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- LOWER DASHBOARD SECTION ---------- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ---------- SOC Quick Insights ---------- */}
            <div className="bg-white rounded shadow p-4">
              <h2 className="font-semibold mb-3">SOC Quick Insights</h2>

              {metrics.totalIncidents === 0 ? (
                <p className="text-sm text-gray-600">
                  ✅ No active incidents detected. Environment appears stable.
                </p>
              ) : (
                <ul className="list-disc ml-5 text-sm text-gray-600 space-y-2">
                  <li>{metrics.open} incident(s) require immediate attention</li>
                  <li>{metrics.inProgress} incident(s) under investigation</li>
                  <li>{metrics.closed} incident(s) successfully resolved</li>
                </ul>
              )}
            </div>

            {/* ---------- Incident Status Summary ---------- */}
            <div className="bg-white rounded shadow p-4">
              <h2 className="font-semibold mb-3">Incident Status Summary</h2>

              <StatusBar
                label="Open"
                value={metrics.open}
                total={metrics.totalIncidents}
                color="bg-red-500"
              />
              <StatusBar
                label="In Progress"
                value={metrics.inProgress}
                total={metrics.totalIncidents}
                color="bg-yellow-400"
              />
              <StatusBar
                label="Closed"
                value={metrics.closed}
                total={metrics.totalIncidents}
                color="bg-green-500"
              />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

/* ---------- Card Component ---------- */
function DashboardCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color?: "red" | "yellow" | "green";
}) {
  const styles = {
    red: "border-l-4 border-red-600 text-red-600",
    yellow: "border-l-4 border-yellow-500 text-yellow-600",
    green: "border-l-4 border-green-600 text-green-600",
  };

  return (
    <div
      className={`bg-white rounded shadow p-4 ${
        color ? styles[color] : ""
      }`}
    >
      <p className="text-gray-500 text-sm uppercase tracking-wide">
        {title}
      </p>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}

/* ---------- Status Bar ---------- */
function StatusBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percent = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded h-2">
        <div
          className={`${color} h-2 rounded`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
