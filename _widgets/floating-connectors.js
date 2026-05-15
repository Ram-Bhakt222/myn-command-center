/* ============================================================
   MYN Floating Connectors Widget
   Drop-in: <script src="_widgets/floating-connectors.js"></script>
   - Renders a fixed lower-right pill that expands to a panel
     listing every connector / MCP / scheduled-task surface.
   - Live-pings the Cockpit (localhost:8787) for stack health
     when Cockpit is reachable; otherwise falls back to static.
   - Persists open/closed state in localStorage.
   - Self-contained: no external CSS, no framework deps.
   - Last updated: 2026-05-07
   ============================================================ */
(function () {
  if (window.__mynConnectorsLoaded) return;
  window.__mynConnectorsLoaded = true;

  // ---------- Config: connectors & launchers ------------------
  // status values: live | configured | needs-auth | offline | unknown
  var CONNECTORS = [
    // --- MYN local stack ---
    { id: "cockpit",     label: "Cockpit",            kind: "local",     icon: "🛫", url: "http://localhost:8787",          probe: "http://localhost:8787/api/host/snapshot", group: "Stack" },
    { id: "discourse",   label: "Discourse Newsroom", kind: "local",     icon: "🗞️", url: "http://localhost:8800",          probe: "http://localhost:8800/srv/status",        group: "Stack" },
    { id: "agentfield",  label: "AgentField",         kind: "local",     icon: "🛠️", url: "http://127.0.0.1:8000",          probe: "http://127.0.0.1:8000/health",            group: "Stack" },
    { id: "qdrant",      label: "Qdrant",             kind: "local",     icon: "🧠", url: "http://127.0.0.1:6333/dashboard", probe: "http://127.0.0.1:6333/healthz",          group: "Stack" },
    { id: "n8n",         label: "n8n",                kind: "local",     icon: "🔁", url: "http://127.0.0.1:5678",          probe: "http://127.0.0.1:5678/healthz",           group: "Stack" },
    { id: "ollama",      label: "Ollama",             kind: "local",     icon: "🦙", url: "http://127.0.0.1:11434",         probe: "http://127.0.0.1:11434/api/tags",         group: "Stack" },
    { id: "blogimg",     label: "Blog Image Studio",  kind: "local",     icon: "🎨", url: "http://127.0.0.1:8788",          probe: "http://127.0.0.1:8788/",                  group: "Stack" },
    { id: "videostudio", label: "AI Video Studio",    kind: "local",     icon: "🎬", url: "http://localhost:8780",          probe: "http://localhost:8780/health",            group: "Stack" },
    { id: "halo",        label: "HALO Studio",        kind: "local",     icon: "✨", url: "http://localhost:8765/studio/",  probe: "http://localhost:8765/studio/",           group: "Stack" },
    { id: "openwebui",   label: "Open WebUI",         kind: "local",     icon: "💬", url: "http://127.0.0.1:8080",          probe: "http://127.0.0.1:8080/",                  group: "Stack" },

    // --- MCP connectors (Claude / Cowork) ---
    { id: "ghl",         label: "GHL (chromey)",      kind: "mcp",       icon: "📞", url: "https://app.gohighlevel.com",                                                  group: "MCP" },
    { id: "notion",      label: "Notion",             kind: "mcp",       icon: "📓", url: "https://www.notion.so",                                                        group: "MCP" },
    { id: "slack",       label: "Slack",              kind: "mcp",       icon: "💼", url: "https://slack.com/app_redirect",                                               group: "MCP" },
    { id: "gmail",       label: "Gmail",              kind: "mcp",       icon: "✉️", url: "https://mail.google.com",                                                      group: "MCP" },
    { id: "gcal",        label: "Google Calendar",    kind: "mcp",       icon: "📅", url: "https://calendar.google.com",                                                  group: "MCP" },
    { id: "gdrive",      label: "Google Drive",       kind: "mcp",       icon: "🗂️", url: "https://drive.google.com",                                                     group: "MCP" },
    { id: "fathom",      label: "Fathom",             kind: "mcp",       icon: "🎙️", url: "https://fathom.video",                                                         group: "MCP" },
    { id: "winmcp",      label: "Windows-MCP",        kind: "mcp",       icon: "🪟", url: "ms-settings:",                                                                  group: "MCP" },
    { id: "deskcmdr",    label: "Desktop Commander",  kind: "mcp",       icon: "🖥️", url: "#",                                                                             group: "MCP" },
    { id: "apify",       label: "Apify",              kind: "mcp",       icon: "🕷️", url: "https://console.apify.com",                                                    group: "MCP" },
    { id: "pophive",     label: "PopHIVE Health",     kind: "mcp",       icon: "🩺", url: "https://pophive.org",                                                          group: "MCP" },
    { id: "hubspot",     label: "HubSpot",            kind: "mcp",       icon: "🧲", url: "https://app.hubspot.com",                                                      group: "MCP" },
    { id: "similarweb",  label: "SimilarWeb",         kind: "mcp",       icon: "📈", url: "https://account.similarweb.com",                                               group: "MCP" },
    { id: "chrome",      label: "Claude in Chrome",   kind: "mcp",       icon: "🌐", url: "chrome://extensions",                                                          group: "MCP" },
    { id: "cowork-tasks",label: "Scheduled Tasks",    kind: "mcp",       icon: "⏱️", url: "http://localhost:8787/claude-tasks",                                          group: "MCP" },

    // --- External web apps (no MCP, but useful jump-offs) ---
    { id: "ga4",         label: "GA4 — myyoganetwork", kind: "external", icon: "📊", url: "https://analytics.google.com/analytics/web/?authuser=1#/a269846991p378545961/reports/home", group: "External" },
    { id: "gsc",         label: "Search Console",      kind: "external", icon: "🔎", url: "https://search.google.com/search-console?resource_id=sc-domain:myyoganetwork.com",         group: "External" },
    { id: "myn-org",     label: "myn.org Dashboard",   kind: "external", icon: "🌍", url: "https://myn.org/dashboard",                                                                group: "External" },
    { id: "github",      label: "GitHub",              kind: "external", icon: "💾", url: "https://github.com/ram-bhakt222",                                                          group: "External" },
    { id: "supabase",    label: "Supabase",            kind: "external", icon: "🟢", url: "https://supabase.com/dashboard",                                                           group: "External" }
  ];

  // ---------- Probe (best-effort, no-cors fallback) -----------
  function probe(c) {
    if (!c.probe) {
      c.status = (c.kind === "mcp" ? "configured" : "unknown");
      return Promise.resolve(c);
    }
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, 1500);
    return fetch(c.probe, { method: "GET", mode: "no-cors", signal: ctrl.signal, cache: "no-store" })
      .then(function () { c.status = "live"; return c; })
      .catch(function () { c.status = "offline"; return c; })
      .finally(function () { clearTimeout(t); });
  }

  // ---------- Styles ------------------------------------------
  var css = ''
    + '#myn-cx{position:fixed;right:18px;bottom:18px;z-index:99999;font-family:Inter,Segoe UI,system-ui,sans-serif;font-size:12.5px;color:#e0e0e0}'
    + '#myn-cx-pill{cursor:pointer;background:linear-gradient(135deg,#1a1a2e,#0f141b);border:1px solid rgba(0,212,170,.45);border-radius:999px;padding:9px 14px;display:flex;align-items:center;gap:8px;box-shadow:0 6px 20px rgba(0,0,0,.45),0 0 0 1px rgba(0,212,170,.08);user-select:none;transition:transform .15s ease,box-shadow .15s ease}'
    + '#myn-cx-pill:hover{transform:translateY(-1px);box-shadow:0 8px 26px rgba(0,0,0,.55),0 0 0 1px rgba(0,212,170,.18)}'
    + '#myn-cx-pill .dot{width:8px;height:8px;border-radius:50%;background:#00d4aa;box-shadow:0 0 8px #00d4aa;animation:mynpulse 1.8s infinite}'
    + '#myn-cx-pill b{color:#00d4aa;font-weight:700;letter-spacing:.5px;text-transform:uppercase;font-size:10.5px}'
    + '#myn-cx-pill span.cnt{color:#8b949e;font-variant-numeric:tabular-nums}'
    + '#myn-cx-panel{position:absolute;right:0;bottom:48px;width:340px;max-height:520px;overflow:hidden;background:#0f141b;border:1px solid rgba(255,255,255,.10);border-radius:14px;box-shadow:0 18px 48px rgba(0,0,0,.65);display:none;flex-direction:column}'
    + '#myn-cx.open #myn-cx-panel{display:flex}'
    + '#myn-cx-panel header{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.06)}'
    + '#myn-cx-panel header b{color:#f3f6fa;font-size:13px;font-weight:600;font-family:Space Grotesk,Inter,sans-serif}'
    + '#myn-cx-panel header .x{cursor:pointer;color:#6e7681;font-size:14px;padding:2px 6px;border-radius:6px}'
    + '#myn-cx-panel header .x:hover{color:#f3f6fa;background:rgba(255,255,255,.04)}'
    + '#myn-cx-list{overflow-y:auto;padding:6px 6px 10px}'
    + '#myn-cx-list::-webkit-scrollbar{width:6px}#myn-cx-list::-webkit-scrollbar-thumb{background:rgba(0,212,170,.25);border-radius:3px}'
    + '.myn-cx-group{padding:8px 10px 4px;color:#6e7681;font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:600}'
    + '.myn-cx-row{display:flex;align-items:center;gap:9px;padding:7px 10px;border-radius:8px;text-decoration:none;color:#c9d1d9;cursor:pointer}'
    + '.myn-cx-row:hover{background:rgba(255,255,255,.04);color:#f3f6fa}'
    + '.myn-cx-row .ic{font-size:14px;width:18px;text-align:center}'
    + '.myn-cx-row .lbl{flex:1;font-size:12.5px}'
    + '.myn-cx-row .st{width:8px;height:8px;border-radius:50%;flex-shrink:0}'
    + '.myn-cx-row .st.live{background:#10b981;box-shadow:0 0 6px #10b981}'
    + '.myn-cx-row .st.configured{background:#3b82f6}'
    + '.myn-cx-row .st.needs-auth{background:#f59e0b}'
    + '.myn-cx-row .st.offline{background:#ef4444}'
    + '.myn-cx-row .st.unknown{background:#6e7681}'
    + '#myn-cx-foot{padding:8px 14px;border-top:1px solid rgba(255,255,255,.06);color:#6e7681;font-size:10.5px;display:flex;justify-content:space-between;align-items:center}'
    + '#myn-cx-foot a{color:#00d4aa;text-decoration:none}'
    + '@keyframes mynpulse{0%,100%{opacity:1}50%{opacity:.55}}';

  // ---------- DOM build ---------------------------------------
  function build() {
    var style = document.createElement('style'); style.textContent = css;
    document.head.appendChild(style);

    var root = document.createElement('div'); root.id = 'myn-cx';
    var open = localStorage.getItem('myn-cx-open') === '1';
    if (open) root.classList.add('open');

    root.innerHTML = ''
      + '<div id="myn-cx-panel">'
      +   '<header><b>🔌 Connectors</b><span class="x" id="myn-cx-close">✕</span></header>'
      +   '<div id="myn-cx-list"></div>'
      +   '<div id="myn-cx-foot">'
      +     '<span id="myn-cx-meta">scanning…</span>'
      +     '<a href="http://localhost:8787" target="_blank" rel="noopener">Cockpit ↗</a>'
      +   '</div>'
      + '</div>'
      + '<div id="myn-cx-pill">'
      +   '<span class="dot"></span><b>MYN</b><span class="cnt" id="myn-cx-cnt">' + CONNECTORS.length + ' connectors</span>'
      + '</div>';
    document.body.appendChild(root);

    document.getElementById('myn-cx-pill').addEventListener('click', function () {
      root.classList.toggle('open');
      localStorage.setItem('myn-cx-open', root.classList.contains('open') ? '1' : '0');
    });
    document.getElementById('myn-cx-close').addEventListener('click', function (e) {
      e.stopPropagation(); root.classList.remove('open'); localStorage.setItem('myn-cx-open', '0');
    });

    render();
    runProbes();
  }

  function render() {
    var list = document.getElementById('myn-cx-list');
    if (!list) return;
    var groups = {};
    CONNECTORS.forEach(function (c) {
      if (!c.status) c.status = (c.kind === 'mcp' ? 'configured' : 'unknown');
      (groups[c.group] = groups[c.group] || []).push(c);
    });
    var html = '';
    ['Stack', 'MCP', 'External'].forEach(function (g) {
      if (!groups[g]) return;
      html += '<div class="myn-cx-group">' + g + '</div>';
      groups[g].forEach(function (c) {
        html += '<a class="myn-cx-row" href="' + c.url + '" target="_blank" rel="noopener" title="' + c.label + ' — ' + c.status + '">'
             +    '<span class="ic">' + c.icon + '</span>'
             +    '<span class="lbl">' + c.label + '</span>'
             +    '<span class="st ' + c.status + '"></span>'
             +  '</a>';
      });
    });
    list.innerHTML = html;
    var live = CONNECTORS.filter(function (c) { return c.status === 'live'; }).length;
    var off  = CONNECTORS.filter(function (c) { return c.status === 'offline'; }).length;
    var meta = document.getElementById('myn-cx-meta');
    if (meta) meta.textContent = live + ' live · ' + off + ' offline · ' + CONNECTORS.length + ' total';
  }

  function runProbes() {
    var queue = CONNECTORS.filter(function (c) { return c.kind === 'local' && c.probe; });
    Promise.all(queue.map(probe)).then(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
