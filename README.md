# CompanyWise — Technical Interview Preparation & Company Datasets

> **CompanyWise** is an interactive, engineering-grade interview intelligence platform with real-time LeetCode profile synchronization, coupled with the complete archive of company-specific problem frequency datasets.

🔗 **Live Platform**: [companywise-beryl.vercel.app](https://companywise-beryl.vercel.app)

![CompanyWise Platform Preview](website/public/preview.png)

---

## 📁 Repository Structure

```
LeetCode-Questions-CompanyWise/
├── website/                   # Full React 18 + Vite 6 + Tailwind web application
│   ├── api/                   # Serverless functions (LeetCode GraphQL proxy)
│   ├── public/                # Static assets, company brand logos, and generated datasets
│   │   ├── data/              # Ingested datasets (index.json, questions.json, report.json, companies/)
│   │   └── logos/             # High-res company logos in SVG & PNG
│   ├── scripts/               # Offline CSV ingestion and normalization pipeline
│   ├── src/                   # React components, pages, hooks, services, and design system
│   ├── tests/                 # Vitest automated test suite (25 passing tests)
│   ├── package.json           # Website dependencies and scripts
│   ├── vite.config.ts         # Vite bundler configuration
│   └── vercel.json            # Vercel deployment configuration
│
├── csv-data/                  # The original 537 company-wise CSV files
│   ├── google_1year.csv
│   ├── amazon_6months.csv
│   ├── meta_alltime.csv
│   └── ... (all 537 datasets across 200 companies)
│
├── others/                    # Design specifications, documentation, and tooling
│   ├── DESIGN.md              # Design system and typography specifications
│   ├── PRODUCT.md             # Product requirements and feature roadmap
│   ├── live-poll.mjs          # Live polling utilities
│   ├── .impeccable/           # Design review checkpoints
│   └── api/                   # Serverless function references
│
├── .gitignore
├── package.json               # Root monorepo forwarder scripts
├── vercel.json                # Root Vercel deployment configuration
└── README.md
```

---

## ⚡ What's New: LeetCode Account Connection & Real-Time Sync

- **Zero-Password Client-Side Connection**: Connect your public LeetCode profile directly from the top navigation bar.
- **Local Persistence**: Your LeetCode profile, avatar, ranking, and solved metrics are saved locally in browser `localStorage`.
- **Automatic Solved Problem Sync**: Fetches your accepted LeetCode submissions and automatically marks matching problems as completed across all 200 companies in real time.
- **Global Cross-Company Synchronization**: When a question is solved (whether via LeetCode sync or manual marking), it is instantly marked as completed everywhere it appears across every company, every time period, and the global problem catalog.

---

## 📊 Dataset Ingestion & Audit Summary

The platform operates on a data pipeline (`website/scripts/build-data.ts`) that parses, normalizes, validates, and deduplicates all 537 CSV files in `csv-data/`.

| Metric | Value |
|---|---|
| **Total CSV Files in `csv-data/`** | **537 / 537 (100%)** |
| **Total Records Parsed** | **20,453** |
| **Valid Records** | **20,453** |
| **Invalid Records** | **0** |
| **Duplicate Records Within Files** | **0** |
| **Unique Companies Represented** | **200** |
| **Unique Canonical LeetCode Questions** | **1,446** |
| **Supported Time-Period Filters** | **6 Months, 1 Year, 2 Years, All Time** |
| **Questions with Valid Direct Links** | **1,446 (100%)** |

---

## 🎨 Key Features & Pages

1. **Home Dashboard (`/`)**: Real-time KPIs, progress breakdown gauge, 3D interactive globe, popular companies grid, and quick resume shortcuts.
2. **Company Catalog (`/companies`)**: Filter by category (FAANG, Product-Based, High-Growth, Service-Based), brand logos, and completion status.
3. **Company Hub (`/companies/:slug`)**: Dynamic recency filters (6M, 1Y, 2Y, All Time), question tables with difficulty markers, acceptance rates, and frequency scores.
4. **Global Problem Catalog (`/problems`)**: All 1,446 unique questions with multi-filter search, direct LeetCode solve links, and company tag pills.
5. **My Progress (`/progress`)**: Live LeetCode account sync, per-difficulty completion rates, company completion leaderboard, bookmarks, and JSON export/import.
6. **About Page (`/about`)**: Complete project story, dataset curator acknowledgement (Krishna Dey), and developer profile (Alokam Ruchith).

---

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Bundler & Tooling**: Vite 6, TSX
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Routing**: React Router DOM 6
- **Icons**: Lucide React
- **CSV Ingestion**: Papa Parse
- **Testing**: Vitest with JSDOM
- **State & Storage**: React Hooks, LocalStorage

---

## 📦 Getting Started

You can run commands from the root directory or inside `website/`:

### 1. Installation
```bash
npm install --prefix website
```

### 2. Ingest CSV Data
```bash
npm run data:build
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Run Automated Test Suite
```bash
npm test
```

### 5. Build for Production
```bash
npm run build
```

---

## 🚀 Deploying to Vercel

The project is pre-configured with root and subdirectory `vercel.json` configurations for instant deployment:

### Option 1: Vercel Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import this repository: `https://github.com/aruchith08/LeetCode-Questions-CompanyWise`.
3. Vercel automatically detects the configuration and deploys.
   - If setting Root Directory to `website`: it deploys using `website/vercel.json`.
   - If leaving Root Directory as `./` (default): it deploys using root `vercel.json`.
4. Click **Deploy**.

### Option 2: Vercel CLI
```bash
cd website
npx vercel
```
