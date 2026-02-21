# 🐾 PetHaven

> A platform connecting pet owners with verified hosts for temporary pet care

## Quick Start

```bash
# Clone and install
git clone <repo-url>
cd pethaven
pnpm install

# Start development
pnpm dev
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | React Native + Expo |
| Web | Next.js 14 + TailwindCSS |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma |
| Payments | Stripe Connect |
| Realtime | Socket.io |

## Project Structure

```
pethaven/
├── apps/
│   ├── mobile/     # React Native app
│   ├── web/        # Next.js website
│   └── admin/      # Admin dashboard
├── packages/
│   ├── api/        # Backend services
│   ├── shared/     # Shared types/utils
│   └── ui/         # Shared components
└── docs/           # Documentation
```

## Development Milestones

- [ ] **M1** - Project Setup & Auth (PR 1-7)
- [ ] **M2** - User & Pet Profiles (PR 8-12)
- [ ] **M3** - Host Profiles & Search (PR 13-18)
- [ ] **M4** - Booking System (PR 19-24)
- [ ] **M5** - Messaging (PR 25-28)
- [ ] **M6** - Payments (PR 29-33)
- [ ] **M7** - Reviews & Notifications (PR 34-38)
- [ ] **M8** - Polish & Launch (PR 39-44)

## Documentation

- [Full Project Plan](./docs/PROJECT_PLAN.md) - Complete architecture, edge cases, and PR breakdown

## License

MIT
