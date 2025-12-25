Offline Expense Tracker (PWA)

A mobile-first, offline-first expense tracking web app that works reliably on phones, supports IndexedDB storage, background syncing, and behaves correctly even under unstable network conditions.

Built to solve real-world offline problems, not demo scenarios.

🔑 Core Goals

Work fully offline (add/edit/delete expenses without internet)

Sync data reliably when online

Behave correctly on mobile + PWA, not just desktop

Avoid UI breakage from unbounded user input

Keep architecture simple, debuggable, and scalable

🧱 Architecture Overview
High-Level Flow
UI (React Components)
↓
Local State + Events
↓
IndexedDB (source of truth)
↓
Sync Layer (NetworkOnly)
↓
Backend API (/sync)

Key Principle

IndexedDB is the source of truth.
Network sync is opportunistic, never blocking user actions.

🗂️ Folder Structure (Relevant)
src/
├── components/
│ ├── Header.tsx
│ ├── ExpenseForm.tsx
│ ├── ExpenseList.tsx
│ ├── CategoryChart.tsx
│ └── InstallPrompt.tsx
│
├── hooks/
│ ├── useSync.ts
│ ├── useOnlineStatus.ts
│ └── useSyncStatus.ts
│
├── lib/
│ ├── db/
│ │ └── indexedDb.ts
│ ├── api/
│ │ └── sync.ts
│ ├── analytics/
│ │ └── categorySummary.ts
│ └── validation/
│ └── expenseValidation.ts
│
├── types/
│ └── expenses.ts
│
├── App.tsx
└── main.tsx

🧠 Data & State Design
Expense Model (Simplified)
type Expense = {
id: string;
amount: number;
currency: string;
category: string;
note?: string;
date: string;
synced: boolean;
};

Why This Works

synced: false → local-only data

synced: true → confirmed by backend

No optimistic assumptions

UI always reflects real persistence state

💾 Offline Storage (IndexedDB)

All CRUD operations happen locally

App never blocks on network

IndexedDB operations trigger a custom event:

window.dispatchEvent(new Event("expenses-updated"));

This keeps components decoupled without over-engineering global state.

🔁 Sync Strategy (Critical Design Choice)
Key Rules

Never block sync using navigator.onLine

Always attempt the network request

Let fetch() decide if the network is available

Fail → keep data pending → retry later

Why

Mobile browsers and PWAs frequently report incorrect online status.
Relying on navigator.onLine causes false negatives on phones.

🌐 Service Worker Strategy (PWA-Safe)
Problem Solved

Mobile PWAs aggressively cache requests and can silently swallow API calls.

Solution

/sync endpoint is explicitly NetworkOnly

Absolute backend URL is matched in Workbox

cache: "no-store" is enforced on sync requests

fetch(BACKEND_URL + "/sync", {
method: "POST",
cache: "no-store",
keepalive: true,
});

This guarantees:

Sync works on real phones

No “stuck pending” state

Consistent behavior across environments

✍️ Input Validation & UI Safety
Hard Limits (Non-Negotiable)

Amount capped (prevents absurd values)

Note length capped (prevents card overflow)

Category length controlled

Validation logic is separated from UI:

lib/validation/expenseValidation.ts

This keeps components clean and reusable.

📊 Lightweight Analytics (No Chart Libraries)

Instead of heavy chart libraries:

Expenses are grouped by category

Simple bar visualization shows where money is spent most

Fast, mobile-friendly, zero dependencies

This avoids:

Bundle bloat

Canvas/SVG issues on low-end phones

📱 Mobile-First Considerations

Large tap targets

Card-based layout

No hover-only interactions

Sync logic tested on real devices, not just DevTools

🚫 What This App Intentionally Does NOT Do

No server-side state ownership

No blocking network calls

No reliance on navigator.onLine

No heavy state libraries (Redux/Zustand)

No unnecessary chart frameworks

🧪 Real-World Testing Notes

Desktop dev tools can mask PWA issues

Mobile PWAs behave differently (more aggressive SW caching)

Sync logic was validated on real phones

Old service workers must be cleared during testing

📌 Key Engineering Takeaways (Interview-Ready)

Offline-first requires optimistic UI + pessimistic sync

IndexedDB is storage, not state — UI listens to events

Network checks must be attempt-based, not flag-based

PWAs require explicit control over Service Worker behavior

Mobile browsers lie more than desktops

🚀 Future Enhancements (Planned)

Background Sync API

Sync retry with exponential backoff

Monthly summaries

Export (CSV / PDF)

Budget alerts

🧑‍💻 Why This Project Matters

This project demonstrates:

Real offline engineering

Mobile-aware thinking

PWA pitfalls and solutions

Practical trade-offs instead of tutorials

This is not a demo app — it solves real constraints users face.

If you want next:
