# PRD Implementation Status

**Date:** January 29, 2026  
**Comparison:** PRD v2.0 vs Current Codebase

---

## 📊 Summary

- **Overall Completion:** ~40% of MVP features
- **Core Features:** 60% complete (structure exists, integrations missing)
- **Integrations:** 20% complete (stubs only)
- **Compliance:** 50% complete (basic GDPR, missing French-specific features)
- **Critical Blockers:** 4 major features preventing MVP launch

---

## ✅ Fully Implemented Features

### 1. Quick-Add Member Form (A)
- ✅ Mobile-optimized form UI
- ✅ All required fields: Name, Phone, Email, Favorite Region, Tags
- ✅ Duplicate checking (phone/email within cave)
- ✅ GDPR consent fields (consentEmail, consentSms)
- ✅ Form validation with Zod schemas
- ✅ Multi-tenant isolation (caveId filtering)
- ✅ Consent logging (consentGdprLoggedAt)
- ✅ Phone number normalization (E.164 format)

### 2. Daily Drop Campaign Creator (B - UI Only)
- ✅ Campaign creation form (mobile-friendly)
- ✅ Photo upload capability (S3 integration exists)
- ✅ Product name, price, message fields
- ✅ Audience selection UI (All Members, Tags, Region)
- ✅ Campaign status tracking (draft, sending, sent)
- ✅ Image upload to S3 with validation
- ✅ Campaign list and detail pages
- ✅ Max quantity field (for sold-out prevention)
- ✅ Channel selection (SMS/Email)

### 3. Subscription Box Engine (C - Structure Only)
- ✅ Subscription plan creation and management
- ✅ Subscription CRUD operations
- ✅ WineBox model with status tracking (pending, packed, shipped, ready_for_pickup)
- ✅ Basic packing list page UI
- ✅ Stripe webhook handlers (invoice.paid, subscription.updated, subscription.deleted)
- ✅ Auto-creation of WineBox records on payment (webhook handler exists)
- ✅ Billing cycle calculation (nextBillingDate)
- ✅ Subscription list and detail pages

### 4. Infrastructure
- ✅ Multi-tenant architecture (Cave model with strict isolation)
- ✅ Authentication system (Wasp auth with email/password)
- ✅ Database schema (PostgreSQL with Prisma)
- ✅ Member import/export (CSV/Excel)
- ✅ Inventory management (basic)
- ✅ Dashboard with stats
- ✅ File upload system (S3)
- ✅ Cave settings and logo upload
- ✅ Admin monitoring models (WebhookLog, MessageQueueItem, SyncEvent)

### 5. Admin Dashboard (Platform Management)
- ✅ Platform-wide metrics dashboard (GMV Total, Commission Revenue 1.5%, Activation Rate)
- ✅ Caviste health scoring system (campaign frequency + subscriber growth)
- ✅ Inventory trends analysis (Top "Pépites", rotation metrics)
- ✅ Operations monitoring (webhook logs, message queue status, sync events)
- ✅ Minimalist Apple-style design system (thin fonts, increased spacing, subtle indicators)
- ✅ Admin sidebar navigation (Dashboard, Cavistes, Inventaire, Opérations)
- ✅ Real-time platform statistics (active caves, total members, subscriptions)
- ✅ Weekly GMV visualization chart

---

## 🟡 Partially Implemented Features

### Admin Dashboard Platform Metrics
**Status:** Fully implemented for admin view, but data collection needs integration  
**What Exists:**
- ✅ Admin dashboard UI with GMV, Commission, Activation Rate metrics
- ✅ Caviste health score calculation (based on campaign frequency + subscribers)
- ✅ Inventory trends page (Top Pépites leaderboard)
- ✅ Operations monitoring page (webhook logs, queue status, sync status)
- ✅ Database models for monitoring (WebhookLog, MessageQueueItem, SyncEvent)

**What's Missing:**
- ❌ Actual webhook logging (need to integrate into Stripe/Twilio webhook handlers)
- ❌ Message queue item creation (need to integrate into SMS/email sending)
- ❌ Sync event logging (need to integrate into offline sync mechanism)
- ❌ Real-time data updates (currently shows static/calculated data)

**Impact:** Admin dashboard is functional but shows limited real-time data until integrations are complete.

**Estimated Time:** 1-2 days (after SMS/Email and Stripe integrations are done)

---

## ❌ Missing Critical Features (Blocking MVP)

### 🔴 PRIORITY 1: Offline-First Architecture (0% Complete)
**PRD Requirement:** Section 7.3 - "Offline-First Architecture is critical—wine cellars are often underground with poor 4G/5G signal."

**Status:** Not Started  
**Impact:** App fails in primary use case (cellar environment). **BLOCKING FEATURE.**

**What's Missing:**
- Service Worker for PWA offline support
- IndexedDB/localStorage for offline data storage
- Offline queue for form submissions (Add Member, Create Campaign)
- Sync mechanism when connectivity returns
- Optimistic UI updates ("Message Sent!" even when offline)
- Conflict resolution for simultaneous edits

**Files to Create/Modify:**
- `src/client/` (needs service worker setup)
- All form components (need offline queuing)
- Need to configure Wasp/Vite for PWA support

**Estimated Time:** 3-4 days

---

### 🔴 PRIORITY 2: SMS/Email Integration (0% Complete)
**PRD Requirement:** Section 5.B - "Backend: Wraps Twilio/Brevo APIs. Handles unsubscribes automatically."

**Status:** Stubs exist but throw errors  
**Files:** 
- `src/integrations/twilio/client.ts` (stub only)
- `src/integrations/brevo/client.ts` (stub only)

**What's Missing:**
- Actual Twilio client implementation (`npm install twilio` needed)
- Actual Brevo client implementation (`npm install @getbrevo/brevo` needed)
- SMS sending functionality
- Email sending functionality
- STOP reply handling (GDPR compliance webhook)
- Email bounce/unsubscribe handling (GDPR compliance webhook)
- Rate limiting for SMS
- Error handling and retry logic

**Impact:** Campaigns cannot be sent. **BLOCKING FEATURE.**

**Estimated Time:** 2-3 days

---

### 🔴 PRIORITY 3: Background Job Processing (0% Complete)
**PRD Requirement:** Section 6.2 - Background job processing for message delivery.

**Status:** TODOs at lines 267, 356 in `campaign/operations.ts`  
**Impact:** Campaigns are queued but never actually sent. **BLOCKING FEATURE.**

**What's Missing:**
- Job definition in `main.wasp` (PgBoss executor)
- `src/campaign/jobs.ts` file (doesn't exist)
- `processCampaignMessages` function
- Message batch processing (50 at a time)
- Status updates (pending → sent → delivered/failed)
- Campaign statistics updates
- Retry logic for failed messages

**Files to Create:**
- `src/campaign/jobs.ts` (new file)
- Job definition in `main.wasp`

**Files to Modify:**
- `src/campaign/operations.ts` (replace TODOs at lines 267, 356)

**Estimated Time:** 2-3 days

---

### 🔴 PRIORITY 4: Stripe Connect Subscription Integration (20% Complete)
**PRD Requirement:** Section 5.C - "Stripe Connect Integration: Auto-charge cards on the 1st of the month."

**Status:** Webhooks exist, but subscription creation is missing  
**Files:** `src/subscription/operations.ts` (TODOs at lines 389, 486, 529)

**What's Missing:**
- Stripe Connect account setup for multi-tenant (each cave needs Stripe account)
- Stripe Connect onboarding flow
- Subscription creation in `createSubscription()` - **TODO line 389**
- Subscription updates in `updateSubscription()` - **TODO line 486**
- Subscription cancellation in `cancelSubscription()` - **TODO line 529**
- Payment method collection (Stripe Elements)
- Payment failure handling (automatic polite email/SMS to update card)
- Invoice.payment_failed webhook handler

**What Exists:**
- ✅ Webhook handlers for invoice.paid, subscription.updated, subscription.deleted
- ✅ WineBox auto-creation on payment

**Impact:** Subscriptions cannot process payments automatically. **BLOCKING FEATURE.**

**Estimated Time:** 3-4 days

---

## 🟡 Missing Important Features (Non-Blocking but Required)

### 5. French VAT (TVA) Split Handling (0% Complete)
**PRD Requirement:** Section 6.3 - "Handle split-VAT rates in subscription boxes. A box may contain 2 bottles of wine (20% VAT) and a jar of terrine (5.5% VAT)."

**Status:** Not Started  
**Why Important:** PRD states this is a moat—US tools don't handle this.

**What's Missing:**
- VAT code field in subscription plan/product models
- Split-VAT calculation logic
- Invoice generation with VAT breakdown
- Accountant-friendly format

**Estimated Time:** 1-2 days

---

### 6. Loi Evin Compliance (0% Complete)
**PRD Requirement:** Section 6.4 - "Pre-vetted templates: Provide templates that comply with Loi Evin. Images cannot suggest social success or sexual appeal."

**Status:** Not Started  
**Why Important:** Legal compliance requirement. Sales feature ("Protect your business from fines").

**What's Missing:**
- Library of pre-vetted SMS/Email templates
- Content validation (warn/block non-compliant content)
- Template selector in Daily Drop creator
- Compliance badge/indicator in UI

**Estimated Time:** 2 days

---

### 7. "Sans Engagement" Subscription Cancellation (0% Complete)
**PRD Requirement:** Section 5.C - "Subscriptions must be cancelable with one click. This reduces French consumer fear."

**Status:** Not Started  
**Why Important:** PRD requirement - French consumers fear subscription commitments.

**What's Missing:**
- Customer-facing subscription management page
- One-click "Pause" button
- One-click "Cancel" button
- Confirmation flow (prevent accidental cancellation)
- Immediate vs end-of-period cancellation

**Estimated Time:** 1-2 days

---

### 8. Welcome SMS Automation (0% Complete)
**PRD Requirement:** Section 5.A - "Sends an immediate 'Welcome' SMS with a link to a digital wallet pass (optional future scope) or simple 'Thank you.'"

**Status:** TODO at line 320 in `member/operations.ts`  
**What's Missing:**
- Welcome SMS sending when `sendWelcomeMessage: true`
- SMS template: "Merci [Name] ! Bienvenue chez [Cave Name]. Répondez STOP pour vous désabonner."
- Option in QuickAddForm to enable/disable welcome message

**Estimated Time:** 1 day (requires SMS integration first)

---

### 9. PDF Packing List Generation (0% Complete)
**PRD Requirement:** Section 5.C - "Generates a PDF/Mobile checklist for Batiste: 'Here are the 45 people who need a box this month.'"

**Status:** Basic UI exists, PDF generation missing  
**What's Missing:**
- PDF library installation (`npm install jspdf` or `pdfkit`)
- PDF generation function
- "Download PDF" button
- Mobile-friendly checklist view enhancements
- Bulk status updates (mark multiple as packed)

**Estimated Time:** 2 days

---

### 10. Enhanced GDPR Compliance (50% Complete)
**PRD Requirement:** Section 6.4 - "Double Opt-in for email," "Right to be Forgotten," "Data export"

**Status:** Basic consent logging exists, but missing key features  
**What Exists:**
- ✅ Basic consent logging (consentGdprLoggedAt)
- ✅ Consent fields in forms (consentEmail, consentSms)

**What's Missing:**
- ❌ Double opt-in for email (verification email required)
- ❌ "Right to be Forgotten" button in member settings
- ❌ Data export functionality (GDPR right to data portability)
- ❌ Enhanced consent logging (method, timestamps)
- ❌ Privacy policy link in consent forms

**Estimated Time:** 2-3 days

---

## 🟢 Missing Polish Features (Nice to Have)

### 11. "Clicks to Revenue" Metric Tracking (0% Complete)
**PRD Requirement:** Section 8 - "Clicks to Revenue: Daily Drop campaign creation in ≤3 clicks from app open."

**Status:** Not Started  
**What's Missing:**
- Click tracking from app open to campaign sent
- Metric display in campaign creation flow
- Analytics logging for optimization

**Estimated Time:** 1 hour

---

### 12. French Localization Audit (90% Complete)
**PRD Requirement:** Section 7.2 - "The entire UI must be entirely in French."

**Status:** Mostly complete, needs verification  
**What's Missing:**
- Audit all error messages (ensure French)
- Verify all toast notifications are in French
- Check email templates (if any)
- Verify SMS templates
- Verify PDF content is in French

**Estimated Time:** 1 day

---

## 📋 Quick Reference: Critical TODOs in Code

### Campaign Operations (`src/campaign/operations.ts`)
- **Line 267:** `// TODO: Queue campaign for sending via background job`
- **Line 356:** `// TODO: Queue messages for processing via background job`

### Subscription Operations (`src/subscription/operations.ts`)
- **Line 389:** `// TODO: Create Stripe subscription`
- **Line 486:** `// TODO: Update Stripe subscription if status changes`
- **Line 529:** `// TODO: Cancel Stripe subscription`

### Member Operations (`src/member/operations.ts`)
- **Line 320:** `// TODO: Send welcome SMS if sendWelcomeMessage is true`

### Integration Files (Stubs Only)
- `src/integrations/twilio/client.ts` - All functions throw errors
- `src/integrations/brevo/client.ts` - All functions throw errors

---

## 🎯 Recommended Implementation Order

### Phase 1: Core Functionality (Weeks 1-2)
1. **Offline-First Architecture** (3-4 days) - CRITICAL
2. **SMS/Email Integration** (2-3 days) - CRITICAL
3. **Background Job Processing** (2-3 days) - CRITICAL

### Phase 2: Payment Integration (Weeks 3-4)
4. **Stripe Connect Integration** (3-4 days) - CRITICAL
5. **Welcome SMS** (1 day) - Depends on #2
6. **Payment Failure Handling** (1 day) - Part of #4

### Phase 3: French Compliance (Week 5)
7. **French VAT Split Handling** (1-2 days)
8. **Loi Evin Compliance** (2 days)
9. **"Sans Engagement" Cancellation** (1-2 days)

### Phase 4: Polish & Compliance (Week 6)
10. **Enhanced GDPR Compliance** (2-3 days)
11. **PDF Generation** (2 days)
12. **French Localization Audit** (1 day)
13. **"Clicks to Revenue" Tracking** (1 hour)

---

## 💰 Business Model Features (Not Started)

**PRD Requirement:** Section 10 - Hybrid Revenue Model

1. **Recurring SaaS Fee (€49/mo)** - Not implemented
2. **Success Fee (1.5% of Subscription Volume)** - Not implemented
3. **Pass-Through Revenue (SMS Credits)** - Not implemented

**Estimated Time:** 3-4 days (after Stripe Connect is set up)

---

## 🔧 Environment Variables Needed

Add these to `.env.server`:
```bash
# Twilio (REQUIRED for SMS)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Brevo (REQUIRED for Email)
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=

# Stripe Connect (REQUIRED for Subscriptions)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CONNECT_CLIENT_ID=  # For multi-tenant

# AWS S3 (Already configured)
AWS_S3_REGION=
AWS_S3_IAM_ACCESS_KEY=
AWS_S3_IAM_SECRET_KEY=
AWS_S3_FILES_BUCKET=
```

---

## 📦 Dependencies to Install

```bash
# Critical integrations
npm install twilio @getbrevo/brevo

# PDF generation
npm install jspdf
# or
npm install pdfkit

# Offline support (if not using built-in PWA features)
npm install workbox-webpack-plugin
npm install idb  # IndexedDB wrapper
```

---

## 🎯 Success Metrics (PRD Requirements)

Track these metrics to validate MVP:

- **Clicks to Revenue:** ≤3 clicks, 30 seconds from app open to campaign sent
- **Time-to-Value:** First SMS campaign sent within <10 minutes of onboarding
- **Activation Rate:** % of new signups who send their first "Daily Drop" within 48 hours
- **Sticky Feature:** % of users who log a "Quick-Add" member at least 3 times a week
- **Churn:** <5% monthly churn (target: <3%)

---

## 📝 Notes

- The foundation is solid (database, UI, basic structure)
- The critical missing pieces are **integrations** (Twilio, Brevo, Stripe Connect) and **automation** (background jobs, offline support)
- Once integrations are complete, the MVP will be functional for the Concierge Test
- French-specific features (VAT split, Loi Evin) should be prioritized after core functionality

---

**Last Updated:** January 29, 2026  
**Based on:** PRD.md v2.0 and current codebase analysis

---

## 🆕 Recent Updates (January 29, 2026)

### Admin Dashboard Redesign Completed
- **New Admin Pages:** Platform metrics dashboard, Caviste management, Inventory trends, Operations monitor
- **New Database Models:** WebhookLog, MessageQueueItem, SyncEvent for operations monitoring
- **Design System:** Minimalist Apple-style design applied across admin interface
- **Platform Metrics:** GMV calculation, Commission tracking (1.5%), Activation rate (% caves with campaign <48h)
- **Health Scoring:** Per-cave health scores based on activity, members, and subscribers
- **Operations Monitoring:** Webhook success rate, message queue depth, sync status indicators

**Note:** Admin dashboard UI is complete, but real-time data collection requires completion of SMS/Email and Stripe integrations to populate monitoring tables.
