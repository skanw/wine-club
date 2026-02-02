# VinClub Implementation Roadmap

**Last Updated:** December 11, 2025  
**Status:** In Progress - MVP Phase 1 (Pre-Concierge Test)

This document tracks the implementation status of features from the PRD v2.0 and outlines remaining work to complete the MVP. Updated based on current codebase analysis and strategic PRD refinements.

---

## 📊 Overall Progress

- **Core Features:** 60% Complete
- **Integrations:** 20% Complete (Twilio/Brevo stubs only, Stripe webhooks exist but subscription creation missing)
- **Automation:** 30% Complete (background jobs not implemented)
- **Compliance:** 50% Complete (basic GDPR, missing Loi Evin, double opt-in)
- **Offline-First:** 0% Complete (critical for cellar environments)
- **French-Specific Features:** 30% Complete (VAT split handling, Loi Evin templates missing)

---

## ✅ Implemented Features

### A. Quick-Add Member Form (Mobile Web)
- ✅ Mobile-optimized form with all required fields
- ✅ Name, Mobile Number, Email, "Favorite Region" (Tag) fields
- ✅ Duplicate checking (phone/email within cave)
- ✅ GDPR consent fields (consentEmail, consentSms)
- ✅ Form validation with Zod schemas
- ✅ Multi-tenant isolation (caveId filtering)
- ✅ Basic consent logging (consentGdprLoggedAt)
- ❌ **MISSING:** Welcome SMS automation (TODO at line 309 in `member/operations.ts`)
- ❌ **MISSING:** Offline queuing (form submission when cellar has no signal)
- ❌ **MISSING:** Double opt-in for email (verification email required)

### B. Daily Drop Broadcast Tool
- ✅ Campaign creation form (mobile-friendly)
- ✅ Photo upload capability (S3 integration)
- ✅ Product name, price, message fields
- ✅ Audience selection (All Members, Tags, Region)
- ✅ Campaign status tracking (draft, sending, sent)
- ✅ Image upload to S3 with validation
- ✅ Campaign list and detail pages
- ✅ Max quantity field (for sold-out prevention)
- ❌ **MISSING:** Actual SMS/Email sending (Twilio/Brevo not implemented - stubs only)
- ❌ **MISSING:** Background job processing for message delivery (TODOs at lines 267, 356)
- ❌ **MISSING:** "Clicks to Revenue" metric tracking (target: ≤3 clicks, 30 seconds)
- ❌ **MISSING:** Loi Evin compliance (pre-vetted templates, content validation)
- ❌ **MISSING:** Offline queuing (campaign creation when cellar has no signal)

### C. Subscription "Box" Engine
- ✅ Subscription plan creation and management
- ✅ Subscription CRUD operations
- ✅ WineBox model with status tracking (pending, packed, shipped, ready_for_pickup)
- ✅ Basic packing list page UI
- ✅ Stripe webhook handlers (for invoice.paid, subscription.updated, subscription.deleted)
- ✅ Auto-creation of WineBox records on payment (webhook handler exists)
- ✅ Billing cycle calculation (nextBillingDate)
- ❌ **MISSING:** Stripe Connect subscription creation (TODOs at lines 389, 486, 529 in `subscription/operations.ts`)
- ❌ **MISSING:** "Sans Engagement" (one-click cancel/pause for end-customers)
- ❌ **MISSING:** French VAT (TVA) split handling (wine 20% + food 5.5%/10% in same box)
- ❌ **MISSING:** PDF generation for packing list (mobile-friendly, printable)
- ❌ **MISSING:** Bulk status updates (mark multiple boxes as packed)
- ❌ **MISSING:** Payment failure handling (automatic polite email/SMS to update card)

---

## ❌ Missing Critical Features

### 🔴 CRITICAL PRIORITY (Blocking MVP)

#### 0. Offline-First Architecture
**Status:** Not Started  
**Files:**
- `src/client/` (needs service worker setup)
- All form components (need offline queuing)

**Why Critical:** Wine cellars are underground with poor 4G/5G signal. Batiste must be able to queue actions when offline.

**Tasks:**
- [ ] Implement Service Worker for PWA offline support
- [ ] Add IndexedDB/localStorage for offline data storage
- [ ] Implement offline queue for form submissions (Add Member, Create Campaign)
- [ ] Add sync mechanism when connectivity returns
- [ ] Optimistic UI updates ("Message Sent!" even when offline)
- [ ] Conflict resolution for simultaneous edits
- [ ] Test in cellar-like environments (poor signal)
- [ ] Add offline indicator in UI

**Impact:** Without this, the app fails in the primary use case (cellar environment). **BLOCKING FEATURE.**

**Estimated Time:** 3-4 days

---

### 🔴 HIGH PRIORITY

#### 1. SMS/Email Integration
**Status:** Not Started (stubs exist)  
**Files:** 
- `src/integrations/twilio/client.ts` (stub only, throws errors)
- `src/integrations/brevo/client.ts` (stub only, throws errors)

**Tasks:**
- [ ] Install packages: `npm install twilio @getbrevo/brevo`
- [ ] Implement `sendSMS()` function in Twilio client
- [ ] Implement `sendEmail()` function in Brevo client
- [ ] Add environment variables for API keys:
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_PHONE_NUMBER`
  - `BREVO_API_KEY`
  - `BREVO_SENDER_EMAIL`
  - `BREVO_SENDER_NAME`
- [ ] Handle STOP replies (GDPR compliance) - webhook endpoint
  - Create API route for Twilio webhook
  - Update member `consentSms: false` when STOP received
  - Log unsubscribe event
- [ ] Handle email bounces/unsubscribes - webhook endpoint
  - Create API route for Brevo webhook
  - Update member `consentEmail: false` on bounce/unsubscribe
  - Log unsubscribe event
- [ ] Add error handling and retry logic
- [ ] Implement rate limiting (SMS has strict limits)
- [ ] Add channel diversity fallback (Push Notifications, Email via AWS SES)
- [ ] Test SMS sending with Twilio test credentials
- [ ] Test email sending with Brevo test account
- [ ] Implement pass-through pricing model (SMS costs "Subject to carrier rates")

**Impact:** Campaigns cannot be sent without this. **BLOCKING FEATURE.**

**Estimated Time:** 2-3 days

---

#### 2. Background Job for Campaign Processing
**Status:** Not Started  
**Files:**
- `main.wasp` (needs job definition)
- `src/campaign/operations.ts` (TODOs at lines 267, 356)
- `src/campaign/jobs.ts` (needs to be created)

**Tasks:**
- [ ] Add job definition in `main.wasp`:
  ```wasp
  job processCampaignMessages {
    executor: PgBoss,
    perform: {
      fn: import { processCampaignMessages } from "@src/campaign/jobs"
    },
    entities: [Campaign, CampaignMessage, Member]
  }
  ```
- [ ] Create `src/campaign/jobs.ts` file
- [ ] Implement `processCampaignMessages` function:
  - Fetch pending CampaignMessages for a campaign
  - Process in batches (e.g., 50 at a time)
  - Call Twilio/Brevo APIs based on channel
  - Update message status (pending → sent → delivered/failed)
  - Update campaign statistics (deliveredCount, openedCount, clickedCount)
  - Handle rate limiting (SMS has strict limits)
  - Handle errors gracefully (retry failed messages)
- [ ] Replace TODO at line 267 in `createCampaign()` - queue job when `sendImmediately: true`
- [ ] Replace TODO at line 356 in `sendCampaign()` - queue job after creating messages
- [ ] Add job scheduling for retry of failed messages
- [ ] Test with small campaigns first

**Impact:** Campaigns are queued but never actually sent. **BLOCKING FEATURE.**

**Estimated Time:** 2-3 days

---

#### 3. Stripe Connect Subscription Integration
**Status:** Partially Implemented (webhooks exist, but subscription creation missing)  
**Files:**
- `src/subscription/operations.ts` (TODOs at lines 389, 486, 529)
- `src/payment/stripe/` (checkout exists, but subscription creation needed)

**Tasks:**
- [ ] Research Stripe Connect setup for multi-tenant (each cave needs Stripe account)
  - Determine Connect account type (Standard vs Express vs Custom)
  - Set up Connect onboarding flow for caves
- [ ] Implement Stripe subscription creation in `createSubscription()` (line 389):
  - Create Stripe customer if doesn't exist (or link to existing)
  - Create Stripe subscription with plan (monthly/quarterly billing cycle)
  - Store `stripeSubscriptionId` in database
  - Handle payment method collection (Stripe Elements)
  - Link subscription to cave's Stripe Connect account
- [ ] Implement subscription updates in `updateSubscription()` (line 486):
  - Update Stripe subscription when plan changes
  - Update Stripe subscription when status changes (pause/resume)
  - Handle prorating when plan changes mid-cycle
- [ ] Implement subscription cancellation in `cancelSubscription()` (line 529):
  - Cancel Stripe subscription (immediate or end of period)
  - Update local subscription status
  - Handle "Sans Engagement" - allow one-click cancel
- [ ] Implement payment failure handling:
  - Automatic polite email/SMS to update card when payment fails
  - Retry logic for failed payments
  - Grace period before subscription cancellation
- [ ] Verify webhook handlers work correctly:
  - `invoice.paid` → creates WineBox (already implemented in `stripe/webhook.ts`)
  - `subscription.updated` → updates subscription status (already implemented)
  - `subscription.deleted` → cancels subscription (already implemented)
  - `invoice.payment_failed` → trigger update card flow
- [ ] Test subscription lifecycle end-to-end
- [ ] Handle edge cases (payment failures, card updates, etc.)

**Impact:** Subscriptions cannot process payments automatically. **BLOCKING FEATURE.**

**Estimated Time:** 3-4 days

---

### 🟡 MEDIUM PRIORITY

#### 4. French VAT (TVA) Split Handling
**Status:** Not Started  
**Files:**
- `src/subscription/operations.ts` (invoice generation)
- Subscription plan/product models

**Why Important:** PRD requirement - subscription boxes may contain wine (20% VAT) and food items (5.5% or 10% VAT). This is a moat—US tools don't handle this.

**Tasks:**
- [ ] Add VAT code field to subscription plan/product models
- [ ] Implement split-VAT calculation logic:
  - Calculate VAT per item type
  - Sum correctly for invoice
  - Display split on invoice (required for French accounting)
- [ ] Update invoice generation to show VAT breakdown
- [ ] Test with mixed boxes (wine + terrine, etc.)
- [ ] Ensure accountant-friendly format

**Impact:** Required for French market compliance. Differentiator vs US competitors.

**Estimated Time:** 1-2 days

---

#### 5. Loi Evin Compliance (Alcohol Advertising)
**Status:** Not Started  
**Files:**
- `src/campaign/` (template system needed)
- `src/server/validation/campaign.ts` (content validation)

**Why Important:** PRD requirement - French law strictly regulates alcohol advertising. Pre-vetted templates protect merchants from fines.

**Tasks:**
- [ ] Research Loi Evin requirements:
  - Images cannot suggest social success or sexual appeal
  - Must be factual ("New Arrival: Notes of citrus and oak")
  - No lifestyle imagery
- [ ] Create library of pre-vetted SMS/Email templates
- [ ] Implement content validation:
  - Warn or block non-compliant content before sending
  - Check for prohibited words/phrases
  - Validate images (if possible)
- [ ] Add template selector in Daily Drop creator
- [ ] Add compliance badge/indicator in UI
- [ ] Document compliance features for sales pitch

**Impact:** Legal compliance requirement. Sales feature ("Protect your business from fines").

**Estimated Time:** 2 days

---

#### 6. "Sans Engagement" Subscription Cancellation
**Status:** Not Started  
**Files:**
- `src/subscription/` (need customer-facing cancel flow)
- Member portal (if exists) or subscription management page

**Why Important:** PRD requirement - French consumers fear subscription commitments. One-click cancel reduces fear and builds trust.

**Tasks:**
- [ ] Create customer-facing subscription management page
- [ ] Implement one-click "Pause" button
- [ ] Implement one-click "Cancel" button
- [ ] Add confirmation flow (prevent accidental cancellation)
- [ ] Handle cancellation types:
  - Immediate cancellation
  - End of period cancellation
- [ ] Send confirmation email/SMS after cancellation
- [ ] Update subscription status in Stripe and local DB
- [ ] Test cancellation flow end-to-end

**Impact:** Reduces French consumer fear. Required for PRD compliance.

**Estimated Time:** 1-2 days

---

#### 7. Welcome SMS on Member Creation
**Status:** Not Started  
**Files:**
- `src/member/operations.ts` (TODO at line 309)

**Tasks:**
- [ ] Implement welcome SMS sending when `sendWelcomeMessage: true`
- [ ] Create SMS template: "Merci [Name] ! Bienvenue chez [Cave Name]. Répondez STOP pour vous désabonner."
- [ ] Get cave name from context
- [ ] Handle errors gracefully (don't fail member creation if SMS fails)
- [ ] Log SMS sending attempts
- [ ] Add option in QuickAddForm to enable/disable welcome message
- [ ] Test with Twilio

**Impact:** Missing welcome automation as specified in PRD.

**Estimated Time:** 1 day

---

#### 8. Packing List PDF Generation
**Status:** Basic UI exists, PDF generation missing  
**Files:**
- `src/subscription/WineBoxPackingListPage.tsx` (basic list view only)

**Tasks:**
- [ ] Install PDF library: `npm install jspdf` or `pdfkit`
- [ ] Create PDF generation function:
  - Member name and contact info
  - Plan name and price
  - Billing cycle (YYYY-MM format)
  - Status (Pending/Packed/Shipped/Ready for Pickup)
  - Date created
  - Optional: QR code for tracking
- [ ] Add "Download PDF" button to packing list page
- [ ] Generate PDF for all boxes or filtered selection
- [ ] Mobile-friendly checklist view (enhance existing UI)
- [ ] Add filters (by status, billing cycle, etc.)
- [ ] Add bulk status update (mark multiple as packed)

**Impact:** Manual packing process; PRD requires PDF generation.

**Estimated Time:** 2 days

---

#### 9. GDPR Compliance Features (Enhanced)
**Status:** Partially Implemented  
**Files:**
- Various (consent logging exists, but missing some features)

**Tasks:**
- [ ] Implement double opt-in for email:
  - Send verification email on signup
  - Require click to confirm consent
  - Only mark `consentEmail: true` after confirmation
- [ ] Add "Right to be Forgotten" button in member settings:
  - Delete member data (soft delete already exists)
  - Remove from all campaigns
  - Cancel all subscriptions
  - Log deletion for audit
- [ ] Enhance consent logging:
  - Log consent changes with timestamps
  - Store consent method (form, SMS reply, etc.)
- [ ] Handle STOP replies automatically (part of SMS integration)
- [ ] Handle email unsubscribes automatically (part of email integration)
- [ ] Add privacy policy link in consent forms
- [ ] Add data export functionality (GDPR right to data portability)

**Impact:** Legal compliance requirement for French market.

**Estimated Time:** 2-3 days

---

#### 10. French Localization Audit
**Status:** Mostly Complete, needs verification  
**Files:**
- All UI components

**Tasks:**
- [ ] Audit all error messages (ensure French)
- [ ] Verify all toast notifications are in French
- [ ] Check all form labels and placeholders
- [ ] Verify email templates (if any)
- [ ] Check SMS templates
- [ ] Verify PDF content is in French
- [ ] Check console error messages (user-facing ones)
- [ ] Create checklist of all user-facing text

**Impact:** PRD requires 100% French UI.

**Estimated Time:** 1 day

---

### 🟢 LOW PRIORITY / POLISH

#### 11. Image Upload UX Improvements
**Status:** Backend works, frontend may need enhancement  
**Files:**
- `src/campaign/DailyDropCreator.tsx`
- `src/campaign/imageUpload.ts` (backend complete)

**Tasks:**
- [ ] Verify camera/photo picker works on mobile devices
- [ ] Add image preview before upload
- [ ] Add image cropping/resizing (optional)
- [ ] Show upload progress indicator
- [ ] Handle upload errors gracefully with user-friendly messages
- [ ] Add image compression before upload (reduce file size)
- [ ] Test on iOS and Android browsers

**Impact:** Feature exists but may need UX improvements.

**Estimated Time:** 1 day

---

#### 12. Code Quality Improvements
**Status:** Identified in CODE_REVIEW.md  
**Files:**
- Various

**Tasks:**
- [ ] Fix type safety issues (replace `any` types):
  - `src/campaign/operations.ts:489` - `fetchAudienceMembers` context parameter
  - `src/subscription/operations.ts:398` - similar issues
- [ ] Add debouncing to member search (MemberListPage.tsx)
- [ ] Add error boundaries for better error handling
- [ ] Improve loading states in UI
- [ ] Add runtime validation for JSON fields (audience, channels)
- [ ] Remove code duplication in authorization checks

**Impact:** Better code maintainability and user experience.

**Estimated Time:** 2 days

---

## 📋 Implementation Order (Recommended)

### Phase 0: Concierge MVP (Validation - 2-4 Weeks)
**Goal:** Validate demand before scaling technology (Harvard Guide principle)

**Week 1-2: Manual Process**
- [ ] Export top 50 customers from a test cave
- [ ] Create simple "Wizard of Oz" form (Typeform or basic web page)
- [ ] Manually send SMS via Twilio script when Batiste submits
- [ ] Measure: Does Batiste use it next week without being asked?
- [ ] Measure: Do customers walk in and say "I got the text"?

**Success Criteria:** If Batiste doesn't use it, friction is too high. If he does, you have Product-Market Fit on usage side.

### Phase 1: Core Functionality (Weeks 1-4)

**Week 1: Offline-First + SMS/Email**
1. **Day 1-2:** Offline-First Architecture
   - Service Worker setup
   - IndexedDB/localStorage
   - Offline queue implementation
   - Test in poor signal conditions

2. **Day 3-4:** SMS/Email Integration
   - Install packages
   - Implement Twilio client
   - Implement Brevo client
   - Webhook endpoints for STOP/bounces
   - Test sending

**Week 2: Background Jobs + Welcome SMS**
1. **Day 1-3:** Background Job Processing
   - Create job definition in `main.wasp`
   - Implement message processing
   - Queue jobs from campaign operations
   - Test end-to-end campaign sending

2. **Day 4-5:** Welcome SMS + "Clicks to Revenue" Tracking
   - Implement welcome message
   - Add metric tracking (≤3 clicks, 30 seconds)
   - Test with member creation

### Phase 2: Payment Integration (Weeks 3-4)

**Week 3: Stripe Connect**
1. **Day 1-2:** Stripe Connect Setup
   - Research Connect account types
   - Set up onboarding flow

2. **Day 3-5:** Subscription Integration
   - Implement subscription creation
   - Implement updates and cancellation
   - Payment failure handling
   - Test webhook handlers

**Week 4: French Compliance**
1. **Day 1-2:** French VAT Split Handling
   - Implement split-VAT calculation
   - Update invoice generation

2. **Day 3-4:** Loi Evin Compliance
   - Create pre-vetted templates
   - Implement content validation

3. **Day 5:** "Sans Engagement" Cancellation
   - Customer-facing cancel flow
   - One-click pause/cancel

### Phase 3: Polish & Compliance (Weeks 5-6)

**Week 5: Enhanced Features**
1. **Day 1-2:** PDF Generation
   - Implement packing list PDF
   - Enhance UI with filters/bulk actions

2. **Day 3-4:** Enhanced GDPR Compliance
   - Double opt-in for email
   - Right to be Forgotten
   - Enhanced consent logging
   - Data export functionality

3. **Day 5:** French Localization Audit
   - Verify all text is in French
   - Fix any English text found

**Week 6: Final Polish**
1. **Day 1-2:** Code Quality Improvements
   - Fix type safety
   - Add debouncing
   - Improve error handling

2. **Day 3-4:** UX Improvements
   - Image upload enhancements
   - Loading states
   - Error boundaries
   - "Clicks to Revenue" optimization

3. **Day 5:** Final Testing & Documentation
   - Comprehensive testing
   - Update documentation
   - Prepare for Pilot Cohort (10 Design Partners)

---

## 💰 Business Model Implementation

### Hybrid Revenue Model (PRD Requirement)

The PRD specifies a hybrid "SaaS + Fintech" model:

1. **Recurring SaaS Fee (€49/mo)**
   - Status: Not implemented
   - Tasks:
     - [ ] Create billing system for SaaS subscription
     - [ ] Set up Stripe billing portal for cave owners
     - [ ] Implement subscription tiers (if any)
     - [ ] Handle subscription renewals
     - [ ] Handle subscription cancellations

2. **Success Fee (1.5% of Subscription Volume)**
   - Status: Not implemented
   - Tasks:
     - [ ] Track subscription volume per cave
     - [ ] Calculate success fee on each subscription payment
     - [ ] Invoice cave owners for success fees (monthly)
     - [ ] Display success fee in dashboard/analytics
     - [ ] Handle fee disputes/refunds

3. **Pass-Through Revenue (SMS Credits)**
   - Status: Not implemented
   - Tasks:
     - [ ] Create SMS credit system
     - [ ] Set up credit purchase flow
     - [ ] Track credit usage per SMS sent
     - [ ] Implement 30% margin pricing (Cost ~€0.045 -> Sell €0.07)
     - [ ] Display credit balance in UI
     - [ ] Handle low credit warnings

**Estimated Time:** 3-4 days (after Stripe Connect is set up)

---

## 🎯 Quick Wins (Can be done immediately)

These are small improvements that can be done quickly:

1. **Add debouncing to member search** (30 min)
   - File: `src/member/MemberListPage.tsx`
   - Use existing `useDebounce` hook

2. **Fix type safety - replace `any` types** (1-2 hours)
   - Files: `src/campaign/operations.ts:489`, `src/subscription/operations.ts:398`
   - Add proper types for context parameters

3. **Improve error messages** (1 hour)
   - Ensure all errors are user-friendly and in French
   - Add error boundaries

4. **Add loading states** (1-2 hours)
   - Improve UX during async operations
   - Add skeleton loaders

5. **Enhance packing list UI** (2-3 hours)
   - Add filters (by status, billing cycle)
   - Add bulk actions (mark multiple as packed)
   - Improve mobile view

6. **Add "Clicks to Revenue" tracking** (1 hour)
   - Track clicks from app open to campaign sent
   - Display metric in campaign creation flow
   - Log to analytics for optimization

7. **Add offline indicator** (30 min)
   - Show connection status in UI
   - Display queued actions count when offline
   - Simple visual indicator (badge/icon)

---

## 📝 Notes

### Environment Variables Needed
Add these to your `.env` file:
```
# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Brevo
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=

# Stripe (for subscriptions - Stripe Connect)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CONNECT_CLIENT_ID=  # For multi-tenant

# AWS S3 (already configured)
AWS_S3_REGION=
AWS_S3_IAM_ACCESS_KEY=
AWS_S3_IAM_SECRET_KEY=
AWS_S3_FILES_BUCKET=
CDN_BASE_URL=  # For image URLs

# Database (Supabase - EU region required for GDPR)
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Testing Checklist

**Critical Path Testing:**
- [ ] Test offline functionality in cellar-like environment (poor signal)
- [ ] Test SMS sending with Twilio test credentials
- [ ] Test email sending with Brevo
- [ ] Test campaign creation and sending end-to-end
- [ ] Verify "Clicks to Revenue" metric (≤3 clicks, 30 seconds)
- [ ] Test subscription creation with Stripe Connect test mode
- [ ] Test webhook handlers (invoice.paid, subscription.updated, etc.)
- [ ] Test payment failure handling
- [ ] Test "Sans Engagement" cancellation flow

**Compliance Testing:**
- [ ] Test GDPR compliance features (double opt-in, Right to be Forgotten)
- [ ] Test Loi Evin content validation
- [ ] Test French VAT split calculation
- [ ] Verify all data stored in EU regions (GDPR requirement)

**Platform Testing:**
- [ ] Test on mobile devices (iOS and Android)
- [ ] Test PWA installation and offline mode
- [ ] Test on various screen sizes (mobile-first)
- [ ] Test PDF generation and printing
- [ ] Test error handling and edge cases
- [ ] Test concurrent user scenarios (multiple staff members)

**Performance Testing:**
- [ ] Load time < 1 second (PRD requirement)
- [ ] Test with large member lists (1000+ members)
- [ ] Test campaign sending to large audiences
- [ ] Test database query performance with indexes

### Dependencies to Install
```bash
# Core integrations
npm install twilio @getbrevo/brevo

# PDF generation
npm install jspdf
# or
npm install pdfkit

# Offline support (if not using built-in PWA features)
npm install workbox-webpack-plugin
npm install idb  # IndexedDB wrapper

# Analytics (for "Clicks to Revenue" tracking)
# Already have analytics setup, may need to add custom events
```

### Key Metrics to Track (PRD Requirements)

- **Clicks to Revenue:** Daily Drop campaign creation in ≤3 clicks from app open
- **Time-to-Value:** First SMS campaign sent within <10 minutes of onboarding
- **Activation Rate:** % of new signups who send their first "Daily Drop" within 48 hours
- **Sticky Feature:** % of users who log a "Quick-Add" member at least 3 times a week
- **Churn:** <5% monthly churn (target: <3% due to data lock-in)
- **Negative Net Churn:** Revenue grows even with customer churn
- **Inventory Turn Velocity:** Increase in inventory turn rate after VinClub adoption
- **Average Order Value (AOV):** Increase in AOV due to personalized upselling

---

## 🔄 Update Log

- **2025-12-11:** Initial roadmap created based on PRD analysis
- **2025-12-11:** Updated based on PRD v2.0 strategic refinements:
  - Added offline-first architecture as critical priority
  - Added French-specific features (VAT split, Loi Evin)
  - Added "Sans Engagement" subscription cancellation
  - Added Concierge MVP phase
  - Updated priorities based on strategic requirements
  - Added "Clicks to Revenue" metric tracking
  - Enhanced testing checklist with compliance requirements

---

## 📚 Related Documents

- [PRD.md](./PRD.md) - Product Requirements Document
- [CODE_REVIEW.md](./CODE_REVIEW.md) - Code review findings
- [API-DESIGN.md](./API-DESIGN.md) - API design documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture

