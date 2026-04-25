"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);

    const signupData = {
      company,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("brandagent_signup", JSON.stringify(signupData));

    setTimeout(() => {
      window.location.href = "/onboarding";
    }, 700);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.05),transparent_28%),radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_35%)]" />

      <div className="relative min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl rounded-[32px] border border-slate-200 bg-white/80 backdrop-blur-2xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="hidden lg:flex flex-col justify-between p-10 xl:p-14 border-r border-slate-200 bg-slate-50/50">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
                  Launch Your Brand • Arc L1 • Circle Settlement
                </div>

                <h1 className="mt-8 text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight text-slate-900">
                  Create Your
                  <br />
                  <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-emerald-600 bg-clip-text text-transparent">
                    Autonomous
                  </span>
                  <br />
                  Growth Engine
                </h1>

                <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">
                  Register your company, define your brand identity, and launch
                  AI-powered campaigns backed by blockchain micropayments and live
                  verification.
                </p>
              </div>

              <div className="space-y-4 mt-10">
                <FeatureRow title="AI Agent Orchestration" desc="Creator, Social, Verifier, Website, and Analytics agents working together." />
                <FeatureRow title="Circle Nanopayments" desc="Every completed task is settled through programmable USDC micropayments." />
                <FeatureRow title="Arc L1 Settlement" desc="Transparent, verifiable on-chain payment flow for agent incentives." />
              </div>
            </div>

            <div className="relative p-8 sm:p-10 lg:p-12 xl:p-14 flex items-center">
              <div className="w-full max-w-md mx-auto">
                <div className="mb-8">
                  <div className="text-sm uppercase tracking-[0.28em] text-emerald-600 font-semibold mb-3">
                    Create Account
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
                    Register Your Company
                  </h2>
                  <p className="mt-3 text-slate-600 leading-7">
                    Set up your team and continue to onboarding in one smooth flow.
                  </p>
                </div>

                <div className="space-y-5">
                  <InputField
                    label="Company Name"
                    type="text"
                    placeholder="Enter your company name"
                    value={company}
                    onChange={setCompany}
                  />

                  <InputField
                    label="Email"
                    type="email"
                    placeholder="founder@company.com"
                    value={email}
                    onChange={setEmail}
                  />

                  <InputField
                    label="Password"
                    type="password"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={setPassword}
                  />

                  <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 via-violet-600 to-fuchsia-600 px-4 py-3.5 text-lg font-semibold text-white shadow-md transition hover:scale-[1.01] hover:brightness-110 disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-semibold text-slate-800 mb-1">
                      What happens next?
                    </div>
                    <div className="text-sm text-slate-600 leading-6">
                      After signup, you’ll continue to onboarding to configure your
                      brand profile, website, and campaign preferences.
                    </div>
                  </div>

                  <p className="text-center text-sm text-slate-600">
                    Already have access?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-violet-600 hover:text-violet-700 transition"
                    >
                      Login here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureRow({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm leading-6 text-slate-600">{desc}</div>
    </div>
  );
}

function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <input
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-400/20"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}