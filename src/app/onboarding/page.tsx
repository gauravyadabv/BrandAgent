"use client";

import { useEffect, useState } from "react";

type CompanyItem = {
  id: string;
  brand: string;
  industry: string;
  website: string;
  voice: string;
  budget: number;
  kpiTargets: {
    reach: number;
    engagementRate: number;
    followers: number;
  };
};

export default function OnboardingPage() {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    const savedSignup = localStorage.getItem("brandagent_signup");
    if (savedSignup) {
      try {
        const parsed = JSON.parse(savedSignup);
        if (parsed.company) setCompanyName(parsed.company);
      } catch {}
    }
  }, []);

  const handleContinue = async () => {
    const newCompany: CompanyItem = {
      id: `brand-${Date.now()}`,
      brand: companyName || "New Brand",
      industry: industry || "General",
      website: website || "https://example.com",
      voice: "Bold, modern, and trustworthy",
      budget: 100,
      kpiTargets: {
        reach: 50000,
        engagementRate: 0.035,
        followers: 1000,
      },
    };

    const savedCompanies = localStorage.getItem("brandagent_companies");
    let companies: CompanyItem[] = [];

    if (savedCompanies) {
      try {
        const parsed = JSON.parse(savedCompanies);
        if (Array.isArray(parsed)) companies = parsed;
      } catch {}
    }

    const existingIndex = companies.findIndex(
      (c) => c.brand.toLowerCase() === newCompany.brand.toLowerCase()
    );

    let updatedCompanies: CompanyItem[];

    if (existingIndex >= 0) {
      updatedCompanies = [...companies];
      updatedCompanies[existingIndex] = newCompany;
    } else {
      updatedCompanies = [...companies, newCompany];
    }

    localStorage.setItem(
      "brandagent_companies",
      JSON.stringify(updatedCompanies)
    );
    localStorage.setItem(
      "brandagent_selected_company",
      JSON.stringify(newCompany)
    );
    localStorage.setItem("brandagent_brand", JSON.stringify(newCompany));

    await fetch("/api/brands", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyName: newCompany.brand,
        industry: newCompany.industry,
        website: newCompany.website,
      }),
    });

    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.06),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.04),transparent_28%),radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_36%)]" />

      <div className="relative min-h-screen flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-5xl rounded-[32px] border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="hidden lg:flex flex-col justify-between p-10 xl:p-14 border-r border-slate-100 bg-slate-50">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
                  Company Onboarding
                </div>

                <h1 className="mt-8 text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight text-slate-900">
                  Build a New
                  <br />
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Brand Workspace
                  </span>
                </h1>

                <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">
                  Configure your company details and generate a new multi-agent
                  marketing workspace with blockchain settlement and
                  micropayment-ready orchestration.
                </p>
              </div>

              <div className="space-y-4 mt-10">
                <FeatureRow
                  title="Circle Settlement"
                  desc="USDC micropayments for autonomous task completion."
                />
                <FeatureRow
                  title="Arc L1"
                  desc="Transparent blockchain-backed execution layer."
                />
                <FeatureRow
                  title="Agentic Workflow"
                  desc="Creator, Website, Social, Verifier, and Analytics agents."
                />
              </div>
            </div>

            <div className="p-8 sm:p-10 lg:p-12 xl:p-14 flex items-center bg-white">
              <div className="w-full max-w-md mx-auto">
                <div className="mb-8">
                  <div className="text-sm uppercase tracking-[0.28em] text-indigo-600 font-semibold mb-3">
                    Onboarding
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
                    Company Setup
                  </h2>
                  <p className="mt-3 text-slate-500 leading-7">
                    Create a new company workspace and jump directly into the
                    dashboard.
                  </p>
                </div>

                <div className="space-y-5">
                  <InputField
                    label="Company Name"
                    type="text"
                    placeholder="Enter company name"
                    value={companyName}
                    onChange={setCompanyName}
                  />
                  <InputField
                    label="Industry"
                    type="text"
                    placeholder="e.g. FMCG, Sportswear, Wellness"
                    value={industry}
                    onChange={setIndustry}
                  />
                  <InputField
                    label="Website"
                    type="text"
                    placeholder="https://example.com"
                    value={website}
                    onChange={setWebsite}
                  />

                  <button
                    onClick={handleContinue}
                    className="w-full rounded-2xl bg-indigo-600 px-4 py-3.5 text-lg font-semibold text-white shadow-lg transition hover:bg-indigo-700 hover:scale-[1.01]"
                  >
                    Save and Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureRow({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm leading-6 text-slate-500">{desc}</div>
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
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}