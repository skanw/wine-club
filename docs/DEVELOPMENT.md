# Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ LTS
- Wasp CLI (`npm install -g @wasp/cli`)
- PostgreSQL 15+
- Git

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd wineSAAS/wine-club-saas/app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the development server
wasp start
```

## 🏗️ Project Structure

```
app/
├── src/
│   ├── client/              # Frontend React components
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── styles/         # CSS and design tokens
│   │   └── utils/          # Frontend utilities
│   ├── server/             # Backend operations
│   ├── shared/             # Shared types and utilities
│   └── admin/              # Admin dashboard
├── public/                 # Static assets
├── migrations/             # Database migrations
└── main.wasp              # Wasp configuration
```

## 🔧 Development Workflow

### 1. Feature Development
```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes and test
wasp start

# Run tests
npm test

# Commit changes
git add .
git commit -m "feat: add your feature description"
```

### 2. Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb config with custom rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

### 3. Testing Strategy
```bash
# Run all tests
npm test

# Run e2e tests
cd ../e2e-tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
```

## 🎨 Frontend Development

### Component Development
```typescript
// Example component structure
import React from 'react';
import { cn } from '../utils/cn';

interface ComponentProps {
  className?: string;
  children: React.ReactNode;
}

export const Component: React.FC<ComponentProps> = ({ 
  className, 
  children 
}) => {
  return (
    <div className={cn('base-styles', className)}>
      {children}
    </div>
  );
};
```

### Styling Guidelines
- Use Tailwind CSS for styling
- Follow the design system tokens
- Implement responsive design patterns
- Ensure accessibility compliance

### State Management
- Use React hooks for local state
- Wasp queries for server state
- Context for global state when needed

## 🔧 Backend Development

### Operations
```typescript
// Example operation
import { GetWines } from '@wasp/queries/Wine';
import { Wine } from '@wasp/entities/Wine';

export const getWines: GetWines<void, Wine[]> = async (args, context) => {
  return context.entities.Wine.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });
};
```

### Database Migrations
```bash
# Create a new migration
wasp db migrate-dev

# Apply migrations
wasp db migrate-deploy

# Reset database
wasp db reset
```

## 🧪 Testing

### Unit Tests
```typescript
// Example test
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component>Test content</Component>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
```

### Integration Tests
- Test API endpoints
- Test database operations
- Test authentication flows

### E2E Tests
- Test complete user journeys
- Test critical business workflows
- Test responsive behavior

## 🚀 Build & Deployment

### Development Build
```bash
wasp build
```

### Production Build
```bash
wasp build --optimize
```

### Environment Configuration
```bash
# Development
wasp start

# Production
wasp start --env production
```

## 🔍 Debugging

### Frontend Debugging
- Use React DevTools
- Check browser console
- Use Wasp DevTools

### Backend Debugging
- Check server logs
- Use database tools
- Monitor API requests

### Common Issues
1. **Build Errors**: Check TypeScript compilation
2. **Database Issues**: Verify migrations and connections
3. **Auth Problems**: Check OAuth configuration
4. **Styling Issues**: Verify Tailwind compilation

## 📚 Resources

- [Wasp Documentation](https://wasp-lang.dev/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs) 