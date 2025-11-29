# Metsamdti Frontend Architecture

## Overview

This frontend follows a senior engineer's battle-tested architecture for a privacy-first, marriage-focused matchmaking platform. Built with Next.js 15 App Router, React 19, and modern best practices.

## Folder Structure

```
metsamdti-frontend/
├── src/
│   ├── app/                      # All routes here – App Router magic
│   │   ├── (public)/             # No auth required – Home & About
│   │   │   ├── layout.tsx        # Shared public header (logo, lang switcher, login CTA)
│   │   │   ├── page.tsx          # Home: Hero, values, testimonials, signup CTA
│   │   │   └── about/
│   │   │       └── page.tsx      # About: Mission, process overview, privacy emphasis
│   │   │
│   │   ├── (auth)/               # Auth flows – redirect to onboarding on success
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # Email/phone + password + social? (Figma form)
│   │   │   ├── signup/
│   │   │   │   └── page.tsx      # Basic register (name, email/phone, birth year?) + verify redirect
│   │   │   └── verify/
│   │   │       └── [token]/
│   │   │           └── page.tsx  # Email/SMS verification + auto-redirect to onboarding
│   │   │
│   │   ├── (onboarding)/         # Post-auth wizard – **linear flow until complete**
│   │   │   ├── layout.tsx        # Wizard shell: Progress bar (5 steps), back/next buttons, lang selector
│   │   │   ├── photos/
│   │   │   │   └── page.tsx      # Upload 5-6 photos (drag-drop, guidelines modal from Figma)
│   │   │   ├── basics/
│   │   │   │   └── page.tsx      # Selectors: Gender, city/country, display name (real name hidden)
│   │   │   ├── preferences/
│   │   │   │   └── page.tsx      # Age range sliders, religion/origin dropdowns, children toggles
│   │   │   ├── questionnaire/
│   │   │   │   └── page.tsx      # MBTI-style multi-choice (score on submit, feed to backend)
│   │   │   └── complete/
│   │   │       └── page.tsx      # Success screen: "Profile submitted! Admin will review soon." + logout/faq links
│   │   │
│   │   ├── app/                  # Post-onboarding – only after complete (middleware-enforced)
│   │   │   ├── layout.tsx        # Minimal: Logo, notifications bell, logout
│   │   │   ├── waiting/
│   │   │   │   └── page.tsx      # Calm holding page: Inspirational quote, "Awaiting your match..."
│   │   │   └── match/
│   │   │       └── [id]/
│   │   │           ├── page.tsx  # Match reveal: Teaser photo, admin note, unlock CTA
│   │   │           ├── unlock/
│   │   │           │   └── page.tsx  # Payment form (Stripe integration)
│   │   │           └── chat/
│   │   │               └── page.tsx  # Temporary chat room + timer
│   │   │
│   │   ├── admin/                # Your private dashboard (role-protected)
│   │   │   ├── layout.tsx        # Sidebar: Users, Matches, Payments, Settings
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   ├── page.tsx      # Searchable list (filters: age, religion, status)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # Deep profile view (photos, questionnaire scores)
│   │   │   ├── matches/
│   │   │   │   └── page.tsx
│   │   │   └── payments/
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/
│   │   │   └── proxy/
│   │   │       └── route.ts      # Gateway to your backend microservices
│   │   │
│   │   ├── layout.tsx            # Root layout (providers, fonts)
│   │   └── page.tsx              # Redirects to (public)/page.tsx
│   │
│   ├── components/
│   │   ├── ui/                   # Figma primitives: Button, Input, Modal, Card, ProgressBar
│   │   ├── public/               # HeroSection, TestimonialCarousel, ValueCards
│   │   ├── auth/                 # LoginForm, SignupForm (with validation)
│   │   ├── onboarding/           # PhotoUploader (multi-file, preview), QuestionnaireQuestion, StepIndicator
│   │   ├── app/                  # MatchTeaser, UnlockModal, ChatBubble
│   │   └── admin/                # UserTable (sortable/searchable), ProfileGallery, MatchProposalForm
│   │
│   ├── lib/
│   │   ├── api/                  # Typed clients (auth, user, match, etc.) – proxy to backend
│   │   │   ├── client.ts         # Fetch wrapper (cookies, i18n headers)
│   │   │   ├── auth.ts           # login(), signup(), verify()
│   │   │   ├── onboarding.ts     # saveStep(), completeProfile()
│   │   │   └── admin.ts          # getUsers(), proposeMatch()
│   │   ├── utils/                # formValidation (Zod), dateFormat, cn (clsx)
│   │   └── constants/            # ONBOARDING_STEPS, MATCH_WINDOW_DEFAULT_HOURS
│   │
│   ├── hooks/
│   │   ├── useOnboardingProgress.ts  # Tracks step completion (localStorage + backend sync)
│   │   ├── useCurrentUser.ts         # Fetches user state (onboarding complete?)
│   │   └── useLanguage.ts            # i18n toggle (en/ti)
│   │
│   ├── types/                    # User, OnboardingStep, QuestionnaireResponse, Match
│   └── i18n/                     # next-intl: en.json, ti.json (Tigrinya translations)
│
├── public/                        # Static assets from Figma
│   ├── images/                   # Hero bg, icons, placeholders
│   └── fonts/                    # Ge'ez script for Tigrinya
│
├── middleware.ts                  # Enforce flow: auth → onboarding complete → app access
├── next.config.mjs
├── tailwind.config.ts            # Custom colors/fonts from Figma
└── package.json
```

## Key Architecture Decisions

### 1. Route Groups

Using Next.js route groups to organize routes without affecting URLs:
- `(public)` - Public pages (Home, About) - no auth required
- `(auth)` - Authentication flows (login, signup, verify) - redirect to onboarding on success
- `(onboarding)` - Post-auth wizard - **linear flow until complete** (middleware-enforced)
- `app` - Protected user routes (waiting, match, chat) - only after onboarding complete
- `admin` - Admin-only routes (role-protected)

### 2. API Proxy Pattern

All API calls go through `/api/proxy/route.ts` which:
- Forwards requests to backend microservices
- Handles same-site cookies (critical for auth)
- Eliminates CORS issues
- Centralizes logging, rate-limiting, auth checks
- Routes: `/api/proxy/auth/*`, `/api/proxy/user/*`, `/api/proxy/match/*`, etc.

### 3. TanStack Query (React Query)

- Centralized data fetching
- Automatic caching and refetching
- Optimistic updates
- Error handling
- Loading states

### 4. Type-Safe API Layer

All API functions are typed with TypeScript:
```typescript
userApi.getMe() // Returns Promise<User>
matchApi.getMatch(id) // Returns Promise<Match>
```

### 5. Custom Hooks

Domain-specific hooks for data fetching:
- `useUser()` - Current user data
- `useMatches()` - User matches
- `useChatSession()` - Chat session with auto-refresh
- `useSendMessage()` - Send chat message

### 6. Component Organization

- `components/ui/` - Reusable UI components (from Figma)
- `components/forms/` - Form components
- `components/onboarding/` - Onboarding flow components
- `components/profile/` - Profile-related components
- `components/match/` - Match-related components
- `components/admin/` - Admin-only components

## Data Flow

### Example: User Views a Match

1. User navigates to `/app/match/[id]`
2. Server component fetches match via `matchApi.getMatch(id)` (SSR)
3. If match has active paid window → show chat button
4. User clicks chat → navigates to `/app/match/[id]/chat`
5. Chat component uses `useChatSession()` hook
6. WebSocket connection opens (authenticated via cookie)
7. Messages stored temporarily in Redis, purged after expiration

### Example: Admin Creates Match

1. Admin navigates to `/admin/users/[id]`
2. Reviews full profile + questionnaire
3. Clicks "Create Match" → selects second user
4. Adds match notes
5. Submits via `adminApi.createMatch()`
6. Both users receive notifications
7. Match appears in their dashboards

## Authentication Strategy

- HTTP-Only, SameSite=Strict cookies
- Short-lived access tokens (15 minutes)
- Refresh tokens in httpOnly cookies
- Middleware checks authentication for protected routes
- Automatic redirect to login if not authenticated

## Middleware Flow Enforcement (Critical)

The middleware enforces the linear user journey:

1. **Public Routes** (`(public)/*`): No auth required
2. **Auth Routes** (`(auth)/*`): Redirect authenticated users to onboarding or app
3. **Onboarding Routes** (`(onboarding)/*`): 
   - Must be authenticated
   - Check `user.onboardingComplete` flag from backend
   - If complete → redirect to `/app/waiting`
   - Enforce step order (can't skip to `/questionnaire` if `/photos` incomplete)
   - Track current step in localStorage + backend sync
4. **App Routes** (`(app)/*`):
   - Must be authenticated
   - Must have `onboardingComplete === true`
   - If incomplete → redirect to current onboarding step
5. **Admin Routes** (`/admin/*`):
   - Must be authenticated
   - Must have `user.is_admin === true`
   - Else → redirect to `/app/waiting`

**Middleware Implementation:**

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Fetch user from your auth service via proxy
  const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/me`, {
    headers: { cookie: request.headers.get('cookie') || '' },
  });
  const user = userResponse.ok ? await userResponse.json() : null;

  const { pathname } = request.nextUrl;

  // Redirect unauth to login
  if (pathname.startsWith('/onboarding') || pathname.startsWith('/app')) {
    if (!user) return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Enforce onboarding completion
  if (pathname.startsWith('/app') && !user?.onboardingComplete) {
    return NextResponse.redirect(new URL('/onboarding/photos', request.url)); // Or current step
  }

  // Admin protection
  if (pathname.startsWith('/admin') && user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/app/waiting', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/onboarding/:path*', '/app/:path*', '/admin/:path*'],
};
```

**Implementation Notes:**
- Fetch user from `/api/proxy/auth/me` (via cookie)
- Cache user in request context (avoid duplicate calls)
- Handle edge cases: expired tokens, suspended accounts
- Enforce step order: can't skip to `/questionnaire` if `/photos` incomplete

## Internationalization

- Using `next-intl` for App Router
- Supports English (en) and Tigrinya (ti)
- Translation files in `src/i18n/` (en.json, ti.json)
- Language selector in every layout (globe icon → dropdown)
- Language preference stored per user
- RTL support for Tigrinya (next-intl handles)

## Privacy-First Considerations

1. **No Profile Visibility**: Users never see other profiles in UI
2. **Signed URLs**: Photos use signed URLs that expire in 5-10 minutes
3. **UUIDs**: No sequential user IDs
4. **Admin Logging**: All admin actions logged
5. **GDPR Compliance**: Data deletion endpoints
6. **Rate Limiting**: WAF on photo upload endpoints

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 15 (App Router) | Server Components, streaming, partial prerendering |
| UI Library | React 19 | Latest React features |
| Styling | Tailwind CSS + clsx | Utility-first, matches Figma designs |
| State Management | TanStack Query + Zustand | No Redux needed |
| Forms | React Hook Form + Zod | Type-safe, performant |
| i18n | next-intl | App Router native, RTL support |
| API Client | Custom (fetch) | Simple, no Axios needed |

## Key Design Decisions (Senior Full-Stack Perspective)

### Linear Onboarding Enforcement
- Use `middleware.ts` to check `user.onboardingComplete` from your auth microservice
- After signup, redirect to `/onboarding/photos`
- Next button hits `onboardingApi.saveStep()` → unlocks next route
- If they bookmark `/app/waiting` mid-onboarding? Redirect back to current step

### Figma-to-Code Mapping
- **Home** (`(public)/page.tsx`): Full-width hero (serene couple imagery?), 3-column values (Privacy, Trust, Deliberate), signup button → `/auth/signup`
- **About**: Timeline of process (Register → Review → Match → Connect), FAQ accordion
- **Signup/Login**: Centered forms with validation (Zod + React Hook Form). Error states (e.g., "Email already exists")
- **Onboarding Steps**: Each `page.tsx` is a single form/step. Shared `layout.tsx` has a horizontal progress bar (e.g., 20% → 40% → ...). Back/Next buttons persist data via API
- **Photos**: Multi-upload with crop/preview + guidelines toast
- **Questionnaire**: Radio groups, auto-score on submit (send to backend for matching insights)
- **Mobile-first**: All responsive, with touch-friendly sliders for age ranges

### API Integration with Your Backend
- Onboarding saves incrementally: `POST /user/onboarding/step` (photos as multipart to storage service)
- Complete step: `POST /user/onboarding/finish` → sets flag, emails admin via notification service
- All via `/api/proxy` → your microservices (e.g., `/user/onboarding/...`)

### i18n for English/Tigrinya
- Language selector in every layout (globe icon → dropdown)
- RTL support if Tigrinya needs it (next-intl handles)

### Performance & Scalability
- Server Components for static parts (home/about)
- TanStack Query for onboarding state (optimistic updates on next button)
- Photos: Presigned S3 URLs from your storage service

## Critical System Design Decisions

### 1. Onboarding State Management
- **Local Storage**: Track current step for UX (back button, refresh resilience)
- **Backend Sync**: Each step saves via `POST /api/proxy/user/onboarding/step`
- **Progress Calculation**: Backend returns `{ currentStep, completedSteps: string[] }`
- **Step Locking**: Frontend disables "Next" until current step validated
- **Completion Flag**: Backend sets `user.onboardingComplete = true` on final step

### 2. Match Flow & Payment Integration
- **Match Notification**: Admin creates match → both users see in `/app/waiting`
- **Match Reveal**: Click match → `/app/match/[id]` shows teaser photo + admin note
- **Unlock Flow**: User clicks "Unlock Chat" → `/app/match/[id]/unlock` → Stripe payment
- **Payment Success**: Redirect to `/app/match/[id]/chat` with active session
- **Chat Timer**: Real-time countdown (WebSocket or polling) shows remaining time
- **Expiry Handling**: Auto-close chat UI when `expires_at` reached

### 3. Photo Upload Strategy
- **Direct Upload**: Frontend → Backend → Storage Service (S3/Cloudflare R2)
- **Presigned URLs**: Backend generates presigned upload URLs per photo
- **Validation**: Client-side (file type, size) + server-side (content moderation)
- **Progress Tracking**: Show upload progress per photo (5-6 required)
- **Preview**: Allow crop/adjust before final upload
- **Guidelines Modal**: Show photo requirements from Figma

### 4. Questionnaire Scoring
- **Client-Side Calculation**: Calculate compatibility score on submit
- **Backend Storage**: Send `QuestionnaireResponse[]` with scores
- **Admin View**: Show score breakdown in admin dashboard for matching insights
- **No User Visibility**: Users never see their own scores (admin-only)

### 5. Chat Session Management
- **Time-Limited**: Default 2-4 hours (admin configurable, max 12 hours)
- **Real-Time**: WebSocket connection (or Server-Sent Events for simplicity)
- **Message Persistence**: Store in Redis/DB, purge after expiry + 30 days
- **Expiry Warning**: Show "5 minutes remaining" notification
- **Auto-Close**: Disable input, show "Session expired" message

### 6. Admin Workflow
- **Profile Review**: `/admin/users/[id]` shows full profile + questionnaire
- **Match Creation**: Select two users → add match notes → create match
- **Payment Window Control**: Admin can trigger paid window manually or auto on match acceptance
- **Refund Management**: View payment → issue refund/credit with reason logging
- **Analytics**: Export anonymized stats (signups, matches, revenue)

## Quick Implementation Starter

### Update Your Existing Setup

```bash
cd metsamdti-frontend
npm install next@15 react@19 react-dom@19 @tanstack/react-query@5 zod react-hook-form @hookform/resolvers/zod next-intl clsx tailwind-merge
```

### Onboarding Layout Example

```tsx
'use client';
import { useOnboardingProgress } from '@/hooks/useOnboardingProgress';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { currentStep } = useOnboardingProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="p-4 flex justify-between">
        <Logo />
        <LanguageSwitcher />
      </header>
      <main className="max-w-2xl mx-auto p-6">
        <StepIndicator currentStep={currentStep} totalSteps={5} />
        {children}
      </main>
    </div>
  );
}
```

## Next Steps (Priority Order)

1. ⏳ **Folder structure** (src/ with app/, components/, lib/, hooks/, types/, i18n/)
2. ⏳ **Middleware implementation** (CRITICAL - blocks all routes)
3. ⏳ **API proxy route** (`/api/proxy/route.ts`)
4. ⏳ **Onboarding state management** (localStorage + backend sync)
5. ⏳ **TanStack Query setup** with typed API clients
6. ⏳ **Public pages** (home, about) from Figma
7. ⏳ **Auth pages** (login, signup, verify)
8. ⏳ **Onboarding flow** (photos → basics → preferences → questionnaire → complete)
9. ⏳ **Waiting page** (post-onboarding holding state)
10. ⏳ **Match reveal & chat** (with payment unlock)
11. ⏳ **Admin dashboard** (users, matches, payments)
12. ⏳ **i18n setup** (next-intl with Tigrinya)
13. ⏳ **Stripe integration** (payment unlock)
14. ⏳ **Photo upload** (with presigned URLs)
15. ⏳ **WebSocket chat** (real-time messaging)

## Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Environment Variables

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_API_GATEWAY=http://localhost:3000/api

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_... # Server-side only

# Feature Flags
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_DEFAULT_CHAT_DURATION_HOURS=4

# i18n
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,ti
```

## API Integration Patterns

### Backend Microservices Mapping
All requests go through `/api/proxy/route.ts` which routes to:
- **Auth Service**: `/api/proxy/auth/*` → User auth, sessions
- **User Service**: `/api/proxy/user/*` → Profile, onboarding
- **Match Service**: `/api/proxy/match/*` → Matches, proposals
- **Chat Service**: `/api/proxy/chat/*` → Sessions, messages
- **Payment Service**: `/api/proxy/payment/*` → Stripe integration
- **Admin Service**: `/api/proxy/admin/*` → Admin operations

### Event-Driven Frontend Updates
- **WebSocket Connection**: Subscribe to user-specific events
- **Match Notifications**: Real-time match proposal alerts
- **Chat Expiry**: Server pushes expiry warning (5 min before)
- **Payment Status**: Webhook updates payment status

## Security Considerations

1. **CSRF Protection**: SameSite cookies + CSRF tokens for state-changing operations
2. **XSS Prevention**: Sanitize all user inputs, especially bio text
3. **Photo Validation**: Server-side image validation (not just MIME type)
4. **Rate Limiting**: Frontend + backend rate limits on auth, uploads, payments
5. **Admin Actions**: Audit log all admin actions (already in backend EventBus)
6. **GDPR Compliance**: Data export/deletion endpoints ready
7. **Payment Security**: Never expose Stripe secret key, use payment intents

---

**Built with battle-tested architecture for scale and privacy**

