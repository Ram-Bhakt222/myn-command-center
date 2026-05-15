# MYN Command Center

> Operational dashboards for My Yoga Network. 15 HTML dashboards + 1 live analytics server.
> Last updated: 2026-03-28

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

### Hub Dashboards

| Dashboard | File | Purpose |
|-----------|------|---------|
| **Unified Command Center** | `unified-command-center.html` | Main hub — links to all dashboards, agent roster, system status |
| **Main Index** | `index.html` | Landing page and navigation |
| **Master Dashboard** | `dashboard-master.html` | Full system overview — agents, workflows, divisions |
| **Master Directory** | `master-directory.html` | Directory of all system components |

### Operations Dashboards

| Dashboard | File | Purpose |
|-----------|------|---------|
| **Analytics (Live)** | `analytics-dashboard.html` | GA4 traffic, GTM events, PMF page tracking, Google Ads, GHL CRM. **Requires server** — see Quick Start above |
| **Agent Control Plane** | `agent-control-plane.html` | 14 agents across 4 departments, $722/mo budget tracking, 7 operational tabs |
| **AgentField Dashboard** | `agentfield-dashboard.html` | AgentField orchestration — agent configs, routing, DAG tracking |
| **Agent OS** | `agent-os-dashboard.html` | Agent operating system status and health |
| **Agentic OS** | `agentic-os-dashboard.html` | Extended agent orchestration view |
| **Supabase Dashboard** | `supabase-dashboard.html` | Database health, table stats, query monitoring |

### Strategy Dashboards

| Dashboard | File | Purpose |
|-----------|------|---------|
| **Architecture** | `architecture-dashboard.html` | System architecture reference — tri-system map |
| **Business Economics** | `business-economics-dashboard.html` | PMF economics, division P&L, revenue modeling |
| **Team Handoff** | `team-handoff-dashboard.html` | Team coordination, intern handoffs, task routing |

### Workflow Dashboards

| Dashboard | File | Purpose |
|-----------|------|---------|
| **Paperclip** | `paperclip-dashboard.html` | Paperclip workflow automation view |
| **Review Queue** | `review-queue.html` | Approval queue for agent outputs requiring human review |

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
