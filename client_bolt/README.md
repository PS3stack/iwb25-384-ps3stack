# SP3 Vote Core - Multi-tenant Election & Census Frontend

A modern, responsive frontend for election and census management built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Multi-tenant Architecture**: Subdomain-based tenant routing with customizable themes
- **Role-based Access Control**: Admin, Committee, Observer, Voter, and Census Officer portals
- **Real-time Dashboards**: Live election monitoring and census tracking
- **Anonymous Voting**: Token-based system ensuring voter privacy
- **Responsive Design**: Mobile-first approach with optimized layouts
- **Accessibility**: WCAG compliant components and keyboard navigation
- **Animations**: Smooth transitions using Framer Motion

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animation**: Framer Motion
- **HTTP Client**: Axios (stubbed endpoints)
- **State Management**: React Context + Zustand
- **Charts**: Recharts
- **Deployment**: Docker + AWS multi-tenant setup

## Project Structure

```
app/
├── page.tsx                    # Public dashboard
├── admin/                      # Admin portal
├── committee/                  # Committee/Observer portal  
├── census/                     # Census officer portal
└── voter/                      # Voting interface

components/
├── ui/                         # shadcn/ui components
├── layout/                     # Headers, sidebars
├── dashboard/                  # Metric cards, charts
├── forms/                      # Login, voting forms
└── charts/                     # Data visualizations

lib/
├── api/                        # Axios service layer
└── utils.ts                    # Utility functions

context/
├── auth-context.tsx            # Authentication state
└── tenant-context.tsx          # Multi-tenant config

data/fixtures/                  # Mock data for development
```

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build Docker image manually
docker build -t sp3-vote-frontend .
docker run -p 3000:3000 sp3-vote-frontend
```

## Authentication

Demo credentials for testing:

- **Admin**: admin@election.gov / demo123
- **Committee**: committee@election.gov / demo123  
- **Observer**: observer@election.gov / demo123
- **Census**: grama@census.gov / demo123

## API Integration

All API calls are currently stubbed with dummy data. To integrate with a real backend:

1. Update `NEXT_PUBLIC_API_URL` in environment variables
2. Uncomment axios calls in `/lib/api/` services
3. Remove mock data returns and fixtures

## Multi-tenant Setup

Configure tenant settings in `context/tenant-context.tsx`:

```typescript
const tenantConfig = {
  id: 'tenant_001',
  name: 'Election Authority',
  domain: 'elections.gov',
  theme: {
    primary: '#2563eb',
    secondary: '#06b6d4'
  },
  features: {
    multiElections: true,
    census: true,
    ipRestriction: true,
    liveResults: true
  }
};
```

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://api.sp3vote.example.com
NEXT_PUBLIC_TENANT_DOMAIN=sp3vote.example.com
NODE_ENV=production
```

## Deployment

### AWS Multi-tenant Architecture

1. **API Gateway**: Route subdomains to appropriate tenant configs
2. **CloudFront**: CDN with custom domains
3. **S3**: Static asset hosting
4. **Route 53**: DNS management for subdomains

### Subdomain Routing

```
admin.tenant1.sp3vote.com -> Admin Portal (Tenant 1)
vote.tenant1.sp3vote.com -> Voter Portal (Tenant 1)
admin.tenant2.sp3vote.com -> Admin Portal (Tenant 2)
```

## Performance

- **Bundle Size**: Optimized with tree shaking and code splitting
- **Caching**: Static generation with ISR for dashboard data
- **Images**: Next.js Image optimization with lazy loading
- **Fonts**: Google Fonts with font-display: swap

## Security

- **CSRF Protection**: Built-in Next.js protection
- **XSS Prevention**: Sanitized inputs and CSP headers
- **Authentication**: JWT tokens with secure storage
- **Role Validation**: Server-side and client-side checks
- **IP Restrictions**: Configurable per election

## Accessibility

- **WCAG 2.1 AA**: Compliant color contrast and navigation
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow TypeScript and ESLint rules
4. Add tests for new features
5. Submit a pull request

## License

MIT License - See LICENSE file for details