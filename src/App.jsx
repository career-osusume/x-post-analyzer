import { useState, useRef } from "react";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=Noto+Sans+JP:wght@300;400;500;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #08080e; --surface: #0f0f18; --surface2: #161622;
    --border: #252535; --border2: #2e2e42;
    --accent: #7c6fff; --accent2: #ff6b8a; --accent3: #3de8c8; --accent4: #f5a623;
    --text: #eaeaf5; --text-sub: #555568;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Noto Sans JP', sans-serif; min-height: 100vh; overflow-x: hidden; }
  body::before {
    content: ''; position: fixed; top: -300px; left: -200px; width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(124,111,255,0.07) 0%, transparent 65%);
    pointer-events: none; animation: orb 18s ease-in-out infinite alternate;
  }
  body::after {
    content: ''; position: fixed; bottom: -200px; right: -150px; width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(61,232,200,0.05) 0%, transparent 65%);
    pointer-events: none; animation: orb 22s ease-in-out infinite alternate-reverse;
  }
  @keyframes orb { from { transform: translate(0,0) scale(1); } to { transform: translate(50px,40px) scale(1.1); } }

  .app { max-width: 920px; margin: 0 auto; padding: 52px 24px 100px; }

  .header { text-align: center; margin-bottom: 60px; }
  .eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500;
    letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent3); opacity: 0.75; margin-bottom: 18px;
  }
  .eyebrow::before, .eyebrow::after { content: ''; display: block; width: 28px; height: 1px; background: var(--accent3); opacity: 0.4; }
  h1 {
    font-family: 'Syne', sans-serif; font-size: clamp(30px, 5vw, 54px); font-weight: 800; line-height: 1.05;
    background: linear-gradient(140deg, #fff 20%, var(--accent) 80%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 14px;
  }
  .subtitle { font-size: 14px; color: var(--text-sub); line-height: 1.8; max-width: 480px; margin: 0 auto; font-weight: 300; }

  .steps { display: flex; border-radius: 14px; overflow: hidden; border: 1px solid var(--border); margin-bottom: 28px; }
  .step {
    flex: 1; padding: 13px 12px; text-align: center; font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
    color: var(--text-sub); background: var(--surface); border-right: 1px solid var(--border); transition: all 0.3s; letter-spacing: 0.03em;
  }
  .step:last-child { border-right: none; }
  .step .sn { display: block; font-family: 'DM Mono', monospace; font-size: 9px; opacity: 0.5; margin-bottom: 3px; letter-spacing: 0.15em; }
  .step.done { color: var(--accent3); background: rgba(61,232,200,0.05); }
  .step.active { color: var(--accent); background: rgba(124,111,255,0.09); }

  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 28px; margin-bottom: 18px; transition: border-color 0.3s; }
  .card:hover { border-color: var(--border2); }
  .card-ey {
    font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--accent); display: flex; align-items: center; gap: 7px; margin-bottom: 12px;
  }
  .card-ey::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px var(--accent); }
  .card-title { font-family: 'Syne', sans-serif; font-size: 19px; font-weight: 700; margin-bottom: 20px; }

  .input-row { display: flex; gap: 10px; }
  .txt-in {
    flex: 1; background: var(--surface2); border: 1px solid var(--border); border-radius: 11px; padding: 14px 18px;
    color: var(--text); font-family: 'DM Mono', monospace; font-size: 14px; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .txt-in:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,111,255,0.13); }
  .txt-in::placeholder { color: #2e2e42; }

  .btn { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; border: none; border-radius: 11px; padding: 14px 22px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .btn-p { background: var(--accent); color: #fff; box-shadow: 0 4px 22px rgba(124,111,255,0.32); }
  .btn-p:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(124,111,255,0.42); }
  .btn-g { background: var(--surface2); color: var(--text); border: 1px solid var(--border2); }
  .btn-g:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
  .btn-full { width: 100%; padding: 18px; background: linear-gradient(135deg, var(--accent) 0%, #a855f7 100%); color: #fff; font-size: 15px; box-shadow: 0 6px 30px rgba(124,111,255,0.35); }
  .btn-full:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 42px rgba(124,111,255,0.46); }

  .profile-strip { display: flex; align-items: center; gap: 14px; background: var(--surface2); border: 1px solid var(--border2); border-radius: 12px; padding: 14px 18px; margin-top: 16px; }
  .ava { width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; color: #fff; }
  .ava-info { flex: 1; min-width: 0; }
  .ava-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; }
  .ava-handle { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text-sub); margin-top: 2px; }
  .badge { font-family: 'DM Mono', monospace; font-size: 10px; padding: 4px 10px; border-radius: 20px; border: 1px solid; white-space: nowrap; }
  .badge-a { color: var(--accent); border-color: rgba(124,111,255,0.35); background: rgba(124,111,255,0.1); }
  .badge-warn { color: var(--accent4); border-color: rgba(245,166,35,0.35); background: rgba(245,166,35,0.08); }

  /* data source indicator */
  .data-source {
    display: flex; align-items: flex-start; gap: 10px;
    background: var(--surface2); border: 1px solid var(--border2); border-radius: 10px;
    padding: 12px 14px; margin-top: 14px; font-size: 12px; line-height: 1.65; color: #888;
  }
  .data-source-icon { font-size: 15px; flex-shrink: 0; margin-top: 1px; }
  .data-source strong { color: var(--text); display: block; margin-bottom: 2px; font-size: 13px; }
  .source-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
  .source-chip { font-family: 'DM Mono', monospace; font-size: 10px; padding: 2px 8px; border-radius: 4px; background: rgba(61,232,200,0.08); border: 1px solid rgba(61,232,200,0.2); color: var(--accent3); }

  .persona-hero { background: linear-gradient(135deg, rgba(124,111,255,0.07) 0%, rgba(61,232,200,0.04) 100%); border: 1px solid rgba(124,111,255,0.2); border-radius: 14px; padding: 22px; margin-bottom: 22px; }
  .persona-lbl { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent3); margin-bottom: 10px; }
  .persona-txt { font-size: 14px; line-height: 1.85; color: var(--text); }

  .id-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 12px; margin-bottom: 22px; }
  .id-item { background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; }
  .id-lbl { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent); margin-bottom: 6px; }
  .id-val { font-size: 13px; font-weight: 500; line-height: 1.5; }

  .stat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 22px; }
  .stat-item { background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 16px; text-align: center; }
  .stat-val { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; background: linear-gradient(135deg, var(--accent3), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .stat-lbl { font-size: 11px; color: var(--text-sub); margin-top: 4px; font-weight: 300; }

  .cat-section { margin-bottom: 22px; }
  .cat-bars { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
  .cat-row { display: flex; align-items: center; gap: 10px; }
  .cat-lbl { font-size: 12px; color: #888; width: 140px; flex-shrink: 0; font-weight: 300; }
  .cat-track { flex: 1; height: 6px; background: var(--border); border-radius: 99px; overflow: hidden; }
  .cat-fill { height: 100%; border-radius: 99px; }
  .cat-pct { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-sub); width: 36px; text-align: right; }

  .sb { margin-bottom: 20px; }
  .sb-lbl { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.17em; text-transform: uppercase; color: var(--accent); margin-bottom: 10px; padding-bottom: 7px; border-bottom: 1px solid var(--border); }
  .blist { list-style: none; display: flex; flex-direction: column; gap: 7px; }
  .blist li { font-size: 13px; color: #888; padding-left: 16px; position: relative; line-height: 1.65; font-weight: 300; }
  .blist li::before { content: '→'; position: absolute; left: 0; color: var(--accent3); font-size: 11px; top: 1px; }
  .tags { display: flex; flex-wrap: wrap; gap: 7px; }
  .tag { font-family: 'DM Mono', monospace; font-size: 11px; padding: 4px 11px; border-radius: 20px; border: 1px solid; }
  .tv { color: var(--accent); border-color: rgba(124,111,255,0.3); background: rgba(124,111,255,0.08); }
  .tg { color: var(--accent3); border-color: rgba(61,232,200,0.3); background: rgba(61,232,200,0.07); }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 540px) { .two-col { grid-template-columns: 1fr; } }

  .dir-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; margin-top: 16px; }
  @media (max-width: 520px) { .dir-grid { grid-template-columns: 1fr; } }
  .dir-card { background: var(--surface2); border: 2px solid var(--border); border-radius: 13px; padding: 13px 15px; cursor: pointer; transition: all 0.18s; display: flex; align-items: flex-start; gap: 11px; user-select: none; }
  .dir-card:hover { border-color: rgba(124,111,255,0.4); background: rgba(124,111,255,0.04); }
  .dir-card.active { border-color: var(--accent); background: rgba(124,111,255,0.1); box-shadow: 0 0 0 3px rgba(124,111,255,0.1); }
  .dir-chk { width: 19px; height: 19px; border: 2px solid var(--border2); border-radius: 6px; flex-shrink: 0; margin-top: 1px; display: flex; align-items: center; justify-content: center; font-size: 11px; transition: all 0.18s; }
  .dir-card.active .dir-chk { background: var(--accent); border-color: var(--accent); color: #fff; }
  .dir-em { font-size: 19px; flex-shrink: 0; }
  .dir-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; margin-bottom: 3px; }
  .dir-desc { font-size: 11px; color: var(--text-sub); line-height: 1.5; font-weight: 300; }

  .cnt-row { display: flex; align-items: center; gap: 12px; margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--border); }
  .cnt-lbl { font-size: 13px; color: #777; flex: 1; }
  .cnt-btns { display: flex; gap: 6px; }
  .cnt-btn { width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface2); color: var(--text-sub); font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.18s; display: flex; align-items: center; justify-content: center; }
  .cnt-btn.on { background: rgba(124,111,255,0.15); border-color: var(--accent); color: var(--accent); }
  .cnt-btn:hover:not(.on) { border-color: rgba(124,111,255,0.35); }

  .post-card { background: var(--surface2); border: 1px solid var(--border); border-radius: 15px; padding: 20px; margin-bottom: 13px; transition: border-color 0.2s; }
  .post-card:hover { border-color: var(--border2); }
  .post-head { display: flex; align-items: center; gap: 8px; margin-bottom: 13px; flex-wrap: wrap; }
  .post-num { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; color: var(--accent); background: rgba(124,111,255,0.12); border: 1px solid rgba(124,111,255,0.25); border-radius: 5px; padding: 3px 8px; }
  .post-dtag { font-size: 10px; color: var(--accent3); background: rgba(61,232,200,0.08); border: 1px solid rgba(61,232,200,0.22); border-radius: 5px; padding: 3px 8px; font-family: 'DM Mono', monospace; }
  .post-body { font-size: 15px; line-height: 1.8; white-space: pre-wrap; word-break: break-word; }
  .post-why { font-size: 12px; color: var(--accent3); margin-top: 11px; line-height: 1.65; font-weight: 300; padding: 8px 12px; background: rgba(61,232,200,0.06); border-radius: 8px; border-left: 2px solid rgba(61,232,200,0.3); }
  .post-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 13px; padding-top: 11px; border-top: 1px solid var(--border); }
  .post-chr { font-family: 'DM Mono', monospace; font-size: 11px; color: #333348; }
  .copy-btn { background: none; border: 1px solid var(--border2); border-radius: 8px; color: var(--text-sub); font-size: 12px; padding: 5px 12px; cursor: pointer; transition: all 0.18s; font-family: 'DM Mono', monospace; }
  .copy-btn:hover { border-color: var(--accent3); color: var(--accent3); }
  .copy-btn.cp { border-color: var(--accent3); color: var(--accent3); }

  /* loading steps */
  .loading { display: flex; flex-direction: column; align-items: center; gap: 18px; padding: 36px; text-align: center; }
  .spin { width: 38px; height: 38px; border: 2px solid var(--border2); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.75s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .load-steps { display: flex; flex-direction: column; gap: 6px; text-align: left; width: 100%; max-width: 360px; }
  .load-step { font-size: 12px; padding: 6px 12px; border-radius: 6px; background: var(--surface2); border: 1px solid var(--border); color: var(--text-sub); display: flex; align-items: center; gap: 8px; font-family: 'DM Mono', monospace; }
  .load-step.done { color: var(--accent3); border-color: rgba(61,232,200,0.25); }
  .load-step.running { color: var(--accent); border-color: rgba(124,111,255,0.3); background: rgba(124,111,255,0.06); }
  .load-step .ls-icon { font-size: 13px; width: 16px; text-align: center; flex-shrink: 0; }

  .err { background: rgba(255,107,138,0.07); border: 1px solid rgba(255,107,138,0.25); border-radius: 10px; padding: 13px 15px; color: #ff8fab; font-size: 13px; line-height: 1.6; margin-top: 14px; }
  .info { background: rgba(61,232,200,0.06); border: 1px solid rgba(61,232,200,0.22); border-radius: 10px; padding: 11px 15px; font-size: 13px; color: var(--accent3); line-height: 1.65; margin-top: 14px; }
  .warn { background: rgba(245,166,35,0.06); border: 1px solid rgba(245,166,35,0.25); border-radius: 10px; padding: 11px 15px; font-size: 13px; color: var(--accent4); line-height: 1.65; margin-top: 14px; }
  .divider { border: none; border-top: 1px solid var(--border); margin: 18px 0; }
`;

/* ─────────────────────────────────────────────
   10 DIRECTIONS
───────────────────────────────────────────── */
const DIRECTIONS = [
  { id: "insight",    emoji: "💡", name: "知見・学び",        desc: "業界経験や読書から得た本質的な気づき" },
  { id: "story",      emoji: "📖", name: "ストーリー・体験",  desc: "失敗・成功・転機のリアルなエピソード" },
  { id: "opinion",    emoji: "🔥", name: "意見・持論",        desc: "業界トレンドや社会現象への独自の視点" },
  { id: "tip",        emoji: "⚡", name: "Tip・テクニック",   desc: "すぐ使える実践的なノウハウの具体提示" },
  { id: "question",   emoji: "🤔", name: "問いかけ・議論",    desc: "フォロワーを巻き込む問いや投票・議題" },
  { id: "number",     emoji: "📊", name: "数字・データ提示",  desc: "驚きのデータや統計で注目を引く投稿" },
  { id: "behind",     emoji: "🎬", name: "舞台裏・リアル",    desc: "仕事の現場・日常のオフレコ感ある共有" },
  { id: "recommend",  emoji: "📌", name: "おすすめ・紹介",    desc: "本・ツール・人・サービスの推薦" },
  { id: "future",     emoji: "🔭", name: "未来予測・展望",    desc: "業界・社会の変化に関する中長期の見方" },
  { id: "selfgrowth", emoji: "🌱", name: "自己成長・内省",    desc: "自分の変化・価値観の更新・反省の共有" },
];

const BAR_COLORS = [
  "linear-gradient(90deg,#7c6fff,#a78bfa)",
  "linear-gradient(90deg,#3de8c8,#06b6d4)",
  "linear-gradient(90deg,#ff6b8a,#f43f5e)",
  "linear-gradient(90deg,#f5a623,#fb923c)",
  "linear-gradient(90deg,#a78bfa,#ec4899)",
];

/* ─────────────────────────────────────────────
   API — web_search enabled call
   Returns { text, sources }
───────────────────────────────────────────── */
async function claudeWithSearch(userMessage, systemPrompt, maxTokens = 2000) {
  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    system: systemPrompt,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
    messages: [{ role: "user", content: userMessage }],
  };

  const res = await fetch("/api/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "API error");

  // Collect text blocks and citation sources
  let text = "";
  const sources = [];
  for (const block of data.content) {
    if (block.type === "text") text += block.text;
    if (block.type === "tool_result") {
      try {
        const r = JSON.parse(block.content);
        if (r?.results) r.results.forEach(s => { if (s.url) sources.push(s.url); });
      } catch {}
    }
  }
  return { text, sources };
}

async function claudePlain(messages, systemPrompt, maxTokens = 2000) {
  const res = await fetch("/api/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: maxTokens, system: systemPrompt, messages }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "API error");
  return data.content.map(b => b.text || "").join("");
}

function extractUsername(raw) {
  if (!raw) return null;
  raw = raw.trim();
  const m = raw.match(/(?:x\.com|twitter\.com)\/([A-Za-z0-9_]{1,15})/i);
  if (m) return m[1];
  const clean = raw.replace(/^@/, "");
  if (/^[A-Za-z0-9_]{1,15}$/.test(clean)) return clean;
  return null;
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const LOAD_STEPS = [
  { id: "analyze", label: "Xプロフィールと投稿を調査・分析" },
];

export default function App() {
  const [url, setUrl]           = useState("");
  const [bioText, setBio]       = useState("");
  const [postsText, setPosts2]  = useState("");
  const [hashtagText, setHash]  = useState("");
  const [step, setStep]         = useState(1);
  const [loadSteps, setLS]      = useState([]);   // { id, status: idle|running|done }
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [profile, setProfile]   = useState(null);
  const [analysis, setAna]      = useState(null);
  const [dataSources, setDS]    = useState([]);
  const [dirs, setDirs]         = useState([]);
  const [count, setCount]       = useState(3);
  const [posts, setPosts]       = useState([]);
  const [generating, setGen]    = useState(false);
  const [copied, setCopied]     = useState({});
  const ref = useRef(null);

  const username = extractUsername(url);

  function setLSStatus(id, status) {
    setLS(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  }

  /* ── STEP 1: ANALYZE ── */
  async function analyzeProfile() {
    if (!username) { setError("有効なXのプロフィールURLまたはユーザー名を入力してください"); return; }
    if (!bioText.trim() && !postsText.trim()) { setError("プロフィールbioまたは投稿内容を入力してください"); return; }
    setError(""); setLoading(true);
    setProfile(null); setAna(null); setPosts([]); setDirs([]); setDS([]);
    setLS(LOAD_STEPS.map(s => ({ ...s, status: "idle" })));

    try {
      setLSStatus("analyze", "running");

      const analysisResult = await claudePlain(
        [{ role: "user", content: `以下のXプロフィール情報と投稿を分析してください。\n@${username}\n【bio】${bioText}\n【投稿】${postsText}\n【ハッシュタグ】${hashtagText}` }],
        `Gemini の google検索機能を使って @${username} のXプロフィールと投稿を調査し分析してください。

【重要】displayName は必ずユーザーが入力したbioや投稿から読み取れる実際の名前を使用してください。URLのユーザー名（@以降）をそのまま使わないでください。bioに名前が含まれている場合はその名前を使用してください。

以下のJSON形式のみで返答してください。前置き・後置き・コードブロック記号は一切不要です。

{
  "displayName": "実際の表示名（bioや投稿から読み取れる名前。@以降のユーザー名は使用しないこと）",
  "jobTitle": "実際のプロフィールから判明した役職・職業（不明な場合は推測と明記）",
  "companyType": "所属組織の種別・規模（判明した情報 + 必要なら推測）",
  "industry": "業界（実際の投稿内容から判断）",
  "careerStage": "キャリアステージ（bioや投稿内容から判断）",
  "personaSummary": "実際のプロフィール・投稿内容に基づく人物像の詳細説明（250字以内）。どんな発信をしているか・フォロワー層・発信の目的まで実データに基づいて記述",
  "postCategoryRatio": [
    { "label": "カテゴリ名", "pct": 数値 }
  ],
  "avgEngagement": "投稿から推測されるエンゲージメント傾向",
  "bestPostingTime": "投稿傾向から推測される最適時間帯",
  "avgLength": "実際の投稿から見た平均的な文字数",
  "toneKeywords": ["実際の文体から抽出したキーワード×5"],
  "styleNotes": [
    "実際の投稿から観察した改行の癖",
    "実際の投稿から観察した絵文字の使い方",
    "実際の投稿から観察した語尾・文末の傾向"
  ],
  "buzzPatterns": [
    "実際にエンゲージメントが高かった投稿の型（具体例付き）",
    "型2",
    "型3"
  ],
  "strongTopics": ["実際によく投稿しているトピック×4"],
  "doList": ["実際の投稿から見えた効果的な要素×4"],
  "dontList": ["実際の投稿から見えた避けるべき要素または不得意なパターン×3"],
  "actualPostExamples": [
    "実際の投稿例1（そのまま or 要約）",
    "実際の投稿例2",
    "実際の投稿例3"
  ]
}`,
        2500
      );
      setLSStatus("analyze", "done");

      let parsed;
      try {
        parsed = JSON.parse(analysisResult.replace(/```json|```/g, "").trim());
      } catch {
        // Try to extract JSON from mixed text
        const match = analysisResult.match(/\{[\s\S]*\}/);
        if (match) {
          try { parsed = JSON.parse(match[0]); }
          catch { throw new Error("分析結果のパースに失敗しました。もう一度お試しください。"); }
        } else {
          throw new Error("分析結果の取得に失敗しました。もう一度お試しください。");
        }
      }

      const displayNameFromBio = bioText.split(/[\n。、]/)[0].trim() || username;
      setProfile({ username, displayName: parsed.displayName || displayNameFromBio });
      setAna(parsed);
      setStep(2);
    } catch (e) {
      setError(e.message || "分析中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  /* ── STEP 2: GENERATE based on real analysis ── */
  async function generatePosts() {
    if (dirs.length === 0) { setError("方向性を1つ以上選んでください"); return; }
    setError(""); setGen(true); setPosts([]);

    try {
      const dirNames = dirs.map(id => DIRECTIONS.find(d => d.id === id)?.name).join("、");
      const raw = await claudePlain(
        [{ role: "user", content: `「${dirNames}」の方向性で${count}件の投稿を生成してください。` }],
        `あなたはXの投稿生成のプロです。
以下は @${analysis?.displayName || username} の実際の調査に基づく深掘り分析です。
この分析を完全に踏まえ、そのユーザーの文体・口調・職業観・思想・フォーマットを100%再現した投稿を作成してください。

【実データに基づく分析】
${JSON.stringify(analysis, null, 2)}

【生成ルール】
- actualPostExamplesに示した実際の投稿スタイル・語感を最優先で参照する
- styleNotesの文体の癖（改行・絵文字・語尾）を忠実に再現する
- buzzPatternsの「型」を意識した構成にする
- jobTitle・industry・careerStageを反映した専門性と言葉遣いにする
- 140〜200文字を目安。そのままコピペして投稿できるクオリティ
- 各投稿は独立した完結した内容

JSONのみ返答してください。

{
  "posts": [
    {
      "direction": "方向性名",
      "text": "投稿本文（実際の文体を再現）",
      "why": "バズりやすい理由と使用した型（具体的に1〜2文）"
    }
  ]
}`,
        2500
      );

      let parsed;
      try { parsed = JSON.parse(raw.replace(/```json|```/g, "").trim()); }
      catch {
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) { try { parsed = JSON.parse(match[0]); } catch { throw new Error("投稿の生成に失敗しました。"); } }
        else throw new Error("投稿の生成に失敗しました。");
      }

      setPosts(parsed.posts || []);
      setStep(3);
      setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth" }), 120);
    } catch (e) {
      setError(e.message || "生成中にエラーが発生しました");
    } finally {
      setGen(false); }
  }

  function toggleDir(id) { setDirs(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); setError(""); }
  function copyPost(text, i) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(p => ({ ...p, [i]: true }));
      setTimeout(() => setCopied(p => ({ ...p, [i]: false })), 2200);
    });
  }
  function resetStep2() { setPosts([]); setStep(2); setDirs([]); }
  function resetAll()   { setStep(1); setUrl(""); setBio(""); setPosts2(""); setHash(""); setProfile(null); setAna(null); setPosts([]); setDirs([]); setError(""); setDS([]); setLS([]); }

  const isLoading = loading || generating;

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">

        {/* HEADER */}
        <div className="header">
          <div className="eyebrow">X Post Intelligence</div>
          <h1>Yutaroさんが作った<br/>𝕏投稿分析・生成ツール</h1>
          <p className="subtitle">
            プロフィールURLを入力するとウェブ検索で実際の投稿・プロフィールを収集。<br/>
            本物のデータに基づいてあなたの文体でバズる投稿を自動生成します。
          </p>
        </div>

        {/* STEP BAR */}
        <div className="steps">
          {[["STEP 1","実データ収集・分析"],["STEP 2","方向性を選択"],["STEP 3","投稿を生成"]].map(([n,t],i) => (
            <div key={i} className={`step ${step > i+1 ? "done" : step === i+1 ? "active" : ""}`}>
              <span className="sn">{n}</span>{t}
            </div>
          ))}
        </div>

        {/* STEP 1: INPUT */}
        <div className="card">
          <div className="card-ey">STEP 1</div>
          <div className="card-title">プロフィール情報を入力</div>
          <div className="input-row">
            <input
              className="txt-in"
              placeholder="https://x.com/username または @username"
              value={url}
              onChange={e => { setUrl(e.target.value); setError(""); }}
              disabled={isLoading}
            />
            {url.trim() && (
              <button
                className="btn btn-g"
                onClick={() => window.open(url.startsWith("http") ? url : `https://x.com/${url.replace(/^@/,"")}`, "_blank")}
                disabled={isLoading}
              >
                Xを開く
              </button>
            )}
          </div>

          <div style={{marginTop:16, display:"flex", flexDirection:"column", gap:12}}>
            <div>
              <div style={{fontSize:12, color:"var(--text-sub)", marginBottom:6, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em"}}>プロフィールbio（自己紹介文）</div>
              <textarea
                className="txt-in"
                style={{width:"100%", minHeight:80, resize:"vertical", fontFamily:"inherit", lineHeight:1.7}}
                placeholder="bioをここに貼り付けてください"
                value={bioText}
                onChange={e => { setBio(e.target.value); setError(""); }}
                disabled={isLoading}
              />
            </div>
            <div>
              <div style={{fontSize:12, color:"var(--text-sub)", marginBottom:6, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em"}}>固定ツイート or 最近の投稿5件以上</div>
              <textarea
                className="txt-in"
                style={{width:"100%", minHeight:160, resize:"vertical", fontFamily:"inherit", lineHeight:1.7}}
                placeholder="投稿内容をここに貼り付けてください（5件以上推奨）"
                value={postsText}
                onChange={e => { setPosts2(e.target.value); setError(""); }}
                disabled={isLoading}
              />
            </div>
            <div>
              <div style={{fontSize:12, color:"var(--text-sub)", marginBottom:6, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em"}}>よく使うハッシュタグ（任意）</div>
              <textarea
                className="txt-in"
                style={{width:"100%", minHeight:60, resize:"vertical", fontFamily:"inherit", lineHeight:1.7}}
                placeholder="#マーケティング #スタートアップ など"
                value={hashtagText}
                onChange={e => { setHash(e.target.value); setError(""); }}
                disabled={isLoading}
              />
            </div>
          </div>

          <div style={{marginTop:16}}>
            <button className="btn btn-full" onClick={analyzeProfile} disabled={isLoading || (!bioText.trim() && !postsText.trim())}>
              {loading ? "分析中..." : "分析する"}
            </button>
          </div>

          {/* Loading steps */}
          {loading && (
            <div className="loading">
              <div className="spin" />
              <div className="load-steps">
                {loadSteps.map(s => (
                  <div key={s.id} className={`load-step ${s.status === "done" ? "done" : s.status === "running" ? "running" : ""}`}>
                    <span className="ls-icon">
                      {s.status === "done" ? "✓" : s.status === "running" ? "⟳" : "○"}
                    </span>
                    {s.label}
                  </div>
                ))}
              </div>
              <p style={{fontSize:11, color:"var(--text-sub)", fontFamily:"'DM Mono',monospace"}}>
                実際のウェブデータを取得中です。30〜60秒ほどかかります...
              </p>
            </div>
          )}

          {/* Profile strip after analysis */}
          {profile && analysis && !loading && (
            <div className="profile-strip">
              <div className="ava">{analysis.displayName?.[0] || username?.[0]?.toUpperCase()}</div>
              <div className="ava-info">
                <div className="ava-name">{analysis.displayName}</div>
                <div className="ava-handle">@{username} · {analysis.jobTitle}</div>
              </div>
              <span className="badge badge-a">✓ 実データ分析済み</span>
            </div>
          )}

          {/* Data sources */}
          {dataSources.length > 0 && !loading && (
            <div className="data-source">
              <div className="data-source-icon">🔎</div>
              <div>
                <strong>収集したデータソース</strong>
                実際のウェブ検索結果をもとに分析しています
                <div className="source-chips">
                  {dataSources.slice(0, 5).map((s, i) => (
                    <span key={i} className="source-chip">
                      {new URL(s).hostname.replace("www.", "")}
                    </span>
                  ))}
                  {dataSources.length > 5 && <span className="source-chip">+{dataSources.length - 5}</span>}
                </div>
              </div>
            </div>
          )}

          {error && <div className="err">{error}</div>}
        </div>

        {/* ANALYSIS REPORT */}
        {analysis && !loading && (
          <div className="card">
            <div className="card-ey">分析レポート（実データ基づく）</div>
            <div className="card-title">🔍 深掘り人物像・投稿パターン分析</div>

            <div className="persona-hero">
              <div className="persona-lbl">人物像サマリー</div>
              <div className="persona-txt">{analysis.personaSummary}</div>
            </div>

            <div className="id-grid">
              <div className="id-item"><div className="id-lbl">役職・ポジション</div><div className="id-val">{analysis.jobTitle}</div></div>
              <div className="id-item"><div className="id-lbl">会社種別・規模</div><div className="id-val">{analysis.companyType}</div></div>
              <div className="id-item"><div className="id-lbl">業界</div><div className="id-val">{analysis.industry}</div></div>
              <div className="id-item"><div className="id-lbl">キャリアステージ</div><div className="id-val">{analysis.careerStage}</div></div>
            </div>

            <div className="stat-grid">
              <div className="stat-item"><div className="stat-val">{analysis.avgEngagement}</div><div className="stat-lbl">エンゲージメント傾向</div></div>
              <div className="stat-item"><div className="stat-val">{analysis.bestPostingTime}</div><div className="stat-lbl">最適投稿時間帯</div></div>
              <div className="stat-item"><div className="stat-val">{analysis.avgLength}</div><div className="stat-lbl">平均文字数</div></div>
            </div>

            {analysis.postCategoryRatio?.length > 0 && (
              <div className="cat-section">
                <div className="sb-lbl">投稿カテゴリ比率（実データより）</div>
                <div className="cat-bars">
                  {analysis.postCategoryRatio.map((c, i) => (
                    <div key={i} className="cat-row">
                      <div className="cat-lbl">{c.label}</div>
                      <div className="cat-track"><div className="cat-fill" style={{ width: `${c.pct}%`, background: BAR_COLORS[i % BAR_COLORS.length] }} /></div>
                      <div className="cat-pct">{c.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="sb">
              <div className="sb-lbl">文体・フォーマットの癖（実投稿より）</div>
              <ul className="blist">{analysis.styleNotes?.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>

            <div className="sb">
              <div className="sb-lbl">バズりやすい投稿の型（実データより）</div>
              <ul className="blist">{analysis.buzzPatterns?.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>

            {/* actual post examples */}
            {analysis.actualPostExamples?.length > 0 && (
              <div className="sb">
                <div className="sb-lbl">📝 収集できた実際の投稿例</div>
                {analysis.actualPostExamples.map((ex, i) => (
                  <div key={i} style={{
                    background: "var(--surface2)", border: "1px solid var(--border)",
                    borderRadius: 10, padding: "12px 14px", marginBottom: 8,
                    fontSize: 13, lineHeight: 1.7, color: "#ccc", whiteSpace: "pre-wrap"
                  }}>
                    {ex}
                  </div>
                ))}
              </div>
            )}

            <div className="two-col">
              <div className="sb">
                <div className="sb-lbl">✅ 効果的な要素</div>
                <ul className="blist">{analysis.doList?.map((d, i) => <li key={i}>{d}</li>)}</ul>
              </div>
              <div className="sb">
                <div className="sb-lbl">❌ 避けるべき要素</div>
                <ul className="blist">{analysis.dontList?.map((d, i) => <li key={i}>{d}</li>)}</ul>
              </div>
            </div>

            <div className="sb" style={{marginBottom:0}}>
              <div className="sb-lbl">文体キーワード</div>
              <div className="tags">{analysis.toneKeywords?.map((t, i) => <span key={i} className="tag tv">{t}</span>)}</div>
            </div>
            <div className="sb" style={{marginTop:14, marginBottom:0}}>
              <div className="sb-lbl">よく投稿するトピック</div>
              <div className="tags">{analysis.strongTopics?.map((t, i) => <span key={i} className="tag tg">{t}</span>)}</div>
            </div>
          </div>
        )}

        {/* STEP 2: DIRECTIONS */}
        {step >= 2 && analysis && !loading && (
          <div className="card">
            <div className="card-ey">STEP 2</div>
            <div className="card-title">投稿の方向性を選択（複数可）</div>

            <div className="info">
              @{username} の実際の投稿データに基づき、あなたの文体・語感を再現して生成します。
            </div>

            <div className="dir-grid">
              {DIRECTIONS.map(d => (
                <div key={d.id} className={`dir-card ${dirs.includes(d.id) ? "active" : ""}`} onClick={() => toggleDir(d.id)}>
                  <div className="dir-chk">{dirs.includes(d.id) ? "✓" : ""}</div>
                  <div className="dir-em">{d.emoji}</div>
                  <div>
                    <div className="dir-name">{d.name}</div>
                    <div className="dir-desc">{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cnt-row">
              <div className="cnt-lbl">生成する投稿数</div>
              <div className="cnt-btns">
                {[1,2,3,4,5].map(n => (
                  <button key={n} className={`cnt-btn ${count===n?"on":""}`} onClick={() => setCount(n)}>{n}</button>
                ))}
              </div>
            </div>

            {error && <div className="err">{error}</div>}

            <div style={{marginTop:20}}>
              <button className="btn btn-full" onClick={generatePosts} disabled={generating || dirs.length === 0}>
                {generating ? "生成中..." : `🚀 ${count}件の投稿を生成する`}
              </button>
            </div>

            {generating && (
              <div className="loading">
                <div className="spin" />
                <p style={{fontSize:13, color:"#666"}}>実データに基づいてあなたの文体で生成中...</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: POSTS */}
        {posts.length > 0 && (
          <div className="card" ref={ref}>
            <div className="card-ey">生成結果</div>
            <div className="card-title">✨ 生成された投稿</div>

            {posts.map((post, i) => (
              <div key={i} className="post-card">
                <div className="post-head">
                  <span className="post-num">#{i+1}</span>
                  <span className="post-dtag">{post.direction}</span>
                </div>
                <div className="post-body">{post.text}</div>
                {post.why && <div className="post-why">💡 {post.why}</div>}
                <div className="post-foot">
                  <span className="post-chr">{post.text?.length}文字</span>
                  <button className={`copy-btn ${copied[i] ? "cp" : ""}`} onClick={() => copyPost(post.text, i)}>
                    {copied[i] ? "✓ コピー済み" : "コピー"}
                  </button>
                </div>
              </div>
            ))}

            <hr className="divider" />
            <div style={{display:"flex", gap:10}}>
              <button className="btn btn-g" style={{flex:1}} onClick={resetStep2}>方向性を変えて再生成</button>
              <button className="btn btn-g" style={{flex:1}} onClick={resetAll}>別のアカウントで分析</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
