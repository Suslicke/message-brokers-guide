// ============== CONFIGURATION ==============

export const LEVELS = {
  trainee: { label: "TRAINEE", color: "#7dd3a0", order: 1 },
  junior: { label: "JUNIOR", color: "#7dc8e8", order: 2 },
  middle: { label: "MIDDLE", color: "#d4a574", order: 3 },
  senior: { label: "SENIOR", color: "#e89a7e", order: 4 },
  lead: { label: "LEAD", color: "#c97b9e", order: 5 },
  tricky: { label: "TRICKY", color: "#e84855", order: 6 },
};

export const TOPICS = {
  concepts: "Message Brokers: Concepts",
  rabbitmq: "RabbitMQ",
  kafka: "Kafka",
  celery: "Celery",
  redis: "Redis Streams",
  nats: "NATS",
  sqs: "AWS SQS",
  comparison: "Broker Comparison",
  patterns: "Patterns & Architecture",
};

// ============== QUESTIONS ==============

export const QUESTIONS = [
  // ============== TRAINEE / CONCEPTS ==============
  {
    id: 1, level: "trainee", topic: "concepts",
    q: "What is a message broker and why do we need one?",
    a: `A message broker is a middleware that enables services to communicate by exchanging messages asynchronously. The producer sends a message to the broker; the broker routes/stores it; the consumer reads it.

Why we need it:
• Decoupling — producer doesn't know about consumers
• Asynchronicity — producer doesn't wait for processing
• Reliability — messages persist even if consumer is down
• Load leveling — smooths traffic spikes (buffer)
• Scalability — add more consumers to process faster`,
    keywords: ["decoupling", "async", "buffer", "producer", "consumer"],
  },
  {
    id: 2, level: "trainee", topic: "concepts",
    q: "What is the difference between synchronous and asynchronous communication?",
    a: `SYNCHRONOUS: The caller blocks and waits for a response (HTTP request/response, gRPC). If the receiver is down — you get an error immediately.

ASYNCHRONOUS: The caller sends a message and continues execution. Processing happens "sometime later". If the receiver is down — the message waits in the queue.

Rule of thumb: sync for "I need the answer right now", async for "do this eventually / in the background / notify others".`,
    keywords: ["blocking", "non-blocking", "HTTP", "queue"],
  },
  {
    id: 3, level: "trainee", topic: "concepts",
    q: "Producer, Consumer, Queue, Topic, Message — explain each.",
    a: `• PRODUCER (publisher) — sends messages
• CONSUMER (subscriber) — receives and processes messages
• MESSAGE — a unit of data (payload + metadata/headers)
• QUEUE — FIFO buffer; typically one message goes to ONE consumer (point-to-point)
• TOPIC — a publish-subscribe channel; the message is delivered to ALL subscribers
• EXCHANGE (RabbitMQ-specific) — the routing layer between producer and queue`,
    keywords: ["FIFO", "pub-sub", "point-to-point"],
  },
  {
    id: 4, level: "trainee", topic: "celery",
    q: "What is Celery and what is it used for?",
    a: `Celery is a distributed task queue for Python. It lets you run functions asynchronously (in the background) or on a schedule.

Typical use cases:
• Sending emails/SMS/notifications
• Image/video processing
• Report generation
• Integrating with slow third-party APIs
• Periodic jobs (Celery Beat) — cleanup, sync, etc.

Architecture: Client -> Broker (RabbitMQ/Redis) -> Worker -> Result Backend (optional).`,
    keywords: ["task queue", "worker", "beat", "background"],
  },
  {
    id: 5, level: "trainee", topic: "rabbitmq",
    q: "What is RabbitMQ in simple terms?",
    a: `RabbitMQ is a message broker that implements the AMQP protocol. It accepts messages from producers, routes them through EXCHANGES into QUEUES, and delivers them to consumers.

Key feature: smart routing via exchanges (direct, topic, fanout, headers). It's a "smart broker, dumb consumer" — the broker decides who gets what.`,
    keywords: ["AMQP", "exchange", "queue", "routing"],
  },

  // ============== JUNIOR ==============
  {
    id: 10, level: "junior", topic: "rabbitmq",
    q: "What types of Exchanges exist in RabbitMQ?",
    a: `1. DIRECT — routes by exact match of the routing_key. Example: key="error" -> queue "errors"

2. FANOUT — broadcasts to ALL bound queues, ignoring the routing_key. Classic pub-sub.

3. TOPIC — routes by pattern matching on routing_key with wildcards:
   • * (asterisk) — matches exactly one word
   • # (hash) — matches zero or more words
   Example: "order.*.created" matches "order.us.created"

4. HEADERS — routes by message headers instead of routing_key. Rarely used.

5. DEFAULT (nameless) — special direct exchange; routing_key = queue name.`,
    keywords: ["direct", "fanout", "topic", "headers", "binding"],
  },
  {
    id: 11, level: "junior", topic: "rabbitmq",
    q: "What is ACK / NACK? What happens if a consumer doesn't send an ack?",
    a: `ACK (acknowledgement) — the consumer tells the broker "I processed the message, delete it".
NACK (negative ack) / REJECT — the consumer says "I can't process this" (optionally with requeue=true/false).

If the consumer doesn't send an ack and disconnects (crash, network issue), RabbitMQ automatically redelivers the message to another consumer.

auto_ack=True is DANGEROUS: the message is considered acked the moment it's delivered. If the worker crashes mid-processing — the message is LOST.

Best practice: manual ack, AFTER successful processing. Set a reasonable consumer_timeout.`,
    keywords: ["acknowledgement", "redelivery", "auto_ack", "consumer_timeout"],
  },
  {
    id: 12, level: "junior", topic: "kafka",
    q: "What is Kafka and how is it different from RabbitMQ at a basic level?",
    a: `Kafka is a distributed streaming platform — essentially a distributed, append-only, partitioned log.

Key difference from RabbitMQ:
• Kafka stores messages for a long time (retention by time or size), even after reading
• RabbitMQ traditionally deletes a message after ack
• Kafka — "dumb broker, smart consumer": the consumer tracks its own offset
• RabbitMQ — "smart broker": the broker handles routing and state

Kafka is optimized for high throughput (millions of msg/sec), RabbitMQ for flexible routing and low latency.`,
    keywords: ["log", "partition", "retention", "offset", "streaming"],
  },
  {
    id: 13, level: "junior", topic: "kafka",
    q: "What is a Partition and why do we need it?",
    a: `A Partition is a physical segment of a Topic. Each topic is split into N partitions, each of which is an ordered, immutable log of messages.

Why partitions exist:
• PARALLELISM — different consumers in a group read different partitions simultaneously
• SCALABILITY — partitions are distributed across brokers in the cluster
• ORDERING — ordering is guaranteed WITHIN a partition, NOT across the whole topic

The producer decides which partition a message goes to: by key (hash(key) % N) or round-robin if no key.`,
    keywords: ["parallelism", "ordering", "key", "hash", "log"],
  },
  {
    id: 14, level: "junior", topic: "celery",
    q: "What's the difference between delay() and apply_async()?",
    a: `delay() is a shortcut for apply_async() with minimal arguments.

task.delay(arg1, arg2)
# equivalent to:
task.apply_async(args=[arg1, arg2])

apply_async() lets you pass extra options:
• countdown — delay execution by N seconds
• eta — run at a specific datetime
• expires — task expires if not picked up
• queue — route to a specific queue
• priority — message priority
• retry, retry_policy
• headers, link (chaining)

Rule: delay() for simple calls, apply_async() when you need control.`,
    keywords: ["delay", "apply_async", "countdown", "eta", "queue"],
  },
  {
    id: 15, level: "junior", topic: "celery",
    q: "What is a Result Backend and is it always required?",
    a: `The Result Backend stores the results of task execution (state: PENDING/STARTED/SUCCESS/FAILURE, return value, traceback).

Typical backends: Redis, RabbitMQ (rpc://), database, Memcached.

Is it required? NO. If you don't care about the result (fire-and-forget), disable it:
@app.task(ignore_result=True)

Why disable when not needed:
• Performance — every result is an extra write to the backend
• Resource waste — results hang around until expiration
• Common mistake: using RabbitMQ as backend creates a unique queue PER task -> quickly overloads the broker`,
    keywords: ["result_backend", "ignore_result", "redis", "rpc"],
  },

  // ============== MIDDLE ==============
  {
    id: 20, level: "middle", topic: "rabbitmq",
    q: "Explain Dead Letter Queue (DLQ). How do you set it up?",
    a: `A Dead Letter Queue is where messages go that cannot be processed. A message becomes "dead" when:
• It's nacked/rejected with requeue=false
• TTL expires
• Queue length limit is reached (x-max-length)

Setup (via arguments on queue declaration):
channel.queue_declare(
  queue='main_queue',
  arguments={
    'x-dead-letter-exchange': 'dlx',
    'x-dead-letter-routing-key': 'failed',
    'x-message-ttl': 60000,
  }
)

Pattern: main_queue -> (reject/ttl) -> DLX -> dlq. Then a separate process / human analyzes the DLQ. Combined with retry exchange, you get a full retry-with-backoff flow.`,
    keywords: ["DLQ", "DLX", "TTL", "x-dead-letter-exchange", "retry"],
  },
  {
    id: 21, level: "middle", topic: "rabbitmq",
    q: "What is Prefetch Count and how do you tune it?",
    a: `Prefetch count (QoS) — the maximum number of unacked messages the broker will send to one consumer at a time.

channel.basic_qos(prefetch_count=10)

Trade-off:
• prefetch=1 — fair distribution between consumers, but higher latency (round-trips)
• prefetch=HIGH — higher throughput, but "fast" consumers hog messages while "slow" ones sit idle; also more RAM usage

Tuning:
• Fast tasks (< 100ms) -> prefetch 50-200
• Slow tasks (> 1s) -> prefetch 1-10
• Uneven tasks -> lower prefetch for fair distribution
• Formula: prefetch ~ (round-trip time / processing time) * desired_utilization`,
    keywords: ["QoS", "basic_qos", "fairness", "throughput"],
  },
  {
    id: 22, level: "middle", topic: "kafka",
    q: "What is a Consumer Group? What are rebalancing issues?",
    a: `A Consumer Group is a set of consumers that collectively read from a topic. Kafka distributes partitions among members of the group: each partition goes to EXACTLY ONE consumer in the group.

Rules:
• If consumers > partitions — the extras are idle
• If consumers < partitions — some consumers handle multiple partitions
• Different groups read INDEPENDENTLY (each has its own offset)

Rebalancing — reassignment of partitions when a consumer joins/leaves. Problems:
• "STOP THE WORLD" — in the old protocol, all consumers stop during rebalancing
• Can be triggered by a slow consumer (session timeout expires)
• Solution: Cooperative Sticky Assignor (KIP-429) — incremental rebalancing
• Tune session.timeout.ms, heartbeat.interval.ms, max.poll.interval.ms`,
    keywords: ["consumer group", "rebalancing", "cooperative sticky", "offset"],
  },
  {
    id: 23, level: "middle", topic: "kafka",
    q: "What delivery guarantees does Kafka provide? (At most / at least / exactly once)",
    a: `AT MOST ONCE — the message is delivered 0 or 1 times. Producer: acks=0. Consumer commits offset BEFORE processing. Loss possible, duplicates not.

AT LEAST ONCE — 1 or more times (the default). Producer: acks=all, retries>0. Consumer commits offset AFTER processing. Duplicates possible -> consumer must be idempotent.

EXACTLY ONCE (EOS) — exactly once. Requires:
• enable.idempotence=true on producer (Producer ID + sequence number)
• Transactions: producer.initTransactions(), beginTransaction(), commitTransaction()
• isolation.level=read_committed on consumer
• Works for "consume -> process -> produce" inside Kafka. For external side effects (DB, HTTP) you still need idempotency on your side.`,
    keywords: ["acks", "idempotence", "transactions", "EOS", "isolation.level"],
  },
  {
    id: 24, level: "middle", topic: "celery",
    q: "How do task retries work? Configure a retry with exponential backoff.",
    a: `@app.task(
  bind=True,
  autoretry_for=(RequestException,),
  retry_backoff=True,          # exponential: 1, 2, 4, 8, 16...
  retry_backoff_max=600,        # cap
  retry_jitter=True,            # add random jitter — prevents thundering herd
  retry_kwargs={'max_retries': 5},
)
def fetch_data(self, url):
    try:
        return requests.get(url).json()
    except SomeOtherError as exc:
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)

Key points:
• bind=True — gives access to self (task instance)
• self.request.retries — current retry number
• Retry = re-queuing the task (the message returns to the broker)
• MaxRetriesExceededError is thrown after max_retries
• JITTER is critical — without it, 1000 failed tasks all retry at the same moment -> DDoS on your own infrastructure`,
    keywords: ["autoretry_for", "backoff", "jitter", "max_retries", "bind"],
  },
  {
    id: 25, level: "middle", topic: "celery",
    q: "What are Celery queues and how do you route tasks?",
    a: `Celery supports multiple queues for segregating tasks by priority/type/resources.

# celery config
task_queues = {
    Queue('default', routing_key='task.default'),
    Queue('emails', routing_key='task.email'),
    Queue('heavy', routing_key='task.heavy'),
}
task_routes = {
    'myapp.tasks.send_email': {'queue': 'emails'},
    'myapp.tasks.generate_report': {'queue': 'heavy'},
}

Run workers on specific queues:
celery -A app worker -Q emails --concurrency=20
celery -A app worker -Q heavy --concurrency=2

Why separate:
• CPU-heavy tasks shouldn't block fast tasks
• Critical tasks (payments) in a dedicated queue
• Different concurrency tuning per queue type
• Scale workers independently`,
    keywords: ["task_routes", "queues", "concurrency", "-Q"],
  },
  {
    id: 26, level: "middle", topic: "patterns",
    q: "What is idempotency and why is it critical for message brokers?",
    a: `Idempotency — the property where repeated execution of an operation gives the same result as a single execution.

f(x) == f(f(x)) == f(f(f(x)))

Why it matters: almost all brokers provide AT LEAST ONCE delivery by default. Duplicates WILL happen:
• Consumer crashed after processing but before ack
• Producer retried after a timeout but the message actually went through
• Rebalancing in Kafka

How to achieve idempotency:
1. Natural — SET operations, upserts by a unique key
2. Idempotency key — client-side unique_id; check "have I seen this?" in a DB/Redis before processing
3. Deduplication table — UNIQUE constraint on message_id
4. Optimistic locking — version/updated_at
5. State machine — only allow valid transitions (pending -> paid, but not paid -> paid)`,
    keywords: ["idempotency key", "deduplication", "upsert", "at least once"],
  },

  // ============== SENIOR ==============
  {
    id: 30, level: "senior", topic: "rabbitmq",
    q: "How does clustering work in RabbitMQ? What are Quorum Queues?",
    a: `CLASSIC CLUSTER: nodes share metadata (exchanges, bindings, users), but queues by default live on ONE node (leader). Messages do NOT replicate automatically.

CLASSIC MIRRORED QUEUES (deprecated since 3.8): replication via policy "ha-mode". Problems: split-brain, data loss during network partitions, slow sync.

QUORUM QUEUES (the modern replacement):
• Based on the Raft consensus algorithm
• Replicated across N nodes, strict majority quorum
• Guarantees safety over availability (CP in CAP)
• No message loss during network partitions
• Slower than classic, but predictable
• Used for critical messages

STREAMS (3.9+): append-only log a la Kafka, for high-throughput use cases within RabbitMQ.

Rule: Quorum Queues for business-critical messages, Classic for non-critical/ephemeral.`,
    keywords: ["raft", "quorum", "mirrored", "streams", "split-brain"],
  },
  {
    id: 31, level: "senior", topic: "kafka",
    q: "How does ISR, acks=all, and min.insync.replicas work?",
    a: `ISR (In-Sync Replicas) — the set of replicas that are "caught up" with the leader (replica.lag.time.max.ms).

acks producer setting:
• acks=0 — fire and forget, no ACK at all (fastest, loss possible)
• acks=1 — leader wrote the message (default before 3.0). Loss possible if leader dies before followers replicate
• acks=all (or -1) — ALL replicas in ISR confirmed. Safest

min.insync.replicas — the minimum size of ISR for a write to succeed. If ISR shrinks below this, the producer gets NotEnoughReplicasException.

Standard production config:
• replication.factor=3
• min.insync.replicas=2
• acks=all

This means: you tolerate losing 1 node without downtime or data loss. If 2 nodes die — writes stop (but data is preserved on the survivor). This is the classic C-over-A trade-off.

A common pitfall: replication.factor=3 but min.insync.replicas=1 -> under the illusion of "safety" you can actually lose data.`,
    keywords: ["ISR", "acks", "min.insync.replicas", "replication.factor"],
  },
  {
    id: 32, level: "senior", topic: "kafka",
    q: "Explain Log Compaction vs time-based retention.",
    a: `TIME/SIZE RETENTION (default): messages are deleted after retention.ms (default 7 days) or when topic size exceeds retention.bytes. Good for event streams.

LOG COMPACTION (cleanup.policy=compact): keeps only the LATEST message per key. Deleted keys are marked with a "tombstone" (null value).

Use cases for compact:
• Storing current state (e.g., "latest user profile")
• Changelog topics in Kafka Streams (rebuildable state)
• Database CDC
• Configuration storage

Mechanics:
• Active segment — always written to, not compacted
• Inactive segments — periodically compacted by LogCleaner
• min.cleanable.dirty.ratio — when to trigger compaction (default 0.5)
• delete.retention.ms — how long tombstones are kept

Combined: cleanup.policy=compact,delete — both compaction and time-based cleanup.

Trick: compaction is NOT instant. You can read duplicate keys between compactions.`,
    keywords: ["compaction", "tombstone", "cleanup.policy", "LogCleaner"],
  },
  {
    id: 33, level: "senior", topic: "celery",
    q: "Celery is stuck: tasks hang, workers don't pick up. Diagnosis algorithm?",
    a: `1. CHECK THE BROKER
   • rabbitmqctl list_queues name messages consumers
   • redis-cli LLEN celery
   • Is the queue growing? Are there consumers?

2. CHECK WORKERS
   • celery -A app inspect active — what's running right now
   • celery -A app inspect reserved — what's been prefetched
   • celery -A app inspect stats — stats per worker
   • ps aux | grep celery — are the processes alive

3. COMMON CAUSES
   • Task times out but visibility_timeout (Redis) is shorter -> duplicate deliveries
   • worker_prefetch_multiplier too high -> workers grabbed tasks and are sitting on them
   • task_acks_late=False + long task -> worker killed by OOM, task lost
   • Deadlock in the task (e.g., SELECT FOR UPDATE + external call)
   • DNS/network issue to broker
   • Task not imported on worker (wrong module) -> NotRegistered error in logs

4. TOOLS
   • Flower — web UI monitoring
   • celery events — real-time event log
   • Prometheus exporter + Grafana

5. FIX
   • worker_prefetch_multiplier=1 for long tasks
   • task_acks_late=True + task_reject_on_worker_lost=True
   • soft_time_limit < time_limit < broker visibility_timeout
   • Configure health checks and auto-restart`,
    keywords: ["inspect", "prefetch_multiplier", "acks_late", "visibility_timeout", "flower"],
  },
  {
    id: 34, level: "senior", topic: "comparison",
    q: "When to choose Kafka, when RabbitMQ, when Celery? Decision matrix.",
    a: `THE ONE-LINE MENTAL MODEL:
• RabbitMQ is for services having a CONVERSATION: "do this now, and ack when you're done".
• Kafka is for services SHARING A MEMORY: "here's what happened; anyone who cares, read the log and catch up".
• Celery is NOT a broker — it's a task-queue FRAMEWORK on top of a broker (RabbitMQ or Redis).

THE CLEAN BOUNDARY (90% of interview cases):
   Need to replay events or hold history for > 24h?    → Kafka
   Everything else in event-driven + microservices?    → RabbitMQ is fine, often simpler
   Python background jobs with retries + scheduling?   → Celery (backed by RabbitMQ or Redis)

Anyone who says "you must use Kafka for event-driven architecture" is wrong. RabbitMQ pub-sub (topic/fanout exchanges) powered event-driven systems for a decade before Kafka was mainstream.

─────────────────────────────
CHOOSE RABBITMQ WHEN you want:

1. COMPLEX ROUTING AT THE BROKER
   Topic/headers exchanges route by pattern ("order.*.cancelled"), header value, or message type. The producer fires one message; the broker decides who gets what. Kafka does none of this — consumers must pre-subscribe to specific topics.

2. TASK QUEUES (work distribution)
   Multiple workers competing for items in the SAME queue. Each message goes to exactly one worker, acked when done, redelivered on crash. Per-message ack/retry/DLQ is native.

3. PRIORITIES
   A single queue can have priority levels so VIP events jump ahead. Kafka has no priority concept — order is strictly per-partition.

4. REQUEST/REPLY (RPC over messaging)
   Producer sends a request with a reply_to queue, awaits the response. Perfectly supported. Kafka can do it with correlation IDs + response topics but it's awkward.

5. EVENT-DRIVEN MICROSERVICES without history
   The classic "user signed up → 5 services react" fan-out. Each consumer gets its own durable queue bound to a topic exchange. No replay needed — yesterday's signup event doesn't matter to a new subscriber. This is RabbitMQ's sweet spot that people mistakenly send to Kafka.

6. LOW LATENCY
   Push model + AMQP = typically <10ms broker→consumer. Kafka is usually tens of ms because of poll/batch fetch semantics.

7. MODERATE THROUGHPUT
   Comfortable up to ~50k msg/sec per cluster. Push past that and you start fighting queue memory, connection churn, and flow control.

8. PER-MESSAGE GUARANTEES
   TTL per message, dead-lettering per queue, expiration, priorities, schedulers — all native on individual messages.

─────────────────────────────
CHOOSE KAFKA WHEN you need:

1. REPLAY / TIME-TRAVEL
   "Spin up a new billing consumer and process the last 30 days of orders."  This is THE question that forces Kafka. RabbitMQ deletes messages on ack; Kafka keeps them until retention expires. A new consumer group starts at offset 0 and catches up naturally.

2. MULTIPLE INDEPENDENT READERS OF THE SAME LOG
   Billing, analytics, fraud detection, notifications — all read the same OrderPlaced topic. Each consumer group tracks its own offset. In RabbitMQ you'd bind a separate queue per service; works, but you maintain N queues instead of 1 log.

3. VERY HIGH THROUGHPUT
   Append-only log + zero-copy (sendfile) + batched compression. Single cluster handles hundreds of thousands to millions of msg/sec on commodity hardware. RabbitMQ runs out of RAM well before that.

4. LONG RETENTION
   Days, weeks, months, forever (compacted topics). The DISK is the storage tier; retention is a config knob. RabbitMQ queues are meant to be drained, not to accumulate.

5. STREAM PROCESSING / WINDOWED AGGREGATION
   Kafka Streams, ksqlDB, Flink all expect a log-structured source. Sliding-window fraud detection, real-time metrics, CDC-driven materialized views — all assume Kafka semantics.

6. EVENT SOURCING
   When the log IS the source of truth. Aggregate state is rebuilt by replaying events from offset 0. RabbitMQ fundamentally cannot do this.

7. CDC (CHANGE DATA CAPTURE) INTEGRATION
   Debezium, Kafka Connect, Postgres → Kafka → 5 systems. The CDC ecosystem is Kafka-first; alternatives exist but are far less mature.

8. SCHEMA GOVERNANCE AT SCALE
   Schema Registry (Confluent / Apicurio) enforces compatibility across 100+ services producing to shared topics. RabbitMQ has no equivalent ecosystem.

─────────────────────────────
THE OVERLAP (WHERE PEOPLE GET IT WRONG):

"We picked Kafka because we want event-driven architecture."
→ If you mean "services emit events about state changes", RabbitMQ pub-sub is often simpler, cheaper, and easier to operate. Pick Kafka only if at least ONE of these is true:
   - You need to replay events for new consumers or after a bug.
   - You have > 10 consumer services reading the same stream.
   - Throughput is > 50k events/sec sustained.
   - You need long retention for audit or analytics.
If none of those apply, RabbitMQ is the boring, correct choice.

"We picked RabbitMQ to build an event store."
→ Wrong tool. Queues delete on ack; there's no replay. If you need event sourcing, reach for Kafka (or EventStore, or a dedicated event-sourced DB).

"We picked Kafka as a task queue for background jobs."
→ Wrong tool. No per-message ack, no priorities, poor retries, partition rebalancing stalls consumers, no per-message TTL. Use RabbitMQ + Celery/Sidekiq/etc.

─────────────────────────────
CHOOSE CELERY WHEN:

• Python stack + background jobs: send email, resize image, crunch report.
• Scheduled tasks (Celery Beat = cron, but distributed).
• You want retries, acks, task chaining (chord/chain/group), monitoring (Flower) — all out of the box. Celery is a FRAMEWORK; RabbitMQ and Kafka are PRIMITIVES.
• Backed by RabbitMQ for reliability or Redis for speed + simplicity.

When NOT to pick Celery:
• Not Python (obvious — use Sidekiq for Ruby, BullMQ for Node, etc.).
• High-throughput event bus between services — use the broker directly.
• You only need a SCHEDULE primitive — a lightweight library + cron is lighter.

─────────────────────────────
COMMON HYBRIDS (real systems you'll see):

• Celery + RabbitMQ + Kafka: Celery for Python workloads, RabbitMQ is Celery's broker AND also an event bus for team-internal events, Kafka is the company-wide event log (CDC, analytics, cross-team integrations).

• SQS + Kafka: SQS for async task queues on AWS (serverless-friendly), Kafka for the analytics/streaming backbone (or MSK).

• Redis Streams alone: small team, Redis already in stack. Works until you outgrow throughput or retention needs.

─────────────────────────────
OPERATIONAL FAMILIARITY IS A LEGITIMATE TIEBREAKER:

A point juniors miss and seniors respect: the best broker on paper can lose to the broker your team already operates well. Running a message broker in production means:
• 3 a.m. incident triage — someone has to remember the flags, the error codes, the failure modes.
• 6 months of "first encounter" pain with a new broker — backups, upgrades, rebalancing, network partitions you've never debugged before.
• Mature runbooks, alerts, dashboards, capacity models, on-call rotation, dev tooling — all of that takes years to build.

So the HONEST senior answer often sounds like:

   "Kafka would technically be a better fit for X because of replay / throughput.
    But our team has 5 years on RabbitMQ, mature runbooks, and alerting.
    The TOTAL COST of bringing in Kafka is real — training, 24/7 familiarity,
    migration, extra infra. I'd still pick RabbitMQ here and revisit in a
    year if we hit the throughput or replay ceilings."

This shows you evaluate **total cost of ownership**, not just technical fit. The inverse also applies — if the team runs Kafka daily and someone proposes RabbitMQ "because it's simpler", pushing back is legitimate.

When operational familiarity is NOT a valid excuse:
• The fit is truly wrong (using RabbitMQ as an event store → it will break).
• The workload is 10x beyond what the familiar broker can handle.
• The gap is small and the team is willing to invest in training.

Rule of thumb: pick familiar UNLESS the familiar tool is structurally wrong for the problem.

─────────────────────────────
WHAT INTERVIEWERS LISTEN FOR:

1. You name TWO options and pick based on tradeoffs.
2. You acknowledge what you're giving up (Kafka = ops complexity; RabbitMQ = no replay).
3. You don't default to Kafka for everything — that's the senior red flag.
4. You mention replay / retention as the decisive question for event-driven systems.
5. You know that Celery isn't a broker — it's a task-queue framework.
6. You treat operational familiarity as a real engineering input, not as laziness.`,
    keywords: ["decision matrix", "use case", "hybrid", "anti-pattern", "rabbitmq-vs-kafka", "event-driven"],
  },
  {
    id: 35, level: "senior", topic: "patterns",
    q: "Transactional Outbox Pattern — what is it and what problem does it solve?",
    a: `PROBLEM: in a microservice, you need to (1) change the DB AND (2) publish an event to the broker atomically. If you do them separately, you get a dual-write problem:
• DB succeeded, broker failed -> no event -> inconsistency
• Broker succeeded, DB failed -> phantom event -> other services acted on nothing

SOLUTION — Transactional Outbox:
1. In the same transaction that writes business data, INSERT a row into an 'outbox' table
2. A separate process (Relay) reads from outbox and publishes to the broker
3. After successful publish — mark the row as sent (or delete it)

BEGIN;
  INSERT INTO orders (...) VALUES (...);
  INSERT INTO outbox (aggregate_id, event_type, payload) VALUES (...);
COMMIT;

IMPLEMENTATIONS:
• Polling Publisher — simple SELECT FROM outbox WHERE sent=false (watch out for polling lag)
• CDC (Debezium) — reads the DB WAL/binlog, publishes to Kafka. More complex but real-time
• Listen/Notify (Postgres) — for low-latency

GUARANTEE: at-least-once (duplicates possible on relay retries) -> consumers must be idempotent.

COMPANION PATTERN — Inbox on the consumer side: store processed message_ids to reject duplicates.`,
    keywords: ["outbox", "dual-write", "CDC", "Debezium", "inbox"],
  },
  {
    id: 36, level: "senior", topic: "patterns",
    q: "What is the Saga pattern and how is it implemented via a broker?",
    a: `SAGA — a distributed transaction split into a chain of local transactions. Each step publishes an event that triggers the next step. On failure — compensating transactions roll back previous steps.

Example: order in an e-commerce system
1. OrderService: CREATE_ORDER -> OrderCreated
2. PaymentService: CHARGE_CARD -> PaymentCompleted (or PaymentFailed)
3. InventoryService: RESERVE_STOCK -> StockReserved (or OutOfStock)
4. ShippingService: CREATE_SHIPMENT -> Shipped

If step 3 fails -> compensations: RefundPayment, CancelOrder.

TWO STYLES:

CHOREOGRAPHY (event-driven):
• Services subscribe to events and react
• No central coordinator
• Pros: loosely coupled
• Cons: hard to trace the full flow, circular dependencies possible

ORCHESTRATION:
• A central orchestrator (Saga Manager) explicitly commands each service
• Temporal, Camunda, AWS Step Functions, or custom state machine
• Pros: visible flow, easier debugging
• Cons: orchestrator is a single point of complexity

KEY POINTS:
• Compensations are not always possible (can't "un-send" an email -> send an apology instead)
• Isolation is weak — an intermediate state is visible to other transactions
• Each step must be idempotent
• Timeouts and retries at every step`,
    keywords: ["saga", "choreography", "orchestration", "compensation", "temporal"],
  },

  // ============== LEAD ==============
  {
    id: 40, level: "lead", topic: "kafka",
    q: "Designing a system for 1M events/sec. Architecture, sizing, bottlenecks?",
    a: `ROUGH SIZING:
• 1M msg/sec * avg 1KB = 1 GB/sec = 8 Gbps network
• Per day: ~86 TB raw, with RF=3 -> ~260 TB/day

CLUSTER:
• ~30-50 brokers with NVMe SSDs
• Dedicated 10/25 Gbps network, separate for replication and client traffic
• Partitioning strategy: 3-5x number of broker cores (so ~300-500 partitions per hot topic)
• Careful: too many partitions (>4000/broker) -> controller/ZK/KRaft bottleneck

PRODUCER:
• Batching: linger.ms=10-100, batch.size=32-64KB
• Compression: lz4 or zstd (3-5x savings, low CPU)
• acks=all, enable.idempotence=true
• max.in.flight.requests.per.connection=5 (compatible with idempotence)
• Partitioner — sticky partitioning for better batching

CONSUMER:
• Consumer count = partitions
• fetch.min.bytes=1MB, fetch.max.wait.ms=500 (batching on the read side)
• Cooperative rebalancing
• Don't commit on every message — batch commits

BOTTLENECKS IN ORDER:
1. NETWORK — almost always first. Jumbo frames, RSS, NIC tuning.
2. DISK I/O — sequential writes love large page cache. Lots of RAM for OS cache.
3. CPU — mostly SSL and compression. TLS offload / mTLS termination.
4. GC pauses — G1GC tuning, 6-8GB heap (don't go huge, rely on page cache)
5. Controller — in KRaft ok, in ZooKeeper watch metadata size

MONITORING:
• UnderReplicatedPartitions (must be 0)
• RequestHandlerAvgIdlePercent (> 30%)
• NetworkProcessorAvgIdlePercent
• Consumer lag
• p99 produce/fetch latency`,
    keywords: ["sizing", "partitions", "batching", "compression", "page cache", "KRaft"],
  },
  {
    id: 41, level: "lead", topic: "kafka",
    q: "Exactly-once semantics end-to-end — how is it really achieved?",
    a: `TRUE EOS is only achievable within Kafka itself (consume -> process -> produce). For external systems, you need additional layers.

KAFKA INTERNAL EOS:

1. IDEMPOTENT PRODUCER
   • enable.idempotence=true
   • Producer ID (PID) + Sequence Number on each write
   • Broker deduplicates by (PID, partition, seq) — last 5 per partition
   • Protects against duplicates from producer retries

2. TRANSACTIONS
   • transactional.id must be stable across producer restarts
   • producer.initTransactions() — fencing via epoch (zombie fencing)
   • beginTransaction() -> send to multiple partitions/topics -> commitTransaction()
   • Atomicity across partitions via Transaction Coordinator + transaction log
   • __consumer_offsets is also written transactionally

3. CONSUMER
   • isolation.level=read_committed — only reads committed messages
   • Skip aborted messages (marked in __transaction_state)

EOS OUTSIDE KAFKA — two approaches:

A) IDEMPOTENT RECEIVER
   • The consumer handles duplicates itself: deduplication table, upsert, business idempotency
   • Simpler but shifts responsibility to every consumer

B) TRANSACTIONAL SINKS
   • Kafka Connect with exactly-once sink connectors
   • Flink with two-phase commit sinks
   • External system must support transactions or idempotent writes

TRADE-OFFS:
• Transactions cost ~3-5% throughput
• Latency grows (commit has to be flushed)
• Doesn't work well with very short transactions (high overhead)

TRICK: many people think "enable.idempotence=true" = EOS. That's wrong. It's only deduplication at the producer level. Full EOS requires transactions + read_committed.`,
    keywords: ["transactions", "PID", "epoch", "fencing", "read_committed", "two-phase commit"],
  },
  {
    id: 42, level: "lead", topic: "patterns",
    q: "Event-Driven Architecture: pros, cons, pitfalls. When NOT to use it?",
    a: `PROS:
• Loose coupling between services
• Scalability — each service scales independently
• Resilience — service failure doesn't cascade immediately
• Auditability — event log is a natural audit trail
• Temporal decoupling — producer and consumer don't need to be up at the same time

CONS:
• Eventual consistency — "read your writes" is not guaranteed
• Hard to debug distributed flows -> tracing is mandatory (OpenTelemetry)
• Schema evolution — a complex and unending problem
• Testing — need contract tests, integration, chaos
• Ordering guarantees are limited
• "Message storms" — a retry loop can cascade

DO NOT use EDA when:
• Simple CRUD app with a single DB — a monolith will be cheaper
• Strong consistency is required (finance, bookings) — use 2PC or sync
• Team has no experience with distributed systems — operational cost is huge
• Low load (< 100 rps) — overhead doesn't pay off
• Tight deadlines — EDA requires maturity of infrastructure

TYPICAL PITFALLS:

1. GOD EVENTS — an event carries 50 fields "just in case" -> high coupling
2. EVENTS AS COMMANDS — "UserCreateEvent" instead of "UserCreated" -> leaky intent
3. NO SCHEMA REGISTRY — everyone parses JSON by hand, prod breaks
4. NO VERSIONING — can't evolve the event
5. SYNCHRONOUS CHAINS — event -> HTTP call -> event -> HTTP call -> no resilience benefit
6. EVERYTHING AN EVENT — even simple RPC gets forced into pub/sub, complexity explodes
7. NO IDEMPOTENCY — at-least-once + non-idempotent consumer = production incidents
8. NO BACKPRESSURE — fast producer crushes slow consumer
9. UNBOUNDED RETRIES — poison messages clog the queue
10. MISSING DLQ MONITORING — errors silently pile up

RULE OF THUMB: start with a monolith + internal queue. Migrate to EDA when the pain of the monolith exceeds the pain of distributed systems.`,
    keywords: ["eventual consistency", "schema registry", "god events", "poison message", "DLQ"],
  },
  {
    id: 43, level: "lead", topic: "patterns",
    q: "Schema evolution: Avro, Protobuf, JSON Schema — how to choose? Compatibility?",
    a: `COMPATIBILITY TYPES (Confluent Schema Registry):

• BACKWARD (default) — new schema reads old data. Safe to upgrade CONSUMERS first.
• FORWARD — old schema reads new data. Safe to upgrade PRODUCERS first.
• FULL — both directions. Most conservative.
• NONE — no checks (danger).
• + _TRANSITIVE versions — check against all previous versions, not just the last one.

FORMATS:

AVRO:
+ Compact binary, schema embedded by ID
+ Rich typing (unions, logical types, defaults)
+ First-class Kafka/Confluent support
+ Schema evolution built into the spec
- Requires schema registry (or bundling)
- Dynamic languages (Python) — a bit awkward

PROTOBUF:
+ Very fast, widely used (gRPC)
+ Strict typing, good tooling
+ Required/optional handled via field presence
- Evolution rules are more manual (don't renumber tags!)
- Less Kafka-friendly without the Confluent integration

JSON SCHEMA:
+ Human-readable, debuggable
+ No special tooling for reading
- Verbose (3-5x bigger than Avro)
- Weaker type system (no int32/int64/fixed)
- Parsing is slow

EVOLUTION RULES (universal):
+ Adding fields with a default — backward compatible
+ Removing optional fields — forward compatible
+ Widening types (int -> long) — sometimes ok
- Renaming fields — breaks everything (use aliases in Avro)
- Changing types — break
- Changing field tags (protobuf) — break
- Adding required fields without defaults — break

STRATEGY:
1. Schema Registry is mandatory in production
2. CI checks compatibility BEFORE merge
3. Avro + BACKWARD for most event streams
4. Protobuf for RPC-style contracts
5. Canary — new consumer processes a small % to verify parsing
6. Separate technical schema version from business "event version v2"`,
    keywords: ["schema registry", "avro", "protobuf", "backward", "forward", "compatibility"],
  },
  {
    id: 44, level: "lead", topic: "comparison",
    q: "Design: collecting 500M events/day (clickstream) with analytics + real-time alerts.",
    a: `INGESTION:
• Edge -> HTTP collector (Go/Rust, low-latency) -> Kafka
• ~6k events/sec avg, need to handle 30-50k peak
• Topic: events-raw, ~50 partitions, RF=3, retention 7 days
• Compression: zstd, ~5x savings

SCHEMA:
• Protobuf + Schema Registry
• Envelope: {event_id, timestamp, user_id, session_id, event_type, payload}
• event_id for deduplication (idempotency)

PROCESSING LAYERS (Lambda / Kappa style):

1. REAL-TIME (hot path):
   • Kafka Streams / Flink consumes events-raw
   • Windowed aggregations (tumbling 1-min, sliding 5-min)
   • Publish aggregates to Kafka topic "events-agg-1m"
   • Alert engine subscribes to aggregates, checks thresholds -> PagerDuty
   • p95 latency target: < 30s from event to alert

2. NEAR-REAL-TIME (warm path):
   • Kafka Connect -> ClickHouse / Druid (for ad-hoc OLAP analytics)
   • Materialized views for frequent queries
   • Dashboards in Grafana/Superset

3. BATCH (cold path):
   • Kafka Connect -> S3 (Parquet, partitioned by date/event_type)
   • Spark/Trino for heavy analytics, ML feature pipelines
   • Retention: years

RELIABILITY:
• Producer: acks=all, idempotence, local disk buffer in case Kafka is unavailable
• DLQ for unparseable events
• Circuit breakers on the collector
• Rate limiting per user_id to prevent abuse
• Backpressure: collector must drop (with 429) before Kafka saturates

DEDUPLICATION:
• event_id = UUID generated on client
• In Flink — KeyedState with TTL
• In ClickHouse — ReplacingMergeTree by event_id

OBSERVABILITY:
• OpenTelemetry traces from client through the entire pipeline
• Kafka lag monitoring — primary SLI
• Alerts on: consumer lag > 5min, DLQ size > N, 5xx rate

CAPACITY PLANNING:
• 500M * 500 bytes * compression 5x = ~50GB/day * 7 days * RF3 = ~1 TB on Kafka
• S3 long-term: ~50GB * 365 = ~18TB/year (with Parquet compression ~3TB/year)

COST OPTIMIZATION:
• Sampling on the hot path (100% raw, but only 10% into expensive analytics)
• Tiered Storage in Kafka 3.6+ — old segments go to S3
• Avoid reading from Kafka for historical queries -> use S3 lake
• Reserved instances / Savings Plans`,
    keywords: ["lambda architecture", "flink", "clickhouse", "tiered storage", "sampling"],
  },
  {
    id: 45, level: "lead", topic: "celery",
    q: "Celery at scale: problems from 1 to 1000 workers. Scaling strategy.",
    a: `SCALE EVOLUTION:

1-10 WORKERS (toy stage):
• Single broker (RabbitMQ / Redis)
• Default settings mostly work
• Flower for monitoring
• Main issues: code bugs, not infra

10-100 WORKERS:
• Problem: result backend becomes a bottleneck
  -> ignore_result=True where you don't need results
  -> use Redis with reasonable TTL, not RabbitMQ for results
• Multiple queues by type of work
• task_acks_late=True + worker_prefetch_multiplier=1 for long tasks
• Separate beat scheduler, not mixed into workers
• Monitoring: Prometheus exporter, Grafana dashboards, p95/p99 latency per task

100-500 WORKERS:
• Problem: a single RabbitMQ node can't take the load
  -> RabbitMQ cluster with Quorum Queues
  -> or sharding: multiple independent brokers
• Problem: noisy neighbors — one bad task hogs a worker
  -> strict time limits (soft + hard)
  -> isolation via queues and dedicated workers
  -> memory leaks -> worker_max_tasks_per_child
• Problem: thundering herd on scheduled tasks
  -> jitter on periodic tasks
• Use prefork for CPU-bound, gevent/eventlet for I/O-bound
• Canary deployments — new code on 5% of workers first

500-1000+ WORKERS:
• Celery starts hitting fundamental limits
• Problem: broker is the bottleneck no matter the cluster size
  -> move from pub/sub model to partition-aware (migrate to Kafka + custom consumer)
• Problem: task inventory becomes huge
  -> split into multiple apps / services
• Problem: beat is a single point of failure
  -> redbeat (Redis-backed beat) with locking, or Kubernetes CronJob
• Problem: deploys take forever
  -> progressive rollout, drain workers gracefully (TERM signal, wait for active tasks)

COMMON OPS ISSUES:

• "TASKS SILENTLY LOST":
  - acks_late=False + worker OOM -> task gone
  - visibility_timeout (Redis broker) less than task duration -> duplicates
  - Fix: acks_late=True, reject_on_worker_lost=True

• "QUEUE GROWING INDEFINITELY":
  - Producer >> consumers -> autoscale workers
  - Poison tasks blocking a worker -> time limits + DLQ equivalent (failed task retry queue)

• "RANDOM FAILURES":
  - Connection pool exhaustion -> broker_pool_limit
  - DNS TTL / stale connections -> broker_connection_retry_on_startup, heartbeat

• "MEMORY KEEPS GROWING":
  - Python memory fragmentation -> worker_max_tasks_per_child=100-1000
  - Leaking references in tasks -> forcing child recycle

WHEN TO MIGRATE OFF CELERY:
• > 1000 workers on a single app
• Need exactly-once
• Need complex workflow orchestration -> Temporal, Airflow
• Need event-sourcing semantics -> Kafka consumers
• Extreme throughput requirements -> custom consumers on Go/Rust`,
    keywords: ["max_tasks_per_child", "acks_late", "quorum queues", "temporal", "sharding"],
  },

  // ============== TRICKY ==============
  {
    id: 50, level: "tricky", topic: "kafka",
    q: "Trick: you have a Kafka topic with 10 partitions and 20 consumers in one group. What happens?",
    a: `10 consumers will read, 10 will be IDLE.

Rule: a partition can only belong to one consumer in a group. If consumers > partitions, the extras sit idle waiting for rebalancing.

Why this is a trap: many candidates say "load will be distributed across all 20". No — Kafka is fundamentally partition-based.

FOLLOW-UP: "How do you handle this?"
• Increase partitions (careful — ordering of existing keys changes)
• Decrease consumers
• Switch to two groups with different logic
• Or the problem is architectural: too few partitions for the desired parallelism -> redesign the topic

SECOND TRICK: if you do the reverse (5 consumers, 10 partitions), some consumers will handle 2 partitions each — no idle, but the load may be uneven (if keys are skewed).`,
    keywords: ["partition assignment", "idle consumer", "skew"],
  },
  {
    id: 51, level: "tricky", topic: "rabbitmq",
    q: "Trick: you sent a message to an exchange, but there's no queue. What happens?",
    a: `By default — the MESSAGE IS LOST SILENTLY. No error, no log. The exchange doesn't store messages, it only routes.

How to detect/prevent:

1. MANDATORY FLAG
   channel.basic_publish(..., mandatory=True)
   + handler for basic.return
   -> if the message can't be routed, the broker returns it to the publisher

2. ALTERNATE EXCHANGE
   Set x-alternate-exchange on the main exchange
   -> unroutable messages go to a fallback exchange -> to a queue -> alert/analyze

3. PUBLISHER CONFIRMS
   channel.confirm_delivery()
   -> broker confirms that the message was accepted (but doesn't guarantee it was routed — that's what mandatory is for)

CLASSIC PRODUCTION STORY: someone deleted a queue "to clean up", and all messages from a critical publisher silently disappeared for a week. Only detected when the consumer called and asked "why are you not sending us anything?". Lesson: mandatory+AE from day one.

ADDITIONAL TRAP:
• transient (non-durable) exchange + broker restart = exchange gone
• queue-less exchanges without AE = silent black hole`,
    keywords: ["mandatory", "alternate exchange", "publisher confirms", "unroutable"],
  },
  {
    id: 52, level: "tricky", topic: "celery",
    q: "Trick: task is marked SUCCESS but actually didn't do its work. Why?",
    a: `SEVERAL POSSIBLE CAUSES:

1. TASK RETURNED BEFORE THE WORK COMPLETED
   Classic case: async code called without await, or thread started in the task but not waited on.
   @app.task
   def bad_task():
       threading.Thread(target=heavy_work).start()
       return "done"  # task is SUCCESS, but heavy_work may not have finished

2. SILENT EXCEPTION IN AN except Exception: pass
   @app.task
   def also_bad():
       try:
           critical_operation()
       except Exception:
           pass  # swallowed error, task is SUCCESS

3. TRANSACTION ROLLBACK AFTER COMMIT-LOG
   SQLAlchemy session.commit() was replaced somewhere by rollback(), but result was cached/returned before.

4. IGNORE_RESULT + RETRY
   Task retried, returned None from retry() call, celery saw "no exception" and marked SUCCESS (edge case, version-dependent).

5. RESULT BACKEND WROTE STALE STATE
   Race condition: a second execution wrote SUCCESS over a later FAILURE due to out-of-order writes (rare with Redis backend).

6. ACKS_LATE=FALSE + WORKER OOM
   Message was acked before processing -> on worker crash, Celery thinks task succeeded.

HOW TO CATCH:
• Structured logging at every step of the task (start / business step / finish)
• Metrics on what the task actually did (rows_updated, emails_sent), not just "task ran"
• Reconciliation job — compare "tasks marked success" vs "actual side effects in the DB"
• task_acks_late=True + task_track_started=True
• Don't silently catch exceptions. If you catch — log.exception() and re-raise, or explicitly mark the task FAILED (self.update_state(state='FAILURE')).`,
    keywords: ["acks_late", "silent exception", "threading", "reconciliation"],
  },
  {
    id: 53, level: "tricky", topic: "kafka",
    q: "Trick: consumer committed an offset but didn't process the message. Data loss. How?",
    a: `CLASSIC AT-MOST-ONCE TRAP — enable.auto.commit=true.

By default Kafka consumer commits every 5 seconds (auto.commit.interval.ms). The sequence of events:
1. Consumer polls -> got messages [10, 11, 12, 13, 14]
2. Auto-commit timer fires -> offset 15 committed
3. Consumer starts processing message 12 -> CRASH
4. Consumer restarts -> reads from offset 15 -> messages 12, 13, 14 are LOST

FIX:

1. MANUAL COMMIT AFTER PROCESSING
   enable.auto.commit=false
   process(records)
   consumer.commitSync()

2. COMMIT PER-BATCH, NOT PER-MESSAGE
   Balance between performance and risk window

3. IDEMPOTENT PROCESSING + AT-LEAST-ONCE
   Don't fight duplicates, design the system to tolerate them

ANOTHER VARIATION OF THE TRAP:
• max.poll.interval.ms (default 5 min) exceeded
• Kafka decides the consumer is dead -> triggers rebalance
• Another consumer picks up, commits its progress
• Original consumer eventually finishes processing and tries to commit -> CommitFailedException
• Sometimes the original's work still succeeded (DB write) but never got committed -> two consumers processed the same message

FIX:
• Tune max.poll.interval.ms for your processing time
• Reduce max.poll.records
• Move heavy work off the poll thread (producer-consumer internal)
• Check for rebalance listener / handle CommitFailedException gracefully

DEEPER TRICK: even with manual commit, if you use async commitAsync() and the broker responds with an error AFTER you've moved on, the offset silently didn't commit. Always do final commitSync() on shutdown.`,
    keywords: ["auto.commit", "commitSync", "max.poll.interval", "rebalance", "CommitFailedException"],
  },
  {
    id: 54, level: "tricky", topic: "patterns",
    q: "Trick: 'we have exactly-once', but duplicates show up in the DB. Who's to blame?",
    a: `THE PERSON WHO THINKS "KAFKA EOS" == "END-TO-END EOS".

Exactly-once in Kafka only guarantees delivery and offset commits WITHIN KAFKA. As soon as the consumer writes to an external system (DB, HTTP API, another queue without Kafka transactions) — you're back in at-least-once territory.

TYPICAL SEQUENCE LEADING TO DUPLICATES:

1. Consumer reads message from Kafka
2. Writes to DB (INSERT INTO orders ...)
3. Commits offset to Kafka
4. Between steps 2 and 3 — crash
5. On restart consumer reads from the last committed offset -> processes the same message
6. Another INSERT -> DUPLICATE IN DB

EVEN WITH TRANSACTIONS: Kafka transactions don't extend into Postgres. Even with isolation.level=read_committed — once you leave the Kafka boundary, guarantees end.

REAL SOLUTIONS:

1. IDEMPOTENT WRITES
   • INSERT ... ON CONFLICT DO NOTHING (by event_id)
   • UPSERT with version check
   • UNIQUE constraint on (source, event_id)

2. INBOX PATTERN
   BEGIN;
     SELECT 1 FROM inbox WHERE msg_id = ? FOR UPDATE;
     INSERT INTO inbox (msg_id) VALUES (?);
     -- business logic here
   COMMIT;
   -- commit Kafka offset

3. TRANSACTIONAL OUTBOX + IDEMPOTENT RECEIVER

4. KAFKA CONNECT + SPECIALIZED SINKS
   Some connectors (JDBC sink with upsert mode, Iceberg) do exactly-once via idempotent writes

WHO'S TO BLAME: the architect who sold leadership on "Kafka = exactly-once, no problems". The correct phrasing is "effectively-once" and requires work on both ends.

THE HARDEST TRAP: a consumer writes to DB + sends an HTTP request to a third party. On retry DB is idempotent but the HTTP call isn't — the third party charges the card twice. Need idempotency keys on the client side of HTTP too (Stripe-style idempotency-key header).`,
    keywords: ["effectively-once", "inbox", "upsert", "idempotency key"],
  },
  {
    id: 55, level: "tricky", topic: "rabbitmq",
    q: "Trick: queue keeps growing, consumers are alive, CPU < 10%. What's happening?",
    a: `FAVORITE INTERVIEW QUESTION — diagnostic under pressure.

CHECKLIST IN ORDER OF PROBABILITY:

1. PREFETCH TOO LOW + NETWORK LATENCY
   prefetch=1, RTT to broker = 50ms -> max throughput = 20 msg/sec per consumer, regardless of CPU.
   -> Increase prefetch_count to 50-200

2. CONSUMERS ARE "ALIVE" BUT BLOCKED
   • SELECT FOR UPDATE waiting on a DB lock
   • HTTP request to an external service is hanging (no timeout!)
   • Deadlock between consumers
   -> py-spy / strace / GIL profiler to figure out where they're stuck
   -> Mandatory timeouts on ALL external calls

3. UNACKED MESSAGES ACCUMULATING
   rabbitmqctl list_queues name messages_ready messages_unacknowledged
   -> If unacked is large — consumers received messages but don't ack them
   -> Bug in code: forgot basic_ack, or exception before ack

4. WRONG CONSUMERS ARE CONNECTED
   In a distributed system a stale replica from a previous deploy is still connected, receiving messages, and silently dropping them
   -> Check the consumers list in the queue by tag/connection

5. MESSAGE IS REJECTED AND REQUEUED IN A LOOP
   Poison message: requeued on every nack -> dominates the queue head
   -> Check x-death headers, set up DLQ, limit requeue

6. EXCHANGE ROUTING IS WRONG
   Messages are being published to a different queue than consumers are subscribed to. "Dead" queue grows, "live" one is empty
   -> List bindings, verify routing_keys

7. SINGLE-THREADED CONSUMER IN PREFORK OF ONE WORKER
   Load averages across many processes hide the fact that one is stuck
   -> Check active processes individually

8. FLOW CONTROL ON BROKER
   Broker memory/disk watermark hit -> producer throttled but consumer sees the old backlog
   -> rabbitmqctl status, check memory/disk alarms

9. CPU LOW BECAUSE CONSUMER IS DE-FACTO IDLE
   Maybe consumer quietly crashed with an uncaught exception and is looping with a sleep
   -> supervised logs, health check endpoints

GOLDEN RULE: CPU is never a reliable signal of "the consumer is working". Use metrics of business activity: "messages processed per second by consumer X".`,
    keywords: ["unacked", "prefetch", "poison message", "flow control", "py-spy"],
  },
  {
    id: 56, level: "tricky", topic: "celery",
    q: "Trick: same task scheduled in Celery Beat runs twice simultaneously. Why?",
    a: `CLASSIC DISTRIBUTED CRON PROBLEM.

CAUSES (ranked):

1. TWO BEAT INSTANCES RUNNING
   Deploy accidentally spun up beat on two pods. Each independently triggers the schedule.
   -> RULE: exactly ONE beat process per logical app.
   -> In Kubernetes: Deployment with replicas=1 + rolling update strategy that ensures old is killed before new starts (rare, mostly this is fine), OR StatefulSet with leader election.

2. BEAT RESTART AT THE SCHEDULED MOMENT
   Beat started -> saw that "task was supposed to run 10 seconds ago" -> fired it. Old task already ran from the previous beat instance.
   -> Persisted schedule (redbeat, django-celery-beat DB schedule) with proper locking.

3. TASK ITSELF DIDN'T CHECK FOR UNIQUENESS
   Beat is fine — but the previous run of the same task didn't finish, and beat fires again.
   -> Distributed lock inside the task:

     @app.task(bind=True)
     def my_task(self):
         lock_id = f"lock:{self.name}"
         with redis.lock(lock_id, timeout=60*10, blocking_timeout=0):
             do_work()

   -> Or use singleton pattern libraries (celery-singleton).

4. BEAT HAS DUPLICATE ENTRIES IN THE SCHEDULE
   Same key twice in celerybeat_schedule dict (human error).

5. CLOCK SKEW BETWEEN NODES
   If you have multiple beats (anti-pattern), clocks differ -> each thinks it's the right time, no coordination.

PROPER ARCHITECTURE:
• Exactly one beat or use redbeat with Redis-based leader election
• Every periodic task implements its own idempotency/locking (because you can never fully trust the scheduler)
• Monitoring: "expected X runs per hour, got Y" — alert on mismatch

DEEPER TRAP: even with one beat, if a task is slow and beat fires it again "backlog catch-up" style (late_enough parameter), you get concurrent instances of the same task. Set CELERYBEAT_MAX_LOOP_INTERVAL and use singleton locking.`,
    keywords: ["beat", "redbeat", "distributed lock", "singleton", "leader election"],
  },
  {
    id: 57, level: "tricky", topic: "kafka",
    q: "Trick: Kafka Producer is faster than consumer. What happens at retention=7d?",
    a: `LAYERED ANSWER — this is actually a trap about what "lag" really means.

WHAT HAPPENS:

• Producer writes at rate Rp
• Consumer reads at rate Rc < Rp
• CONSUMER LAG grows linearly: lag(t) = (Rp - Rc) * t

IF LAG < RETENTION (in messages/time):
• Consumer is behind but catches up eventually (when load drops)
• Business impact: processing delay (alerts late, analytics stale)
• Technically everything is fine

IF LAG > RETENTION:
• Kafka deletes old segments (retention.ms or retention.bytes exceeded)
• Consumer tries to read offset X, but X has been deleted
• OffsetOutOfRangeException!
• Depending on auto.offset.reset:
   - "latest" (default): consumer jumps to the end -> SKIPS ALL UNREAD MESSAGES -> data loss
   - "earliest": jumps to the beginning -> re-reads everything, including already processed -> duplicates + potentially loses some
   - "none": throws exception -> consumer crashes, needs manual intervention

IN OTHER WORDS: with a slow consumer and retention=7d, if lag exceeds 7d you're in silent data-loss or duplicate territory.

SOLUTIONS:

1. SCALE THE CONSUMER
   • More partitions + more consumers (but more partitions has its own cost)
   • Async processing inside the consumer (don't block poll thread)
   • Batching writes to downstream

2. MONITOR THE LAG
   • Kafka Lag Exporter -> Prometheus -> Alertmanager
   • Alert BEFORE lag approaches retention, not when it hits
   • Alert on lag growth rate, not just absolute lag

3. INCREASE RETENTION FOR CRITICAL TOPICS
   • 30d or more for topics you can't afford to lose
   • Mind the cost (disk)
   • Tiered Storage (Kafka 3.6+) -> old segments to S3

4. BACKPRESSURE AT THE SOURCE
   • Producer should slow down when the downstream is overwhelmed
   • Not always possible (can you tell customers "write slower"?)

5. DEAD LETTER / OVERFLOW TOPIC
   • If you can't keep up — route excess to a separate topic with lower SLA
   • Process later or drop consciously

6. CIRCUIT BREAKER ON CONSUMER
   • If downstream DB is slow -> back off, not pile up poll batches

KEY INSIGHT: Kafka retention is NOT a safety net for slow consumers — it's a storage limit. Never architect such that your correctness depends on retention being "generous enough".`,
    keywords: ["consumer lag", "auto.offset.reset", "OffsetOutOfRange", "tiered storage"],
  },
  {
    id: 58, level: "tricky", topic: "patterns",
    q: "Trick: 'we have a message broker, so we're loosely coupled'. True or false?",
    a: `FALSE MORE OFTEN THAN TRUE — one of the big myths of microservice architecture.

A broker gives you TEMPORAL decoupling (publisher and consumer don't have to be up at the same time), but it doesn't automatically give you:

1. SCHEMA COUPLING
   Producer changed the event payload structure -> consumer broke.
   Broker doesn't help — it happily delivered a message the consumer can't parse.
   -> Need: Schema Registry, compatibility contracts, versioning.

2. SEMANTIC COUPLING
   Consumer relies on the ORDER of events, or on an implicit meaning ("if user_signed_up arrives, email must come within 1 second").
   Broker gave you decoupled transport but your code depends on cross-service behavior.
   -> "Temporal coupling" reappears at the business-logic layer.

3. DATA MODEL COUPLING
   Event contains 30 fields from the producer's internal model. Consumer parses 20 of them and builds its own logic. Producer refactors the DB -> event structure changes -> consumer breaks.
   -> Need: explicit event design, not "dump all the fields of the table" (anti-pattern: "table-as-event").

4. OPERATIONAL COUPLING
   Producer publishes at rate R. Consumer can only process at rate R/2. Queue grows, alerts fire, on-call for the CONSUMER team gets paged because of the PRODUCER team's release.
   -> Operational shared fate, even though code is separate.

5. DELIVERY SEMANTIC COUPLING
   Producer assumes exactly-once. Consumer assumes at-least-once. Mismatch -> production bugs.
   -> Need: documented SLA on delivery.

6. EVOLUTIONARY COUPLING
   Want to change consumer's contract -> N producers need to know. Want to add a new event -> consumers need to subscribe.
   -> Actually, in a big system, event consumers and producers drift apart faster than services with sync APIs, because sync APIs fail loudly.

TRUE DECOUPLING requires:
• Explicit schemas with compatibility guarantees
• Documented events as first-class API contracts (like OpenAPI)
• Consumer-driven contract tests
• Clear ownership of every topic/queue
• Monitoring at topic boundary (lag, error rate, DLQ size) as the SLI of the contract
• Tolerance for unknown fields (consumers ignore new fields, don't crash)
• Event sourcing discipline: "events are facts, not commands"

PROVOCATIVE STATEMENT (good to throw at the interviewer): "A broker is a shared database for events. And a shared database is the anti-pattern of microservices. Without strict schema governance and contract discipline, a bunch of services talking via Kafka is more coupled than a well-designed monolith."`,
    keywords: ["coupling", "schema registry", "contract", "event sourcing"],
  },
  {
    id: 59, level: "tricky", topic: "comparison",
    q: "Trick: 'Let's use Kafka instead of RabbitMQ for task queues'. What will go wrong?",
    a: `CLASSIC JUNIOR/MIDDLE MISTAKE. Kafka is a BAD task queue. Reasons:

1. ACK MODEL
   Kafka acks offsets (positions in the log), not individual messages.
   Kafka: "I confirm I read up to position 42"
   RabbitMQ: "I confirm message #X specifically, but not #Y"

   Consequence: if you have 100 tasks and task 50 fails while 51-99 succeed, you can't easily "redo only #50". You have to rewind to 50 and re-process 51-99, or skip 50 and retry it elsewhere.

2. NO PER-MESSAGE REDELIVERY
   In RabbitMQ a nacked message can be redelivered immediately or after TTL.
   In Kafka redelivery means seeking back the offset — it affects all subsequent messages in the partition.
   -> Retry patterns in Kafka are complex: retry topics with increasing delays, manual offset management.

3. BLOCKED HEAD-OF-LINE
   One "stuck" task at the head of a partition blocks everything behind it in that partition.
   In RabbitMQ with prefetch + multiple consumers, a slow task just delays that one message, others flow around.

4. REBALANCING INSTEAD OF SCALING
   Add a consumer to a Kafka group -> rebalance, everyone stops for seconds.
   Add a consumer to a RabbitMQ queue -> just connects, starts eating.

5. NO PRIORITY QUEUES
   RabbitMQ supports message priorities natively.
   Kafka — no native priorities. Have to emulate via separate topics + careful polling.

6. NO PER-MESSAGE TTL
   RabbitMQ: TTL per message or per queue -> DLQ after expiry.
   Kafka: retention is per-topic, no way to say "this specific event expires in 10 seconds".

7. NO DLQ MECHANISM
   RabbitMQ: DLX/DLQ is a native feature.
   Kafka: DLQ is a pattern you implement yourself (publish failures to another topic). Tooling is weaker.

8. DELIVERY CHURN
   Task queues want low latency per message (milliseconds). Kafka is optimized for batching — linger.ms, fetch.min.bytes. Tuning for low latency hurts throughput and vice versa.

9. OFFSET PER GROUP VS TASK STATE
   In RabbitMQ each message has independent state (ready/unacked/dead).
   In Kafka all state of "group progress" is one number per partition.
   -> Bookkeeping of which tasks succeeded/failed is manual.

10. TOO MUCH RETENTION
    Task queues typically want "delete after success". Kafka keeps everything for retention period -> wasted space, confusing semantics.

WHEN KAFKA-AS-QUEUE CAN WORK:
• Event-driven workers where "replay events from offset X" is the recovery model
• Extreme throughput where per-message ack is the bottleneck
• Already have Kafka in the stack and don't want to run another system
• Ordering within partition is a hard business requirement

RIGHT CHOICE in most cases:
• Task queues -> RabbitMQ / Celery / SQS
• Event streams -> Kafka
• Often: BOTH, for different use cases

POSSIBLE COMPROMISE: use Kafka as a log/bus of events, and for task-style work spawn short-lived Celery/worker tasks from those events. Kafka = "what happened", Celery = "what to do about it".`,
    keywords: ["head-of-line blocking", "offset", "priority queue", "DLQ", "retention"],
  },

  // ============== REDIS STREAMS ==============
  {
    id: 60, level: "trainee", topic: "redis",
    q: "What are Redis Streams? How do they differ from Redis Pub/Sub?",
    a: `Redis Streams — an append-only log data structure (added in Redis 5.0), similar to Kafka but lighter.

KEY DIFFERENCES from Redis Pub/Sub:

Pub/Sub:
• Fire-and-forget: if no subscriber is listening, the message is lost
• No persistence
• No acknowledgement
• Broadcast to all subscribers

Streams:
• Persisted in memory (+ AOF/RDB if configured)
• Messages have unique IDs (timestamp-sequence)
• Support consumer groups (like Kafka)
• Acknowledgement required (XACK)
• Messages stay until trimmed

Use Redis Streams when you need a lightweight persistent message log; use Pub/Sub for ephemeral broadcasts like live notifications where missing a message is acceptable.`,
    keywords: ["streams", "pub/sub", "persistence", "XACK"],
  },
  {
    id: 61, level: "junior", topic: "redis",
    q: "XADD, XREAD, XREADGROUP — what are they?",
    a: `XADD — append a message to a stream.
XADD mystream * field1 value1 field2 value2
(* = auto-generate ID from timestamp)

XREAD — read messages from a stream, optionally blocking.
XREAD BLOCK 0 STREAMS mystream $
($ = "from now on"; 0 = "from beginning")

XREADGROUP — read as part of a consumer group.
XREADGROUP GROUP mygroup consumer1 COUNT 10 STREAMS mystream >
(> = "undelivered messages for this group")

OTHER KEY COMMANDS:
• XACK — acknowledge a message (remove from PEL)
• XCLAIM — transfer pending messages to another consumer
• XAUTOCLAIM — Redis 6.2+, safer iterating version of XCLAIM
• XPENDING — list pending (unacked) messages
• XLEN — stream length
• XTRIM — trim stream to size

CONSUMER GROUPS work like Kafka groups: messages are distributed among consumers; each consumer's progress is tracked by the server.`,
    keywords: ["XADD", "XREAD", "XREADGROUP", "XACK", "consumer group"],
  },
  {
    id: 62, level: "middle", topic: "redis",
    q: "What is the Pending Entries List (PEL) in Redis Streams? How do you handle it?",
    a: `PEL (Pending Entries List) — a per-consumer-group list of messages that were delivered via XREADGROUP but NOT yet XACK'd.

If a consumer crashes before acking, the messages stay in the PEL forever until someone claims them. Dangerous: endless PEL growth = memory leak + duplicate processing risk.

DIAGNOSIS:
XPENDING mystream mygroup
# shows: count, min/max IDs, consumers breakdown
XPENDING mystream mygroup - + 10 consumer1
# detailed view with idle time per message

RECLAIM WORKFLOW:
1. A consumer (or a dedicated watchdog) checks XPENDING
2. If idle time > threshold (e.g., 30s) -> XCLAIM or XAUTOCLAIM
3. XCLAIM mystream mygroup consumer2 30000 <id1> <id2>
   -> transfers messages to consumer2 with reset idle time
4. Process + XACK

XAUTOCLAIM (Redis 6.2+) — recommended:
XAUTOCLAIM mystream mygroup consumer2 30000 0-0 COUNT 100
# iterates automatically, returns next cursor, safer under load

GOTCHA: XCLAIM increments a delivery counter on each claim. After N attempts, the message is "poison". Route to a DLQ equivalent or drop manually — Redis Streams has no native DLQ.`,
    keywords: ["PEL", "XPENDING", "XCLAIM", "XAUTOCLAIM", "poison message"],
  },
  {
    id: 63, level: "senior", topic: "redis",
    q: "Redis Streams vs Kafka — when to choose which?",
    a: `REDIS STREAMS PROS:
• Already in your stack if you use Redis — one less system to run
• Very low latency (sub-ms)
• Simple ops: single node, or managed (ElastiCache, Upstash)
• Consumer groups out of the box
• Good for small-to-medium throughput (up to ~100K msg/sec on a beefy node)

REDIS STREAMS CONS:
• In-memory first -> data size limited by RAM (unless Redis on Flash)
• Replication is async -> can lose recent writes on failover
• No built-in partitioning -> ordering is global; parallelism via multiple streams (manual sharding)
• Cluster mode: each stream key lives on ONE slot/node, not auto-partitioned
• No native exactly-once semantics
• No schema registry ecosystem
• No native DLQ, no log compaction

KAFKA PROS:
• Partitioning, replication factor, ISR — industrial-grade
• Retention in days/weeks/months on disk
• Rich ecosystem (Connect, Streams, Schema Registry, Flink, Debezium)
• Exactly-once within Kafka (transactions)
• Millions of msg/sec

KAFKA CONS:
• Complex to run (ZK or KRaft, brokers, topic management)
• Higher latency (tens of ms typical)
• Overkill for small apps

RULE OF THUMB:
• < 10k msg/sec, moderate retention, Redis already in stack -> Streams
• High throughput, long retention, event sourcing, multi-team -> Kafka
• Task queues -> neither; use RabbitMQ / Celery / SQS

HYBRID IN PRACTICE: Redis Streams as a short-term buffer for bursty ingestion in front of Kafka; or Streams for intra-team microservice events, Kafka as the cross-team bus.`,
    keywords: ["redis", "kafka", "latency", "partitioning", "retention"],
  },
  {
    id: 64, level: "tricky", topic: "redis",
    q: "Trick: your Redis Streams consumer crashed mid-processing. You restart and messages are 'missing'. What happened?",
    a: `Several possibilities — all worth knowing:

1. USED XREAD INSTEAD OF XREADGROUP
   XREAD with $ -> "give me messages from now on"
   During the crash, new messages arrived -> consumer didn't see them on restart.
   -> Fix: use consumer groups (XREADGROUP), or persist last-processed ID yourself.

2. XREADGROUP WITH > BUT NO PEL DRAIN ON RESTART
   When you read with >, Redis moves messages to the PEL and marks them "delivered".
   On restart, reading with > again gives only NEW undelivered messages.
   To resume processing your own pending ones, read with an explicit ID:
   XREADGROUP GROUP g c1 STREAMS mystream 0
   (0 = replay messages in MY PEL, not new ones)
   Many consumers forget this -> "ghost" messages in PEL, no one processes them.

3. STREAM WAS TRIMMED
   XADD mystream MAXLEN 1000 * ...
   -> oldest messages dropped when stream exceeds 1000.
   If your consumer was slow + producer aggressive -> unacked messages in PEL may reference trimmed IDs. Reading them returns error/tombstone.

4. REDIS RESTARTED WITHOUT AOF
   Default Redis persistence (RDB) snapshots every N seconds/writes.
   Crash between snapshots -> messages gone, PEL state reset.
   -> Enable AOF with appendfsync=everysec (trade-off: small perf cost).

5. FAILOVER TO REPLICA WITH LAG
   Async replication -> replica is missing recent writes.
   Sentinel/Cluster promotes the replica -> silent data gap.
   -> No great fix in native Redis for critical data; use Kafka/RabbitMQ Quorum/NATS JetStream instead.

DEFENSE IN DEPTH:
• AOF with fsync=always for critical streams (slow but safest)
• Monitor PEL size (XPENDING) and idle times — alert on growth
• On consumer restart: FIRST drain own PEL (XREADGROUP with ID 0), THEN poll for new
• Set realistic MAXLEN ~ — don't trim faster than your consumer can drink
• For true durability requirements -> don't use Streams, use a real broker`,
    keywords: ["PEL", "AOF", "MAXLEN", "replica lag", "XREADGROUP"],
  },

  // ============== NATS ==============
  {
    id: 70, level: "trainee", topic: "nats",
    q: "What is NATS and what makes it different?",
    a: `NATS — a lightweight, high-performance messaging system, originally built at Cloud Foundry. Written in Go, single static binary.

KEY TRAITS:
• Extremely low latency (microseconds, not milliseconds)
• Very simple text-based protocol
• Subject-based routing (hierarchies like orders.us.created)
• Request/Reply is a first-class primitive
• Clustering built-in with gossip-style discovery
• Tiny footprint (single binary, few MB RAM)

TWO FLAVORS:
• Core NATS — at-most-once, no persistence, pub/sub + request/reply
• JetStream — persistence layer on top, at-least-once / exactly-once, consumer groups

POSITIONING:
• Faster and simpler than RabbitMQ
• Less throughput and smaller ecosystem than Kafka
• Great for microservice-to-microservice messaging, IoT, edge, service mesh, Kubernetes environments
• "The Kafka of latency-sensitive, low-complexity stacks"`,
    keywords: ["NATS", "JetStream", "subject", "latency"],
  },
  {
    id: 71, level: "junior", topic: "nats",
    q: "What are subjects and wildcards in NATS?",
    a: `SUBJECT — a hierarchical name (dot-separated) that producers publish to and consumers subscribe to.

Example: orders.us.electronics.created

WILDCARDS (only on the subscriber side):
• * — matches exactly ONE token
• > — matches ONE OR MORE tokens (must be last)

EXAMPLES:
• orders.*.created matches orders.us.created, orders.eu.created; NOT orders.us.electronics.created
• orders.us.> matches orders.us.anything, including deeply nested paths
• > subscribes to EVERYTHING (admin/debug only!)
• *.*.created = two-token prefix + created

DESIGN TIPS:
• Start broad, narrow as you go: service.entity.action (e.g., orders.user.signed_up)
• Use consistent naming across teams — NATS doesn't enforce a schema
• Leading tokens are cheapest to filter on -> put stable/low-cardinality up front
• Avoid > in high-volume systems unless you really want everything

GOTCHAS:
• Case-sensitive (orders.Created != orders.created)
• Max subject length 256 chars by default
• Certain characters reserved (., *, >, whitespace)`,
    keywords: ["subject", "wildcard", "hierarchy"],
  },
  {
    id: 72, level: "middle", topic: "nats",
    q: "Core NATS vs JetStream — key differences?",
    a: `CORE NATS:
• At-most-once delivery
• No persistence — if no subscriber is listening, the message is GONE
• Fire-and-forget or request/reply
• Queue groups for load balancing (multiple subscribers, one gets each message)
• Ideal for: RPC, live events, control plane, "latest value wins" scenarios

JETSTREAM:
• Built into nats-server (no separate process)
• At-least-once or exactly-once delivery
• Persistent streams (file or memory storage)
• Consumer types: push or pull
• Configurable retention: limits / interest / work queue
• Explicit ACKs required
• Deduplication via Nats-Msg-Id header within a window
• Ideal for: durable events, event sourcing, task queues, CDC

CONSUMER TYPES:
• Durable — named, survives restarts, resumes where it left off
• Ephemeral — created on subscribe, gone when client disconnects
• Push — server pushes messages to subscriber
• Pull — subscriber explicitly fetches batches (more like Kafka)

RETENTION POLICIES:
• Limits — keep N messages / bytes / age (like Kafka)
• Interest — keep while at least one consumer is interested
• Work queue — delete once ack'd (like a classic queue)

BONUS: JetStream KV STORE and OBJECT STORE are built on top of streams with log compaction. Useful for configuration, feature flags, small state.`,
    keywords: ["core NATS", "JetStream", "durable consumer", "retention", "KV store"],
  },
  {
    id: 73, level: "senior", topic: "nats",
    q: "NATS JetStream delivery guarantees and consumer options — how do they interact?",
    a: `DELIVERY GUARANTEES:

AT-LEAST-ONCE (default):
• Publisher gets an ACK from the stream
• Consumer must explicitly ACK (AckExplicit policy)
• No ACK within ack_wait -> redelivered
• Duplicates possible on consumer crash mid-processing

EXACTLY-ONCE (JetStream's version):
Two mechanisms combined:
1. Publisher-side deduplication: set Nats-Msg-Id header
   JetStream deduplicates within duplicate_window (default 2 min)
   -> prevents duplicates from publisher retry
2. Consumer-side: double-ack (AckAck)
   Consumer ACKs; server re-confirms the ACK receipt
   -> prevents "I ACKed but server didn't record it"

As with Kafka EOS, end-to-end exactly-once still requires idempotent downstream writes. JetStream's guarantee ends at the stream boundary.

KEY CONSUMER OPTIONS:

DeliverPolicy:
• All (from the start of the stream)
• New (from now)
• Last (only most recent message)
• LastPerSubject (most recent per subject — great for KV-like state recovery)
• StartSequence / StartTime

AckPolicy:
• AckExplicit (default, safest)
• AckAll (acking N also acks everything before it — faster but riskier)
• AckNone (fire-and-forget, no redelivery)

ReplayPolicy:
• Instant — drain as fast as possible
• Original — replay at the original cadence (useful for testing/simulation)

MaxDeliver — max redelivery attempts. After that, message is routed via advisory events (you build a DLQ by subscribing to advisory subjects).

AckWait — how long before the server redelivers if no ACK. Tune for longest legitimate processing time.

GOTCHA: AckAll is a footgun for task queues — one fast ACK on message 100 acks everything back to 1, including still-processing messages.`,
    keywords: ["exactly-once", "AckExplicit", "Nats-Msg-Id", "AckWait", "MaxDeliver"],
  },
  {
    id: 74, level: "tricky", topic: "nats",
    q: "Trick: you're using Core NATS. 'At-most-once' — what does that actually mean in production?",
    a: `"At-most-once" = "0 or 1 deliveries, we don't guarantee which."

WHAT CAN SILENTLY EAT YOUR MESSAGE:

1. NO SUBSCRIBER AT PUBLISH TIME
   Publish to orders.created; no one is listening -> message dropped. No error, no log.
   Unlike Kafka (message stays), unlike RabbitMQ with mandatory flag.

2. SLOW CONSUMER DISCONNECTED
   NATS server has per-client buffers. If a subscriber can't keep up:
   • Server drops messages for that client
   • After a threshold, server disconnects the client ("slow consumer" error)
   • Messages during the window = LOST
   -> Tune pending_bytes_limit, pending_msgs_limit

3. NETWORK PARTITION
   Client briefly disconnected -> missed whatever was published during the gap.
   Client reconnects, but there's no replay in Core NATS.

4. SERVER RESTART
   Core NATS is stateless -> restart = empty state, nothing in flight survives.

5. QUEUE GROUP ROUND-ROBIN LOSS
   Subscriber in a queue group receives the message, processes it, crashes before a downstream commit -> no redelivery, no sibling consumer picks up.

WHEN CORE NATS IS STILL THE RIGHT CHOICE:

• RPC / request-reply — you WILL know about failure (timeout on the caller)
• Telemetry / metrics — losing 0.1% of heartbeats is fine
• Live dashboards — latest value wins, stale data is worthless anyway
• Service discovery / control plane — small volume, fast reactions
• IoT edge — dropping some sensor reads is acceptable

WHEN TO UPGRADE TO JETSTREAM:
• Any persistent state change
• Any "we cannot afford to lose this" business event
• Task queues
• Any retry-dependent workflow
• Anything audited

PRODUCTION CHECKLIST for Core NATS:
• Alert on "slow consumer disconnect" server events
• Monitor pending bytes/messages per subscription
• Dashboard both publish rate and consume rate — any divergence = drops
• Never use Core NATS for billing, orders, or any audit-required flow`,
    keywords: ["at-most-once", "slow consumer", "queue group", "partition"],
  },

  // ============== AWS SQS ==============
  {
    id: 80, level: "trainee", topic: "sqs",
    q: "What is AWS SQS? Standard vs FIFO queues?",
    a: `SQS (Simple Queue Service) — AWS's fully managed message queue. No servers to run, pay per request.

TWO QUEUE TYPES:

STANDARD:
• Nearly unlimited throughput
• AT-LEAST-ONCE delivery (duplicates possible)
• BEST-EFFORT ORDERING (not guaranteed)
• Good for most workloads where duplicates/order don't matter

FIFO:
• First-In-First-Out ordering guaranteed (within a message group)
• "Exactly-once processing" within a dedup window (see caveats in the tricky section)
• Limited to 300 TPS by default (3000 with batching, 70K with high-throughput mode)
• Requires MessageGroupId (ordering scope) and optionally MessageDeduplicationId
• Queue name must end with .fifo

KEY CONCEPTS (both types):
• Visibility timeout — while a consumer is processing, the message is invisible to others
• Long polling — wait up to 20s for new messages
• DLQ — dead-letter queue for failed messages
• Message retention — 1 min to 14 days (default 4 days)
• Max message size — 256 KB (use S3 + pointer for larger payloads)

PRICING: ~$0.40 per million requests (Standard). Very cheap for typical loads; FIFO is a bit pricier.`,
    keywords: ["standard", "FIFO", "visibility timeout", "managed"],
  },
  {
    id: 81, level: "junior", topic: "sqs",
    q: "What is visibility timeout and why does it matter?",
    a: `VISIBILITY TIMEOUT — when a consumer receives a message, it is hidden from other consumers for N seconds. If the consumer doesn't delete it within that window, the message becomes visible again and can be re-processed.

DEFAULT: 30 seconds. Max: 12 hours.

Why it exists: SQS doesn't have an explicit "ack" — instead, you must call DeleteMessage after successful processing. If your consumer crashes before deleting, visibility timeout ensures the message comes back.

COMMON PITFALL — TIMEOUT TOO SHORT:
Processing takes 2 minutes, visibility timeout is 30s:
1. Consumer A receives message
2. 30s later, it becomes visible again
3. Consumer B picks it up
4. Now TWO consumers are processing the same message simultaneously
5. Both try DeleteMessage — second one gets a harmless error
6. -> You have DUPLICATE side effects (double billing, double email, etc.)

FIXES:
• Set visibility timeout > max expected processing time (safety margin of 2x)
• OR use ChangeMessageVisibility during processing to extend (heartbeat pattern)
• Make processing idempotent (always the right call anyway)

CODE PATTERN (heartbeat):
while still_processing:
    sqs.change_message_visibility(
        QueueUrl=url,
        ReceiptHandle=handle,
        VisibilityTimeout=60,  # extend by 60s
    )
    sleep(30)

TIP: VisibilityTimeout defaults per-queue but can be overridden per-receive-call or per-message. Tune per message type if your queue has mixed workloads with very different processing times.`,
    keywords: ["visibility timeout", "DeleteMessage", "ChangeMessageVisibility", "heartbeat"],
  },
  {
    id: 82, level: "middle", topic: "sqs",
    q: "Long polling vs short polling — when to use which?",
    a: `SHORT POLLING (default when WaitTimeSeconds=0):
• Returns immediately even if no messages
• Queries only a subset of SQS servers -> may return empty even when messages exist
• Each call = 1 API request (costs money)
• Result: high latency AND high cost when queue is often empty

LONG POLLING (WaitTimeSeconds=1..20):
• Waits up to 20s for a message to arrive
• Queries ALL SQS servers -> no false empties
• Drastically fewer API calls (and bills)
• Lower latency under sporadic load

WHEN TO USE SHORT POLLING:
• Almost never in production
• Only: very high, steady load where the queue is always non-empty anyway
• Or: one-off scripts where you don't want to block

WHEN TO USE LONG POLLING:
• 99% of cases
• Set WaitTimeSeconds=20 on the queue (queue default) OR per-receive
• Combine with ReceiveMessageWaitTimeSeconds in the queue config

GOTCHAS:

1. CONSUMER COUNT
If you have N consumers all long-polling, they can all return empty after 20s. For idle queues, you're still paying for empty polls — but rate is bounded (max 1 empty call per 20s per consumer).

2. BATCH SIZE
Always use MaxNumberOfMessages=10 (max). Reduces cost 10x vs polling one at a time. Processing still happens sequentially in your code.

3. LAMBDA SQS TRIGGER
Uses its own polling internally (not your code). You only configure batch size and batch window. Lambda does long polling for you.

COST EXAMPLE:
1 consumer, 24/7, long poll 20s, empty queue:
~ 24 * 60 * 3 = 4320 calls/day = ~$0.002/day. Negligible.
Same with short poll (no sleep): millions of calls/day = real money.`,
    keywords: ["long polling", "short polling", "WaitTimeSeconds", "cost"],
  },
  {
    id: 83, level: "middle", topic: "sqs",
    q: "SQS vs SNS, and the SNS+SQS fan-out pattern?",
    a: `SQS = queue (point-to-point, one consumer reads each message).
SNS = pub/sub topic (broadcast to all subscribers).

SNS:
• Producer publishes to a topic
• All subscribers receive the message
• Subscriber types: SQS queues, Lambda, HTTP endpoints, email, SMS, mobile push
• No retention, no ordering (unless FIFO topic)
• If subscriber is down -> message lost (for HTTP/email). For SQS subscribers, SQS handles durability.

SNS + SQS FAN-OUT PATTERN (very common):

Producer -> SNS Topic -> [SQS Queue A, SQS Queue B, SQS Queue C] -> [Consumer A, B, C]

WHY:
• Each consumer reads at its own pace (SQS buffers for each independently)
• One slow consumer doesn't slow others
• Each consumer has its own DLQ
• Add/remove consumers without changing the producer
• Replay = move messages from DLQ back to the main queue

CONFIGURATION NOTES:
• Subscribe each SQS queue to the SNS topic
• Grant SNS permission to send to each queue (SQS resource policy)
• Enable RawMessageDelivery on the subscription — otherwise SNS wraps each message in an envelope JSON

ORDERING VARIANT:
SNS FIFO Topic -> SQS FIFO Queue(s) -> ordered processing per MessageGroupId

ALTERNATIVE: EVENTBRIDGE
• More routing capabilities (rules, filters, transformations, archive/replay)
• Up to ~14000 targets per rule
• Higher latency and cost per event
• Better for cross-account event choreography

RULE OF THUMB:
• Two-three consumers, simple broadcast -> SNS+SQS
• Many consumers, complex routing, schema registry -> EventBridge
• Single consumer -> just SQS
• High-throughput stream for analytics -> Kinesis or MSK (Kafka)`,
    keywords: ["SNS", "fan-out", "EventBridge", "RawMessageDelivery"],
  },
  {
    id: 84, level: "senior", topic: "sqs",
    q: "SQS FIFO 'exactly-once' — what's the real catch?",
    a: `AWS markets SQS FIFO as "exactly-once processing". The fine print matters.

WHAT IT ACTUALLY GUARANTEES:
Within a 5-MINUTE DEDUPLICATION WINDOW, if you send the same message (same MessageDeduplicationId, or same content with content-based dedup), SQS delivers it only once.

Outside that window? The same "duplicate" is treated as a new message.

WHAT "PROCESSING" MEANS HERE:
SQS deduplicates at INGRESS. It does NOT guarantee that your consumer processes only once. If:
• Consumer receives the message
• Processes it (writes to DB)
• Crashes BEFORE DeleteMessage
• Visibility timeout expires -> message redelivered
• Another consumer processes it again -> DUPLICATE PROCESSING

Just like Kafka EOS, SQS "exactly-once" is only within its boundary. The consumer still needs idempotency for real end-to-end guarantees.

OTHER LIMITS:

1. THROUGHPUT
• Default: 300 msg/sec per FIFO queue (3000 with batching)
• High-throughput FIFO (opt-in): 70k msg/sec per queue, 700k with batching
• Still 1000x less than Kafka
• -> Don't use FIFO for firehoses

2. MESSAGEGROUPID DRIVES ORDERING AND PARALLELISM
• Within same MessageGroupId -> strict FIFO, processed sequentially
• Across different groups -> parallel processing
• Few groups -> low parallelism (even with many consumers)
• Too many groups -> "FIFO" only within a single entity, not globally

3. DEDUP ID
• Max 128 chars
• Same dedup ID within 5 minutes -> rejected
• Content-based dedup uses SHA-256 of body
• If you need longer dedup -> do it yourself in DynamoDB/Redis

4. POISON PILLS IN FIFO
One stuck message in a group blocks the WHOLE group (FIFO ordering).
• Consumer keeps receiving and failing
• Eventually MaxReceiveCount -> DLQ
• Until then, all messages behind it wait
• -> Configure redrive policy carefully and monitor DLQ size

REAL-WORLD RECOMMENDATION:
• Use Standard SQS + idempotent consumer for most cases (simpler, cheaper, faster)
• Use FIFO only when strict ordering is a hard business requirement
• Design consumer to handle duplicates REGARDLESS of queue type`,
    keywords: ["FIFO", "MessageGroupId", "dedup window", "throughput"],
  },
  {
    id: 85, level: "tricky", topic: "sqs",
    q: "Trick: Lambda triggered by SQS — why does my function process the same message multiple times?",
    a: `SEVERAL COMMON CAUSES — all rooted in "visibility timeout + at-least-once delivery":

1. LAMBDA TIMEOUT > VISIBILITY TIMEOUT
   • Lambda function timeout: 15 min
   • Queue visibility timeout: 30s
   • Lambda is still running at 30s -> SQS makes message visible again -> another Lambda invocation picks it up
   -> FIX: set queue visibility timeout to AT LEAST 6x the function timeout (AWS's own recommendation)

2. LAMBDA ERRORED OR THREW AN EXCEPTION
   • Lambda returns failure -> SQS does NOT delete the message
   • Message becomes visible after visibility timeout -> redelivered
   • Keeps repeating until MaxReceiveCount -> DLQ
   -> FIX: catch non-retryable errors; return success for "poison" messages; configure DLQ

3. PARTIAL BATCH FAILURE (HUGE GOTCHA)
   • Lambda receives a batch of 10 messages
   • Processes 9 successfully, fails on 1
   • Lambda returns failure for the whole batch
   • ALL 10 messages become visible again -> 9 get RE-PROCESSED!
   -> FIX: Enable "ReportBatchItemFailures" (FunctionResponseTypes)
     Return only failed message IDs in the response:

     def handler(event, context):
         failed_ids = []
         for record in event['Records']:
             try:
                 process(record)
             except Exception:
                 failed_ids.append({'itemIdentifier': record['messageId']})
         return {'batchItemFailures': failed_ids}

   SQS will delete the successful ones and retry only failures. This is the #1 under-used SQS+Lambda feature.

4. LAMBDA RESERVED CONCURRENCY TOO LOW
   • SQS delivers messages faster than Lambda can process
   • Throttling -> Lambda returns failure -> message redelivered
   • Creates a retry storm
   -> FIX: raise reserved concurrency or use MaximumConcurrency on the event source mapping

5. DOWNSTREAM FAILURES (DB, HTTP)
   • Function fails due to transient issue -> message redelivered -> processed later when downstream is healthy -> now there are DB writes from both attempts
   -> FIX: idempotent processing using business keys (orderId, eventId)

6. MANUAL DELETE BUG
   • Code explicitly deletes messages one-by-one
   • Exception before delete -> redelivery
   -> FIX: prefer batch response model (above) over manual deletes

GOLDEN RULE: with SQS + Lambda, always assume AT-LEAST-ONCE. Even with FIFO, even with "exactly-once" marketing. Design idempotent consumers — it's cheaper than debugging duplicate charges on a Friday night.`,
    keywords: ["Lambda", "visibility timeout", "ReportBatchItemFailures", "batchItemFailures", "idempotency"],
  },

  // ============== BIG COMPARISON ==============
  {
    id: 90, level: "lead", topic: "comparison",
    q: "Choose: RabbitMQ, Kafka, Redis Streams, NATS JetStream, AWS SQS, Google Pub/Sub — decision criteria?",
    a: `DECISION AXES (in order of how I use them in real reviews):

1. MANAGED OR SELF-HOSTED?
• Have ops budget -> anything
• No ops team / small team -> SQS, Pub/Sub, CloudAMQP (managed RabbitMQ), MSK (managed Kafka), Upstash
• Self-hosted "cheapest to run" -> NATS JetStream (single binary, Go)

2. THROUGHPUT SCALE
• < 1k msg/sec: anything works
• 1k-50k: RabbitMQ, Redis Streams, SQS, NATS, Pub/Sub
• 50k-500k: Kafka, NATS JetStream, Pub/Sub, High-throughput SQS FIFO
• > 500k: Kafka (mostly), maybe NATS with careful sharding

3. LATENCY REQUIREMENTS
• Microseconds: Core NATS, Redis Pub/Sub
• Sub-millisecond: Redis Streams, NATS JetStream
• Single-digit ms: RabbitMQ
• Tens of ms: Kafka, SQS, Pub/Sub

4. DURABILITY / RETENTION
• Ephemeral ok -> Core NATS, Redis Pub/Sub
• Short (hours): SQS (max 14d), Redis Streams (RAM-limited)
• Long (days-weeks): RabbitMQ, NATS JetStream
• Indefinite / replay: Kafka, Pub/Sub (with archive), EventBridge archive

5. ORDERING
• Global order needed -> Kafka with 1 partition (slow), FIFO queues
• Per-key order -> Kafka (partition by key), FIFO with MessageGroupId, NATS subject design
• Don't care -> Standard SQS, RabbitMQ, Core NATS

6. DELIVERY SEMANTICS
• At-most-once: Core NATS, Redis Pub/Sub
• At-least-once (most common): everything else
• Exactly-once-ish: Kafka transactions, SQS FIFO (within dedup window), NATS JetStream (with Msg-Id)
• True end-to-end EOS: always requires idempotent consumer, regardless of broker

7. ROUTING COMPLEXITY
• Simple pub/sub -> Kafka, Pub/Sub, SNS
• Topic patterns + filters -> NATS subjects, RabbitMQ topic exchanges
• Advanced (headers, transformations, fan-in) -> RabbitMQ, EventBridge

8. ECOSYSTEM / INTEGRATIONS
• Data pipelines, connectors -> Kafka (Kafka Connect, Debezium, Schema Registry)
• AWS-native -> SQS/SNS/EventBridge/Kinesis
• GCP-native -> Pub/Sub
• Kubernetes-native / service mesh -> NATS
• Already-have-it -> Redis Streams, RabbitMQ

TYPICAL PICKS I MAKE IN PRACTICE:

• Python backend, background jobs -> Celery + RabbitMQ or SQS
• Microservices on Kubernetes, low-latency RPC -> NATS Core
• Microservices with durable events -> NATS JetStream or Kafka
• Big-data pipeline, analytics -> Kafka + Schema Registry
• Serverless on AWS -> SQS + Lambda + SNS for fan-out
• Small team, already on Redis -> Redis Streams (until you outgrow it)
• Event bus for whole company (100s of services) -> Kafka (schema governance wins)

ANTI-PATTERNS I AVOID:
• Kafka for simple task queues
• RabbitMQ for high-retention event log
• SQS FIFO as a firehose (throughput limits)
• Redis Streams for "we can't lose a single message" systems
• Core NATS for anything persistent
• SNS without SQS (no buffering, no retry for offline consumers)`,
    keywords: ["decision matrix", "managed", "throughput", "ordering", "ecosystem"],
  },

  // ============== NEW: DECISION MATRIX + HIGH-VALUE INTERVIEW QUESTIONS ==============
  {
    id: 100, level: "senior", topic: "comparison",
    q: "Broker decision matrix — pick one in 60 seconds",
    a: `A cheat sheet you can visualize on a whiteboard.

 REQUIREMENT              | RabbitMQ | Kafka | Celery | Redis Str. | NATS JS | SQS
---------------------------|----------|-------|--------|------------|---------|------
 <10k msg/s throughput    |   ✓      |  ✓    |  ✓     |    ✓       |   ✓     |  ✓
 100k+ msg/s throughput   |   ⚠      |  ✓✓   |  ⚠     |    ⚠       |   ✓     |  ⚠
 Ordered per key (partit) |   ⚠      |  ✓    |  ✗     |    ✓       |   ✓     |  ✓*
 Replay messages (hours)  |   ✗      |  ✓✓   |  ✗     |    ✓       |   ✓     |  ✗
 Complex routing rules    |   ✓✓     |  ✗    |  ✗     |    ✗       |   ✓     |  ⚠
 Dead-letter queue native |   ✓✓     |  ⚠    |  ✓     |    ✗       |   ✓     |  ✓✓
 Exactly-once (prod→cons) |   ✗      |  ✓*   |  ✗     |    ✗       |   ✓*    |  ⚠
 Low latency (<1ms)       |   ⚠      |  ⚠    |  ✗     |    ✓✓      |   ✓✓    |  ✗
 Managed service (no ops) |   AWS MQ |  MSK  |  -     |    ElastiC |   Synad.| AWS✓
 Pub-sub fan-out          |   ✓✓     |  ✓    |  ✗     |    ✓       |   ✓✓    |  SNS
 Pure python stack        |   ✓ pika |  ⚠    |  ✓✓    |    ✓       |   ✓     |  ✓

✓✓ = strong fit, ✓ = works, ⚠ = possible but not its strength, ✗ = don't use
* = requires careful configuration (idempotent producers, dedupe keys, etc.)

DECISION TREE:
1. Need to REPLAY events from yesterday? → Kafka or Redis Streams or NATS JetStream.
2. Need complex routing (topic exchange, headers)? → RabbitMQ.
3. Background Python jobs with retries? → Celery (+ Redis or RabbitMQ broker).
4. Already on AWS, serverless, "just works"? → SQS (FIFO if ordering needed).
5. Microservices with ultra-low latency? → NATS Core (fire-and-forget) or JetStream (durable).
6. Schema governance + long retention + analytics? → Kafka with Schema Registry.
7. Small team, Redis already in stack? → Redis Streams (until throughput outgrows it).

WHAT INTERVIEWERS LISTEN FOR:
→ You mention at least TWO options and pick based on trade-offs.
→ You acknowledge what you're giving up (Kafka = ops complexity; SQS = retention limits).
→ You don't pick Kafka for everything. That's the red flag answer.`,
    keywords: ["decision matrix", "comparison", "trade-offs", "interview"],
  },
  {
    id: 101, level: "middle", topic: "patterns",
    q: "Exactly-once delivery — truth, myth, and what actually works",
    a: `THE MYTH: "We need exactly-once delivery, so we must use Kafka with idempotent producers."

THE TRUTH: Exactly-once is ALMOST NEVER end-to-end possible. What you CAN get:

1. EXACTLY-ONCE WITHIN A BROKER (producer → broker → storage)
   • Kafka: idempotent producer + transactions → messages persisted at-most-once
   • NATS JetStream: msg-id deduplication window

2. AT-LEAST-ONCE FROM BROKER TO CONSUMER
   • The broker redelivers if consumer doesn't ack.
   • Consumer WILL sometimes see duplicates. Period.

3. EFFECTIVELY-EXACTLY-ONCE END-TO-END = AT-LEAST-ONCE + IDEMPOTENT CONSUMER
   • Consumer stores a dedupe key (msg_id) in a DB before processing.
   • If the same msg_id shows up again, it's a no-op.
   • This is THE production pattern.

INTERVIEW-READY ANSWER:
"Exactly-once end-to-end doesn't exist in a distributed system with failures. I aim for at-least-once delivery plus idempotent consumers. The consumer stores a seen-message-id in its own DB in the same transaction that commits the side effect — two-phase commit between the broker ack and the DB would be the only "true" exactly-once, but that's operationally expensive and basically no one does it in practice."

WHAT HAPPENS IF YOU SKIP IDEMPOTENCY:
• Consumer crashes after work but before ack → message redelivered → side effect happens twice.
• Example: charge_card called twice → customer double-charged → incident.`,
    keywords: ["exactly-once", "idempotent", "at-least-once", "dedupe"],
  },
  {
    id: 102, level: "senior", topic: "patterns",
    q: "Poison messages — how to handle them without taking down the queue",
    a: `A POISON MESSAGE is one the consumer can never process successfully (malformed payload, missing foreign key, bug in parsing). Without handling, it blocks the queue and keeps getting retried forever.

THE PATTERN: retry N times, then dead-letter.

1. TRACK RETRY COUNT
   • Add a delivery attempts counter either in the message headers (x-delivery-count in AMQP 1.0, RabbitMQ x-delivery-count) or in an external store (Redis with msg_id → counter).

2. BOUNDED RETRIES WITH EXPONENTIAL BACKOFF
   • 1st retry after 10s, 2nd after 1min, 3rd after 10min. Gives upstream time to recover.
   • In RabbitMQ: use TTL + dead-letter-exchange to implement delayed retries.
   • In Kafka: there's no native backoff — either process in a separate retry topic or use the official Retry Topic pattern (ProducerRecord to ".retry" with a scheduled delivery time).

3. DEAD-LETTER QUEUE (DLQ) AFTER MAX RETRIES
   • Move the message to a separate queue/topic for human inspection.
   • RabbitMQ: x-dead-letter-exchange on the queue. SQS: RedrivePolicy with maxReceiveCount.
   • Include reason (exception message, stack trace header) so ops can triage.

4. ALERT ON DLQ DEPTH
   • Prometheus/Datadog on DLQ message count. Non-zero = someone should look.

5. WHAT YOU DON'T DO:
   • Catch everything and ack silently → silent data loss.
   • Log and skip → messages are gone forever; can't reprocess after fixing the bug.
   • Retry forever with no backoff → overwhelms the upstream and burns CPU.

COMMON FOLLOW-UP: "What do you do with the DLQ?"
• Build a small tool to replay messages from DLQ back to the main queue after a fix deploys.
• Never delete messages from DLQ without human review — they might be evidence of a bug.`,
    keywords: ["poison message", "DLQ", "dead-letter", "retry", "backoff"],
  },
  {
    id: 103, level: "middle", topic: "patterns",
    q: "Idempotency keys — why every async consumer needs them",
    a: `CLAIM: if a consumer runs and doesn't have an idempotency key, it's buggy by design.

WHY: at-least-once delivery is the guarantee nearly all brokers actually provide. Consumer crashes, network blips, and retries WILL cause duplicates. Without idempotency, duplicate delivery = duplicate side effects.

CANONICAL PATTERN — "dedupe inside the transaction":

  def process(msg):
      key = msg.headers["idempotency_key"]  # or msg.id, or a hash of the payload

      with db.transaction():
          if db.seen.exists(key):
              return                          # already processed, ack & move on
          db.seen.insert(key)                 # in the SAME transaction
          do_side_effect(msg)                 # only if we won the race

      broker.ack(msg)

KEY POINTS:
• "seen" table in the SAME database as the business data → one transaction commits both the dedupe record AND the side effect.
• If the transaction fails, nothing commits, the message is redelivered, and we try again.
• The broker ack happens AFTER the transaction commits. If we ack before → we might crash mid-work and lose the message.

WHAT TO USE AS THE KEY:
1. A producer-supplied UUID in a header → cleanest (producer owns semantics).
2. A hash of business fields (user_id + order_id + timestamp-bucket) → works when producers can't attach a key.
3. Message offset + partition (Kafka) or delivery_tag (AMQP) → works for the single-broker case but breaks if you replay.

TTL: the "seen" table will grow forever. Strategies:
• Keep keys for 7-30 days (longer than your retry window) then drop.
• Use a partitioned table and drop old partitions.
• For high volume, use Redis with TTL (risk: eviction before broker stops retrying).`,
    keywords: ["idempotency", "dedupe", "key", "at-least-once", "transaction"],
  },
  {
    id: 104, level: "senior", topic: "patterns",
    q: "Saga pattern — managing distributed transactions without 2PC",
    a: `THE PROBLEM: an operation spans multiple services (pay → reserve-inventory → ship). You can't wrap them in a single ACID transaction because each service has its own DB. Two-phase commit (2PC) works in theory but is operationally brittle and almost nobody uses it in 2026.

SAGA: break the transaction into local transactions + compensating actions.

TWO STYLES:

1. CHOREOGRAPHY (event-driven, decentralized)
   OrderService → OrderCreated → (bus)
   PaymentService listens → charges card → PaymentCompleted
   InventoryService listens → reserves items → InventoryReserved
   ShippingService listens → creates label → Shipped

   On failure: service emits compensating event (PaymentFailed → InventoryService releases reservation → OrderService marks as cancelled).

   Pros: loose coupling, no orchestrator.
   Cons: hard to see the "whole flow" anywhere; debugging traces span many services.

2. ORCHESTRATION (central saga orchestrator)
   A dedicated Saga service holds the state machine.
   It calls each service in sequence, listens for results, issues compensations on failure.

   Pros: entire flow visible in one place; easier to evolve.
   Cons: orchestrator becomes a critical dependency.

WHEN IT'S NOT A SAGA:
• You don't need compensation — just retries.
• The operation is a single local transaction — no saga needed.
• You need strict consistency → you need a database that supports distributed transactions, not a saga.

COMMON MISTAKES:
1. Forgetting compensations are not always undo — sending "sorry your order failed" email is fine, but "un-charge" requires a refund, not pretending the charge never happened.
2. Assuming compensations always succeed. They can fail too. Plan for "compensation of the compensation" or manual intervention.
3. Not making steps idempotent. Retries will happen. See id 103.`,
    keywords: ["saga", "2PC", "compensation", "orchestration", "choreography"],
  },
  {
    id: 105, level: "senior", topic: "kafka",
    q: "Partition key design — the decision that makes or breaks your Kafka cluster",
    a: `Kafka partitions give you two things you can't have together cheaply: parallelism (many partitions = many consumers in a group) AND ordering (messages with the same key always go to the same partition = ordered within that key).

THE RULE: pick a partition key whose value space is BIG ENOUGH to spread load evenly, but SMALL ENOUGH that all events for one "entity" end up on the same partition.

GOOD KEYS:
• user_id → orders and events for the same user stay ordered
• tenant_id + user_id → per-tenant parallelism
• device_id for IoT streams
• session_id for user activity within a session

BAD KEYS:
• null (round-robin) → you lose all ordering
• timestamp → hot spot (all recent events on one partition)
• a low-cardinality field (country → 200 keys) → skewed partitions, some workers idle
• a very high-cardinality field you never query by → wastes the ordering guarantee

HOT PARTITION (the classic production incident):
A few keys receive 100x more traffic than average. One partition fills up while others are idle. Consumer lag on that partition alone turns into a queue backlog.

MITIGATIONS:
1. Salt the key: user_id + "-" + random_bucket(0..N). Trades ordering for load spread — but across a user's events you're not ordered anymore.
2. Separate topic for the hot keys with more partitions.
3. Detect hot partitions (Kafka metrics, cmak, Burrow) and alert early.

CHANGING PARTITION COUNT IS A LANDMINE:
Adding partitions changes the hash(key) % partition_count mapping — all historical ordering by key is broken for future messages. Only do this with a controlled migration (dual-publish during cutover, or start a new topic and migrate consumers).`,
    keywords: ["partition", "kafka", "key", "hot partition", "ordering"],
  },
  {
    id: 106, level: "senior", topic: "rabbitmq",
    q: "Mirrored queues vs Quorum queues — which to choose in 2026",
    a: `MIRRORED (CLASSIC) QUEUES: legacy HA. The data is mirrored to N nodes. Fast, but has fundamental issues with network partitions — under certain failure modes, messages can be lost.

RabbitMQ officially DEPRECATED mirrored queues in 3.10+. Do not pick them for new code.

QUORUM QUEUES: the modern replacement. Based on the Raft consensus algorithm, designed for safety over speed.

 PROPERTY              | Mirrored (classic)    | Quorum
-----------------------|-----------------------|----------------------
 Replication           | leader + N replicas   | Raft (odd N, usually 3 or 5)
 Partition behavior    | Known data loss risks | Safe — minority partition stops accepting
 Max throughput        | Higher (synchronous)  | Lower (Raft commit)
 Latency               | Lower                 | Higher (consensus overhead)
 Message size          | OK for large msgs     | Poor for very large msgs
 Ordering guarantees   | Best-effort           | Strong per-queue
 Producer confirms     | Standard              | Strongly recommended

WHEN TO USE QUORUM:
• Anything that matters for correctness (payments, orders, anything requiring durability).
• When you can tolerate ~10-30% lower throughput for strong consistency.
• For messages < ~1 MB. Larger → consider shoveling to object storage with a pointer.

WHEN NOT TO USE QUORUM:
• Very low-latency, best-effort ingestion of observability data. Use streams (new) or classic queues.
• Huge messages (files, images). Use S3/MinIO with a pointer.

STREAMS (RabbitMQ 3.9+): a log-structured variant that competes with Kafka for replay/retention. Best for event-sourcing, analytics, audit trails. Not for task queues.`,
    keywords: ["mirrored", "quorum", "raft", "rabbitmq", "HA"],
  },
  {
    id: 107, level: "senior", topic: "patterns",
    q: "Back-pressure — what happens when consumers can't keep up",
    a: `BACK-PRESSURE is the signal from a slow consumer to the producer saying "slow down or I'll drop messages."

WHY IT MATTERS: without it, unbounded queue growth → producer runs out of memory OR broker runs out of disk OR latency explodes OR messages time out and get reprocessed.

STRATEGIES (pick based on your domain):

1. BLOCK THE PRODUCER (sync, simplest)
   The broker refuses to accept new messages if the queue is full.
   • RabbitMQ: policy max-length + overflow = reject-publish → publisher gets a confirm-reject.
   • Kafka: batch.size + linger.ms full → send() blocks.
   Good for: internal systems where losing latency is OK.

2. DROP OLDEST / NEWEST (lossy)
   • max-length-bytes + overflow = drop-head (RabbitMQ).
   • Kafka retention: old messages deleted based on bytes or time.
   Good for: metrics, logs, anything where the NEWEST data matters and history is cheap to lose.

3. SCALE OUT CONSUMERS
   Kafka: add consumers to the group → rebalances partitions.
   RabbitMQ: add workers on the same queue → competing consumers.
   Celery: spin up more workers.
   Constraint: Kafka parallelism is capped at partition count.

4. ROUTE TO A DIFFERENT QUEUE (shed load)
   If primary queue is full, fire to an "overflow" queue with a fast consumer that writes to S3. Replay later.

5. END-TO-END THROTTLING
   Upstream (API gateway, ingress rate limiter) drops requests before they create messages. Counter-intuitive but often the right answer.

MONITORING SIGNALS YOU NEED:
• Queue depth per queue/partition.
• Consumer lag (messages behind head).
• Consumer processing latency (p50, p99).
• Producer publish latency.

CLASSIC INTERVIEW SCENARIO:
"Your consumer is 10x slower than your producer. What do you do?"
Wrong: "Add more consumers." (Band-aid.)
Good: "Figure out WHY — CPU-bound? Bad code? DB contention? Downstream slow? Fix the root cause. Scaling is a short-term fix."`,
    keywords: ["back-pressure", "throttling", "consumer lag", "overflow"],
  },
  {
    id: 108, level: "senior", topic: "comparison",
    q: "Message ordering guarantees — per broker, per scope",
    a: `"Is this ordered?" is one of the most misunderstood interview questions. The answer is always "ordered in what scope?".

 BROKER           | Global  | Per-Key  | Per-Queue | Per-Partition
------------------|---------|----------|-----------|----------------
 RabbitMQ         | ✗       | ✓ hash   | ✓         | N/A
 Kafka            | ✗       | ✓ hash   | N/A       | ✓
 Celery           | ✗       | ✗        | ✗         | N/A
 Redis Streams    | ✗       | ✗        | ✓         | ✓ (consumer group)
 NATS JetStream   | ✗       | ✗        | ✓ stream  | ✓
 SQS Standard     | ✗       | ✗        | ✗         | N/A
 SQS FIFO         | ✗       | ✓ GroupId| N/A       | N/A

WHAT "PER-KEY" MEANS:
Messages with key K always go to the same shard/partition → all messages for K are read in order they were written.

WHEN ORDERING BREAKS EVEN WHEN "GUARANTEED":
1. Kafka: consumer with multiple threads processing messages from one partition out of order (unless you manually serialize).
2. RabbitMQ: multiple consumers on one queue (competing consumers) → each gets messages in order but the combined processing is NOT ordered.
3. Any retry: a failed message going to a retry queue breaks the sequence.
4. Scaling from 1 partition to N: old "ordered" stream is not ordered across the split.

WHAT TO TELL AN INTERVIEWER:
"I don't assume ordering unless the scope is explicit. If I need ordering for a user's actions, I use per-key partitioning (Kafka partition key = user_id, or RabbitMQ consistent-hash exchange). And I make the consumer idempotent so retries don't break invariants."

WHEN YOU DON'T NEED ORDERING:
• Event-driven consumers that operate on the latest snapshot anyway.
• Idempotent aggregate updates (counter += 1 using DB increment).
• Fan-out notifications where order doesn't affect outcome.

WHEN YOU GENUINELY NEED GLOBAL ORDERING:
Almost never in practice. If the interviewer is pushing for it, ask "what's the business reason?" — often it turns out you need per-key ordering, not global.`,
    keywords: ["ordering", "partition", "per-key", "FIFO"],
  },
  {
    id: 109, level: "tricky", topic: "patterns",
    q: "✅ Good vs ❌ Bad — designing the consumer",
    a: `Side-by-side: a consumer that survives production vs one that looks fine in dev but breaks under load.

✅ GOOD — production-ready consumer:

  def handle(msg):
      idem_key = msg.headers["idempotency_key"]

      with db.transaction():
          if db.seen.exists(idem_key):
              return                          # duplicate, no-op
          db.seen.insert(idem_key)

          try:
              payload = schema.parse(msg.body)   # validate FIRST
          except SchemaError as e:
              metrics.inc("consumer.bad_payload")
              dead_letter(msg, reason=str(e))
              return

          process(payload)                       # business logic

      broker.ack(msg)                            # ack ONLY after tx commits

WHY: idempotent, validates the payload, bad payloads go to DLQ not retry loop, ack happens after commit (so crashes replay safely).

❌ BAD — the "it works in dev" consumer:

  def handle(msg):
      broker.ack(msg)                            # ack FIRST — crash = data loss
      try:
          payload = json.loads(msg.body)
          process(payload)                       # no idempotency
      except Exception:
          pass                                   # swallow → silent failures
                                                  # no DLQ, no metrics

WHY BAD (each line):
• Ack first → crash between ack and process = message is gone, no retry, no replay.
• No idempotency → redelivery causes double-charge, double-email, double-insert.
• Catch-all except + pass → silent failure. You will learn about the bug from a customer, not a metric.
• No DLQ → bad payloads retry forever, blocking the queue.

OBSERVABILITY CHECKLIST:
1. Messages in, messages acked, messages DLQ'd — all counters.
2. Per-message processing time histogram (p50, p95, p99).
3. Consumer lag / queue depth gauge.
4. Alert on DLQ growth RATE (not absolute count — growth means something is wrong NOW).
5. Correlation ID in every log line so you can trace one message across services.`,
    keywords: ["consumer", "idempotent", "DLQ", "ack", "observability"],
  },
  {
    id: 110, level: "senior", topic: "patterns",
    q: "Transactional Outbox — publishing events reliably after a DB commit",
    a: `THE PROBLEM: you save an order to your database and publish OrderCreated to Kafka. How do you guarantee both happen together?

  # naive (bad)
  db.orders.insert(order)
  kafka.publish("orders", OrderCreated(order.id))
  # what if we crash between these? the order exists but no one knows.

  # naive (other direction, also bad)
  kafka.publish("orders", OrderCreated(order.id))
  db.orders.insert(order)
  # published an event for an order that might not exist.

Two-phase commit across DB and Kafka is operationally terrible. The industry standard is the OUTBOX PATTERN.

THE PATTERN:
1. In the SAME transaction as inserting the order, insert a row into an "outbox" table in the SAME database.

       BEGIN;
         INSERT INTO orders(...);
         INSERT INTO outbox (id, topic, payload, created_at) VALUES (...);
       COMMIT;

2. A separate worker (or Debezium, or a cron) reads the outbox table and publishes to Kafka. On successful publish, it marks the row as sent (or deletes it).

3. If publishing fails, the outbox row is retried — the DB is the source of truth.

GUARANTEES:
• At-least-once delivery (publisher might crash between publish and mark-sent → duplicate → consumer must be idempotent).
• No "ghost events" — the event only exists if the DB commit succeeded.

VARIATIONS:
• POLLING OUTBOX: simple worker that SELECTs unsent rows every 100ms. Works, adds poll latency.
• CDC OUTBOX (Debezium, Postgres logical replication): reads the DB's transaction log and publishes changes. Near-zero latency, no polling load.
• IN-PROCESS OUTBOX: worker runs inside the same service, same connection pool. Fine for small scale.

WHEN NOT TO USE:
• Best-effort events (metrics, analytics). The overhead isn't justified.
• Two-service communication where you control both sides and can tolerate loss.

COMMON FOLLOW-UP:
"How do you deduplicate on the consumer side?"
→ See id 103 — idempotency key stored in the consumer's own DB.`,
    keywords: ["outbox", "CDC", "transactional", "publishing", "reliability"],
  },

  // ============== NEW: FRIENDLY "WHAT WOULD I PICK" SCENARIOS ==============
  {
    id: 111, level: "middle", topic: "comparison",
    q: "Scenario: \"User signs up → 5 services need to react\" — which broker?",
    a: `Classic fan-out. New user signup should:
   1. Send welcome email.
   2. Create a record in CRM.
   3. Track the signup in analytics.
   4. Provision the default workspace.
   5. Notify the sales team in Slack.

NONE of these should block the signup API response. And failure in any ONE of them should not fail the others.

BEST FIT: RabbitMQ topic exchange OR NATS JetStream

Why: fan-out is exactly what topic-based pub-sub is for. Producer sends one message to one exchange/subject; the broker routes a copy to each consumer's queue.

RabbitMQ sketch:
   events.user (topic exchange)
       ↓ routing key "user.signup"
       ├── queue: email.welcome   → email worker
       ├── queue: crm.sync        → crm worker
       ├── queue: analytics.track → analytics worker
       ├── queue: workspace.init  → provisioner
       └── queue: slack.notify    → slack bot

Why this wins over alternatives:
• Per-consumer queue = per-consumer backlog. Slow CRM integration doesn't slow the email.
• Per-queue DLQ for poison messages.
• Adding a 6th consumer tomorrow: bind a new queue to the same routing key. Zero producer changes.

Why NOT Kafka here:
• You don't need replay — signups aren't replayed.
• You don't need ordering — these 5 events are independent.
• Kafka consumer groups need partition planning; overkill for 5 subscribers.

Why NOT Celery:
• Celery is a task queue, not an event bus. You'd end up calling 5 tasks from the signup handler — producer knows about all 5 consumers, which is exactly the coupling we're avoiding.

PRODUCTION DETAIL: each consumer queue should have its own retry policy. Email bounces differ from CRM timeouts.`,
    keywords: ["fan-out", "pub-sub", "signup", "scenario", "topic-exchange"],
  },
  {
    id: 112, level: "senior", topic: "comparison",
    q: "Scenario: \"100k image uploads/day → resize + thumbnail + OCR\" — how to shape it?",
    a: `Characteristics: high volume but not sudden-spike, heavy CPU, outputs multiple artifacts per input, some steps can fail independently.

BEST FIT: RabbitMQ / SQS for the work queue + S3 for payloads + pipeline of stages.

DO NOT put the image bytes in the message. Put a pointer (S3 key) and metadata. Messages stay tiny; broker stays fast.

SHAPE:
   [API] → uploads to S3 → enqueues ImageUploaded{ s3_key, user_id }
                           ↓
                      [resize-workers]  → writes resized S3 objects → ResizedCreated
                           ↓
                      [thumbnail-workers] → thumb.s3_key → ThumbnailCreated
                           ↓
                      [ocr-workers (slow)] → OCR text → OCRDone

KEY DECISIONS:
1. STAGES AS SEPARATE QUEUES. Each stage has its own backlog, workers, and scaling policy. OCR is 10x slower than resize? Give it 10x workers; thumbnails don't suffer.
2. PREFETCH=1 PER WORKER. These are CPU-bound — if prefetch is too high, a worker grabs 50 images it can't finish, starving others.
3. VISIBILITY TIMEOUT / ACK DEADLINE = LONGER THAN THE SLOWEST STAGE. For OCR set to 5 minutes. If it's less, broker redelivers mid-processing and the next worker does the same expensive work twice.
4. IDEMPOTENCY BY S3 KEY. If a worker re-processes an image (crash, redelivery), overwriting the same S3 object is fine — same bytes land at the same key.
5. DLQ PER STAGE with original message + error reason as headers. Ops can re-enqueue after a code fix.
6. BACKPRESSURE AT THE API. If upload queue > N pending, return 429. Don't let a bad day melt your workers.

WHY NOT KAFKA:
• Task queue semantics (competing consumers, per-message ack) are not Kafka's strength. You'd implement retries + DLQ by hand. Use a task queue.

WHY NOT CELERY:
• Celery works for this but its chord/chain primitives get messy across 3 stages when you want per-stage observability. Raw queues + explicit stage names is clearer for ops.`,
    keywords: ["task-queue", "pipeline", "image", "stages", "prefetch", "visibility-timeout", "DLQ"],
  },
  {
    id: 113, level: "senior", topic: "comparison",
    q: "Scenario: \"We need to replay 7 days of events after a bug fix\" — which broker?",
    a: `The question tells you the answer. \"Replay\" = log-based storage.

BEST FIT: Kafka (or Redis Streams / NATS JetStream for smaller scale).

WHY RABBITMQ/SQS DON'T WORK:
• RabbitMQ queues are buffers — once a message is acked, it's GONE. You can't \"replay yesterday\".
• SQS Standard: messages disappear after ack (max 14 days retention, and they don't stick around).

KAFKA MECHANICS FOR REPLAY:
1. Retention is time-based (default 7 days; set to 30 or forever).
2. Consumer group tracks offset per partition. To replay:
   kafka-consumer-groups.sh --reset-offsets --to-datetime 2026-04-10T00:00:00 --group billing-consumer
3. Restart the consumer. It re-reads everything from that point.

PRODUCTION WRINKLES:
• Downstream must be IDEMPOTENT for replay. If your consumer credits $5 to an account on every OrderPaid event, replay credits them $5 N more times. Broken.
• SIDE EFFECTS that can't be retracted (emails, SMS, charges): gate behind an \"already processed\" check keyed by event ID.
• SCHEMA EVOLUTION over 7 days. If event shape changed mid-week, your consumer must read both. Use Schema Registry with backward compatibility.
• COST. Long retention = disk. Compact topics help for \"current state\" streams but not for audit logs.

RULE OF THUMB:
• Replay needed → log-based (Kafka / Redis Streams / JetStream).
• Task queue with retries but no replay → RabbitMQ / SQS / Celery.

This is also THE question where \"we chose Kafka because we might need replay someday\" is usually wrong — if you don't need it TODAY, Kafka is overkill. Build what you need; migrate when you need more.`,
    keywords: ["replay", "kafka", "retention", "offset", "idempotent", "scenario"],
  },

  // ============== NEW: REAL PROJECT — GOOD vs BAD IN PRODUCTION ==============
  {
    id: 114, level: "senior", topic: "patterns",
    q: "Real project: payments — ✅ Good vs ❌ Bad",
    a: `An API endpoint that charges a card and records the transaction.

❌ BAD — the \"it works on my machine\" approach:

  def charge(order_id, card_token, amount):
      stripe.charge(card_token, amount)              # 🔥 network call inside request
      db.charges.insert(order_id=order_id, ...)     # 🔥 two non-atomic writes
      kafka.publish("payment.completed", {...})     # 🔥 another one, 3 total
      email.send_receipt(...)                        # 🔥 makes request slow + fragile
      return {"status": "ok"}

What goes wrong in production:
• stripe.charge succeeds; db insert fails (deadlock, FK violation, anything) → charged customer, no record.
• db insert succeeds; kafka.publish fails → charged + recorded, but downstream systems (loyalty points, analytics) never see it.
• email service is slow → p99 latency of payment API climbs from 200ms to 3s.
• Everything fails? We retry from the client. Customer gets charged 3x.

✅ GOOD — production-grade payment handler:

  def charge(order_id, card_token, amount, idempotency_key):
      # 1. In ONE DB transaction, write the intent + the outbox event.
      with db.transaction():
          if db.seen.exists(idempotency_key):
              return db.charges.by_key(idempotency_key)  # replay protection
          db.seen.insert(idempotency_key)

          # Idempotent call to Stripe: they dedupe by idempotency_key too.
          charge_result = stripe.charge(
              card_token, amount, idempotency_key=idempotency_key,
          )

          db.charges.insert(
              order_id=order_id,
              stripe_id=charge_result.id,
              amount=amount,
              status="completed",
          )
          db.outbox.insert(
              topic="payment.completed",
              payload={"order_id": order_id, "stripe_id": charge_result.id},
          )

      # 2. Separate worker (not this request) publishes outbox → Kafka → downstream.
      # 3. Email is triggered by a separate consumer of payment.completed.

      return {"status": "ok", "stripe_id": charge_result.id}

WHY THIS SHAPE:
• Stripe + DB share an idempotency key. Same request retried = same charge, not a new one.
• DB transaction + outbox = either both commit or neither. No partial state.
• Kafka publish is out-of-band (outbox worker). The request doesn't wait on it.
• Email sent by a downstream consumer of payment.completed — failures there don't affect the payment record.
• Any consumer crashes and replays: idempotency key makes the side effect safe.

REAL FAILURE MODES IT PREVENTS:
• Network blip mid-request → client retries → same idempotency key → no double charge.
• Kafka outage → request succeeds, outbox retries publishing for hours.
• Email provider outage → charge still goes through; receipt email goes out later.

This is the pattern Stripe/Uber/Shopify all use. It's ~30 extra lines once you write the outbox plumbing, and it prevents 90% of payment incidents.`,
    keywords: ["payments", "idempotency", "outbox", "transaction", "good-vs-bad", "production", "stripe"],
  },
  {
    id: 115, level: "senior", topic: "patterns",
    q: "Real project: email notifications — ✅ Good vs ❌ Bad",
    a: `A service that sends transactional emails (password reset, receipt, alert).

❌ BAD — the version everyone writes first:

  @app.route("/forgot-password")
  def forgot():
      user = User.find_by_email(request.json["email"])
      if user:
          token = generate_reset_token(user)
          sendgrid.send(                              # 🔥 blocks the request
              to=user.email,
              subject="Reset your password",
              template_id="reset-v1",
              data={"token": token},
          )
      return {"status": "ok"}

Problems:
• Every forgot-password hit = a SendGrid API call in the critical path. SendGrid has a blip → your endpoint times out.
• No retry. If SendGrid 500s once, the user never gets the email. They hit forgot-password 4 more times; we do 4 more failed calls.
• Rate limits. SendGrid enforces per-second limits. If you fire 200 resets at once, you get throttled and some emails are silently dropped.
• Testing: unit tests HTTP-stub SendGrid; integration tests either skip email or accidentally spam real addresses.

✅ GOOD — decoupled, retryable, auditable:

  # web handler
  def forgot():
      user = User.find_by_email(request.json["email"])
      if user:
          token = generate_reset_token(user)
          enqueue("email.send", {
              "template": "password-reset",
              "to": user.email,
              "data": {"token": token},
              "idempotency_key": f"reset-{user.id}-{date.today()}",
          })                                          # < 1ms, returns immediately
      return {"status": "ok"}

  # email worker (separate process, its own scaling policy)
  def handle_email(msg):
      if db.email_sent.exists(msg["idempotency_key"]):
          return                                       # already sent today
      try:
          sendgrid.send(to=msg["to"], template_id=msg["template"],
                        data=msg["data"])
          db.email_sent.insert(msg["idempotency_key"])
      except RateLimited:
          raise                                        # let broker retry w/ backoff
      except TemplateNotFound:
          dead_letter(msg, reason="template missing")

WHY THIS WINS:
• Request latency: 1ms regardless of email provider health.
• Retries with exponential backoff are free — the broker handles them.
• Idempotency key (user+date) caps at one reset email per day per user — spam prevention built-in.
• Email worker has its OWN rate limit config. You scale workers based on SendGrid quota, not request volume.
• Template missing = DLQ, not silent drop. Ops get paged.
• Tests: use InMemory broker + mock SendGrid. Deterministic, fast.

ONE NUANCE — OUTBOX VS DIRECT ENQUEUE:
If the email depends on DB state (\"send receipt for order X\"), use the OUTBOX pattern: insert the email message in the same transaction as the order update, let the outbox worker ship it to the broker. Otherwise you risk emailing about an order that never actually committed.`,
    keywords: ["email", "notifications", "retry", "DLQ", "idempotency", "good-vs-bad", "production"],
  },
  {
    id: 116, level: "lead", topic: "patterns",
    q: "Real project: order fulfillment saga — ✅ Good vs ❌ Bad",
    a: `A multi-step order flow: reserve inventory → charge card → create shipment → send confirmation. Each step can fail. You need rollback semantics WITHOUT a distributed transaction.

❌ BAD — the tangled monolith:

  def place_order(order):
      try:
          inventory.reserve(order.items)
          payment.charge(order.total)
          shipment.create(order)
          email.send_confirmation(order)
      except Exception as e:
          # "I'll handle rollback here"
          try: inventory.release(order.items)         # might already be consumed
          except: pass
          try: payment.refund(order)                   # might be partially charged
          except: pass
          raise

Why this is a landmine:
• The rollback block is nested try/except — if refund fails, what about inventory?
• No durable record of WHERE the order failed. If the process crashes mid-rollback, the next retry starts fresh and may re-charge.
• You can't observe the flow. \"Order X is stuck\" = ssh into a box and grep logs.
• Adding a 5th step = touching every path including all rollback combinations. N² coupling.

✅ GOOD — explicit saga with event-driven choreography:

  # Each step is a separate service with its own queue.
  # They communicate via events on Kafka / RabbitMQ.

  OrderService.place_order:
      order = db.orders.insert(status="pending")
      publish("order.placed", {order_id, items, total})

  InventoryService listens to order.placed:
      try: reserve(order.items)
      except OutOfStock: publish("inventory.rejected", {order_id, reason})
      else: publish("inventory.reserved", {order_id, reservation_id})

  PaymentService listens to inventory.reserved:
      try: charge(order.total)
      except CardDeclined: publish("payment.failed", {order_id})
      else: publish("payment.completed", {order_id, charge_id})

  ShipmentService listens to payment.completed:
      shipment = create(order)
      publish("shipment.created", {order_id, tracking_id})

  # Compensations — triggered by reverse events
  InventoryService listens to payment.failed:
      release(reservation_id)

  PaymentService listens to shipment.failed (rare but possible):
      refund(charge_id)

WHY THIS SHAPE:
• Each service owns ONE responsibility and fails loudly in its own domain.
• The broker is the durable state machine — messages sit in queues until ack'd.
• Compensations are JUST MORE HANDLERS. No nested try/except gymnastics.
• \"Order X is stuck\": look at which event was last published for order X. Flow is reconstructible from the event log.
• Idempotent consumers (idempotency keys) mean retries/replays are safe.
• Adding a 5th step = add a new service + subscribe to the last event. Existing services don't change.

OBSERVABILITY NEEDED TO MAKE THIS WORK:
• Correlation ID (order_id) in every log line across services.
• Distributed tracing (OpenTelemetry) so you can see the saga as ONE trace.
• Alert on order_id that sat in \"pending\" > 10 min.
• DLQ monitor per service — a poison message in InventoryService blocks its whole stream.

ORCHESTRATION VS CHOREOGRAPHY:
What I sketched is choreography (each service listens and reacts). Orchestration uses a central SagaOrchestrator that CALLS each service and stores state. Pick based on:
• Choreography — easier for teams that already own their service. Harder to see \"the whole flow\" in one place.
• Orchestration — easier to debug and evolve. But the orchestrator is a critical dependency.

Most big tech stacks use orchestration (Uber's Cadence/Temporal, Netflix's Conductor). For smaller shops, choreography starts simpler.`,
    keywords: ["saga", "fulfillment", "choreography", "orchestration", "good-vs-bad", "production", "events"],
  },
];
