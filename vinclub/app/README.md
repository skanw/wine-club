# VinClub

Built with [Wasp](https://wasp.sh), based on the [Open Saas](https://opensaas.sh) template.

VinClub is a platform for French wine merchants to manage members, marketing campaigns, and wine box subscriptions.

## UI Components

This template includes [ShadCN UI](https://ui.shadcn.com/) v2 for beautiful, accessible React components. See [SHADCN_SETUP.md](./SHADCN_SETUP.md) for details on how to use ShadCN components in your app.

## Prerequisites

- [Wasp CLI](https://wasp.sh/docs/quick-start) (v0.18.0 or higher)
- [Node.js](https://nodejs.org/) (v20 LTS or higher)
- [Docker](https://www.docker.com/) (for local database)
- [PostgreSQL](https://www.postgresql.org/) (or use Docker container)

## Setup Instructions

### 1. Environment Configuration

The application requires environment variables to be configured before starting.

#### Quick Start (Development)

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.server
   ```

2. **Configure required variables in `.env.server`:**
   - `DATABASE_URL` - **Leave this commented out for development**. Wasp will automatically manage the database when you run `wasp start db`. Only uncomment if you want to use a custom/external database.
   - `JWT_SECRET` - Generate a secure random string:
     ```bash
     openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
     ```
   - `WASP_WEB_CLIENT_URL` - Set to `http://localhost:3000` for development
   - `WASP_SERVER_URL` - Set to `http://localhost:3001` for development

3. **Optional: Configure additional services** (see `.env.example` for full documentation):
   - **Stripe** (Payment processing): Add `STRIPE_API_KEY` and `STRIPE_WEBHOOK_SECRET`
   - **AWS S3** (File uploads): Add AWS credentials and bucket name
   - **Twilio** (SMS campaigns): Add Twilio credentials
   - **Brevo** (Email campaigns): Add Brevo API key
   - **Redis** (Caching): Add `REDIS_URL` for improved performance

#### Production Setup

For production, you'll need to:

1. Set up a production PostgreSQL database
2. Generate a new secure `JWT_SECRET` (never reuse development secrets)
3. Update `WASP_WEB_CLIENT_URL` and `WASP_SERVER_URL` to your production domains
4. Configure all required service integrations (Stripe, AWS S3, etc.)
5. Set up environment variables securely (use your hosting platform's secret management)

### 2. Database Setup

1. **Start the local database:**
   ```bash
   wasp start db
   ```
   This will start a PostgreSQL container in Docker. **Make sure Docker is running** before executing this command. Leave the database running in a separate terminal.

   **Note:** If you see an error about `DATABASE_URL` already being defined, check your `.env.server` file and make sure `DATABASE_URL` is commented out (starts with `#`). Wasp needs to manage the database itself for local development.

2. **Run migrations:**
   ```bash
   wasp db migrate-dev
   ```
   This applies all database schema migrations.

3. **Seed the database (optional):**
   ```bash
   wasp db seed
   ```
   This populates the database with sample data for development.

### 3. Running the Application

1. **Start the development server:**
   ```bash
   wasp start
   ```
   This will:
   - Start the client on `http://localhost:3000`
   - Start the API server on `http://localhost:3001`
   - Watch for file changes and reload automatically

2. **Access the application:**
   - Client: http://localhost:3000
   - API: http://localhost:3001

## Environment Variables Reference

See [`.env.example`](./.env.example) for a comprehensive list of all environment variables with descriptions.

### Required Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secure random string for JWT token signing (min 32 chars)
- `WASP_WEB_CLIENT_URL` - Client application URL
- `WASP_SERVER_URL` - Server API URL

### Optional Variables by Feature

**Payment Processing:**
- `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET` (or Lemon Squeezy equivalents)

**File Uploads:**
- `AWS_S3_REGION`, `AWS_S3_IAM_ACCESS_KEY`, `AWS_S3_IAM_SECRET_KEY`, `AWS_S3_FILES_BUCKET`

**SMS Campaigns:**
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

**Email Campaigns:**
- `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`

**Analytics:**
- `PLAUSIBLE_API_KEY`, `PLAUSIBLE_SITE_ID` (or Google Analytics variables)

**Performance:**
- `REDIS_URL` (for caching)

**Admin:**
- `ADMIN_EMAILS` (comma-separated list)

## Service Setup Guides

### Stripe Setup
1. Create a Stripe account at https://stripe.com
2. Get your API keys from https://dashboard.stripe.com/apikeys
3. Set up webhooks at https://dashboard.stripe.com/webhooks
4. Add `STRIPE_API_KEY` and `STRIPE_WEBHOOK_SECRET` to `.env.server`

### AWS S3 Setup
1. Create an S3 bucket in your AWS account
2. Create an IAM user with S3 read/write permissions
3. Generate access keys for the IAM user
4. Add AWS credentials to `.env.server`

### Twilio Setup
1. Sign up at https://www.twilio.com
2. Get your Account SID and Auth Token from the Twilio Console
3. Purchase a phone number at https://www.twilio.com/phone-numbers
4. Add Twilio credentials to `.env.server`

### Brevo Setup
1. Sign up at https://www.brevo.com (formerly Sendinblue)
2. Get your API key from https://app.brevo.com/settings/keys/api
3. Verify a sender email address
4. Add `BREVO_API_KEY` and `BREVO_SENDER_EMAIL` to `.env.server`

## Troubleshooting

### Server not starting
- Check that `.env.server` exists and contains required variables
- Verify Docker is running if using local database
- Check server logs for specific error messages

### Database connection errors
- Ensure `wasp start db` is running
- Verify `DATABASE_URL` in `.env.server` matches the running database
- Try running `wasp db migrate-dev` to ensure schema is up to date

### Missing environment variables
- The application will fail gracefully for optional services (S3, Twilio, Brevo)
- Check `.env.example` for all available variables
- Required variables must be set or the server will not start

## Development

### Running locally

1. **Ensure environment is configured:**
   - `.env.server` file exists with required variables
   - `.env.client` file exists (optional, usually auto-generated)

2. **Start the database:**
   ```bash
   wasp start db
   ```
   Leave this running in a separate terminal.

3. **Start the application:**
   ```bash
   wasp start
   ```
   This starts both client and server with hot reloading.

4. **Run migrations (if schema changed):**
   ```bash
   wasp db migrate-dev
   ```

### Project Structure

- `main.wasp` - Wasp configuration file (routes, pages, queries, actions)
- `schema.prisma` - Database schema definition
- `src/` - Application source code
  - `client/` - React client-side code
  - `server/` - Server-side code (queries, actions, utilities)
  - `shared/` - Shared code between client and server
- `migrations/` - Database migration files
- `.env.server` - Server environment variables (not in git)
- `.env.example` - Environment variables template

## Additional Resources

- [Wasp Documentation](https://wasp.sh/docs)
- [Open SaaS Template](https://opensaas.sh)
- [Prisma Documentation](https://www.prisma.io/docs)
- [ShadCN UI Documentation](https://ui.shadcn.com/)

