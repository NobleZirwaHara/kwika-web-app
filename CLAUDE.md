# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Kwika Events** - A modern event service provider platform built with Laravel 12, Inertia.js v2, React 18, and TypeScript. This project was converted from Next.js to Laravel Inertia while maintaining the complete UI design.

**Current Status**: Full-featured platform with advanced search/filtering, interactive maps, hierarchical categories, and complete provider/service management.

**Key Features**:
- ✅ Hierarchical service categories (parent → subcategories)
- ✅ Advanced search & filtering system with 8+ filter types
- ✅ Interactive map view with Leaflet
- ✅ Multiple view modes (Grid, List, Map) with smooth animations
- ✅ Provider and Service listing modes
- ✅ Real-time messaging system (Supabase)
- ✅ Complete admin, provider, and customer dashboards
- ✅ Booking and payment systems
- ✅ Provider onboarding wizard

**Important Notes**:
- Always check if similar files or structure already exist before generating new code
- The project uses a reusable component architecture - favor composition over duplication
- All new features should follow existing patterns (CVA for variants, Radix UI primitives, etc.)

## Development Commands

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
- **UI Components**: Radix UI (32+ components)
- **Build Tool**: Vite 5.4
- **Forms**: React Hook Form + Zod validation
- **Auth**: Laravel Sanctum (installed, not configured)
- **Maps**: Leaflet + React Leaflet
- **Animations**: Framer Motion
- **Real-time**: Supabase (messaging)

### Key Dependencies

**Frontend:**
- `react` v18.3.1
- `@inertiajs/react` v1.0.0
- `@radix-ui/*` (32 packages)
- `react-leaflet` & `leaflet` - Interactive maps
- `framer-motion` - Smooth animations
- `react-use` - Utility hooks
- `use-debounce` - Debounced inputs
- `react-responsive` - Media queries
- `react-hook-form` + `zod` - Form validation
- `class-variance-authority` - Component variants
- `lucide-react` - Icon library

**Backend:**
- Laravel 12
- Inertia.js server adapter
- Laravel Sanctum
- Laravel Pint (code formatting)

### Directory Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/              # Admin panel controllers
│   │   ├── Provider/           # Provider dashboard controllers
│   │   ├── User/               # Customer controllers
│   │   ├── SearchController.php    # Advanced search with filtering
│   │   ├── HomeController.php      # Homepage
│   │   ├── MessageController.php   # Messaging system
│   │   └── BookingController.php   # Booking management
│   └── Middleware/
│       └── HandleInertiaRequests.php   # Inertia middleware
├── Models/
│   ├── ServiceProvider.php     # Provider model with categories, services
│   ├── Service.php             # Service offerings
│   ├── ServiceCategory.php     # Hierarchical categories
│   ├── Booking.php             # Booking records
│   ├── Message.php             # Messaging system
│   └── ...
└── Services/                   # Service classes for business logic

resources/
├── js/
│   ├── Components/
│   │   ├── ui/                 # 32 Radix UI primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── accordion.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── ...
│   │   ├── ServicesListing/    # 🆕 Reusable listing system
│   │   │   ├── ServicesListingContainer.tsx    # Main orchestrator
│   │   │   ├── FilterPanel.tsx                 # Desktop filters
│   │   │   ├── MobileFilterSheet.tsx           # Mobile filter drawer
│   │   │   ├── ProviderCard.tsx                # Provider grid card
│   │   │   ├── ServiceCard.tsx                 # Service grid card
│   │   │   ├── ProviderListItem.tsx            # Provider list row
│   │   │   ├── ServiceListItem.tsx             # Service list row
│   │   │   ├── ViewModeToggle.tsx              # Grid/List/Map toggle
│   │   │   ├── ListingTypeToggle.tsx           # Provider/Service toggle
│   │   │   ├── SortingDropdown.tsx             # Sort options
│   │   │   ├── ActiveFilters.tsx               # Filter chips
│   │   │   ├── MapView.tsx                     # Leaflet map
│   │   │   └── EmptyResults.tsx                # No results state
│   │   ├── header.tsx          # Main navigation
│   │   ├── search-header.tsx   # Search page header
│   │   ├── hero-search.tsx     # Homepage search widget
│   │   ├── footer.tsx
│   │   └── ...                 # 20+ feature components
│   ├── Pages/                  # Inertia page components
│   │   ├── Home.tsx
│   │   ├── Search.tsx          # 🆕 Enhanced with ServicesListingContainer
│   │   ├── Listings.tsx        # 🆕 Dedicated browse page
│   │   ├── Admin/              # Admin dashboard pages
│   │   ├── Provider/           # Provider dashboard pages
│   │   ├── User/               # Customer pages
│   │   └── ...
│   ├── hooks/                  # Custom React hooks
│   │   └── useConversations.tsx
│   ├── lib/
│   │   ├── utils.ts            # Utility functions (cn() helper)
│   │   └── supabase.ts         # Supabase client
│   ├── app.tsx                 # Inertia app initialization
│   └── bootstrap.ts
├── css/
│   ├── app.css                 # Tailwind directives
│   └── globals.css             # CSS variables & theme
└── views/
    └── app.blade.php           # Root Blade template

routes/
├── web.php                     # Public routes
├── admin.php                   # Admin routes (prefix: /admin)
├── provider.php                # Provider routes (prefix: /provider)
├── user.php                    # Customer routes (prefix: /user)
└── api.php                     # API routes
```

### Import Aliases

The project uses `@/` as an alias for `resources/js/`:

```typescript
import { Button } from '@/Components/ui/button'
import { ServicesListingContainer } from '@/Components/ServicesListing/ServicesListingContainer'
import { cn } from '@/lib/utils'
```

Configured in:
- `vite.config.ts`: `alias: { '@': resolve(__dirname, 'resources/js') }`
- `tsconfig.json`: `"@/*": ["resources/js/*"]`

### Inertia.js Patterns

**Rendering from Laravel controllers:**
```php
use Inertia\Inertia;

return Inertia::render('Search', [
    'results' => $results,
    'categories' => $categories,
    'searchParams' => $searchParams,
]);
```

**React Page Component:**
```typescript
import { Head } from '@inertiajs/react'

export default function Search({ results, categories, searchParams }) {
  return (
    <>
      <Head title="Search Results" />
      {/* Content */}
    </>
  )
}
```

**SPA Navigation:**
```typescript
import { Link, router } from '@inertiajs/react'

// Link component
<Link href="/providers/1">View Provider</Link>

// Programmatic navigation with state preservation
router.get('/search', params, {
  preserveState: true,
  preserveScroll: true,
})
```

### Route Structure

**Public Routes (`routes/web.php`):**
```
GET  /                      → Home page (HomeController@index)
GET  /search                → Search results (SearchController@search)
GET  /listings              → Browse all (SearchController@search)
GET  /providers/{slug}      → Provider detail
GET  /services/{slug}       → Service detail
```

**Admin Routes (`routes/admin.php`):**
```
Prefix: /admin
- Dashboard, Bookings, Payments, Categories
- Service Providers, Services, Products
- Messages, Reports, Settings
```

**Provider Routes (`routes/provider.php`):**
```
Prefix: /provider
- Dashboard, Services, Products
- Bookings, Messages, Media
- Settings, Revenue
```

**User Routes (`routes/user.php`):**
```
Prefix: /user
- Dashboard, Bookings, Messages
- Profile, Wishlist
```

### Hierarchical Category System

**Database Structure:**
```
service_categories table:
├── id
├── parent_id (nullable, self-referencing)
├── name
├── slug
├── description
├── icon
├── is_active
└── sort_order

17 parent categories → 117 total subcategories
Services are ONLY assigned to subcategories (not parents)
```

**Model Methods:**
```php
// ServiceCategory.php
public function parent()         // belongsTo ServiceCategory
public function children()       // hasMany ServiceCategory
public function isParent()       // Check if parent category
public function isSubcategory()  // Check if subcategory

// Scopes
scopeParents($query)            // Get parent categories only
scopeSubcategories($query)      // Get subcategories only
scopeActive($query)             // Get active categories
```

**Usage in Controllers:**
```php
// Get hierarchical structure
$categories = ServiceCategory::with('children')
    ->parents()
    ->active()
    ->get();

// Filter by category (cascade for parents)
if ($category->isParent()) {
    $subcategoryIds = $category->children->pluck('id');
    $query->whereHas('services', fn($q) =>
        $q->whereIn('service_category_id', $subcategoryIds)
    );
}
```

### Advanced Search & Filtering System

**SearchController Features:**

The `SearchController` supports dual listing modes (providers vs services) with comprehensive filtering:

**Supported Filters:**
1. **Query** - Full-text search (business_name, description, location)
2. **Category** - Hierarchical filtering (parent cascades to subcategories)
3. **City** - Location-based filtering
4. **Price Range** - `min_price` and `max_price` (dual slider)
5. **Rating** - `min_rating` (star-based: 5★, 4★+, 3★+, 2★+)
6. **Service Type** - `price_type` (fixed, hourly, daily, custom)
7. **Availability** - `available_date` (calendar picker)
8. **Sorting** - `sort_by` (rating, reviews, price, newest) + `sort_order` (asc/desc)
9. **Pagination** - `per_page` (12, 24, 48)
10. **Listing Type** - `listing_type` (providers, services)

**Request Parameters Example:**
```
GET /search?
  query=wedding
  &category=5
  &city=Lilongwe
  &min_price=1000
  &max_price=5000
  &min_rating=4
  &price_type=fixed
  &available_date=2025-12-01
  &sort_by=rating
  &sort_order=desc
  &page=2
  &per_page=12
  &listing_type=providers
```

**Controller Methods:**
```php
search(Request $request)              // Main entry point, routes to providers/services
searchProviders(Request $request)     // Search service providers
searchServices(Request $request)      // Search individual services
renderSearchResults(...)              // Common rendering logic
```

**Data Returned:**
```php
return Inertia::render('Search', [
    'results' => $paginatedResults,      // Laravel pagination with through()
    'listingType' => 'providers',        // or 'services'
    'categories' => $hierarchicalCategories,
    'cities' => $uniqueCities,
    'searchParams' => $allFilterParams,
    'totalResults' => $total,
]);
```

### ServicesListingContainer - Reusable Component System

**Main Component:** `resources/js/Components/ServicesListing/ServicesListingContainer.tsx`

This is the orchestrator component used in both `/search` and `/listings` pages. It manages:
- Filter state and URL synchronization
- View mode switching (Grid, List, Map)
- Listing type toggle (Providers ↔ Services)
- Favorites management
- Pagination rendering

**Props Interface:**
```typescript
interface ServicesListingContainerProps {
  results: PaginatedData<Provider | Service>
  listingType: 'providers' | 'services'
  categories: Category[]              // Hierarchical structure
  cities: string[]                    // Unique city list
  searchParams: FilterState & {       // Current filter state
    sort_by: SortOption
    sort_order: SortOrder
    per_page: number
    listing_type: ListingType
  }
  totalResults: number
}
```

**Sub-Components:**

1. **FilterPanel** (Desktop) - Sidebar with all 8 filter types
2. **MobileFilterSheet** - Drawer with accordion groups for mobile
3. **ProviderCard** / **ServiceCard** - Grid view cards with images, ratings
4. **ProviderListItem** / **ServiceListItem** - List view rows (compact)
5. **ViewModeToggle** - Animated toggle (Grid/List/Map) with Framer Motion
6. **ListingTypeToggle** - Provider ↔ Service switcher with animations
7. **SortingDropdown** - Radix UI dropdown with icons
8. **ActiveFilters** - Animated filter chips with individual removal
9. **MapView** - Leaflet map with markers and rich popups
10. **EmptyResults** - No results state with "Clear filters" CTA

**Usage Example:**
```typescript
// In Search.tsx or Listings.tsx
import { ServicesListingContainer } from '@/Components/ServicesListing/ServicesListingContainer'

export default function Search({ results, listingType, categories, cities, searchParams, totalResults }) {
  return (
    <ServicesListingContainer
      results={results}
      listingType={listingType}
      categories={categories}
      cities={cities}
      searchParams={searchParams}
      totalResults={totalResults}
    />
  )
}
```

**Key Features:**
- **Responsive**: Desktop sidebar, tablet collapsible, mobile drawer
- **State Preservation**: Uses Inertia's `preserveState` and `preserveScroll`
- **URL Synchronization**: All filters reflected in query params
- **Debounced Inputs**: Search debounced 300ms, price slider 500ms
- **Loading States**: Skeleton loaders during transitions
- **Animations**: Framer Motion for smooth transitions
- **Map Integration**: Interactive Leaflet map with auto-bounds

### Styling System

**Tailwind CSS v4:**
- Uses `@theme inline` directive for configuration
- CSS variables for theming (light/dark mode)
- OKLCH color model for perceptually uniform colors
- Custom properties in `resources/css/globals.css`:
  - `--primary`, `--secondary`, `--accent`
  - `--background`, `--foreground`
  - `--muted`, `--border`, `--ring`

**Typography:**
- Body: Inter (Google Fonts)
- Headings: Plus Jakarta Sans (Google Fonts via `--font-heading`)

**Component Variants:**
Uses `class-variance-authority` (CVA) for component variants:
```typescript
import { cva } from "class-variance-authority"

const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
      outline: "border border-input bg-background"
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
      lg: "h-11 px-8"
    }
  },
  defaultVariants: { variant: "default", size: "default" }
})
```

**Responsive Utilities:**
```typescript
import { useMediaQuery } from 'react-responsive'

const isDesktop = useMediaQuery({ minWidth: 1024 })
const isMobile = useMediaQuery({ maxWidth: 767 })
```

### Animation Patterns

**Framer Motion Usage:**

```typescript
import { motion, AnimatePresence } from 'framer-motion'

// View mode toggle animation
<motion.div
  animate={{ x: activeIndex * 100 }}
  transition={{ type: "spring", stiffness: 400, damping: 30 }}
/>

// Filter chips animation
<AnimatePresence mode="popLayout">
  {filters.map(filter => (
    <motion.div
      key={filter.key}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {/* Chip content */}
    </motion.div>
  ))}
</AnimatePresence>
```

**Animation Best Practices:**
- Use `spring` physics for natural motion
- Stiffness: 350-500 for snappy, 200-300 for smooth
- Damping: 25-30 for balanced bounce
- Always include `transition` prop
- Use `AnimatePresence` for enter/exit animations
- Set `layout` or `layoutId` for shared element transitions

### Map Integration

**Leaflet + React Leaflet:**

```typescript
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

// Usage
<MapContainer center={[-13.9833, 33.7833]} zoom={12}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  {items.map(item => (
    <Marker key={item.id} position={[item.latitude, item.longitude]}>
      <Popup>{/* Rich popup content */}</Popup>
    </Marker>
  ))}
</MapContainer>
```

**Map Features:**
- Auto-fit bounds to show all markers
- Rich popups with images, ratings, CTAs
- Hover synchronization (hover marker → highlight card)
- Default center: Lilongwe, Malawi (-13.9833, 33.7833)

### Form Handling

**React Hook Form + Zod:**
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { email: '', password: '' }
})

const onSubmit = (data: z.infer<typeof schema>) => {
  // Handle form submission
}
```

**Inertia Form Helper:**
```typescript
import { useForm } from '@inertiajs/react'

const { data, setData, post, processing, errors } = useForm({
  email: '',
  password: '',
})

const handleSubmit = (e) => {
  e.preventDefault()
  post('/login')
}
```

### Data Flow

**Standard Flow:**
1. User action triggers Inertia request (`router.get()` or `Link`)
2. Laravel controller receives request
3. Controller queries Eloquent models
4. Data passed to Inertia: `Inertia::render('Page', ['data' => $data])`
5. React component receives data as props
6. Component renders with TypeScript type safety

**Example with Filtering:**
```typescript
// Frontend
const handleFilterChange = (filters: FilterState) => {
  router.get('/search', filters, {
    preserveState: true,    // Keep scroll position
    preserveScroll: true,   // Keep component state
    only: ['results']       // Only reload specific prop
  })
}

// Backend (SearchController.php)
public function search(Request $request) {
  $results = ServiceProvider::query()
    ->when($request->min_rating, fn($q) =>
      $q->where('average_rating', '>=', $request->min_rating)
    )
    ->paginate(12);

  return Inertia::render('Search', [
    'results' => $results,
    'searchParams' => $request->all(),
  ]);
}
```

### Key Architectural Patterns

**Component Composition:**
```typescript
// Page = Layout + Feature Components + UI Primitives
<AdminLayout>
  <PageHeader title="Bookings" />
  <StatsCards data={stats} />
  <BookingsTable bookings={bookings} />
</AdminLayout>
```

**Reusable Listing Pattern:**
```typescript
// Use ServicesListingContainer for any paginated listings
<ServicesListingContainer
  results={data}
  listingType="providers"
  categories={categories}
  cities={cities}
  searchParams={filters}
  totalResults={total}
/>
```

**Filter State Management:**
```typescript
// All filter state in URL → shareable links
const params = { ...searchParams, ...newFilters }
router.get(window.location.pathname, params, {
  preserveState: true,
  preserveScroll: true,
})
```

**Type Safety:**
- Full TypeScript strict mode
- Component props fully typed
- Form schemas with Zod
- CVA for variant management
- Export shared types from components

**Debounced Inputs:**
```typescript
import { useDebouncedCallback } from 'use-debounce'

const debouncedSearch = useDebouncedCallback(
  (value: string) => handleFilterChange({ query: value }),
  300  // 300ms delay
)
```

**Progressive Enhancement:**
- Inertia progress bar configured
- No full page reloads on navigation
- SPA-like experience with server routing
- Skeleton loaders during transitions
- Optimistic UI updates

## Important Notes

### Frontend Development
- **ALWAYS run `npm run dev` or `pnpm dev`** for frontend changes to reflect
- Vite provides HMR (Hot Module Replacement)
- Changes to React components auto-refresh the browser
- Build with `npm run build` to check for TypeScript errors

### Backend Development
- **Use controllers** for production code (not closures in routes)
- Inertia middleware in `app/Http/Middleware/HandleInertiaRequests.php`
- Share global data via `share()` method in middleware
- Use resource controllers for CRUD operations
- Validate all inputs with Laravel's validation rules

### UI Components
- **32 Radix UI primitives** in `Components/ui/`
- **20+ feature components** (header, footer, cards, etc.)
- **12 ServicesListing components** for search/browse functionality
- Always check existing components before creating new ones
- Follow CVA pattern for component variants
- Use Framer Motion for animations
- Maintain consistent spacing (gap-6, space-y-6)

### Working with ServicesListingContainer

**DO:**
- ✅ Use it for any paginated provider/service listings
- ✅ Pass all filter state via `searchParams` prop
- ✅ Let it handle URL synchronization (don't manage filters separately)
- ✅ Customize with `className` prop for layout adjustments

**DON'T:**
- ❌ Don't duplicate filtering logic - extend SearchController instead
- ❌ Don't create custom filter panels - use FilterPanel props
- ❌ Don't manage view mode outside the container
- ❌ Don't forget to pass `categories` and `cities` arrays

### Code Style
- **Backend**: Laravel Pint for PHP formatting (`./vendor/bin/pint`)
- **Frontend**: Follow existing TypeScript patterns
- **TypeScript**: Strict mode enabled, full type coverage
- **Imports**: Use `@/` alias, not relative paths
- **Components**: PascalCase files, named exports
- **Utilities**: camelCase files, named exports

### Common Patterns

**Creating a new filtered listing page:**
1. Create controller that uses SearchController patterns
2. Return data with ServicesListingContainer structure
3. Create page component that imports ServicesListingContainer
4. Pass all required props (results, categories, cities, searchParams)

**Adding a new filter:**
1. Add validation rule to SearchController
2. Add filter logic to `searchProviders()` or `searchServices()`
3. Add filter UI to FilterPanel.tsx
4. Add filter chip display to ActiveFilters.tsx
5. Update FilterState interface

**Creating a new card variant:**
1. Extend ProviderCard or ServiceCard
2. Use CVA for variant management
3. Add to ServicesListingContainer conditionally
4. Maintain hover states and animations

### Git Workflow
- **Main branch**: `main`
- Project is production-ready with full feature set
- Use feature branches for new development

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
3. **Inertia page not found?** → Check page exists in `resources/js/Pages/`
4. **Styles not applying?** → Check Tailwind v4 syntax, run `npm run build`
5. **Type errors?** → Run `npm run build` to catch TypeScript errors
6. **Route not working?** → Clear route cache: `php artisan route:clear`
7. **Map not showing?** → Check lat/lng data exists and Leaflet CSS imported
8. **Filters not working?** → Check URL params are passed to SearchController
9. **Accordion animation not working?** → Verify `tailwindcss-animate` plugin
10. **Debounce not working?** → Check `use-debounce` is installed

## File References

**Key Files to Modify:**

**Routes:**
- `routes/web.php` - Public routes
- `routes/admin.php` - Admin routes
- `routes/provider.php` - Provider routes
- `routes/user.php` - Customer routes

**Controllers:**
- `app/Http/Controllers/SearchController.php` - Advanced search/filtering
- `app/Http/Controllers/HomeController.php` - Homepage data
- `app/Http/Controllers/Admin/*` - Admin controllers
- `app/Http/Controllers/Provider/*` - Provider controllers

**Models:**
- `app/Models/ServiceProvider.php` - Provider model
- `app/Models/Service.php` - Service model
- `app/Models/ServiceCategory.php` - Hierarchical categories
- `app/Models/Booking.php` - Bookings
- `app/Models/Message.php` - Messaging

**Frontend:**
- `resources/js/app.tsx` - Inertia app entry
- `resources/js/Components/ServicesListing/*` - Listing system
- `resources/js/Pages/*` - Page components
- `resources/css/globals.css` - CSS variables & theme

**Config:**
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind configuration
- `resources/views/app.blade.php` - Root template

## Quick Reference

### Create New Filtered Listing Page

```bash
# 1. Create controller
php artisan make:controller VenueController

# 2. Add route
# routes/web.php
Route::get('/venues', [VenueController::class, 'index']);

# 3. Controller code
public function index(Request $request) {
    // Use SearchController patterns
    $results = ServiceProvider::with(['services'])
        ->whereHas('categories', fn($q) => $q->where('name', 'Venues'))
        ->paginate(12);

    return Inertia::render('Venues', [
        'results' => $results,
        'listingType' => 'providers',
        'categories' => ServiceCategory::hierarchical(),
        'cities' => ServiceProvider::uniqueCities(),
        'searchParams' => $request->all(),
        'totalResults' => $results->total(),
    ]);
}

# 4. Create page component
# resources/js/Pages/Venues.tsx
import { ServicesListingContainer } from '@/Components/ServicesListing/ServicesListingContainer'

export default function Venues(props) {
  return <ServicesListingContainer {...props} />
}
```

### Add New Filter Type

```typescript
// 1. FilterState interface (ActiveFilters.tsx)
export interface FilterState {
  // ... existing
  new_filter?: string
}

// 2. SearchController validation
$request->validate([
  // ... existing
  'new_filter' => 'nullable|string',
]);

// 3. SearchController query
if ($request->filled('new_filter')) {
    $query->where('column', $request->new_filter);
}

// 4. FilterPanel UI (FilterPanel.tsx)
<Select value={filters.new_filter || ''}
        onValueChange={(value) => onFilterChange({ new_filter: value })}>
  {/* Options */}
</Select>

// 5. ActiveFilters chip (ActiveFilters.tsx)
if (filters.new_filter) {
  activeFilters.push({
    key: 'new_filter',
    label: 'Filter Name',
    value: filters.new_filter
  })
}
```

## Performance Considerations

- **Images**: Use lazy loading (`loading="lazy"`)
- **Debouncing**: 300ms for search, 500ms for sliders
- **Pagination**: 12 items default (12/24/48 options)
- **Map**: Only render when view mode is 'map'
- **Filters**: Use `preserveState: true` to avoid full reloads
- **Bundle Size**: ServicesListingContainer ~60KB gzipped
- **Leaflet**: ~45KB gzipped
- **Total JS**: ~113KB gzipped

## Next Steps / Future Enhancements

- [ ] Configure Laravel Sanctum for authentication
- [ ] Add Vitest test suite for React components
- [ ] Implement favorites persistence to database
- [ ] Add infinite scroll option for listings
- [ ] Implement saved searches feature
- [ ] Add provider comparison view
- [ ] Email alerts for new matching providers
- [ ] Distance-based sorting (if location enabled)
- [ ] Performance monitoring with Laravel Telescope
- [ ] Error tracking with Sentry
