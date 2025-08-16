# WineSAAS - Luxury Wine Club Management Platform

## 🍷 Overview

WineSAAS is a comprehensive SaaS platform for luxury wine club management, featuring AI-powered recommendations, inventory management, subscription handling, and premium user experiences.

This project is based on [OpenSaas](https://opensaas.sh) template and consists of three main directories:

## 📁 Project Structure

```
wineSAAS/
├── wine-club-saas/          # Main application
│   ├── app/                 # Wasp web app
│   ├── docs/                # Documentation
│   ├── e2e-tests/           # Playwright tests
│   └── blog/                # Astro blog/docs (Starlight template)
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ LTS
- Wasp CLI
- PostgreSQL

### Development Setup
```bash
cd wine-club-saas/app
wasp start
```

### Testing
```bash
cd wine-club-saas/e2e-tests
npm test
```

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Wasp (Node.js + Prisma)
- **Database**: PostgreSQL
- **Authentication**: Wasp Auth + Google OAuth
- **Payments**: Stripe + LemonSqueezy
- **File Storage**: AWS S3
- **Analytics**: Google Analytics + Plausible

## 🎨 Design System

### **Luxury Color Palette**
- **Bordeaux Theme**: Deep Bordeaux (#5A1E1B) with elegant crimson accents
- **Champagne Theme**: Pale Gold (#F3E9D2) with warm taupe highlights
- **Base Neutrals**: Soft ivory (#F9F7F1), pure white (#FFFFFF), anthracite (#333333)

### **Typography**
- **Headlines**: Inter (Geometric Sans-serif) - 48px H1, 32px H2, 24px H3
- **Body**: Georgia (Humanist Serif) - 18px base with 1.6 line-height
- **Microcopy**: Inter with uppercase navigation and wide tracking

### **Components & Interactions**
- **Dual Theme System**: Instant switching with smooth CSS transitions
- **Premium Animations**: Wine-themed scroll effects (pour, swirl, reveal)
- **Responsive Design**: Mobile-first with elegant breakpoints
- **Accessibility**: WCAG AA compliant with high contrast ratios

## 📚 Documentation

- [Technical Documentation](./wine-club-saas/docs/)
- [API Reference](./wine-club-saas/app/src/)
- [Testing Guide](./wine-club-saas/e2e-tests/)

## 🔧 Development Workflow

1. **Feature Development**: Create feature branches
2. **Testing**: Run e2e tests before merging
3. **Code Review**: Follow TypeScript + ESLint standards
4. **Deployment**: Automated via Wasp

## 📊 Key Features

- **User Management**: Authentication, profiles, preferences
- **Wine Recommendations**: AI-powered suggestions
- **Inventory Management**: Stock tracking, alerts
- **Subscription Handling**: Billing, renewals, upgrades
- **Analytics Dashboard**: Business insights
- **Multi-language Support**: i18n implementation
- **Responsive Design**: Mobile-first approach

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow coding standards
4. Add tests for new features
5. Submit a pull request

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For technical issues or questions, please refer to the documentation or create an issue in the repository.
