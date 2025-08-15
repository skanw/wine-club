# WineClub Monorepo Migration

## 🎯 Overview

This document details the migration of the WineClub repository from a nested structure to a professional monorepo layout while preserving all development history and work.

## 📁 New Structure

```
wineclub-monorepo/
├── apps/
│   ├── core/                 # Main Wasp application (from wine-club-saas/app)
│   └── marketing/            # Astro blog/marketing site (from blog)
├── packages/
│   ├── ui/                   # Shared UI components and design tokens
│   └── config/               # Shared configuration (Tailwind, ESLint, TypeScript)
├── tests/
│   └── e2e/                  # End-to-end tests (from e2e-tests)
├── infra/
│   ├── docker/               # Docker configurations
│   └── deploy/               # Deployment manifests (GitHub Actions, etc.)
├── archive/                  # Legacy files preserved for reference
│   ├── root-app-legacy/      # Root app directory (duplicate)
│   ├── root-src-legacy/      # Root src directory (duplicate)
│   └── root-docs/            # Root docs directory
└── README.md                 # Updated documentation
```

## 🔄 Migration Steps

### Phase A: Discovery & Comparison
- ✅ Identified canonical application: `wine-club-saas/app`
- ✅ Compared duplicate directories and archived non-canonical versions
- ✅ Preserved all development history using `git mv`

### Phase B: Safeguards
- ✅ Created backup tag: `backup/pre-monorepo-20240815-1459`
- ✅ Created feature branch: `feature/monorepo-from-head`

### Phase C: File Moves (History-preserving)
- ✅ `wine-club-saas/app` → `apps/core/`
- ✅ `blog` → `apps/marketing/`
- ✅ `e2e-tests` → `tests/e2e/`
- ✅ `docs` → `archive/root-docs/`
- ✅ `app` → `archive/root-app-legacy/`
- ✅ `src` → `archive/root-src-legacy/`
- ✅ Removed `.DS_Store` and `wine-club-saas/` directory

### Phase D: Tooling Setup
- ✅ Created shared Tailwind preset with white-wine luxury palette
- ✅ Created shared design tokens package
- ✅ Added workspace configuration with npm workspaces
- ✅ Added Turbo for build orchestration
- ✅ Created Docker configurations
- ✅ Added GitHub Actions CI workflow
- ✅ Created environment variables template

## 🎨 Design System

### White-Wine Luxury Palette
```css
:root {
  --wc-ivory: #FBFAF7;      /* page bg */
  --wc-shell: #F7F4EE;      /* panel bg */
  --wc-porcelain: #EEE9DF;  /* hairline borders */
  --wc-champagne: #E9D9A6;  /* primary */
  --wc-chablis: #DCCB8A;    /* hover/active */
  --wc-grape-seed: #6E664C; /* headings/accent */
  --wc-cave: #2C2A24;       /* body text */
}
```

### Shared Configuration
- **Tailwind Preset**: `packages/config/tailwind-preset.js`
- **Design Tokens**: `packages/ui/src/styles/tokens.css`
- **Workspace Config**: Root `package.json` with npm workspaces
- **Build Tool**: Turbo for efficient monorepo builds

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ LTS
- npm 8.0+
- Wasp CLI (for core app)
- PostgreSQL

### Installation
```bash
# Install dependencies for all workspaces
npm install

# Start the core application
npm run core:dev

# Start the marketing site
npm run marketing:dev

# Run E2E tests
npm run e2e:test
```

### Development Commands
```bash
# Build all applications
npm run build

# Run tests across all packages
npm run test

# Lint all code
npm run lint

# Clean all build artifacts
npm run clean
```

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

## 🔧 Configuration Updates

### Core App
- Updated `apps/core/tailwind.config.cjs` to extend shared preset
- Maintained all existing functionality and white-wine theme
- Preserved all recent UI improvements and styling

### Marketing Site
- Moved from `blog/` to `apps/marketing/`
- Maintained Astro configuration and content

## 📋 Environment Variables

Copy `env.example` to `.env` and configure:
- Database connection
- Authentication providers
- Payment processors
- File storage
- Analytics services

## 🧪 Testing

- E2E tests moved to `tests/e2e/`
- Maintained Playwright configuration
- All test scripts updated for new structure

## 🚢 Deployment

- Docker configurations in `infra/docker/`
- GitHub Actions CI in `infra/deploy/.github/workflows/`
- Ready for deployment to various platforms

## 📚 Documentation

- Updated README.md with new structure
- All implementation docs preserved in `apps/core/`
- Archive contains legacy documentation for reference

## ✅ Migration Complete

All files have been successfully migrated to the new monorepo structure while preserving:
- ✅ Complete git history
- ✅ All development work
- ✅ White-wine luxury theme implementation
- ✅ Recent UI improvements
- ✅ All functionality and features

The repository is now ready for professional development with a clean, scalable structure.
