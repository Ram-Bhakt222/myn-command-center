# MYN Command Center — Published Dashboards

This folder is the **GitHub Pages publish target** for the MYN Command Center dashboards. Everything here is a static HTML snapshot.

Live URL (once Pages is enabled): `https://ram-bhakt222.github.io/myn-command-center/`

## What's in here

| File | Purpose |
|------|---------|
| `index.html` | **Hub** — current-vs-future view, risk strip, quick wins |
| `master-directory.html` | System map with sidebar nav |
| `analytics-dashboard.html` | Metrics layer |
| `lead-gen-dashboard.html` | Sales ops / pipeline |
| `hotel-activities-dashboard.html` | Hotel vertical ops |
| `business-economics-dashboard.html` | Revenue, margin, unit economics |
| `team-handoff-dashboard.html` | Who owns what, handoff state |
| `architecture-dashboard.html` | System + agent architecture |
| `agent-control-plane.html` | Live agent status, runs |
| `supabase-dashboard.html` | Data layer |
| `paperclip-dashboard.html` | Paperclip integration |
| `review-queue.html` | Approval queue |
| `4-21-26-full-audit.html` | Latest full audit snapshot |
| `scott-hoffman-knowledge-base.html` | Scott Hoffman framework + insights |

All pages share a sticky top-nav so you can jump between them in one click.

## How this gets updated

Editable sources live one folder up (in the repo root). This `docs/` folder is a published snapshot. To re-publish:

```bash
# From the repo root
bash ../outputs/publish_docs.sh   # copies root HTML → docs/
git add docs/
git commit -m "Publish dashboards $(date +%F)"
git push
```

GitHub Pages will pick up the change within ~1 minute.

## Tech notes

- `.nojekyll` is present so GitHub serves files as-is (no Jekyll processing). The dashboards ship with inline CSS, so Jekyll's default theming would interfere otherwise.
- All inter-dashboard links are relative filenames — no base URL config needed.
- No external dependencies except Google Fonts (Inter + Space Grotesk) loaded from `fonts.googleapis.com`.
