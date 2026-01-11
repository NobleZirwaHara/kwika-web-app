# Guest Module - User Acceptance Testing

## Overview
This document contains test cases for features available to users who are not logged in (guests). Guests can browse the platform, search for services, view providers, manage a shopping cart, and create wishlists without an account.

## Prerequisites
- Access to the Kwika Events website
- A web browser (Chrome, Firefox, Safari, or Edge recommended)
- No account login required for these tests

---

## Test Cases

### 1. Homepage

#### TC-G001: View Homepage
- **Description**: Verify the homepage loads correctly with all sections visible
- **Steps**:
  1. Open your web browser
  2. Go to the Kwika Events homepage (https://kwika.events)
  3. Wait for the page to fully load
- **Expected Result**:
  - The page loads without errors
  - You can see the Kwika logo at the top
  - Service categories are displayed
  - Featured providers are shown
  - Search functionality is visible
- **Pass/Fail**: [ ]

#### TC-G002: View Service Categories
- **Description**: Verify all service categories are displayed and clickable
- **Steps**:
  1. Go to the homepage
  2. Look for the categories section
  3. Count the number of categories shown
  4. Click on one category (e.g., "Catering" or "Venues")
- **Expected Result**:
  - Multiple categories are displayed with icons
  - Clicking a category takes you to a filtered listing page showing only that category
- **Pass/Fail**: [ ]

#### TC-G003: View Featured Providers
- **Description**: Verify featured providers are displayed on homepage
- **Steps**:
  1. Go to the homepage
  2. Scroll down to find the featured providers section
  3. Review the provider cards displayed
- **Expected Result**:
  - Provider cards show business name, rating, and image
  - Each card is clickable
- **Pass/Fail**: [ ]

---

### 2. Search Functionality

#### TC-G004: Basic Text Search
- **Description**: Verify users can search for services using keywords
- **Steps**:
  1. Go to the homepage or search page
  2. Find the search box
  3. Type a keyword (e.g., "wedding photographer")
  4. Press Enter or click the search button
- **Expected Result**:
  - Search results page loads
  - Results shown are related to the search term
  - Number of results is displayed
- **Pass/Fail**: [ ]

#### TC-G005: Search with Filters
- **Description**: Verify users can apply filters to narrow down results
- **Steps**:
  1. Go to the search/listings page
  2. Apply a category filter (e.g., select "Photography")
  3. Apply a city filter (e.g., select "Lilongwe")
  4. Apply a rating filter (e.g., select "4+ stars")
  5. Apply a price range filter (if available)
- **Expected Result**:
  - Results update after each filter is applied
  - Only providers matching the filters are shown
  - Active filters are displayed as chips/tags
  - Number of results updates
- **Pass/Fail**: [ ]

#### TC-G006: Clear Filters
- **Description**: Verify users can clear applied filters
- **Steps**:
  1. Go to the search page with some filters applied
  2. Look for a "Clear All" or "Reset Filters" button
  3. Click on it
- **Expected Result**:
  - All filters are removed
  - Full unfiltered results are displayed
  - Filter chips/tags disappear
- **Pass/Fail**: [ ]

#### TC-G007: Remove Individual Filter
- **Description**: Verify users can remove a single filter
- **Steps**:
  1. Go to the search page
  2. Apply at least 2 filters
  3. Click the "X" on one filter chip to remove it
- **Expected Result**:
  - Only that specific filter is removed
  - Other filters remain active
  - Results update accordingly
- **Pass/Fail**: [ ]

#### TC-G008: Search Suggestions
- **Description**: Verify search suggestions appear while typing
- **Steps**:
  1. Go to the homepage
  2. Start typing in the search box (e.g., "cat")
  3. Wait for suggestions to appear
- **Expected Result**:
  - Dropdown appears with suggested searches
  - Suggestions are relevant to what you typed
  - Clicking a suggestion performs that search
- **Pass/Fail**: [ ]

---

### 3. View Modes

#### TC-G009: Switch to Grid View
- **Description**: Verify users can view results in grid format
- **Steps**:
  1. Go to the listings/search page
  2. Look for view mode toggle buttons (grid/list/map icons)
  3. Click the grid view icon
- **Expected Result**:
  - Results display as cards in a grid layout
  - Multiple cards shown per row on desktop
- **Pass/Fail**: [ ]

#### TC-G010: Switch to List View
- **Description**: Verify users can view results in list format
- **Steps**:
  1. Go to the listings/search page
  2. Click the list view icon
- **Expected Result**:
  - Results display as horizontal cards
  - One result per row
  - More details visible per item
- **Pass/Fail**: [ ]

#### TC-G011: Switch to Map View
- **Description**: Verify users can view results on a map
- **Steps**:
  1. Go to the listings/search page
  2. Click the map view icon
- **Expected Result**:
  - A map is displayed showing provider locations
  - Markers appear for each provider
  - Clicking a marker shows provider info in a popup
- **Pass/Fail**: [ ]

---

### 4. Provider Listings

#### TC-G012: View Provider List
- **Description**: Verify the providers listing page works correctly
- **Steps**:
  1. Click "Providers" in the navigation menu, or go to /providers
  2. Scroll through the list
- **Expected Result**:
  - Multiple providers are displayed
  - Each shows name, image, rating, and location
  - Pagination or "Load More" works for many results
- **Pass/Fail**: [ ]

#### TC-G013: View Provider Detail Page
- **Description**: Verify provider detail page shows all information
- **Steps**:
  1. From the providers list, click on a provider card
  2. Review all sections on the detail page
- **Expected Result**:
  - Provider name and logo displayed
  - Cover image shown
  - Description/about section visible
  - Services offered are listed
  - Contact information shown
  - Reviews displayed (if any)
  - Location shown (possibly on map)
  - Social media links (if available)
- **Pass/Fail**: [ ]

#### TC-G014: View Provider Services
- **Description**: Verify services section on provider page
- **Steps**:
  1. Go to a provider's detail page
  2. Scroll to the services section
  3. Click on a service to view details
- **Expected Result**:
  - Services are listed with name and price
  - Clicking a service shows more details
  - "Book Now" or similar button is visible
- **Pass/Fail**: [ ]

#### TC-G015: View Provider Reviews
- **Description**: Verify reviews are displayed on provider page
- **Steps**:
  1. Go to a provider's detail page
  2. Scroll to the reviews section
- **Expected Result**:
  - Reviews are displayed with star rating
  - Reviewer name and date shown
  - Review text is visible
  - Average rating is calculated and displayed
- **Pass/Fail**: [ ]

---

### 5. Service Listings

#### TC-G016: View Services List
- **Description**: Verify the services listing page works correctly
- **Steps**:
  1. Click "Services" in the navigation menu, or go to /services
  2. Scroll through the list
- **Expected Result**:
  - Services are displayed with name, price, and provider
  - Images are shown for each service
  - Filters are available
- **Pass/Fail**: [ ]

#### TC-G017: View Service Detail Page
- **Description**: Verify service detail page shows all information
- **Steps**:
  1. From the services list, click on a service
  2. Review the detail page
- **Expected Result**:
  - Service name and images displayed
  - Price clearly shown
  - Description visible
  - Provider information shown
  - "Book Now" button available
- **Pass/Fail**: [ ]

---

### 6. Products

#### TC-G018: View Products List
- **Description**: Verify the products page works correctly
- **Steps**:
  1. Click "Products" in the navigation menu, or go to /products
  2. Browse through the products
- **Expected Result**:
  - Products are displayed in a grid
  - Each shows name, price, and image
  - Filters are available
- **Pass/Fail**: [ ]

#### TC-G019: View Product Detail Page
- **Description**: Verify product detail page shows all information
- **Steps**:
  1. From the products list, click on a product
  2. Review the detail page
- **Expected Result**:
  - Product name and images displayed
  - Price clearly shown
  - Description visible
  - "Add to Cart" button available
  - Provider/seller information shown
- **Pass/Fail**: [ ]

---

### 7. Events & Ticketing

#### TC-G020: View Events List
- **Description**: Verify the events/ticketing page works correctly
- **Steps**:
  1. Click "Events" or "Ticketing" in the navigation menu
  2. Browse through the events
- **Expected Result**:
  - Events are displayed with images
  - Each shows event name, date, and location
  - Ticket prices are visible
- **Pass/Fail**: [ ]

#### TC-G021: View Event Detail Page
- **Description**: Verify event detail page shows all information
- **Steps**:
  1. From the events list, click on an event
  2. Review the detail page
- **Expected Result**:
  - Event name, date, and time displayed
  - Venue/location shown
  - Description visible
  - Ticket types and prices listed
  - "Buy Tickets" button available
- **Pass/Fail**: [ ]

#### TC-G022: View Event Organizer Page
- **Description**: Verify event organizer profile works
- **Steps**:
  1. From an event page, click on the organizer name
  2. Review the organizer page
- **Expected Result**:
  - Organizer name and details shown
  - List of their events displayed
- **Pass/Fail**: [ ]

---

### 8. Shopping Cart

#### TC-G023: Add Item to Cart
- **Description**: Verify guests can add items to the shopping cart
- **Steps**:
  1. Go to a product or service detail page
  2. Click "Add to Cart" button
  3. Check the cart icon in the header
- **Expected Result**:
  - Item is added to cart
  - Cart icon shows number of items
  - Success message appears
- **Pass/Fail**: [ ]

#### TC-G024: View Cart
- **Description**: Verify guests can view their cart
- **Steps**:
  1. Add at least one item to the cart
  2. Click the cart icon in the header
  3. Or go to /cart directly
- **Expected Result**:
  - Cart page shows all added items
  - Item names, quantities, and prices displayed
  - Subtotal calculated correctly
- **Pass/Fail**: [ ]

#### TC-G025: Update Cart Item Quantity
- **Description**: Verify guests can change quantities in cart
- **Steps**:
  1. Go to the cart page
  2. Find the quantity selector for an item
  3. Increase or decrease the quantity
- **Expected Result**:
  - Quantity updates
  - Item total and cart subtotal recalculate
- **Pass/Fail**: [ ]

#### TC-G026: Remove Item from Cart
- **Description**: Verify guests can remove items from cart
- **Steps**:
  1. Go to the cart page
  2. Click the remove/delete button for an item
- **Expected Result**:
  - Item is removed from cart
  - Cart updates immediately
  - If cart is empty, a message is shown
- **Pass/Fail**: [ ]

#### TC-G027: Clear Entire Cart
- **Description**: Verify guests can clear all cart items
- **Steps**:
  1. Add multiple items to cart
  2. Go to cart page
  3. Click "Clear Cart" or similar button
- **Expected Result**:
  - All items removed
  - Cart shows empty state
- **Pass/Fail**: [ ]

#### TC-G028: Cart Persistence
- **Description**: Verify cart items persist across page refreshes
- **Steps**:
  1. Add items to cart
  2. Refresh the page (F5 or Ctrl+R)
  3. Check the cart
- **Expected Result**:
  - Cart items are still there
  - Quantities remain the same
- **Pass/Fail**: [ ]

---

### 9. Wishlist (Guest Mode)

#### TC-G029: Add Provider to Wishlist
- **Description**: Verify guests can add providers to wishlist
- **Steps**:
  1. Go to a provider's page or listing
  2. Click the heart icon or "Add to Wishlist" button
- **Expected Result**:
  - Heart icon fills in or changes color
  - Item added to wishlist
  - Prompt may appear to create or select a wishlist
- **Pass/Fail**: [ ]

#### TC-G030: Add Service to Wishlist
- **Description**: Verify guests can add services to wishlist
- **Steps**:
  1. Go to a service detail page
  2. Click the heart icon or "Add to Wishlist" button
- **Expected Result**:
  - Heart icon fills in or changes color
  - Service added to wishlist
- **Pass/Fail**: [ ]

#### TC-G031: View Wishlist
- **Description**: Verify guests can view their wishlist
- **Steps**:
  1. Add items to wishlist
  2. Click "Wishlist" in the navigation or go to /wishlist
- **Expected Result**:
  - Wishlist page loads
  - Added items are displayed
  - Items show name, image, and price
- **Pass/Fail**: [ ]

#### TC-G032: Remove Item from Wishlist
- **Description**: Verify guests can remove items from wishlist
- **Steps**:
  1. Go to the wishlist page
  2. Click remove/delete on an item
- **Expected Result**:
  - Item is removed from wishlist
  - Page updates immediately
- **Pass/Fail**: [ ]

#### TC-G033: Create New Wishlist
- **Description**: Verify guests can create multiple wishlists
- **Steps**:
  1. Go to the wishlist page
  2. Click "Create New Wishlist" or similar
  3. Enter a name for the wishlist
  4. Save the wishlist
- **Expected Result**:
  - New wishlist is created
  - Wishlist appears in the list
  - Can switch between wishlists
- **Pass/Fail**: [ ]

---

### 10. Map View

#### TC-G034: View Map with Markers
- **Description**: Verify map displays provider locations correctly
- **Steps**:
  1. Go to listings page
  2. Switch to map view
  3. Look at the map
- **Expected Result**:
  - Map loads with provider markers
  - Map is centered on relevant area (e.g., Lilongwe)
  - Zoom controls work
- **Pass/Fail**: [ ]

#### TC-G035: Click Map Marker
- **Description**: Verify clicking a map marker shows provider info
- **Steps**:
  1. In map view, click on a provider marker
  2. Review the popup that appears
- **Expected Result**:
  - Popup shows provider name
  - Rating and image displayed
  - Link to view full profile
- **Pass/Fail**: [ ]

#### TC-G036: Map Zoom and Pan
- **Description**: Verify map navigation works
- **Steps**:
  1. In map view, use zoom in/out buttons
  2. Click and drag to pan the map
  3. Use mouse scroll to zoom (if supported)
- **Expected Result**:
  - Map zooms in and out smoothly
  - Panning works to explore different areas
  - Markers remain visible and clickable
- **Pass/Fail**: [ ]

---

### 11. Navigation & Footer

#### TC-G037: Main Navigation Menu
- **Description**: Verify all navigation links work
- **Steps**:
  1. Click on each item in the main navigation menu
  2. Verify each page loads correctly
- **Expected Result**:
  - Home link goes to homepage
  - Services link goes to services page
  - Providers link goes to providers page
  - Products link goes to products page
  - Events link goes to events page
- **Pass/Fail**: [ ]

#### TC-G038: Mobile Navigation Menu
- **Description**: Verify mobile menu works on small screens
- **Steps**:
  1. Resize browser to mobile width (or use phone)
  2. Look for hamburger menu icon
  3. Click to open menu
  4. Click on menu items
- **Expected Result**:
  - Hamburger icon visible on mobile
  - Menu opens when clicked
  - All navigation items accessible
  - Menu closes after selecting an item
- **Pass/Fail**: [ ]

#### TC-G039: Footer Links
- **Description**: Verify all footer links work
- **Steps**:
  1. Scroll to the bottom of any page
  2. Click on each link in the footer
- **Expected Result**:
  - All links are clickable
  - Pages load correctly
  - No broken links
- **Pass/Fail**: [ ]

#### TC-G040: Logo Home Link
- **Description**: Verify clicking the logo goes to homepage
- **Steps**:
  1. Go to any page other than home
  2. Click the Kwika logo in the header
- **Expected Result**:
  - You are taken to the homepage
- **Pass/Fail**: [ ]

---

### 12. Package Viewing

#### TC-G041: View Service Package
- **Description**: Verify service packages are displayed correctly
- **Steps**:
  1. Go to a provider page that offers packages
  2. Look for the packages section
  3. Click on a package to view details
- **Expected Result**:
  - Package name and price shown
  - List of included services displayed
  - "Book Package" button available
- **Pass/Fail**: [ ]

#### TC-G042: View Package Detail Page
- **Description**: Verify package detail page shows all information
- **Steps**:
  1. Click on a package from a provider page
  2. Or go directly to /packages/[slug]
- **Expected Result**:
  - Package name and description shown
  - All included services listed
  - Total price clearly displayed
  - Provider information visible
  - "Book Now" button available
- **Pass/Fail**: [ ]

---

### 13. Responsive Design

#### TC-G043: Desktop View
- **Description**: Verify site looks correct on desktop
- **Steps**:
  1. Open the site on a desktop computer
  2. Browse through different pages
- **Expected Result**:
  - Layout is properly sized
  - Navigation is horizontal
  - Multiple columns for listings
  - All elements properly aligned
- **Pass/Fail**: [ ]

#### TC-G044: Tablet View
- **Description**: Verify site looks correct on tablet
- **Steps**:
  1. Open the site on a tablet or resize browser to ~768px wide
  2. Browse through different pages
- **Expected Result**:
  - Layout adapts to medium screen
  - Elements properly sized
  - Navigation may be collapsed
  - Still usable and readable
- **Pass/Fail**: [ ]

#### TC-G045: Mobile View
- **Description**: Verify site looks correct on mobile
- **Steps**:
  1. Open the site on a mobile phone or resize browser to ~375px wide
  2. Browse through different pages
- **Expected Result**:
  - Layout is single column
  - Text is readable without zooming
  - Buttons are tappable size
  - No horizontal scrolling required
  - Mobile navigation menu works
- **Pass/Fail**: [ ]

---

## Test Summary

| Category | Total Tests | Passed | Failed |
|----------|-------------|--------|--------|
| Homepage | 3 | | |
| Search | 5 | | |
| View Modes | 3 | | |
| Provider Listings | 4 | | |
| Service Listings | 2 | | |
| Products | 2 | | |
| Events & Ticketing | 3 | | |
| Shopping Cart | 6 | | |
| Wishlist | 5 | | |
| Map View | 3 | | |
| Navigation & Footer | 4 | | |
| Package Viewing | 2 | | |
| Responsive Design | 3 | | |
| **TOTAL** | **45** | | |

---

## Notes
- Record any bugs or issues found during testing
- Include screenshots where helpful
- Note browser and device used for testing

### Issues Found:
1.
2.
3.

### Tester Information:
- **Name**:
- **Date**:
- **Browser/Device**:
