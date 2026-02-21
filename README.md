# 🐾 PetHaven

> A platform connecting pet owners with verified hosts for temporary pet care

## Quick Start

```bash
# Clone the repo
git clone https://github.com/chhawinder/pethaven.git
cd pethaven

# Install dependencies (requires pnpm)
npm install -g pnpm
pnpm install

# Start all services in development mode
pnpm dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all packages |
| `pnpm lint` | Run linting across all packages |
| `pnpm format` | Format code with Prettier |
| `pnpm clean` | Clean all build artifacts |

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Monorepo** | Turborepo + pnpm workspaces |
| **Web** | Next.js 14 + TailwindCSS |
| **API** | Node.js + Express |
| **Mobile** | React Native + Expo (coming soon) |
| **Database** | PostgreSQL + Prisma (PR-2) |
| **Payments** | Stripe Connect (PR-29+) |

## Project Structure

```
pethaven/
├── apps/
│   └── web/           # Next.js website (port 3000)
├── packages/
│   ├── api/           # Express API server (port 4000)
│   └── shared/        # Shared types & constants
├── docs/              # Documentation
├── turbo.json         # Turborepo config
└── pnpm-workspace.yaml
```

## Development Ports

| App | URL |
|-----|-----|
| Web | http://localhost:3000 |
| API | http://localhost:4000 |

## Development Milestones

- [x] **PR-1** - Project Scaffolding (Turborepo + Web + API)
- [ ] **PR-2** - Database Setup (PostgreSQL + Prisma)
- [ ] **PR-3-5** - Auth Service
- [ ] **PR-6-7** - Mobile App Setup
- [ ] **M2** - User & Pet Profiles (PR 8-12)
- [ ] **M3** - Host Profiles & Search (PR 13-18)
- [ ] **M4** - Booking System (PR 19-24)
- [ ] **M5** - Messaging (PR 25-28)
- [ ] **M6** - Payments (PR 29-33)
- [ ] **M7** - Reviews & Notifications (PR 34-38)
- [ ] **M8** - Polish & Launch (PR 39-44)

## Documentation

- [Full Project Plan](./docs/PROJECT_PLAN.md) - Architecture, edge cases, and PR breakdown

## License

MIT
