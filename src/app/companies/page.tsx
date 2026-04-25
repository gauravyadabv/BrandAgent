"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

type BrandProfile = {
  id: string;
  brand: string;
  industry: string;
  website: string;
  channels: {
    website: string;
    fb_page: string;
    instagram: string;
    tiktok: string;
    x_twitter: string;
    threads: string;
  };
  brand_voice: string;
  posting_schedule: {
    frequency: string;
    times: string[];
    timezone: string;
  };
  kpi_targets: {
    engagement_rate: number;
    reach_growth_weekly: number;
    website_traffic_ctr: number;
  };
  usdc_budget_per_cycle: number;
  max_daily_cycles: number;
};

const defaultCompanies: CompanyItem[] = [
  {
    id: "dabur-india",
    brand: "Dabur India",
    industry: "Ayurvedic FMCG",
    website: "https://www.dabur.com",
    voice: "Natural, trusted, family-focused",
    budget: 100,
    kpiTargets: { reach: 50000, engagementRate: 0.035, followers: 1000 },
  },
  {
    id: "mamaearth",
    brand: "Mamaearth",
    industry: "Beauty & Personal Care",
    website: "https://mamaearth.in",
    voice: "Fresh, modern, eco-conscious",
    budget: 120,
    kpiTargets: { reach: 65000, engagementRate: 0.04, followers: 1200 },
  },
  {
    id: "himalaya",
    brand: "Himalaya Wellness",
    industry: "Healthcare & Wellness",
    website: "https://himalayawellness.in",
    voice: "Clean, herbal, credible",
    budget: 110,
    kpiTargets: { reach: 55000, engagementRate: 0.032, followers: 900 },
  },
  {
    id: "nike",
    brand: "Nike",
    industry: "Sportswear",
    website: "https://nike.com",
    voice: "Bold, energetic, performance-driven",
    budget: 150,
    kpiTargets: { reach: 80000, engagementRate: 0.045, followers: 1500 },
  },
];

function slugifyHandle(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function mapCompanyToBrandProfile(company: CompanyItem): BrandProfile {
  const handle = slugifyHandle(company.brand);

  return {
    id: company.id,
    brand: company.brand,
    industry: company.industry,
    website: company.website,
    channels: {
      website: company.website,
      fb_page: handle,
      instagram: `@${handle}`,
      tiktok: `@${handle}`,
      x_twitter: `@${handle}`,
      threads: `@${handle}`,
    },
    brand_voice: company.voice,
    posting_schedule: {
      frequency: "2x_daily",
      times: ["09:00", "18:00"],
      timezone: "IST",
    },
    kpi_targets: {
      engagement_rate: company.kpiTargets.engagementRate,
      reach_growth_weekly: 0.05,
      website_traffic_ctr: 0.02,
    },
    usdc_budget_per_cycle: Math.max(company.budget / 1000, 0.025),
    max_daily_cycles: 4,
  };
}

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<CompanyItem[]>([]);

  useEffect(() => {
    const sessionRaw = localStorage.getItem("brandagent_session");

    if (!sessionRaw) {
      router.replace("/login");
      return;
    }

    const saved = localStorage.getItem("brandagent_companies");

    if (!saved) {
      localStorage.setItem(
        "brandagent_companies",
        JSON.stringify(defaultCompanies)
      );
      setCompanies(defaultCompanies);
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setCompanies(parsed);
      } else {
        localStorage.setItem(
          "brandagent_companies",
          JSON.stringify(defaultCompanies)
        );
        setCompanies(defaultCompanies);
      }
    } catch {
      localStorage.setItem(
        "brandagent_companies",
        JSON.stringify(defaultCompanies)
      );
      setCompanies(defaultCompanies);
    }
  }, [router]);

  const handleSelectCompany = (company: CompanyItem) => {
    const fullBrandProfile = mapCompanyToBrandProfile(company);

    localStorage.setItem(
      "brandagent_selected_company",
      JSON.stringify(fullBrandProfile)
    );
    localStorage.setItem(
      "brandagent_brand",
      JSON.stringify(fullBrandProfile)
    );

    router.push("/dashboard");
  };

  const handleRegisterNew = () => {
    router.push("/onboarding");
  };

  const handleLogout = () => {
    localStorage.removeItem("brandagent_session");
    localStorage.removeItem("brandagent_selected_company");
    localStorage.removeItem("brandagent_brand");
    sessionStorage.clear();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_20%)]" />

      <div className="relative mx-auto w-full max-w-[1380px] px-6 sm:px-8 py-6 lg:py-8">
        <div className="mx-auto max-w-[1240px]">
          {/* Compact Header Section */}
          <div className="rounded-[24px] border border-indigo-500/20 bg-slate-900/50 backdrop-blur-md shadow-xl p-5 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                  Multi-Brand Workspace
                </div>

                <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Select a Company
                </h1>

                <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-400">
                  Select a brand workspace or register a new company to launch autonomous AI campaigns.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                <button
                  onClick={handleRegisterNew}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
                >
                  Register New Company
                </button>

                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-slate-700 bg-slate-800/50 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Compact Grid Section */}
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {companies.map((company) => (
               <div
                 key={company.id}
                 className="flex flex-col rounded-[22px] border border-slate-800 bg-slate-900/60 backdrop-blur-sm shadow-lg transition hover:border-indigo-500/50 hover:shadow-indigo-500/10 overflow-hidden"
               >
                 <div className="p-5 md:p-6 flex-1 flex flex-col">
                   <div className="flex items-start justify-between gap-3 mb-5">
                     <div className="min-w-0">
                       <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
                         {company.brand}
                       </h2>
                       <p className="mt-0.5 text-xs font-medium text-slate-500">
                         {company.industry}
                       </p>
                     </div>

                     <span className="shrink-0 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                       ARC L1
                     </span>
                   </div>

                   <div className="flex flex-col gap-3.5 mb-5">
                     <InfoRow label="Website" value={company.website} />
                     <InfoRow label="Voice" value={company.voice} />
                     <InfoRow label="Budget" value={`$${company.budget}`} />
                   </div>

                   <div className="mt-auto pt-5 border-t border-slate-800/60 grid grid-cols-3 gap-2.5">
                     <MiniStat
                       label="Reach"
                       value={`${Math.round(company.kpiTargets.reach / 1000)}k`}
                     />
                     <MiniStat
                       label="ER"
                       value={`${(company.kpiTargets.engagementRate * 100).toFixed(1)}%`}
                     />
                     <MiniStat
                       label="Goal"
                       value={`+${company.kpiTargets.followers}`}
                     />
                   </div>
                 </div>

                 <button
                   onClick={() => handleSelectCompany(company)}
                   className="w-full flex items-center justify-between border-t border-indigo-500/10 bg-indigo-500/5 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 transition"
                 >
                   <span>Open Dashboard</span>
                   <span>→</span>
                 </button>
               </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-600 mb-0.5">
        {label}
      </div>
      <div className="text-xs leading-5 text-slate-300 break-words font-medium">
        {value}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-2 py-2.5 text-center flex flex-col justify-center">
      <div className="text-[9px] font-bold uppercase tracking-[0.05em] text-slate-500 mb-0.5">
        {label}
      </div>
      <div className="text-base font-bold text-white tracking-tight leading-none">{value}</div>
    </div>
  );
}