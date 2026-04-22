#!/usr/bin/env bash
# publish_docs.sh — sync root HTML dashboards into docs/ for GitHub Pages
#
# Usage:  bash publish_docs.sh
# Run from the repo root (myn-command-center/).

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

if [ ! -d docs ]; then
  echo "error: docs/ folder not found. Creating it now."
  mkdir -p docs
fi

# The 14 dashboards that make up the public site
FILES=(
  "index.html"
  "master-directory.html"
  "analytics-dashboard.html"
  "lead-gen-dashboard.html"
  "hotel-activities-dashboard.html"
  "business-economics-dashboard.html"
  "team-handoff-dashboard.html"
  "architecture-dashboard.html"
  "agent-control-plane.html"
  "supabase-dashboard.html"
  "paperclip-dashboard.html"
  "review-queue.html"
  "4-21-26-full-audit.html"
  "scott-hoffman-knowledge-base.html"
)

copied=0
missing=0
for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    cp "$f" "docs/$f"
    copied=$((copied + 1))
  else
    echo "warning: $f not found in repo root — skipping"
    missing=$((missing + 1))
  fi
done

# Ensure .nojekyll exists so GitHub serves HTML as-is
touch docs/.nojekyll

echo ""
echo "Published: $copied files"
if [ "$missing" -gt 0 ]; then
  echo "Missing:   $missing files"
fi
echo ""
echo "Next:"
echo "  git add docs/"
echo "  git commit -m \"Publish dashboards \$(date +%F)\""
echo "  git push"
