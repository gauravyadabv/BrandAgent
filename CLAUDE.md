# BrandAgent — CLAUDE.md

> AI coding assistant context file. Read this entirely before writing any code.

---

## 🧠 Project Identity

**BrandAgent** is an autonomous multi-agent AI platform for FMCG social media management. Built for the **"Agentic Economy on Arc"** hackathon (lablab.ai · April 20–26, 2026). Every discrete agent action is settled as a USDC micro-payment on Arc L1 via Circle Nanopayments — **zero human in the payment loop**.

---

## 🏗️ Tech Stack (Exact Versions)

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | 16.2.4 |
| Runtime | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | TailwindCSS v4 + custom CSS | ^4 |
| AI / LLM | Google Gemini (`@google/generative-ai`) | ^0.24.1 |
| Payments | Circle Nanopayments REST API | v1 |
| Blockchain | Arc L1 (EVM-compatible, USDC native) | ChainID 1234 |
| Animations | Framer Motion | ^12.38.0 |
| Charts | Recharts | ^3.8.1 |
| Icons | Lucide React | ^1.8.0 |
| State Mgmt | Zustand (available, not yet wired) | ^5.0.12 |
| HTTP Client | Axios (available, not yet used) | ^1.15.2 |
| Real-time | Server-Sent Events (SSE) via ReadableStream | built-in |
| Fonts | Inter (UI) + JetBrains Mono (hashes) | Google Fonts |
| Unique IDs | uuid v4 | ^14.0.0 |
| Hosting | Vercel | — |

**Node.js requirement:** ≥ 18

---

## 📁 Full Directory Structure

```
BrandAgent/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── campaign/run/route.ts  # POST SSE campaign endpoint
│   │   │   ├── agents/route.ts        # GET agent statuses + balances
│   │   │   └── brand/route.ts         # GET/PUT brand profile (in-memory)
│   │   ├── globals.css                # Design system tokens + component classes
│   │   ├── layout.tsx                 # Root layout: fonts, SEO metadata
│   │   └── page.tsx                   # Dashboard: all state, SSE reader, tab routing
│   ├── components/
│   │   ├── Header.tsx                 # Sticky nav with Run/Stop button, tx counter
│   │   ├── HeroStats.tsx              # 6-stat bar: cycles, txs, USDC, reach, ER, posts
│   │   ├── AgentFlowDiagram.tsx       # Live SVG flow: Orchestrator → agents → Arc L1
│   │   ├── AgentGrid.tsx              # 6 agent cards: status, wallet, tasks, earnings
│   │   ├── TransactionFeed.tsx        # Arc L1 tx list with explorer links
│   │   ├── ActivityLog.tsx            # Real-time log (info/success/payment/error)
│   │   ├── KpiDashboard.tsx           # Recharts area chart, hackathon checklist
│   │   ├── ContentPreview.tsx         # Generated content: caption, hashtags, image prompt
│   │   └── BrandConfig.tsx            # Brand profile editor
│   └── lib/
│       ├── types.ts                   # ALL TypeScript interfaces (source of truth)
│       ├── constants.ts               # Agent defs, payment amounts, Arc config, defaults
│       ├── agents/gemini.ts           # 6 Gemini agent functions
│       ├── payments/circle.ts         # Circle Nanopayments: execute, build, balance
│       └── campaign/orchestrator.ts   # 7-step campaign cycle engine
├── public/                            # Static assets
├── package.json
├── next.config.ts
├── tsconfig.json                      # strict, bundler resolution, @/* alias
└── postcss.config.mjs
```

---

## 🔗 Data Flow — End to End

```
[User clicks "▶ Run Campaign"]
        │
        ▼
page.tsx::runCampaign()
   POST /api/campaign/run  { brand: BrandProfile }
        │
        ▼
app/api/campaign/run/route.ts
   Creates ReadableStream (SSE, text/event-stream)
   Calls orchestrator.ts::runCampaignCycle(brand, onEvent)
        │
        ├──▶ gemini.ts  (AI agent calls — Gemini 1.5 Pro/Flash)
        └──▶ circle.ts  (USDC payments — Circle API or simulated)
        │
        ▼  SSE events: "log" | "task_update" | "transaction" | "metrics" | "cycle_complete"
        │
page.tsx SSE reader (ReadableStreamDefaultReader while loop)
   Parses "data: {json}" lines → dispatches to React state:
     setLogs()         →  ActivityLog.tsx
     setTasks()        →  AgentGrid.tsx + AgentFlowDiagram.tsx
     setTransactions() →  TransactionFeed.tsx
     setMetrics()      →  HeroStats.tsx + KpiDashboard.tsx
     setCampaign()     →  ContentPreview.tsx + KpiDashboard.tsx
     setAgents()       →  AgentGrid.tsx (status + wallet balance updates)
```

---

## 🔗 Type Dependency Graph

```
types.ts
  ├── BrandProfile     → constants.ts DEFAULT_BRAND, gemini.ts (all agents), BrandConfig.tsx
  ├── Agent            → constants.ts AGENT_DEFINITIONS, AgentGrid.tsx
  ├── Task             → orchestrator.ts (created per step), AgentGrid.tsx, AgentFlowDiagram.tsx
  ├── Transaction      → circle.ts buildTransaction(), TransactionFeed.tsx
  ├── LogEntry         → orchestrator.ts log() helper, ActivityLog.tsx
  ├── CampaignCycle    → orchestrator.ts (returned), ContentPreview.tsx, KpiDashboard.tsx
  ├── CampaignMetrics  → orchestrator.ts (Step 8 computed), HeroStats.tsx, KpiDashboard.tsx
  ├── KpiSnapshot      → gemini.ts socialPost() returns it, orchestrator.ts accumulates
  ├── GeneratedContent → gemini.ts creatorGenerate() returns it, ContentPreview.tsx
  ├── PaymentInstruction → orchestrator.ts builds it, circle.ts executeNanopayment()
  └── PaymentResult    → circle.ts executeNanopayment() returns it, orchestrator.ts
```

---

## 🤖 The 6 Agents

| Agent | ID | Model | Payment Received | Real? |
|---|---|---|---|---|
| Orchestrator | `orchestrator` | gemini-1.5-pro | Pays others | ✅ Real LLM |
| Creator | `creator` | gemini-1.5-pro | $0.005/post | ✅ Real LLM |
| Website | `website` | gemini-1.5-flash | $0.002/crawl | ⚠️ Simulated |
| Social Media | `social` | gemini-1.5-flash | $0.001/post + $0.001 KPI | ⚠️ Simulated |
| Verifier | `verifier` | gemini-1.5-flash | $0.001/check | ✅ Real LLM |
| Analytics | `analytics` | gemini-1.5-flash | $0.003/report | ✅ Real LLM |

---

## 💳 Payment Amounts Per Cycle

```
PAYMENT_AMOUNTS (from constants.ts):
  content_creation:  $0.005 × 5 platforms = $0.025
  website_crawl:     $0.002 × 1            = $0.002
  social_post:       $0.001 × 5 platforms  = $0.005
  post_verification: $0.001 × 5 platforms  = $0.005
  kpi_extraction:    $0.001 × 1            = $0.001
  analytics_report:  $0.003 × 1            = $0.003
                                    Total: ~$0.041 USDC / 13-14 txs
```

---

## 🌐 API Routes

| Method | Path | Description |
|---|---|---|
| POST | `/api/campaign/run` | SSE stream — runs full campaign cycle |
| GET | `/api/agents` | Returns all 6 agents with USDC balances |
| GET | `/api/brand` | Returns current brand profile |
| PUT | `/api/brand` | Updates brand profile (in-memory) |

---

## 🎨 Design System Tokens

```css
--bg-primary:    #080B14    /* page background */
--bg-card:       #111827    /* card background */
--accent-indigo: #6366F1    /* Orchestrator / primary */
--accent-violet: #8B5CF6    /* Creator Agent */
--accent-cyan:   #06B6D4    /* Website Agent */
--accent-emerald:#10B981    /* Social Agent */
--accent-amber:  #F59E0B    /* Verifier Agent */
--accent-rose:   #EF4444    /* Analytics Agent */
--usdc-green:    #00D395    /* payment events */
--arc-purple:    #7C3AED    /* Arc L1 blockchain */
```

**Key CSS classes:** `.glass-card`, `.gradient-text`, `.agent-card`, `.badge-{idle|running|success|error|payment}`, `.pulse-dot-{running|success|error}`, `.btn-primary`, `.btn-outline`, `.tx-row`, `.arc-badge`, `.live-badge`, `.flow-node`, `.mono`, `.log-{info|success|warning|error|payment}`, `.spin-slow`

---

## 🔑 Environment Variables

```bash
# REQUIRED
GEMINI_API_KEY=your_gemini_key         # aistudio.google.com

# OPTIONAL — falls back to simulation without these
CIRCLE_API_KEY=your_circle_key         # app.circle.com
CIRCLE_ENTITY_SECRET=your_secret

# Circle Wallet IDs (one per agent)
CIRCLE_ORCHESTRATOR_WALLET_ID=
CIRCLE_CREATOR_WALLET_ID=
CIRCLE_WEBSITE_WALLET_ID=
CIRCLE_SOCIAL_WALLET_ID=
CIRCLE_VERIFIER_WALLET_ID=
CIRCLE_ANALYTICS_WALLET_ID=
```

---

## ⚠️ Known Issues

1. **`websiteCrawl()`** — LLM-hallucinated data, no real Tinyfish API call
2. **`socialPost()`** — Simulated KPIs, no real Twitter/Meta API posting
3. **Image generation** — `imagePrompt` is generated but no image is created
4. **No persistence** — Brand profile and campaign history are in-memory only
5. **No `.env.local.example`** — Referenced in README but missing from repo
6. **No `public/preview.png`** — Referenced in README, doesn't exist
7. **Zustand not wired** — Installed but all state is in `page.tsx` useState
8. **Single try/catch in orchestrator** — Mid-cycle failure aborts entire run
9. **Circle API schema** — Verify `source.type:"wallet"` matches current Circle Transfers API

---

## 📐 Coding Conventions

1. **Path alias:** Always use `@/` for `src/` imports
2. **Types:** All interfaces in `src/lib/types.ts` — no ad-hoc component types
3. **Constants:** All static data in `src/lib/constants.ts`
4. **Styling:** CSS tokens from `globals.css`. Inline styles only for dynamic values
5. **Client vs Server:** `page.tsx` is `"use client"`. API routes are server-only
6. **SSE format:** Stream `data: {JSON}\n\n`. Client parses lines starting with `"data: "`
7. **Gemini parsing:** Strip fences with `.replace(/\`\`\`json\n?|\n?\`\`\`/g, "")`, always have fallback in catch
8. **Next.js 16:** Read `node_modules/next/dist/docs/` before using route handlers — APIs differ from Next.js 14/15
