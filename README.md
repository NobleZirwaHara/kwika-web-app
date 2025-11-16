# Kwika Events - Laravel Inertia

A modern event service provider platform built with Laravel, Inertia.js, React, and TypeScript. This project was converted from Next.js to Laravel Inertia while maintaining the complete UI design.

## Tech Stack

- **Backend**: Laravel 12
- **Frontend**: React 18 + TypeScript
- **Bridge**: Inertia.js v2
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Build Tool**: Vite
- **Fonts**: Google Fonts (Inter, Plus Jakarta Sans)

## Project Structure

```
├── app/                      # Laravel application code
│   ├── Http/
│   │   ├── Controllers/      # Application controllers
│   │   └── Middleware/       # Inertia middleware
│   └── Models/               # Eloquent models
├── bootstrap/                # Laravel bootstrap files
├── config/                   # Configuration files
├── database/                 # Migrations and seeders
├── public/                   # Public assets and entry point
├── resources/
│   ├── css/
│   │   └── app.css          # Global styles with Tailwind
│   ├── js/
│   │   ├── Components/      # React components
│   │   │   ├── ui/         # UI components (buttons, inputs, etc.)
│   │   │   └── ...         # Feature components
│   │   ├── lib/            # Utility functions
│   │   ├── Pages/          # Inertia pages
│   │   │   ├── Home.tsx
│   │   │   └── ProviderDetail.tsx
│   │   ├── app.tsx         # Inertia app entry point
│   │   └── bootstrap.ts    # Frontend bootstrap
│   └── views/
│       └── app.blade.php   # Root template
├── routes/
│   └── web.php             # Application routes
├── storage/                 # Application storage
├── composer.json            # PHP dependencies
├── package.json             # Node dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── tsconfig.json            # TypeScript configuration
```

## Features

- Event service provider listings
- Provider detail pages with galleries
- Service categories and featured providers
- Testimonials and reviews
- Responsive design
- Dark mode support
- Type-safe with TypeScript
- Modern UI components from Radix UI

## Installation & Setup

### Prerequisites

- PHP 8.3 or higher
- Composer
- Node.js 18+ and pnpm/npm
- SQLite or MySQL (database)

### Step 1: Install PHP Dependencies

```bash
composer install
```

### Step 2: Install Frontend Dependencies

Frontend dependencies are already installed. If you need to reinstall:

```bash
pnpm install
# or
npm install
```

### Step 3: Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Generate an application key:

```bash
php artisan key:generate
```

Configure your database in `.env`:

```env
DB_CONNECTION=sqlite
# Or for MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=eventhub
# DB_USERNAME=root
# DB_PASSWORD=
```

### Step 4: Run Migrations

```bash
php artisan migrate
```

### Step 5: Build Frontend Assets

For development with hot reload:

```bash
pnpm dev
# or
npm run dev
```

For production build:

```bash
pnpm build
# or
npm run build
```

### Step 6: Start the Laravel Development Server

In a separate terminal:

```bash
php artisan serve
```

Visit `http://localhost:8000` in your browser.

## Development Workflow

1. **Backend Changes**: Edit files in `app/`, `routes/`, etc.
2. **Frontend Changes**: Edit React components in `resources/js/`
3. **Styling**: Modify `resources/css/app.css` or Tailwind classes
4. **Hot Reload**: Run `pnpm dev` for automatic frontend reloading

## Available Routes

- `/` - Home page with service listings
- `/providers/{id}` - Provider detail page

## Component Import Aliases

The project uses `@/` as an alias for `resources/js/`:

```typescript
import { Button } from '@/Components/ui/button'
import { Header } from '@/Components/header'
```

## UI Design

The UI design has been fully preserved from the original Next.js project, including:

- All Radix UI components (accordions, dialogs, dropdowns, etc.)
- Custom Tailwind theme with CSS variables
- Google Fonts integration (Inter and Plus Jakarta Sans)
- Responsive layouts
- Dark mode support

## Inertia.js Usage

### Creating Pages

Pages are React components in `resources/js/Pages/`:

```tsx
import { Head } from '@inertiajs/react'

export default function MyPage({ data }) {
  return (
    <>
      <Head title="Page Title" />
      <div>Page content</div>
    </>
  )
}
```

### Rendering Pages from Laravel

In your controller or route:

```php
use Inertia\Inertia;

return Inertia::render('MyPage', [
    'data' => $data
]);
```

### Links

Use Inertia's Link component for SPA navigation:

```tsx
import { Link } from '@inertiajs/react'

<Link href="/providers/1">View Provider</Link>
```

## Next Steps

1. **Install Composer dependencies** when Composer is available
2. **Set up a database** and run migrations
3. **Create models and migrations** for providers, bookings, etc.
4. **Build out controllers** for CRUD operations
5. **Add authentication** with Laravel Sanctum
6. **Implement API endpoints** if needed
7. **Deploy** to your hosting provider

## Notes

- This project uses Laravel 12 with Inertia.js v2
- Inertia.js v2 provides enhanced SPA-like experience without building an API
- All UI components from the original Next.js project have been preserved
- The frontend is fully functional; backend logic needs to be implemented based on your requirements
- Laravel 12 requires PHP 8.3 or higher

## License

MIT