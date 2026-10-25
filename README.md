# CompanyWise — Technical Interview Preparation by Company

> **CompanyWise** is a high-performance web platform that transforms company-specific interview frequency datasets into an interactive preparation tool with real-time LeetCode account synchronization.

---

## ⚡ What's New: LeetCode Account Connection & Real-Time Sync

- **Zero-Password Client-Side Connection**: Connect your public LeetCode profile directly from the top navigation bar.
- **Local Persistence**: Your LeetCode profile, avatar, ranking, and solved metrics are saved locally in browser `localStorage`.
- **Automatic Solved Problem Sync**: Fetches your accepted LeetCode submissions and automatically marks matching problems as completed across all 200 companies in real time.
- **Global Cross-Company Synchronization**: When a question is solved (whether via LeetCode sync or manual marking), it is instantly marked as completed everywhere it appears across every company, every time period, and the global problem catalog.

---

## 📊 Dataset Ingestion & Audit Summary

The platform operates on a data pipeline that parses, normalizes, validates, and deduplicates all 537 CSV files in this repository.

| Metric | Value |
|---|---|
| **Total CSV Files Discovered & Processed** | **537 / 537 (100%)** |
| **Total Records Parsed** | **20,453** |
| **Valid Records** | **20,453** |
| **Invalid Records** | **0** |
| **Duplicate Records Within Files** | **0** |
| **Unique Companies Represented** | **200** |
| **Unique Canonical LeetCode Questions** | **1,446** |
| **Supported Time-Period Filters** | **6 Months, 1 Year, 2 Years, All Time** |
| **Questions with Valid Direct Links** | **1,446 (100%)** |

---

## 🎨 Design & Key Pages

### 1. Home Dashboard (`/`)
- **Cyber-Sleek Dark Theme**: Glowing cyan/blue typography (`CRACK THE INTERVIEW. ONE PROBLEM AT A TIME.`).
- **Real-Time KPIs**: Total companies (200+), Unique questions (1,446+), Solved problems, and completion percentage.
- **Progress Gauge**: Circular SVG progress gauge showing real-time completion with Easy, Medium, and Hard solve breakdowns.
- **Popular Companies Grid**: Amazon, Google, Microsoft, Meta, Apple, and Netflix with authentic logos and individual progress bars.
- **Recently Practiced**: Fast shortcuts to jump back into problem solving.

### 2. All Companies Catalog (`/companies`)
- **Category Tabs**: Filter by `All (200)`, `FAANG & Big Tech`, `Product Based`, `High-Growth Startups`, or `Service Based`.
- **Company Cards**: Real brand logos, problem counts, time period tags (`6M`, `1Y`, `2Y`, `All`), and real-time progress indicators.
- **Multi-Factor Sorting**: Sort by question count, completion percentage, or alphabetically.

### 3. Individual Company Hub (`/companies/:slug`)
- **Company Banner**: Verified dataset badge, description, and key domain topics.
- **Dynamic Time Periods**: Switch between `6 Months`, `1 Year`, `2 Years`, and `All Time` with dynamic counts.
- **5 KPI Metric Cards**: Total problems, Easy %, Medium %, Hard %, and Solved %.
- **Interactive Question Table**: Status toggle, LeetCode problem ID, clickable title, difficulty badge, acceptance %, frequency score, and direct `Solve ->` button.

### 4. Global Problem Library (`/problems`)
- **1,446 Canonical Problems**: Filter simultaneously by Company, Difficulty, and Solved Status.
- **Company Association Badges**: Company logo icons showing which companies ask each question (with hover tooltip for all companies).
- **Pagination**: High-performance client-side pagination.

### 5. My Progress (`/progress`)
- **Live LeetCode Sync**: Check sync status, trigger manual refresh, or view LeetCode stats.
- **Difficulty Breakdown Cards**: Progress bars for Easy, Medium, and Hard questions.
- **Two-Column Analytics**: Company-by-company completion ranking on the left, recently practiced and bookmarked questions on the right.
- **Data Export & Import**: Backup and restore your progress as JSON.

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

### 1. Installation
```bash
npm install
```

### 2. Run Data Ingestion Pipeline
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
npm run test
```

### 5. Build for Production
```bash
npm run build
```
