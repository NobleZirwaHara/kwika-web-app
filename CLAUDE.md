# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Kwika Events** - A modern event service provider platform built with Laravel 12, Inertia.js v2, React 18, and TypeScript. This project was converted from Next.js to Laravel Inertia while maintaining the complete UI design.

**Current Status**: Functional frontend with demo data; backend ready for feature implementation.
**Notes**: - Make sure when you are generating code that similar files or structure for the new module doesnt already exist 
## Developme
nt Commands

### Backend (Laravel)

```bash
# Start Laravel development server
php artisan serve

# Run migrations
php artisan migrate

# Generate application key (first-time setup)
php artisan key:generate

# Create models with migrations
php artisan make:model ModelName -m

# Create controllers
php artisan make:controller ControllerName

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run tests
php artisan test

# Code formatting with Laravel Pint
./vendor/bin/pint
```

### Frontend (React + Vite)

```bash
# Development server with hot reload (MUST be running for frontend changes)
npm run dev
# or
pnpm dev

# Production build
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install
# or
pnpm install
```

### Database

```bash
# For SQLite (default):
# Database file is database/database.sqlite
# No server needed, file-based

# For MySQL:
# Configure in .env then run:
php artisan migrate
```

### Development Workflow

**IMPORTANT**: For frontend changes to reflect, you MUST run both:
1. `php artisan serve` (backend)
2. `npm run dev` or `pnpm dev` (frontend with HMR)

## Architecture

### Tech Stack

- **Backend**: Laravel 12 (PHP 8.3+)
- **Frontend**: React 18 + TypeScript (strict mode)
- **Bridge**: Inertia.js v2 (SPA-like experience without API)
- **Styling**: Tailwind CSS v4 with OKLCH color model
- **UI Components**: Radix UI (27 components)
- **Build Tool**: Vite 5.4
- **Forms**: React Hook Form + Zod validation
- **Auth**: Laravel Sanctum (installed, not configured)

### Directory Structure

```
app/
├── Http/
│   ├── Controllers/          # Currently empty - use for future controllers
│   └── Middleware/
│       └── HandleInertiaRequests.php   # Inertia middleware

resources/
├── js/
│   ├── Components/           # React components
│   │   ├── ui/              # Radix UI primitives (button, input, badge, etc.)
│   │   └── *.tsx            # Feature components (header, footer, etc.)
│   ├── Pages/               # Inertia page components
│   │   ├── Home.tsx
│   │   └── ProviderDetail.tsx
│   ├── lib/
│   │   └── utils.ts         # Utility functions (cn() helper)
│   ├── app.tsx              # Inertia app initialization
│   └── bootstrap.ts
├── css/
│   └── app.css              # Tailwind + CSS variables
└── views/
    └── app.blade.php        # Root template

routes/
└── web.php                  # Web routes with Inertia rendering
```

### Import Aliases

The project uses `@/` as an alias for `resources/js/`:

```typescript
import { Button } from '@/Components/ui/button'
import { cn } from '@/lib/utils'
```

Configured in:
- `vite.config.ts`: `alias: { '@': resolve(__dirname, 'resources/js') }`
- `tsconfig.json`: `"@/*": ["resources/js/*"]`

### Inertia.js Patterns

**Rendering from Laravel (routes or controllers)**:
```php
use Inertia\Inertia;

return Inertia::render('PageName', [
    'data' => $data
]);
```

**React Page Component**:
```typescript
import { Head } from '@inertiajs/react'

export default function PageName({ data }) {
  return (
    <>
      <Head title="Page Title" />
      {/* Content */}
    </>
  )
}
```

**SPA Navigation**:
```typescript
import { Link } from '@inertiajs/react'

<Link href="/providers/1">View Provider</Link>
```

### Current Route Structure

```
GET  /                    → Home page (Inertia::render('Home'))
GET  /providers/{id}      → Provider detail (Inertia::render('ProviderDetail'))
```

Currently uses closure-based routes with hard-coded mock data. Future: migrate to controllers.

### Styling System

**Tailwind CSS v4**:
- Uses `@theme inline` directive for configuration
- CSS variables for theming (light/dark mode)
- OKLCH color model for perceptually uniform colors
- Custom properties: `--primary`, `--secondary`, `--accent`, etc.

**Typography**:
- Body: Inter (Google Fonts)
- Headings: Plus Jakarta Sans (Google Fonts)

**Component Variants**:
Uses `class-variance-authority` for component variants:
```typescript
import { cva } from "class-variance-authority"

const buttonVariants = cva("base-classes", {
  variants: { variant: { default: "...", destructive: "..." } }
})
```

### Form Handling

**React Hook Form + Zod**:
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({ email: z.string().email() })
const form = useForm({ resolver: zodResolver(schema) })
```

Forms are client-side validated with Zod schemas. Server-side validation ready for implementation.

### Data Flow

**Current**: Mock data in `routes/web.php`
**Future**:
1. Create Eloquent models in `app/Models/`
2. Create controllers in `app/Http/Controllers/`
3. Query data in controllers
4. Pass to Inertia via `Inertia::render()`
5. Receive as props in React components

### Database (Not Yet Implemented)

**Default**: SQLite (`database/database.sqlite`)
**Alternative**: MySQL (configure in `.env`)

**Next Steps**:
```bash
php artisan make:model Provider -m
php artisan make:model Booking -m
php artisan make:model Review -m
php artisan migrate
```

### Key Architectural Patterns

**Component Composition**:
Pages are composed of smaller feature components:
```typescript
// Home.tsx
<Header />
<HeroSearch />
<ServiceCategories />
<FeaturedProviders />
<Footer />
```

**Type Safety**:
- Full TypeScript strict mode
- Component props fully typed
- Form schemas with Zod
- CVA for variant management

**No Global State**:
Currently uses React hooks only (`useState`, `useEffect`). Can add Context API or Redux if needed.

**Progressive Enhancement**:
- Inertia progress bar configured
- No full page reloads on navigation
- SPA-like experience with server routing

## Important Notes

### Frontend Development
- **ALWAYS run `npm run dev` or `pnpm dev`** for frontend changes to reflect
- Vite provides HMR (Hot Module Replacement)
- Changes to React components auto-refresh the browser

### Backend Development
- Routes currently use closures in `routes/web.php`
- **Prefer controllers** for production code
- Inertia middleware in `app/Http/Middleware/HandleInertiaRequests.php`
- Share global data via `share()` method in middleware

### UI Components
- **18 feature components** already built (header, footer, hero-search, etc.)
- **Radix UI primitives** in `Components/ui/`
- Always use existing components before creating new ones
- Follow CVA pattern for component variants

### Code Style
- **Backend**: Laravel Pint for PHP formatting (`./vendor/bin/pint`)
- **Frontend**: Prettier recommended (not configured)
- **TypeScript**: Strict mode enabled
- **Imports**: Use `@/` alias, not relative paths

### Git Workflow
- **Main branch**: `main`
- **Current branch**: `claude/nextjs-to-inertia-011CUTin91nq3VrV9Sr5wPNK`
- Project recently migrated from Next.js (UI design preserved)

### Authentication
- **Laravel Sanctum** installed but not configured
- Future: Configure for API token auth or SPA auth
- Will integrate with Inertia middleware for auth state

### Testing
- **Backend**: PHPUnit 11.5 (`php artisan test`)
- **Frontend**: Vitest ready (not configured)

### Package Managers
- **PHP**: Composer (PSR-4 autoloading)
- **Node**: npm or pnpm (both lock files present)

## Common Gotchas

1. **Frontend not updating?** → Ensure `npm run dev` is running
2. **Import errors?** → Use `@/` alias, not relative paths
3. **Inertia page not found?** → Check page component exists in `resources/js/Pages/`
4. **Styles not applying?** → Check Tailwind v4 syntax (uses `@theme inline`)
5. **Type errors?** → Run `npm run build` to catch TypeScript errors
6. **Route not working?** → Clear route cache: `php artisan route:clear`

## File References

When implementing features, key files to modify:

- **Routes**: `routes/web.php`
- **Inertia Config**: `app/Http/Middleware/HandleInertiaRequests.php`
- **Frontend Entry**: `resources/js/app.tsx`
- **Root Template**: `resources/views/app.blade.php`
- **Global Styles**: `resources/css/app.css`
- **Vite Config**: `vite.config.ts`
- **TypeScript Config**: `tsconfig.json`
- **Tailwind Config**: `tailwind.config.js`
