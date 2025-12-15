# WikiTruth Platform

A **collaborative web tool** that lets you instantly compare the same Wikipedia article across multiple language editions and GPT models, highlight discrepancies, and export well‑structured reports.

---

## ✨ Key Features

| Category                  | Highlights                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| **Multi-language diff**   | Side‑by‑side view of the source article and its translations with AI explanations of divergences |
| **AI‑powered comparison** | Uses both OpenAI Chat and OpenRouter models for robust fact‑checking and style analysis          |
| **One‑click export**      | Generate DOCX or shareable links suitable for journalists, students, and researchers             |
| **Privacy‑first**         | No user tracking; all sessions stored in ephemeral Keyv storage                                  |
| **Open architecture**     | Express + Node backend with clear API boundaries and pluggable services                          |

---

## 📐 System Architecture

Below is an updated, **layer‑centric Mermaid diagram** reflecting the current client‑server flow, page navigation, and subscription logic.

**Legend**

* **White nodes** — core SPA pages / UX states
* **Blue nodes** — application layers (Frontend & Backend)
* **Yellow nodes** — external APIs and payment gateway integrations

```mermaid
---
config:
  layout: fixed
---
flowchart TD
 subgraph CLIENT["Frontend (React 18 + Vite)"]
    direction TB
        UI["UI Components (Tailwind / shadcn/ui)"]
        i18n["i18next (20 UI languages)"]
        idb["IndexedDB (idb-wrapper)"]
        router["React Router Dom"]
  end
 subgraph SERVER["Backend (Express.js REST Layer)"]
    direction TB
        proxyWiki["Wikipedia Proxy (retry + error handling)"]
        proxyLLM["LLM Proxy (OpenRouter / OpenAI)"]
        checkout["Smart Glocal (Checkout Handoff)"]
  end
 subgraph EXTERNAL["External APIs & Services"]
    direction TB
        wikipedia["(Wikipedia REST API)"]
        openrouter["(OpenRouter LLM)"]
        openai["(OpenAI API)"]
        smartGlocal["Smart Glocal (Payment Gateway)"]
  end
 subgraph PAGES["Core User Screens"]
    direction TB
        main["Main Page (Search & Lang Selector)"]
        langPick["Article-Language (Selection)"]
        advSettings["Advanced Settings (Premium)"]
        genComp["Generate Comparison"]
        result["Result Page (Comparison + Share)"]
        history["History (Local)"]
        info["Informational Pages (About | Help | Privacy…)"]
        settings["Settings (Export / Erase Data)"]
  end
    main -- type query --> langPick
    langPick -- "pick 2-5 langs" --> genComp
    langPick -- Premium user --> advSettings
    advSettings -- confirm --> genComp
    genComp -- success --> result
    genComp -- quota hit / error --> upgrade["Upgrade Modal"]
    result -- "re-run / delete" --> history
    result -- share --> shareAction["OS / Web Share"]
    main -- hamburger menu --> info
    main -- settings icon --> settings
    freePlan["Free Plan (2 comparisons/24 h)"] -- click Unlock Premium --> checkout
    checkout -- success --> premiumPlan["Premium Plan (Unlimited)"]
    premiumPlan -- render crown --> crown["Crown Badge (Premium)"]
    UI -- calls --> proxyWiki & proxyLLM
    UI -- checkout --> checkout
    proxyWiki --> wikipedia
    proxyLLM -- ≤2/day --> openrouter
    proxyLLM -- unlimited --> openai
    checkout --> smartGlocal
    uuid["Generate UUID (on first visit)"] --> idb
    history --> idb
    settings -- export / erase --> idb
     wikipedia:::ext
     openrouter:::ext
     openai:::ext
     smartGlocal:::ext
     main:::page
     langPick:::page
     advSettings:::page
     genComp:::page
     result:::page
     history:::page
     info:::page
     settings:::page
    classDef layer fill:#f0f5ff,stroke:#3b82f6,stroke-width:2px
    classDef page fill:#ffffff,stroke:#60a5fa,stroke-dasharray:4 2
    classDef ext fill:#fff1c1,stroke:#f59e0b,stroke-width:2px
```

---

## 🚀 Getting Started

1. **Clone** the repository
2. `pnpm i` — install dependencies
3. `pnpm dev` — start Vite dev server and backend concurrently
4. Open [http://localhost:5173](http://localhost:5173) in your browser

> ℹ️  Add an `OPENAI_API_KEY` and `OPENROUTER_API_KEY` to `.env.local` for full functionality.

---

## 🗂️ Project Structure

```
apps/
  web/          # React/Vite frontend
  api/          # Express backend
packages/
  wikipedia/    # Wikipedia fetch wrapper
  compare/      # GPT comparison logic
  ui/           # Tailwind + shadcn/ui components
```

---

## 🤝 Contributing

PRs welcome! Please open an issue first to discuss your idea.

---

## 📄 License

MIT © 2025 WikiTruth team
