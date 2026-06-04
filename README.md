# 🇮🇳 BharatBudget: Interactive Union Budget Command Center

`BharatBudget` is a premium, state-of-the-art public finance command center and interactive visualization portal. It decodes complex Indian Union Budget data—compiled directly from official Ministry of Finance and Comptroller & Auditor General (CAG) ledger papers—into an intuitive, highly responsive, and beautiful dark-themed dashboard.

Designed with rich aesthetics (vibrant color palettes, glassmorphism, subtle micro-animations), the platform empowers researchers, journalists, and citizens to track national expenditures, state-level tax devolutions, welfare DBT entries, and historical liabilities with ease.

---

## 🎨 Core Dashboard Visualizations

The command center is structured into twelve dedicated, high-fidelity views:

### 1. Home Overview (`OverviewDashboard`)
* **Live Outlay Indicators**: Displays dynamic Union expenditure balances, nominal GDP, and central sovereign liabilities.
* **Capital vs. Revenue Spends**: A concentric Recharts Pie chart comparing asset-creation outlays against operational expenses.
* **Paisa-per-Rupee Inflow/Outflow Split**: Interactive distribution lists projecting exactly how each 100 Paise of national revenue is earned and spent.

### 2. State Budgets Devolution (`StateDashboard`)
* **Interactive SVG Devolution Map**: An interactive map of India displaying central tax share devolution to various states.
* **16th Finance Commission Devolution Sandbox**: A dynamic sandbox calculator letting users customize weight indicators (Demographic Performance, Forest Cover, Income Distance, Population) to project real-time shifts in state funding shares.

### 3. Scheme DBT Tracker (`SchemeDashboard`)
* **Searchable Scheme Explorer Directory**: Easily search and explore outlays across all major central schemes (e.g. Samagra Shiksha, MGNREGA, PMAY).
* **YoY Allocation Spline Curve**: Dynamic Recharts Area trajectory tracking funding over multiple fiscal years with relative growth indicator alerts.
* **Welfare Ledger KIs**: Live indicators tracing direct benefit transfers (DBT), transactions, and estimated leakages prevented.

### 4. Ministry Outlays (`MinistryDashboard`)
* **Horizontal Budget Allocation Flow**: Traces ministry funding in an elegant flow structure: `[Allocation] ──► [Released] ──► [Audited] ──► [Discrepant]`.
* **Budget Share Comparison**: Recharts bar visualizations ranking major ministerial accounts (Defense, Highways, Rural Development, Agriculture).

### 5. CAG Audit Objections (`AuditDashboard`)
* **CAG Discrepancy Ledger**: An interactive ledger containing official CAG audit objections regarding strategic reserves and pending utilization certificates.
* **Discrepancy Severity Scale**: Ranks warnings by severity level, enabling transparent audit investigation tracking.

### 6. Tax Inflow Receipts (`TaxDashboard`)
* **Direct Tax Growth Trajectory**: A 10-year comparative spline chart plotting corporate vs personal income tax receipts.
* **State SGST Rankings**: Ranks state SGST collections across major state economies.

### 7. Monthly Burn Matrix (`MonthlyDashboard`)
* **Burn Rate Spline Curve**: Charts actual monthly national spending against a baseline, highlighting fiscal pacing.

### 8. Macroeconomic Shock Simulator (`SimulatorDashboard`)
* **Dynamic Stress-Testing Presets**: Simulates scenarios like *Oil Price Surge*, *Monsoon Failure*, and *Global Recession* with real-time math-driven shifts in CPI inflation, domestic spending, and GDP variables.
* **Fiscal Impact Modeling**: Updates indicators on state tax receipts and federal deficit ratios reactively.

### 9. Citizen Welfare Eligibility Calculator (`CitizenDashboard`)
* **Profile-Driven Recommendation Engine**: Matches direct benefit transfer (DBT) schemes (e.g. PM-KISAN, PM Awas Yojana) based on demographic indicators (age, occupation, income brackets).
* **Direct Tax Savings Projection**: Evaluates potential savings under custom financial profiles automatically.

### 10. Speech Thematic Analyzer (`SpeechDashboard`)
* **Interactive SVG Word Cloud**: Mines high-frequency vocabulary from Union Budget speech addresses, linking keyword tags directly to filtered transcripts.
* **Thematic Distribution & Action Exporter**: Charts speech topics (CapEx, Infrastructure, Welfare, Green Transition) in Recharts, supporting vector/raster file export (PNG/SVG).
* **Smart Search Indexing**: Features synonym mapping (`capex`, `infra`, `solar`) with visual highlights synced to the charts.

### 11. Historical Budget Trend Tracker (`TrendsDashboard`)
* **Decadal Ministry Outlay Series**: Tracks outlays across major ministries (Defence, Road Transport, Railways) over a 10-year span (2018–2027).
* **Automated CAGR Scorecard**: Dynamically calculates and renders Compound Annual Growth Rates using compound interest formulas.

### 12. Executive PDF Exporter
* **High-Contrast Print Ledger**: Renders a clean, high-contrast, paper-optimized Union Budget report previewing baseline stats and departmental shares.
* **Robust Print Media Engine**: Employs `@media print` CSS classes preventing scroll cutoffs, ensuring horizontal grid rendering on physical printouts or PDF saves.

---

## 🏗️ Technical Stack & Architectural Best Practices

To ensure production-grade scalability and performance, the portal implements modern enterprise frontend practices:

```text
       [ Unified Zustand Store ] <─────── Global State (Timeline / Tabs)
                   │
                   ▼
  [ App.jsx React Suspense Boundary ]
                   │
    ┌──────────────┼──────────────┬──────────────┐ (Dynamic Chunks)
    ▼              ▼              ▼              ▼
[Overview]     [Scheme]        [Tax]        [State]
 (11.2 kB)      (8.8 kB)      (6.6 kB)     (195.0 kB)
```

* **Central State Store (Zustand)**: Eliminates prop-drilling by managing active tabs, mobile sidebar states, and the global selected year timeline inside a unified Zustand store.
* **Dynamic Code-Splitting (`React.lazy` + `Suspense`)**: Heavy dashboards are split into separate dynamic JS chunks, shrinking the initial core application payload from **870+ kB** down to just **238 kB** (a **~73%** reduction).
* **High-Performance Vector Visualizations**: Rendered using optimized SVG maps and responsive Recharts modules that adapt perfectly across desktop, tablet, and mobile viewports.

---

## ⚡ Global Multi-Year Timeline

All visual indicators, pie fractions, welfare statistics, and receipt distributions are dynamically bound to a unified, top-level **Timeline Selector Segment Control**:

1. **2024-25 Actuals**: Baseline audit-verified actual expenditures (₹48.2L Cr Outlay).
2. **2025-26 BE (Budget Estimates)**: Projections declared at the beginning of FY25.
3. **2025-26 RE (Revised Estimates)**: Mid-year adjusted budget balances (₹47.7L Cr Outlay).
4. **2026-27 BE (Budget Estimates)**: New budget proposals (₹53.5L Cr Outlay).

---

## 🚀 Installation & Running Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/NisargPatel03/BharatBudget.git
   cd BharatBudget
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the interactive portal with Hot Module Replacement (HMR).

4. **Build for Production**:
   ```bash
   npm run build
   ```
   Vite compiles and splits the codebase into independent, lazy-loaded modular chunks under the `/dist` directory.
