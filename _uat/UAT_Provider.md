# Provider Module - User Acceptance Testing

## Overview
This document contains test cases for service providers. Providers can manage their business profile, services, products, packages, bookings, events, promotions, availability, and view analytics.

## Prerequisites
- Access to the Kwika Events website
- A registered provider account (completed onboarding)
- Provider profile should be approved (for full functionality tests)
- Sample images for upload tests

---

## Test Cases

### 1. Provider Dashboard

#### TC-P001: Access Provider Dashboard
- **Description**: Verify provider can access their dashboard
- **Steps**:
  1. Log in as a provider
  2. You should be redirected to dashboard, or click "Dashboard"
  3. Or go to /provider/dashboard
- **Expected Result**:
  - Dashboard page loads
  - Welcome message shows your business name
  - Stats cards are displayed
- **Pass/Fail**: [ ]

#### TC-P002: View Dashboard Stats
- **Description**: Verify dashboard statistics are displayed
- **Steps**:
  1. Go to provider dashboard
  2. Review the stats cards
- **Expected Result**:
  - "Total Revenue" shows earnings amount
  - "Pending Bookings" shows count
  - "Active Services" shows count
  - "Profile Views" shows view count
- **Pass/Fail**: [ ]

#### TC-P003: View Verification Status Alert
- **Description**: Verify pending verification alert is shown
- **Steps**:
  1. As a new/unverified provider, go to dashboard
  2. Look for verification status message
- **Expected Result**:
  - If pending: Yellow alert shows "Profile Under Review"
  - If approved: No alert, or green verified badge
  - If rejected: Alert with rejection reason
- **Pass/Fail**: [ ]

#### TC-P004: View Recent Bookings on Dashboard
- **Description**: Verify recent bookings are displayed
- **Steps**:
  1. Go to dashboard
  2. Look for "Recent Bookings" section
- **Expected Result**:
  - Recent bookings listed
  - Shows customer name, service, date, amount, status
  - "View All" link works
- **Pass/Fail**: [ ]

#### TC-P005: View Upcoming Events on Dashboard
- **Description**: Verify upcoming events are displayed
- **Steps**:
  1. Go to dashboard
  2. Look for "Upcoming Events" section
- **Expected Result**:
  - Upcoming scheduled bookings shown
  - Shows service, client name, date and time
- **Pass/Fail**: [ ]

#### TC-P006: View Revenue Chart
- **Description**: Verify revenue trend chart works
- **Steps**:
  1. Go to dashboard
  2. Look at the "Revenue Trend" chart
- **Expected Result**:
  - Chart displays monthly revenue
  - Can see trend over last 6 months
  - Hover shows exact values
- **Pass/Fail**: [ ]

#### TC-P007: View Booking Distribution Chart
- **Description**: Verify booking status chart works
- **Steps**:
  1. Go to dashboard
  2. Look at the "Booking Status Distribution" chart
- **Expected Result**:
  - Pie chart shows booking breakdown
  - Different colors for different statuses
  - Legend shows status names and counts
- **Pass/Fail**: [ ]

#### TC-P008: Quick Actions
- **Description**: Verify quick action buttons work
- **Steps**:
  1. On dashboard, click "Add Service"
  2. Go back, click "Update Profile"
- **Expected Result**:
  - "Add Service" goes to services page
  - "Update Profile" goes to settings page
- **Pass/Fail**: [ ]

---

### 2. Services Management

#### TC-P009: View All Services
- **Description**: Verify provider can view their services list
- **Steps**:
  1. Click "Services" in the provider menu
  2. Or go to /provider/services
- **Expected Result**:
  - Services page loads
  - All your services are listed
  - Each shows name, price, status
- **Pass/Fail**: [ ]

#### TC-P010: Add New Service
- **Description**: Verify provider can create a new service
- **Steps**:
  1. On services page, click "Add Service" or "+" button
  2. Fill in service name
  3. Fill in description
  4. Set price
  5. Select category (if applicable)
  6. Upload images (optional)
  7. Save the service
- **Expected Result**:
  - Service form appears
  - All fields can be filled
  - Service is created successfully
  - Appears in services list
  - Success message shown
- **Pass/Fail**: [ ]

#### TC-P011: Edit Service
- **Description**: Verify provider can edit an existing service
- **Steps**:
  1. On services page, click edit on a service
  2. Change the service name
  3. Update the price
  4. Save changes
- **Expected Result**:
  - Edit form loads with current values
  - Changes can be made
  - Save updates the service
  - Changes persist on refresh
- **Pass/Fail**: [ ]

#### TC-P012: Toggle Service Active/Inactive
- **Description**: Verify service visibility can be toggled
- **Steps**:
  1. On services page, find the toggle switch
  2. Toggle a service from active to inactive
  3. Toggle it back to active
- **Expected Result**:
  - Toggle switch works
  - Inactive services not visible to customers
  - Can be reactivated
  - Status indicator changes
- **Pass/Fail**: [ ]

#### TC-P013: Delete Service
- **Description**: Verify provider can delete a service
- **Steps**:
  1. On services page, click delete on a service
  2. Confirm deletion
- **Expected Result**:
  - Confirmation dialog appears
  - After confirm, service is removed
  - No longer appears in list
- **Pass/Fail**: [ ]

---

### 3. Products Management

#### TC-P014: View All Products
- **Description**: Verify provider can view their products
- **Steps**:
  1. Click "Products" in the provider menu
  2. Or go to /provider/products
- **Expected Result**:
  - Products page loads
  - All products listed
  - Shows name, price, stock, status
- **Pass/Fail**: [ ]

#### TC-P015: Add New Product
- **Description**: Verify provider can create a product
- **Steps**:
  1. Click "Add Product"
  2. Fill in product name
  3. Fill in description
  4. Set price
  5. Set stock quantity (if applicable)
  6. Upload images
  7. Save
- **Expected Result**:
  - Product is created
  - Appears in products list
  - Images display correctly
- **Pass/Fail**: [ ]

#### TC-P016: Edit Product
- **Description**: Verify product can be edited
- **Steps**:
  1. Click edit on a product
  2. Make changes
  3. Save
- **Expected Result**:
  - Edit form loads current data
  - Changes save successfully
  - Updates visible immediately
- **Pass/Fail**: [ ]

#### TC-P017: Toggle Product Active/Inactive
- **Description**: Verify product visibility toggle
- **Steps**:
  1. Toggle a product inactive
  2. Toggle it back active
- **Expected Result**:
  - Product hidden from store when inactive
  - Can be reactivated
- **Pass/Fail**: [ ]

#### TC-P018: Delete Product
- **Description**: Verify product can be deleted
- **Steps**:
  1. Click delete on a product
  2. Confirm
- **Expected Result**:
  - Product is removed
  - No longer in list
- **Pass/Fail**: [ ]

---

### 4. Packages Management

#### TC-P019: View All Packages
- **Description**: Verify provider can view service packages
- **Steps**:
  1. Click "Packages" in the provider menu
  2. Or go to /provider/packages
- **Expected Result**:
  - Packages page loads
  - All packages listed
  - Shows name, price, included services
- **Pass/Fail**: [ ]

#### TC-P020: Create New Package
- **Description**: Verify provider can create a package
- **Steps**:
  1. Click "Create Package"
  2. Enter package name
  3. Enter description
  4. Select services to include
  5. Set package price
  6. Save
- **Expected Result**:
  - Package form works
  - Can select multiple services
  - Price can be set (usually discounted)
  - Package is created
- **Pass/Fail**: [ ]

#### TC-P021: Edit Package
- **Description**: Verify package can be edited
- **Steps**:
  1. Click edit on a package
  2. Add or remove services
  3. Update price
  4. Save
- **Expected Result**:
  - Edit form loads current data
  - Can modify included services
  - Changes save successfully
- **Pass/Fail**: [ ]

#### TC-P022: Toggle Package Active/Inactive
- **Description**: Verify package visibility toggle
- **Steps**:
  1. Toggle a package inactive
  2. Toggle back active
- **Expected Result**:
  - Inactive packages hidden from customers
  - Status changes correctly
- **Pass/Fail**: [ ]

#### TC-P023: Delete Package
- **Description**: Verify package can be deleted
- **Steps**:
  1. Click delete on a package
  2. Confirm deletion
- **Expected Result**:
  - Package is removed
  - Services within are NOT deleted (only the package)
- **Pass/Fail**: [ ]

#### TC-P024: Reorder Packages
- **Description**: Verify packages can be reordered
- **Steps**:
  1. On packages page, drag a package to new position
  2. Or use reorder buttons
- **Expected Result**:
  - Package order changes
  - New order persists on refresh
  - Display order updates on public profile
- **Pass/Fail**: [ ]

---

### 5. Bookings Management

#### TC-P025: View All Bookings
- **Description**: Verify provider can view all bookings
- **Steps**:
  1. Click "Bookings" in the provider menu
  2. Or go to /provider/bookings
- **Expected Result**:
  - Bookings page loads
  - All bookings listed
  - Shows customer, service, date, amount, status
- **Pass/Fail**: [ ]

#### TC-P026: Filter Bookings by Status
- **Description**: Verify bookings can be filtered
- **Steps**:
  1. On bookings page, click filter dropdown
  2. Select "Pending"
  3. Select "Confirmed"
  4. Select "Completed"
- **Expected Result**:
  - List updates to show only selected status
  - Clear filter shows all again
- **Pass/Fail**: [ ]

#### TC-P027: View Booking Details
- **Description**: Verify booking detail page works
- **Steps**:
  1. Click on a booking to view details
- **Expected Result**:
  - Booking detail page loads
  - Shows all booking information
  - Customer details visible
  - Service/package details shown
  - Payment status visible
- **Pass/Fail**: [ ]

#### TC-P028: Confirm a Booking
- **Description**: Verify provider can confirm bookings
- **Steps**:
  1. Find a booking with "Pending" status
  2. Click "Confirm" button
- **Expected Result**:
  - Status changes to "Confirmed"
  - Customer may receive notification
  - Booking appears in upcoming events
- **Pass/Fail**: [ ]

#### TC-P029: Complete a Booking
- **Description**: Verify provider can mark bookings complete
- **Steps**:
  1. Find a confirmed booking (event date has passed)
  2. Click "Mark Complete" or "Complete"
- **Expected Result**:
  - Status changes to "Completed"
  - Customer can now leave review
  - Revenue counted in analytics
- **Pass/Fail**: [ ]

#### TC-P030: Cancel a Booking
- **Description**: Verify provider can cancel bookings
- **Steps**:
  1. Find a pending or confirmed booking
  2. Click "Cancel"
  3. Enter cancellation reason (if required)
  4. Confirm
- **Expected Result**:
  - Status changes to "Cancelled"
  - Customer notified (if configured)
  - Refund process may start (if applicable)
- **Pass/Fail**: [ ]

#### TC-P031: Export Bookings
- **Description**: Verify bookings can be exported
- **Steps**:
  1. On bookings page, click "Export"
  2. Select format (CSV/Excel)
  3. Download file
- **Expected Result**:
  - File downloads
  - Contains booking data
  - Can open in spreadsheet program
- **Pass/Fail**: [ ]

#### TC-P032: Verify Payment
- **Description**: Verify provider can verify bank transfer payments
- **Steps**:
  1. Find a booking with pending payment (bank transfer)
  2. View the proof of payment image
  3. Click "Verify Payment"
- **Expected Result**:
  - Payment proof image is visible
  - After verification, payment status updates
  - Booking can proceed
- **Pass/Fail**: [ ]

---

### 6. Booking Checklists

#### TC-P033: View Checklist Templates
- **Description**: Verify checklist templates page works
- **Steps**:
  1. Click "Checklists" in provider menu
  2. Or go to /provider/checklists
- **Expected Result**:
  - Checklists page loads
  - Existing templates shown
  - Option to create new template
- **Pass/Fail**: [ ]

#### TC-P034: Create Checklist Template
- **Description**: Verify templates can be created
- **Steps**:
  1. Click "Create Template"
  2. Enter template name (e.g., "Wedding Setup")
  3. Add checklist items
  4. Save template
- **Expected Result**:
  - Template is created
  - Appears in templates list
  - Can be used for bookings
- **Pass/Fail**: [ ]

#### TC-P035: Add Items to Template
- **Description**: Verify items can be added to template
- **Steps**:
  1. Open a checklist template
  2. Click "Add Item"
  3. Enter item description
  4. Save
- **Expected Result**:
  - Item is added to template
  - Multiple items can be added
  - Order is preserved
- **Pass/Fail**: [ ]

#### TC-P036: Edit Template Item
- **Description**: Verify template items can be edited
- **Steps**:
  1. On a template, click edit on an item
  2. Change the text
  3. Save
- **Expected Result**:
  - Item text updates
  - Change persists
- **Pass/Fail**: [ ]

#### TC-P037: Delete Template Item
- **Description**: Verify items can be removed
- **Steps**:
  1. On a template, click delete on an item
- **Expected Result**:
  - Item is removed
  - Other items remain
- **Pass/Fail**: [ ]

#### TC-P038: Apply Checklist to Booking
- **Description**: Verify checklist can be added to booking
- **Steps**:
  1. Go to a booking detail page
  2. Click "Add Checklist" or similar
  3. Select a template
- **Expected Result**:
  - Checklist is attached to booking
  - All template items appear
  - Can track progress
- **Pass/Fail**: [ ]

#### TC-P039: Toggle Checklist Item Complete
- **Description**: Verify items can be checked off
- **Steps**:
  1. On a booking with checklist
  2. Click checkbox on an item
- **Expected Result**:
  - Item marks as complete
  - Progress indicator updates
  - State persists
- **Pass/Fail**: [ ]

#### TC-P040: Reorder Checklist Items
- **Description**: Verify items can be reordered
- **Steps**:
  1. On a checklist, drag items to reorder
- **Expected Result**:
  - Order changes
  - New order is saved
- **Pass/Fail**: [ ]

---

### 7. Availability Management

#### TC-P041: View Availability Calendar
- **Description**: Verify availability page works
- **Steps**:
  1. Click "Availability" in provider menu
  2. Or go to /provider/availability
- **Expected Result**:
  - Calendar view loads
  - Existing availability shown
  - Can navigate between months
- **Pass/Fail**: [ ]

#### TC-P042: Add Available Time Slot
- **Description**: Verify availability can be set
- **Steps**:
  1. On availability page, click a date
  2. Set available hours (start and end time)
  3. Save
- **Expected Result**:
  - Time slot is created
  - Shows on calendar
  - Customers can book during these times
- **Pass/Fail**: [ ]

#### TC-P043: Block a Date
- **Description**: Verify dates can be blocked
- **Steps**:
  1. Click on a date
  2. Mark as "Blocked" or "Unavailable"
  3. Save
- **Expected Result**:
  - Date is blocked
  - Shows differently on calendar (e.g., gray)
  - Customers cannot book on this date
- **Pass/Fail**: [ ]

#### TC-P044: Edit Availability
- **Description**: Verify availability can be modified
- **Steps**:
  1. Click on existing availability
  2. Change the times
  3. Save
- **Expected Result**:
  - Times are updated
  - Changes reflected on calendar
- **Pass/Fail**: [ ]

#### TC-P045: Delete Availability
- **Description**: Verify availability can be removed
- **Steps**:
  1. Click on availability entry
  2. Click delete
  3. Confirm
- **Expected Result**:
  - Entry is removed
  - Date returns to default state
- **Pass/Fail**: [ ]

#### TC-P046: Bulk Delete Availability
- **Description**: Verify multiple entries can be deleted
- **Steps**:
  1. Select multiple availability entries
  2. Click bulk delete
- **Expected Result**:
  - All selected entries removed
  - Saves time for clearing calendar
- **Pass/Fail**: [ ]

---

### 8. Events Management

#### TC-P047: View All Events
- **Description**: Verify provider can view their events
- **Steps**:
  1. Click "Events" in provider menu
  2. Or go to /provider/events
- **Expected Result**:
  - Events page loads
  - All provider's events listed
  - Shows name, date, status
- **Pass/Fail**: [ ]

#### TC-P048: Create New Event
- **Description**: Verify event creation works
- **Steps**:
  1. Click "Create Event"
  2. Enter event name
  3. Enter description
  4. Set date and time
  5. Set venue/location
  6. Set ticket types and prices
  7. Upload event image
  8. Save
- **Expected Result**:
  - Event is created
  - Appears in events list
  - Visible on public events page
- **Pass/Fail**: [ ]

#### TC-P049: Edit Event
- **Description**: Verify event can be edited
- **Steps**:
  1. Click edit on an event
  2. Update event details
  3. Save changes
- **Expected Result**:
  - Edit form loads current data
  - Changes save successfully
  - Public event page updates
- **Pass/Fail**: [ ]

#### TC-P050: Delete Event
- **Description**: Verify event can be deleted
- **Steps**:
  1. Click delete on an event
  2. Confirm deletion
- **Expected Result**:
  - Event is removed
  - No longer visible to public
  - Existing ticket sales handled appropriately
- **Pass/Fail**: [ ]

---

### 9. Promotions Management

#### TC-P051: View All Promotions
- **Description**: Verify promotions page works
- **Steps**:
  1. Click "Promotions" in provider menu
  2. Or go to /provider/promotions
- **Expected Result**:
  - Promotions page loads
  - All promotions listed
  - Shows name, discount, dates, status
- **Pass/Fail**: [ ]

#### TC-P052: Create Promotion
- **Description**: Verify promotion can be created
- **Steps**:
  1. Click "Create Promotion"
  2. Enter promotion name
  3. Set discount type (percentage or fixed)
  4. Set discount value
  5. Set start and end dates
  6. Select applicable services (if needed)
  7. Save
- **Expected Result**:
  - Promotion is created
  - Shows in promotions list
  - Applies to selected services
- **Pass/Fail**: [ ]

#### TC-P053: Edit Promotion
- **Description**: Verify promotion can be edited
- **Steps**:
  1. Click edit on a promotion
  2. Change discount value
  3. Update dates
  4. Save
- **Expected Result**:
  - Changes are saved
  - Updated promotion applies correctly
- **Pass/Fail**: [ ]

#### TC-P054: Toggle Promotion Active/Inactive
- **Description**: Verify promotion can be enabled/disabled
- **Steps**:
  1. Toggle a promotion off
  2. Toggle it back on
- **Expected Result**:
  - Inactive promotions don't apply
  - Can reactivate anytime
- **Pass/Fail**: [ ]

#### TC-P055: Delete Promotion
- **Description**: Verify promotion can be deleted
- **Steps**:
  1. Click delete on a promotion
  2. Confirm
- **Expected Result**:
  - Promotion is removed
  - No longer applies to services
- **Pass/Fail**: [ ]

---

### 10. Companies (Sub-brands)

#### TC-P056: View Companies
- **Description**: Verify companies list works
- **Steps**:
  1. Click "Companies" in provider menu
  2. Or go to /provider/companies
- **Expected Result**:
  - Companies page loads
  - Shows all sub-brands/companies
- **Pass/Fail**: [ ]

#### TC-P057: Create Company
- **Description**: Verify company can be created
- **Steps**:
  1. Click "Create Company"
  2. Enter company name
  3. Enter description
  4. Upload logo
  5. Save
- **Expected Result**:
  - Company is created
  - Appears in list
  - Can be associated with services
- **Pass/Fail**: [ ]

#### TC-P058: Edit Company
- **Description**: Verify company can be edited
- **Steps**:
  1. Click edit on a company
  2. Update details
  3. Save
- **Expected Result**:
  - Changes save successfully
- **Pass/Fail**: [ ]

#### TC-P059: Delete Company
- **Description**: Verify company can be deleted
- **Steps**:
  1. Click delete on a company
  2. Confirm
- **Expected Result**:
  - Company is removed
  - Associated services may need updating
- **Pass/Fail**: [ ]

---

### 11. Catalogues

#### TC-P060: View Service Catalogues
- **Description**: Verify service catalogues page works
- **Steps**:
  1. Click "Service Catalogues"
  2. Or go to /provider/service-catalogues
- **Expected Result**:
  - Catalogues page loads
  - Shows all service catalogues
- **Pass/Fail**: [ ]

#### TC-P061: Create Service Catalogue
- **Description**: Verify catalogue can be created
- **Steps**:
  1. Click "Create Catalogue"
  2. Enter name
  3. Select services to include
  4. Save
- **Expected Result**:
  - Catalogue is created
  - Groups selected services
- **Pass/Fail**: [ ]

#### TC-P062: View Product Catalogues
- **Description**: Verify product catalogues work
- **Steps**:
  1. Click "Product Catalogues"
  2. Or go to /provider/product-catalogues
- **Expected Result**:
  - Product catalogues page loads
  - Shows all product catalogues
- **Pass/Fail**: [ ]

---

### 12. Media Management

#### TC-P063: Access Media Page
- **Description**: Verify media management page works
- **Steps**:
  1. Click "Media" in provider menu
  2. Or go to /provider/media
- **Expected Result**:
  - Media page loads
  - Shows current logo, cover, portfolio
- **Pass/Fail**: [ ]

#### TC-P064: Upload Logo
- **Description**: Verify logo upload works
- **Steps**:
  1. On media page, find logo section
  2. Click upload or drag image
  3. Select image file
- **Expected Result**:
  - Logo uploads successfully
  - Preview shows new logo
  - Logo appears on public profile
- **Pass/Fail**: [ ]

#### TC-P065: Upload Cover Image
- **Description**: Verify cover image upload works
- **Steps**:
  1. Find cover image section
  2. Upload an image
- **Expected Result**:
  - Cover image uploads
  - Displays on public profile header
- **Pass/Fail**: [ ]

#### TC-P066: Upload Portfolio Images
- **Description**: Verify portfolio upload works
- **Steps**:
  1. Find portfolio section
  2. Upload multiple images
- **Expected Result**:
  - Images upload successfully
  - All appear in portfolio
  - Visible on public profile
- **Pass/Fail**: [ ]

#### TC-P067: Delete Media
- **Description**: Verify images can be deleted
- **Steps**:
  1. Click delete on a portfolio image
  2. Confirm
- **Expected Result**:
  - Image is removed
  - No longer shows on profile
- **Pass/Fail**: [ ]

---

### 13. Settings / Profile

#### TC-P068: Access Settings Page
- **Description**: Verify settings page works
- **Steps**:
  1. Click "Settings" in provider menu
  2. Or go to /provider/settings
- **Expected Result**:
  - Settings page loads
  - Current business info displayed
- **Pass/Fail**: [ ]

#### TC-P069: Update Business Information
- **Description**: Verify business info can be updated
- **Steps**:
  1. On settings, change business name
  2. Update description
  3. Update location
  4. Save changes
- **Expected Result**:
  - Changes save successfully
  - Public profile updates
- **Pass/Fail**: [ ]

#### TC-P070: Update Contact Information
- **Description**: Verify contact details can be updated
- **Steps**:
  1. Update phone number
  2. Update email
  3. Update website
  4. Save
- **Expected Result**:
  - Contact info updates
  - Shows on public profile
- **Pass/Fail**: [ ]

#### TC-P071: Update Social Links
- **Description**: Verify social links can be managed
- **Steps**:
  1. Add or update Facebook URL
  2. Add Instagram URL
  3. Save
- **Expected Result**:
  - Social links save
  - Icons appear on profile
- **Pass/Fail**: [ ]

#### TC-P072: Change Password
- **Description**: Verify password can be changed
- **Steps**:
  1. Enter current password
  2. Enter new password
  3. Confirm new password
  4. Save
- **Expected Result**:
  - Password updates
  - Can log in with new password
- **Pass/Fail**: [ ]

---

### 14. Analytics

#### TC-P073: View Analytics Overview
- **Description**: Verify analytics page works
- **Steps**:
  1. Click "Analytics" in provider menu
  2. Or go to /provider/analytics
- **Expected Result**:
  - Analytics page loads
  - Overview metrics displayed
  - Charts visible
- **Pass/Fail**: [ ]

#### TC-P074: View Revenue Analytics
- **Description**: Verify revenue details page works
- **Steps**:
  1. Click on Revenue analytics tab
  2. Or go to /provider/analytics/revenue
- **Expected Result**:
  - Revenue breakdown shown
  - Charts display trends
  - Can filter by date range
- **Pass/Fail**: [ ]

#### TC-P075: View Bookings Analytics
- **Description**: Verify bookings analytics works
- **Steps**:
  1. Click Bookings analytics tab
- **Expected Result**:
  - Booking metrics displayed
  - Status distribution shown
  - Trends visible
- **Pass/Fail**: [ ]

#### TC-P076: View Services Analytics
- **Description**: Verify services analytics works
- **Steps**:
  1. Click Services analytics tab
- **Expected Result**:
  - Top performing services shown
  - Booking counts per service
  - Revenue per service
- **Pass/Fail**: [ ]

#### TC-P077: View Customers Analytics
- **Description**: Verify customer analytics works
- **Steps**:
  1. Click Customers analytics tab
- **Expected Result**:
  - Customer metrics shown
  - Repeat customer rate
  - Customer growth trends
- **Pass/Fail**: [ ]

#### TC-P078: Export Analytics Report
- **Description**: Verify reports can be exported
- **Steps**:
  1. On analytics page, click "Export"
  2. Select date range
  3. Download report
- **Expected Result**:
  - Report file downloads
  - Contains selected data
  - Can open in spreadsheet
- **Pass/Fail**: [ ]

---

### 15. Messages

#### TC-P079: Access Messages
- **Description**: Verify messages page works
- **Steps**:
  1. Click "Messages" in provider menu
  2. Or go to /provider/messages
- **Expected Result**:
  - Messages page loads
  - Conversation list shown
- **Pass/Fail**: [ ]

#### TC-P080: View Conversation
- **Description**: Verify conversations display correctly
- **Steps**:
  1. Click on a conversation
  2. View message history
- **Expected Result**:
  - Messages displayed in order
  - Customer messages and your replies shown
  - Timestamps visible
- **Pass/Fail**: [ ]

#### TC-P081: Reply to Message
- **Description**: Verify provider can reply
- **Steps**:
  1. Open a conversation
  2. Type a reply
  3. Send
- **Expected Result**:
  - Message sends
  - Appears in conversation
  - Customer will receive it
- **Pass/Fail**: [ ]

---

### 16. Combined Listings View

#### TC-P082: View Listings Page
- **Description**: Verify combined listings page works
- **Steps**:
  1. Click "Listings" in provider menu
  2. Or go to /provider/listings
- **Expected Result**:
  - Listings page loads
  - Shows both services and products
  - Can filter by type
- **Pass/Fail**: [ ]

---

## Test Summary

| Category | Total Tests | Passed | Failed |
|----------|-------------|--------|--------|
| Provider Dashboard | 8 | | |
| Services Management | 5 | | |
| Products Management | 5 | | |
| Packages Management | 6 | | |
| Bookings Management | 8 | | |
| Booking Checklists | 8 | | |
| Availability Management | 6 | | |
| Events Management | 4 | | |
| Promotions Management | 5 | | |
| Companies | 4 | | |
| Catalogues | 3 | | |
| Media Management | 5 | | |
| Settings / Profile | 5 | | |
| Analytics | 6 | | |
| Messages | 3 | | |
| Combined Listings | 1 | | |
| **TOTAL** | **82** | | |

---

## Notes
- Some features may be limited while verification is pending
- Test with real bookings to verify full flow
- Check that public profile reflects changes

### Issues Found:
1.
2.
3.

### Tester Information:
- **Name**:
- **Date**:
- **Browser/Device**:
