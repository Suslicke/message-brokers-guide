<div align="center">

# 📨 Message Brokers // Interview Drill

**Interactive interview prep for senior backend roles — RabbitMQ, Kafka, Celery, SQS, NATS.**
**Trainee → Junior → Middle → Senior → Lead + the tricky gotchas.**

[![Status](https://img.shields.io/badge/status-production-22c55e?style=for-the-badge)]()
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-f38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Questions](https://img.shields.io/badge/questions-69-blue?style=for-the-badge)]()
[![Levels](https://img.shields.io/badge/levels-trainee→lead-purple?style=for-the-badge)]()

</div>

---

## 📚 What's inside

**69 curated interview questions** across RabbitMQ, Kafka, Celery, Redis Streams, NATS, and AWS SQS — plus distributed-messaging patterns (Saga, Outbox, Idempotency, Back-pressure, Circuit Breaker). Every answer is hand-written with what interviewers actually want to hear and the production trade-offs you need to verbalize.

<table>
<tr>
<td width="33%" valign="top">

### 🎯 Interview-ready content
- 6 levels: Trainee → Lead + Tricky gotchas
- 9 topics across the whole messaging stack
- **Decision matrix**: which broker to pick, in 60 seconds
- Real production patterns (Outbox, Saga, DLQ, idempotency)
- ✅ Good vs ❌ Bad consumer design

</td>
<td width="33%" valign="top">

### ⚡ Built for speed
- 🔍 Full-text search across Q + A + keywords
- ⌨️ Global shortcuts: `/` and `⌘K` focus search, `Esc` to clear
- 🏷️ Filter by level / topic
- 🙈 Blind mode — hide answers to force yourself to think
- 📝 Confidence rating (easy / medium / hard) per question

</td>
<td width="33%" valign="top">

### 📊 Track your progress
- ✅ Checkbox progress — auto-saved to `localStorage`
- ⚑ Bookmark for pre-interview review
- 📥 Export/import progress as JSON
- 🎨 Light / Dark theme toggle
- 🙋 Optional username — per-user stats in analytics
- 🔐 Consent-first analytics (Mode v2, denied by default)

</td>
</tr>
</table>

---

## 🎨 Features

| Feature | Details |
|---|---|
| 🌓 **Theme toggle** | Dark terminal vibe by default, one-click switch to light. Persists in `localStorage` |
| 🔍 **Search** | Instant match across question text, answer body, and keywords. Live match counter |
| 🙈 **Blind mode** | Hide answers; reveal one at a time. Force yourself to actually think |
| 📊 **Progress by level** | Progress bars per level; "confident" / "needs work" counts at a glance |
| 📥 **Export / Import** | Download your progress as JSON; load it back on another device |
| 🙋 **Username** | Optional — attached to GA events as `user_id` so you can see your own stats |
| 🧠 **Consent-first analytics** | Google Analytics with Consent Mode v2, denied by default. IP anonymized |
| 🚀 **Zero backend** | Pure static SPA. Deploys to Cloudflare Workers with one command |

---

## 🧩 What's covered

<details>
<summary><b>Click to expand — 9 topics across 69 questions</b></summary>

| Topic | Focus |
|---|---|
| **Message Broker Concepts** | Pub/sub vs point-to-point, sync vs async, producer/consumer/queue vocabulary |
| **RabbitMQ** | Exchanges, bindings, DLX, confirms, mirrored vs quorum queues |
| **Kafka** | Partitions, offsets, consumer groups, compaction, Schema Registry, hot partitions |
| **Celery** | Task routing, retries, ETA, rate limits, result backends, chord/chain |
| **Redis Streams** | Consumer groups, `XADD`/`XREADGROUP`, pending entries list, vs pub/sub |
| **NATS** | Core vs JetStream, subject hierarchy, durable consumers, deduplication |
| **AWS SQS** | Standard vs FIFO, visibility timeout, long polling, SNS fan-out |
| **Broker Comparison** | Decision matrix, when to pick which, ordering guarantees across brokers |
| **Patterns & Architecture** | Saga, Outbox, idempotency keys, poison messages, back-pressure, exactly-once truth |

### Sample of high-value questions

- Broker decision matrix — pick one in 60 seconds
- Exactly-once delivery — truth, myth, and what actually works
- Poison messages — handle them without taking down the queue
- Idempotency keys — why every async consumer needs them
- Saga pattern — distributed transactions without 2PC
- Partition key design — the decision that makes or breaks your Kafka cluster
- Mirrored vs Quorum queues — which to choose in 2026
- Back-pressure — what happens when consumers can't keep up
- Message ordering guarantees — per broker, per scope
- ✅ Good vs ❌ Bad — designing the consumer
- Transactional Outbox — publishing events reliably after a DB commit

</details>

---

## 🖥️ Local development

```bash
git clone https://github.com/Suslicke/message-broker-interview-prep.git
cd message-broker-interview-prep
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

1. **Day 1 — pass-through.** Go through all questions with answers visible. Rate confidence honestly.
2. **Day 2 — blind mode.** Hide answers. Try to produce the answer in your head, then reveal. Re-rate confidence.
3. **Day 3 — focus on hard + bookmarked.** Filter to only `hard` ratings + bookmarks. Drill those.
4. **1 hour before interview.** Look only at bookmarks and the decision matrix. Deep breath. You've got this.

### Shortcuts

| Key | Action |
|---|---|
| `/` | Focus the search input |
| `⌘K` / `Ctrl+K` | Focus the search input |
| `Esc` | Clear search (or blur if already empty) |

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
│   ├── App.jsx        # main component, state, search, theme, consent
│   ├── data.js        # all questions + LEVELS + TOPICS config
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

Questions live in [`src/data.js`](src/data.js) as a flat array of `{ id, level, topic, q, a, keywords }`. Add a new one at the bottom with a unique `id`.

---

<div align="center">

Created by **Andrei** · [@Suslicke](https://t.me/Suslicke)

_If this helps you nail the broker questions, a ⭐ would make my day._

</div>
