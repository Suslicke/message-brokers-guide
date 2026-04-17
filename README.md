<div align="center">

# 📨 Message Brokers // Interview Drill

**Interactive interview prep for senior backend roles — RabbitMQ, Kafka, Celery, SQS, NATS.**
**Trainee → Junior → Middle → Senior → Lead + the tricky gotchas.**

[![Live site](https://img.shields.io/badge/live-message--brokers.suslicke.com-58a6ff?style=for-the-badge)](https://message-brokers.suslicke.com/)
[![Status](https://img.shields.io/badge/status-production-22c55e?style=for-the-badge)](https://message-brokers.suslicke.com/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-f38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Questions](https://img.shields.io/badge/questions-75-blue?style=for-the-badge)]()
[![Levels](https://img.shields.io/badge/levels-trainee→lead-purple?style=for-the-badge)]()

**→ [message-brokers.suslicke.com](https://message-brokers.suslicke.com/) ←**

</div>

---

## 📚 What's inside

**75 curated interview questions** across RabbitMQ, Kafka, Celery, Redis Streams, NATS, and AWS SQS — plus distributed-messaging patterns (Saga, Outbox, Idempotency, Back-pressure, Circuit Breaker). Every answer is hand-written with what interviewers actually want to hear and the production trade-offs you need to verbalize.

Includes side-by-side **✅ Good vs ❌ Bad** breakdowns of real production scenarios (payments, email pipelines, order fulfillment sagas) with the specific failure modes each pattern prevents.

<table>
<tr>
<td width="33%" valign="top">

### 🎯 Interview-ready content
- 6 levels: Trainee → Lead + Tricky gotchas
- 9 topics across the whole messaging stack
- **Decision matrix**: which broker to pick, in 60 seconds
- Real production patterns (Outbox, Saga, DLQ, idempotency)
- ✅ Good vs ❌ Bad production stories for payments, email, fulfillment

</td>
<td width="33%" valign="top">

### ⚡ Built for speed
- 🔍 Instant full-text search with live match highlighting
- 💡 Autocomplete suggestions under the search input
- ⌨️ Global shortcuts: `/` and `⌘K` focus search, `Esc` clears, ↑/↓/Enter navigate
- 🏷️ Clickable `#keyword` tags — filter the whole list by any tag
- 📂 Collapsible level group headers — fold entire sections you're done with

</td>
<td width="33%" valign="top">

### 📊 Track your progress
- ✅ Checkbox + **Shift+click** range selection
- 🎯 Rating filter chips: Bookmarked / Hard / Medium / Easy / Unrated (live counts)
- 🙈 Blind mode — hide answers, reveal one at a time
- 📝 Confidence rating (easy / medium / hard) per question
- ⚑ Bookmarks for pre-interview review
- 🧪 **Quiz mode** — random 10-item drill, prioritizes weak + bookmarked
- 📥 Export / Import progress as JSON
- 🎨 Light / Dark theme toggle

</td>
</tr>
</table>

---

## 🎨 Features in detail

| Feature | Details |
|---|---|
| 🌓 **Theme toggle** | Dark terminal vibe by default, one-click switch to light. Persists in `localStorage` |
| 🔍 **Search** | Instant substring match across question text, answer body, and keywords. Matched fragments are highlighted in place |
| 💡 **Search suggestions** | Up to 8 results appear under the input as you type. ↑/↓ navigate, Enter opens + scrolls to the picked question |
| 🏷️ **Tag filtering** | Every `#keyword` under an answer is a clickable pill. Click to filter the list to that tag; click again (or the dismiss × on the active tag chip) to clear |
| 🎯 **Rating / bookmark filter chips** | Row of chips with live counts: All · Bookmarked · Hard · Medium · Easy · Unrated. Combines with search + level + topic |
| 📂 **Collapsible level groups** | Big group headers (TRAINEE · 8 questions · 0/8 done) click to fold an entire level |
| 🙈 **Blind mode** | Hide answers; reveal each one deliberately. Force active recall |
| 🧪 **Quiz mode** | 10-item random drill. Pool prioritizes hard-rated first, then bookmarked, then random. Q → Reveal → rate easy/medium/hard → next. Summary card at the end |
| ⚡ **Shift+click range** | Toggle a run of checkboxes at once. Direction mirrors the new state of the target click (Gmail/Finder style) |
| 📊 **Progress by level** | Stat cards at the top, progress bars per level on the group headers, "confident / needs work" counters |
| 📥 **Export / Import** | Download full progress as JSON, load it back on another device |
| 🙋 **Username** | Optional — attached to GA events as `user_id` so you can see your own stats in reports |
| 🧠 **Consent-first analytics** | Google Analytics with Consent Mode v2, denied by default. IP anonymized |
| 🚀 **Zero backend** | Pure static SPA. Deploys to Cloudflare Workers with one command |

---

## 🧩 What's covered

<details>
<summary><b>Click to expand — 9 topics across 75 questions</b></summary>

| Topic | Focus |
|---|---|
| **Message Broker Concepts** | Pub/sub vs point-to-point, sync vs async, producer/consumer/queue vocabulary |
| **RabbitMQ** | Exchanges, bindings, DLX, confirms, mirrored vs quorum queues |
| **Kafka** | Partitions, offsets, consumer groups, compaction, Schema Registry, hot partitions, replay |
| **Celery** | Task routing, retries, ETA, rate limits, result backends, chord/chain |
| **Redis Streams** | Consumer groups, `XADD`/`XREADGROUP`, pending entries list, vs pub/sub |
| **NATS** | Core vs JetStream, subject hierarchy, durable consumers, deduplication |
| **AWS SQS** | Standard vs FIFO, visibility timeout, long polling, SNS fan-out |
| **Broker Comparison** | Decision matrix, scenario picks, ordering guarantees across brokers |
| **Patterns & Architecture** | Saga, Outbox, idempotency keys, poison messages, back-pressure, exactly-once truth |

### Sample of high-value questions

**Core patterns**
- Broker decision matrix — pick one in 60 seconds
- Exactly-once delivery — truth, myth, and what actually works
- Poison messages — handle them without taking down the queue
- Idempotency keys — why every async consumer needs them
- Saga pattern — distributed transactions without 2PC
- Partition key design — the decision that makes or breaks your Kafka cluster
- Mirrored vs Quorum queues — which to choose in 2026
- Back-pressure — what happens when consumers can't keep up
- Message ordering guarantees — per broker, per scope
- Transactional Outbox — publishing events reliably after a DB commit

**Friendly scenario picks**
- Scenario: "User signs up → 5 services need to react" — which broker?
- Scenario: "100k image uploads/day → resize + thumbnail + OCR" — how to shape it?
- Scenario: "We need to replay 7 days of events after a bug fix" — which broker?

**Real production breakdowns (✅ Good vs ❌ Bad)**
- Payments — naive inline Stripe call vs idempotency-key + outbox (Stripe/Uber/Shopify pattern)
- Email notifications — blocking SMTP vs decoupled worker + DLQ + per-user rate limit
- Order fulfillment saga — nested try/except rollback vs event-driven choreography with compensations
- Designing the consumer — what survives production vs what dies on Monday

</details>

---

## 🖥️ Local development

```bash
git clone https://github.com/Suslicke/message-brokers-guide.git
cd message-brokers-guide
npm install
npm run dev
```

Opens on http://localhost:5173 — hot reload works out of the box.

### Build & preview production bundle

```bash
npm run build       # → dist/
npm run preview     # serves dist/ on :4173
```

### Deploy to Cloudflare Workers

The repo ships with `wrangler.jsonc` + the `@cloudflare/vite-plugin`, so deploying is one command:

```bash
npm run deploy      # vite build + wrangler deploy
```

First time: `npx wrangler login` to authenticate.

---

## 🎯 How to use this tool

1. **Day 1 — pass-through.** Go through all questions with answers visible. Rate confidence honestly (easy/medium/hard).
2. **Day 2 — blind mode.** Hide answers. Try to produce the answer in your head, then reveal. Re-rate confidence.
3. **Day 3 — quiz mode.** Hit the Quiz button in the header. 10 random items, prioritizing weak + bookmarked. Rate each, repeat until the summary shows mostly Easy.
4. **Day 4 — filter to Hard.** Click the Hard chip at the top. Drill only the ones you still don't know cold.
5. **1 hour before interview.** Click Bookmarked. Scan. Deep breath. You've got this.

### Shortcuts

| Key | Action |
|---|---|
| `/` | Focus the search input |
| `⌘K` / `Ctrl+K` | Focus the search input |
| `↑` / `↓` | Navigate search suggestions |
| `Enter` | Open the selected suggestion |
| `Esc` | Clear the search (or blur) |
| `Shift+click` on checkbox | Toggle a whole range |

---

## 🧰 Tech stack

- **React 18** — hooks + contexts, no framework soup
- **Vite 7** — dev server + production bundler
- **lucide-react** — icons
- **Cloudflare Workers** + Static Assets — edge deployment
- **Google Analytics 4** — with Consent Mode v2 (denied by default until user accepts)

No backend. No auth. No database. Just static assets served from the edge with `localStorage` for user state.

---

## 🔐 Privacy

- Analytics loads with `analytics_storage: "denied"` until the user clicks **Accept** in the cookie banner.
- GA4 anonymize-IP is on.
- If a username is entered, it's sent as a GA4 `user_id` + `user_property` — **only** after consent is granted. Leave it blank to stay anonymous.
- All progress (checkboxes, bookmarks, ratings, theme, username) is stored client-side in `localStorage`. Nothing leaves the browser unless you opt in.

### Export / Import

The progress is under localStorage key `interview-prep:v1`. Use the **export** button to download JSON for backup; use **import** to load it on another device. Safe to inspect/edit the JSON manually.

---

## 🧱 Project structure

```
.
├── src/
│   ├── App.jsx        # main component, state, search, theme, consent, quiz
│   ├── data.js        # all 75 questions + LEVELS + TOPICS config
│   ├── analytics.js   # gtag loader + trackEvent / setAnalyticsUser helpers
│   ├── main.jsx       # React entry + theme init (before render)
│   └── index.css      # CSS variables for dark/light, font imports
├── public/            # static assets
├── index.html
├── vite.config.js     # Vite + @cloudflare/vite-plugin
├── wrangler.jsonc     # Cloudflare Workers + Static Assets config
├── package.json
└── README.md
```

---

## 🤝 Contributing

Found a mistake? Want to add a topic? Open an issue or a pull request.

Questions live in [`src/data.js`](src/data.js) as a flat array of `{ id, level, topic, q, a, keywords }`. Add a new one at the bottom with a unique `id`. The `keywords` array becomes clickable `#tag` filters in the UI, so pick them thoughtfully.

---

<div align="center">

Created by **Andrei** · [@Suslicke](https://t.me/Suslicke)

_If this helps you nail the broker questions, a ⭐ would make my day._

</div>
