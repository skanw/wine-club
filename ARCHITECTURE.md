# Architecture Document

This is a critical stage, and a robust architecture is the only way to avoid rebuilding the system later. However, the details you've provided under "Project Context" are too generic to design a real-world, highly specific system.

Before I provide a detailed, actionable architecture plan, I need clarification on the following variables. I will make assumptions for the initial plan based on your current project (**VinClub.fr**), but answering these questions will allow me to tailor the design for optimal performance and budget.

### ⚠️ **Clarification Required for VinClub.fr**

| Context Variable | Initial Assumption (Based on VinClub) | **Required Clarification** |
| :--- | :--- | :--- |
| **Project Type** | Mobile-First Web Application (PWA) | Do you need a dedicated *native* mobile app (iOS/Android), or is the PWA sufficient? |
| **Expected Scale** | Low-to-Medium | What is the target **peak RPS** (Requests Per Second)? (e.g., 5-10 RPS for campaigns, 100-200 users total) |
| **Key Requirements** | Real-time notifications, Subscription billing, SMS/Email Integrations. | What is the tolerance for *data latency* between the POS (e.g., Lightspeed) and VinClub? (e.g., 5 seconds, 5 minutes?) |
| **Constraints** | Budget-Conscious, Small Team (2-3 developers), Fast Time-to-Market (3-6 months). | Are there specific constraints on **cloud provider lock-in** (e.g., Must use AWS, Avoid GCP)? |

---

## 1. High-Level Architecture (Based on Assumptions)

I will proceed with a **Microservices-Oriented, Serverless-First** architecture, as this offers superior scalability, lower operational cost (OPEX), and better fault tolerance—all crucial for a subscription billing platform.

### Overall System Architecture (Conceptual)

The system is divided into three major functional domains (microservices/modules) that communicate asynchronously. 

| Component | Description |
| :--- | :--- |
| **Frontend/UX Layer** | Mobile-first Progressive Web App (PWA) designed for ease of use by Batiste (the Helper). |
| **API Gateway** | The single entry point for all client requests. Handles authentication and routing to the correct service. |
| **Core Service (Subscription/Billing)** | The financial heart. Manages Stripe webhooks, subscription lifecycle, and invoicing. |
| **Marketing Service (Engagement)** | The "Daily Drop" module. Manages contacts, tags, and handles Twilio/Brevo integration and queueing. |
| **Data Service (Inventory/CRM)** | The state manager. Manages user data, inventory updates, and GDPR compliance records. |
| **Asynchronous Message Bus** | Used for communication between services (e.g., "Subscription renewed" event triggers "Send invoice email" task). |

### Key Architectural Patterns and Principles

* **Microservices/Modular Monolith:** Separating the high-traffic marketing campaigns from the mission-critical billing logic ensures that a failure in one area (e.g., Brevo API outage) does not halt billing.

* **Asynchronous Communication:** Using a message queue (e.g., Redis, RabbitMQ, or cloud service like SQS) for tasks like sending 1,000 SMS messages or processing POS webhooks. This prevents the API from timing out.

* **Mobile-First Design (PWA):** Prioritizing a fast, phone-friendly experience for Batiste.

### Technology Stack Recommendations

| Component | Recommendation | Justification |
| :--- | :--- | :--- |
| **Backend/API** | **Node.js (TypeScript) / Express** or **Wasp (existing)** | Fast development time, excellent for I/O bound tasks (API calls, data fetching), strong community/ecosystem. TypeScript enforces type safety in a microservices environment. |
| **Frontend/PWA** | **React / Next.js or Vite** (Current stack: React/Wasp) | Optimized for component-based mobile development. Next.js provides server-side rendering (SSR) for fast initial loads and SEO (if a public landing page is used). |
| **Database** | **PostgreSQL** (via Supabase/Neon) | Strong transactional support, reliability, and excellent JSONB handling (for storing unstructured wine metadata). |
| **Messaging/Queue** | **Redis (managed service)** | Excellent for caching *and* managing a simple queue/rate limiting for high-volume SMS/Email blasts. |
| **Deployment** | **Vercel (Frontend) / AWS Lambda/ECS (Backend)** | Vercel simplifies PWA hosting. AWS provides scalable, cost-effective serverless options (Lambda) which match the budget constraint. |

---

## 2. System Components

### Frontend Architecture

The frontend should be a **Single Page Application (SPA)** wrapped as a PWA.

* **Language Requirement:** **The entire user interface (UI) must be entirely in French.** All labels, buttons, messages, error texts, tooltips, placeholders, navigation items, and user-facing content must be in French. This is a non-negotiable requirement for the French market.

* **State Management:** Use a modern library like Zustand or React Query/TanStack Query to handle API state and automatic caching/revalidation.

* **Offline Support:** Implement **service workers** to cache critical static assets and allow Batiste to *queue* actions (like logging a contact) when cellar signal is poor.

### Backend/API Architecture

* **API Gateway:** All external calls hit an API Gateway (e.g., AWS API Gateway). This handles rate limiting and token validation before any service logic executes.

* **Core Services (Microservices):**

    * `Billing-Service`: Handles all Stripe webhooks and payment logic.

    * `Marketing-Service`: Manages campaign queueing, contact list filtering, and Twilio/Brevo communication.

    * `Data-Service`: Handles CRUD operations for `Contact`, `Subscription`, and `Product` schemas.

### Database Design and Data Flow

* **Primary Database (PostgreSQL):** Used for all transactional data (Subscriptions, Invoices, User Credentials).

    * *Schema Criticality:* The `Subscription` table must be robust and immutable.

* **Data Flow Example (Daily Drop):**

    1.  Batiste inputs campaign data (Mobile App) $\rightarrow$ API Gateway $\rightarrow$ Marketing-Service.

    2.  Marketing-Service fetches target list (Contact IDs) from Data-Service.

    3.  Marketing-Service sends **single message** ("Run Campaign: ID 45") to the Redis Queue.

    4.  A separate **Worker Service** (e.g., AWS Lambda function triggered by the queue) pulls the message and handles the rate-limited dispatch to Twilio/Brevo.

### External Service Integrations

* **Stripe:** Integrate using webhooks for all payment events (success, failure, cancellation). The `Billing-Service` is the **only** service that processes these webhooks.

* **Twilio/Brevo:** Dedicated API keys used exclusively by the `Marketing-Service`. Implement strict rate limiting to avoid vendor blocklisting.

* **POS Integration (Phase 2):** Use an **Integration Service** wrapper. This service abstracts the complexity of different POS APIs (Lightspeed, Wino) and translates external data into the VinClub schema.

---

## 3. Scalability & Performance

* **Handling Growth:** The microservices/serverless approach provides horizontal scaling out-of-the-box. As the number of "Daily Drop" campaigns increases, only the `Marketing-Service` and the queue workers need to scale.

* **Performance Bottlenecks and Solutions:**

    * **Bottleneck:** Running large queries for contact filtering before a campaign (e.g., "All members who bought only Red Wine").

    * **Solution:** Use **Database Indexing** heavily on frequently queried columns (`Contact.tags`, `Contact.preferred_region`).

* **Caching Strategies:**

    * **Redis Caching:** Cache non-critical, frequently read data (e.g., pricing tiers, feature flags, basic contact lookup data).

    * **CDN (Content Delivery Network):** Vercel/Cloudfront ensures static PWA assets (CSS, JS, images) are served globally quickly.

* **Load Balancing:** Achieved automatically via the **API Gateway** (Load balancing across the multiple instances of the backend services).

---

## 4. Security Architecture

### Authentication and Authorisation Approach

* **Authentication (AuthN):** Use **JWT (JSON Web Tokens)** managed by an external provider (e.g., Auth0, Firebase Auth, or Supabase Auth). This is far more secure and less work than building custom auth.

* **Authorisation (AuthZ):** Implement **Role-Based Access Control (RBAC)** based on the roles defined in the initial MVP (`OWNER`, `MANAGER`, `HELPER`). All API endpoints must check the JWT payload for the user's role and tenant ID before processing.

### Data Protection and Encryption

* **Data at Rest:** All PostgreSQL data must be encrypted (standard for AWS/Supabase).

* **Data in Transit:** Enforce **HTTPS/TLS 1.2+** for all communication (API Gateway requirement).

* **Sensitive Data:** Encrypt contact phone numbers and emails in the database using strong encryption (e.g., AES-256) if regulations require it beyond standard DB encryption.

### API Security Considerations

* **Input Validation:** Sanitize and validate all API inputs to prevent injection attacks (SQL, XSS).

* **Rate Limiting:** Implement aggressive rate limiting on the API Gateway for login/signup endpoints to prevent brute-force attacks.

### Common Security Vulnerabilities and Mitigations

* **OWASP Top 10:** Regular security scanning (e.g., Snyk) of the codebase and dependencies is mandatory.

* **Tenant Isolation:** Enforce **Row-Level Security (RLS)** in PostgreSQL to prevent data leaks between different wine caves. This is critical for the multi-tenant architecture.

---

## 5. Development & Deployment

### Development Environment Setup

* **Local Environment:** Use **Docker/Compose** for database and service emulation to ensure parity between dev and production.

* **Version Control:** Git Flow branching strategy (Feature branches merged into develop, then into main/production).

### CI/CD Pipeline Architecture

* **CI (Continuous Integration):** GitHub Actions or GitLab CI.

    1.  Code Commit $\rightarrow$ Run Unit/Integration Tests (Vitest, Playwright).

    2.  Security Scanning (Snyk/LGTM).

    3.  Static Code Analysis (ESLint/Prettier).

* **CD (Continuous Delivery):**

    1.  Successful build triggers automated deployment to **Staging** environment.

    2.  Manual QA/UAT (User Acceptance Testing) is required on Staging.

    3.  Approved builds deploy to **Production** (Zero-downtime deployment strategy).

### Deployment Strategy

* **Cloud Provider:** **AWS (Amazon Web Services)** is recommended for its maturity, global presence, and extensive serverless offerings (Lambda, SQS, RDS).

* **Serverless Deployment:** Deploy business logic as **AWS Lambda Functions** triggered by the API Gateway or SQS. This scales down to zero when inactive, minimizing OPEX (cost).

### Monitoring and Logging Approach

* **Logging:** Centralized logging using the **ELK Stack (Elasticsearch, Logstash, Kibana)** or AWS CloudWatch. All microservices must log transaction IDs and error details.

* **Monitoring:** Use **Prometheus/Grafana** for collecting system metrics (CPU, Memory, Latency) and **Sentry** for capturing application-level errors and exceptions.

* **Alerting:** Set up automated alerts for critical business metrics (e.g., Stripe webhook failure rate > 1%, Uptime < 99.9%).

---

## 6. Alternative Approaches

| Approach | Pros | Cons | Recommendation Verdict |
| :--- | :--- | :--- | :--- |
| **A. Monolith (Single Node.js App)** | Simplest to start, easier debugging, lower operational overhead. | Difficult to scale individual features (e.g., Marketing blasts overwhelm Billing). High risk of total failure. | Viable for initial MVP, but requires immediate refactoring. |
| **B. Serverless Microservices (Recommended)** | Scales infinitely and cost-effectively. Fault isolation (a bug in SMS won't crash billing). Lowest OPEX. | Higher initial setup complexity, debugging distributed systems is hard, potential vendor lock-in (AWS/GCP services). | **RECOMMENDED.** Best trade-off between scale, cost, and fault tolerance for a subscription platform. |
| **C. PHP/Python Monolith (Django/Laravel)** | Excellent existing framework and ecosystem. Simple to deploy to a single VPS. | Less native scaling/serverless support. Requires manual management of container orchestration (Kubernetes/ECS), increasing OPEX/complexity for a small team. | Avoid. Too heavy for this use case. |

**Recommendation:** **Approach B (Serverless Microservices)** provides the best foundation. Although the initial setup is complex, using existing tools like **Wasp** (which simplifies the full-stack setup) and managed services (Supabase/AWS) offsets the traditional complexity of microservices.

---

## 7. Implementation Phases

The architecture must be implemented using the **"Marketing Wedge"** strategy (Pillar 2) first.

| Phase | Duration | Focus / Key Deliverables | Dependencies | MVP |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Foundation & Wedge** | 4 Weeks | Core Data Service, Auth/RBAC, Stripe Integration, **"Quick-Add"** Form, **"Daily Drop"** Broadcast (MVP complete). | None (Stand-alone value). | YES |
| **Phase 2: Automation & Compliance** | 6 Weeks | Marketing-Service Queuing (Twilio/Brevo rate limiting), Full Subscription Engine, **GDPR Logging**, Basic Analytics (MRR/Campaign Success). | Phase 1 services running stably. | NO (Production Ready) |
| **Phase 3: Ecosystem & Scale** | 3 Months+ | POS Integration Service (Lightspeed API), Helper Mobile PWA enhancements (offline mode), Advanced Filtering/Segmentation, External Reporting/FEC Exports. | Strong user base required for integration funding. | NO (Growth) |

---

**Final Check:** This architecture supports the core goals: **1) Simple UX for Batiste (PWA), 2) High reliability for Pierre's money (Microservices/Stripe), and 3) Low OPEX (Serverless).**
