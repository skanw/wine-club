# API Design Document

**Product:** VinClub  
**Version:** 1.0  
**Date:** December 11, 2025  
**Status:** In Development

---

## Table of Contents

1. [API Architecture Overview](#1-api-architecture-overview)
2. [Endpoint Design](#2-endpoint-design)
3. [Authentication & Authorization](#3-authentication--authorization)
4. [Data Modeling](#4-data-modeling)
5. [API Features](#5-api-features)
6. [Error Handling](#6-error-handling)
7. [Documentation Structure](#7-documentation-structure)
8. [Performance Considerations](#8-performance-considerations)
9. [Testing Strategy](#9-testing-strategy)
10. [Future Considerations](#10-future-considerations)

---

## 1. API Architecture Overview

### 1.1 Project Context

- **Application Type:** Multi-tenant SaaS Web Application (Mobile-First PWA)
- **API Type:** RESTful API with WebSocket support for real-time updates
- **Primary Use Cases:**
  - Member management (Quick-Add form)
  - Marketing campaign creation and dispatch (Daily Drop)
  - Subscription management and billing (Wine Box Engine)
  - Analytics and reporting
- **Expected Scale:** 
  - Low-to-Medium traffic: 5-10 RPS for campaigns
  - 100-200 total users (cave owners + helpers)
  - Peak: ~50 concurrent campaigns/month per cave
- **Data Relationships:** Multi-tenant architecture with strict data isolation. Core entities: Cave (tenant) → Members → Subscriptions → Campaigns → Messages

### 1.2 Architectural Approach

**RESTful API** is the primary interface, following these principles:

- **Resource-Based URLs:** Nouns represent resources, verbs are HTTP methods
- **Stateless:** Each request contains all necessary information
- **Cacheable:** Responses include appropriate cache headers
- **Layered System:** API Gateway → Microservices → Database

**API Gateway Pattern:**
- Single entry point: `https://api.vinclub.fr/v1`
- Handles authentication, rate limiting, request routing
- Routes to appropriate microservices:
  - `/members`, `/contacts` → Data-Service
  - `/campaigns`, `/messages` → Marketing-Service
  - `/subscriptions`, `/payments` → Billing-Service

### 1.3 Resource Identification and Naming Conventions

**Naming Conventions:**
- Use **plural nouns** for collections: `/members`, `/campaigns`, `/subscriptions`
- Use **kebab-case** for multi-word resources: `/wine-boxes`, `/packing-lists`
- Use **UUIDs** for resource identifiers: `/members/550e8400-e29b-41d4-a716-446655440000`
- Avoid verbs in URLs (use HTTP methods instead)

**URL Structure:**
```
https://api.vinclub.fr/v1/{resource}/{id}/{sub-resource}
```

**Examples:**
- `GET /v1/members` - List all members
- `GET /v1/members/{id}` - Get specific member
- `POST /v1/members` - Create new member
- `GET /v1/members/{id}/subscriptions` - Get member's subscriptions
- `POST /v1/campaigns/{id}/send` - Send campaign (exception: action endpoint)

### 1.4 Endpoint Organization

Endpoints are organized by functional domain:

| Domain | Base Path | Service |
|--------|-----------|---------|
| **Authentication** | `/v1/auth` | Auth-Service |
| **Members/Contacts** | `/v1/members` | Data-Service |
| **Campaigns** | `/v1/campaigns` | Marketing-Service |
| **Subscriptions** | `/v1/subscriptions` | Billing-Service |
| **Wine Boxes** | `/v1/wine-boxes` | Billing-Service |
| **Analytics** | `/v1/analytics` | Data-Service |
| **Settings** | `/v1/settings` | Data-Service |

---

## 2. Endpoint Design

### 2.1 Authentication Endpoints

#### POST `/v1/auth/login`
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "batiste@cave-example.fr",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "user": {
    "id": "user-uuid",
    "email": "batiste@cave-example.fr",
    "role": "HELPER",
    "cave_id": "cave-uuid",
    "name": "Batiste"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials
- `429 Too Many Requests` - Rate limit exceeded

---

#### POST `/v1/auth/refresh`
Refresh access token using refresh token.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "access_token": "new-token...",
  "expires_in": 3600
}
```

---

#### POST `/v1/auth/logout`
Invalidate refresh token.

**Response:** `204 No Content`

---

### 2.2 Member Management Endpoints

#### GET `/v1/members`
List all members for the authenticated cave.

**Query Parameters:**
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 20, max: 100) - Items per page
- `search` (string) - Search by name, email, or phone
- `tags` (string[]) - Filter by tags (e.g., `?tags=red-wine&tags=premium`)
- `preferred_region` (string) - Filter by preferred region
- `sort` (string, default: "created_at") - Sort field
- `order` (string, default: "desc") - Sort order (asc/desc)

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "member-uuid",
      "name": "Jean Dupont",
      "email": "jean@example.com",
      "phone": "+33612345678",
      "preferred_region": "Bordeaux",
      "tags": ["red-wine", "premium"],
      "consent_email": true,
      "consent_sms": true,
      "created_at": "2025-12-01T10:00:00Z",
      "updated_at": "2025-12-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "total_pages": 8
  }
}
```

---

#### POST `/v1/members`
Create a new member (Quick-Add form).

**Request:**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "phone": "+33612345678",
  "preferred_region": "Bordeaux",
  "tags": ["red-wine"],
  "consent_email": true,
  "consent_sms": true,
  "send_welcome_message": true
}
```

**Validation Rules:**
- `name`: Required, string, 1-100 characters
- `email`: Optional, valid email format, checked for duplicates
- `phone`: Required, E.164 format (+33612345678)
- `preferred_region`: Optional, string
- `tags`: Optional, array of strings
- `consent_email`: Required, boolean
- `consent_sms`: Required, boolean

**Response:** `201 Created`
```json
{
  "id": "member-uuid",
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "phone": "+33612345678",
  "preferred_region": "Bordeaux",
  "tags": ["red-wine"],
  "consent_email": true,
  "consent_sms": true,
  "created_at": "2025-12-11T14:30:00Z",
  "welcome_message_sent": true
}
```

**Error Responses:**
- `400 Bad Request` - Validation errors
- `409 Conflict` - Duplicate member (same phone/email)

---

#### GET `/v1/members/{id}`
Get specific member details.

**Response:** `200 OK`
```json
{
  "id": "member-uuid",
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "phone": "+33612345678",
  "preferred_region": "Bordeaux",
  "tags": ["red-wine", "premium"],
  "consent_email": true,
  "consent_sms": true,
  "subscriptions_count": 1,
  "total_spent": 450.00,
  "last_campaign_interaction": "2025-12-10T09:15:00Z",
  "created_at": "2025-12-01T10:00:00Z",
  "updated_at": "2025-12-11T14:30:00Z"
}
```

---

#### PATCH `/v1/members/{id}`
Update member information.

**Request:**
```json
{
  "name": "Jean Dupont Updated",
  "tags": ["red-wine", "premium", "vip"],
  "preferred_region": "Burgundy"
}
```

**Response:** `200 OK` (returns updated member object)

---

#### DELETE `/v1/members/{id}`
Delete member (GDPR "Right to be Forgotten").

**Response:** `204 No Content`

**Note:** This performs a soft delete and logs the action for compliance.

---

### 2.3 Campaign Management Endpoints

#### GET `/v1/campaigns`
List all campaigns for the authenticated cave.

**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 20)
- `status` (string) - Filter by status: `draft`, `scheduled`, `sending`, `sent`, `failed`
- `sort` (string, default: "created_at")
- `order` (string, default: "desc")

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "campaign-uuid",
      "name": "Chablis 2022 Arrival",
      "type": "daily_drop",
      "status": "sent",
      "product_name": "Chablis 2022",
      "product_price": 24.00,
      "message": "Crisp, fresh, just arrived!",
      "image_url": "https://cdn.vinclub.fr/images/chablis-2022.webp",
      "audience": {
        "type": "tag",
        "value": ["white-wine-lovers"]
      },
      "channels": ["sms", "email"],
      "sent_count": 45,
      "delivered_count": 43,
      "opened_count": 12,
      "clicked_count": 5,
      "created_at": "2025-12-10T09:00:00Z",
      "sent_at": "2025-12-10T09:05:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "total_pages": 1
  }
}
```

---

#### POST `/v1/campaigns`
Create a new campaign (Daily Drop).

**Request:**
```json
{
  "name": "Chablis 2022 Arrival",
  "type": "daily_drop",
  "product_name": "Chablis 2022",
  "product_price": 24.00,
  "message": "Crisp, fresh, just arrived!",
  "image_file": "base64-encoded-image-or-url",
  "audience": {
    "type": "tag",
    "value": ["white-wine-lovers"]
  },
  "channels": ["sms", "email"],
  "max_quantity": 10,
  "send_immediately": true
}
```

**Audience Types:**
- `all` - All members
- `tag` - Members with specific tags
- `region` - Members in specific region
- `custom` - Custom filter criteria

**Response:** `201 Created`
```json
{
  "id": "campaign-uuid",
  "name": "Chablis 2022 Arrival",
  "status": "sending",
  "product_name": "Chablis 2022",
  "product_price": 24.00,
  "message": "Crisp, fresh, just arrived!",
  "image_url": "https://cdn.vinclub.fr/images/chablis-2022.webp",
  "audience": {
    "type": "tag",
    "value": ["white-wine-lovers"],
    "estimated_count": 45
  },
  "channels": ["sms", "email"],
  "created_at": "2025-12-11T14:30:00Z"
}
```

---

#### GET `/v1/campaigns/{id}`
Get campaign details including statistics.

**Response:** `200 OK`
```json
{
  "id": "campaign-uuid",
  "name": "Chablis 2022 Arrival",
  "status": "sent",
  "product_name": "Chablis 2022",
  "product_price": 24.00,
  "message": "Crisp, fresh, just arrived!",
  "image_url": "https://cdn.vinclub.fr/images/chablis-2022.webp",
  "audience": {
    "type": "tag",
    "value": ["white-wine-lovers"],
    "actual_count": 45
  },
  "channels": ["sms", "email"],
  "statistics": {
    "sent_count": 45,
    "delivered_count": 43,
    "failed_count": 2,
    "opened_count": 12,
    "clicked_count": 5,
    "conversion_count": 3,
    "revenue": 72.00
  },
  "created_at": "2025-12-10T09:00:00Z",
  "sent_at": "2025-12-10T09:05:00Z"
}
```

---

#### POST `/v1/campaigns/{id}/send`
Manually trigger campaign send (if status is `draft` or `scheduled`).

**Response:** `202 Accepted`
```json
{
  "message": "Campaign queued for sending",
  "campaign_id": "campaign-uuid",
  "estimated_completion": "2025-12-11T14:35:00Z"
}
```

---

#### DELETE `/v1/campaigns/{id}`
Cancel a scheduled campaign or delete a draft.

**Response:** `204 No Content`

---

### 2.4 Subscription Management Endpoints

#### GET `/v1/subscriptions`
List all subscriptions for the authenticated cave.

**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 20)
- `status` (string) - Filter by status: `active`, `paused`, `cancelled`, `past_due`
- `member_id` (uuid) - Filter by member
- `plan_id` (uuid) - Filter by plan

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "subscription-uuid",
      "member_id": "member-uuid",
      "member_name": "Jean Dupont",
      "plan_id": "plan-uuid",
      "plan_name": "Discovery Box",
      "amount": 29.00,
      "currency": "EUR",
      "status": "active",
      "billing_cycle": "monthly",
      "next_billing_date": "2026-01-01",
      "stripe_subscription_id": "sub_xxx",
      "created_at": "2025-12-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

---

#### POST `/v1/subscriptions`
Create a new subscription.

**Request:**
```json
{
  "member_id": "member-uuid",
  "plan_id": "plan-uuid",
  "payment_method_id": "pm_xxx",
  "start_date": "2026-01-01"
}
```

**Response:** `201 Created`
```json
{
  "id": "subscription-uuid",
  "member_id": "member-uuid",
  "plan_id": "plan-uuid",
  "amount": 29.00,
  "currency": "EUR",
  "status": "active",
  "billing_cycle": "monthly",
  "next_billing_date": "2026-01-01",
  "stripe_subscription_id": "sub_xxx",
  "created_at": "2025-12-11T14:30:00Z"
}
```

---

#### PATCH `/v1/subscriptions/{id}`
Update subscription (pause, resume, change plan).

**Request:**
```json
{
  "status": "paused",
  "pause_reason": "Member requested temporary pause"
}
```

**Response:** `200 OK` (returns updated subscription)

---

#### DELETE `/v1/subscriptions/{id}`
Cancel subscription.

**Request:**
```json
{
  "cancel_reason": "Member requested cancellation",
  "cancel_immediately": false
}
```

**Response:** `200 OK`
```json
{
  "id": "subscription-uuid",
  "status": "cancelled",
  "cancelled_at": "2025-12-11T14:30:00Z",
  "ends_at": "2026-01-01"
}
```

---

### 2.5 Wine Box Management Endpoints

#### GET `/v1/wine-boxes`
Get packing list for current billing cycle.

**Query Parameters:**
- `billing_cycle` (string, format: YYYY-MM) - Default: current month
- `status` (string) - Filter by status: `pending`, `packed`, `shipped`, `ready_for_pickup`

**Response:** `200 OK`
```json
{
  "billing_cycle": "2025-12",
  "total_boxes": 45,
  "status_breakdown": {
    "pending": 30,
    "packed": 10,
    "shipped": 3,
    "ready_for_pickup": 2
  },
  "boxes": [
    {
      "id": "box-uuid",
      "subscription_id": "subscription-uuid",
      "member_name": "Jean Dupont",
      "member_phone": "+33612345678",
      "plan_name": "Discovery Box",
      "status": "pending",
      "address": {
        "street": "123 Rue de la Paix",
        "city": "Paris",
        "postal_code": "75001",
        "country": "FR"
      },
      "created_at": "2025-12-01T10:00:00Z"
    }
  ]
}
```

---

#### PATCH `/v1/wine-boxes/{id}`
Update box status.

**Request:**
```json
{
  "status": "packed",
  "tracking_number": "FR123456789"
}
```

**Response:** `200 OK` (returns updated box)

---

#### GET `/v1/wine-boxes/packing-list`
Generate PDF packing list.

**Query Parameters:**
- `billing_cycle` (string, format: YYYY-MM)
- `format` (string) - `pdf` or `csv`

**Response:** `200 OK`
- Content-Type: `application/pdf` or `text/csv`
- Content-Disposition: `attachment; filename="packing-list-2025-12.pdf"`

---

### 2.6 Subscription Plans Endpoints

#### GET `/v1/plans`
List all subscription plans for the authenticated cave.

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "plan-uuid",
      "name": "Discovery Box",
      "description": "Monthly selection of 3 wines",
      "amount": 29.00,
      "currency": "EUR",
      "billing_cycle": "monthly",
      "wine_count": 3,
      "is_active": true,
      "created_at": "2025-12-01T10:00:00Z"
    }
  ]
}
```

---

#### POST `/v1/plans`
Create a new subscription plan.

**Request:**
```json
{
  "name": "Premium Box",
  "description": "Monthly selection of 6 premium wines",
  "amount": 59.00,
  "currency": "EUR",
  "billing_cycle": "monthly",
  "wine_count": 6
}
```

**Response:** `201 Created` (returns created plan)

---

### 2.7 Analytics Endpoints

#### GET `/v1/analytics/overview`
Get overview analytics for the authenticated cave.

**Query Parameters:**
- `start_date` (string, ISO 8601)
- `end_date` (string, ISO 8601)
- `period` (string) - `day`, `week`, `month`, `year`

**Response:** `200 OK`
```json
{
  "period": {
    "start": "2025-12-01T00:00:00Z",
    "end": "2025-12-11T23:59:59Z"
  },
  "members": {
    "total": 145,
    "new_this_period": 12,
    "growth_rate": 9.0
  },
  "subscriptions": {
    "active": 45,
    "mrr": 1305.00,
    "churn_rate": 2.2
  },
  "campaigns": {
    "total_sent": 8,
    "total_reach": 360,
    "average_open_rate": 26.7,
    "average_click_rate": 11.1,
    "revenue_attributed": 450.00
  }
}
```

---

#### GET `/v1/analytics/campaigns/{id}`
Get detailed campaign analytics.

**Response:** `200 OK`
```json
{
  "campaign_id": "campaign-uuid",
  "statistics": {
    "sent_count": 45,
    "delivered_count": 43,
    "failed_count": 2,
    "opened_count": 12,
    "clicked_count": 5,
    "conversion_count": 3,
    "revenue": 72.00
  },
  "channel_breakdown": {
    "sms": {
      "sent": 45,
      "delivered": 43,
      "clicked": 2
    },
    "email": {
      "sent": 45,
      "delivered": 43,
      "opened": 12,
      "clicked": 5
    }
  },
  "timeline": [
    {
      "timestamp": "2025-12-10T09:05:00Z",
      "event": "campaign_sent",
      "count": 45
    }
  ]
}
```

---

### 2.8 Settings Endpoints

#### GET `/v1/settings`
Get cave settings.

**Response:** `200 OK`
```json
{
  "cave": {
    "id": "cave-uuid",
    "name": "Cave Example",
    "address": "123 Rue de la Paix, Paris",
    "phone": "+33123456789",
    "email": "contact@cave-example.fr"
  },
  "integrations": {
    "stripe": {
      "connected": true,
      "account_id": "acct_xxx"
    },
    "twilio": {
      "connected": true,
      "phone_number": "+33612345678"
    },
    "brevo": {
      "connected": true,
      "sender_email": "newsletter@cave-example.fr"
    }
  },
  "preferences": {
    "default_currency": "EUR",
    "timezone": "Europe/Paris",
    "language": "fr"
  }
}

**Note:** The `language` preference is set to `"fr"` (French) and cannot be changed. The entire user interface must be entirely in French as per product requirements.
}
```

---

#### PATCH `/v1/settings`
Update cave settings.

**Request:**
```json
{
  "cave": {
    "name": "Updated Cave Name"
  },
  "preferences": {
    "timezone": "Europe/Paris"
  }
}
```

**Response:** `200 OK` (returns updated settings)

---

## 3. Authentication & Authorization

### 3.1 Authentication Strategy

**JWT (JSON Web Tokens)** managed via Supabase Auth:

- **Access Token:** Short-lived (1 hour), contains user ID, role, cave ID
- **Refresh Token:** Long-lived (30 days), used to obtain new access tokens
- **Token Storage:** HTTP-only cookies (recommended) or localStorage (PWA)

**Token Payload Structure:**
```json
{
  "sub": "user-uuid",
  "email": "batiste@cave-example.fr",
  "role": "HELPER",
  "cave_id": "cave-uuid",
  "iat": 1702300800,
  "exp": 1702304400
}
```

### 3.2 Authorization Levels

**Role-Based Access Control (RBAC):**

| Role | Permissions |
|------|-------------|
| **OWNER** | Full access: All CRUD operations, billing, settings, analytics |
| **MANAGER** | Most operations: Create/edit members, campaigns, subscriptions. Cannot delete cave or change billing |
| **HELPER** | Limited operations: Create members, create/send campaigns, update box status. Read-only for subscriptions and analytics |

**Endpoint Authorization Matrix:**

| Endpoint | OWNER | MANAGER | HELPER |
|----------|-------|---------|--------|
| `GET /members` | ✅ | ✅ | ✅ |
| `POST /members` | ✅ | ✅ | ✅ |
| `DELETE /members` | ✅ | ✅ | ❌ |
| `POST /campaigns` | ✅ | ✅ | ✅ |
| `DELETE /campaigns` | ✅ | ✅ | ❌ |
| `POST /subscriptions` | ✅ | ✅ | ❌ |
| `PATCH /subscriptions/{id}` | ✅ | ✅ | ❌ |
| `GET /analytics` | ✅ | ✅ | ❌ |
| `PATCH /settings` | ✅ | ❌ | ❌ |

### 3.3 API Key Management

**For Future Third-Party Integrations (Phase 3):**

- API keys stored in database with cave association
- Key rotation support
- Rate limiting per key
- Webhook signing keys for external integrations

### 3.4 Security Best Practices

1. **HTTPS Only:** All API communication must use TLS 1.2+
2. **Token Validation:** Every request validates JWT signature and expiration
3. **Tenant Isolation:** All queries filtered by `cave_id` from JWT payload
4. **Input Validation:** All inputs sanitized and validated (Zod/Yup schemas)
5. **Rate Limiting:** Per-user and per-endpoint rate limits
6. **CORS:** Restricted to `*.vinclub.fr` domains
7. **CSRF Protection:** Token-based CSRF protection for state-changing operations

---

## 4. Data Modeling

### 4.1 Core Data Structures

#### Member
```typescript
{
  id: string (UUID),
  cave_id: string (UUID),
  name: string (1-100 chars),
  email: string (optional, valid email),
  phone: string (E.164 format),
  preferred_region: string (optional),
  tags: string[],
  consent_email: boolean,
  consent_sms: boolean,
  consent_gdpr_logged_at: timestamp,
  created_at: timestamp,
  updated_at: timestamp,
  deleted_at: timestamp (soft delete)
}
```

#### Campaign
```typescript
{
  id: string (UUID),
  cave_id: string (UUID),
  name: string,
  type: "daily_drop" | "newsletter" | "event",
  status: "draft" | "scheduled" | "sending" | "sent" | "failed",
  product_name: string,
  product_price: number,
  message: string,
  image_url: string,
  audience: {
    type: "all" | "tag" | "region" | "custom",
    value: string[]
  },
  channels: ("sms" | "email")[],
  max_quantity: number (optional),
  sent_count: number,
  delivered_count: number,
  opened_count: number,
  clicked_count: number,
  created_at: timestamp,
  sent_at: timestamp (optional)
}
```

#### Subscription
```typescript
{
  id: string (UUID),
  cave_id: string (UUID),
  member_id: string (UUID),
  plan_id: string (UUID),
  stripe_subscription_id: string,
  amount: number,
  currency: string,
  status: "active" | "paused" | "cancelled" | "past_due",
  billing_cycle: "monthly" | "quarterly" | "yearly",
  next_billing_date: date,
  created_at: timestamp,
  updated_at: timestamp,
  cancelled_at: timestamp (optional)
}
```

#### Subscription Plan
```typescript
{
  id: string (UUID),
  cave_id: string (UUID),
  name: string,
  description: string,
  amount: number,
  currency: string,
  billing_cycle: "monthly" | "quarterly" | "yearly",
  wine_count: number,
  is_active: boolean,
  created_at: timestamp
}
```

### 4.2 Validation Rules

**Member Validation:**
- `name`: Required, 1-100 characters, no special characters except spaces and hyphens
- `email`: Optional, must be valid email format, checked for duplicates within cave
- `phone`: Required, E.164 format (+[country code][number])
- `tags`: Array of strings, max 10 tags, each tag 1-50 characters
- `consent_email` & `consent_sms`: Required booleans

**Campaign Validation:**
- `name`: Required, 1-200 characters
- `product_name`: Required, 1-200 characters
- `product_price`: Required, positive number, max 9999.99
- `message`: Required, 1-500 characters
- `channels`: Required, at least one channel selected
- `max_quantity`: Optional, positive integer if provided

### 4.3 Relationship Handling

**Nested Resources:**
- Use nested endpoints for sub-resources: `/members/{id}/subscriptions`
- Include related data via query parameter: `?include=subscriptions,last_campaign`

**Reference IDs:**
- Use UUIDs for all foreign key references
- Include validation to ensure referenced resources belong to same cave

**Example Response with Includes:**
```json
{
  "id": "member-uuid",
  "name": "Jean Dupont",
  "subscriptions": [
    {
      "id": "subscription-uuid",
      "plan_name": "Discovery Box",
      "status": "active"
    }
  ],
  "last_campaign": {
    "id": "campaign-uuid",
    "name": "Chablis 2022 Arrival",
    "sent_at": "2025-12-10T09:05:00Z"
  }
}
```

### 4.4 Error Response Format

**Standard Error Structure:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "phone",
        "message": "Phone number is required"
      }
    ],
    "request_id": "req-uuid",
    "timestamp": "2025-12-11T14:30:00Z"
  }
}
```

**Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_ERROR` - Invalid or missing token
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict (e.g., duplicate)
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error
- `EXTERNAL_SERVICE_ERROR` - Third-party service error

---

## 5. API Features

### 5.1 Pagination Strategy

**Cursor-Based Pagination** (recommended for mobile):

```json
{
  "data": [...],
  "pagination": {
    "cursor": "eyJpZCI6IjEyMzQ1NiJ9",
    "has_more": true,
    "limit": 20
  }
}
```

**Offset-Based Pagination** (for web/admin):

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "total_pages": 8
  }
}
```

**Implementation:**
- Default limit: 20 items
- Maximum limit: 100 items
- Use `?page=2&limit=50` for offset-based
- Use `?cursor=xxx&limit=20` for cursor-based

### 5.2 Filtering and Sorting

**Filtering:**
- Use query parameters: `?tags=red-wine&preferred_region=Bordeaux`
- Support multiple values: `?tags=red-wine&tags=premium`
- Date ranges: `?start_date=2025-12-01&end_date=2025-12-31`

**Sorting:**
- Single field: `?sort=created_at&order=desc`
- Default: `created_at` descending
- Supported fields: `created_at`, `name`, `amount`, `status`

### 5.3 Versioning Approach

**URL Versioning:**
- Current version: `/v1/`
- Future versions: `/v2/`, `/v3/`
- Maintain backward compatibility for at least 6 months
- Deprecation warnings in response headers: `X-API-Deprecated: true`, `X-API-Sunset-Date: 2026-06-01`

**Version Strategy:**
- Major versions for breaking changes
- Minor changes use same version with feature flags
- Deprecation period: 3 months minimum

### 5.4 Rate Limiting Implementation

**Rate Limits:**
- **Authentication endpoints:** 5 requests/minute per IP
- **Read endpoints:** 100 requests/minute per user
- **Write endpoints:** 30 requests/minute per user
- **Campaign send:** 10 requests/hour per user

**Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1702304400
```

**429 Too Many Requests Response:**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "retry_after": 60
  }
}
```

### 5.5 Caching Headers and Strategies

**Cache Headers:**
- **Static resources:** `Cache-Control: public, max-age=31536000`
- **User-specific data:** `Cache-Control: private, max-age=60`
- **Campaigns:** `Cache-Control: private, max-age=300`
- **Analytics:** `Cache-Control: private, max-age=300`

**ETag Support:**
- Include `ETag` header for cache validation
- Support `If-None-Match` header for conditional requests
- Return `304 Not Modified` when content unchanged

**Example:**
```
ETag: "abc123def456"
Cache-Control: private, max-age=60
```

---

## 6. Error Handling

### 6.1 Standardized Error Response Format

**All errors follow this structure:**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [
      {
        "field": "field_name",
        "message": "Specific error message"
      }
    ],
    "request_id": "req-uuid",
    "timestamp": "2025-12-11T14:30:00Z"
  }
}
```

### 6.2 HTTP Status Codes

| Status Code | Usage |
|-------------|-------|
| `200 OK` | Successful GET, PATCH requests |
| `201 Created` | Successful POST requests creating resources |
| `202 Accepted` | Request accepted for async processing |
| `204 No Content` | Successful DELETE requests |
| `400 Bad Request` | Validation errors, malformed requests |
| `401 Unauthorized` | Missing or invalid authentication |
| `403 Forbidden` | Valid auth but insufficient permissions |
| `404 Not Found` | Resource not found |
| `409 Conflict` | Resource conflict (duplicate, constraint violation) |
| `422 Unprocessable Entity` | Valid format but business logic error |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Server error |
| `503 Service Unavailable` | Service temporarily unavailable |

### 6.3 Comprehensive Error Codes

**Authentication Errors:**
- `AUTH_TOKEN_MISSING` - No authorization header
- `AUTH_TOKEN_INVALID` - Invalid token format
- `AUTH_TOKEN_EXPIRED` - Token expired
- `AUTH_CREDENTIALS_INVALID` - Wrong email/password

**Authorization Errors:**
- `AUTH_INSUFFICIENT_PERMISSIONS` - Role lacks required permission
- `AUTH_TENANT_MISMATCH` - Resource belongs to different cave

**Validation Errors:**
- `VALIDATION_REQUIRED_FIELD` - Required field missing
- `VALIDATION_INVALID_FORMAT` - Invalid format (email, phone, etc.)
- `VALIDATION_OUT_OF_RANGE` - Value outside allowed range
- `VALIDATION_DUPLICATE` - Duplicate value not allowed

**Resource Errors:**
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RESOURCE_CONFLICT` - Resource conflict (e.g., duplicate member)
- `RESOURCE_LOCKED` - Resource locked for modification

**External Service Errors:**
- `STRIPE_ERROR` - Stripe API error
- `TWILIO_ERROR` - Twilio API error
- `BREVO_ERROR` - Brevo API error

### 6.4 Validation Error Handling

**Field-Level Validation:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "code": "VALIDATION_INVALID_FORMAT"
      },
      {
        "field": "phone",
        "message": "Phone number is required",
        "code": "VALIDATION_REQUIRED_FIELD"
      }
    ]
  }
}
```

### 6.5 Debug Information for Development

**Development Mode:**
- Include stack traces in error responses (dev/staging only)
- Include request ID for correlation
- Log full request/response for debugging

**Production Mode:**
- Generic error messages (no stack traces)
- Request ID for support ticket correlation
- Detailed errors logged server-side only

---

## 7. Documentation Structure

### 7.1 API Documentation Format

**OpenAPI 3.0 Specification:**
- Generate OpenAPI spec from code annotations
- Host interactive docs at `/docs` endpoint
- Use Swagger UI or ReDoc for rendering

**Documentation Sections:**
1. **Getting Started** - Authentication, first request
2. **Endpoints** - All endpoints with examples
3. **Data Models** - Request/response schemas
4. **Error Handling** - Error codes and responses
5. **Rate Limiting** - Limits and best practices
6. **Webhooks** - Webhook events and payloads

### 7.2 Example Requests and Responses

**For Each Endpoint, Include:**
- **Description** - What the endpoint does
- **Request Example** - cURL command
- **Request Schema** - JSON schema
- **Response Examples** - Success and error cases
- **Response Schema** - JSON schema

**Example Documentation Block:**
```markdown
### POST /v1/members

Create a new member (Quick-Add form).

**cURL Example:**
```bash
curl -X POST https://api.vinclub.fr/v1/members \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "phone": "+33612345678",
    "email": "jean@example.com",
    "consent_email": true,
    "consent_sms": true
  }'
```

**Request Schema:**
[OpenAPI schema]

**Response: 201 Created**
[Response example]
```

### 7.3 Authentication Examples

**Include Examples For:**
- Login flow
- Token refresh
- Making authenticated requests
- Handling token expiration
- Role-based access examples

### 7.4 SDK/Client Library Considerations

**Future SDK Support:**
- JavaScript/TypeScript SDK (priority)
- Python SDK (for integrations)
- REST API remains primary interface

**SDK Features:**
- Automatic token refresh
- Request retry logic
- TypeScript types
- Error handling helpers

---

## 8. Performance Considerations

### 8.1 Optimization Strategies

**Database Query Optimization:**
- Index on `cave_id` for all tenant-scoped queries
- Index on `member.phone` and `member.email` for lookups
- Index on `campaign.created_at` for sorting
- Composite indexes for common filter combinations

**Query Optimization:**
- Use `SELECT` specific fields, not `SELECT *`
- Implement pagination to limit result sets
- Use database views for complex analytics queries
- Cache frequently accessed data (plans, settings)

### 8.2 Caching Strategies

**Redis Caching:**
- **Cache Keys:**
  - `cave:{cave_id}:settings` - TTL: 1 hour
  - `cave:{cave_id}:plans` - TTL: 30 minutes
  - `member:{member_id}` - TTL: 5 minutes
  - `campaign:{campaign_id}:stats` - TTL: 1 minute

**Cache Invalidation:**
- Invalidate on write operations
- Use cache tags for related data
- Implement cache warming for critical paths

### 8.3 Bulk Operations Design

**Batch Member Creation:**
```
POST /v1/members/batch
Content-Type: application/json

{
  "members": [
    { "name": "...", "phone": "..." },
    { "name": "...", "phone": "..." }
  ]
}

Response: 202 Accepted
{
  "job_id": "job-uuid",
  "status": "processing",
  "estimated_completion": "2025-12-11T14:35:00Z"
}
```

**Check Batch Status:**
```
GET /v1/jobs/{job_id}

Response: 200 OK
{
  "job_id": "job-uuid",
  "status": "completed",
  "total": 100,
  "succeeded": 95,
  "failed": 5,
  "errors": [...]
}
```

### 8.4 Response Time Targets

- **Simple GET requests:** < 200ms
- **POST/PATCH requests:** < 500ms
- **Campaign send (async):** < 2s to queue
- **Analytics queries:** < 2s
- **File uploads:** < 5s for images

---

## 9. Testing Strategy

### 9.1 API Testing Approach

**Testing Pyramid:**
1. **Unit Tests** - Individual functions/methods (80%)
2. **Integration Tests** - API endpoints with test database (15%)
3. **E2E Tests** - Full user flows (5%)

**Test Framework:**
- **Unit:** Vitest
- **Integration:** Supertest + Jest
- **E2E:** Playwright

### 9.2 Test Data Requirements

**Test Fixtures:**
- Seed database with test caves, members, campaigns
- Use factories for generating test data
- Clean up test data after each test run

**Test Scenarios:**
- Happy path for each endpoint
- Validation error cases
- Authorization edge cases
- Error handling (network failures, external service errors)

### 9.3 Automated Testing Recommendations

**CI/CD Integration:**
- Run unit tests on every commit
- Run integration tests on PR
- Run E2E tests on merge to main

**Test Coverage Goals:**
- Unit tests: > 80% coverage
- Integration tests: Cover all endpoints
- E2E tests: Cover critical user flows

### 9.4 Performance Testing Considerations

**Load Testing:**
- Use k6 or Artillery for load testing
- Test peak scenarios: 50 concurrent campaigns
- Monitor response times, error rates
- Test rate limiting behavior

**Performance Benchmarks:**
- P95 response time < 500ms
- P99 response time < 1s
- Error rate < 0.1%

---

## 10. Future Considerations

### 10.1 Scalability Planning

**Horizontal Scaling:**
- Stateless API design enables horizontal scaling
- Database connection pooling
- Read replicas for analytics queries
- CDN for static assets

**Scaling Triggers:**
- Auto-scale based on CPU/memory metrics
- Queue depth monitoring for async jobs
- Database connection pool monitoring

### 10.2 Backwards Compatibility Strategy

**Compatibility Rules:**
- Never remove fields, only deprecate
- Add new fields as optional
- Maintain old endpoints for 6 months minimum
- Use feature flags for gradual rollouts

**Versioning Strategy:**
- Major version changes for breaking changes
- Minor changes maintain compatibility
- Communicate deprecations via email/docs

### 10.3 Deprecation Policies

**Deprecation Process:**
1. Announce deprecation (3 months notice)
2. Add deprecation headers to responses
3. Update documentation
4. Provide migration guide
5. Remove after deprecation period

**Example Deprecation Header:**
```
X-API-Deprecated: true
X-API-Sunset-Date: 2026-06-01
X-API-Replacement: /v2/members
```

### 10.4 Migration Strategies

**Data Migrations:**
- Version database schema changes
- Support multiple schema versions during transition
- Provide migration scripts/tools

**API Migrations:**
- Gradual migration with feature flags
- Support both old and new endpoints during transition
- Monitor usage to determine migration completion

---

## Appendix A: Webhook Events

### A.1 Stripe Webhooks

**Events Handled:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `charge.refunded`

**Webhook Endpoint:**
```
POST /v1/webhooks/stripe
```

**Security:**
- Verify Stripe signature
- Idempotency key handling
- Retry logic for failed webhooks

### A.2 Campaign Webhooks (Future)

**Events:**
- `campaign.sent`
- `campaign.delivered`
- `campaign.opened`
- `campaign.clicked`
- `campaign.failed`

---

## Appendix B: File Upload Endpoints

### B.1 Image Upload

**POST `/v1/upload/image`**

**Request:**
- Content-Type: `multipart/form-data`
- Field: `file` (image file)
- Max size: 5MB
- Supported formats: JPEG, PNG, WebP

**Response:** `200 OK`
```json
{
  "url": "https://cdn.vinclub.fr/images/abc123.webp",
  "width": 1200,
  "height": 800,
  "size": 245678
}
```

---

## Appendix C: Real-Time Features

### C.1 WebSocket Connection

**Endpoint:** `wss://api.vinclub.fr/v1/ws`

**Authentication:**
- Include JWT token in connection query: `?token={jwt}`

**Events:**
- `campaign.progress` - Campaign sending progress updates
- `subscription.updated` - Subscription status changes
- `member.created` - New member added

**Example:**
```javascript
const ws = new WebSocket('wss://api.vinclub.fr/v1/ws?token={jwt}');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'campaign.progress') {
    console.log(`Campaign ${data.campaign_id}: ${data.progress}%`);
  }
};
```

---

**Document Version:** 1.0  
**Last Updated:** December 11, 2025  
**Next Review:** January 11, 2026
