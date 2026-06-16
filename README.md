# MYN Command Center

> Operational dashboards for My Yoga Network — the operator-facing window into an AI-operated business stack.
> 15+ HTML dashboards, live Cockpit analytics, and a capabilities/stack reference.
> Last updated: 2026-06-15

📄 **[Capabilities & Stack — Internal Ops Reference (PDF)](MYN_Capabilities_and_Stack_2026-06-15.pdf)** — point-in-time inventory of the full stack (Cockpit, AgentField, Hermes, integrations, data/analytics, scheduled jobs). Mirrors `capabilities/registry.json` in Strategy AGI.

---

## Quick Start

Most dashboards are static HTML — just double-click to open in a browser. The **Analytics Dashboard** is the exception: it requires a running backend server to pull live data from GA4, Google Ads, and GHL.

### Starting the Analytics Dashboard (Live Data)

```bash
cd C:\Users\ram\Desktop\myn.org-main\analytics-dashboard
python server.py
```
Then open **http://localhost:8050** in your browser. The server auto-refreshes every 5 minutes.

Alternatively, use the **"Start Analytics Server"** scheduled task in Claude Cowork (sidebar → Scheduled → Run Now).

**Requirements**: Python 3.12, service account key at `C:\Users\ram\Desktop\myn-org-key.json`, env vars configured in `Strategy AGI/.env` (GA4_PROPERTY_ID, GOOGLE_APPLICATION_CREDENTIALS).

---

## Dashboards

All dashboards are static HTML — open directly in a browser, or via the published `docs/` GitHub Pages mirror. The Analytics view is now served **live from the MYN Cockpit** (`:8787/analytics`) rather than a standalone server.

### Hub

| Dashboard | File | Purpose |
|-----------|------|---------|
| **Main Index** | `index.html` | Landing page + navigation to every dashboard |
| **Master Directory** | `master-directory.html` | Directory of all system components |

### Operations

| Dashboard | File | Purpose |
|-----------|------|---------|
| **Analytics** | `analytics-dashboard.html` | GA4 + Search Console, events/PMF, Google Ads, GHL CRM, operations |
| **Agent Control Plane** | `agent-control-plane.html` | Agents across departments, budget tracking, operational tabs |
| **Supabase** | `supabase-dashboard.html` | Database health, table stats, query monitoring |
| **Lead Gen** | `lead-gen-dashboard.html` | Lead pipeline + outreach status |

### Workflow

| Dashboard | File | Purpose |
|-----------|------|---------|
| **Review Queue** | `review-queue.html` | Approval queue for agent outputs requiring human review |
| **Skills Inventory** | `skills-inventory.html` | All Claude skills + stack capabilities |

### Strategy

| Dashboard | File | Purpose |
|-----------|------|---------|
| **Architecture** | `architecture-dashboard.html` | System architecture reference — tri-system map |
| **Business Economics** | `business-economics-dashboard.html` | PMF economics, division P&L, revenue modeling |
| **Team Handoff** | `team-handoff-dashboard.html` | Team coordination, handoffs, task routing |
| **Divisions** | `divisions-index.html` + `division-*.html` | 9 division briefs (Aperture, Atlas, Cadence, Ember, Fulcrum, Harbor, Keystone, Loom, Meridian) |

### Vertical / Account

| Dashboard | File | Purpose |
|-----------|------|---------|
| **Hotel Activities** | `hotel-activities-dashboard.html` | Hotel & resort activities program view |
| **Scott Hoffman KB** | `scott-hoffman-knowledge-base.html` | Account knowledge base |
| **RFP 2627-003** | `rfp-2627-003-dashboard.html` | RFP response tracker |

> **Retired:** `paperclip-dashboard.html` (removed 2026-06-10 — Paperclip service retired, redundant with AgentField + Cockpit + Discourse).

---

## Capabilities & Stack

MYN runs as a layered, AI-operated stack. The operator window is this dashboard repo; the canonical machine-readable inventory is `capabilities/registry.json` in Strategy AGI (consumed by the Cockpit Mission Control page). Full detail in the **[Capabilities & Stack PDF](MYN_Capabilities_and_Stack_2026-06-15.pdf)**.

| Layer | What runs there |
|-------|-----------------|
| **Control plane** | MYN Cockpit (Flask, `:8787`) — bootstrap pipeline, Mission Control (`/mission`), Cron Mission Control (`/cron`), live analytics (`/analytics`), opportunity scanner (`/opportunities`) |
| **Orchestration** | AgentField (Docker) · Hermes (skills/memory/delegation) · Discourse agent newsroom (`:8800`, 23 personas) |
| **Data & memory** | Supabase (structured) · Qdrant (`:6333`, vectors) · Langfuse (`:3005`, LLM traces) · nightly Postgres + Qdrant backups |
| **Integrations / MCP** | GHL MCP (node, 576 endpoints) · GA4/GSC MCP · WhatsApp MCP · DigitalOcean MCP · n8n cloud engine (51 workflows / 23 active) |
| **Content & video** | AI video gen (DANCE) · Remotion · content-engine · Whisper transcription container |
| **Surfaces** | myn.org (members) · myn.com (public) · Marketing Agent KB · this Command Center repo |

**Retired systems:** GoHighLevel-MCP docker (→ node `ghl-mcp-2026`), local n8n (→ cloud n8n), Paperclip.

---

## Agent Architecture (14 Agents — 4 Departments)

| # | Agent | Department | Cost/mo |
|---|-------|-----------|---------|
| 1 | Intent Router | Intelligence | $172/mo total |
| 2 | Lead Discovery | Intelligence | |
| 3 | Lead Researcher | Intelligence | |
| 4 | Website Intelligence | Intelligence | |
| 5 | Executive Research | Sales & Outreach | $312/mo total |
| 6 | Opportunity Scoring | Sales & Outreach | |
| 7 | Cold Email Writer | Sales & Outreach | |
| 8 | Outreach Generator | Sales & Outreach | |
| 9 | Style Cloner | Marketing & Content | $178/mo total |
| 10 | Wellness Recommender | Marketing & Content | |
| 11 | Marketing Agent | Marketing & Content | |
| 12 | Summarizers | Operations | $60/mo total |
| 13 | Memory Store | Operations | |
| 14 | Video Producer | Operations | |

**Total budget**: $722/mo ($672 agents + $50 CEO overhead)

---

## Analytics Dashboard — What It Tracks

The analytics dashboard at `http://localhost:8050` has 5 tabs:

1. **Google Analytics**: Sessions, users, pageviews, bounce rate, traffic trend, sources, devices, top pages, geo
2. **Events & PMF**: GTM custom events (cta_click, scroll_depth, form submissions), event-by-page breakdown, PMF page performance with tier color-coding (Institutional → Marketplace → Supporting)
3. **Google Ads**: Spend, impressions, clicks, CTR, CPC, ROAS, campaigns, keywords
4. **GHL CRM**: GoHighLevel contacts, pipelines, opportunities, recent leads
5. **Operations**: API health, AgentField agents, data pipeline, infrastructure

**PMF Page Tiers** (color-coded in Events & PMF tab):
- **Institutional** (green): /yoga-for-hotels-and-resorts, /hotels, /yoga-for-healthcare-providers, /corporate-wellness-programs
- **Marketplace** (blue): /find-a-yoga-therapist-near-me, /join-as-yoga-instructor
- **Supporting** (purple): /blogs, /platform, /about-our-team-and-vision, everything else

---

## Scheduled Tasks (Claude Cowork)

| Task | Schedule | Purpose |
|------|----------|---------|
| Start Analytics Server | Manual | Starts FastAPI server on localhost:8050 |
| Daily Agent Budget Report | Weekdays 8am | Agent spend from Supabase execution_logs |
| Weekly Pipeline Snapshot | Fridays 4pm | Lead pipeline health report |
| Morning Approval Digest | Weekdays 9am | Pending approval queue summary |
| Weekly Command Center QA | Mondays 7am | Scans dashboards for data integrity |
| Monthly Competitive Intel | 1st of month 10am | Competitive landscape scan |

---

## Sister Systems

| System | Location |
|--------|----------|
| Strategy AGI | `../Strategy AGI/` |
| myn.org (admin) | `../myn.org-main/` |
| myn.com (public site) | `../myn.com-main/` |
| Analytics Server Source | `../myn.org-main/analytics-dashboard/` |

---

## Reference Docs

| File | Purpose |
|------|---------|
| `AGENT_ARCHITECTURE.md` | Detailed agent architecture spec |
| `PM_AGENT_SUPPLEMENT.md` | PM agent operating rules |
| `SYSTEM_STATUS.md` | Current system status snapshot |
| `TEMPLATES.md` | Dashboard and report templates |
| `MYN-Pipeline-Snapshot-*.md` | Weekly pipeline snapshots |
