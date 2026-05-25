"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Alerts", path: "/alerts" },
  { name: "Incidents", path: "/incidents" },
  { name: "AI Analysis", path: "/ai-analysis" },
  { name: "Playbooks", path: "/playbooks" }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white p-4">
      <h1 className="text-xl font-bold mb-6">SOC AI IR</h1>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block px-3 py-2 rounded 
              ${pathname === item.path ? "bg-slate-700" : "hover:bg-slate-800"}`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
