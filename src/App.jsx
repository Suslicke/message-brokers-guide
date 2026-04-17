import { useState, useMemo, useEffect, useCallback } from "react";
import {
  ChevronDown, ChevronRight, Check, X, Zap, AlertTriangle, Flame,
  Eye, EyeOff, RotateCcw, Filter, Target, Terminal, Download, Upload,
} from "lucide-react";
import { LEVELS, TOPICS, QUESTIONS } from "./data.js";

// ============== PERSISTENCE ==============
const STORAGE_KEY = "interview-prep:v1";

const defaultState = {
  completed: [],      // array of ids (serializable)
  bookmarked: [],
  revealed: [],
  confidence: {},     // { [id]: 'easy' | 'medium' | 'hard' }
  levelFilter: "all",
  topicFilter: "all",
  hideCompleted: false,
  blindMode: false,
  showIntro: true,
  lastSaved: null,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    // merge with defaults in case new fields appear in future versions
    return { ...defaultState, ...parsed };
  } catch (e) {
    console.warn("Failed to load saved state, starting fresh:", e);
    return defaultState;
  }
}

function saveState(state) {
  try {
    const payload = { ...state, lastSaved: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (e) {
    console.error("Failed to save state:", e);
    return false;
  }
}

// ============== APP ==============
export default function App() {
  // init once from localStorage
  const [initial] = useState(() => loadState());

  const [expandedId, setExpandedId] = useState(null);
  const [completed, setCompleted] = useState(new Set(initial.completed));
  const [bookmarked, setBookmarked] = useState(new Set(initial.bookmarked));
  const [revealed, setRevealed] = useState(new Set(initial.revealed));
  const [confidence, setConfidence] = useState(initial.confidence || {});
  const [levelFilter, setLevelFilter] = useState(initial.levelFilter);
  const [topicFilter, setTopicFilter] = useState(initial.topicFilter);
  const [hideCompleted, setHideCompleted] = useState(initial.hideCompleted);
  const [blindMode, setBlindMode] = useState(initial.blindMode);
  const [showIntro, setShowIntro] = useState(initial.showIntro);
  const [lastSaved, setLastSaved] = useState(initial.lastSaved);
  const [saveFlash, setSaveFlash] = useState(false);

  // Persist on any change (debounced via microtask)
  useEffect(() => {
    const ok = saveState({
      completed: [...completed],
      bookmarked: [...bookmarked],
      revealed: [...revealed],
      confidence,
      levelFilter,
      topicFilter,
      hideCompleted,
      blindMode,
      showIntro,
    });
    if (ok) {
      setLastSaved(new Date().toISOString());
      setSaveFlash(true);
      const t = setTimeout(() => setSaveFlash(false), 600);
      return () => clearTimeout(t);
    }
  }, [completed, bookmarked, revealed, confidence, levelFilter, topicFilter, hideCompleted, blindMode, showIntro]);

  // ============== DERIVED ==============
  const filtered = useMemo(() => {
    return QUESTIONS.filter((q) => {
      if (levelFilter !== "all" && q.level !== levelFilter) return false;
      if (topicFilter !== "all" && q.topic !== topicFilter) return false;
      if (hideCompleted && completed.has(q.id)) return false;
      return true;
    }).sort((a, b) => LEVELS[a.level].order - LEVELS[b.level].order || a.id - b.id);
  }, [levelFilter, topicFilter, hideCompleted, completed]);

  const stats = useMemo(() => {
    const total = QUESTIONS.length;
    const done = completed.size;
    const byLevel = {};
    Object.keys(LEVELS).forEach((l) => {
      const lvlQs = QUESTIONS.filter((q) => q.level === l);
      byLevel[l] = {
        total: lvlQs.length,
        done: lvlQs.filter((q) => completed.has(q.id)).length,
      };
    });
    const confCount = { easy: 0, medium: 0, hard: 0 };
    Object.values(confidence).forEach((c) => (confCount[c] = (confCount[c] || 0) + 1));
    return { total, done, byLevel, confCount };
  }, [completed, confidence]);

  // ============== ACTIONS ==============
  const toggleComplete = useCallback((id) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((id) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleReveal = useCallback((id) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const setConf = useCallback((id, level) => {
    setConfidence((prev) => ({ ...prev, [id]: level }));
  }, []);

  const resetAll = () => {
    if (window.confirm("Reset all progress? This will clear checks, bookmarks, and ratings.")) {
      setCompleted(new Set());
      setBookmarked(new Set());
      setRevealed(new Set());
      setConfidence({});
    }
  };

  // EXPORT
  const exportProgress = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      completed: [...completed],
      bookmarked: [...bookmarked],
      revealed: [...revealed],
      confidence,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-prep-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // IMPORT
  const importProgress = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!window.confirm("Import this progress? Your current progress will be replaced.")) return;
        setCompleted(new Set(data.completed || []));
        setBookmarked(new Set(data.bookmarked || []));
        setRevealed(new Set(data.revealed || []));
        setConfidence(data.confidence || {});
      } catch (err) {
        alert("Failed to import: " + err.message);
      }
    };
    reader.readAsText(file);
    // reset input so same file can be re-imported
    e.target.value = "";
  };

  const progressPct = Math.round((stats.done / stats.total) * 100);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* HEADER */}
        <header style={{ borderBottom: "1px solid #30363d", paddingBottom: "20px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
            <Terminal size={20} color="#58a6ff" />
            <span style={{ color: "#7d8590", fontSize: "13px" }}>~/interview-prep/senior-backend $</span>
            <span className="cursor" style={{ color: "#58a6ff" }}>▊</span>
            <div style={{
              marginLeft: "auto",
              fontSize: "11px",
              color: saveFlash ? "#7dd3a0" : "#484f58",
              transition: "color 0.3s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <span style={{
                width: "6px", height: "6px",
                borderRadius: "50%",
                background: saveFlash ? "#7dd3a0" : "#484f58",
                transition: "background 0.3s",
              }} />
              {lastSaved ? `saved · ${new Date(lastSaved).toLocaleTimeString()}` : "unsaved"}
            </div>
          </div>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 700,
            margin: "0 0 8px 0",
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #58a6ff 0%, #e84855 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            MESSAGE BROKERS // INTERVIEW DRILL
          </h1>
          <div style={{ color: "#7d8590", fontSize: "14px", lineHeight: 1.6 }}>
            Celery · RabbitMQ · Kafka · Patterns — from trainee to lead-level, plus the tricky traps.
            <br />
            <span style={{ color: "#e84855" }}>target:</span> senior backend ·{" "}
            <span style={{ color: "#e84855" }}>progress:</span> auto-saved in your browser ·{" "}
            <span style={{ color: "#7dd3a0" }}>good luck.</span>
          </div>
        </header>

        {/* INTRO */}
        {showIntro && (
          <div style={{
            background: "linear-gradient(135deg, #161b22 0%, #1c2128 100%)",
            border: "1px solid #30363d",
            borderLeft: "3px solid #58a6ff",
            padding: "16px 20px",
            borderRadius: "6px",
            marginBottom: "20px",
            fontSize: "13px",
            position: "relative",
          }}>
            <button
              onClick={() => setShowIntro(false)}
              style={{
                position: "absolute", top: "12px", right: "12px",
                background: "none", border: "none", color: "#7d8590",
                cursor: "pointer", padding: "4px",
              }}
              aria-label="Close intro"
            ><X size={16} /></button>
            <div style={{ color: "#58a6ff", fontWeight: 600, marginBottom: "8px" }}>HOW TO USE THIS</div>
            <div style={{ color: "#c9d1d9", lineHeight: 1.7 }}>
              <strong style={{ color: "#7dd3a0" }}>1.</strong> Toggle <strong>BLIND MODE</strong> to hide answers — force yourself to think first.<br />
              <strong style={{ color: "#7dd3a0" }}>2.</strong> After each question, rate your confidence (easy / medium / hard) — focus on <span style={{ color: "#e84855" }}>hard</span> on the last review pass.<br />
              <strong style={{ color: "#7dd3a0" }}>3.</strong> Bookmark <span style={{ color: "#d4a574" }}>⚑</span> the ones you want to revisit 1 hour before the interview.<br />
              <strong style={{ color: "#7dd3a0" }}>4.</strong> <span style={{ color: "#e84855" }}>Tricky</span> section is last — these are the gotchas seniors are actually tested on.<br />
              <strong style={{ color: "#7dd3a0" }}>5.</strong> Your progress is saved automatically. Export it as JSON for backup / syncing across devices.
            </div>
          </div>
        )}

        {/* STATS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}>
          <StatCard label="TOTAL PROGRESS" value={`${stats.done}/${stats.total}`} accent="#58a6ff" sub={`${progressPct}% complete`} />
          <StatCard label="BOOKMARKED" value={bookmarked.size} accent="#d4a574" sub="for quick review" icon={<Flame size={14} />} />
          <StatCard label="CONFIDENT" value={stats.confCount.easy || 0} accent="#7dd3a0" sub="got this cold" icon={<Check size={14} />} />
          <StatCard label="NEEDS WORK" value={stats.confCount.hard || 0} accent="#e84855" sub="revisit!" icon={<AlertTriangle size={14} />} />
        </div>

        {/* PROGRESS BY LEVEL */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#7d8590", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            <span>by level</span>
            <span>done / total</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {Object.entries(LEVELS).map(([key, lvl]) => {
              const s = stats.byLevel[key];
              const pct = s.total ? (s.done / s.total) * 100 : 0;
              return (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px" }}>
                  <div style={{ width: "70px", color: lvl.color, fontWeight: 600, letterSpacing: "0.05em" }}>{lvl.label}</div>
                  <div style={{ flex: 1, height: "8px", background: "#161b22", borderRadius: "4px", overflow: "hidden", border: "1px solid #30363d" }}>
                    <div style={{
                      width: `${pct}%`, height: "100%",
                      background: `linear-gradient(90deg, ${lvl.color}aa, ${lvl.color})`,
                      transition: "width 0.3s",
                    }} />
                  </div>
                  <div style={{ width: "50px", textAlign: "right", color: "#c9d1d9", fontVariantNumeric: "tabular-nums" }}>{s.done}/{s.total}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CONTROLS */}
        <div style={{
          background: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "6px",
          padding: "12px 16px",
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#7d8590", fontSize: "12px" }}>
            <Filter size={14} />
            <span style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>filter</span>
          </div>

          <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} style={selectStyle}>
            <option value="all">all levels</option>
            {Object.entries(LEVELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>

          <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)} style={selectStyle}>
            <option value="all">all topics</option>
            {Object.entries(TOPICS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>

          <label style={toggleLabelStyle}>
            <input type="checkbox" checked={hideCompleted} onChange={(e) => setHideCompleted(e.target.checked)} />
            hide done
          </label>

          <label style={{ ...toggleLabelStyle, color: blindMode ? "#e84855" : "#7d8590" }}>
            <input type="checkbox" checked={blindMode} onChange={(e) => setBlindMode(e.target.checked)} />
            {blindMode ? <EyeOff size={14} /> : <Eye size={14} />} blind mode
          </label>

          <div style={{ marginLeft: "auto", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button onClick={exportProgress} style={btnStyle} title="Export progress as JSON">
              <Download size={12} /> export
            </button>
            <label style={{ ...btnStyle, cursor: "pointer" }} title="Import progress from JSON file">
              <Upload size={12} /> import
              <input type="file" accept="application/json" onChange={importProgress} style={{ display: "none" }} />
            </label>
            <button onClick={resetAll} style={{ ...btnStyle, color: "#e84855", borderColor: "#e8485544" }}>
              <RotateCcw size={12} /> reset
            </button>
          </div>
        </div>

        {/* QUESTIONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.length === 0 && (
            <div style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#7d8590",
              background: "#161b22",
              border: "1px dashed #30363d",
              borderRadius: "6px",
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>∅</div>
              No questions match these filters.
            </div>
          )}

          {filtered.map((q, idx) => (
            <QuestionCard
              key={q.id}
              q={q}
              idx={idx}
              isDone={completed.has(q.id)}
              isBookmarked={bookmarked.has(q.id)}
              isExpanded={expandedId === q.id}
              isRevealed={revealed.has(q.id)}
              conf={confidence[q.id]}
              blindMode={blindMode}
              onToggleExpand={() => setExpandedId(expandedId === q.id ? null : q.id)}
              onToggleComplete={() => toggleComplete(q.id)}
              onToggleBookmark={() => toggleBookmark(q.id)}
              onToggleReveal={() => toggleReveal(q.id)}
              onSetConf={(c) => setConf(q.id, c)}
            />
          ))}
        </div>

        {/* FINAL TIPS */}
        <div style={{
          marginTop: "32px",
          padding: "20px",
          background: "linear-gradient(135deg, #161b22 0%, #1c2128 100%)",
          border: "1px solid #30363d",
          borderLeft: "3px solid #e84855",
          borderRadius: "6px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Target size={16} color="#e84855" />
            <span style={{ color: "#e84855", fontWeight: 700, letterSpacing: "0.1em", fontSize: "13px" }}>
              FINAL PRE-INTERVIEW CHECKLIST
            </span>
          </div>
          <ul style={{ color: "#c9d1d9", fontSize: "13px", lineHeight: 1.8, margin: 0, paddingLeft: "20px" }}>
            <li>Be ready to draw the architecture on a whiteboard — producer, broker, consumer, DLQ, retry flow.</li>
            <li>For any answer, end with <strong style={{ color: "#7dd3a0" }}>trade-offs</strong>. "It depends" is fine if you explain what it depends on.</li>
            <li>Prepare 1–2 stories from your own experience: an incident, a tough debug session, a design decision.</li>
            <li>If you don't know — say "I don't know, but I'd start by…" and reason out loud. Interviewers love that.</li>
            <li>Questions for them: how do you handle poison messages? what's your DLQ policy? what's your biggest event-driven pain point?</li>
            <li style={{ color: "#e84855" }}>Sleep. Don't cram for 12 hours. 7h of sleep &gt; 2 more questions memorized.</li>
          </ul>
        </div>

        <footer style={{
          marginTop: "24px",
          padding: "16px 0",
          borderTop: "1px solid #21262d",
          color: "#484f58",
          fontSize: "11px",
          textAlign: "center",
        }}>
          {QUESTIONS.length} questions · {Object.keys(LEVELS).length} levels · {Object.keys(TOPICS).length} topics
          <br />
          <span className="cursor">▊</span> break a leg on Monday.
        </footer>
      </div>
    </div>
  );
}

// ============== QUESTION CARD ==============
function QuestionCard({
  q, idx, isDone, isBookmarked, isExpanded, isRevealed, conf, blindMode,
  onToggleExpand, onToggleComplete, onToggleBookmark, onToggleReveal, onSetConf,
}) {
  const lvl = LEVELS[q.level];
  const showAnswer = !blindMode || isRevealed;

  return (
    <div
      className="card-enter"
      style={{
        background: "#161b22",
        border: `1px solid ${isExpanded ? lvl.color + "66" : "#30363d"}`,
        borderLeft: `3px solid ${lvl.color}`,
        borderRadius: "6px",
        overflow: "hidden",
        opacity: isDone ? 0.6 : 1,
        transition: "all 0.2s",
      }}
    >
      <div
        onClick={onToggleExpand}
        style={{
          padding: "14px 16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          userSelect: "none",
        }}
      >
        <div style={{ color: "#7d8590", fontSize: "11px", paddingTop: "3px", fontVariantNumeric: "tabular-nums", minWidth: "32px" }}>
          #{String(idx + 1).padStart(3, "0")}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
          style={{
            background: isDone ? lvl.color : "transparent",
            border: `1.5px solid ${isDone ? lvl.color : "#484f58"}`,
            borderRadius: "3px",
            width: "18px", height: "18px",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 0,
            marginTop: "2px",
            flexShrink: 0,
          }}
          aria-label={isDone ? "Mark as not done" : "Mark as done"}
        >
          {isDone && <Check size={12} color="#0d1117" strokeWidth={3} />}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center", marginBottom: "6px" }}>
            <span style={{
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
              color: lvl.color, padding: "2px 6px",
              border: `1px solid ${lvl.color}55`,
              borderRadius: "3px",
              background: `${lvl.color}15`,
            }}>{lvl.label}</span>
            <span style={{
              fontSize: "10px", color: "#7d8590",
              padding: "2px 6px",
              border: "1px solid #30363d",
              borderRadius: "3px",
            }}>{TOPICS[q.topic]}</span>
            {q.level === "tricky" && (
              <span style={{ fontSize: "10px", color: "#e84855", display: "flex", alignItems: "center", gap: "3px" }}>
                <Zap size={10} /> gotcha
              </span>
            )}
            {conf && (
              <span style={{
                fontSize: "10px",
                color: conf === "easy" ? "#7dd3a0" : conf === "medium" ? "#d4a574" : "#e84855",
                padding: "2px 6px",
                borderRadius: "3px",
                background: "#0d1117",
              }}>{conf}</span>
            )}
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "15px",
            fontWeight: 500,
            color: "#e6edf3",
            lineHeight: 1.45,
            textDecoration: isDone ? "line-through" : "none",
            textDecorationColor: "#484f58",
          }}>
            {q.q}
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
          style={{
            background: "none", border: "none",
            color: isBookmarked ? "#d4a574" : "#484f58",
            cursor: "pointer", padding: "2px",
            fontSize: "18px",
            lineHeight: 1,
          }}
          title="bookmark"
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
        >
          ⚑
        </button>

        <div style={{ color: "#7d8590", paddingTop: "4px" }}>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </div>

      {isExpanded && (
        <div style={{ padding: "0 16px 16px 62px", borderTop: "1px solid #21262d" }}>
          {!showAnswer ? (
            <div style={{ padding: "24px 0", textAlign: "center" }}>
              <div style={{ color: "#7d8590", fontSize: "13px", marginBottom: "12px" }}>
                💭 Think about your answer first, then reveal.
              </div>
              <button
                onClick={onToggleReveal}
                style={{
                  background: "transparent",
                  border: `1px solid ${lvl.color}`,
                  color: lvl.color,
                  padding: "8px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                reveal answer
              </button>
            </div>
          ) : (
            <>
              <div style={{
                whiteSpace: "pre-wrap",
                fontSize: "13.5px",
                lineHeight: 1.75,
                color: "#c9d1d9",
                padding: "12px 0",
              }}>
                {q.a}
              </div>

              {q.keywords && (
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: "6px",
                  marginTop: "10px", paddingTop: "10px",
                  borderTop: "1px dashed #30363d",
                }}>
                  {q.keywords.map((kw) => (
                    <span key={kw} style={{
                      fontSize: "10px",
                      color: "#58a6ff",
                      padding: "2px 8px",
                      background: "#0d1117",
                      border: "1px solid #1f6feb33",
                      borderRadius: "10px",
                    }}>#{kw}</span>
                  ))}
                </div>
              )}

              <div style={{
                marginTop: "14px",
                paddingTop: "14px",
                borderTop: "1px solid #21262d",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}>
                <span style={{ fontSize: "11px", color: "#7d8590", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  how did it go?
                </span>
                {["easy", "medium", "hard"].map((c) => {
                  const cColor = c === "easy" ? "#7dd3a0" : c === "medium" ? "#d4a574" : "#e84855";
                  const active = conf === c;
                  return (
                    <button
                      key={c}
                      onClick={() => onSetConf(c)}
                      style={{
                        background: active ? cColor + "20" : "transparent",
                        border: `1px solid ${active ? cColor : "#30363d"}`,
                        color: active ? cColor : "#7d8590",
                        padding: "4px 12px",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: "11px",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
                {blindMode && (
                  <button
                    onClick={onToggleReveal}
                    style={{
                      marginLeft: "auto",
                      background: "transparent",
                      border: "none",
                      color: "#7d8590",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <EyeOff size={12} /> hide again
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============== HELPERS ==============
const selectStyle = {
  background: "#0d1117",
  color: "#c9d1d9",
  border: "1px solid #30363d",
  borderRadius: "4px",
  padding: "5px 8px",
  fontFamily: "inherit",
  fontSize: "12px",
  cursor: "pointer",
};

const toggleLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: "#7d8590",
  fontSize: "12px",
  cursor: "pointer",
  userSelect: "none",
};

const btnStyle = {
  background: "transparent",
  border: "1px solid #30363d",
  color: "#7d8590",
  padding: "5px 10px",
  borderRadius: "4px",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "11px",
  display: "flex",
  alignItems: "center",
  gap: "4px",
};

function StatCard({ label, value, accent, sub, icon }) {
  return (
    <div style={{
      background: "#161b22",
      border: "1px solid #30363d",
      borderTop: `2px solid ${accent}`,
      borderRadius: "4px",
      padding: "12px 14px",
    }}>
      <div style={{
        fontSize: "10px",
        color: "#7d8590",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginBottom: "6px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}>
        {icon}{label}
      </div>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "28px",
        fontWeight: 700,
        color: accent,
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
      }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: "11px", color: "#7d8590", marginTop: "4px" }}>{sub}</div>}
    </div>
  );
}
