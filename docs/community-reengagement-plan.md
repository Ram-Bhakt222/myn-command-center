# MYN Community Re-engagement Plan

**Created:** 2026-04-22
**Context:** `community.myyoganetwork.org` (Discourse) has 4 registered users, 21 topics, and has been dormant since Aug 19, 2025 (~8 months). Category structure is solid, tagging is intentional, content is MYN-aligned. The bones are good — it just never got seeded with real people.

---

## Decision point: Keep it, freeze it, or relaunch it?

| Option | What it means | Cost |
|---|---|---|
| **Relaunch** (recommended) | Active growth push tied to LBSOY graduation cohorts and the AI-in-yoga positioning | ~$26/mo droplet + your time |
| **Freeze** | Convert to read-only, keep as archive/SEO asset | ~$26/mo droplet, zero maintenance |
| **Archive** | Export content, destroy droplet, redirect to a static page | $0/mo after migration |

The rest of this doc assumes **Relaunch**.

---

## The 4-week relaunch

### Week 1: Foundation (before inviting anyone new)

**Tuesday-Wednesday**
- Upgrade Discourse off `beta3-dev` (see server-hardening-runbook.md)
- Set up SMTP on the community (Discourse needs it for invite/digest/notification emails — same Resend/Postmark creds as n8n)
- Configure weekly digest to send Mondays 8am PT
- Polish the `Uncategorized` and `Release Notes` categories — delete or move the empty ones

**Thursday-Friday**
- Write and pin 3 anchor posts (one per pillar):
  1. "Why MYN exists" — state the thesis in Ram's voice, invite pushback
  2. "What we're building with AI for yoga teachers" — concrete: the 8 WombHealthFM agents, the podcast, the brand memory system
  3. "LBSOY grads: here's your corner of the internet" — welcome + weekly rhythm
- Fill out the 4 dead categories (`Yoga Organizations`, `Professionalization & Healthcare`, `Teacher Training`, `Ethics`) with one seed topic each. No empty rooms.

### Week 2: Seed the room

**Target 20 signups.** Invite-only is fine — higher signal than open.

**Invite waves:**
- **Wave A: LBSOY grads** — pull the roster, send personal invites from Ram via the Discourse invite tool. Script below.
- **Wave B: MYN inner circle** — 8–10 people Ram already talks to about yoga-industry stuff (Scott, theparagon, anyone who showed up early)
- **Wave C: Podcast guests** — any yoga teacher Ram has interviewed for WombHealthFM podcast

**Sample invite copy (email):**
> Subject: Quiet corner for the yoga teachers who are actually thinking about this stuff
>
> Hey [name] —
>
> Putting together a small invite-only community for yoga teachers who want to talk seriously about where the field is headed — AI, authentic marketing, the business side, and what "professional" should mean.
>
> Not a promo channel. Not a mastermind. Just a room for the ~50 people who actually read past the first paragraph.
>
> Your invite: [discourse invite link]
>
> — Ram

### Week 3: Establish rhythm

**Weekly cadence:**
- **Monday:** Ram posts a prompt in `Visioning the Future of Yoga` — one question, 2–3 sentences, no pitch
- **Wednesday:** Drop a WombHealthFM podcast episode link in `Content Creation & AI Tools` with a discussion starter
- **Friday:** Roundup / highlight in `LBSOY Grads Chat`

Cross-post on LinkedIn (tagged posts) to pull curious yoga teachers toward the invite link. Don't make the community fully public — the invite gate is the filter.

### Week 4: Measure and adjust

**Metrics to watch (Discourse admin dashboard):**
- DAU / WAU (target Week 4: 8 DAU, 20 WAU)
- Posts created per week (target: 15)
- Replies per topic (target: >1.5 — means actual conversation, not monologue)
- Trust level progression (how many users hit TL1 "Basic" = engaged)

**If after 4 weeks DAU < 3:** the format or the audience is off. Consider:
- Moving primary discussion to a private Slack / Discord and keeping Discourse as the public archive
- Narrowing to just LBSOY grads for the first 3 months
- Pivoting the community to a paid tier (signals commitment, filters)

---

## Ongoing operations (post-launch)

### Ram's time budget
- 2×30min/week writing prompts and seed posts
- 15min/day skimming and replying (not daily crisis-mode, just ambient presence)

### Moderation
- Set trust level 2 users to "regulars" who can edit/move topics
- Enable `Akismet` or `Discourse-Automation` plugin for spam (none installed today)

### Content -> community loop
- Every WombHealthFM podcast episode gets a pinned discussion thread
- Every agent/tool launch in Strategy AGI gets a "feedback wanted" post
- LBSOY course drops get a cohort-private category

### SEO & discovery
- Discourse generates good SEO by default. Confirm:
  - `robots.txt` allows crawling (`/robots.txt`)
  - Sitemap is submitted to Google Search Console (`community.myyoganetwork.org/sitemap.xml`)
  - Open Graph previews work (post a link in LinkedIn, check preview)

---

## What I can't do from here

I can't:
- Access Discourse admin to pull the LBSOY roster (that's in your DB or via admin panel)
- Send the invite emails (needs your Discourse login)
- Write the 3 anchor posts for you — those need Ram's voice, not mine

I can:
- Draft the invite email/Slack copy in the brand voice (say the word and I'll pull from the brand-voice-study skill)
- Write the 3 anchor posts as drafts for Ram to edit
- Build the weekly-prompt-bank (12 weeks of Monday prompts in the MYN thesis)
- Set up an n8n workflow that auto-posts the weekly podcast link to Discourse via the Discourse API
