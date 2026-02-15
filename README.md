<h1 align="center">📱 Offline Expense Tracker (PWA)</h1>

<p align="center">
  <strong>Offline-First • Mobile-Optimized • IndexedDB-Based Architecture</strong><br/>
  A production-focused Progressive Web App designed to work reliably under unstable network conditions.
</p>

<hr/>

<h2>📌 Project Overview</h2>

<p>
Offline Expense Tracker is a mobile-first Progressive Web Application built to handle real-world offline constraints — not demo scenarios.
</p>

<ul>
  <li>Works fully offline (Add / Edit / Delete expenses without internet)</li>
  <li>IndexedDB as the single source of truth</li>
  <li>Reliable background sync when connectivity is restored</li>
  <li>Designed and tested on real mobile devices</li>
</ul>

<p>
The core engineering principle: <strong>Never block the user because of the network.</strong>
</p>

<hr/>

<h2>🎯 Core Engineering Goals</h2>

<ul>
  <li>True offline-first behavior</li>
  <li>Non-blocking user interactions</li>
  <li>Reliable mobile PWA performance</li>
  <li>Strict input validation to prevent UI breakage</li>
  <li>Simple, debuggable, scalable architecture</li>
</ul>

<hr/>

<h2>🧱 Architecture Overview</h2>

<h3>High-Level Data Flow</h3>

<pre>
UI (React Components)
        ↓
Local State + Events
        ↓
IndexedDB (Source of Truth)
        ↓
Sync Layer (NetworkOnly)
        ↓
Backend API (/sync)
</pre>

<p>
<strong>Design Principle:</strong><br/>
IndexedDB owns persistence. Network sync is opportunistic and never blocks user actions.
</p>

<hr/>

<h2>🧠 Data & State Design</h2>

<h3>Expense Model</h3>

<pre>
type Expense = {
  id: string;
  amount: number;
  currency: string;
  category: string;
  note?: string;
  date: string;
  synced: boolean;
};
</pre>

<h3>Why This Model Works</h3>

<ul>
  <li><strong>synced: false</strong> → Local-only data</li>
  <li><strong>synced: true</strong> → Confirmed by backend</li>
  <li>No optimistic assumptions</li>
  <li>UI always reflects real persistence state</li>
</ul>

<p>
IndexedDB changes trigger:
</p>

<pre>
window.dispatchEvent(new Event("expenses-updated"));
</pre>

<p>
This keeps UI reactive without over-engineering global state.
</p>

<hr/>

<h2>💾 Offline Storage Strategy</h2>

<ul>
  <li>All CRUD operations execute locally</li>
  <li>Application never blocks on network calls</li>
  <li>Network failures do not affect user interaction</li>
</ul>

<p>
IndexedDB is treated as storage — not global state management.
</p>

<hr/>

<h2>🔁 Sync Strategy (Critical Design Choice)</h2>

<h3>Key Rules</h3>

<ul>
  <li>Never rely on <code>navigator.onLine</code></li>
  <li>Always attempt network request</li>
  <li>Let <code>fetch()</code> determine connectivity</li>
  <li>On failure → keep data pending → retry later</li>
</ul>

<p>
Mobile PWAs often misreport network state.  
Attempt-based sync avoids false negatives and silent failures.
</p>

<hr/>

<h2>🌐 Service Worker (PWA-Safe Configuration)</h2>

<p>
Mobile PWAs aggressively cache requests, which can silently block API calls.
</p>

<h3>Solution Implemented</h3>

<ul>
  <li><strong>/sync</strong> endpoint configured as NetworkOnly</li>
  <li>Absolute backend URL matched in Workbox</li>
  <li><code>cache: "no-store"</code> enforced on sync requests</li>
</ul>

<pre>
fetch(BACKEND_URL + "/sync", {
  method: "POST",
  cache: "no-store",
  keepalive: true,
});
</pre>

<p>
Result:
</p>

<ul>
  <li>No stuck pending sync states</li>
  <li>Consistent behavior on real phones</li>
  <li>Controlled service worker caching</li>
</ul>

<hr/>

<h2>✍️ Input Validation & UI Safety</h2>

<h3>Hard Limits Enforced</h3>

<ul>
  <li>Amount capped to prevent absurd values</li>
  <li>Note length limited to prevent layout overflow</li>
  <li>Category length controlled</li>
</ul>

<p>
Validation logic is separated from UI components:
</p>

<pre>
lib/validation/expenseValidation.ts
</pre>

<p>
This keeps components clean and reusable.
</p>

<hr/>

<h2>📊 Lightweight Analytics</h2>

<p>
Instead of heavy chart libraries:
</p>

<ul>
  <li>Expenses grouped by category</li>
  <li>Simple bar visualization</li>
  <li>Zero chart dependencies</li>
</ul>

<p>
Avoids bundle bloat and performance issues on low-end devices.
</p>

<hr/>

<h2>📱 Mobile-First Design Decisions</h2>

<ul>
  <li>Large tap targets</li>
  <li>Card-based layout</li>
  <li>No hover-only interactions</li>
  <li>Tested on real mobile devices</li>
</ul>

<hr/>

<h2>🚫 Intentional Non-Features</h2>

<ul>
  <li>No server-side state ownership</li>
  <li>No blocking network calls</li>
  <li>No reliance on unreliable online flags</li>
  <li>No Redux / Zustand</li>
  <li>No heavy chart libraries</li>
</ul>

<p>
Complexity was intentionally avoided.
</p>

<hr/>

<h2>🧪 Real-World Testing Observations</h2>

<ul>
  <li>Desktop DevTools do not replicate PWA behavior accurately</li>
  <li>Mobile browsers cache more aggressively</li>
  <li>Old service workers must be manually cleared during testing</li>
</ul>

<hr/>

<h2>📌 Engineering Takeaways</h2>

<ul>
  <li>Offline-first requires optimistic UI + pessimistic sync</li>
  <li>IndexedDB is storage, not application state</li>
  <li>Network checks must be attempt-based</li>
  <li>PWAs require explicit service worker control</li>
  <li>Mobile behavior differs significantly from desktop</li>
</ul>

<hr/>

<h2>🚀 Planned Enhancements</h2>

<ul>
  <li>Background Sync API</li>
  <li>Exponential backoff retry strategy</li>
  <li>Monthly analytics summary</li>
  <li>CSV / PDF export</li>
  <li>Budget alerts</li>
</ul>

<hr/>

<h2 align="center">👨‍💻 Why This Project Matters</h2>

<p align="center">
This project demonstrates real offline engineering,  
mobile-aware architectural decisions,  
and practical trade-offs beyond tutorial-level implementations.
</p>