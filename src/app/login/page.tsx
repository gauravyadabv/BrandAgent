"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@brandagent.ai");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const session = {
      isLoggedIn: true,
      email,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem("brandagent_session", JSON.stringify(session));

    setTimeout(() => {
      window.location.href = "/companies";
    }, 700);
  };

  return (
    <main className="min-h-screen bg-[#0A0F1C] text-white relative overflow-hidden flex items-center justify-center py-8">
      {/* Background glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-[400px] px-4">
        <div className="rounded-[24px] border border-indigo-500/20 bg-slate-900/60 backdrop-blur-2xl shadow-2xl shadow-indigo-500/10 p-6 sm:p-8">
          <div className="flex justify-center mb-5">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 p-2.5 shadow-lg shadow-indigo-500/30">
              <span className="text-xl">🤖</span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.3em] text-indigo-400 font-bold">
              Welcome Back
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Login to BrandAgent
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Sign in to access your workspace.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:scale-[1.01] hover:brightness-110 disabled:opacity-70 mt-1"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
            <div className="font-semibold text-emerald-400 mb-0.5">
              Demo Access
            </div>
            <div className="opacity-80">Email: demo@brandagent.ai</div>
            <div className="opacity-80">Password: 123456</div>
          </div>

          <div className="mt-5 text-center text-xs text-slate-500">
            New company?{" "}
            <Link
              href="/signup"
              className="text-indigo-400 font-semibold hover:text-indigo-300"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}