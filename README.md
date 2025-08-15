# WineClub - Luxury Wine Club Management Platform

## 🍷 Overview

WineClub is a comprehensive SaaS platform for luxury wine club management, featuring AI-powered recommendations, inventory management, subscription handling, and premium user experiences with a sophisticated white-wine luxury theme.

## 📁 Monorepo Structure

```
wineclub-monorepo/
├── apps/
│   ├── core/                 # Main Wasp application
│   └── marketing/            # Astro blog/marketing site
├── packages/
│   ├── ui/                   # Shared UI components and design tokens
│   └── config/               # Shared configuration
├── tests/
│   └── e2e/                  # End-to-end tests
├── infra/
│   ├── docker/               # Docker configurations
│   └── deploy/               # Deployment manifests
└── archive/                  # Legacy files preserved for reference
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ LTS
- npm 8.0+
- Wasp CLI
- PostgreSQL

### Development Setup
```bash
# Install dependencies for all workspaces
npm install

# Start the core application
npm run core:dev

# Start the marketing site (in another terminal)
npm run marketing:dev

# Run E2E tests
npm run e2e:test
```

### Build & Deploy
```bash
# Build all applications
npm run build

# Run tests across all packages
npm run test

# Lint all code
npm run lint
```

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Wasp (Node.js + Prisma)
- **Database**: PostgreSQL
- **Authentication**: Wasp Auth + Google OAuth
- **Payments**: Stripe + LemonSqueezy
- **File Storage**: AWS S3
- **Analytics**: Google Analytics + Plausible
- **Build Tool**: Turbo for efficient monorepo builds

## 🎨 Design System

### **White-Wine Luxury Palette**
- **Ivory**: #FBFAF7 (page backgrounds)
- **Shell**: #F7F4EE (panel backgrounds)
- **Porcelain**: #EEE9DF (hairline borders)
- **Champagne**: #E9D9A6 (primary accent)
- **Chablis**: #DCCB8A (hover/active states)
- **Grape Seed**: #6E664C (headings/accent text)
- **Cave**: #2C2A24 (body text)

### **Typography**
- **Headlines**: Inter (Geometric Sans-serif) - 48px H1, 32px H2, 24px H3
- **Body**: Georgia (Humanist Serif) - 18px base with 1.6 line-height
- **Microcopy**: Inter with uppercase navigation and wide tracking

### **Components & Interactions**
- **Luxury Animations**: Smooth fade-in-up effects with staggered timing
- **Glass Morphism**: Backdrop blur and transparency effects
- **Responsive Design**: Mobile-first with elegant breakpoints
- **Accessibility**: WCAG AA compliant with high contrast ratios

## 📦 Package Structure

### Apps
- **`apps/core/`**: Main Wasp application with white-wine luxury theme
- **`apps/marketing/`**: Astro-based marketing site and blog

### Packages
- **`packages/ui/`**: Shared React components and design tokens
- **`packages/config/`**: Shared Tailwind, ESLint, and TypeScript configs

### Infrastructure
- **`infra/docker/`**: Docker configurations for deployment
- **`infra/deploy/`**: GitHub Actions, deployment manifests

## 📚 Documentation

- [Migration Guide](./MIGRATION.md) - Complete migration documentation
- [Technical Documentation](./apps/core/docs/)
- [API Reference](./apps/core/src/)
- [Testing Guide](./tests/e2e/)

## 🔧 Development Workflow

1. **Feature Development**: Create feature branches
2. **Testing**: Run e2e tests before merging
3. **Code Review**: Follow TypeScript + ESLint standards
4. **Deployment**: Automated via GitHub Actions

## 📊 Key Features

- **User Management**: Authentication, profiles, preferences
- **Wine Recommendations**: AI-powered suggestions
- **Inventory Management**: Stock tracking, alerts
- **Subscription Handling**: Billing, renewals, upgrades
- **Analytics Dashboard**: Business insights
- **Multi-language Support**: i18n implementation
- **Responsive Design**: Mobile-first approach
- **Luxury UI**: White-wine theme with premium animations

## 🚢 Deployment

- **Docker**: Containerized deployments with multi-stage builds
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Environment**: Comprehensive environment variable management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow coding standards
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Live Demo](https://wineclub-demo.vercel.app)
- [Documentation](https://wineclub-docs.vercel.app)
- [Support](mailto:support@wineclub.com)
