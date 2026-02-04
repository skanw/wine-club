# Deploy VinClub to Fly.io with domain vinclub.fr

Run all commands from this directory (`vinclub/app`), where `main.wasp` lives.

## Quick run order

1. **Install flyctl** (if needed): `brew install flyctl`
2. **Add payment info** (required even for free tier): Go to https://fly.io/dashboard/billing and add a credit card
3. **Log in** (opens browser; do this in your terminal): `fly auth login`
4. **Launch** (creates client, server, db): `wasp deploy fly launch vinclub cdg`
5. **Secrets + custom domain**: `./scripts/fly-post-launch.sh` then add the A/AAAA records at your DNS provider.
6. **Brevo**: Add webhook URL in Brevo dashboard; optionally set `BREVO_API_KEY` and `BREVO_SENDER_EMAIL` as Fly server secrets.

## 1. First-time deploy (no fly tomls yet)

1. **Prerequisites**
   - Install [flyctl](https://fly.io/docs/flyctl/install/) (e.g. `brew install flyctl`)
   - **Add payment information** (required even for free tier): Go to https://fly.io/dashboard/billing and add a credit card. Fly.io requires this before creating apps.
   - Run in your terminal (browser will open): `fly auth login`

2. **Launch the app** (creates client, server, and DB on Fly)
   ```bash
   wasp deploy fly launch vinclub cdg
   ```
   - `vinclub` = app base name (results in `vinclub-client`, `vinclub-server`, `vinclub-db`)
   - `cdg` = Paris region; use another [region](https://fly.io/docs/reference/regions/) if you prefer
   - Do not interrupt the process. When it finishes, you get `fly-server.toml` and `fly-client.toml` in this directory. Commit them.

3. **Set server secrets** (required for auth and CORS)
   ```bash
   wasp deploy fly cmd --context server secrets set JWT_SECRET="$(openssl rand -base64 32 | tr -d '=+/' | cut -c1-32)"
   wasp deploy fly cmd --context server secrets set WASP_WEB_CLIENT_URL="https://vinclub.fr"
   wasp deploy fly cmd --context server secrets set WASP_SERVER_URL="https://vinclub-server.fly.dev"
   ```
   - Replace `vinclub-server.fly.dev` with your actual server URL from the launch output, or with `https://api.vinclub.fr` after you add that domain to the server app (see section 3).
   - Add any other server env (e.g. Brevo, Twilio, Stripe) with more `secrets set` calls.

## 2. Custom domain vinclub.fr (client = main site)

1. **Create certificate for the client app**
   ```bash
   wasp deploy fly cmd --context client certs create vinclub.fr
   ```
   Fly will print DNS instructions (A and AAAA records).

2. **Configure DNS** at your registrar for `vinclub.fr`:
   - Add the **A** record (e.g. `@` → IP from the command output).
   - Add the **AAAA** record (e.g. `@` → IPv6 from the output).

3. **Point the server at your domain** (for CORS and links)
   ```bash
   wasp deploy fly cmd --context server secrets set WASP_WEB_CLIENT_URL="https://vinclub.fr"
   ```

4. **(Optional) Add www.vinclub.fr**
   ```bash
   wasp deploy fly cmd --context client certs create www.vinclub.fr
   ```
   Then add a **CNAME** record: `www` → `vinclub.fr`. If you use both www and non-www, you may need [custom CORS](https://wasp.sh/docs/deployment/deployment-methods/wasp-deploy/fly) so the server allows both.

## 3. (Optional) api.vinclub.fr for the server

If you want the API at `https://api.vinclub.fr` instead of `vinclub-server.fly.dev`:

1. **Add the hostname to the server app**
   ```bash
   wasp deploy fly cmd --context server certs create api.vinclub.fr
   ```
2. **Add DNS**: A (and AAAA if shown) for `api` pointing to the values Fly gives you.
3. **Set server URL**
   ```bash
   wasp deploy fly cmd --context server secrets set WASP_SERVER_URL="https://api.vinclub.fr"
   ```
   Redeploy so the client is built with the new API URL: `wasp deploy fly deploy`.

## 4. Third-party webhooks (Brevo)

After the server is live, configure Brevo to send events to your production server so open/click/delivered tracking works:

- **Webhook URL:** `https://vinclub-server.fly.dev/webhooks/brevo` (or `https://api.vinclub.fr/webhooks/brevo` if you use the custom API domain).
- In [Brevo → Settings → Webhooks](https://app.brevo.com/webhooks), add this URL and subscribe to: **Opened**, **Clicked**, **Delivered**, **Hard bounce**, **Soft bounce**, **Unsubscribed** (or as needed).
- Use the same `BREVO_API_KEY` and `BREVO_SENDER_EMAIL` in Fly server secrets as in development.

## 5. Redeploy after code changes

```bash
wasp deploy fly deploy
```

## 6. Useful commands

- List server secrets: `wasp deploy fly cmd --context server secrets list`
- Server logs: `wasp deploy fly cmd --context server logs`
- Client logs: `wasp deploy fly cmd --context client logs`

## Summary: production URLs

| Purpose         | URL (example)                              |
|-----------------|--------------------------------------------|
| Main site       | https://vinclub.fr                         |
| Optional www    | https://www.vinclub.fr                     |
| API (default)   | https://vinclub-server.fly.dev             |
| API (custom)    | https://api.vinclub.fr (optional)          |
| Brevo webhook   | https://vinclub-server.fly.dev/webhooks/brevo (or api.vinclub.fr if using custom API) |

Ensure `WASP_WEB_CLIENT_URL` and `WASP_SERVER_URL` match how you actually reach the app and API (see sections 1–3).
