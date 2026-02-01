"use client";

import AlertsTable from "@/components/alerts/AlertsTable";
import AuthGuard from "../components/AuthGuard";

export default function AlertsPage() {
  return (
    <AuthGuard>
      <div>
        <h1 className="text-2xl font-bold mb-2">Alerts</h1>
        <p className="text-gray-600 mb-4">
          SOC alert triage view (simulated SIEM data)
        </p>
        <AlertsTable />
      </div>
    </AuthGuard>
  );
}
