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

===

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to enhance the user's satisfaction building Laravel applications.

## Foundational Context
This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.4.15
- inertiajs/inertia-laravel (INERTIA) - v2
- laravel/framework (LARAVEL) - v12
- laravel/prompts (PROMPTS) - v0
- laravel/reverb (REVERB) - v1
- laravel/sanctum (SANCTUM) - v4
- tightenco/ziggy (ZIGGY) - v2
- laravel/mcp (MCP) - v0
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- phpunit/phpunit (PHPUNIT) - v11
- @inertiajs/react (INERTIA) - v2
- react (REACT) - v18
- laravel-echo (ECHO) - v2
- tailwindcss (TAILWINDCSS) - v4

## Conventions
- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts
- Do not create verification scripts or tinker when tests cover that functionality and prove it works. Unit and feature tests are more important.

## Application Structure & Architecture
- Stick to existing directory structure - don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling
- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Replies
- Be concise in your explanations - focus on what's important rather than explaining obvious details.

## Documentation Files
- You must only create documentation files if explicitly requested by the user.


=== boost rules ===

## Laravel Boost
- Laravel Boost is an MCP server that comes with powerful tools designed specifically for this application. Use them.

## Artisan
- Use the `list-artisan-commands` tool when you need to call an Artisan command to double check the available parameters.

## URLs
- Whenever you share a project URL with the user you should use the `get-absolute-url` tool to ensure you're using the correct scheme, domain / IP, and port.

## Tinker / Debugging
- You should use the `tinker` tool when you need to execute PHP to debug code or query Eloquent models directly.
- Use the `database-query` tool when you only need to read from the database.

## Reading Browser Logs With the `browser-logs` Tool
- You can read browser logs, errors, and exceptions using the `browser-logs` tool from Boost.
- Only recent browser logs will be useful - ignore old logs.

## Searching Documentation (Critically Important)
- Boost comes with a powerful `search-docs` tool you should use before any other approaches. This tool automatically passes a list of installed packages and their versions to the remote Boost API, so it returns only version-specific documentation specific for the user's circumstance. You should pass an array of packages to filter on if you know you need docs for particular packages.
- The 'search-docs' tool is perfect for all Laravel related packages, including Laravel, Inertia, Livewire, Filament, Tailwind, Pest, Nova, Nightwatch, etc.
- You must use this tool to search for Laravel-ecosystem documentation before falling back to other approaches.
- Search the documentation before making code changes to ensure we are taking the correct approach.
- Use multiple, broad, simple, topic based queries to start. For example: `['rate limiting', 'routing rate limiting', 'routing']`.
- Do not add package names to queries - package information is already shared. For example, use `test resource table`, not `filament 4 test resource table`.

### Available Search Syntax
- You can and should pass multiple queries at once. The most relevant results will be returned first.

1. Simple Word Searches with auto-stemming - query=authentication - finds 'authenticate' and 'auth'
2. Multiple Words (AND Logic) - query=rate limit - finds knowledge containing both "rate" AND "limit"
3. Quoted Phrases (Exact Position) - query="infinite scroll" - Words must be adjacent and in that order
4. Mixed Queries - query=middleware "rate limit" - "middleware" AND exact phrase "rate limit"
5. Multiple Queries - queries=["authentication", "middleware"] - ANY of these terms


=== php rules ===

## PHP

- Always use curly braces for control structures, even if it has one line.

### Constructors
- Use PHP 8 constructor property promotion in `__construct()`.
    - <code-snippet>public function __construct(public GitHub $github) { }</code-snippet>
- Do not allow empty `__construct()` methods with zero parameters.

### Type Declarations
- Always use explicit return type declarations for methods and functions.
- Use appropriate PHP type hints for method parameters.

<code-snippet name="Explicit Return Types and Method Params" lang="php">
protected function isAccessible(User $user, ?string $path = null): bool
{
    ...
}
</code-snippet>

## Comments
- Prefer PHPDoc blocks over comments. Never use comments within the code itself unless there is something _very_ complex going on.

## PHPDoc Blocks
- Add useful array shape type definitions for arrays when appropriate.

## Enums
- Typically, keys in an Enum should be TitleCase. For example: `FavoritePerson`, `BestLake`, `Monthly`.


=== herd rules ===

## Laravel Herd

- The application is served by Laravel Herd and will be available at: https?://[kebab-case-project-dir].test. Use the `get-absolute-url` tool to generate URLs for the user to ensure valid URLs.
- You must not run any commands to make the site available via HTTP(s). It is _always_ available through Laravel Herd.


=== inertia-laravel/core rules ===

## Inertia Core

- Inertia.js components should be placed in the `resources/js/Pages` directory unless specified differently in the JS bundler (vite.config.js).
- Use `Inertia::render()` for server-side routing instead of traditional Blade views.
- Use `search-docs` for accurate guidance on all things Inertia.

<code-snippet lang="php" name="Inertia::render Example">
// routes/web.php example
Route::get('/users', function () {
    return Inertia::render('Users/Index', [
        'users' => User::all()
    ]);
});
</code-snippet>


=== inertia-laravel/v2 rules ===

## Inertia v2

- Make use of all Inertia features from v1 & v2. Check the documentation before making any changes to ensure we are taking the correct approach.

### Inertia v2 New Features
- Polling
- Prefetching
- Deferred props
- Infinite scrolling using merging props and `WhenVisible`
- Lazy loading data on scroll

### Deferred Props & Empty States
- When using deferred props on the frontend, you should add a nice empty state with pulsing / animated skeleton.

### Inertia Form General Guidance
- The recommended way to build forms when using Inertia is with the `<Form>` component - a useful example is below. Use `search-docs` with a query of `form component` for guidance.
- Forms can also be built using the `useForm` helper for more programmatic control, or to follow existing conventions. Use `search-docs` with a query of `useForm helper` for guidance.
- `resetOnError`, `resetOnSuccess`, and `setDefaultsOnSuccess` are available on the `<Form>` component. Use `search-docs` with a query of 'form component resetting' for guidance.


=== laravel/core rules ===

## Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using the `list-artisan-commands` tool.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Database
- Always use proper Eloquent relationship methods with return type hints. Prefer relationship methods over raw queries or manual joins.
- Use Eloquent models and relationships before suggesting raw database queries
- Avoid `DB::`; prefer `Model::query()`. Generate code that leverages Laravel's ORM capabilities rather than bypassing them.
- Generate code that prevents N+1 query problems by using eager loading.
- Use Laravel's query builder for very complex database operations.

### Model Creation
- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `list-artisan-commands` to check the available options to `php artisan make:model`.

### APIs & Eloquent Resources
- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

### Controllers & Validation
- Always create Form Request classes for validation rather than inline validation in controllers. Include both validation rules and custom error messages.
- Check sibling Form Requests to see if the application uses array or string based validation rules.

### Queues
- Use queued jobs for time-consuming operations with the `ShouldQueue` interface.

### Authentication & Authorization
- Use Laravel's built-in authentication and authorization features (gates, policies, Sanctum, etc.).

### URL Generation
- When generating links to other pages, prefer named routes and the `route()` function.

### Configuration
- Use environment variables only in configuration files - never use the `env()` function directly outside of config files. Always use `config('app.name')`, not `env('APP_NAME')`.

### Testing
- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

### Vite Error
- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.


=== laravel/v12 rules ===

## Laravel 12

- Use the `search-docs` tool to get version specific documentation.
- Since Laravel 11, Laravel has a new streamlined file structure which this project uses.

### Laravel 12 Structure
- No middleware files in `app/Http/Middleware/`.
- `bootstrap/app.php` is the file to register middleware, exceptions, and routing files.
- `bootstrap/providers.php` contains application specific service providers.
- **No app\Console\Kernel.php** - use `bootstrap/app.php` or `routes/console.php` for console configuration.
- **Commands auto-register** - files in `app/Console/Commands/` are automatically available and do not require manual registration.

### Database
- When modifying a column, the migration must include all of the attributes that were previously defined on the column. Otherwise, they will be dropped and lost.
- Laravel 11 allows limiting eagerly loaded records natively, without external packages: `$query->latest()->limit(10);`.

### Models
- Casts can and likely should be set in a `casts()` method on a model rather than the `$casts` property. Follow existing conventions from other models.


=== pint/core rules ===

## Laravel Pint Code Formatter

- You must run `vendor/bin/pint --dirty` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test`, simply run `vendor/bin/pint` to fix any formatting issues.


=== phpunit/core rules ===

## PHPUnit Core

- This application uses PHPUnit for testing. All tests must be written as PHPUnit classes. Use `php artisan make:test --phpunit {name}` to create a new test.
- If you see a test using "Pest", convert it to PHPUnit.
- Every time a test has been updated, run that singular test.
- When the tests relating to your feature are passing, ask the user if they would like to also run the entire test suite to make sure everything is still passing.
- Tests should test all of the happy paths, failure paths, and weird paths.
- You must not remove any tests or test files from the tests directory without approval. These are not temporary or helper files, these are core to the application.

### Running Tests
- Run the minimal number of tests, using an appropriate filter, before finalizing.
- To run all tests: `php artisan test`.
- To run all tests in a file: `php artisan test tests/Feature/ExampleTest.php`.
- To filter on a particular test name: `php artisan test --filter=testName` (recommended after making a change to a related file).


=== inertia-react/core rules ===

## Inertia + React

- Use `router.visit()` or `<Link>` for navigation instead of traditional links.

<code-snippet name="Inertia Client Navigation" lang="react">

import { Link } from '@inertiajs/react'
<Link href="/">Home</Link>

</code-snippet>


=== inertia-react/v2/forms rules ===

## Inertia + React Forms

<code-snippet name="`<Form>` Component Example" lang="react">

import { Form } from '@inertiajs/react'

export default () => (
    <Form action="/users" method="post">
        {({
            errors,
            hasErrors,
            processing,
            wasSuccessful,
            recentlySuccessful,
            clearErrors,
            resetAndClearErrors,
            defaults
        }) => (
        <>
        <input type="text" name="name" />

        {errors.name && <div>{errors.name}</div>}

        <button type="submit" disabled={processing}>
            {processing ? 'Creating...' : 'Create User'}
        </button>

        {wasSuccessful && <div>User created successfully!</div>}
        </>
    )}
    </Form>
)

</code-snippet>


=== tailwindcss/core rules ===

## Tailwind Core

- Use Tailwind CSS classes to style HTML, check and use existing tailwind conventions within the project before writing your own.
- Offer to extract repeated patterns into components that match the project's conventions (i.e. Blade, JSX, Vue, etc..)
- Think through class placement, order, priority, and defaults - remove redundant classes, add classes to parent or child carefully to limit repetition, group elements logically
- You can use the `search-docs` tool to get exact examples from the official documentation when needed.

### Spacing
- When listing items, use gap utilities for spacing, don't use margins.

    <code-snippet name="Valid Flex Gap Spacing Example" lang="html">
        <div class="flex gap-8">
            <div>Superior</div>
            <div>Michigan</div>
            <div>Erie</div>
        </div>
    </code-snippet>


### Dark Mode
- If existing pages and components support dark mode, new pages and components must support dark mode in a similar way, typically using `dark:`.


=== tailwindcss/v4 rules ===

## Tailwind 4

- Always use Tailwind CSS v4 - do not use the deprecated utilities.
- `corePlugins` is not supported in Tailwind v4.
- In Tailwind v4, configuration is CSS-first using the `@theme` directive — no separate `tailwind.config.js` file is needed.
<code-snippet name="Extending Theme in CSS" lang="css">
@theme {
  --color-brand: oklch(0.72 0.11 178);
}
</code-snippet>

- In Tailwind v4, you import Tailwind using a regular CSS `@import` statement, not using the `@tailwind` directives used in v3:

<code-snippet name="Tailwind v4 Import Tailwind Diff" lang="diff">
   - @tailwind base;
   - @tailwind components;
   - @tailwind utilities;
   + @import "tailwindcss";
</code-snippet>


### Replaced Utilities
- Tailwind v4 removed deprecated utilities. Do not use the deprecated option - use the replacement.
- Opacity values are still numeric.

| Deprecated |	Replacement |
|------------+--------------|
| bg-opacity-* | bg-black/* |
| text-opacity-* | text-black/* |
| border-opacity-* | border-black/* |
| divide-opacity-* | divide-black/* |
| ring-opacity-* | ring-black/* |
| placeholder-opacity-* | placeholder-black/* |
| flex-shrink-* | shrink-* |
| flex-grow-* | grow-* |
| overflow-ellipsis | text-ellipsis |
| decoration-slice | box-decoration-slice |
| decoration-clone | box-decoration-clone |
</laravel-boost-guidelines>
