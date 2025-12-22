 Comprehensive Ticketing System Implementation Plan

 Overview

 Build a complete event ticketing system integrated with the existing Kwika Events platform. The system     
 will allow visitors to discover events, purchase tickets with optional seating selection, receive QR-coded 
  tickets via email, and enable providers to manage events and check-in attendees.

 Current State Analysis

 ✅ Already Implemented

 - Event Model: Full lifecycle management (draft/published/cancelled/postponed/completed)
 - TicketPackage Model: Tiered pricing system (VIP, General Admission, Early Bird, etc.)
 - ServiceProvider Model: Provider verification and subscription management
 - Payment Model: Multi-method payment tracking (bank_transfer, mobile_money, card, cash)
 - Booking Model: Service booking workflow (pattern reference)
 - DomPDF: Installed and ready for PDF generation
 - Email Config: SMTP configured via Mailpit (development)
 - Frontend Stack: Inertia.js + React + Radix UI + Framer Motion

 ❌ Missing Components

 - EventTicket model for individual ticket tracking
 - QR code generation library
 - Event ticket purchase flow (cart, checkout, confirmation)
 - Payment gateway integration (Stripe/Flutterwave)
 - Email notification system for tickets
 - User ticket management interface
 - Provider event dashboard
 - Check-in system with QR validation
 - Seating management (optional per event)

 ---
 Implementation Strategy

 Phase 1: Database & Models (Foundation)

 Goal: Create the data structure for event ticketing

 1.1 Install QR Code Library

 - File: composer.json
 - Action: Add "chillerlan/php-qrcode": "^5.0" to require section
 - Command: composer require chillerlan/php-qrcode

 1.2 Create EventTicket Model & Migration

 - File: database/migrations/YYYY_MM_DD_create_event_tickets_table.php
 - Schema:
 - id (bigint, primary)
 - ticket_number (string, unique) // Format: TKT-{event_id}-{random}
 - event_id (foreign key → events)
 - ticket_package_id (foreign key → ticket_packages)
 - user_id (foreign key → users)
 - order_id (foreign key → ticket_orders)
 - attendee_name (string)
 - attendee_email (string)
 - attendee_phone (string, nullable)
 - qr_code (text) // Encoded ticket data
 - status (enum: valid, used, cancelled, refunded)
 - checked_in_at (timestamp, nullable)
 - checked_in_by (foreign key → users, nullable)
 - seat_id (foreign key → seats, nullable)
 - timestamps, soft_deletes
 - Model: app/Models/EventTicket.php
 - Relationships:
   - belongsTo: Event, TicketPackage, User, TicketOrder, Seat (optional)
   - hasMany: EventTicketHistory (for audit trail)

 1.3 Create TicketOrder Model & Migration

 - File: database/migrations/YYYY_MM_DD_create_ticket_orders_table.php
 - Schema:
 - id (bigint, primary)
 - order_number (string, unique) // Format: ORD-{timestamp}-{random}
 - user_id (foreign key → users)
 - event_id (foreign key → events)
 - total_amount (decimal:10,2)
 - currency (string, default: 'MWK')
 - status (enum: pending, confirmed, cancelled, refunded)
 - payment_id (foreign key → payments, nullable)
 - payment_status (enum: pending, completed, failed, refunded)
 - billing_name (string)
 - billing_email (string)
 - billing_phone (string)
 - promo_code (string, nullable)
 - discount_amount (decimal:10,2, default: 0)
 - timestamps, soft_deletes
 - Model: app/Models/TicketOrder.php
 - Relationships:
   - belongsTo: User, Event, Payment
   - hasMany: EventTickets

 1.4 Create Seat & Section Models (Optional Seating)

 - Extend Existing: app/Models/Section.php and app/Models/Seat.php
 - Section Migration: database/migrations/YYYY_MM_DD_update_sections_table.php
 - event_id (foreign key → events)
 - name (string) // e.g., "Orchestra", "Balcony", "VIP"
 - capacity (integer)
 - row_count (integer, nullable)
 - seat_numbering_type (enum: sequential, grid, custom)
 - Seat Migration: database/migrations/YYYY_MM_DD_create_seats_table.php
 - id (bigint, primary)
 - section_id (foreign key → sections)
 - seat_number (string) // e.g., "A12", "VIP-05"
 - row (string, nullable)
 - column (integer, nullable)
 - status (enum: available, reserved, sold, blocked)
 - reserved_until (timestamp, nullable) // For temporary cart holds
 - price_modifier (decimal:10,2, nullable) // Premium seat pricing

 1.5 Update Event Model

 - File: app/Models/Event.php
 - Add Relationships:
 public function ticketOrders() { return $this->hasMany(TicketOrder::class); }
 public function eventTickets() { return $this->hasMany(EventTicket::class); }
 public function sections() { return $this->hasMany(Section::class); }
 - Add Attribute:
 protected $casts = [
     'requires_seating' => 'boolean', // Add to migration
     'allow_guest_checkout' => 'boolean',
 ];

 ---
 Phase 2: Backend Services & Controllers

 2.1 Create TicketService

 - File: app/Services/TicketService.php
 - Methods:
 generateTicketNumber(): string
 generateQRCode(EventTicket $ticket): string
 generateTicketPDF(EventTicket $ticket): string
 reserveSeats(array $seatIds, int $minutes = 15): bool
 releaseExpiredReservations(): void
 validateTicket(string $qrCode): EventTicket|null
 checkInTicket(EventTicket $ticket, User $checker): bool

 2.2 Create PaymentGatewayService

 - File: app/Services/PaymentGatewayService.php
 - Strategy: Support multiple gateways with unified interface
 - Methods:
 createPaymentIntent(TicketOrder $order): array
 processPayment(TicketOrder $order, array $paymentData): Payment
 handleWebhook(string $gateway, array $payload): void
 refundPayment(Payment $payment, float $amount): bool
 - Gateways to Support:
   - Primary: Flutterwave (African markets, supports M-Pesa, cards)
   - Secondary: Stripe (international cards)
   - Local: Direct M-Pesa API integration

 2.3 Create TicketOrderController

 - File: app/Http/Controllers/TicketOrderController.php
 - Routes:
 POST   /ticket-orders/create         // Create order with cart items
 GET    /ticket-orders/{order}        // View order details
 POST   /ticket-orders/{order}/payment // Process payment
 GET    /ticket-orders/{order}/confirmation // Success page
 DELETE /ticket-orders/{order}        // Cancel order
 GET    /my-tickets                   // User's tickets dashboard
 - Methods:
 create(Request $request) // Validate cart, create order
 show(TicketOrder $order) // Order details with tickets
 processPayment(Request $request, TicketOrder $order)
 confirmation(TicketOrder $order)
 cancel(TicketOrder $order)
 myTickets() // User ticket list
 downloadTicket(EventTicket $ticket) // PDF download

 2.4 Create EventController (Public)

 - File: app/Http/Controllers/EventController.php
 - Routes:
 GET /events                    // Browse events (with filters)
 GET /events/{event:slug}       // Event detail page
 GET /events/{event}/seating    // Seating chart data (if applicable)
 POST /events/{event}/check-availability // Real-time seat availability

 2.5 Update Provider EventController

 - File: app/Http/Controllers/Provider/EventController.php
 - Add Methods:
 orders(Event $event) // List all orders for event
 attendees(Event $event) // Attendee list with check-in status
 checkIn(EventTicket $ticket) // Manual check-in
 sales(Event $event) // Sales analytics
 exportAttendees(Event $event) // Excel export

 2.6 Create WebhookController

 - File: app/Http/Controllers/WebhookController.php
 - Routes:
 POST /webhooks/flutterwave
 POST /webhooks/stripe
 POST /webhooks/mpesa
 - Purpose: Handle payment confirmation webhooks

 ---
 Phase 3: Frontend Components

 3.1 Event Discovery Pages

 3.1.1 Events Index Page
 - File: resources/js/Pages/Events/Index.tsx
 - Features:
   - Event grid/list view with filtering
   - Search by keyword, category, date range, location
   - Sorting (date, popularity, price)
   - Pagination
 - Components Needed:
   - EventCard (image, title, date, location, price range, availability)
   - FilterPanel (similar to ServicesListing pattern)
   - CalendarView (optional month view)

 3.1.2 Event Detail Page
 - File: resources/js/Pages/Events/Show.tsx
 - Features:
   - Event hero with cover image
   - Event details (date, time, venue, description)
   - Ticket package selection cards
   - "Book Now" CTA
   - Event information tabs (About, Agenda, Speakers, Venue)
   - Share buttons
   - Add to calendar
 - Props:
 {
   event: Event
   ticketPackages: TicketPackage[]
   similarEvents: Event[]
 }

 3.2 Ticket Purchase Flow

 3.2.1 Ticket Selection Component
 - File: resources/js/Components/Events/TicketSelection.tsx
 - Features:
   - Package cards with quantity selectors
   - Real-time availability updates
   - Min/max per order validation
   - Price calculation
   - "Add to Cart" action

 3.2.2 Seating Selection (Conditional)
 - File: resources/js/Components/Events/SeatingChart.tsx
 - Library: Consider react-seat-picker or custom SVG-based
 - Features:
   - Interactive seat map
   - Color-coded availability (available, reserved, sold)
   - Click to select/deselect
   - Price display per section
   - Real-time reservation (hold for 15 minutes)

 3.2.3 Cart/Checkout Page
 - File: resources/js/Pages/Events/Checkout.tsx
 - Sections:
   a. Order Summary
       - Event details
     - Ticket breakdown (package, quantity, price)
     - Total with fees
   b. Attendee Information Form
       - Name, email, phone per ticket
     - Or bulk entry option
   c. Billing Information
       - Name, email, phone
     - Promo code input
   d. Payment Method Selection
       - Mobile Money (M-Pesa, Airtel Money)
     - Card (Stripe/Flutterwave)
     - Bank Transfer
   e. Terms & Conditions Checkbox
   f. "Complete Purchase" Button

 3.2.4 Payment Processing
 - File: resources/js/Components/Events/PaymentProcessor.tsx
 - Features:
   - Payment method-specific UI
   - Loading states
   - Error handling
   - 3D Secure support (for cards)
   - Real-time status updates

 3.2.5 Order Confirmation
 - File: resources/js/Pages/Events/OrderConfirmation.tsx
 - Features:
   - Success message
   - Order number display
   - Ticket summary
   - "View Tickets" link
   - "Download PDF" buttons
   - Email confirmation notice
   - Add to calendar option

 3.3 User Ticket Management

 3.3.1 My Tickets Dashboard
 - File: resources/js/Pages/User/Tickets.tsx
 - Features:
   - Upcoming events tab
   - Past events tab
   - Ticket cards with QR code preview
   - Download/Email/Share options
   - Transfer ticket option
   - Filter by date, event name

 3.3.2 Ticket Detail Modal
 - File: resources/js/Components/Events/TicketDetail.tsx
 - Features:
   - Large QR code display
   - Ticket information (event, seat, attendee)
   - Download PDF button
   - Add to Apple/Google Wallet (future)
   - Event details
   - Venue directions

 3.4 Provider Event Management

 3.4.1 Event Dashboard
 - File: resources/js/Pages/Provider/Events/Dashboard.tsx
 - Features:
   - Event list with sales metrics
   - Quick stats (total sold, revenue, attendance rate)
   - Create/Edit event buttons
   - Sales chart

 3.4.2 Event Sales Detail
 - File: resources/js/Pages/Provider/Events/Sales.tsx
 - Features:
   - Order list with filters
   - Sales analytics (by package, by day)
   - Revenue breakdown
   - Attendee list
   - Export to Excel

 3.4.3 Check-In Interface
 - File: resources/js/Pages/Provider/Events/CheckIn.tsx
 - Features:
   - QR code scanner (camera access)
   - Manual search by ticket number/name
   - Bulk check-in list view
   - Real-time check-in count
   - Duplicate scan warning

 3.5 Admin Oversight

 3.5.1 Ticketing Overview
 - File: resources/js/Pages/Admin/Ticketing/Index.tsx
 - Features:
   - All events list
   - Platform-wide sales metrics
   - Recent orders
   - Flagged/disputed orders
   - Refund requests

 ---
 Phase 4: Email Notifications

 4.1 Create Mailable Classes

 4.1.1 Ticket Delivery Email
 - File: app/Mail/TicketDeliveryMail.php
 - Attachments: PDF tickets for all tickets in order
 - Content:
   - Order confirmation
   - Event details
   - Ticket download links
   - Add to calendar link
   - Venue directions

 4.1.2 Order Confirmation Email
 - File: app/Mail/OrderConfirmationMail.php
 - Content:
   - Order summary
   - Payment receipt
   - Next steps
   - Support contact

 4.1.3 Event Reminder Email
 - File: app/Mail/EventReminderMail.php
 - Trigger: 24 hours before event (queued job)
 - Content:
   - Event reminder
   - Ticket access
   - What to bring
   - Venue details

 4.1.4 Provider Notifications
 - File: app/Mail/NewTicketSaleMail.php
 - Trigger: Real-time on ticket purchase
 - Content:
   - New order notification
   - Order details
   - Link to attendee list

 4.2 Email Views

 - Directory: resources/views/emails/events/
 - Files:
   - ticket-delivery.blade.php
   - order-confirmation.blade.php
   - event-reminder.blade.php
   - provider-new-sale.blade.php
 - Styling: Use Laravel's default email styling

 4.3 Queued Jobs

 - File: app/Jobs/SendTicketEmailJob.php
 - File: app/Jobs/SendEventRemindersJob.php
 - File: app/Jobs/SendProviderSaleNotificationJob.php
 - Queue: Configure in .env (database queue for now)

 ---
 Phase 5: PDF & QR Code Generation

 5.1 Ticket PDF Template

 - File: resources/views/pdfs/ticket.blade.php
 - Content:
   - Event branding
   - QR code (large, centered)
   - Ticket number
   - Event details (name, date, time, venue)
   - Attendee name
   - Seat number (if applicable)
   - Barcode (text version for manual entry)
   - Terms & conditions footer

 5.2 QR Code Generation

 - Implementation: In TicketService.php
 - QR Data Format:
 {
   "ticket_id": 12345,
   "ticket_number": "TKT-001-ABCD1234",
   "event_id": 1,
   "signature": "sha256_hash" // For validation
 }
 - Library: chillerlan/php-qrcode
 - Output: Base64 encoded PNG for embedding in PDF/email

 5.3 PDF Generation Service

 - Method: TicketService::generateTicketPDF()
 - Process:
   a. Generate QR code
   b. Load Blade template
   c. Pass ticket data
   d. Render PDF via DomPDF
   e. Store temporarily or return as download
 - Storage: Store in storage/app/tickets/{order_id}/ for 30 days

 ---
 Phase 6: Payment Gateway Integration

 6.1 Flutterwave Integration (Primary)

 - Package: composer require flutterwave/flutterwave-php
 - Config: config/flutterwave.php
 - ENV Variables:
 FLUTTERWAVE_PUBLIC_KEY=
 FLUTTERWAVE_SECRET_KEY=
 FLUTTERWAVE_ENCRYPTION_KEY=
 FLUTTERWAVE_WEBHOOK_SECRET=
 - Features:
   - Card payments (Visa, Mastercard)
   - Mobile money (M-Pesa, Airtel Money, TNM Mpamba)
   - Bank transfers
   - USSD

 6.2 Payment Flow

 1. Create payment intent in PaymentGatewayService
 2. Redirect user to Flutterwave hosted page (or modal)
 3. Flutterwave processes payment
 4. Webhook confirms payment
 5. Update order status to "confirmed"
 6. Generate tickets
 7. Send email with tickets

 6.3 Webhook Security

 - Verify webhook signature using secret
 - Validate transaction status
 - Prevent duplicate processing (idempotency)
 - Log all webhook events

 6.4 Refund Implementation

 - Method: PaymentGatewayService::refundPayment()
 - Process:
   a. Call Flutterwave refund API
   b. Update Payment status to "refunded"
   c. Update TicketOrder status to "refunded"
   d. Mark EventTickets as "refunded"
   e. Send refund confirmation email

 ---
 Phase 7: Security & Validation

 7.1 Form Validation

 - TicketOrderRequest: Validate ticket selection, attendee info, payment data
 - CheckInRequest: Validate ticket authenticity and status

 7.2 Authorization Policies

 - File: app/Policies/TicketOrderPolicy.php
 - Rules:
   - Users can view their own orders
   - Providers can view orders for their events
   - Admins can view all orders

 7.3 QR Code Validation

 - Verify signature in QR data
 - Check ticket status (not used, not refunded)
 - Check ticket belongs to event being scanned
 - Prevent double scanning (grace period: 30 seconds)

 7.4 Seat Reservation Logic

 - Temporary hold for 15 minutes during checkout
 - Release on timer expiry or checkout abandonment
 - Prevent overselling
 - Handle race conditions with database locks

 ---
 Phase 8: Testing Strategy

 8.1 Unit Tests

 - Models: Test relationships, scopes, accessors
 - Services: Test QR generation, PDF creation, payment processing
 - File: tests/Unit/TicketServiceTest.php

 8.2 Feature Tests

 - Order Flow: Complete ticket purchase flow
 - Check-In: QR validation and check-in
 - Webhooks: Payment confirmation handling
 - File: tests/Feature/TicketPurchaseTest.php

 8.3 Browser Tests (Laravel Dusk)

 - End-to-end ticket purchase
 - Seating selection
 - Payment processing
 - File**: tests/Browser/TicketPurchaseTest.php

 ---
 Implementation Phases & Task Checklist

 ✅ Phase 1: Foundation (Week 1)

 - Install QR code library (composer require chillerlan/php-qrcode)
 - Create EventTicket migration & model
 - Create TicketOrder migration & model
 - Update Event model with relationships
 - Create TicketService class (QR generation, PDF generation)
 - Test PDF generation with sample ticket

 ✅ Phase 2: Basic Purchase Flow (Week 2)

 - Create TicketOrderController with create/show/cancel methods
 - Create Event detail page (Show.tsx) with ticket selection
 - Create TicketSelection component
 - Create Checkout page
 - Create order confirmation page
 - Test basic order creation (without payment)

 ✅ Phase 3: Payment Integration (Week 3)

 - Install Flutterwave package
 - Create PaymentGatewayService
 - Implement payment intent creation
 - Create payment processing UI
 - Create WebhookController for payment confirmation
 - Test payment flow end-to-end
 - Implement refund processing

 ✅ Phase 4: Email & Notifications (Week 4)

 - Create TicketDeliveryMail mailable
 - Create ticket PDF Blade template
 - Create SendTicketEmailJob queued job
 - Configure email settings for production
 - Create event reminder email (24hr before)
 - Create provider notification emails
 - Test email delivery

 ✅ Phase 5: User Ticket Management (Week 5)

 - Create My Tickets dashboard page
 - Create TicketDetail modal component
 - Add download ticket endpoint
 - Add ticket sharing functionality
 - Test ticket access and display

 ✅ Phase 6: Provider Management (Week 6)

 - Update Provider EventController with order/attendee methods
 - Create Event Dashboard page
 - Create Sales analytics page
 - Create Attendee list page with export
 - Create Check-In interface
 - Implement QR scanner (camera access)
 - Test check-in flow

 ✅ Phase 7: Seating System (Optional - Week 7)

 - Create Section migration & model
 - Create Seat migration & model
 - Create seating chart data structure
 - Create SeatingChart component
 - Implement seat reservation logic
 - Add seat selection to checkout flow
 - Test seat booking and release

 ✅ Phase 8: Admin & Polish (Week 8)

 - Create Admin ticketing overview page
 - Add refund request handling
 - Implement dispute resolution
 - Add analytics dashboard
 - Performance optimization (query optimization, caching)
 - Security audit (XSS, CSRF, SQL injection)
 - Cross-browser testing
 - Mobile responsiveness testing

 ✅ Phase 9: Advanced Features (Future)

 - Promo codes and discounts
 - Group bookings with discounts
 - Waitlist for sold-out events
 - Ticket transfer between users
 - Apple Wallet / Google Pay integration
 - Social sharing with OG tags
 - Multi-language support
 - Accessibility (WCAG 2.1 AA compliance)

 ---
 Critical Files Summary

 New Files to Create

 Migrations:
 - database/migrations/YYYY_MM_DD_create_event_tickets_table.php
 - database/migrations/YYYY_MM_DD_create_ticket_orders_table.php
 - database/migrations/YYYY_MM_DD_update_sections_table.php
 - database/migrations/YYYY_MM_DD_create_seats_table.php
 - database/migrations/YYYY_MM_DD_add_ticketing_fields_to_events.php

 Models:
 - app/Models/EventTicket.php
 - app/Models/TicketOrder.php
 - app/Models/Seat.php (extend existing)

 Services:
 - app/Services/TicketService.php
 - app/Services/PaymentGatewayService.php

 Controllers:
 - app/Http/Controllers/EventController.php
 - app/Http/Controllers/TicketOrderController.php
 - app/Http/Controllers/WebhookController.php
 - Update: app/Http/Controllers/Provider/EventController.php

 Frontend Pages:
 - resources/js/Pages/Events/Index.tsx
 - resources/js/Pages/Events/Show.tsx
 - resources/js/Pages/Events/Checkout.tsx
 - resources/js/Pages/Events/OrderConfirmation.tsx
 - resources/js/Pages/User/Tickets.tsx
 - resources/js/Pages/Provider/Events/Dashboard.tsx
 - resources/js/Pages/Provider/Events/Sales.tsx
 - resources/js/Pages/Provider/Events/CheckIn.tsx

 Components:
 - resources/js/Components/Events/TicketSelection.tsx
 - resources/js/Components/Events/SeatingChart.tsx
 - resources/js/Components/Events/PaymentProcessor.tsx
 - resources/js/Components/Events/TicketDetail.tsx
 - resources/js/Components/Events/EventCard.tsx

 Email:
 - app/Mail/TicketDeliveryMail.php
 - app/Mail/OrderConfirmationMail.php
 - app/Mail/EventReminderMail.php
 - app/Mail/NewTicketSaleMail.php
 - resources/views/emails/events/*.blade.php

 Jobs:
 - app/Jobs/SendTicketEmailJob.php
 - app/Jobs/SendEventRemindersJob.php
 - app/Jobs/ReleaseExpiredSeatsJob.php

 PDF Templates:
 - resources/views/pdfs/ticket.blade.php

 Policies:
 - app/Policies/TicketOrderPolicy.php
 - app/Policies/EventTicketPolicy.php

 Tests:
 - tests/Unit/TicketServiceTest.php
 - tests/Feature/TicketPurchaseTest.php
 - tests/Browser/TicketPurchaseTest.php

 Files to Modify

 Models:
 - app/Models/Event.php (add relationships, casts)
 - app/Models/Section.php (add event relationship)

 Controllers:
 - app/Http/Controllers/Provider/EventController.php (add sales, check-in methods)

 Routes:
 - routes/web.php (add public event routes)
 - routes/provider.php (add event management routes)
 - routes/api.php (add webhook routes)

 ---
 Environment Configuration

 Add to .env:
 # Flutterwave
 FLUTTERWAVE_PUBLIC_KEY=
 FLUTTERWAVE_SECRET_KEY=
 FLUTTERWAVE_ENCRYPTION_KEY=
 FLUTTERWAVE_WEBHOOK_SECRET=

 # Email
 MAIL_MAILER=smtp
 MAIL_FROM_ADDRESS=tickets@kwika.events
 MAIL_FROM_NAME="Kwika Events"

 # Queue
 QUEUE_CONNECTION=database

 # Storage
 FILESYSTEM_DISK=public

 ---
 Success Metrics

 - Users can complete ticket purchase in < 3 minutes
 - QR check-in takes < 5 seconds per ticket
 - Email delivery within 2 minutes of purchase
 - Support 1000+ concurrent ticket buyers
 - 99.9% uptime during high-traffic events
 - Zero double-booking incidents
 - Payment success rate > 95%

 ---
 Risk Mitigation

 Payment Failures: Implement retry logic and clear error messages
 Overselling: Use database transactions and locks for seat allocation
 Email Delivery: Use queued jobs with retry mechanism
 QR Duplication: Add cryptographic signatures to QR codes
 Performance: Cache event data, use CDN for images, optimize queries
 Security: Sanitize all inputs, validate webhooks, use HTTPS only

 ---
 Next Steps After Plan Approval

 1. Set up development environment
 2. Install required packages
 3. Create database migrations
 4. Implement Phase 1 (Foundation)
 5. Test and iterate through subsequent phases
 6. Deploy to staging for testing
 7. User acceptance testing
 8. Production deployment with monitoring

 ---
 Note: This plan follows the existing codebase patterns (Inertia.js, Laravel conventions, existing UI       
 components) and integrates seamlessly with the current Kwika Events platform architecture.