# MYN Server Hardening Runbook

**Created:** 2026-04-22
**Scope:** DigitalOcean account (team UUID `32b71611-f5cb-446c-ba63-d36b8c4a922c`), 3 droplets: `n8n-myn`, `myndiscourse`, `Wearables-EHR`.

---

## 1. Cloud Firewalls — DONE ✓

Two firewalls created via DO API on 2026-04-22:

| Firewall | ID | Droplets | Inbound allow |
|---|---|---|---|
| `myn-n8n-firewall` | `a39fe293-9d3d-4867-b861-7abee86e5489` | n8n-myn | 22, 80, 443, ICMP |
| `myn-web-firewall` | `02acebac-da96-4de5-b5d6-21608d8b0baf` | myndiscourse, Wearables-EHR | 22, 80, 443, ICMP |

**Verified closed:** port 5678 on `134.199.209.57` no longer reachable from the internet. Caddy still reverse-proxies to n8n on localhost.

### Next hardening step (manual, when you have a stable IP)

Lock SSH (port 22) to your home/office IP only. Right now SSH is open worldwide.

```bash
# Get your current public IP:
curl -s https://ifconfig.me
# Then in the DO console: Networking → Firewalls → myn-n8n-firewall → edit SSH rule
# Change Sources from "All IPv4 / IPv6" to that IP + /32
```

Do the same on `myn-web-firewall`.

---

## 2. n8n SMTP Configuration — READY TO APPLY

**Why:** `/rest/settings` showed `smtpSetup: false`. n8n can't email you when workflows fail, can't send password resets, can't send notifications.

### Pick a provider

Recommended: **Resend** (cleanest API, free tier 3k/mo) or **Postmark** (best deliverability). SendGrid works but has deliverability issues on shared IPs.

### Generate credentials

- Resend: `resend.com` → API Keys → Create → pick "Sending access" → copy the `re_...` key
- Postmark: `postmarkapp.com` → Server → API Tokens → copy the token

### SSH into n8n-myn and set env vars

```bash
ssh root@134.199.209.57
cd /opt/n8n   # adjust if your install path differs

# Check current env
docker compose config | grep -i smtp || true

# Edit docker-compose.yml or .env to add:
```

For **Resend**:
```
N8N_EMAIL_MODE=smtp
N8N_SMTP_HOST=smtp.resend.com
N8N_SMTP_PORT=465
N8N_SMTP_USER=resend
N8N_SMTP_PASS=re_YOUR_KEY_HERE
N8N_SMTP_SENDER=n8n@myyoganetwork.org
N8N_SMTP_SSL=true
```

For **Postmark**:
```
N8N_EMAIL_MODE=smtp
N8N_SMTP_HOST=smtp.postmarkapp.com
N8N_SMTP_PORT=587
N8N_SMTP_USER=YOUR_POSTMARK_TOKEN
N8N_SMTP_PASS=YOUR_POSTMARK_TOKEN
N8N_SMTP_SENDER=n8n@myyoganetwork.org
N8N_SMTP_SSL=false
```

### Restart & verify

```bash
docker compose down && docker compose up -d
docker logs n8n 2>&1 | grep -i smtp
```

Then in the n8n UI: **Settings → Users → Invite a user** — if the invite email arrives, SMTP is working.

### Wire failure notifications

In n8n UI: **Settings → Log Streaming** (enterprise) OR add an **"Error Trigger"** workflow that emails `ram@myyoganetwork.com` whenever any workflow fails. Template workflow:

```
Error Trigger → Send Email (to: ram@myyoganetwork.com, subject: "n8n workflow failed: {{$json.workflow.name}}")
```

---

## 3. Discourse Upgrade — READY TO APPLY

**Why:** Running `3.5.0.beta3-dev` — an unreleased dev tag in production. Should be on the stable `tests-passed` branch or a tagged release.

### Pre-flight

```bash
ssh root@143.244.191.9
cd /var/discourse

# Check current version
./launcher logs app 2>&1 | grep -i "version\|discourse" | head -5
git log --oneline -5

# Take a snapshot FIRST (via DO console: Droplets → myndiscourse → Snapshots → Take Snapshot)
# Name it: "pre-upgrade-2026-04-22"
```

### Upgrade via web UI (safer)

1. Go to `https://community.myyoganetwork.org/admin/upgrade`
2. Log in as admin
3. Click "Upgrade Discourse"
4. Watch the log, wait for "Success"

### Upgrade via CLI (if web UI hangs)

```bash
cd /var/discourse
git pull
./launcher rebuild app
```

Rebuild takes 10–20 minutes on a 1vcpu droplet; site is down during rebuild. Do this off-hours.

### Switch off the beta branch

Edit `containers/app.yml`:
```yaml
version: tests-passed  # or a specific tag like v3.4.6
```

Then `./launcher rebuild app`.

### Post-upgrade

```bash
./launcher logs app 2>&1 | tail -50
curl -sI https://community.myyoganetwork.org/ | head -3
```

Verify: `/about.json` should show the new version.

---

## 4. Backups — NOT YET ENABLED

Three droplets, zero backups. One-click enable via API:

```bash
TOKEN="<rotate-first>"
for ID in 483916447 486129043 524508356; do
  curl -X POST -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"type":"enable_backups"}' \
    "https://api.digitalocean.com/v2/droplets/$ID/actions"
done
```

Cost: ~+20% of each droplet's price = **+$9/mo total** (~$55/mo all-in instead of $46/mo).
Retention: 4 weekly + 1 monthly backup (new default as of 2024).

---

## 5. Monitoring Alerts — NOT YET CREATED

Create basic CPU/memory/disk alerts per droplet:

```bash
TOKEN="<rotate-first>"
for ID in 483916447 486129043 524508356; do
  curl -X POST -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"alerts\": {\"email\":[\"ram@myyoganetwork.com\"],\"slack\":[]},
      \"compare\": \"GreaterThan\",
      \"description\": \"High CPU on droplet $ID\",
      \"enabled\": true,
      \"entities\": [\"$ID\"],
      \"tags\": [],
      \"type\": \"v1/insights/droplet/cpu\",
      \"value\": 80,
      \"window\": \"10m\"
    }" \
    "https://api.digitalocean.com/v2/monitoring/alerts"
done
```

Repeat with `type` = `v1/insights/droplet/memory_utilization_percent` and `v1/insights/droplet/disk_utilization_percent`.

---

## 6. API Token Rotation — DO FIRST

The token used in this session is in chat history. Rotate:

1. DO console → API → Tokens → delete the current one (named from when you created it)
2. Generate a new one with the same scopes
3. Update `~/Desktop/Strategy AGI/.env` lines `DIGITALOCEAN_API_TOKEN` and `DO_API_TOKEN`
4. Restart any n8n workflows or Strategy AGI agents that use it

---

## Checklist

- [x] Firewall `myn-n8n-firewall` created, port 5678 closed
- [x] Firewall `myn-web-firewall` created
- [ ] SSH locked to home IP on both firewalls
- [ ] n8n SMTP configured (Resend or Postmark)
- [ ] n8n Error Trigger workflow built
- [ ] Discourse upgraded off beta3-dev
- [ ] Backups enabled on all 3 droplets
- [ ] CPU/memory/disk alerts created
- [ ] API token rotated
