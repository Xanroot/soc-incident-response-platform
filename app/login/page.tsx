"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // Mock credentials
    if (
      (username === "analyst" && password === "analyst123") ||
      (username === "admin" && password === "admin123")
    ) {
      localStorage.setItem(
        "soc_user",
        JSON.stringify({ username })
      );
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6">
        {/* ---------- Header ---------- */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">
            🛡️ SOC Login
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Security Operations Center
          </p>
        </div>

        {/* ---------- Error ---------- */}
        {error && (
          <p className="text-red-400 text-sm text-center mb-3">
            {error}
          </p>
        )}

        {/* ---------- Form ---------- */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          >
            Login
          </button>
        </form>

        {/* ---------- Footer ---------- */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Demo access • analyst / analyst123
        </p>
      </div>
    </div>
  );
}
