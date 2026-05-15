/* MYN agent avatars — shared helper
 * ----------------------------------
 * Drops 24px round avatar chips next to any agent name on a page.
 * Use:
 *   <script src="/static/avatars/agent-avatars.js"></script>           // cockpit
 *   <script src="assets/avatars/agent-avatars.js"></script>            // command center
 * Then either:
 *   1. Add `data-agent-avatar` to a node and put the agent's name in `data-agent`
 *      <span data-agent-avatar data-agent="solene"></span>
 *   2. Wrap a name in <span class="agent-name">Solène</span> — auto-decorated
 *   3. Call MYN.renderAgentChip("Solène", { size: 28 }) → returns HTML string
 *   4. Call MYN.decorateAll(rootEl) to scan and decorate after dynamic injection
 *
 * Avatar source resolution:
 *   - If `window.MYN_AVATAR_BASE` is set (string ending in `/`), use it.
 *   - Else look for the script's own `src` attr and derive base from it.
 *   - Fallback: "/static/avatars/" (cockpit default).
 */
(function () {
  "use strict";

  // ---- Resolve avatar base URL ----
  function resolveBase() {
    if (typeof window.MYN_AVATAR_BASE === "string") return window.MYN_AVATAR_BASE;
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src || "";
      if (src.indexOf("agent-avatars.js") !== -1) {
        return src.replace(/agent-avatars\.js(\?.*)?$/, "");
      }
    }
    return "/static/avatars/";
  }
  var BASE = resolveBase();

  // ---- Canonical agent map (username -> { display, file, dept }) ----
  var AGENTS = {
    // Executive
    imara:   { display: "Imara",   file: "imara.png",   dept: "Executive" },
    // Coordination layer
    orrery:  { display: "Orrery",  file: "orrery.png",  dept: "Coordination" },
    corvid:  { display: "Corvid",  file: "corvid.png",  dept: "Coordination" },
    lyric:   { display: "Lyric",   file: "lyric.png",   dept: "Coordination" },
    parley:  { display: "Parley",  file: "parley.png",  dept: "Coordination" },
    lantern: { display: "Lantern", file: "lantern.png", dept: "Coordination" },
    // Division leads & seconds
    solene:  { display: "Solène",  file: "solene.png",  dept: "Meridian (Hotels)" },
    cormac:  { display: "Cormac",  file: "cormac.png",  dept: "Meridian (Hotels)" },
    cyrus:   { display: "Cyrus",   file: "cyrus.png",   dept: "Keystone (Healthcare)" },
    ines:    { display: "Inès",    file: "ines.png",    dept: "Keystone (Healthcare)" },
    rhea:    { display: "Rhea",    file: "rhea.png",    dept: "Fulcrum (Corporate)" },
    tomas:   { display: "Tomás",   file: "tomas.png",   dept: "Fulcrum (Corporate)" },
    odette:  { display: "Odette",  file: "odette.png",  dept: "Atlas (Marketplace)" },
    kiran:   { display: "Kiran",   file: "kiran.png",   dept: "Atlas (Marketplace)" },
    nova:    { display: "Nova",    file: "nova.png",    dept: "Cadence (Wearables)" },
    jules:   { display: "Jules",   file: "jules.png",   dept: "Cadence (Wearables)" },
    linnea:  { display: "Linnea",  file: "linnea.png",  dept: "Harbor (Locals)" },
    bodhi:   { display: "Bodhi",   file: "bodhi.png",   dept: "Harbor (Locals)" },
    wren:    { display: "Wren",    file: "wren.png",    dept: "Ember (Kids)" },
    imani:   { display: "Imani",   file: "imani.png",   dept: "Ember (Kids)" },
    lior:    { display: "Lior",    file: "lior.png",    dept: "Aperture (Brand)" },
    mira:    { display: "Mira",    file: "mira.png",    dept: "Aperture (Brand)" },
    halden:  { display: "Halden",  file: "halden.png",  dept: "Loom (Ops/Finance)" },
    tova:    { display: "Tova",    file: "tova.png",    dept: "Loom (Ops/Finance)" }
  };

  // Aliases — display, accented, legacy, hyphenated forms all -> canonical key
  var ALIASES = {
    // Display + accented variants
    "imara": "imara",
    "orrery": "orrery",
    "corvid": "corvid",
    "lyric": "lyric",
    "parley": "parley",
    "lantern": "lantern",
    "solene": "solene", "solène": "solene", "solenè": "solene",
    "cormac": "cormac",
    "cyrus": "cyrus",
    "ines": "ines", "inès": "ines", "inés": "ines",
    "rhea": "rhea",
    "tomas": "tomas", "tomás": "tomas", "tomàs": "tomas",
    "odette": "odette",
    "kiran": "kiran",
    "nova": "nova",
    "jules": "jules",
    "linnea": "linnea",
    "bodhi": "bodhi",
    "wren": "wren",
    "imani": "imani",
    "lior": "lior",
    "mira": "mira",
    "halden": "halden",
    "tova": "tova",
    // Legacy role names from old roster (agent-control-plane, audit dashboards)
    "intent router": "orrery",
    "intent_router": "orrery",
    "hermes": "orrery",
    "lead researcher": "corvid",
    "lead_researcher": "corvid",
    "lead discovery": "corvid",
    "website intelligence": "corvid",
    "executive research": "corvid",
    "style cloner": "lyric",
    "style_cloner": "lyric",
    "cold email writer": "parley",
    "cold_email_writer": "parley",
    "outreach generator": "parley",
    "wellness recommender": "lantern",
    "wellness_recommender": "lantern",
    "deep research": "lantern",
    "marketing agent": "lior",
    "marketing_agent": "lior",
    "video producer": "mira",
    "ceo agent": "imara",
    "ceo_agent": "imara",
    "memory store": "orrery",
    "summarizers": "orrery",
    "opportunity scoring": "parley"
  };

  function normalizeKey(name) {
    if (!name) return null;
    var k = String(name).trim().toLowerCase();
    // strip leading @
    if (k.charAt(0) === "@") k = k.substring(1);
    if (AGENTS[k]) return k;
    if (ALIASES[k]) return ALIASES[k];
    // try removing accents
    var stripped = k.normalize ? k.normalize("NFD").replace(/[̀-ͯ]/g, "") : k;
    if (AGENTS[stripped]) return stripped;
    if (ALIASES[stripped]) return ALIASES[stripped];
    return null;
  }

  function avatarUrl(name) {
    var key = normalizeKey(name);
    if (!key) return null;
    return BASE + AGENTS[key].file;
  }

  function displayName(name) {
    var key = normalizeKey(name);
    if (!key) return name;
    return AGENTS[key].display;
  }

  // ---- Inject CSS once ----
  function injectCSS() {
    if (document.getElementById("myn-avatar-css")) return;
    var css =
      ".myn-avatar{display:inline-block;border-radius:50%;object-fit:cover;vertical-align:middle;background:#1a2333;border:1px solid rgba(255,255,255,0.08);box-shadow:0 1px 2px rgba(0,0,0,0.25);flex-shrink:0;}" +
      ".myn-avatar.size-20{width:20px;height:20px;}" +
      ".myn-avatar.size-24{width:24px;height:24px;}" +
      ".myn-avatar.size-28{width:28px;height:28px;}" +
      ".myn-avatar.size-32{width:32px;height:32px;}" +
      ".myn-avatar.size-40{width:40px;height:40px;}" +
      ".myn-avatar.size-48{width:48px;height:48px;}" +
      ".myn-avatar.size-56{width:56px;height:56px;}" +
      ".myn-avatar.size-64{width:64px;height:64px;}" +
      ".myn-avatar.size-80{width:80px;height:80px;}" +
      ".myn-agent-chip{display:inline-flex;align-items:center;gap:6px;line-height:1;}" +
      ".myn-agent-chip .myn-avatar{margin-right:0;}";
    var s = document.createElement("style");
    s.id = "myn-avatar-css";
    s.appendChild(document.createTextNode(css));
    (document.head || document.documentElement).appendChild(s);
  }

  // ---- Render helpers ----
  function renderAvatarHTML(name, size) {
    var url = avatarUrl(name);
    var display = displayName(name);
    if (!url) return "";
    var sz = size || 24;
    return '<img class="myn-avatar size-' + sz + '" src="' + url +
           '" alt="' + display + '" title="' + display + '" loading="lazy">';
  }

  function renderAgentChip(name, opts) {
    opts = opts || {};
    var size = opts.size || 24;
    var showName = opts.showName !== false;
    var url = avatarUrl(name);
    if (!url) return showName ? '<span class="myn-agent-chip">' + escapeHtml(name) + '</span>' : "";
    var display = displayName(name);
    var html = '<span class="myn-agent-chip">';
    html += '<img class="myn-avatar size-' + size + '" src="' + url +
            '" alt="' + display + '" title="' + display + '" loading="lazy">';
    if (showName) html += '<span class="myn-agent-name">' + escapeHtml(opts.label || display) + '</span>';
    html += '</span>';
    return html;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---- Decorate explicit hooks ----
  // <span data-agent-avatar data-agent="solene" data-size="32"></span>
  function decorateExplicit(root) {
    root = root || document;
    var nodes = root.querySelectorAll("[data-agent-avatar]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.dataset.avatarDone === "1") continue;
      var name = el.dataset.agent || el.textContent;
      var size = parseInt(el.dataset.size || "24", 10);
      var showName = el.dataset.showName !== "false";
      el.innerHTML = renderAgentChip(name, { size: size, showName: showName, label: el.dataset.label });
      el.dataset.avatarDone = "1";
    }
  }

  // ---- Decorate <span class="agent-name">Solène</span> ----
  function decorateNameSpans(root) {
    root = root || document;
    var nodes = root.querySelectorAll(".agent-name:not(.myn-decorated)");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var name = (el.textContent || "").trim();
      var key = normalizeKey(name);
      if (!key) continue;
      var size = parseInt(el.dataset.size || "24", 10);
      var img = renderAvatarHTML(key, size);
      if (img) {
        el.insertAdjacentHTML("afterbegin", img + " ");
        el.classList.add("myn-decorated");
        el.style.display = "inline-flex";
        el.style.alignItems = "center";
        el.style.gap = "6px";
      }
    }
  }

  function decorateAll(root) {
    injectCSS();
    decorateExplicit(root);
    decorateNameSpans(root);
  }

  // ---- Public API ----
  window.MYN = window.MYN || {};
  window.MYN.AGENTS = AGENTS;
  window.MYN.ALIASES = ALIASES;
  window.MYN.avatarUrl = avatarUrl;
  window.MYN.displayName = displayName;
  window.MYN.normalizeKey = normalizeKey;
  window.MYN.renderAvatarHTML = renderAvatarHTML;
  window.MYN.renderAgentChip = renderAgentChip;
  window.MYN.decorateAll = decorateAll;
  window.MYN.AVATAR_BASE = BASE;

  // ---- Auto-run on DOMContentLoaded + observe future mutations ----
  function start() {
    decorateAll();
    if (window.MutationObserver) {
      var observer = new MutationObserver(function (mutations) {
        var needs = false;
        for (var i = 0; i < mutations.length; i++) {
          if (mutations[i].addedNodes && mutations[i].addedNodes.length) { needs = true; break; }
        }
        if (needs) decorateAll();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
