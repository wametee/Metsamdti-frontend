# Metsamdti Frontend

A private, marriage-focused matchmaking platform built with Next.js 16, React 19, and TypeScript. This frontend provides a clean, intentional user experience for people seeking serious, marriage-focused relationships.

## 🎯 Project Overview

Metsamdti is a privacy-first matchmaking platform where:
- Users complete a structured onboarding process
- Admin curates and proposes matches
- Paid, time-limited chat windows enable connections
- Privacy and trust are core values

## 🚀 Tech Stack

- **Framework**: Next.js 16.0.5 (App Router)
- **UI Library**: React 19.2.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Internationalization**: next-intl (English & Tigrinya)
- **API Client**: Custom fetch wrapper

## 📁 Project Structure

```
metsamdti-frontend/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages (Home, About)
│   ├── (auth)/            # Authentication (Login, Signup, Verify)
│   ├── (onboarding)/      # Multi-step onboarding wizard
│   ├── app/               # Protected user area
│   ├── admin/             # Admin dashboard
│   └── api/proxy/         # API proxy to backend
├── components/             # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── public/           # Public page components
│   ├── auth/             # Auth components
│   ├── onboarding/       # Onboarding components
│   ├── app/              # App components
│   ├── chat/             # Chat components
│   └── admin/            # Admin components
├── lib/                   # Shared code
│   ├── api/             # API client functions
│   ├── utils/           # Utility functions
│   └── constants.ts     # App constants
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── proxy.ts              # Route protection (Next.js 16)
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ (recommended: 22.x)
- npm or yarn

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   cd metsamdti-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   > Note: `--legacy-peer-deps` is needed due to next-intl compatibility with Next.js 16

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_GATEWAY=http://localhost:3000/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📜 Available Scripts

- `npm run dev` - Start development server (Turbopack)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Architecture Highlights

### Route Groups

The app uses Next.js route groups for clean organization:
- `(public)` - No authentication required
- `(auth)` - Authentication flows
- `(onboarding)` - Multi-step wizard (protected)
- `app` - User area (post-onboarding)
- `admin` - Admin dashboard (role-protected)

### API Integration

All API calls go through `/api/proxy/route.ts` which:
- Forwards requests to backend microservices
- Handles same-site cookies for authentication
- Eliminates CORS issues
- Centralizes logging and error handling

### State Management

- **TanStack Query**: Server state and caching
- **React Context**: Language preferences
- **Local Storage**: Onboarding progress (temporary)

### Internationalization

Supports English (`en`) and Tigrinya (`ti`):
- Language preference stored per user
- RTL support for Tigrinya
- Translation files in `lib/i18n/`

## 🔐 Authentication Flow

1. User signs up → Email/phone verification
2. After verification → Redirected to onboarding
3. Complete onboarding → Access to app area
4. Admin reviews → Match proposals
5. Payment unlocks → Time-limited chat

## 🎨 Component Organization

Components are organized by domain:
- `components/ui/` - Reusable primitives (Button, Input, Card)
- `components/layout/` - Header, Footer, LanguageSwitcher
- `components/public/` - Home page sections
- `components/auth/` - Login/Signup forms
- `components/onboarding/` - Wizard components
- `components/app/` - User-facing features
- `components/chat/` - Chat interface
- `components/admin/` - Admin tools

## 🔒 Security Features

- HTTP-only, SameSite cookies
- Route protection via `proxy.ts`
- CSRF protection
- XSS prevention
- Rate limiting (backend)
- GDPR compliance ready

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow Next.js App Router conventions
- Use server components by default
- Mark client components with `"use client"`
- Use Tailwind CSS for styling

### Import Paths

All imports use the `@/` alias:
```typescript
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { User } from "@/types";
```

### Adding New Features

1. Create route in appropriate route group
2. Add components in `components/` folder
3. Add API functions in `lib/api/`
4. Add types in `types/index.ts`
5. Update constants in `lib/constants.ts`

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_GATEWAY` | Backend API URL | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | For payments |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default language | No (default: `en`) |

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill existing process
pkill -f "next dev"
# Or use different port
PORT=3001 npm run dev
```

### npm cache issues
```bash
npm cache clean --force
rm -rf node_modules .next
npm install --legacy-peer-deps
```

### Type errors
```bash
# Check TypeScript
npm run type-check
# Or
npx tsc --noEmit
```

## 📚 Key Features

- ✅ Linear onboarding flow (5 steps)
- ✅ Admin-curated matching
- ✅ Time-limited chat sessions
- ✅ Payment integration (Stripe)
- ✅ Multi-language support (EN/TI)
- ✅ Responsive design
- ✅ Privacy-first architecture

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📄 License

Private - All rights reserved

## 🔗 Related

- [Backend Repository](../Mexamdti-backend) - Event-driven microservices
- [Architecture Documentation](./ARCHITECTURE.md) - Detailed architecture
- [Structure Documentation](./STRUCTURE.md) - Folder structure guide

---

**Built with care for meaningful connections** 💝
