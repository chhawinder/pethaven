# PetHaven - Pet Homestay Finder App

## 🎯 Core Concept

**Problem Statement:** Pet owners often struggle to find safe, reliable temporary care for their pets when traveling, working long hours, or handling emergencies.

**Solution:** A platform connecting pet owners with verified pet hosts who provide home-based temporary care.

---

## 👥 User Personas

### 1. Pet Owner (Seeker)
- Needs temporary pet care (hours to weeks)
- Wants nearby, trusted hosts
- Values transparency (photos, updates, reviews)

### 2. Pet Host (Provider)
- Has space and love for pets
- Wants to earn extra income
- May have experience with specific pet types

### 3. Admin
- Manages platform operations
- Handles disputes and verifications
- Monitors safety compliance

---

## 🔑 Core Features (MVP)

### Phase 1 - Foundation
| Feature | Description |
|---------|-------------|
| User Registration | Email/Phone + OAuth (Google, Apple) |
| Profile Management | Pet profiles, Host profiles with photos |
| Search & Discovery | Location-based host search with filters |
| Booking System | Request → Accept/Reject → Confirm flow |
| In-App Messaging | Real-time chat between owner and host |
| Basic Payments | Secure payment processing |
| Reviews & Ratings | Post-stay feedback system |

### Phase 2 - Enhanced
| Feature | Description |
|---------|-------------|
| Photo Updates | Hosts share pet photos during stay |
| Calendar Management | Host availability calendar |
| Repeat Bookings | Easy rebooking with favorite hosts |
| Push Notifications | Booking updates, messages, reminders |

### Phase 3 - Premium
| Feature | Description |
|---------|-------------|
| Video Calls | Check-in video calls with pet |
| GPS Pet Tracking | Optional collar integration |
| Pet Insurance | Partnership with pet insurance providers |
| Vet Network | Emergency vet finder nearby |

---

## ⚠️ Edge Cases & Safety Considerations

### Booking Flow Edge Cases
1. **Double Booking** - Host accepts when already booked
   - *Solution:* Real-time availability check, auto-reject conflicts
   
2. **Last-Minute Cancellation** - Owner/Host cancels < 24hrs
   - *Solution:* Cancellation policy tiers (Flexible/Moderate/Strict), partial refunds
   
3. **No-Show** - Owner doesn't drop off pet
   - *Solution:* Time window for check-in, auto-cancel after X hours, penalty system
   
4. **Extended Stay** - Owner can't pick up on time
   - *Solution:* Extension request flow, emergency contact system, daily rate auto-charge
   
5. **Host Unavailability** - Host becomes unavailable during stay
   - *Solution:* Emergency backup host matching, platform intervention

### Pet Safety Edge Cases
6. **Pet Emergency** - Pet falls ill during stay
   - *Solution:* Emergency vet contacts, owner consent for treatment, medical expense handling
   
7. **Pet Escape** - Pet runs away from host's home
   - *Solution:* Incident reporting, insurance coverage, search coordination
   
8. **Pet Aggression** - Pet behaves aggressively
   - *Solution:* Behavioral questionnaire during registration, early termination protocol
   
9. **Incompatible Pets** - Host's pets don't get along with guest pet
   - *Solution:* Meet-and-greet option, compatibility filters

### Trust & Safety Edge Cases
10. **Fake Profiles** - Fraudulent hosts/owners
    - *Solution:* ID verification, address verification, background checks
    
11. **Property Damage** - Pet damages host's property
    - *Solution:* Damage protection fee, claim process, photo documentation
    
12. **Payment Disputes** - Disagreement on charges
    - *Solution:* Clear pricing upfront, escrow payments, dispute resolution team
    
13. **Harassment** - Inappropriate messages
    - *Solution:* Report system, message monitoring, account suspension

### Technical Edge Cases
14. **Location Inaccuracy** - Wrong GPS coordinates
    - *Solution:* Address verification, map confirmation
    
15. **Payment Failure** - Card declined mid-booking
    - *Solution:* Pre-authorization, backup payment method
    
16. **App Offline** - No internet during check-in
    - *Solution:* Offline mode for essential info, SMS fallback

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  Mobile App (React Native)  │  Web App (Next.js)  │  Admin Panel│
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                             │
│                    (AWS API Gateway / Kong)                     │
└─────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌───────────┐   ┌───────────┐   ┌───────────┐
            │   Auth    │   │  Booking  │   │  Payment  │
            │  Service  │   │  Service  │   │  Service  │
            └───────────┘   └───────────┘   └───────────┘
                    │               │               │
                    ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL   │   Redis Cache   │   S3 (Images)   │  Elasticsearch│
│  (Primary DB) │   (Sessions)    │                 │  (Search)     │
└─────────────────────────────────────────────────────────────────┘
```

### Microservices Breakdown

| Service | Responsibility |
|---------|----------------|
| **Auth Service** | Registration, login, OAuth, JWT tokens |
| **User Service** | Profile management, preferences |
| **Pet Service** | Pet profiles, medical info, photos |
| **Host Service** | Host profiles, availability, amenities |
| **Search Service** | Location-based search, filters |
| **Booking Service** | Booking lifecycle, calendar |
| **Payment Service** | Transactions, payouts, refunds |
| **Messaging Service** | Real-time chat, notifications |
| **Review Service** | Ratings, reviews, trust scores |
| **Notification Service** | Push, email, SMS |

---

## 💾 Database Schema (Core Tables)

```sql
-- Users table
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  phone VARCHAR,
  password_hash VARCHAR,
  full_name VARCHAR,
  profile_photo_url VARCHAR,
  role ENUM('owner', 'host', 'both'),
  is_verified BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Pets table
pets (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES users(id),
  name VARCHAR,
  species ENUM('dog', 'cat', 'bird', 'fish', 'rabbit', 'other'),
  breed VARCHAR,
  age_years INT,
  weight_kg DECIMAL,
  gender ENUM('male', 'female'),
  is_neutered BOOLEAN,
  medical_notes TEXT,
  behavioral_notes TEXT,
  vaccination_status JSONB,
  photos JSONB,
  created_at TIMESTAMP
)

-- Host profiles
host_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  address JSONB,
  location GEOGRAPHY(Point),
  bio TEXT,
  experience_years INT,
  accepted_pet_types JSONB,
  max_pets INT,
  has_yard BOOLEAN,
  has_other_pets BOOLEAN,
  other_pets_details TEXT,
  amenities JSONB,
  house_photos JSONB,
  hourly_rate DECIMAL,
  daily_rate DECIMAL,
  is_background_checked BOOLEAN,
  availability_calendar JSONB,
  created_at TIMESTAMP
)

-- Bookings
bookings (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id),
  host_id UUID REFERENCES host_profiles(id),
  owner_id UUID REFERENCES users(id),
  start_datetime TIMESTAMP,
  end_datetime TIMESTAMP,
  status ENUM('pending', 'accepted', 'rejected', 'ongoing', 'completed', 'cancelled'),
  total_amount DECIMAL,
  special_instructions TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Payments
payments (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  amount DECIMAL,
  currency VARCHAR,
  status ENUM('pending', 'completed', 'refunded', 'failed'),
  payment_method VARCHAR,
  stripe_payment_id VARCHAR,
  payout_status ENUM('pending', 'processed'),
  created_at TIMESTAMP
)

-- Reviews
reviews (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  reviewer_id UUID REFERENCES users(id),
  reviewee_id UUID REFERENCES users(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photos JSONB,
  created_at TIMESTAMP
)

-- Messages
messages (
  id UUID PRIMARY KEY,
  conversation_id UUID,
  sender_id UUID REFERENCES users(id),
  content TEXT,
  message_type ENUM('text', 'image', 'system'),
  is_read BOOLEAN,
  created_at TIMESTAMP
)
```

---

## 🛠️ Tech Stack Recommendation

### Frontend
| Layer | Technology | Reason |
|-------|------------|--------|
| **Mobile** | React Native + Expo | Cross-platform, fast development, OTA updates |
| **Web** | Next.js 14 | SSR, SEO, App Router, great DX |
| **UI Library** | TailwindCSS + shadcn/ui | Modern, customizable, accessible |
| **State** | Zustand | Lightweight, simple state management |
| **Forms** | React Hook Form + Zod | Type-safe validation |
| **Maps** | Mapbox / Google Maps | Location search, host markers |

### Backend
| Layer | Technology | Reason |
|-------|------------|--------|
| **Runtime** | Node.js (Express/Fastify) OR Go | JS familiarity or performance |
| **API** | REST + GraphQL (optional) | Flexible data fetching |
| **Auth** | JWT + Refresh tokens | Stateless, scalable |
| **ORM** | Prisma | Type-safe, migrations, great DX |
| **Realtime** | Socket.io / Pusher | Chat, notifications |
| **Queue** | BullMQ / Redis | Background jobs |

### Database & Storage
| Layer | Technology | Reason |
|-------|------------|--------|
| **Primary DB** | PostgreSQL + PostGIS | Relational + geospatial queries |
| **Cache** | Redis | Sessions, caching, rate limiting |
| **Search** | Elasticsearch / Meilisearch | Fast fuzzy search |
| **File Storage** | AWS S3 / Cloudflare R2 | Images, documents |
| **CDN** | Cloudflare | Fast global delivery |

### Infrastructure
| Layer | Technology | Reason |
|-------|------------|--------|
| **Hosting** | Vercel (Web) + Railway/Render (API) | Easy deployment |
| **Container** | Docker | Consistent environments |
| **CI/CD** | GitHub Actions | Free, integrated |
| **Monitoring** | Sentry + Logtail | Error tracking, logs |
| **Analytics** | PostHog / Mixpanel | User behavior |

### Third-Party Services
| Service | Provider | Purpose |
|---------|----------|---------|
| **Payments** | Stripe Connect | Marketplace payments, payouts |
| **SMS** | Twilio | OTP, notifications |
| **Email** | Resend / SendGrid | Transactional emails |
| **Push** | Firebase Cloud Messaging | Mobile notifications |
| **Identity** | Persona / Onfido | ID verification (premium) |

---

## 📱 User Flow

### Pet Owner Flow
```
Register → Add Pet Profile → Search Hosts → View Host Details 
→ Send Booking Request → Chat with Host → Confirm & Pay 
→ Drop off Pet → Receive Updates → Pick up Pet → Leave Review
```

### Host Flow
```
Register → Complete Host Profile → Set Availability & Pricing 
→ Get Verified → Receive Booking Request → Accept/Reject 
→ Chat with Owner → Receive Pet → Send Updates → Complete Stay 
→ Receive Payment → Get Review
```

---

## 📦 PR Breakdown (Incremental Development)

### 🏁 Milestone 1: Project Setup & Auth (Week 1-2)

| PR # | Title | Description | Dependencies |
|------|-------|-------------|--------------|
| PR-1 | **Project scaffolding** | Monorepo setup (Turborepo), packages structure, ESLint, Prettier | None |
| PR-2 | **Database setup** | PostgreSQL schema, Prisma setup, migrations | PR-1 |
| PR-3 | **Auth service - Registration** | Email/phone signup, password hashing, email verification | PR-2 |
| PR-4 | **Auth service - Login** | Login endpoint, JWT generation, refresh tokens | PR-3 |
| PR-5 | **OAuth integration** | Google & Apple sign-in | PR-4 |
| PR-6 | **Mobile app setup** | React Native + Expo init, navigation, auth screens | PR-1 |
| PR-7 | **Web app setup** | Next.js init, TailwindCSS, auth pages | PR-1 |

### 🐕 Milestone 2: User & Pet Profiles (Week 3-4)

| PR # | Title | Description | Dependencies |
|------|-------|-------------|--------------|
| PR-8 | **User service** | Profile CRUD, avatar upload to S3 | PR-4 |
| PR-9 | **Pet service** | Pet CRUD, multi-photo upload, medical info | PR-8 |
| PR-10 | **Mobile - User profile UI** | Profile screens, edit flow | PR-6, PR-8 |
| PR-11 | **Mobile - Pet profile UI** | Add/edit pet screens, photo gallery | PR-6, PR-9 |
| PR-12 | **Web - Profile pages** | Responsive profile pages | PR-7, PR-8 |

### 🏠 Milestone 3: Host Profiles & Search (Week 5-6)

| PR # | Title | Description | Dependencies |
|------|-------|-------------|--------------|
| PR-13 | **Host profile service** | Host profile CRUD, amenities, availability | PR-8 |
| PR-14 | **Geospatial search** | PostGIS queries, location-based host search | PR-13 |
| PR-15 | **Search filters** | Price range, pet type, amenities filters | PR-14 |
| PR-16 | **Mobile - Host registration** | Multi-step host onboarding flow | PR-6, PR-13 |
| PR-17 | **Mobile - Search & Map** | Search screen, map view, host cards | PR-6, PR-15 |
| PR-18 | **Web - Search page** | Responsive search with filters, map | PR-7, PR-15 |

### 📅 Milestone 4: Booking System (Week 7-8)

| PR # | Title | Description | Dependencies |
|------|-------|-------------|--------------|
| PR-19 | **Booking service - Create** | Booking request, validation, conflict check | PR-13 |
| PR-20 | **Booking service - Lifecycle** | Accept/reject, status transitions | PR-19 |
| PR-21 | **Calendar service** | Host availability calendar, blocking dates | PR-13 |
| PR-22 | **Mobile - Booking flow** | Date picker, booking confirmation | PR-6, PR-20 |
| PR-23 | **Mobile - My bookings** | Booking list, status tracking | PR-22 |
| PR-24 | **Web - Booking pages** | Booking flow, dashboard | PR-7, PR-20 |

### 💬 Milestone 5: Messaging (Week 9)

| PR # | Title | Description | Dependencies |
|------|-------|-------------|--------------|
| PR-25 | **Messaging service** | Socket.io setup, message persistence | PR-4 |
| PR-26 | **Conversation management** | Create conversation on booking, history | PR-25, PR-19 |
| PR-27 | **Mobile - Chat UI** | Chat screen, real-time messages | PR-6, PR-26 |
| PR-28 | **Web - Chat component** | Chat panel, conversation list | PR-7, PR-26 |

### 💳 Milestone 6: Payments (Week 10-11)

| PR # | Title | Description | Dependencies |
|------|-------|-------------|--------------|
| PR-29 | **Stripe Connect setup** | Marketplace account, onboarding | None |
| PR-30 | **Payment service** | Create payment intent, webhooks | PR-29, PR-19 |
| PR-31 | **Host payout system** | Automatic payouts after booking completion | PR-30 |
| PR-32 | **Mobile - Payment flow** | Card input, payment confirmation | PR-6, PR-30 |
| PR-33 | **Refund handling** | Cancellation refunds based on policy | PR-30 |

### ⭐ Milestone 7: Reviews & Notifications (Week 12)

| PR # | Title | Description | Dependencies |
|------|-------|-------------|--------------|
| PR-34 | **Review service** | Post-booking reviews, rating calculation | PR-20 |
| PR-35 | **Notification service** | FCM setup, push notification triggers | PR-4 |
| PR-36 | **Email notifications** | Booking confirmations, reminders | PR-35 |
| PR-37 | **Mobile - Reviews UI** | Leave/view reviews | PR-6, PR-34 |
| PR-38 | **Mobile - Push notifications** | FCM integration, notification handling | PR-6, PR-35 |

### 🚀 Milestone 8: Polish & Launch (Week 13-14)

| PR # | Title | Description | Dependencies |
|------|-------|-------------|--------------|
| PR-39 | **Admin panel** | User management, booking oversight | All services |
| PR-40 | **Error handling** | Global error handling, Sentry | All |
| PR-41 | **Performance optimization** | Caching, query optimization | All |
| PR-42 | **Security hardening** | Rate limiting, input sanitization | All |
| PR-43 | **App Store preparation** | Screenshots, descriptions, assets | PR-38 |
| PR-44 | **Production deployment** | CI/CD, environment setup | All |

---

## 📁 Recommended Project Structure

```
pethaven/
├── apps/
│   ├── mobile/              # React Native app
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   ├── navigation/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── store/
│   │   └── app.json
│   ├── web/                 # Next.js app
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── admin/               # Admin dashboard
├── packages/
│   ├── api/                 # Backend services
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── user/
│   │   │   │   ├── pet/
│   │   │   │   ├── host/
│   │   │   │   ├── booking/
│   │   │   │   ├── payment/
│   │   │   │   ├── messaging/
│   │   │   │   └── review/
│   │   │   ├── common/
│   │   │   └── config/
│   │   └── prisma/
│   ├── shared/              # Shared types, utils
│   └── ui/                  # Shared UI components
├── docker-compose.yml
├── turbo.json
└── package.json
```

---

## 🎯 Success Metrics (KPIs)

| Metric | Target (Month 1) | Target (Month 6) |
|--------|------------------|------------------|
| User signups | 500 | 10,000 |
| Active hosts | 50 | 1,000 |
| Completed bookings | 100 | 5,000 |
| Average rating | 4.5+ | 4.5+ |
| App crashes | < 1% | < 0.5% |

---

## 💰 Monetization Strategy

1. **Service Fee** - 15% commission on each booking
2. **Featured Listings** - Hosts pay to appear at top of search
3. **Premium Features** - Video calls, GPS tracking (subscription)
4. **Pet Insurance** - Affiliate revenue from insurance partners

---

## 🔒 Security Checklist

- [ ] HTTPS everywhere
- [ ] Password hashing (bcrypt/argon2)
- [ ] JWT with short expiry + refresh tokens
- [ ] Rate limiting on all endpoints
- [ ] Input validation & sanitization
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection
- [ ] CORS configuration
- [ ] Secure file upload (type validation)
- [ ] PCI compliance (Stripe handles)
- [ ] GDPR compliance (data deletion)

---

## 📋 Next Steps

1. **Set up repository** - Initialize monorepo with Turborepo
2. **Start with PR-1** - Project scaffolding
3. **Weekly demos** - Show progress after each milestone
4. **Beta testing** - Invite 50 users after Milestone 7

---

*Document Version: 1.0*
*Created: February 2026*
