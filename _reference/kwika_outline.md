🧭 Overall Goal

Build and complete Kwika.Events, a marketplace platform where service providers (e.g., caterers, photographers, decorators) can:

Register, verify, and manage company profiles;

Publish their services, promotions, and events;

Allow clients to search, browse, and book these services;

Enable secure authentication, booking management, analytics, and content management for both public and staff users.

💼 1. Core Business Modules and Requirements
1.1 Service Provider Account Management

Purpose: Allow providers to onboard, manage their profiles, and authenticate securely.

Business Requirements:

Providers can register using email or phone, with verification via link or code.

The system must prevent duplicate registrations.

Providers can log in via email/phone + password with optional 2FA.

Providers can update or delete profiles.

Providers can reset passwords via email/SMS.

Authentication must use JWT with refresh tokens (if “Remember Me” is used).

Providers’ devices must be tracked and verified for security.

Dependencies: Redis (temporary data + 2FA tokens), MongoDB (user data).

1.2 Search and Discovery (Marketplace Browsing)

Purpose: Let users discover service providers and offerings via filters and infinite scroll.

Business Requirements:

Support search filters by name, category, district, and location.

Results are paginated (page + limit) to support infinite scrolling.

The system must track access counts and calculate provider ranking scores (for featured listings).

Frequently accessed profiles must be cached (Redis) for faster retrieval.

Front-End Requirement: Infinite scroll implementation and incremental API calls.

1.3 Company and Brand Profiles

Purpose: Each provider can create a company profile with branding.

Business Requirements:

Providers can create/update/delete their company profile (name, logo, slogan, location).

Each company can have categories, catalogues, services, promotions, and events attached.

The platform must validate ownership: a company must belong to the authenticated provider.

Media uploads (logos, images) must be stored in a designated directory with unique filenames.

1.4 Services, Catalogues, and Categories

Purpose: Allow structured listing of offerings.

Business Requirements:

A company can create multiple catalogues, each with services under categories.

Each service includes name, description, price, image, and optional type.

Providers can update or delete services anytime.

Category assignment supports bulk creation or modification.

Key Constraint: Ensure that updates validate the provider’s company ownership.

1.5 Promotions and Marketing

Purpose: Enable providers to advertise time-bound offers.

Business Requirements:

Providers can create promotions with name, category, location, date, image, and price.

The system must allow promotion search with filters (name, category, address, date).

Promotions must appear sorted by end date and paginated for infinite scroll.

Expired promotions should be excluded from search results.

1.6 Events and Ticketing

Purpose: Allow providers to host and promote events with ticket packages.

Business Requirements:

Providers can create, update, delete, or view events.

Each event includes name, date, venue, image, and ticket packages.

Events can be searched via filters (name, date, venue, location) with infinite scroll.

Results sorted by start date ascending.

1.7 Booking and Client Interaction

Purpose: Enable clients to book services and communicate with providers.

Business Requirements:

Clients can create bookings by selecting services or events.

Booking includes service provider, event details, date/time, price, and client ID.

Service providers can approve/cancel bookings.

Clients can edit bookings only while pending.

Both parties receive notifications (email/SMS) for status updates.

1.8 Staff and Admin Management (Private Access)

Purpose: Internal Kwika.Events admin and content management.

Business Requirements:

Staff accounts (Admin, Author, Guest) managed via private routes.

Staff authentication uses JWT + 2FA.

Admins can create/verify other staff users.

Staff can manage all content types (sections, images, meta tags, etc.) for CMS functionality.

Authorization levels determine access.

1.9 CMS / Website Content Management

Purpose: Manage website sections, content types, schema markups, and media.

Business Requirements:

Authorized staff can CRUD:

Sections (homepage, about, etc.)

Section images

Content types and associated lists

Schema markups (for SEO)

Social media meta tags

Each operation must validate permissions (admin/author).

🧩 2. System-Wide Functional Requirements
Function	Requirement
Authentication	JWT with refresh tokens, Redis for sessions
2FA	Email or SMS using speakeasy + QR code setup
File Storage	Local disk storage for uploads (image validation required)
Caching	Redis caching for frequent profile and analytics data
Database	MongoDB for all persistent data
Security	Input validation, rate limiting (especially on login/reset)
Notifications	Email/SMS for registration, bookings, and password resets
Analytics	Redis worker for ranking providers based on access counts
Error Handling	Uniform JSON error responses with codes and messages
🧠 3. Technical Constraints for AI Agent

When passing to your AI coding assistant:

Do not overwrite existing components (auth, DB models, routes).
→ Add new endpoints only if missing.

Use existing service structure and middleware (e.g., authentication, Redis utilities).

Follow existing schema names (Company, ServiceProvider, Catalogue, etc.).

Where endpoints already exist, focus on:

Completing missing CRUD methods,

Integrating Redis caching,

Adding infinite scroll and search filters,

Implementing or enhancing booking + 2FA logic.

📋 4. Deliverables the AI Assistant Should Produce

When you pass this to an AI coding assistant, instruct it to:

Generate missing controllers and route handlers per module (Company, Service, Promotion, etc.).

Implement middleware for:

Auth (JWT)

Access tracking

Caching and Redis analytics worker

Add pagination + filtering logic for infinite scroll endpoints.

Integrate 2FA setup/verification flows (using speakeasy).

Add email/SMS notification functions.

Write standardized API responses for all CRUD operations.