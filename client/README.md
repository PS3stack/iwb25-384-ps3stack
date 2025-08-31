# PS3Stack Client Application

The Next.js frontend application for the PS3Stack Voting System. This modern web application provides an intuitive interface for election management, voter operations, and system administration.

## 🎯 Purpose

The Client Application provides:

- **Modern Web Interface** - Responsive design for all devices
- **Role-Based UI** - Customized interfaces for different user types
- **Real-Time Updates** - Live election data and results
- **Interactive Components** - Rich user interactions and feedback
- **Secure Authentication** - JWT-based authentication with role management

## 🏗️ Architecture

```
Browser → Next.js Client (Port 3000) → API Gateway (Port 8080) → Microservices
    ↓
React Components
    ↓
Tailwind CSS Styling
    ↓
API Integration
    ↓
Authentication Context
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn package manager
- Running PS3Stack backend services
- Modern web browser

### Installation

1. **Navigate to Client Directory**:

   ```bash
   cd client
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**:

   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   NEXT_PUBLIC_APP_NAME=PS3Stack Voting System
   NEXT_PUBLIC_ENABLE_ANALYTICS=false
   ```

### Running the Application

```bash
# Development mode
npm run dev
# or
yarn dev

# Production build
npm run build
npm start
# or
yarn build
yarn start

# Access the application
# Open http://localhost:3000 in your browser
```

## 🔐 User Authentication

### Demo Accounts

The application includes pre-configured demo accounts for testing:

#### Admin Account
- **Email**: `admin@test.com`
- **Password**: `password123`
- **Role**: Administrator
- **Access**: Full system administration

#### Observer Account
- **Email**: `observer@test.com`
- **Password**: `password123`
- **Role**: Election Observer
- **Access**: Election monitoring and candidate management

#### Field Staff Account
- **Email**: `fieldstaff@test.com`
- **Password**: `password123`
- **Role**: Field Staff
- **Access**: Voter registration and field operations

#### Polling Staff Account
- **Email**: `pollingstaff@test.com`
- **Password**: `password123`
- **Role**: Polling Staff
- **Access**: Voter check-in and polling operations

### Login Process

1. Navigate to the login page
2. Select your role (Admin, Observer, Field Staff, or Polling Staff)
3. Enter email and password
4. Click "Sign In"
5. Access role-specific dashboard

## 🎨 User Interface

### Dashboard Views

#### Admin Dashboard
- **Election Management** - Create, edit, and delete elections
- **User Administration** - Manage system users and roles
- **System Overview** - Monitor system health and statistics
- **Analytics** - Comprehensive reporting and analytics
- **Settings** - System configuration and preferences

#### Observer Dashboard
- **Election Monitoring** - Real-time election oversight
- **Candidate Management** - Add and manage candidates
- **Voter Oversight** - Monitor voter registration
- **Results Viewing** - Access election results
- **Reports** - Generate monitoring reports

#### Field Staff Dashboard
- **Voter Registration** - Register new voters
- **Area Management** - Manage geographic areas
- **Equipment Setup** - Configure voting equipment
- **Data Collection** - Collect field data
- **Status Reports** - Submit field reports

#### Polling Staff Dashboard
- **Voter Check-in** - Process voter check-ins
- **Polling Operations** - Manage polling station
- **Incident Reporting** - Report issues and incidents
- **Vote Processing** - Assist with voting process
- **Station Status** - Monitor station operations

### Key Features

#### Responsive Design
- **Mobile Optimized** - Works on all screen sizes
- **Touch-Friendly** - Optimized for touch interactions
- **Progressive Web App** - Can be installed on devices
- **Offline Support** - Basic functionality without internet

#### Real-Time Updates
- **Live Data** - Real-time election data updates
- **Notifications** - System alerts and messages
- **Status Indicators** - Live system status displays
- **Auto-Refresh** - Automatic data refreshing

#### Interactive Components
- **Data Tables** - Sortable and filterable tables
- **Charts and Graphs** - Visual data representation
- **Forms** - Intuitive data entry forms
- **Modals** - Context-specific dialog boxes

## 🛡️ Security Features

### Authentication
- **JWT Tokens** - Secure token-based authentication
- **Role-Based Access** - Different access levels per role
- **Session Management** - Secure session handling
- **Automatic Logout** - Security timeout protection

### Data Protection
- **HTTPS Enforcement** - Secure data transmission
- **Input Validation** - Client-side data validation
- **XSS Protection** - Cross-site scripting prevention
- **CSRF Protection** - Cross-site request forgery protection

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_API_TIMEOUT=30000

# Application Configuration
NEXT_PUBLIC_APP_NAME=PS3Stack Voting System
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_SUPPORT_EMAIL=support@ps3stack.com

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_CHAT_SUPPORT=true
NEXT_PUBLIC_ENABLE_REAL_TIME_UPDATES=true

# Development Configuration
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_MOCK_API=false
```

### Build Configuration

#### next.config.ts

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ]
  },
}

export default nextConfig
```

#### Tailwind Configuration

```javascript
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}
```

## 📱 Components Architecture

### Layout Components

#### MainLayout
- **Navigation Bar** - Top navigation with user menu
- **Sidebar** - Role-specific navigation menu
- **Content Area** - Main application content
- **Footer** - Application footer with links

#### AuthLayout
- **Centered Design** - Focused authentication interface
- **Responsive Form** - Mobile-optimized login forms
- **Branding** - Application logo and branding

### Feature Components

#### Elections
- **ElectionList** - Display all elections
- **ElectionForm** - Create/edit election form
- **ElectionCard** - Individual election display
- **ElectionResults** - Results visualization

#### Candidates
- **CandidateList** - List all candidates
- **CandidateForm** - Add/edit candidate form
- **CandidateCard** - Individual candidate display
- **CandidateProfile** - Detailed candidate view

#### Voters
- **VoterList** - Voter management interface
- **VoterForm** - Voter registration form
- **VoterSearch** - Search voters interface
- **VoterCheckIn** - Check-in interface

#### Support
- **SupportChatModal** - AI chatbot interface
- **HelpButton** - Context-sensitive help
- **FAQSection** - Frequently asked questions
- **ContactForm** - Support contact form

### Shared Components

#### UI Components
- **Button** - Reusable button component
- **Input** - Form input components
- **Modal** - Dialog modal component
- **Table** - Data table component
- **Chart** - Chart visualization component

#### Layout Components
- **Header** - Page header component
- **Sidebar** - Navigation sidebar
- **Breadcrumb** - Navigation breadcrumbs
- **LoadingSpinner** - Loading indicators

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test
# or
yarn test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- __tests__/components/elections.test.tsx
```

### Testing Examples

#### Component Testing

```typescript
import { render, screen } from '@testing-library/react'
import ElectionCard from '@/components/elections/ElectionCard'

test('renders election card with title', () => {
  const election = {
    id: 1,
    title: 'Test Election',
    description: 'Test Description',
    start_date: '2024-01-01',
    end_date: '2024-01-02'
  }
  
  render(<ElectionCard election={election} />)
  
  expect(screen.getByText('Test Election')).toBeInTheDocument()
})
```

#### API Testing

```typescript
import { mockAPI } from '@/lib/mock-api'

test('fetches elections successfully', async () => {
  const elections = await mockAPI.getElections()
  expect(elections).toHaveLength(3)
  expect(elections[0]).toHaveProperty('title')
})
```

## 🚀 Development Workflow

### Project Structure

```
client/
├── public/                 # Static assets
│   ├── images/            # Image files
│   └── icons/             # Icon files
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   ├── login/         # Authentication pages
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── elections/     # Election pages
│   │   ├── candidates/    # Candidate pages
│   │   ├── voters/        # Voter pages
│   │   └── settings/      # Settings pages
│   ├── components/        # React components
│   │   ├── ui/            # UI components
│   │   ├── layout/        # Layout components
│   │   ├── elections/     # Election components
│   │   ├── candidates/    # Candidate components
│   │   ├── voters/        # Voter components
│   │   └── shared/        # Shared components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   │   ├── api.ts         # API client
│   │   ├── auth.tsx       # Authentication context
│   │   ├── types.ts       # TypeScript types
│   │   └── utils.ts       # Utility functions
│   └── styles/            # CSS styles
├── __tests__/             # Test files
├── package.json           # Dependencies and scripts
├── next.config.ts         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS config
└── tsconfig.json          # TypeScript config
```

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run type checking
npm run type-check

# Generate component
npm run generate:component ComponentName
```

### Code Style Guidelines

#### TypeScript
- Use TypeScript for all components
- Define proper interfaces and types
- Use strict mode configuration
- Follow naming conventions

#### React
- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices
- Use proper key props for lists

#### Styling
- Use Tailwind CSS for styling
- Follow mobile-first approach
- Use consistent spacing and colors
- Implement accessible designs

## 🚢 Deployment

### Production Build

```bash
# Create production build
npm run build

# Test production build locally
npm start

# Docker deployment
docker build -t ps3stack-client .
docker run -p 3000:3000 ps3stack-client
```

### Docker Configuration

#### Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Environment Setup

#### Production Environment

```env
NEXT_PUBLIC_API_BASE_URL=https://api.ps3stack.com
NEXT_PUBLIC_APP_NAME=PS3Stack Voting System
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_CHAT_SUPPORT=true
NODE_ENV=production
```

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify backend services are running
   - Check `NEXT_PUBLIC_API_BASE_URL` configuration
   - Ensure network connectivity

2. **Authentication Issues**
   - Clear browser localStorage and cookies
   - Verify JWT token format
   - Check auth service availability

3. **Build Errors**
   - Clear `.next` directory and rebuild
   - Update dependencies to latest versions
   - Check TypeScript configuration

4. **Styling Issues**
   - Verify Tailwind CSS configuration
   - Check CSS import order
   - Clear browser cache

### Debug Commands

```bash
# Check API connectivity
curl http://localhost:8080/health

# Verify environment variables
npm run env

# Clear Next.js cache
rm -rf .next

# Reset node modules
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📞 Support

For technical support or questions:

- **Documentation**: Check the README files
- **Issues**: Create GitHub issues for bugs
- **Chat**: Use the in-app support chat
- **Email**: contact the development team
