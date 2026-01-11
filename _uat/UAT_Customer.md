# Customer/User Module - User Acceptance Testing

## Overview
This document contains test cases for logged-in customers (users). Customers can view their dashboard, make bookings, manage wishlists, purchase event tickets, send messages to providers, and manage their profile.

## Prerequisites
- Access to the Kwika Events website
- A registered customer account (not a provider)
- At least one service provider with active services (for booking tests)
- At least one event with tickets available (for ticketing tests)

---

## Test Cases

### 1. Customer Dashboard

#### TC-C001: Access Dashboard
- **Description**: Verify customer can access their dashboard
- **Steps**:
  1. Log in as a customer
  2. Click on your name or "Dashboard" in the navigation
  3. Or go to /user/dashboard
- **Expected Result**:
  - Dashboard page loads
  - Welcome message with your name is shown
  - Stats cards are displayed
- **Pass/Fail**: [ ]

#### TC-C002: View Dashboard Stats
- **Description**: Verify dashboard shows correct statistics
- **Steps**:
  1. Go to your dashboard
  2. Look at the stats cards at the top
- **Expected Result**:
  - "Total Bookings" shows number of all your bookings
  - "Upcoming Events" shows number of scheduled bookings
  - "Wishlist Items" shows number of saved items
  - "Total Spent" shows total amount spent
- **Pass/Fail**: [ ]

#### TC-C003: View Upcoming Bookings on Dashboard
- **Description**: Verify upcoming bookings are displayed
- **Steps**:
  1. Go to your dashboard
  2. Look for the "Upcoming Bookings" section
- **Expected Result**:
  - If you have upcoming bookings, they are listed
  - Each shows service name, provider, date, and status
  - If no upcoming bookings, appropriate message shown
- **Pass/Fail**: [ ]

#### TC-C004: View Recent Bookings on Dashboard
- **Description**: Verify recent bookings are displayed
- **Steps**:
  1. Go to your dashboard
  2. Look for the "Recent Bookings" section
- **Expected Result**:
  - Recent bookings are listed
  - Each shows service name, provider, date, amount, and status
  - "View All" link goes to full bookings list
- **Pass/Fail**: [ ]

#### TC-C005: Quick Actions on Dashboard
- **Description**: Verify quick action buttons work
- **Steps**:
  1. Go to your dashboard
  2. Click "Browse Services" quick action
  3. Go back, click "View Wishlist" quick action
- **Expected Result**:
  - "Browse Services" takes you to the services/home page
  - "View Wishlist" takes you to your wishlist
- **Pass/Fail**: [ ]

---

### 2. Booking Creation - Single Service

#### TC-C006: Start Single Service Booking
- **Description**: Verify customer can start booking a single service
- **Steps**:
  1. Browse to a service detail page
  2. Click "Book Now" or "Book Service" button
- **Expected Result**:
  - Booking form or page loads
  - Service name and price are shown
  - Date/time selection available
- **Pass/Fail**: [ ]

#### TC-C007: Select Booking Date
- **Description**: Verify date selection works
- **Steps**:
  1. On the booking form, click on date picker
  2. Select a future date
- **Expected Result**:
  - Date picker opens
  - Past dates are disabled
  - Selected date is highlighted
  - Date is saved in the form
- **Pass/Fail**: [ ]

#### TC-C008: Select Booking Time
- **Description**: Verify time selection works
- **Steps**:
  1. After selecting a date
  2. Select start and end times
- **Expected Result**:
  - Available times are shown
  - Can select start and end time
  - Times are saved in the form
- **Pass/Fail**: [ ]

#### TC-C009: Enter Event Details
- **Description**: Verify event details can be entered
- **Steps**:
  1. On booking form, enter event location
  2. Enter number of attendees
  3. Enter any special requests
- **Expected Result**:
  - All fields accept input
  - Location can be typed or selected on map
  - Special requests text area works
- **Pass/Fail**: [ ]

#### TC-C010: Review Booking Summary
- **Description**: Verify booking summary shows correct info
- **Steps**:
  1. Fill in all booking details
  2. Look at the booking summary
- **Expected Result**:
  - Service name and price shown
  - Date and time displayed
  - Location shown
  - Total amount calculated correctly
- **Pass/Fail**: [ ]

#### TC-C011: Submit Single Service Booking
- **Description**: Verify booking can be submitted
- **Steps**:
  1. Complete all booking fields
  2. Click "Confirm Booking" or "Proceed to Payment"
- **Expected Result**:
  - Booking is created
  - Redirected to payment selection page
  - Booking number is generated
- **Pass/Fail**: [ ]

---

### 3. Booking Creation - Package Booking

#### TC-C012: Start Package Booking
- **Description**: Verify customer can book a service package
- **Steps**:
  1. Go to a provider page that offers packages
  2. Click on a package
  3. Click "Book Package" button
- **Expected Result**:
  - Booking form loads for the package
  - All included services are listed
  - Package price is shown
- **Pass/Fail**: [ ]

#### TC-C013: Complete Package Booking
- **Description**: Verify package booking can be completed
- **Steps**:
  1. Start a package booking
  2. Fill in date, time, location, and attendees
  3. Submit the booking
- **Expected Result**:
  - Booking created for entire package
  - All services included in one booking
  - Redirected to payment
- **Pass/Fail**: [ ]

---

### 4. Booking Creation - Custom Package

#### TC-C014: Start Custom Package Booking
- **Description**: Verify customer can create custom booking from wishlist
- **Steps**:
  1. Add multiple services/packages to a wishlist
  2. Go to your wishlist
  3. Click "Book All" or "Create Custom Package"
- **Expected Result**:
  - Custom booking form loads
  - All wishlist items are included
  - Combined price shown
- **Pass/Fail**: [ ]

#### TC-C015: Complete Custom Package Booking
- **Description**: Verify custom package can be booked
- **Steps**:
  1. Start custom package booking
  2. Fill in event details (date, time, location)
  3. Submit the booking
- **Expected Result**:
  - Single booking created with multiple services
  - All items listed in the booking
  - Redirected to payment
- **Pass/Fail**: [ ]

---

### 5. Payment Flow

#### TC-C016: View Payment Options
- **Description**: Verify payment options are displayed
- **Steps**:
  1. After creating a booking, arrive at payment selection
  2. Review available payment methods
- **Expected Result**:
  - Payment selection page loads
  - Multiple payment options shown (Bank Transfer, Mobile Money, Card)
  - Booking summary visible
- **Pass/Fail**: [ ]

#### TC-C017: Select Bank Transfer Payment
- **Description**: Verify bank transfer payment works
- **Steps**:
  1. On payment selection, click "Bank Transfer"
  2. Review bank details provided
  3. Upload proof of payment (if required)
  4. Submit
- **Expected Result**:
  - Bank details are displayed (account number, bank name)
  - Can upload payment receipt image
  - Booking status changes to "Awaiting Payment Verification"
- **Pass/Fail**: [ ]

#### TC-C018: Select Mobile Money Payment
- **Description**: Verify mobile money payment works
- **Steps**:
  1. On payment selection, click "Mobile Money"
  2. Enter phone number
  3. Follow prompts to complete payment
- **Expected Result**:
  - Mobile money form loads
  - Phone number can be entered
  - Payment instructions shown
  - Confirmation received after payment
- **Pass/Fail**: [ ]

#### TC-C019: Select Card Payment
- **Description**: Verify card payment works
- **Steps**:
  1. On payment selection, click "Card Payment"
  2. Enter card details (or use test card)
  3. Submit payment
- **Expected Result**:
  - Card payment form loads
  - Can enter card number, expiry, CVV
  - Payment processes
  - Confirmation page shown
- **Pass/Fail**: [ ]

#### TC-C020: View Booking Confirmation
- **Description**: Verify confirmation page after payment
- **Steps**:
  1. Complete any payment method
  2. View the confirmation page
- **Expected Result**:
  - Confirmation page loads
  - Booking number displayed
  - "Thank you" message shown
  - Booking details summarized
  - Link to view booking
- **Pass/Fail**: [ ]

---

### 6. Booking Management

#### TC-C021: View All Bookings
- **Description**: Verify customer can see all their bookings
- **Steps**:
  1. Go to /user/bookings or click "Bookings" in dashboard
  2. Review the bookings list
- **Expected Result**:
  - All bookings are listed
  - Each shows service/package name, date, status, amount
  - Can filter by status (All, Upcoming, Past, Cancelled)
- **Pass/Fail**: [ ]

#### TC-C022: View Booking Details
- **Description**: Verify booking detail page shows all info
- **Steps**:
  1. From bookings list, click on a booking
  2. Review the detail page
- **Expected Result**:
  - Booking number shown
  - Service/package details displayed
  - Date, time, location shown
  - Provider information visible
  - Payment status shown
  - Status history (if available)
- **Pass/Fail**: [ ]

#### TC-C023: Cancel a Booking
- **Description**: Verify customer can cancel a booking
- **Steps**:
  1. Go to an upcoming booking detail page
  2. Click "Cancel Booking" button
  3. Confirm cancellation
- **Expected Result**:
  - Confirmation dialog appears
  - After confirming, booking status changes to "Cancelled"
  - Success message shown
  - Booking no longer in upcoming list
- **Pass/Fail**: [ ]

#### TC-C024: Cannot Cancel Completed Booking
- **Description**: Verify completed bookings cannot be cancelled
- **Steps**:
  1. Find a booking with "Completed" status
  2. Look for cancel option
- **Expected Result**:
  - Cancel button is not shown or is disabled
  - Cannot cancel completed bookings
- **Pass/Fail**: [ ]

---

### 7. Wishlist Management

#### TC-C025: View Wishlists
- **Description**: Verify customer can view their wishlists
- **Steps**:
  1. Click "Wishlist" in the navigation
  2. Or go to /wishlist
- **Expected Result**:
  - Wishlist page loads
  - Shows all your wishlists
  - Default wishlist is visible
- **Pass/Fail**: [ ]

#### TC-C026: Create New Wishlist
- **Description**: Verify customer can create multiple wishlists
- **Steps**:
  1. On wishlist page, click "Create New Wishlist"
  2. Enter a name (e.g., "Wedding Planning")
  3. Save the wishlist
- **Expected Result**:
  - New wishlist is created
  - Appears in your wishlists list
  - Can switch between wishlists
- **Pass/Fail**: [ ]

#### TC-C027: Add Provider to Wishlist
- **Description**: Verify providers can be added to wishlist
- **Steps**:
  1. Go to a provider page
  2. Click the heart icon or "Add to Wishlist"
  3. Select which wishlist (if you have multiple)
- **Expected Result**:
  - Provider is added to wishlist
  - Heart icon fills in or changes color
  - Success message shown
- **Pass/Fail**: [ ]

#### TC-C028: Add Service to Wishlist
- **Description**: Verify services can be added to wishlist
- **Steps**:
  1. Go to a service detail page
  2. Click the heart icon or "Add to Wishlist"
- **Expected Result**:
  - Service is added to wishlist
  - Icon indicates it's saved
- **Pass/Fail**: [ ]

#### TC-C029: Add Package to Wishlist
- **Description**: Verify packages can be added to wishlist
- **Steps**:
  1. Go to a package detail page
  2. Click the heart icon or "Add to Wishlist"
- **Expected Result**:
  - Package is added to wishlist
  - Icon indicates it's saved
- **Pass/Fail**: [ ]

#### TC-C030: View Wishlist Details
- **Description**: Verify wishlist contents are displayed
- **Steps**:
  1. Go to a wishlist
  2. Click on a wishlist name to view contents
- **Expected Result**:
  - All items in the wishlist are shown
  - Each item shows name, image, price
  - Total value may be calculated
- **Pass/Fail**: [ ]

#### TC-C031: Remove Item from Wishlist
- **Description**: Verify items can be removed from wishlist
- **Steps**:
  1. Go to a wishlist with items
  2. Click the remove button on an item
- **Expected Result**:
  - Item is removed from wishlist
  - Page updates immediately
  - Item no longer shows as wishlisted
- **Pass/Fail**: [ ]

#### TC-C032: Move Item Between Wishlists
- **Description**: Verify items can be moved between wishlists
- **Steps**:
  1. Have multiple wishlists with items
  2. On a wishlist item, click "Move to..."
  3. Select another wishlist
- **Expected Result**:
  - Item moves to selected wishlist
  - No longer in original wishlist
- **Pass/Fail**: [ ]

#### TC-C033: Delete Wishlist
- **Description**: Verify wishlists can be deleted
- **Steps**:
  1. Go to wishlist page
  2. Click delete on a wishlist (not the default one)
  3. Confirm deletion
- **Expected Result**:
  - Wishlist is deleted
  - Items in it are also removed
  - Cannot delete default wishlist
- **Pass/Fail**: [ ]

#### TC-C034: Book from Wishlist
- **Description**: Verify booking can be started from wishlist
- **Steps**:
  1. Go to a wishlist with items
  2. Click "Book" on a single item
  3. Or click "Book All" for all items
- **Expected Result**:
  - Booking form loads with item(s)
  - Can proceed with booking process
- **Pass/Fail**: [ ]

---

### 8. Event Tickets

#### TC-C035: Browse Events
- **Description**: Verify customer can browse available events
- **Steps**:
  1. Click "Events" or "Ticketing" in navigation
  2. Browse through events
- **Expected Result**:
  - Events are listed with images
  - Each shows name, date, location, price range
  - Filters available
- **Pass/Fail**: [ ]

#### TC-C036: View Event Details
- **Description**: Verify event detail page works
- **Steps**:
  1. Click on an event
  2. Review the event page
- **Expected Result**:
  - Event name, date, time shown
  - Venue and location displayed
  - Description visible
  - Ticket types and prices listed
- **Pass/Fail**: [ ]

#### TC-C037: Select Ticket Type and Quantity
- **Description**: Verify ticket selection works
- **Steps**:
  1. On event page, choose a ticket type
  2. Select quantity
  3. Click "Buy Tickets" or "Add to Cart"
- **Expected Result**:
  - Ticket type can be selected
  - Quantity can be adjusted
  - Total price updates
  - Can proceed to checkout
- **Pass/Fail**: [ ]

#### TC-C038: Complete Ticket Purchase
- **Description**: Verify ticket checkout works
- **Steps**:
  1. Select tickets for an event
  2. Proceed to checkout
  3. Complete payment
- **Expected Result**:
  - Checkout page shows ticket details
  - Payment can be completed
  - Confirmation page shown
  - Order number generated
- **Pass/Fail**: [ ]

#### TC-C039: View My Tickets
- **Description**: Verify customer can see purchased tickets
- **Steps**:
  1. After purchasing tickets
  2. Go to "My Tickets" or /my-tickets
- **Expected Result**:
  - List of all purchased tickets shown
  - Each shows event name, date, ticket type
  - Order status visible
- **Pass/Fail**: [ ]

#### TC-C040: Download Ticket
- **Description**: Verify tickets can be downloaded
- **Steps**:
  1. Go to My Tickets
  2. Find a confirmed ticket
  3. Click "Download" or download icon
- **Expected Result**:
  - Ticket PDF downloads
  - Includes QR code or barcode
  - Event details on ticket
- **Pass/Fail**: [ ]

---

### 9. Messages

#### TC-C041: Access Messages
- **Description**: Verify customer can access messages
- **Steps**:
  1. Click "Messages" in the navigation or dashboard
  2. Or go to /user/messages
- **Expected Result**:
  - Messages page loads
  - Conversation list shown (if any)
  - Option to start new conversation
- **Pass/Fail**: [ ]

#### TC-C042: View Conversation
- **Description**: Verify conversations can be viewed
- **Steps**:
  1. Click on an existing conversation
  2. View the messages
- **Expected Result**:
  - Messages are displayed in order
  - Your messages and provider's messages distinguished
  - Timestamps shown
- **Pass/Fail**: [ ]

#### TC-C043: Send Message
- **Description**: Verify messages can be sent
- **Steps**:
  1. Open a conversation
  2. Type a message in the input field
  3. Click send or press Enter
- **Expected Result**:
  - Message appears in conversation
  - Timestamp shows current time
  - Input field clears
- **Pass/Fail**: [ ]

#### TC-C044: Start New Conversation
- **Description**: Verify customer can message a provider
- **Steps**:
  1. Go to a provider's page
  2. Click "Contact" or "Send Message"
  3. Type and send a message
- **Expected Result**:
  - New conversation starts
  - Message is sent
  - Conversation appears in messages list
- **Pass/Fail**: [ ]

---

### 10. Profile Management

#### TC-C045: Access Profile Page
- **Description**: Verify profile page is accessible
- **Steps**:
  1. Click on your name or profile icon
  2. Select "Profile" or go to /user/profile
- **Expected Result**:
  - Profile page loads
  - Current information displayed
  - Edit options available
- **Pass/Fail**: [ ]

#### TC-C046: Update Personal Information
- **Description**: Verify profile info can be updated
- **Steps**:
  1. On profile page, edit your name
  2. Edit your phone number
  3. Save changes
- **Expected Result**:
  - Fields are editable
  - Save button submits changes
  - Success message shown
  - Changes persist on refresh
- **Pass/Fail**: [ ]

#### TC-C047: Change Password
- **Description**: Verify password can be changed
- **Steps**:
  1. On profile page, find password section
  2. Enter current password
  3. Enter new password
  4. Confirm new password
  5. Save
- **Expected Result**:
  - Password fields work
  - Success message after change
  - Can log in with new password
  - Old password no longer works
- **Pass/Fail**: [ ]

#### TC-C048: Update Notification Preferences
- **Description**: Verify notification settings work
- **Steps**:
  1. On profile page, find notification settings
  2. Toggle email notifications on/off
  3. Toggle SMS notifications on/off
  4. Save changes
- **Expected Result**:
  - Toggle switches work
  - Settings save successfully
  - Preferences persist on refresh
- **Pass/Fail**: [ ]

---

### 11. Reviews

#### TC-C049: Leave Review After Completed Booking
- **Description**: Verify customer can review completed bookings
- **Steps**:
  1. Find a booking with "Completed" status
  2. Click "Leave Review" or review option
  3. Select star rating (1-5)
  4. Write review text
  5. Submit review
- **Expected Result**:
  - Review form is shown
  - Star rating is selectable
  - Text area accepts review content
  - Review is submitted
  - Success message shown
- **Pass/Fail**: [ ]

#### TC-C050: Cannot Review Incomplete Booking
- **Description**: Verify reviews only allowed for completed bookings
- **Steps**:
  1. Find a booking with "Pending" or "Confirmed" status
  2. Look for review option
- **Expected Result**:
  - No review option available
  - Or message says "Review available after completion"
- **Pass/Fail**: [ ]

#### TC-C051: Cannot Review Twice
- **Description**: Verify same booking cannot be reviewed twice
- **Steps**:
  1. Find a booking you've already reviewed
  2. Look for review option
- **Expected Result**:
  - Review option is hidden or shows "Reviewed"
  - Your existing review is visible
  - Cannot submit another review
- **Pass/Fail**: [ ]

---

### 12. Upload Inspiration Images (Booking)

#### TC-C052: Upload Inspiration Images During Booking
- **Description**: Verify images can be added to booking
- **Steps**:
  1. During booking creation, find inspiration images section
  2. Upload one or more images
- **Expected Result**:
  - Image upload works
  - Preview of uploaded images shown
  - Images attached to booking
- **Pass/Fail**: [ ]

#### TC-C053: View Inspiration Images on Booking
- **Description**: Verify images are visible on booking
- **Steps**:
  1. View a booking that has inspiration images
  2. Look for the images section
- **Expected Result**:
  - Uploaded images are displayed
  - Can view/enlarge images
- **Pass/Fail**: [ ]

---

## Test Summary

| Category | Total Tests | Passed | Failed |
|----------|-------------|--------|--------|
| Customer Dashboard | 5 | | |
| Single Service Booking | 6 | | |
| Package Booking | 2 | | |
| Custom Package Booking | 2 | | |
| Payment Flow | 5 | | |
| Booking Management | 4 | | |
| Wishlist Management | 10 | | |
| Event Tickets | 6 | | |
| Messages | 4 | | |
| Profile Management | 4 | | |
| Reviews | 3 | | |
| Inspiration Images | 2 | | |
| **TOTAL** | **53** | | |

---

## Notes
- Test with both new bookings and existing data
- Verify all payment methods if possible
- Check email notifications are sent (if configured)

### Issues Found:
1.
2.
3.

### Tester Information:
- **Name**:
- **Date**:
- **Browser/Device**:
