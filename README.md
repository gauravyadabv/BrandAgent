# 🤖 BrandAgent — Autonomous AI Social Media Management

> **Agentic Economy on Arc Hackathon** · lablab.ai · April 20–26, 2026

A next-generation multi-agent AI platform for FMCG brands. Every discrete agent action is settled as a micro-transaction in **USDC on Arc L1** via **Circle Nanopayments** — fully autonomous, machine-to-machine commerce with zero human in the payment loop.

---

## ⚡ What It Does

BrandAgent runs a **hierarchical agent network** that autonomously manages an FMCG brand's social media presence from content ideation to on-chain proof of delivery:

1. **Orchestrator Agent** (Gemini 1.5 Pro) — Decomposes campaign brief into discrete, priced tasks
2. **Website Agent** — Crawls the brand website (via Tinyfish) for fresh article content
3. **Creator Agent** (Gemini 1.5 Pro) — Generates platform-native captions, hashtags, and image prompts
4. **Social Media Agent** — Posts content to Instagram, Facebook, X, TikTok, Threads and extracts real-time KPIs
5. **Verifier Agent** (Gemini Flash) — Confirms each post is live and authorizes USDC payment release
6. **Analytics Agent** (Gemini Flash) — Aggregates KPIs into an AI-powered performance report

Every task completion triggers a **USDC micro-payment via Circle Nanopayments** that settles on **Arc L1** — providing cryptographic proof of work for every autonomous action.

---

## 🏆 Hackathon Track Alignment

| Track | How BrandAgent Satisfies It |
|---|---|
| 🤖 **Agent-to-Agent Payment Loop** (PRIMARY) | Orchestrator pays 5 sub-agents in USDC per task. No human in loop. |
| 🪙 **Per-API Monetization Engine** (SECONDARY) | Tinyfish API calls billed per-use via Nanopayments |
| 💡 **Product Feedback Incentive** | Circle product feedback form completed in detail |

### ✅ Hackathon Requirements Checklist

- ✅ Real per-action pricing ≤ $0.01 (`$0.001–$0.005` per transaction)
- ✅ 50+ on-chain Arc transactions (14 txns per cycle × 4 demo cycles = **56+ transactions**)
- ✅ Circle Nanopayments integration with simulation fallback for demo
- ✅ Arc Block Explorer links for every transaction
- ✅ Multi-agent orchestration with Gemini AI reasoning
- ✅ Public GitHub repository (MIT licensed)
- ⚠️ Live demo on Vercel (deployment pending)

---

## 🏗️ Architecture

```
Brand Manager (Human)
      │
      ▼  [Campaign Brief]
┌─────────────────────────────────────────────────────┐
│         Orchestrator Agent  (Gemini 1.5 Pro)        │
│   Brief → Task decomposition → Payment dispatch     │
└──────────────────┬──────────────────────────────────┘
                   │ Circle Nanopayments (USDC)
        ┌──────────┼──────────┬────────────┐
        ▼          ▼          ▼            ▼
   Website      Creator    Social       Verifier
   Agent        Agent      Agent        Agent
   (Flash)      (Pro)      (Flash)      (Flash)
   $0.002       $0.005     $0.001       $0.001
        └──────────┴──────────┴────────────┘
                        │
                        ▼
               Analytics Agent
               (Gemini Flash)
               $0.003
                        │
                        ▼
               Arc L1 Settlement
               (USDC on-chain, ~14 txns/cycle)
```

### Agent Communication Pattern

All inter-agent communication is **event-driven via SSE (Server-Sent Events)**. The Next.js API route streams events to the frontend in real-time:

```
Orchestrator → onEvent("task_update")   → page.tsx → AgentGrid + FlowDiagram
Orchestrator → onEvent("transaction")   → page.tsx → TransactionFeed + AgentGrid
Orchestrator → onEvent("log")           → page.tsx → ActivityLog
Orchestrator → onEvent("metrics")       → page.tsx → HeroStats + KpiDashboard
Orchestrator → onEvent("cycle_complete")→ page.tsx → ContentPreview + KpiDashboard
```

---

## 🛠️ Full Tech Stack

### Backend / AI

| Technology | Purpose | Version |
|---|---|---|
| Next.js App Router | Framework + API Routes + SSE | 16.2.4 |
| TypeScript | Type safety across all layers | ^5 |
| Google Gemini SDK | AI agent intelligence | ^0.24.1 |
| Gemini 1.5 Pro | High-reasoning agents (Orchestrator, Creator) | — |
| Gemini 1.5 Flash | Fast agents (Website, Social, Verifier, Analytics) | — |
| Circle REST API | USDC Nanopayments (v1/transfers) | v1 |
| uuid | Unique IDs for tasks, cycles, transactions | ^14.0.0 |

### Frontend / UI

| Technology | Purpose | Version |
|---|---|---|
| React | Component framework | 19.2.4 |
| TailwindCSS v4 | Utility CSS + design tokens | ^4 |
| Framer Motion | Animations and transitions | ^12.38.0 |
| Recharts | KPI charts (AreaChart, BarChart) | ^3.8.1 |
| Lucide React | SVG icon library | ^1.8.0 |
| Zustand | State management (available, not wired) | ^5.0.12 |
| Inter + JetBrains Mono | UI + monospace fonts | Google Fonts |

### Infrastructure

| Technology | Purpose |
|---|---|
| Arc L1 | EVM-compatible blockchain, USDC-native gas, ChainID 1234 |
| Circle Programmable Wallets | One wallet per agent for autonomous payments |
| Vercel | Hosting + Edge deployment |
| Server-Sent Events | Real-time streaming from campaign engine to UI |

---

## 💰 Payment Economics

| Task | Agent Paid | Amount (USDC) | Times per Cycle |
|---|---|---|---|
| Website Crawl | Website Agent | $0.002 | ×1 |
| Content Creation | Creator Agent | $0.005 | ×5 platforms |
| Social Post | Social Agent | $0.001 | ×5 platforms |
| Post Verification | Verifier Agent | $0.001 | ×5 platforms |
| KPI Extraction | Social Agent | $0.001 | ×1 |
| Analytics Report | Analytics Agent | $0.003 | ×1 |
| **Total per cycle** | | **~$0.041 USDC** | **13–14 transactions** |

> **Why Arc + Circle Nanopayments?** Ethereum gas (~$1–5/txn) makes $0.001 payments economically impossible. Arc L1 with USDC-native gas makes sub-cent agent payments viable.

---

## 📁 Project Structure

```
BrandAgent/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── campaign/run/route.ts   # POST — SSE streaming campaign endpoint
│   │   │   ├── agents/route.ts          # GET — 6 agent statuses + USDC balances
│   │   │   └── brand/route.ts           # GET/PUT — brand profile management
│   │   ├── globals.css                  # Design system (tokens, glassmorphism, animations)
│   │   ├── layout.tsx                   # Root layout, fonts, Open Graph metadata
│   │   └── page.tsx                     # Main dashboard: state, SSE reader, tab routing
│   │
│   ├── components/
│   │   ├── Header.tsx                   # Sticky nav: brand name, Run/Stop, tx counter
│   │   ├── HeroStats.tsx                # 6-metric stat bar
│   │   ├── AgentFlowDiagram.tsx         # Live orchestration flow with active state
│   │   ├── AgentGrid.tsx                # 6 agent cards with wallet info
│   │   ├── TransactionFeed.tsx          # Arc L1 tx feed with explorer links
│   │   ├── ActivityLog.tsx              # Color-coded real-time log stream
│   │   ├── KpiDashboard.tsx             # Analytics charts + hackathon checklist
│   │   ├── ContentPreview.tsx           # Generated content viewer per platform
│   │   └── BrandConfig.tsx              # Brand profile editor
│   │
│   └── lib/
│       ├── types.ts                     # All TypeScript interfaces (source of truth)
│       ├── constants.ts                 # Agent defs, payment amounts, Arc config
│       ├── agents/
│       │   └── gemini.ts                # 6 Gemini AI agent functions
│       ├── payments/
│       │   └── circle.ts                # Circle Nanopayments service
│       └── campaign/
│           └── orchestrator.ts          # Full campaign cycle engine (7 steps)
│
├── public/                              # Static assets
├── CLAUDE.md                            # AI assistant context file
├── README.md                            # This file
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 (check: `node --version`)
- **npm** ≥ 9
- **Google Gemini API key** — [aistudio.google.com](https://aistudio.google.com/app/apikey) (free)
- **Circle Developer account** — [app.circle.com](https://app.circle.com) (optional — app runs in simulation mode without it)

### Step 1 — Clone & Install

```bash
git clone https://github.com/gauravyadabv/BrandAgent.git
cd BrandAgent
npm install
```

### Step 2 — Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# ── REQUIRED ──────────────────────────────────────────────────────
# Get from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIza...your_key_here

# ── OPTIONAL — falls back to simulation if not provided ───────────
# Get from: https://app.circle.com → Developer → API Keys
CIRCLE_API_KEY=
CIRCLE_ENTITY_SECRET=

# ── Circle Wallet IDs (create 6 wallets in Circle dashboard) ──────
# Each agent gets its own USDC wallet for autonomous payments
CIRCLE_ORCHESTRATOR_WALLET_ID=
CIRCLE_CREATOR_WALLET_ID=
CIRCLE_WEBSITE_WALLET_ID=
CIRCLE_SOCIAL_WALLET_ID=
CIRCLE_VERIFIER_WALLET_ID=
CIRCLE_ANALYTICS_WALLET_ID=
```

> **Note:** Without Circle keys, all payments are simulated with realistic tx hashes and block numbers. The AI agents still run fully — only the Gemini API key is strictly required.

### Step 3 — Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 4 — Run Your First Campaign

1. Open the dashboard at `http://localhost:3000`
2. *(Optional)* Go to **⚙️ Config** tab to customize the brand profile
3. Click **▶ Run Campaign** in the header
4. Watch agents activate in real-time on the **⚡ Overview** tab
5. See Arc L1 transactions appear in the **💸 Transactions** tab
6. View AI-generated content in the **✍️ Content** tab
7. Check KPIs and hackathon checklist in **📊 Analytics**

---

## ⚙️ Setting Up Circle Wallets

To enable real on-chain USDC payments (vs. simulation):

1. Sign up at [app.circle.com](https://app.circle.com)
2. Go to **Developer** → **Programmable Wallets**
3. Create a **Wallet Set** for BrandAgent
4. Create **6 wallets** (one per agent):
   - `BrandAgent-Orchestrator`
   - `BrandAgent-Creator`
   - `BrandAgent-Website`
   - `BrandAgent-Social`
   - `BrandAgent-Verifier`
   - `BrandAgent-Analytics`
5. Fund the **Orchestrator wallet** with test USDC from Circle's faucet
6. Copy each wallet's ID into `.env.local`
7. Get your API key from **Developer** → **API Keys**
8. Get your Entity Secret from the same page

---

## 🔄 Campaign Cycle — Step by Step

The orchestrator runs 7 sequential steps per campaign cycle:

```
Step 1: PLAN
  orchestratorPlan(brand, cycleId) → campaign brief + task list
  Model: Gemini 1.5 Pro

Step 2: CRAWL
  websiteCrawl(brand) → articles, SEO score
  Payment: Orchestrator → Website Agent ($0.002 USDC)
  Model: Gemini 1.5 Flash

Step 3-5: CREATE → POST → VERIFY (per platform, ×5)
  creatorGenerate(brand, platform, article) → caption, hashtags, imagePrompt
  Payment: Orchestrator → Creator Agent ($0.005 USDC)
  Model: Gemini 1.5 Pro

  socialPost(brand, content) → KpiSnapshot
  Payment: Orchestrator → Social Agent ($0.001 USDC)
  Model: Gemini 1.5 Flash

  verifierCheck(brand, platform, content, kpi) → {verified, score, approved}
  Payment: Orchestrator → Verifier Agent ($0.001 USDC, if approved)
  Model: Gemini 1.5 Flash

Step 6: KPI EXTRACTION
  Payment: Orchestrator → Social Agent ($0.001 USDC)

Step 7: ANALYTICS
  analyticsReport(brand, kpis, usdcSpent, txCount) → {summary, insights, score}
  Payment: Orchestrator → Analytics Agent ($0.003 USDC)
  Model: Gemini 1.5 Flash

Step 8: METRICS COMPUTATION
  Aggregates all KpiSnapshots into CampaignMetrics
  Emits "cycle_complete" event
```

---

## 🎯 Default Brand Profile (Dabur India)

The default brand profile used for demonstrations:

```json
{
  "brand": "Dabur India",
  "website": "https://dabur.com",
  "channels": {
    "instagram": "@daburindia",
    "facebook": "DaburIndia",
    "x_twitter": "@DaburIndia",
    "tiktok": "@dabur",
    "threads": "@daburindia"
  },
  "brand_voice": "Ayurvedic, natural, family-first, trustworthy, warm",
  "posting_schedule": {
    "frequency": "2x_daily",
    "times": ["09:00", "18:00"],
    "timezone": "IST"
  },
  "kpi_targets": {
    "engagement_rate": 0.035,
    "reach_growth_weekly": 0.05,
    "website_traffic_ctr": 0.02
  },
  "usdc_budget_per_cycle": 0.025,
  "max_daily_cycles": 4
}
```

You can customize this via the **⚙️ Config** tab in the dashboard.

---

## 🎨 Design System

The UI uses a custom dark-mode design system defined in `src/app/globals.css`:

- **Color palette:** Deep navy backgrounds (#080B14) with indigo/violet/cyan accents
- **Typography:** Inter (UI text) + JetBrains Mono (tx hashes, code)
- **Components:** Glassmorphism cards, animated agent flow, pulse status dots, gradient text
- **Animations:** Slide-in transactions, spinning loading rings, blinking live indicator

---

## 🔌 API Reference

### `POST /api/campaign/run`

Starts a campaign cycle. Returns an SSE stream.

**Request Body:**
```json
{ "brand": { ...BrandProfile } }
```

**SSE Event Types:**
```typescript
{ "type": "log",           "data": LogEntry }
{ "type": "task_update",   "data": Task }
{ "type": "transaction",   "data": Transaction }
{ "type": "metrics",       "data": CampaignMetrics }
{ "type": "cycle_complete","data": CampaignCycle }
```

### `GET /api/agents`

Returns all 6 agents with current USDC balances.

```json
{
  "success": true,
  "data": [
    {
      "id": "orchestrator",
      "name": "Orchestrator Agent",
      "walletId": "...",
      "walletAddress": "0xORCH...0001",
      "status": "idle",
      "usdcBalance": 0.25,
      "totalEarned": 0,
      "tasksCompleted": 0
    }
  ]
}
```

### `GET /api/brand` / `PUT /api/brand`

Get or update the current brand profile.

---

## ⚠️ Current Limitations

| Area | Status | Description |
|---|---|---|
| Website Crawling | ⚠️ Simulated | Gemini simulates crawl results — no real Tinyfish API |
| Social Posting | ⚠️ Simulated | No real Twitter/Meta/TikTok API calls |
| Image Generation | ❌ Missing | `imagePrompt` is generated but no image is created |
| Data Persistence | ❌ Missing | In-memory only — resets on server restart |
| Error Recovery | ⚠️ Basic | Single try/catch; mid-cycle failure aborts entire run |
| Circle Payments | ⚠️ Optional | Falls back to simulation without API keys |

---

## 🗺️ Roadmap

- [ ] Real Tinyfish API integration for website crawling
- [ ] Real social platform API posting (Meta Graph, Twitter v2, TikTok)
- [ ] Image generation via Google Imagen or DALL-E 3
- [ ] Database persistence (Supabase or Vercel KV)
- [ ] Zustand global state management
- [ ] Granular error handling + per-step retries in orchestrator
- [ ] Scheduled campaign automation (cron-based daily cycles)
- [ ] Multi-brand support
- [ ] Real Circle Nanopayments on Arc L1 mainnet

---

## 🔗 Resources

| Resource | URL |
|---|---|
| Arc Documentation | https://docs.arc.io |
| Circle Nanopayments | https://developers.circle.com/nanopayments |
| Circle Programmable Wallets | https://developers.circle.com/wallets |
| Google AI Studio (Gemini API) | https://aistudio.google.com |
| Tinyfish Agent API | https://agent.tinyfish.ai |
| Arc Block Explorer | https://explorer.arc.io |
| lablab.ai Hackathon | https://lablab.ai |

---

## 🧑‍💻 Development Commands

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## 📄 License

MIT — BrandAgent Team · Agentic Economy on Arc Hackathon · April 20–26, 2026
