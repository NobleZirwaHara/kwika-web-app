# Authentication & Onboarding Module - User Acceptance Testing

## Overview
This document contains test cases for user authentication (login, registration, logout) and the provider onboarding process. It includes the special flow where an existing customer can upgrade their account to become a service provider.

## Prerequisites
- Access to the Kwika Events website
- Valid email addresses for testing (you may need multiple)
- Access to email inbox to verify any confirmation emails

---

## Test Cases

### 1. Customer Registration

#### TC-AO001: Access Registration Page
- **Description**: Verify the registration page is accessible
- **Steps**:
  1. Go to the Kwika Events homepage
  2. Click "Sign Up" or "Register" in the navigation
  3. Or go directly to /register
- **Expected Result**:
  - Registration page loads
  - Registration form is displayed
  - Fields for name, email, phone, and password are visible
- **Pass/Fail**: [ ]

#### TC-AO002: Register with Valid Information
- **Description**: Verify a new user can create an account
- **Steps**:
  1. Go to the registration page
  2. Enter your full name (e.g., "John Doe")
  3. Enter a valid email address (e.g., "john@example.com")
  4. Enter a phone number (optional)
  5. Enter a password (at least 8 characters)
  6. Re-enter the password to confirm
  7. Click "Create Account" button
- **Expected Result**:
  - Account is created successfully
  - You are logged in automatically
  - You are redirected to the homepage or user dashboard
  - Success message may be displayed
- **Pass/Fail**: [ ]

#### TC-AO003: Register with Existing Email
- **Description**: Verify system prevents duplicate email registration
- **Steps**:
  1. Go to the registration page
  2. Enter details with an email that already has an account
  3. Submit the form
- **Expected Result**:
  - Registration fails
  - Error message says "Email already exists" or similar
  - User is not created
- **Pass/Fail**: [ ]

#### TC-AO004: Register with Invalid Email Format
- **Description**: Verify email validation works
- **Steps**:
  1. Go to the registration page
  2. Enter an invalid email (e.g., "notanemail" or "test@")
  3. Fill other fields correctly
  4. Submit the form
- **Expected Result**:
  - Form shows error for email field
  - Registration does not proceed
  - Message indicates email format is invalid
- **Pass/Fail**: [ ]

#### TC-AO005: Register with Short Password
- **Description**: Verify password length requirement
- **Steps**:
  1. Go to the registration page
  2. Fill all fields correctly
  3. Enter a password shorter than 8 characters (e.g., "abc123")
  4. Submit the form
- **Expected Result**:
  - Error message appears
  - Says password must be at least 8 characters
  - Registration does not proceed
- **Pass/Fail**: [ ]

#### TC-AO006: Register with Mismatched Passwords
- **Description**: Verify password confirmation must match
- **Steps**:
  1. Go to the registration page
  2. Fill all fields correctly
  3. Enter different passwords in "Password" and "Confirm Password"
  4. Submit the form
- **Expected Result**:
  - Error message appears
  - Says passwords do not match
  - Registration does not proceed
- **Pass/Fail**: [ ]

#### TC-AO007: Register with Empty Required Fields
- **Description**: Verify required fields are enforced
- **Steps**:
  1. Go to the registration page
  2. Leave the name field empty
  3. Try to submit
  4. Then try leaving email empty
  5. Then try leaving password empty
- **Expected Result**:
  - Form shows error for empty required fields
  - Cannot submit without required fields filled
- **Pass/Fail**: [ ]

---

### 2. Customer Login

#### TC-AO008: Access Login Page
- **Description**: Verify the login page is accessible
- **Steps**:
  1. Go to the Kwika Events homepage
  2. Click "Sign In" or "Login" in the navigation
  3. Or go directly to /login
- **Expected Result**:
  - Login page loads
  - Email and password fields are visible
  - "Login" or "Sign In" button is available
- **Pass/Fail**: [ ]

#### TC-AO009: Login with Valid Credentials
- **Description**: Verify a user can log in with correct credentials
- **Steps**:
  1. Go to the login page
  2. Enter your registered email
  3. Enter your correct password
  4. Click "Sign In" button
- **Expected Result**:
  - Login is successful
  - You are redirected to dashboard or homepage
  - Your name appears in the navigation (indicating logged in)
- **Pass/Fail**: [ ]

#### TC-AO010: Login with Wrong Password
- **Description**: Verify login fails with incorrect password
- **Steps**:
  1. Go to the login page
  2. Enter your registered email
  3. Enter a wrong password
  4. Click "Sign In" button
- **Expected Result**:
  - Login fails
  - Error message appears (e.g., "Invalid credentials")
  - User remains on login page
- **Pass/Fail**: [ ]

#### TC-AO011: Login with Unregistered Email
- **Description**: Verify login fails for non-existent email
- **Steps**:
  1. Go to the login page
  2. Enter an email that is not registered
  3. Enter any password
  4. Click "Sign In" button
- **Expected Result**:
  - Login fails
  - Error message appears
  - Does not reveal whether email exists (security best practice)
- **Pass/Fail**: [ ]

#### TC-AO012: Login with Empty Fields
- **Description**: Verify login requires both fields
- **Steps**:
  1. Go to the login page
  2. Leave email empty, click sign in
  3. Leave password empty, click sign in
  4. Leave both empty, click sign in
- **Expected Result**:
  - Form validation prevents submission
  - Error messages shown for empty fields
- **Pass/Fail**: [ ]

#### TC-AO013: Link to Registration from Login
- **Description**: Verify login page links to registration
- **Steps**:
  1. Go to the login page
  2. Look for "Create account" or "Sign up" link
  3. Click on it
- **Expected Result**:
  - You are taken to the registration page
- **Pass/Fail**: [ ]

#### TC-AO014: Link to Provider Onboarding from Login
- **Description**: Verify login page links to provider signup
- **Steps**:
  1. Go to the login page
  2. Look for "Become a provider" or similar link
  3. Click on it
- **Expected Result**:
  - You are taken to the provider onboarding welcome page
- **Pass/Fail**: [ ]

---

### 3. Logout

#### TC-AO015: Logout Successfully
- **Description**: Verify a user can log out
- **Steps**:
  1. Log in to your account
  2. Look for logout option (may be in a user menu dropdown)
  3. Click "Logout" or "Sign Out"
- **Expected Result**:
  - You are logged out
  - Redirected to homepage or login page
  - Navigation no longer shows your name
  - Protected pages are no longer accessible
- **Pass/Fail**: [ ]

#### TC-AO016: Logout Session Cleared
- **Description**: Verify logout properly clears session
- **Steps**:
  1. Log in to your account
  2. Go to a protected page (e.g., /user/dashboard)
  3. Log out
  4. Try to go back to /user/dashboard (use browser back or type URL)
- **Expected Result**:
  - You are redirected to login page
  - Cannot access protected pages after logout
- **Pass/Fail**: [ ]

---

### 4. Provider Onboarding - Welcome Page

#### TC-AO017: Access Provider Onboarding Welcome
- **Description**: Verify the provider onboarding welcome page loads
- **Steps**:
  1. Go to the homepage
  2. Click "Become a Provider" or similar link
  3. Or go directly to /onboarding/welcome
- **Expected Result**:
  - Welcome page loads with provider benefits
  - Options to choose provider type are shown
  - "Sign In" link available for existing users
- **Pass/Fail**: [ ]

#### TC-AO018: Choose "Both Services & Events" Type
- **Description**: Verify selecting "Both" provider type
- **Steps**:
  1. Go to /onboarding/welcome
  2. Click "Both Services & Events" option
- **Expected Result**:
  - You are taken to Step 1 (Personal Details)
  - URL includes type parameter (e.g., ?type=both)
- **Pass/Fail**: [ ]

#### TC-AO019: Choose "Just Events" Type
- **Description**: Verify selecting "Events Only" provider type
- **Steps**:
  1. Go to /onboarding/welcome
  2. Click "Just Events" option
- **Expected Result**:
  - You are taken to Step 1 (Personal Details)
  - URL includes type parameter (e.g., ?type=events_only)
- **Pass/Fail**: [ ]

---

### 5. Provider Onboarding - Step 1: Personal Details (New User)

#### TC-AO020: View Step 1 as New User
- **Description**: Verify Step 1 shows all fields for new users
- **Steps**:
  1. As a guest (not logged in), go to /onboarding/step1
  2. Review the form fields displayed
- **Expected Result**:
  - Full Name field is shown
  - Email field is shown
  - Phone field is shown
  - Password field is shown
  - Confirm Password field is shown
  - National ID field is shown (optional)
- **Pass/Fail**: [ ]

#### TC-AO021: Complete Step 1 as New User
- **Description**: Verify new user can complete Step 1
- **Steps**:
  1. Go to /onboarding/step1 (not logged in)
  2. Fill in Full Name
  3. Fill in Email (must be new, not already registered)
  4. Fill in Phone Number
  5. Enter Password (8+ characters)
  6. Confirm Password
  7. Optionally enter National ID
  8. Click "Continue"
- **Expected Result**:
  - Account is created
  - You are logged in automatically
  - Redirected to Step 2 (Business Information)
  - Progress indicator shows Step 2
- **Pass/Fail**: [ ]

#### TC-AO022: Step 1 Validation for New User
- **Description**: Verify validation on Step 1 fields
- **Steps**:
  1. Go to /onboarding/step1
  2. Try submitting with empty required fields
  3. Try submitting with invalid email
  4. Try submitting with short password
  5. Try submitting with mismatched passwords
- **Expected Result**:
  - Appropriate error messages shown for each case
  - Form does not submit until valid
- **Pass/Fail**: [ ]

---

### 6. Provider Onboarding - Step 1: Personal Details (Existing Customer Upgrade)

#### TC-AO023: View Step 1 as Existing Customer
- **Description**: Verify Step 1 shows pre-filled data for logged-in customers
- **Steps**:
  1. Log in as a regular customer (not a provider)
  2. Go to /onboarding/step1
  3. Review the form
- **Expected Result**:
  - Name is pre-filled with your account name
  - Email is pre-filled and disabled (cannot change)
  - Phone is pre-filled
  - Password fields are NOT shown (already have account)
  - Notice appears saying "Continuing with your existing account"
- **Pass/Fail**: [ ]

#### TC-AO024: Complete Step 1 as Existing Customer
- **Description**: Verify existing customer can start provider onboarding
- **Steps**:
  1. Log in as a customer
  2. Go to /onboarding/step1
  3. Update phone number if needed
  4. Optionally add National ID
  5. Click "Continue"
- **Expected Result**:
  - Account is upgraded to provider role
  - Redirected to Step 2
  - Success message may appear
  - No new account created (same user)
- **Pass/Fail**: [ ]

#### TC-AO025: Verify Account Upgrade
- **Description**: Verify customer account becomes provider account
- **Steps**:
  1. Complete TC-AO024 (start onboarding as customer)
  2. After completing all onboarding steps
  3. Check your account type
- **Expected Result**:
  - Same email address
  - Same login credentials
  - Now has access to provider dashboard
  - Old customer bookings still visible
- **Pass/Fail**: [ ]

---

### 7. Provider Onboarding - Step 2: Business Information

#### TC-AO026: Access Step 2
- **Description**: Verify Step 2 is accessible after Step 1
- **Steps**:
  1. Complete Step 1
  2. You should be automatically redirected to Step 2
  3. Or go to /onboarding/step2
- **Expected Result**:
  - Business Information form loads
  - Fields for business details are visible
- **Pass/Fail**: [ ]

#### TC-AO027: Cannot Skip to Step 2
- **Description**: Verify users must complete Step 1 first
- **Steps**:
  1. As a guest, try to go directly to /onboarding/step2
- **Expected Result**:
  - You are redirected to Step 1
  - Cannot access Step 2 without completing Step 1
- **Pass/Fail**: [ ]

#### TC-AO028: Fill Business Information
- **Description**: Verify all business fields can be completed
- **Steps**:
  1. On Step 2, fill in Business Name
  2. Fill in Description (at least 50 characters)
  3. Optionally fill Business Registration Number
  4. Fill in Location (address)
  5. Fill in City
  6. Fill in Phone Number
  7. Fill in Email
  8. Optionally fill Website URL
  9. Optionally add social media links
  10. Click "Continue"
- **Expected Result**:
  - All fields save successfully
  - Redirected to Step 3
  - No validation errors if all required fields filled
- **Pass/Fail**: [ ]

#### TC-AO029: Step 2 Validation
- **Description**: Verify validation on business fields
- **Steps**:
  1. Try submitting with empty Business Name
  2. Try submitting with short description (less than 50 chars)
  3. Try submitting with invalid email
  4. Try submitting with invalid website URL
- **Expected Result**:
  - Appropriate error messages shown
  - Cannot proceed until valid
- **Pass/Fail**: [ ]

#### TC-AO030: Go Back to Step 1 from Step 2
- **Description**: Verify user can go back to edit previous step
- **Steps**:
  1. On Step 2, click "Back" button
- **Expected Result**:
  - Returns to Step 1
  - Previously entered data is preserved
- **Pass/Fail**: [ ]

---

### 8. Provider Onboarding - Step 3: Services & Media

#### TC-AO031: Access Step 3
- **Description**: Verify Step 3 is accessible after Step 2
- **Steps**:
  1. Complete Step 2
  2. You should be automatically redirected to Step 3
- **Expected Result**:
  - Services & Media form loads
  - Category selection visible
  - Image upload sections visible
- **Pass/Fail**: [ ]

#### TC-AO032: Select Service Categories
- **Description**: Verify categories can be selected
- **Steps**:
  1. On Step 3, look at the category options
  2. Expand a parent category (e.g., "Catering")
  3. Select one or more subcategories
  4. Select categories from another parent category
- **Expected Result**:
  - Subcategories are shown when parent expanded
  - Multiple categories can be selected
  - Selected categories are highlighted or checked
- **Pass/Fail**: [ ]

#### TC-AO033: Upload Logo
- **Description**: Verify logo can be uploaded
- **Steps**:
  1. On Step 3, find the logo upload section
  2. Click to upload or drag and drop an image
  3. Select an image file (JPG, PNG)
- **Expected Result**:
  - Image uploads successfully
  - Preview of the logo is shown
  - File size should be under 2MB
- **Pass/Fail**: [ ]

#### TC-AO034: Upload Cover Image
- **Description**: Verify cover image can be uploaded
- **Steps**:
  1. On Step 3, find the cover image upload section
  2. Click to upload or drag and drop an image
  3. Select an image file
- **Expected Result**:
  - Image uploads successfully
  - Preview of cover image is shown
  - File size should be under 5MB
- **Pass/Fail**: [ ]

#### TC-AO035: Upload Portfolio Images
- **Description**: Verify multiple portfolio images can be uploaded
- **Steps**:
  1. On Step 3, find the portfolio section
  2. Upload multiple images (up to 10)
- **Expected Result**:
  - Multiple images upload successfully
  - Previews shown for all uploaded images
  - Can remove individual images
- **Pass/Fail**: [ ]

#### TC-AO036: Step 3 for Events Only Provider
- **Description**: Verify Step 3 is simplified for events-only providers
- **Steps**:
  1. Start onboarding with "Just Events" type
  2. Complete Steps 1 and 2
  3. Arrive at Step 3
- **Expected Result**:
  - Category selection may be hidden or simplified
  - Logo and cover image uploads still available
  - Portfolio may be optional or hidden
- **Pass/Fail**: [ ]

#### TC-AO037: Complete Step 3
- **Description**: Verify Step 3 can be completed
- **Steps**:
  1. Select at least one category (for "Both" type)
  2. Upload logo (optional but recommended)
  3. Upload cover image (optional but recommended)
  4. Click "Continue"
- **Expected Result**:
  - Progress saves successfully
  - Redirected to Step 4 (Review)
- **Pass/Fail**: [ ]

---

### 9. Provider Onboarding - Step 4: Review & Submit

#### TC-AO038: Access Step 4
- **Description**: Verify Step 4 shows all entered information
- **Steps**:
  1. Complete Steps 1-3
  2. Arrive at Step 4
- **Expected Result**:
  - Review page loads
  - Personal details shown
  - Business information shown
  - Selected categories listed
  - Uploaded images displayed
- **Pass/Fail**: [ ]

#### TC-AO039: Review Personal Information
- **Description**: Verify personal info is displayed correctly
- **Steps**:
  1. On Step 4, review the Personal Details section
- **Expected Result**:
  - Name is correct
  - Email is correct
  - Phone is correct
- **Pass/Fail**: [ ]

#### TC-AO040: Review Business Information
- **Description**: Verify business info is displayed correctly
- **Steps**:
  1. On Step 4, review the Business Information section
- **Expected Result**:
  - Business name is correct
  - Description is shown
  - Location and city are correct
  - Contact details are correct
  - Social links are shown (if entered)
- **Pass/Fail**: [ ]

#### TC-AO041: Review Categories
- **Description**: Verify selected categories are shown
- **Steps**:
  1. On Step 4, look for the categories section
- **Expected Result**:
  - All selected categories are listed
  - Category names are correct
- **Pass/Fail**: [ ]

#### TC-AO042: Review Uploaded Images
- **Description**: Verify images are displayed
- **Steps**:
  1. On Step 4, look at the media section
- **Expected Result**:
  - Logo preview is shown (if uploaded)
  - Cover image preview is shown (if uploaded)
  - Portfolio images shown (if uploaded)
- **Pass/Fail**: [ ]

#### TC-AO043: Go Back to Edit
- **Description**: Verify user can go back to edit any step
- **Steps**:
  1. On Step 4, click "Back" or edit button for a section
  2. Make changes
  3. Return to Step 4
- **Expected Result**:
  - Can navigate back to previous steps
  - Changes are reflected on Step 4
- **Pass/Fail**: [ ]

#### TC-AO044: Submit Onboarding
- **Description**: Verify onboarding can be submitted
- **Steps**:
  1. On Step 4, review all information is correct
  2. Click "Submit" or "Complete" button
- **Expected Result**:
  - Onboarding is submitted
  - Redirected to provider dashboard
  - Success message says "Profile pending verification"
  - Profile status shows as "Pending"
- **Pass/Fail**: [ ]

---

### 10. Post-Onboarding Status

#### TC-AO045: View Pending Verification Status
- **Description**: Verify new provider sees pending status
- **Steps**:
  1. After completing onboarding, go to provider dashboard
  2. Look for verification status indicator
- **Expected Result**:
  - Dashboard shows "Profile Under Review" or similar
  - Status indicator shows "Pending"
  - May show estimated review time
- **Pass/Fail**: [ ]

#### TC-AO046: Provider Dashboard Access While Pending
- **Description**: Verify provider can access dashboard before approval
- **Steps**:
  1. As a pending provider, navigate through the provider dashboard
  2. Try accessing different sections
- **Expected Result**:
  - Can access most dashboard features
  - May see limitations until approved
  - Profile not visible to public until approved
- **Pass/Fail**: [ ]

---

### 11. Onboarding Navigation

#### TC-AO047: Progress Indicator
- **Description**: Verify progress indicator shows current step
- **Steps**:
  1. Go through onboarding process
  2. At each step, check the progress indicator
- **Expected Result**:
  - Progress shows Step 1, 2, 3, 4
  - Current step is highlighted
  - Completed steps show checkmark or different color
- **Pass/Fail**: [ ]

#### TC-AO048: Resume Incomplete Onboarding
- **Description**: Verify user can resume if they leave mid-process
- **Steps**:
  1. Start onboarding and complete Step 1
  2. Close the browser or navigate away
  3. Return and go to /onboarding/step1
- **Expected Result**:
  - Redirected to the last incomplete step
  - Previously entered data is preserved
  - Can continue from where you left off
- **Pass/Fail**: [ ]

---

### 12. Link from Registration to Provider Onboarding

#### TC-AO049: Provider Link on Registration Page
- **Description**: Verify registration page links to provider onboarding
- **Steps**:
  1. Go to /register
  2. Look for "Want to become a service provider?" link
  3. Click on it
- **Expected Result**:
  - Taken to /onboarding/welcome
  - Provider onboarding welcome page loads
- **Pass/Fail**: [ ]

---

## Test Summary

| Category | Total Tests | Passed | Failed |
|----------|-------------|--------|--------|
| Customer Registration | 7 | | |
| Customer Login | 7 | | |
| Logout | 2 | | |
| Onboarding Welcome | 3 | | |
| Step 1 (New User) | 3 | | |
| Step 1 (Customer Upgrade) | 3 | | |
| Step 2 (Business Info) | 5 | | |
| Step 3 (Services & Media) | 7 | | |
| Step 4 (Review & Submit) | 7 | | |
| Post-Onboarding | 2 | | |
| Onboarding Navigation | 2 | | |
| Registration Links | 1 | | |
| **TOTAL** | **49** | | |

---

## Notes
- Test both new user registration AND existing customer upgrade paths
- Pay special attention to the customer-to-provider conversion flow
- Verify data persists correctly between steps

### Issues Found:
1.
2.
3.

### Tester Information:
- **Name**:
- **Date**:
- **Browser/Device**:
