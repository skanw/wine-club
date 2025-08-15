# Wine Club SaaS - Architecture Guide

## Overview

Wine Club SaaS is a premium wine subscription service built with modern web technologies. This document outlines the architecture, design patterns, and development guidelines.

## Tech Stack

- **Frontend**: React 18.2.0, TypeScript 5.1.0, Tailwind CSS
- **Backend**: Wasp Framework, Node.js 20+
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **Payments**: Stripe, Lemon Squeezy
- **File Storage**: AWS S3
- **Analytics**: Google Analytics, Plausible
- **Testing**: Playwright E2E, Jest Unit Tests

## Project Structure

```
wine-club-saas/
├── app/                          # Main Wasp application
│   ├── src/
│   │   ├── client/              # Frontend React components
│   │   │   ├── components/      # Reusable UI components
│   │   │   │   ├── ui/         # Base UI components (Button, Input, etc.)
│   │   │   │   ├── layout/     # Layout components (Navbar, Footer, etc.)
│   │   │   │   └── business/   # Domain-specific components
│   │   │   ├── pages/          # Route-level page components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   └── styles/         # CSS and design tokens
│   │   ├── server/             # Backend operations and utilities
│   │   ├── shared/             # Shared types, constants, utilities
│   │   └── types/              # TypeScript type definitions
│   ├── main.wasp              # Wasp configuration
│   └── schema.prisma          # Database schema
├── tests/                      # Unit and integration tests
├── e2e-tests/                  # Playwright E2E tests
├── docs/                       # Documentation
├── archive/                    # Archived code and features
└── public/                     # Static assets
```

## Design System

### Color Palette

- **Champagne**: Primary brand color (warm, elegant)
- **Bordeaux**: Secondary brand color (rich, premium)
- **Taupe**: Neutral accent color (sophisticated)
- **Gray**: Neutral scale for text and backgrounds

### Typography

- **Headings**: Playfair Display (serif) - elegant, premium feel
- **Body**: Inter (sans-serif) - modern, readable
- **Monospace**: SF Mono - for code and technical content

### Spacing System

Consistent 4px base unit with scale:
- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px

### Component Architecture

1. **Atomic Design**: UI components follow atomic design principles
2. **Composition**: Components are built through composition, not inheritance
3. **Props Interface**: All components have well-defined TypeScript interfaces
4. **Accessibility**: WCAG 2.1 AA compliance with proper ARIA labels

## Core Features

### 1. User Authentication & Management
- Email/password authentication via Supabase
- Social login integration (Google, Apple)
- Role-based access control (User, Admin)
- Email verification and password reset

### 2. Wine Subscription Management
- Subscription tier management (Basic, Premium, Connoisseur)
- Wine preference profiling
- Delivery scheduling and tracking
- Subscription pause/cancel functionality

### 3. Wine Cave (Digital Cellar)
- Digital wine inventory management
- Wine ratings and reviews
- Drinking history and analytics
- Wine recommendations engine

### 4. Payment Processing
- Stripe integration for subscription billing
- Lemon Squeezy for one-time purchases
- Secure payment tokenization
- Automated billing and invoicing

### 5. Admin Dashboard
- User management and analytics
- Subscription analytics and reporting
- Inventory management
- Revenue tracking and insights

## Data Models

### Core Entities

```typescript
// User
interface User {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  preferences: WinePreferences
  createdAt: Date
  updatedAt: Date
}

// Subscription
interface Subscription {
  id: string
  userId: string
  tier: 'BASIC' | 'PREMIUM' | 'CONNOISSEUR'
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED'
  nextBillingDate: Date
  winePreferences: WinePreferences
}

// Wine
interface Wine {
  id: string
  name: string
  producer: string
  region: string
  varietal: string
  vintage: number
  price: number
  rating: number
  description: string
  imageUrl: string
}

// Wine Cave Entry
interface WineCaveEntry {
  id: string
  userId: string
  wineId: string
  quantity: number
  purchaseDate: Date
  rating?: number
  notes?: string
}
```

## API Design

### RESTful Endpoints

- `GET /api/users` - Get user profile
- `PUT /api/users` - Update user profile
- `GET /api/subscriptions` - Get user subscriptions
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `GET /api/wines` - Get wine catalog
- `GET /api/wine-cave` - Get user's wine cave
- `POST /api/wine-cave` - Add wine to cave

### GraphQL Operations (via Wasp)

```typescript
// Queries
const getUserProfile = query('getUserProfile', {
  args: { userId: 'string' },
  handler: async (args, context) => {
    // Implementation
  }
})

// Actions
const updateSubscription = action('updateSubscription', {
  args: { subscriptionId: 'string', updates: 'object' },
  handler: async (args, context) => {
    // Implementation
  }
})
```

## Security

### Authentication & Authorization
- JWT tokens with refresh mechanism
- Role-based access control (RBAC)
- Session management with secure cookies
- CSRF protection

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention via Prisma ORM
- XSS protection with React's built-in escaping
- Rate limiting on API endpoints

### Payment Security
- PCI DSS compliance via Stripe
- Secure payment tokenization
- Fraud detection and prevention
- Encrypted data transmission (HTTPS)

## Performance

### Frontend Optimization
- Code splitting with React.lazy()
- Image optimization with WebP format
- CSS purging with Tailwind
- Bundle size monitoring

### Backend Optimization
- Database query optimization
- Caching strategies (Redis)
- CDN for static assets
- API response compression

### Monitoring
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Error tracking and alerting
- Performance analytics

## Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Utility function testing with Jest
- API endpoint testing
- Coverage target: 80%+

### Integration Tests
- Database integration tests
- Payment flow testing
- Authentication flow testing
- API integration tests

### E2E Tests
- Critical user journeys
- Cross-browser testing
- Mobile responsiveness testing
- Performance testing

## Deployment

### Environment Management
- Development: Local development with hot reload
- Staging: Pre-production testing environment
- Production: Live application with monitoring

### CI/CD Pipeline
1. Code commit triggers automated tests
2. Build and package application
3. Deploy to staging for testing
4. Manual approval for production deployment
5. Automated rollback on failure

### Infrastructure
- Vercel for frontend hosting
- Railway for backend hosting
- Supabase for database and auth
- AWS S3 for file storage
- Cloudflare for CDN and DNS

## Development Guidelines

### Code Standards
- TypeScript strict mode enabled
- ESLint with Airbnb configuration
- Prettier for code formatting
- Conventional commits for version control

### Git Workflow
- Feature branches from main
- Pull request reviews required
- Automated testing on PR
- Semantic versioning

### Documentation
- Inline code documentation
- API documentation with OpenAPI
- Component storybook
- Architecture decision records (ADRs)

## Future Roadmap

### Phase 1 (Q1 2024)
- [x] Core subscription management
- [x] User authentication
- [x] Basic wine catalog
- [x] Payment integration

### Phase 2 (Q2 2024)
- [ ] Advanced wine recommendations
- [ ] Social features and reviews
- [ ] Mobile app development
- [ ] Advanced analytics

### Phase 3 (Q3 2024)
- [ ] AI-powered wine matching
- [ ] Virtual wine tastings
- [ ] International shipping
- [ ] B2B partnerships

### Phase 4 (Q4 2024)
- [ ] White-label platform
- [ ] Advanced inventory management
- [ ] Predictive analytics
- [ ] Marketplace features

## Contributing

### Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations: `npm run db-seed`
5. Start development server: `npm run dev`

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run all tests
- `npm run lint` - Run linting
- `npm run format` - Format code
- `npm run typecheck` - TypeScript type checking

### Code Review Process
1. Create feature branch
2. Implement changes with tests
3. Update documentation
4. Submit pull request
5. Address review feedback
6. Merge after approval

## Support

For technical support or questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki
- Review the troubleshooting guide

---

*Last updated: January 2024* 