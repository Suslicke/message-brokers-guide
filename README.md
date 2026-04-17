# Message Brokers // Interview Drill

Interactive interview prep for senior backend roles. Covers **Celery, RabbitMQ, Kafka** and distributed messaging patterns — from trainee to lead level, plus the tricky gotcha questions.

![level](https://img.shields.io/badge/level-trainee→lead-blue)
![questions](https://img.shields.io/badge/questions-58-green)
![stack](https://img.shields.io/badge/stack-React%20%2B%20Vite-orange)

## Features

- **58 curated questions** across 6 levels (Trainee → Junior → Middle → Senior → Lead → Tricky)
- **9 topics**: Message Broker concepts, RabbitMQ, Kafka, Celery, **Redis Streams**, **NATS**, **AWS SQS**, Broker Comparison, Architecture Patterns
- **Blind mode** — hide answers to force yourself to think before revealing
- **Confidence rating** (easy / medium / hard) per question for targeted review
- **Bookmarks** for quick pre-interview refresh
- **Progress tracking** by level with visual bars
- **Auto-save to localStorage** — your progress survives page refreshes
- **Export/Import** progress as JSON — backup or sync between devices
- **Filters**: by level, by topic, hide completed
- **Terminal / blueprint aesthetic** with JetBrains Mono + Space Grotesk

## Quick Start

```bash
# install deps
npm install

# run dev server (opens at http://localhost:5173)
npm run dev

# build for production
npm run build

# preview the production build
npm run preview
```

## Project Structure

```
.
├── src/
│   ├── App.jsx       # main component, state, persistence
│   ├── data.js       # all 59 questions + levels/topics config
│   ├── main.jsx      # React entry point
│   └── index.css     # global styles + fonts
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## How Progress is Saved

Progress is stored in `localStorage` under the key `interview-prep:v1`. It persists across:

- ✅ Page refreshes
- ✅ Browser restarts
- ✅ Computer restarts

But **not** across different browsers or devices — for that, use the **export** button to download your progress as JSON, then **import** it elsewhere.

### What gets saved

- Completed questions (checkmarks)
- Bookmarked questions
- Confidence ratings (easy / medium / hard)
- Revealed answers (in blind mode)
- Active filters (level, topic, hide completed)
- Blind mode on/off
- Intro panel dismissed state

### Reset

Click the **reset** button in the controls bar to clear everything. Confirmation required.

## Adding Your Own Questions

Edit `src/data.js`. Each question follows this shape:

```js
{
  id: 100,                    // unique integer
  level: "senior",            // trainee | junior | middle | senior | lead | tricky
  topic: "kafka",             // concepts | rabbitmq | kafka | celery | redis | nats | sqs | comparison | patterns
  q: "Your question here",
  a: `Your answer here.
Multi-line is fine.
Code blocks, bullet points with •, arrows with ->, everything works.`,
  keywords: ["keyword1", "keyword2"],  // shown as tags under the answer
}
```

## Tech Stack

- **React 18** — UI
- **Vite 5** — build tool & dev server
- **lucide-react** — icons
- No CSS framework — inline styles + minimal global CSS for consistency

## Tips for Using This Tool

1. **Day 1 pass**: Go through all questions with answers visible. Mark confidence honestly.
2. **Day 2 pass**: Turn on **blind mode**. Try to answer in your head, then reveal. Re-rate confidence.
3. **Day 3 pass**: Filter to only `hard` + bookmarked. Drill those.
4. **1 hour before interview**: Look only at bookmarks. Deep breath. You got this.

## License

MIT — do whatever you want. Good luck with the interview.
