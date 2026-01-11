# Admin Module - User Acceptance Testing

## Overview
This document contains test cases for platform administrators. Admins can manage the entire platform including users, providers, services, categories, bookings, payments, reviews, events, and system settings.

## Prerequisites
- Access to the Kwika Events website
- An admin account (super admin or appropriate admin role)
- Test data: some users, providers, bookings, and reviews in the system

---

## Test Cases

### 1. Admin Dashboard

#### TC-A001: Access Admin Dashboard
- **Description**: Verify admin can access the dashboard
- **Steps**:
  1. Log in with admin credentials
  2. You should be redirected to admin dashboard
  3. Or go to /admin/dashboard
- **Expected Result**:
  - Admin dashboard loads
  - "Admin Dashboard" title shown
  - Key metrics displayed
- **Pass/Fail**: [ ]

#### TC-A002: View Key Metrics
- **Description**: Verify dashboard statistics are displayed
- **Steps**:
  1. Go to admin dashboard
  2. Review the stats cards
- **Expected Result**:
  - "Total Users" count shown
  - "Service Providers" count shown
  - "Pending Verifications" count shown (highlighted if > 0)
  - "Total Revenue" shown
  - "Total Bookings" count shown
  - "Pending Reviews" count shown
  - "Active Services" count shown
- **Pass/Fail**: [ ]

#### TC-A003: View Revenue Trend Chart
- **Description**: Verify revenue chart works
- **Steps**:
  1. On dashboard, look at "Revenue Trend" chart
  2. Hover over data points
- **Expected Result**:
  - Line chart shows last 30 days revenue
  - Hover shows exact values
- **Pass/Fail**: [ ]

#### TC-A004: View User Growth Chart
- **Description**: Verify user growth chart works
- **Steps**:
  1. Look at "User Growth" chart
- **Expected Result**:
  - Bar chart shows new user signups
  - Last 30 days displayed
- **Pass/Fail**: [ ]

#### TC-A005: View Booking Status Chart
- **Description**: Verify booking distribution chart
- **Steps**:
  1. Look at "Booking Status Distribution" pie chart
- **Expected Result**:
  - Pie chart shows booking breakdown
  - Different colors for each status
  - Legend shows status names
- **Pass/Fail**: [ ]

#### TC-A006: View Top Providers
- **Description**: Verify top providers section works
- **Steps**:
  1. Look at "Top Providers" section
- **Expected Result**:
  - Lists top providers by revenue
  - Shows provider name and revenue amount
  - Ranked by performance
- **Pass/Fail**: [ ]

#### TC-A007: View Pending Verifications Alert
- **Description**: Verify pending verifications alert works
- **Steps**:
  1. If there are pending verifications, look for the alert
  2. Click "Review All"
- **Expected Result**:
  - Alert shows pending providers
  - Shows waiting time for each
  - Link goes to verification queue
- **Pass/Fail**: [ ]

#### TC-A008: View Recent Users
- **Description**: Verify recent users section
- **Steps**:
  1. Look at "Recent Users" section
  2. Click "View All"
- **Expected Result**:
  - Shows recently registered users
  - Each shows name, email, role, date
  - Link goes to users management
- **Pass/Fail**: [ ]

#### TC-A009: View Recent Payments
- **Description**: Verify recent payments section
- **Steps**:
  1. Look at "Recent Payments" section
- **Expected Result**:
  - Shows recent payment transactions
  - Shows customer, service, amount, status
- **Pass/Fail**: [ ]

---

### 2. Verification Queue

#### TC-A010: Access Verification Queue
- **Description**: Verify verification queue page works
- **Steps**:
  1. Click "Verification Queue" in admin menu
  2. Or go to /admin/verification-queue
- **Expected Result**:
  - Queue page loads
  - Pending providers listed
  - Shows business name, owner, date applied
- **Pass/Fail**: [ ]

#### TC-A011: View Provider Details
- **Description**: Verify provider details can be viewed
- **Steps**:
  1. Click on a pending provider
  2. Or click "Review" button
- **Expected Result**:
  - Detail page loads
  - All business information shown
  - Personal details of owner visible
  - Uploaded documents/images shown
- **Pass/Fail**: [ ]

#### TC-A012: Approve Provider
- **Description**: Verify provider can be approved
- **Steps**:
  1. View a pending provider
  2. Review their information
  3. Click "Approve"
  4. Confirm approval
- **Expected Result**:
  - Status changes to "Approved"
  - Provider removed from queue
  - Provider receives notification
  - Provider profile becomes public
- **Pass/Fail**: [ ]

#### TC-A013: Reject Provider
- **Description**: Verify provider can be rejected
- **Steps**:
  1. View a pending provider
  2. Click "Reject"
  3. Enter rejection reason
  4. Confirm
- **Expected Result**:
  - Status changes to "Rejected"
  - Removed from queue
  - Provider notified with reason
- **Pass/Fail**: [ ]

#### TC-A014: Request Changes
- **Description**: Verify admin can request changes
- **Steps**:
  1. View a pending provider
  2. Click "Request Changes"
  3. Enter what needs to be changed
  4. Submit
- **Expected Result**:
  - Provider notified of required changes
  - Status may change to "Changes Requested"
  - Provider can update and resubmit
- **Pass/Fail**: [ ]

#### TC-A015: Toggle Featured Status
- **Description**: Verify featured toggle works
- **Steps**:
  1. View an approved provider
  2. Toggle "Featured" on
  3. Toggle it off
- **Expected Result**:
  - Featured status changes
  - Featured providers appear in featured section on homepage
- **Pass/Fail**: [ ]

#### TC-A016: Toggle Active Status
- **Description**: Verify active toggle works
- **Steps**:
  1. View a provider
  2. Toggle "Active" off
  3. Toggle back on
- **Expected Result**:
  - Inactive providers hidden from public
  - Can reactivate anytime
- **Pass/Fail**: [ ]

---

### 3. User Management

#### TC-A017: Access Users Page
- **Description**: Verify users management page works
- **Steps**:
  1. Click "Users" in admin menu
  2. Or go to /admin/users
- **Expected Result**:
  - Users page loads
  - All users listed
  - Shows name, email, role, status
- **Pass/Fail**: [ ]

#### TC-A018: Search Users
- **Description**: Verify user search works
- **Steps**:
  1. Enter a name or email in search
  2. Press Enter or click search
- **Expected Result**:
  - Results filtered to matching users
  - Can clear search to see all
- **Pass/Fail**: [ ]

#### TC-A019: Filter Users by Role
- **Description**: Verify role filter works
- **Steps**:
  1. Select "Customer" from role filter
  2. Select "Provider" from role filter
- **Expected Result**:
  - List shows only selected role
  - Count updates accordingly
- **Pass/Fail**: [ ]

#### TC-A020: Edit User
- **Description**: Verify user can be edited
- **Steps**:
  1. Click edit on a user
  2. Change user name
  3. Update phone number
  4. Save
- **Expected Result**:
  - Edit form loads current data
  - Changes save successfully
  - Updated info shown in list
- **Pass/Fail**: [ ]

#### TC-A021: Verify User
- **Description**: Verify user verification works
- **Steps**:
  1. Find an unverified user
  2. Click "Verify" button
- **Expected Result**:
  - User is marked as verified
  - Verified badge appears
- **Pass/Fail**: [ ]

#### TC-A022: Unverify User
- **Description**: Verify user can be unverified
- **Steps**:
  1. Find a verified user
  2. Click "Unverify"
- **Expected Result**:
  - Verification removed
  - Badge disappears
- **Pass/Fail**: [ ]

#### TC-A023: Ban User
- **Description**: Verify user banning works
- **Steps**:
  1. Click "Ban" on a user
  2. Enter ban reason (if required)
  3. Confirm
- **Expected Result**:
  - User is banned
  - Cannot log in
  - Status shows "Banned"
- **Pass/Fail**: [ ]

#### TC-A024: Unban User
- **Description**: Verify user can be unbanned
- **Steps**:
  1. Find a banned user
  2. Click "Unban"
- **Expected Result**:
  - Ban is removed
  - User can log in again
- **Pass/Fail**: [ ]

#### TC-A025: Reset User Password
- **Description**: Verify password reset works
- **Steps**:
  1. Click "Reset Password" on a user
  2. Confirm action
- **Expected Result**:
  - Password reset email sent to user
  - Or temporary password shown
- **Pass/Fail**: [ ]

#### TC-A026: Delete User
- **Description**: Verify user deletion works
- **Steps**:
  1. Click delete on a user
  2. Confirm deletion
- **Expected Result**:
  - User is removed (or soft deleted)
  - No longer appears in list
  - Their data handled appropriately
- **Pass/Fail**: [ ]

---

### 4. Service Provider Management

#### TC-A027: Access Service Providers Page
- **Description**: Verify providers page works
- **Steps**:
  1. Click "Service Providers" in admin menu
  2. Or go to /admin/service-providers
- **Expected Result**:
  - Providers page loads
  - All providers listed
  - Shows name, owner, status, rating
- **Pass/Fail**: [ ]

#### TC-A028: View Provider Details
- **Description**: Verify provider details page
- **Steps**:
  1. Click on a provider to view details
- **Expected Result**:
  - Full provider information shown
  - Services listed
  - Reviews visible
  - Booking history available
- **Pass/Fail**: [ ]

#### TC-A029: Edit Provider
- **Description**: Verify provider can be edited
- **Steps**:
  1. Click edit on a provider
  2. Update business information
  3. Save
- **Expected Result**:
  - Changes save successfully
  - Public profile updates
- **Pass/Fail**: [ ]

#### TC-A030: Toggle Provider Active Status
- **Description**: Verify active toggle works
- **Steps**:
  1. Toggle a provider inactive
  2. Toggle back active
- **Expected Result**:
  - Inactive providers hidden from public
  - Can be reactivated
- **Pass/Fail**: [ ]

#### TC-A031: Toggle Provider Featured
- **Description**: Verify featured toggle works
- **Steps**:
  1. Toggle featured on
  2. Toggle off
- **Expected Result**:
  - Featured providers appear on homepage
- **Pass/Fail**: [ ]

#### TC-A032: Ban Provider
- **Description**: Verify provider can be banned
- **Steps**:
  1. Click "Ban" on a provider
  2. Enter reason
  3. Confirm
- **Expected Result**:
  - Provider is banned
  - Cannot access provider dashboard
  - Profile hidden from public
- **Pass/Fail**: [ ]

#### TC-A033: Unban Provider
- **Description**: Verify provider can be unbanned
- **Steps**:
  1. Find a banned provider
  2. Click "Unban"
- **Expected Result**:
  - Ban removed
  - Provider can access dashboard
- **Pass/Fail**: [ ]

#### TC-A034: Delete Provider
- **Description**: Verify provider deletion
- **Steps**:
  1. Click delete on a provider
  2. Confirm
- **Expected Result**:
  - Provider removed
  - User account may remain (as customer)
  - Services removed from platform
- **Pass/Fail**: [ ]

---

### 5. Services Management

#### TC-A035: Access Services Page
- **Description**: Verify services management works
- **Steps**:
  1. Click "Services" in admin menu
  2. Or go to /admin/services
- **Expected Result**:
  - All services listed
  - Shows name, provider, price, status
- **Pass/Fail**: [ ]

#### TC-A036: Edit Service
- **Description**: Verify service can be edited
- **Steps**:
  1. Click edit on a service
  2. Update details
  3. Save
- **Expected Result**:
  - Changes save successfully
- **Pass/Fail**: [ ]

#### TC-A037: Toggle Service Active
- **Description**: Verify service toggle works
- **Steps**:
  1. Toggle a service inactive
  2. Toggle back active
- **Expected Result**:
  - Inactive services hidden from public
- **Pass/Fail**: [ ]

#### TC-A038: Delete Service
- **Description**: Verify service deletion
- **Steps**:
  1. Click delete on a service
  2. Confirm
- **Expected Result**:
  - Service removed
  - Existing bookings handled appropriately
- **Pass/Fail**: [ ]

---

### 6. Products Management

#### TC-A039: Access Products Page
- **Description**: Verify products management works
- **Steps**:
  1. Click "Products" in admin menu
- **Expected Result**:
  - Products page loads
  - All products listed
- **Pass/Fail**: [ ]

#### TC-A040: Create Product
- **Description**: Verify admin can create products
- **Steps**:
  1. Click "Create Product"
  2. Fill details
  3. Save
- **Expected Result**:
  - Product created
  - Appears in list
- **Pass/Fail**: [ ]

#### TC-A041: Edit Product
- **Description**: Verify product editing
- **Steps**:
  1. Click edit
  2. Update details
  3. Save
- **Expected Result**:
  - Changes saved
- **Pass/Fail**: [ ]

#### TC-A042: Toggle Product Status
- **Description**: Verify status toggles work
- **Steps**:
  1. Toggle active status
  2. Toggle featured status
- **Expected Result**:
  - Statuses change appropriately
- **Pass/Fail**: [ ]

#### TC-A043: Delete Product
- **Description**: Verify product deletion
- **Steps**:
  1. Click delete
  2. Confirm
- **Expected Result**:
  - Product removed
- **Pass/Fail**: [ ]

---

### 7. Categories Management

#### TC-A044: Access Categories Page
- **Description**: Verify categories page works
- **Steps**:
  1. Click "Categories" in admin menu
- **Expected Result**:
  - Categories page loads
  - Hierarchical list shown (parents and children)
- **Pass/Fail**: [ ]

#### TC-A045: Create Category
- **Description**: Verify category creation
- **Steps**:
  1. Click "Create Category"
  2. Enter name
  3. Select parent (for subcategory) or leave empty (for parent)
  4. Add icon (optional)
  5. Save
- **Expected Result**:
  - Category created
  - Appears in correct position
- **Pass/Fail**: [ ]

#### TC-A046: Edit Category
- **Description**: Verify category editing
- **Steps**:
  1. Click edit on a category
  2. Update name
  3. Save
- **Expected Result**:
  - Changes saved
  - Name updates everywhere
- **Pass/Fail**: [ ]

#### TC-A047: Toggle Category Active
- **Description**: Verify category toggle
- **Steps**:
  1. Toggle a category inactive
- **Expected Result**:
  - Category hidden from public
  - Services in it may be affected
- **Pass/Fail**: [ ]

#### TC-A048: Reorder Categories
- **Description**: Verify category ordering
- **Steps**:
  1. Drag categories to reorder
  2. Or use order controls
- **Expected Result**:
  - Order changes
  - New order reflected on public pages
- **Pass/Fail**: [ ]

#### TC-A049: Delete Category
- **Description**: Verify category deletion
- **Steps**:
  1. Click delete on a category
  2. Confirm
- **Expected Result**:
  - Category removed
  - Services may need reassignment
  - Cannot delete if has services (or cascades)
- **Pass/Fail**: [ ]

---

### 8. Bookings Management

#### TC-A050: Access Bookings Page
- **Description**: Verify bookings management works
- **Steps**:
  1. Click "Bookings" in admin menu
- **Expected Result**:
  - All bookings listed
  - Shows ID, customer, provider, date, status
- **Pass/Fail**: [ ]

#### TC-A051: View Booking Details
- **Description**: Verify booking details page
- **Steps**:
  1. Click on a booking
- **Expected Result**:
  - Full booking details shown
  - Customer info visible
  - Provider info visible
  - Payment status shown
- **Pass/Fail**: [ ]

#### TC-A052: Update Booking Status
- **Description**: Verify status can be changed
- **Steps**:
  1. On booking detail, change status
  2. Select new status (Pending/Confirmed/Completed/Cancelled)
  3. Save
- **Expected Result**:
  - Status updates
  - Notifications may be sent
- **Pass/Fail**: [ ]

#### TC-A053: Update Payment Status
- **Description**: Verify payment status can be changed
- **Steps**:
  1. On booking detail, change payment status
  2. Save
- **Expected Result**:
  - Payment status updates
  - May affect booking status
- **Pass/Fail**: [ ]

#### TC-A054: Delete Booking
- **Description**: Verify booking deletion
- **Steps**:
  1. Click delete on a booking
  2. Confirm
- **Expected Result**:
  - Booking removed
  - Associated data handled
- **Pass/Fail**: [ ]

---

### 9. Payments Management

#### TC-A055: Access Payments Page
- **Description**: Verify payments page works
- **Steps**:
  1. Click "Payments" in admin menu
- **Expected Result**:
  - All payments listed
  - Shows amount, customer, status, method
- **Pass/Fail**: [ ]

#### TC-A056: View Payment Details
- **Description**: Verify payment details page
- **Steps**:
  1. Click on a payment
- **Expected Result**:
  - Full payment details shown
  - Proof of payment (if bank transfer)
  - Transaction ID (if electronic)
- **Pass/Fail**: [ ]

#### TC-A057: Verify Payment
- **Description**: Verify payment verification works
- **Steps**:
  1. Find a pending payment
  2. View proof of payment
  3. Click "Verify"
- **Expected Result**:
  - Payment marked as verified
  - Booking may be updated
- **Pass/Fail**: [ ]

#### TC-A058: Reject Payment
- **Description**: Verify payment rejection
- **Steps**:
  1. Find a pending payment
  2. Click "Reject"
  3. Enter reason
- **Expected Result**:
  - Payment marked as rejected
  - Customer notified
- **Pass/Fail**: [ ]

#### TC-A059: Process Refund
- **Description**: Verify refund processing
- **Steps**:
  1. Find a completed payment
  2. Click "Refund"
  3. Enter refund amount (full or partial)
  4. Confirm
- **Expected Result**:
  - Refund is recorded
  - May trigger actual refund (depends on payment method)
- **Pass/Fail**: [ ]

---

### 10. Reviews Moderation

#### TC-A060: Access Reviews Page
- **Description**: Verify reviews page works
- **Steps**:
  1. Click "Reviews" in admin menu
- **Expected Result**:
  - All reviews listed
  - Shows rating, reviewer, provider, status
- **Pass/Fail**: [ ]

#### TC-A061: Approve Review
- **Description**: Verify review approval
- **Steps**:
  1. Find a pending review
  2. Click "Approve"
- **Expected Result**:
  - Review becomes public
  - Shows on provider profile
- **Pass/Fail**: [ ]

#### TC-A062: Reject Review
- **Description**: Verify review rejection
- **Steps**:
  1. Find a pending or inappropriate review
  2. Click "Reject"
  3. Enter reason (optional)
- **Expected Result**:
  - Review hidden from public
  - Not counted in ratings
- **Pass/Fail**: [ ]

#### TC-A063: Toggle Featured Review
- **Description**: Verify featured review toggle
- **Steps**:
  1. Toggle a review as featured
- **Expected Result**:
  - Featured reviews may appear prominently
- **Pass/Fail**: [ ]

#### TC-A064: Respond to Review
- **Description**: Verify admin can respond to review
- **Steps**:
  1. Click respond on a review
  2. Enter response
  3. Save
- **Expected Result**:
  - Response appears with review
  - Shows as admin response
- **Pass/Fail**: [ ]

#### TC-A065: Delete Review
- **Description**: Verify review deletion
- **Steps**:
  1. Click delete on a review
  2. Confirm
- **Expected Result**:
  - Review removed
  - Provider rating recalculated
- **Pass/Fail**: [ ]

---

### 11. Events Management

#### TC-A066: Access Events Page
- **Description**: Verify events management
- **Steps**:
  1. Click "Events" in admin menu
- **Expected Result**:
  - All events listed
  - Shows name, organizer, date, status
- **Pass/Fail**: [ ]

#### TC-A067: Create Event
- **Description**: Verify admin can create events
- **Steps**:
  1. Click "Create Event"
  2. Fill all details
  3. Save
- **Expected Result**:
  - Event created
  - Appears on public events page
- **Pass/Fail**: [ ]

#### TC-A068: Edit Event
- **Description**: Verify event editing
- **Steps**:
  1. Click edit
  2. Update details
  3. Save
- **Expected Result**:
  - Changes saved
- **Pass/Fail**: [ ]

#### TC-A069: Toggle Event Featured
- **Description**: Verify featured toggle
- **Steps**:
  1. Toggle featured on/off
- **Expected Result**:
  - Featured events appear prominently
- **Pass/Fail**: [ ]

#### TC-A070: Update Event Status
- **Description**: Verify status update
- **Steps**:
  1. Change event status (Draft/Published/Cancelled)
- **Expected Result**:
  - Status updates
  - Draft events not visible publicly
- **Pass/Fail**: [ ]

#### TC-A071: Delete Event
- **Description**: Verify event deletion
- **Steps**:
  1. Click delete
  2. Confirm
- **Expected Result**:
  - Event removed
  - Ticket sales handled appropriately
- **Pass/Fail**: [ ]

---

### 12. Promotions Management

#### TC-A072: Access Promotions Page
- **Description**: Verify promotions management
- **Steps**:
  1. Click "Promotions" in admin menu
- **Expected Result**:
  - All promotions listed
- **Pass/Fail**: [ ]

#### TC-A073: Create Promotion
- **Description**: Verify promotion creation
- **Steps**:
  1. Click "Create Promotion"
  2. Fill details
  3. Save
- **Expected Result**:
  - Promotion created
- **Pass/Fail**: [ ]

#### TC-A074: Edit Promotion
- **Description**: Verify promotion editing
- **Steps**:
  1. Click edit
  2. Update
  3. Save
- **Expected Result**:
  - Changes saved
- **Pass/Fail**: [ ]

#### TC-A075: Toggle Promotion Active
- **Description**: Verify toggle
- **Steps**:
  1. Toggle active/inactive
- **Expected Result**:
  - Status changes
  - Inactive promotions don't apply
- **Pass/Fail**: [ ]

#### TC-A076: Delete Promotion
- **Description**: Verify deletion
- **Steps**:
  1. Click delete
  2. Confirm
- **Expected Result**:
  - Promotion removed
- **Pass/Fail**: [ ]

---

### 13. Subscription Plans

#### TC-A077: Access Subscription Plans
- **Description**: Verify subscription plans page
- **Steps**:
  1. Click "Subscription Plans" in admin menu
- **Expected Result**:
  - All plans listed
  - Shows name, price, features
- **Pass/Fail**: [ ]

#### TC-A078: Create Plan
- **Description**: Verify plan creation
- **Steps**:
  1. Click "Create Plan"
  2. Enter name, price, features
  3. Save
- **Expected Result**:
  - Plan created
  - Available for providers
- **Pass/Fail**: [ ]

#### TC-A079: Edit Plan
- **Description**: Verify plan editing
- **Steps**:
  1. Click edit
  2. Update details
  3. Save
- **Expected Result**:
  - Changes saved
- **Pass/Fail**: [ ]

#### TC-A080: Toggle Plan Active
- **Description**: Verify plan toggle
- **Steps**:
  1. Toggle active/inactive
- **Expected Result**:
  - Inactive plans not available for purchase
- **Pass/Fail**: [ ]

#### TC-A081: Reorder Plans
- **Description**: Verify plan ordering
- **Steps**:
  1. Reorder plans
- **Expected Result**:
  - Display order changes
- **Pass/Fail**: [ ]

#### TC-A082: Delete Plan
- **Description**: Verify plan deletion
- **Steps**:
  1. Click delete
  2. Confirm
- **Expected Result**:
  - Plan removed
  - Existing subscriptions handled
- **Pass/Fail**: [ ]

---

### 14. Companies Management

#### TC-A083: Access Companies Page
- **Description**: Verify companies management
- **Steps**:
  1. Click "Companies" in admin menu
- **Expected Result**:
  - All companies listed
- **Pass/Fail**: [ ]

#### TC-A084: Create Company
- **Description**: Verify company creation
- **Steps**:
  1. Click "Create Company"
  2. Fill details
  3. Save
- **Expected Result**:
  - Company created
- **Pass/Fail**: [ ]

#### TC-A085: Edit Company
- **Description**: Verify company editing
- **Steps**:
  1. Click edit, update, save
- **Expected Result**:
  - Changes saved
- **Pass/Fail**: [ ]

#### TC-A086: Toggle Company Active
- **Description**: Verify toggle
- **Steps**:
  1. Toggle active/inactive
- **Expected Result**:
  - Status changes
- **Pass/Fail**: [ ]

#### TC-A087: Delete Company
- **Description**: Verify deletion
- **Steps**:
  1. Click delete, confirm
- **Expected Result**:
  - Company removed
- **Pass/Fail**: [ ]

---

### 15. Admin Users Management

#### TC-A088: Access Admin Users Page
- **Description**: Verify admin users management
- **Steps**:
  1. Click "Admin Users" in admin menu
- **Expected Result**:
  - All admins listed
  - Shows name, role, status
- **Pass/Fail**: [ ]

#### TC-A089: Create Admin User
- **Description**: Verify admin creation
- **Steps**:
  1. Click "Create Admin"
  2. Enter name, email, password
  3. Select role (Super Admin, Moderator, etc.)
  4. Set permissions
  5. Save
- **Expected Result**:
  - Admin account created
  - Can log in to admin panel
- **Pass/Fail**: [ ]

#### TC-A090: Edit Admin User
- **Description**: Verify admin editing
- **Steps**:
  1. Click edit
  2. Update role or permissions
  3. Save
- **Expected Result**:
  - Changes saved
  - Permissions take effect
- **Pass/Fail**: [ ]

#### TC-A091: Suspend Admin
- **Description**: Verify admin suspension
- **Steps**:
  1. Click "Suspend" on an admin
- **Expected Result**:
  - Admin cannot access admin panel
  - Status shows suspended
- **Pass/Fail**: [ ]

#### TC-A092: Restore Admin
- **Description**: Verify admin restoration
- **Steps**:
  1. Click "Restore" on suspended admin
- **Expected Result**:
  - Admin access restored
- **Pass/Fail**: [ ]

#### TC-A093: Delete Admin User
- **Description**: Verify admin deletion
- **Steps**:
  1. Click delete
  2. Confirm
- **Expected Result**:
  - Admin removed
  - Cannot be yourself (super admin protection)
- **Pass/Fail**: [ ]

---

### 16. Audit Logs

#### TC-A094: Access Audit Logs
- **Description**: Verify audit logs page
- **Steps**:
  1. Click "Audit Logs" in admin menu
- **Expected Result**:
  - Logs page loads
  - Shows admin actions
  - Date, admin name, action, target
- **Pass/Fail**: [ ]

#### TC-A095: View Log Details
- **Description**: Verify log details
- **Steps**:
  1. Click on a log entry
- **Expected Result**:
  - Full details shown
  - Old and new values (if applicable)
  - Notes field
- **Pass/Fail**: [ ]

#### TC-A096: Filter Logs
- **Description**: Verify log filtering
- **Steps**:
  1. Filter by admin
  2. Filter by action type
  3. Filter by date range
- **Expected Result**:
  - Logs filtered accordingly
- **Pass/Fail**: [ ]

---

### 17. Messages

#### TC-A097: Access Admin Messages
- **Description**: Verify messages page
- **Steps**:
  1. Click "Messages" in admin menu
- **Expected Result**:
  - Messages/conversations listed
- **Pass/Fail**: [ ]

#### TC-A098: Start Conversation
- **Description**: Verify admin can message users
- **Steps**:
  1. Click "New Message"
  2. Search for a user
  3. Type message
  4. Send
- **Expected Result**:
  - Message sent
  - User receives it
- **Pass/Fail**: [ ]

#### TC-A099: Reply to Message
- **Description**: Verify admin can reply
- **Steps**:
  1. Open a conversation
  2. Type reply
  3. Send
- **Expected Result**:
  - Reply sent
- **Pass/Fail**: [ ]

---

### 18. Third Party Services

#### TC-A100: Access Third Party Services
- **Description**: Verify integrations page
- **Steps**:
  1. Click "Third Party Services" in admin menu
- **Expected Result**:
  - Integrations page loads
  - Shows configured services
- **Pass/Fail**: [ ]

#### TC-A101: Configure Service
- **Description**: Verify configuration works
- **Steps**:
  1. Click on a service (e.g., Supabase)
  2. Enter API keys/credentials
  3. Save
- **Expected Result**:
  - Configuration saved
- **Pass/Fail**: [ ]

#### TC-A102: Test Service Connection
- **Description**: Verify test function
- **Steps**:
  1. Configure a service
  2. Click "Test Connection"
- **Expected Result**:
  - Shows success or error message
  - Confirms service is working
- **Pass/Fail**: [ ]

---

### 19. Reports & Analytics

#### TC-A103: Access Reports Page
- **Description**: Verify reports page
- **Steps**:
  1. Click "Reports" in admin menu
- **Expected Result**:
  - Reports page loads
  - Different report types available
- **Pass/Fail**: [ ]

#### TC-A104: View Revenue Report
- **Description**: Verify revenue report
- **Steps**:
  1. Click on Revenue report
  2. Select date range
- **Expected Result**:
  - Revenue data displayed
  - Charts and breakdowns shown
- **Pass/Fail**: [ ]

#### TC-A105: View Bookings Report
- **Description**: Verify bookings report
- **Steps**:
  1. Click on Bookings report
- **Expected Result**:
  - Booking statistics shown
  - Status breakdowns
- **Pass/Fail**: [ ]

#### TC-A106: View Users Report
- **Description**: Verify users report
- **Steps**:
  1. Click on Users report
- **Expected Result**:
  - User growth data
  - Signups over time
- **Pass/Fail**: [ ]

#### TC-A107: View Providers Report
- **Description**: Verify providers report
- **Steps**:
  1. Click on Providers report
- **Expected Result**:
  - Provider statistics
  - Performance metrics
- **Pass/Fail**: [ ]

#### TC-A108: Export Excel Report
- **Description**: Verify Excel export
- **Steps**:
  1. On any report, click "Export Excel"
  2. Select options
  3. Download
- **Expected Result**:
  - Excel file downloads
  - Contains report data
- **Pass/Fail**: [ ]

#### TC-A109: Export PDF Report
- **Description**: Verify PDF export
- **Steps**:
  1. Click "Export PDF"
  2. Download
- **Expected Result**:
  - PDF file downloads
  - Formatted report
- **Pass/Fail**: [ ]

---

### 20. Settings

#### TC-A110: Access Settings Page
- **Description**: Verify settings page
- **Steps**:
  1. Click "Settings" in admin menu
- **Expected Result**:
  - Settings page loads
  - Various settings sections shown
- **Pass/Fail**: [ ]

#### TC-A111: Update General Settings
- **Description**: Verify settings can be updated
- **Steps**:
  1. Change a setting (e.g., site name)
  2. Save
- **Expected Result**:
  - Setting is saved
  - Change takes effect
- **Pass/Fail**: [ ]

#### TC-A112: Clear Cache
- **Description**: Verify cache clearing
- **Steps**:
  1. Click "Clear Cache"
  2. Confirm
- **Expected Result**:
  - Cache is cleared
  - Success message shown
- **Pass/Fail**: [ ]

---

## Test Summary

| Category | Total Tests | Passed | Failed |
|----------|-------------|--------|--------|
| Admin Dashboard | 9 | | |
| Verification Queue | 7 | | |
| User Management | 10 | | |
| Service Provider Management | 8 | | |
| Services Management | 4 | | |
| Products Management | 5 | | |
| Categories Management | 6 | | |
| Bookings Management | 5 | | |
| Payments Management | 5 | | |
| Reviews Moderation | 6 | | |
| Events Management | 6 | | |
| Promotions Management | 5 | | |
| Subscription Plans | 6 | | |
| Companies Management | 5 | | |
| Admin Users Management | 6 | | |
| Audit Logs | 3 | | |
| Messages | 3 | | |
| Third Party Services | 3 | | |
| Reports & Analytics | 7 | | |
| Settings | 3 | | |
| **TOTAL** | **112** | | |

---

## Notes
- Test with different admin roles to verify permissions
- Some actions are restricted to Super Admin only
- Be careful with delete operations on production

### Issues Found:
1.
2.
3.

### Tester Information:
- **Name**:
- **Date**:
- **Browser/Device**:
