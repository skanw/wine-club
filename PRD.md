# Product Requirements Document (PRD)

**Product Name:** VinClub  

**Domain:** [vinclub.fr](https://www.google.com/search?q=https://vinclub.fr)  

**Version:** 2.0 (The "Revenue Engine" - Strategic Refinement)  

**Status:** In Development  

**Date:** December 11, 2025  

**Author:** Product Team  
**Strategic Review:** Based on Harvard OTD Framework & Market Analysis

-----

## 1. Executive Summary

**VinClub** is a specialized **"Revenue & Membership Engine"** for independent French wine caves. We occupy the **"Middle Layer"** of the retail tech stack—a space currently unoccupied by heavy POS incumbents (Wino, Melkal) and generic marketing automation tools (Brevo, Mailchimp).

**Strategic Positioning: "Side-Car" Strategy**

Unlike competitors who require a "rip-and-replace" sale, VinClub runs **alongside** existing POS infrastructure. We are not an ERP. We are not a POS. We are the **"System of Intelligence"** that connects the Record (Purchase History) with Engagement (SMS/Email), enabling merchants to monetize loyalty without changing their cash register.

**Key Value Proposition:**

"Don't change your POS. Don't count your stock. Just use VinClub to sell more wine instantly."  

**The "Wedge" Entry Point:** We enter through a small, high-value crack (subscriptions and instant alerts) rather than trying to replace the entire system. Once installed and generating revenue, VinClub becomes sticky, creating expansion opportunities.

**Target Market:**

**Serviceable Addressable Market (SAM):** ~2,400-2,800 "Proximity" caves—neighborhood shops in residential areas whose survival depends on "Regulars." These shops use modern POS systems (Melkal, CashMag, Wino) but lack marketing automation.

**Market Dislocation:** The widening gap between digital expectations of premium wine consumers (trained by "Le Petit Ballon") and the analog reality of independent merchants. VinClub is the "Arms Dealer" to the resistance, giving merchants the tech to compete with e-commerce while preserving their physical relationship advantage.

-----

## 2. Problem Statement

### The Core Problem: The "Revenue Gap"

Independent merchants are bleeding recurring revenue. This is not due to lack of product quality or customer desire, but due to **friction**. The specific problem is that merchants lack a simple mechanism to monetize loyalty.

**The "Time-to-Notification" Failure:**

Consider the mechanics: A merchant receives a pallet of limited-allocation Burgundy. In the current workflow, notifying the 20 customers who love this producer requires:

1. Identifying them (Mental recall or searching a notebook)
2. Finding their contact info (Excel or archaic CRM)
3. Drafting a message (Email or SMS)
4. Executing the send (Brevo or personal phone)

**This process takes hours. Consequently, it often doesn't happen.** The wine sits on the shelf, tying up working capital. VinClub proposes to reduce this "Time-to-Notification" from **hours to seconds**. This is not just an efficiency gain; it is a **liquidity event** for the business.

### Specific Pain Points (Validated via User Interview & Market Research)

1.  **Tech Overwhelm:** Staff find existing marketing tools (Brevo) "very hard to understand" and "too much choice." The desktop-first interface requires going behind the counter, breaking workflow.

2.  **Missed Revenue:** New arrivals sit on shelves because notifying customers takes too much effort. Inventory turn velocity is low, tying up working capital.

3.  **Subscription Chaos:** Managing monthly "Wine Boxes" is done via spreadsheets and manual phone calls, leading to errors and payment friction. The "awkwardness" of chasing declined cards damages relationships.

4.  **Data Silos:** Sales data lives in the POS (Melkal), but customer contact info lives on paper or in a separate email list. Manual export/import creates friction.

5.  **Regulatory Fear:** Merchants are terrified of GDPR fines. They know their current system (notebook or Excel) is non-compliant, but don't know how to fix it.

6.  **Existential Envy:** Merchants see customers receiving "Le Petit Ballon" boxes and feel they're leaving money on the table. They want to compete but believe they lack the technology.

### Market Opportunity: The "Middle Layer" Vacuum

The software market for retailers is polarized:

- **The Heavy Layer (Infrastructure):** POS Systems (Wino, Melkal) manage inventory, fiscal reporting, cash drawer. They are "Systems of Record"—necessary but clunky.
- **The Light Layer (Communication):** Email tools (Brevo), Social Media (Instagram). They are "Systems of Engagement"—broad but disconnected from transaction data.

**VinClub occupies the "Middle Layer":** A "System of Intelligence" that connects the Record (Purchase History) with Engagement (SMS/Email). Currently, this space is empty. To do what VinClub does, a merchant must manually export data from Wino and import it into Brevo. This friction is the killer.

**The "No Rip and Replace" Advantage:** POS migration is a nightmare (re-barcoding, retraining, fiscal data risk). By positioning VinClub as a "Side-car"—a companion app that runs alongside the POS—sales friction drops dramatically. The objection "I already have a system" is countered with "We know. Keep it. We just make it make money."

-----

## 3. Product Vision & Goals

**Long-Term Vision (3 Years):**

To become the standard "Membership Economy" layer for the European wine industry. Every independent shop uses their legacy POS for the *transaction*, but uses VinClub for the *relationship* (Loyalty, Subscriptions, Events). Eventually expand beyond wine to other premium proximity retail verticals (cheese mongers, butchers).

**Strategic Philosophy: Restraint**

- **Restraint in product:** Don't build a full POS. Focus on the wedge.
- **Restraint in sales:** Don't rip and replace. Run alongside.
- **Restraint in funding:** Don't over-raise. Bootstrap to profitability.

**Key Objectives (Phase 1 - "Concierge MVP"):**

1.  **Remove Friction:** Reduce the time to send a "New Wine Arrival" SMS from 30 minutes (Brevo) to **3 clicks, 30 seconds** (VinClub). The metric is **"Clicks to Revenue"**—Brevo requires 20+ clicks and 15 minutes; VinClub requires 3 clicks and 30 seconds.

2.  **Automate MRR:** Enable caves to generate €1k+ in Monthly Recurring Revenue (MRR) via subscriptions with zero manual billing. Subscriptions must be **"Sans Engagement"** (no commitment) to reduce French consumer fear.

3.  **Prove Value:** Demonstrate positive ROI within the first 30 days of use. The "Concierge Test" validates demand before scaling technology.

4.  **Compliance as a Service:** Convert regulatory burden (GDPR, Loi Evin) into a sales feature. Merchants aren't just buying software; they're buying an insurance policy against fines.

**Success Metrics:**

  * **Time-to-Value:** First SMS campaign sent within <10 minutes of onboarding.

  * **Clicks to Revenue:** Daily Drop campaign creation in ≤3 clicks from app open.

  * **Adoption:** 50% of active users send at least one campaign per week.

  * **Sticky Feature:** % of users who log a "Quick-Add" member at least 3 times a week.

  * **Churn:** <5% monthly churn (target: <3% due to data lock-in).

  * **Negative Net Churn:** Revenue grows even with customer churn due to success fee model (merchants grow subscriber base).

-----

## 4. Target Users & Personas

### Primary Persona: "Batiste" (The Helper/Manager) - THE USER

**Profile:** Young, passionate about wine, perhaps an aspiring sommelier. Not a technologist.

**Demographics:** 25-35 years old, digital native but "workplace pragmatist."

**Environment:** 
- Stands for 8 hours a day
- Hands are often cold (cellar temp) or dirty (dusty bottles)
- Constantly interrupted by customers
- Works in physical cellars (underground, thick stone walls, poor 4G/5G signal)

**Role:** Runs the shop floor, unpacks boxes, advises customers.

**Device:** Uses his **smartphone** 80% of the time; laptop only for heavy admin.

**The "Thumb" Requirement:** Batiste needs a tool he can use with **one hand (the thumb)** while holding a case of wine with the other. A desktop interface requires him to go behind the counter, breaking his flow. A mobile app allows him to work in the flow.

**Frustrations:** 
- Hates administrative friction. Writing a newsletter is a chore that takes him away from his passion: talking about wine.
- Finds Brevo templates confusing and desktop-first interface breaks workflow.
- Fears the "Social Embarrassment" of forgetting a regular customer's name or favorite region.

**Goal:** 
- Wants to finish tasks quickly so he can talk to customers or go home.
- Wants to look good to the owner by driving sales.
- Wants to be the hero who remembers customer preferences.

**Adoption Driver:** VinClub makes Batiste look good. When a customer walks in, VinClub reminds him: "This is Mme. Dupont, she likes Loire whites." He becomes the hero.

**Quote:** *"I want a button that just tells clients when we have new wine."*

**Workflow Example:**
- **09:30 - The Delivery:** A pallet arrives. Batiste unpacks it. He snaps a photo in the app. He selects the tag "Burgundy Lovers." He hits "Send SMS." 98% of the top 50 buyers see it instantly. 10% reply "Put one aside for me." Impact: Inventory turn velocity increases by an order of magnitude.

- **17:00 - The Rush:** A regular walks in. Batiste glances at the app. "Ah, Monsieur Martin! We just got a new vintage of that Pic Saint-Loup you bought last month." Impact: Average Order Value (AOV) increases due to personalized upselling.

### Secondary Persona: "Pierre" (The Owner) - THE BUYER

**Profile:** Risk-averse, financially focused, worried about the future of retail.

**Demographics:** 45-60 years old.

**Role:** Strategy, sourcing wines, paying bills.

**Pain Points:**
- **Cash flow volatility:** January and February are dead months in the wine trade. He stresses about making payroll.
- **Compliance anxiety:** Terrified of GDPR fines. Knows his current system (notebook or Excel) is non-compliant.
- **Regulatory fear:** Worried about Loi Evin violations (alcohol advertising restrictions).

**Value Proposition: Pierre buys "Sleep"**

- **Financial Sleep:** Subscriptions provide recurring revenue that covers the rent in bad months. Automated billing eliminates the "awkwardness" of chasing declined cards.
- **Legal Sleep:** VinClub handles the data compliance that he knows he is currently ignoring. Pre-vetted templates protect against Loi Evin violations.

**Goal:** 
- Wants recurring revenue ("stability") and loyal customers.
- Wants to protect his business from regulatory fines.
- Wants to compete with "Le Petit Ballon" without losing his physical relationship advantage.

**Constraint:** Will not buy software that requires replacing his 10-year-old POS setup.

**Adoption Driver:** ROI and Safety. The sales pitch to Pierre is financial ("Add €5k ARR this month") and regulatory ("Protect your business from fines").

**Workflow Example:**
- **End of Month - The Billing:** Current state: Pierre sits with an Excel sheet of subscribers. He manually types amounts into the credit card terminal. One card is declined. He has to call the customer. It is awkward. VinClub state: Automated billing runs in the background via Stripe. Failed payments trigger an automatic, polite email/SMS to update their card. Pierre does nothing. Impact: Hours of labor saved; "Awkwardness" eliminated.

**Critical Insight:** Successful vertical SaaS must satisfy both personas. If Batiste hates it, he won't use it, and churn occurs. If Pierre doesn't see ROI, he won't pay for it.

-----

## 5. Functional Requirements

### Core Features (The "Marketing Wedge" MVP)

#### A. The "Quick-Add" Member Form (Mobile Web)

  * **Requirement:** A simple, mobile-optimized capture form.

  * **Fields:** Name, Mobile Number, Email, "Favorite Region" (Tag).

  * **Logic:** instantly creates a profile in VinClub. Checks for duplicates.

  * **Automation:** Sends an immediate "Welcome" SMS with a link to a digital wallet pass (optional future scope) or simple "Thank you."

#### B. The "Daily Drop" Broadcast Tool

  * **Requirement:** A "No-Code" marketing tool designed for smartphones.

  * **User Flow:**

    1.  Batiste snaps a photo of a bottle.

    2.  Inputs: Name ("Chablis 2022"), Price ("€24"), Message ("Crisp, fresh, just arrived!").

    3.  Selects Audience: "All Members" or "White Wine Lovers".

    4.  Action: Click "Send".

  * **Backend:** Wraps Twilio/Brevo APIs. Handles unsubscribes automatically.

#### C. The Subscription "Box" Engine

  * **Requirement:** Manage recurring payments and logistics for wine clubs.

  * **Features:**

      * Create Plan: "Discovery Box" (€29/mo). Plans must support flexible billing cycles (monthly, quarterly).

      * **"Sans Engagement" (No Commitment):** Subscriptions must be cancelable with one click. This reduces French consumer fear (historically, cancelling subscriptions was bureaucratic). The platform must make "Pause" and "Cancel" one-click actions for end-customers to build trust.

      * **Stripe Connect Integration:** Auto-charge cards on the 1st of the month. Handle payment failures gracefully with automatic, polite email/SMS to update card. Eliminate the "awkwardness" of manual chasing.

      * **French VAT (TVA) Complexity:** Handle split-VAT rates in subscription boxes. A box may contain 2 bottles of wine (20% VAT) and a jar of terrine (5.5% VAT). The invoice must reflect this split correctly for the accountant. This is a moat—US tools don't handle this.

      * **The "Packing List":** Generates a PDF/Mobile checklist for Batiste: "Here are the 45 people who need a box this month." Must be printable and mobile-friendly for warehouse use.

      * **Status Tracking:** Mark as "Packed," "Shipped," or "Ready for Pickup." Bulk status updates for efficiency.

      * **Automated WineBox Creation:** When Stripe invoice.paid webhook fires, automatically create WineBox record for that billing cycle (YYYY-MM format).

### Advanced Features (Future Roadmap - Phase 2)

  * **POS Integration (Phased Approach):**
      * **Phase 1:** Loose Coupling. Manual CSV export/import. The Concierge Test relies on this.
      * **Phase 2:** One-Way Sync. Simple scripts that pull sales data from the POS export folder if available.
      * **Phase 3:** Deep Integration. Leveraging APIs of modern POS systems (like Wino) for real-time stock levels and auto-tagging customers (e.g., "Bought >€500").
      * **Strategic Note:** Integration is not a blocker for the Subscription feature (which is new revenue), only for the Loyalty feature (which relies on past data). The sales pitch should focus on Subscriptions first to bypass the integration objection.

  * **Events Module:** Ticket sales for tasting nights. Integration with calendar systems.

  * **Referral System:** "Give a bottle, Get a bottle" logic for members.

  * **Gift Cards:** Digital gift card system for members.

  * **Click & Collect:** Time slot booking for pickup orders.

### User Stories (MVP)

  * *As Batiste, I want to add a customer to the loyalty list in under 10 seconds while they are paying, so I don't hold up the line.*

  * *As Batiste, I want to send an SMS about a new arrival without logging into a computer, so I can do it from the warehouse.*

  * *As Pierre, I want to see a list of all unpaid subscriptions automatically, so I don't have to chase people for money.*

-----

## 6. Technical Requirements

### Platform Considerations

  * **Architecture:** SaaS (Multi-tenant) with strict data isolation.

  * **Frontend:** Mobile-First PWA (Progressive Web App). Must feel native on iOS/Android (React/Tailwind). **Offline-First Architecture is critical**—wine cellars are often underground with poor 4G/5G signal. The app must queue requests locally and sync when connectivity returns.

  * **Language:** **The entire user interface (UI) must be entirely in French.** All labels, buttons, messages, error texts, and user-facing content must be in French. This is a non-negotiable requirement for the French market. Avoid technical jargon (Segments, Churn, ARR). Use plain French (Clients, Box Money, Unsubscribed).

  * **Backend:** Node.js/Wasp (Current stack). Wasp handles boilerplate (Auth, Cron jobs, API routes), allowing focus on business logic.

  * **Database:** PostgreSQL (Supabase). Must be hosted in EU regions (Frankfurt/Paris) to satisfy GDPR data residency requirements. Row-Level Security (RLS) ensures Cave A never sees Cave B's members.

  * **Hosting:** Fly.io allows for edge deployment. Hosting application logic close to users (Paris region) ensures snappy performance, which is part of the "Thumb" advantage.

### Integration Requirements

  * **Stripe Connect:** Essential for handling payments on behalf of different merchants. Each cave needs a Stripe account for subscriptions. Handle payment method collection, subscription creation/updates/cancellation, and webhook processing (invoice.paid, subscription.updated, subscription.deleted).

  * **Twilio / Brevo:** For SMS/Email delivery. Must handle "STOP" replies for GDPR compliance. **Channel Diversity Strategy:** Build Push Notifications (PWA) and Email (AWS SES) as cheaper fallbacks. SMS pricing must be pass-through ("Subject to carrier rates") to avoid margin risk.

  * **Image Handling:** Fast upload and optimization (S3 or Supabase Storage) for the "Daily Drop" feature. Support base64 uploads from mobile camera.

  * **Offline Sync:** Implement sophisticated conflict resolution for offline-first architecture. When Batiste hits "Send" in the cellar, queue locally and sync when connectivity returns. Optimistic UI updates ("Message Sent!") provide immediate feedback.

### Security & Compliance

  * **GDPR ("Compliance as a Service"):**
      * **Double Opt-in for email:** Send verification email on signup. Require click to confirm consent. Only mark `consentEmail: true` after confirmation.
      * **Consent logging:** Log all consent changes with timestamps and method (form, SMS reply, etc.).
      * **"Right to be Forgotten" button:** Delete member data (soft delete), remove from all campaigns, cancel all subscriptions, log deletion for audit.
      * **Data export:** GDPR right to data portability—allow members to export their data.
      * **Data residency:** All data stored in EU regions (Frankfurt/Paris) to satisfy GDPR requirements.
      * **Value Proposition:** Convert regulatory burden into a sales feature. Merchants aren't just buying software; they're buying an insurance policy against CNIL (French Data Protection Authority) fines.

  * **Loi Evin (Alcohol Advertising Regulations):**
      * **Pre-vetted templates:** Provide templates that comply with Loi Evin. Images cannot suggest social success or sexual appeal. Must be factual ("New Arrival: Notes of citrus and oak").
      * **Content validation:** Warn or block non-compliant content before sending.
      * **Moat:** US competitors (Mailchimp/Subbly) don't have these templates. They don't know the law. This is a crucial differentiator for risk-averse owners.

  * **French VAT (TVA) Complexity:**
      * **Split-VAT handling:** Subscription boxes may contain wine (20% VAT) and food items (5.5% or 10% VAT). The invoice must reflect this split correctly.
      * **Automated invoicing:** Generate compliant invoices automatically. This is a massive time-saver for Pierre's accountant, making the accountant an unexpected ally/referral source.

  * **Payments:** PCI DSS compliance handled via Stripe Elements (no raw card data on our servers).

  * **Data Isolation:** Strict Row-Level Security (RLS) to ensure Cave A never sees Cave B's members. Multi-tenant architecture with `caveId` filtering throughout.

-----

## 7. Design & UX Considerations

**Principle 1: "The Thumb Rule"**

  * All primary actions (Add Member, Send Blast, Mark Packed) must be reachable with one thumb on a smartphone screen.

  * No complex data grids or spreadsheets on mobile.

**Principle 2: "Don't Make Me Think"**

  * **The entire UI must be entirely in French.** All interface elements, labels, buttons, navigation, error messages, success messages, tooltips, and help text must be in French. No English text should appear in the user interface.

  * Avoid technical jargon (Segments, Churn, ARR). Use plain French (Clients, Box Money, Unsubscribed).

  * Pre-written templates for SMS/Emails. Don't ask Batiste to write copy from scratch.

**Principle 3: "Speed over Power"**

  * Load time < 1 second. Performance is part of the "Thumb" advantage.

  * **Offline-First Architecture:** If the cellar has no signal, allow queuing the "Add Member" action and sync when connectivity returns. Optimistic UI updates provide immediate feedback. Implement conflict resolution for simultaneous edits.

  * **Clicks to Revenue:** The primary metric. Brevo requires 20+ clicks and 15 minutes. VinClub must require ≤3 clicks and 30 seconds from app open to campaign sent.

**Principle 4: "Compliance by Design"**

  * All features must be GDPR-compliant by default.
  * Pre-vetted templates for Loi Evin compliance.
  * French VAT logic baked into the core (not a plugin that breaks).

-----

## 8. Success Metrics & KPIs

### North Star Metric

**Gross Merchandise Value (GMV) Generated:** Total value of subscriptions + sales attributed to SMS campaigns run through the platform. This is the ultimate measure of revenue generation.

### Product KPIs

  * **Clicks to Revenue:** Daily Drop campaign creation in ≤3 clicks from app open. This is the primary UX differentiator.

  * **Time-to-Value:** First SMS campaign sent within <10 minutes of onboarding.

  * **Activation Rate:** % of new signups who send their first "Daily Drop" within 48 hours.

  * **Sticky Feature:** % of users who log a "Quick-Add" member at least 3 times a week.

  * **Subscription Reliability:** 100% success rate on Stripe webhooks (no missed payments).

  * **Negative Net Churn:** Revenue grows even with customer churn due to success fee model. If 5% of merchants churn but remaining 95% grow subscriber base by 20%, total revenue grows.

  * **Inventory Turn Velocity:** Measure increase in inventory turn rate after VinClub adoption (new arrivals sell faster).

  * **Average Order Value (AOV):** Track increase in AOV due to personalized upselling enabled by member history.

-----

## 9. Timeline & Milestones

### Phase 0: The "Concierge MVP" (Validation - 2-4 Weeks)

**Harvard Guide Principle:** Validate demand before scaling technology.

**The Protocol:**
  * Do not write billing code. Use a manual payment link or the existing POS terminal.
  * Go to Batiste physically. Export his top 50 customers.
  * Create a simple "Wizard of Oz" form (Typeform or simple web page) where Batiste uploads a photo and writes a text.
  * The founder manually sends the SMS via a Twilio script.
  * **The Metric:** Does Batiste use it next week without being asked? Does a customer walk in and say "I got the text"?

**Success Criteria:** If Batiste doesn't use it, the friction is still too high, or the value proposition is wrong. If he does, you have "Product-Market Fit" on the usage side.

### Phase 1: The "Marketing Wedge" MVP (Weeks 1-4)

  * **Week 1:** Design & Mobile UI implementation (Focus on "Quick-Add" and "Daily Drop"). Implement offline-first architecture.

  * **Week 2:** Twilio/Brevo API wrapper & Audience tagging logic. Background job processing for message delivery.

  * **Week 3:** Stripe Connect subscription logic & "Packing List" generation. French VAT handling.

  * **Week 4:** Beta testing with "Batiste" (User Acceptance Testing). Refine based on feedback.

### Phase 2: The "Pilot Cohort" (Weeks 5-8)

  * **Week 5:** Recruit 10 "Design Partners." Incentive: Waive SaaS fee for year 1. Keep Success Fee.

  * **Week 6:** Build "Social Proof" case studies. "Cave des Lilas added €4,000/month in revenue in 60 days."

  * **Week 7:** Implement Billing for the SaaS itself (Hybrid Model: €49/mo + 1.5% Success Fee + SMS credits).

  * **Week 8:** Production Hardening (Security audit, Load testing, GDPR compliance verification).

### Phase 3: Go-to-Market Launch (Weeks 9-12)

  * **Week 9:** Network Strategy—Salon des Vignerons Indépendants, Fédération des Cavistes Indépendants (FCI) partnerships.

  * **Week 10:** Public Launch (VinClub.fr). Focus on "Proximity" caves (2,400-2,800 SAM).

  * **Week 11-12:** Iterate based on early adopter feedback. Refine onboarding flow.

-----

## 10. Business Model

### Hybrid Revenue Model ("SaaS + Fintech")

**1. Recurring SaaS Fee (€49/mo):**
  * **Purpose:** Covers fixed costs (hosting, support). Filters out non-serious merchants.
  * **Psychology:** €49 is below the "pain threshold" of €50. It feels like a utility bill, not a major investment.
  * **Positioning:** Frame as "Marketing Fee" or "Apporteur d'Affaires" (Business Bringer), not "Transaction Fee" (French merchants are sensitive to margin erosion).

**2. Success Fee (1.0% - 2.0% of Subscription Volume):**
  * **Purpose:** The growth engine. VinClub only makes money when the merchant makes money. This aligns incentives perfectly.
  * **Economics:** If a shop generates €5,000/mo in subscriptions (100 members @ €50), the fee is €100. This is 2x the base SaaS fee.
  * **Magic:** Enables Negative Net Churn. Even if 5% of merchants churn, remaining merchants grow subscriber base, increasing total revenue.

**3. Pass-Through Revenue (SMS Credits):**
  * **Mechanism:** Sell credits at ~30% margin. Cost ~€0.045 -> Sell €0.07.
  * **Hidden Benefit:** Charging per SMS prevents spam. It forces Batiste to be selective, which keeps the channel high-quality and prevents customer opt-outs (Notification Fatigue).
  * **Pricing:** Must be pass-through ("Subject to carrier rates") to avoid margin risk if Twilio/WhatsApp changes pricing.

### Unit Economics

**Customer Acquisition Cost (CAC):** High in time (door-to-door sales). A founder might visit 5 shops to get 1 demo. Expected CAC: €500-€1000 per acquired merchant.

**Lifetime Value (LTV):** Once a merchant installs the subscription engine, switching costs are astronomical. They would have to migrate credit card tokens, which is terrifying. Expected retention: 5+ years. This justifies high upfront CAC.

**Projected ARR (Year 3):**
  * Active Caves: 350
  * Avg Subscribers/Cave: 75
  * Avg Sub Value: €40
  * SaaS Revenue: €205,800
  * Success Fees (1.5%): €189,000
  * SMS/Usage Margin: €60,000
  * **Total ARR: ~€455k** (with 2-3 person team, 70%+ margins)

## 11. Assumptions & Risks

### Key Assumptions

1.  **Willingness to Pay:** Merchants will pay ~€49/mo + 1.5% success fee for a tool that *only* handles marketing/subs, distinct from their POS. The "Compliance as a Service" angle (GDPR protection) adds value.

2.  **Helper Adoption:** Staff will actually use their personal/shop phones to do work tasks if the UX is good enough. The "Thumb" requirement and offline-first architecture are critical.

3.  **Data Entry:** Merchants will manually input the "New Arrival" data (Price/Name) because it is low volume (1-2 items/week), unlike full inventory management.

4.  **Consumer Behavior:** French consumers will accept "Sans Engagement" subscriptions (no commitment) due to Loi Hamon (2014) making cancellation easier. The one-click cancel reduces fear.

5.  **Network Effects:** Trade fairs (Salon des Vignerons Indépendants) and syndicates (FCI) can be leveraged for distribution. Suppliers (wine wholesalers) want retailers to survive and could be a channel.

### Risks & Mitigation

  * **Risk:** SMS Costs (Twilio is expensive in France). WhatsApp moving to per-conversation pricing.

      * *Mitigation:* Channel diversity (Push Notifications, Email via AWS SES as cheaper fallbacks). Pass-through pricing ("Subject to carrier rates"). Never lock in fixed SMS prices.

  * **Risk:** "Batiste" forgets to remove sold-out items from the "Daily Drop" offer.

      * *Mitigation:* Add a "Max Quantity" field to the campaign so it auto-stops when the limit is reached.

  * **Risk:** Wino/Legacy POS releases a competing feature.

      * *Mitigation:* Move faster and offer better UX. Legacy POS UX is historically terrible. Defense is Data—by the time Wino launches, VinClub has 2 years of granular preference data. "Do you want to lose your customer history by switching back to Wino's basic tool?" Data lock-in is the ultimate defense.

  * **Risk:** "Key Man" risk in sales. The model relies heavily on the Founder selling.

      * *Mitigation:* Create a "Reseller Program" early. Empower wine agents (who visit shops anyway to sell wine) to sell VinClub for a commission. They already have the trust.

  * **Risk:** Platform dependency (Twilio/WhatsApp changes pricing or policies).

      * *Mitigation:* Channel diversity. Build Push Notifications (PWA) and Email (AWS SES) as cheaper fallbacks. Never be dependent on a single channel.

  * **Risk:** Low TAM (~2,400-2,800 shops) limits scalability.

      * *Mitigation:* This is a feature, not a bug. A finite market allows for hyper-targeted sales and product design that generic competitors cannot match. Vertical SaaS can be highly profitable with small TAM. Year 3 ARR of €455k with 2-3 person team is life-changing for a founder, even if not a "Unicorn."

## 12. Go-to-Market Strategy

### The "Network" Strategy

**Cold calling wine shops is hard. Leveraging networks is easier.**

1. **Salons (Trade Fairs):** The Salon des Vignerons Indépendants is where merchants go. A booth is expensive, but walking the floor is free. Buy a bottle, ask "How is business? Is January tough?" Listen. Then offer: "I built a thing that helped a guy in the next town smooth out his cash flow. Want to see it?"

2. **Syndicates:** Partnering with the Fédération des Cavistes Indépendants (FCI). If VinClub can get an endorsement or partnership deal, credibility is instant.

3. **Suppliers:** Wine wholesalers want their retailers to survive. They could be a channel to distribute VinClub: "Use this tool so you can sell more of my wine."

4. **Reseller Program:** Empower wine agents (who visit shops anyway) to sell VinClub for a commission. They already have the trust.

### Sales Psychology: "Consultative Selling"

**For a technical founder, sales is the hardest hurdle.**

**Reframing:** Do not think of it as "Sales." Think of it as "User Research" or "Consulting."

**The Approach:** 
- Walk in. Buy a bottle. 
- Ask: "How is business? Is January tough?" 
- Listen. 
- Then offer: "I built a thing that helped a guy in the next town smooth out his cash flow. Want to see it?"

**Consultative Selling:** This low-pressure, peer-to-peer approach works better in the wine industry than aggressive SaaS sales tactics.

### Language & Positioning

**Tech founders speak of "Marketing Automation" and "CRM." Shop owners search for "Fidéliser clients" (Loyalty) and "Gestion abonnements" (Subscription management).**

**GTM Language:** VinClub must not market itself as a "SaaS Platform." It must market itself as a "Digital Loyalty Card" or a "Club Management Tool." The website copy must mirror the internal monologue of the owner: "Comment vendre plus à mes habitués?" (How to sell more to my regulars?).

## 13. Exit Strategy & Long-Term Vision

### Potential Acquirers (5-7 Year Horizon)

1. **POS Companies (Wino, SumUp):** To acquire the "Loyalty" layer they lack.

2. **Delivery Giants (UberEats, Deliveroo):** To penetrate the specialized alcohol retail market.

3. **Private Equity:** If cash flow is stable and recurring, PE firms love vertical SaaS aggregators. They look for mission-critical nature, low churn, high margins—all characteristics of VinClub.

4. **Strategic Acquisition:** Major distributors (Metro, France Boissons) want DTC data. Buying VinClub gives them data on who buys what at the retail level, optimizing their wholesale supply chain. The data value exceeds the SaaS revenue value.

### Expansion Strategy

**Beyond Wine:** Once proven in wine, expand to other premium proximity retail verticals:
- Cheese mongers (Fromageries)
- Butchers (Boucheries)
- Specialty food shops

The "Membership Engine" is platform-agnostic. The vertical-specific knowledge (Loi Evin, French VAT) becomes a moat.

-----

## 14. Critical Next Steps

**Immediate Actions:**

1. **Approve this PRD** to freeze the scope. The engineering team should immediately stop working on "Inventory CSV Imports" and pivot 100% to the "Daily Drop" mobile interface.

2. **Begin Concierge MVP:** Validate demand before scaling technology. Manual process, measure Batiste adoption.

3. **Secure Trademark:** Register "VinClub" (or chosen name) in France (INPI) immediately.

4. **Set Up Stripe Connect:** Begin Stripe Connect application process for multi-tenant payments.

5. **Configure Twilio/Brevo:** Set up test accounts and webhook endpoints for STOP replies and email bounces.

**Strategic Principle:** Speed is now the strategy. The window of opportunity is open before major POS players pivot to address this need. Move fast, but with restraint—focus on the wedge, not the entire door.
