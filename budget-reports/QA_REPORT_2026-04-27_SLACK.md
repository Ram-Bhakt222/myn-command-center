*[QA Agent]* — Mon 2026-04-27, weekly Command Center scan

*Result:* 3 ❌ • 8 ⚠️ • 6 ✅ on the 6 in-scope dashboards.

*❌ Failures*
• 2 of 6 dashboards in the task spec don't exist at the named path — `unified-command-center.html` and `agentfield-dashboard.html` were archived, replaced by `index.html` and `agent-control-plane.html`. Skill spec is outdated.
• 10 broken intra-site links across `agent-control-plane.html` (5), `team-handoff-dashboard.html` (4), `lead-gen-dashboard.html` (1) — all pointing at the now-archived files.
• Canonical pipeline state ($38,750/mo MRR, 5 active hotel contracts, freeze Day 28, Budget-Agent pause rec, 28 scheduled tasks) is *not surfaced on any of the 6 dashboards*. Only `master-directory.html` (out of scope) carries the MRR figure.

*⚠️ Top warnings*
• All 6 dashboards stamped 2026-04-21 — 6 days old, one day from tipping past the 7-day threshold. Pipeline state has moved (freeze Day 24 → 28, AUTO_POST_POLICY live Apr 24, 2 new scheduled tasks).
• `hotel-activities`: 557 GHL + 656 Email = 1,213, but headline says 1,199 (off by exactly 14, the Wave-1 expired count). Same dashboard also carries a third number, 1,395 "opportunities", with no reconciling note.
• `agent-control-plane.html` has no "last updated" timestamp at all.
• `analytics-dashboard.html` sets "Last updated" to *the browser clock at page load* — misleading; the underlying GA4 baseline is from March 2026.
• `hotel-activities` narrative says "14 contracts were sent but never closed" — actual story is they activated and expired.

*✅ Passing*
• 4 of 6 dashboards present at the expected name with valid structure.
• 3 dashboards have zero broken intra-site links (`index`, `analytics`, `hotel-activities`).
• No lorem-ipsum / FIXME / placeholder leakage outside one cosmetic SYTAR `TBD`.

*Cross-talk + delivery note*
The agent-cross-talk step couldn't run — no Slack read MCP is loaded in the scheduled-task runner, so the last-10-messages-from-#agent-logs check was substituted with the embedded `myn.com-main/CLAUDE.md` snapshot. Same reason this report is being relayed manually instead of auto-posted.

Full report: `Command Center/myn-command-center/budget-reports/QA_REPORT_2026-04-27.md`

*Hands off to:* Ram — F1 (skill spec update), F2 (broken links), F3 (KPI strip on `index.html`), W1 (refresh trigger), W2 (lead-count reconciliation), Slack-MCP plumbing gap.
