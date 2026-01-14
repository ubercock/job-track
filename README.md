# JobTrack — Job Application Tracker (Next.js + TypeScript + shadcn/ui)

JobTrack is a frontend-only job application tracker designed to feel like a real internal tool.  
It supports CRUD, fast filtering, lightweight insights, and persistent storage using localStorage — deployable to Vercel.

This project is intentionally built to maximize junior hiring signals: routing, reusable components, validation, UX states, accessibility patterns, and clean architecture.

---

## Problem → Solution

**Problem:** Job searching gets messy fast — scattered notes, forgotten follow-ups, no clear view of your pipeline.  
**Solution:** JobTrack provides a clean pipeline, searchable list/board layout, and lightweight insights — all stored locally so it works without a backend.

---

## Key Features

### Core Product
- ✅ Add / Edit / Delete job applications (CRUD)
- ✅ Search + filter by status + sort
- ✅ Pipeline board grouped by status
- ✅ Insights page: KPI totals + status breakdown bars + top companies

### UX & Polish
- ✅ Multi-page routing (App Router): Home, Tracker, Insights, Settings
- ✅ Reusable component system via shadcn/ui (Button, Card, Input, Badge, Dialog, Skeleton, Toast)
- ✅ Empty states + filtered-to-zero state + success toasts
- ✅ Safe destructive actions via AlertDialog (no `confirm()`)

### Accessibility & Performance
- ✅ Keyboard-first UI (Radix primitives via shadcn/ui)
- ✅ Focus-visible rings and semantic structure
- ✅ Lightweight CSS bars (no chart libraries)
- ✅ Frontend-only: fast dev loop and easy deploy

---

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- shadcn/ui (Radix + Tailwind)
- Sonner toasts

---

## localStorage: What’s stored and why

This project uses localStorage to simulate “real product behavior” without a backend:

- **`jobtrack.apps.v1`**  
  Stores the array of job applications (company, role, status, notes, timestamps).  
  **Why:** Your tracker data persists after refresh and can be demoed offline.

- **`jobtrack.prefs.v1`**  
  Stores user preferences like density (compact/comfort) and default sort.  
  **Why:** A real app remembers user preferences across sessions.

---

## Folder Structure (App Router)

<br>|_src/
<br>&nbsp;|_app/
<br>&nbsp;&nbsp;|__page.tsx
<br>&nbsp;&nbsp;|__layout.tsx
<br>&nbsp;&nbsp;|__globals.css
<br>&nbsp;&nbsp;|__tracker/
<br>&nbsp;&nbsp;&nbsp;|__page.tsx
<br>&nbsp;&nbsp;&nbsp;|__tracker-client.tsx
<br>&nbsp;&nbsp;&nbsp;|__loading.tsx
<br>&nbsp;&nbsp;|__insights/
<br>&nbsp;&nbsp;&nbsp;|__page.tsx
<br>&nbsp;&nbsp;&nbsp;|__insights-client.tsx
<br>&nbsp;&nbsp;&nbsp;|__loading.tsx
<br>&nbsp;&nbsp;|__settings/
<br>&nbsp;&nbsp;&nbsp;|__page.tsx
<br>&nbsp;&nbsp;&nbsp;|__settings-client.tsx
<br>&nbsp;|__components/
<br>&nbsp;&nbsp;|__site-header.tsx
<br>&nbsp;&nbsp;|__site-footer.tsx
<br>&nbsp;&nbsp;|__prefs-sync.tsx
<br>&nbsp;&nbsp;|__ui/ (shadcn components)
<br>&nbsp;|__lib/
<br>&nbsp;&nbsp;|__types.ts
<br>&nbsp;&nbsp;|__storage.ts
<br>&nbsp;&nbsp;|__utils.ts
<br>

---

## Run Locally

```bash
npm install
npm run dev
Open: http://localhost:3000
```
---
## What I Learned

- *How to build a multi-page App Router project with shared layout*

- *How to design a reusable component system with shadcn/ui*

- *How to implement frontend persistence (localStorage) safely*

- *How to ship UX states: empty, filtered-to-zero, success feedback, safe destructive flows*

- *How to keep UI accessible with keyboard navigation and focus management primitives*

## Interview Talking Points (10)

**App Router structure: separated marketing vs product pages for clarity and SEO.**

**Client/server boundary: interactive pages use use client; static shells remain server-rendered.**

**Persistence choice: localStorage simulates backend persistence without adding complexity.**

**Data model: strongly typed JobApplication keeps UI predictable and reduces bugs.**

**Hook design: useLocalStorageState loads once and safely recovers from corrupted JSON.**

**UX states: intentionally designed empty and filtered-to-zero states to avoid “dead UI”.**

**Accessible destructive actions: replaced confirm() with AlertDialog for focus + intent clarity.**

**Performance tradeoff: avoided heavy charts; used CSS bars for fast insights visuals.**

**Reusable components: consistent design language via shadcn/ui; no “UI soup”.**

**Preference sync: density stored + applied globally using a single PrefsSync component.**

## Hiring Manager Checklist (what this proves)

✅ *Can build a real, deployable Next.js app (routing + layout)*

✅ *Understands component systems (reusability + consistency)*

✅ *Can manage state and persistence without Redux*

✅ *Can implement validation and user feedback*

✅ *Thinks about accessibility and safe UI patterns*

✅ *Designs clean responsive layouts with strong hierarchy*

---
