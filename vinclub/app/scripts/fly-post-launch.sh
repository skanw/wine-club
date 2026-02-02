#!/usr/bin/env bash
# Run from vinclub/app (parent of scripts/).
# Prerequisites: flyctl installed, logged in (fly auth login), and wasp deploy fly launch vinclub cdg already completed.

set -e
cd "$(dirname "$0")/.."
echo "Setting Fly server secrets..."

# Required for auth and CORS
wasp deploy fly cmd --context server secrets set JWT_SECRET="$(openssl rand -base64 32 | tr -d '=+/' | cut -c1-32)"
wasp deploy fly cmd --context server secrets set WASP_WEB_CLIENT_URL="https://vinclub.fr"
wasp deploy fly cmd --context server secrets set WASP_SERVER_URL="https://vinclub-server.fly.dev"

echo ""
echo "Creating certificate for vinclub.fr (client)..."
echo "→ Add the A and AAAA records below at your DNS provider for vinclub.fr"
wasp deploy fly cmd --context client certs create vinclub.fr

echo ""
echo "Done. Next steps:"
echo "1. At your DNS provider, add the A and AAAA records shown above for vinclub.fr"
echo "2. (Optional) Add Brevo secrets for email:"
echo "   wasp deploy fly cmd --context server secrets set BREVO_API_KEY=\"your-key\" BREVO_SENDER_EMAIL=\"noreply@vinclub.fr\""
echo "3. In Brevo → Settings → Webhooks, add: https://vinclub-server.fly.dev/webhooks/brevo"
echo "4. (Optional) For api.vinclub.fr: run wasp deploy fly cmd --context server certs create api.vinclub.fr, add DNS, then:"
echo "   wasp deploy fly cmd --context server secrets set WASP_SERVER_URL=\"https://api.vinclub.fr\""
echo "   wasp deploy fly deploy"
