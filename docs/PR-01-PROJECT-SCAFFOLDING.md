# PR-1: Project Scaffolding

## Objective
Set up a Turborepo monorepo with the basic project structure for mobile, web, and API packages.

## Commands to Run

```bash
# Create project directory
mkdir pethaven && cd pethaven

# Initialize Turborepo
npx create-turbo@latest .

# Add additional workspaces
mkdir -p apps/mobile apps/admin packages/shared packages/ui

# Initialize React Native app
cd apps/mobile
npx create-expo-app@latest . --template blank-typescript
cd ../..

# Initialize Next.js web app
cd apps/web
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
cd ../..

# Initialize API package
cd packages/api
npm init -y
npm install express typescript @types/express @types/node ts-node nodemon
cd ../..

# Install shared dependencies
pnpm install -w prettier eslint-config-prettier
```

## Files to Create

### turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {}
  }
}
```

### .prettierrc
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### .eslintrc.js
```javascript
module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  ignorePatterns: ['node_modules/', 'dist/', '.next/'],
};
```

## Definition of Done
- [ ] Turborepo initialized with pnpm workspaces
- [ ] Mobile app (Expo) scaffolded
- [ ] Web app (Next.js) scaffolded  
- [ ] API package scaffolded
- [ ] Shared and UI packages created
- [ ] ESLint and Prettier configured
- [ ] `pnpm dev` runs all apps
- [ ] README updated with setup instructions

## Estimated Time
2-3 hours
