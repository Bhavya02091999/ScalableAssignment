# Test Accounts

This document contains the test accounts for the Student Feedback System demo. These accounts are pre-configured in the mock authentication system for demonstration purposes.

## Available Accounts

### Student Account
- **Email:** student@example.com
- **Password:** password123
- **Role:** Student
- **Permissions:**
  - View and enroll in courses
  - Submit feedback for courses
  - View personal feedback history
  - Update profile information

### Instructor Account
- **Email:** instructor@example.com
- **Password:** password123
- **Role:** Instructor
- **Permissions:**
  - All student permissions
  - Create and manage courses
  - View feedback for their courses
  - Generate feedback reports

### Admin Account
- **Email:** admin@example.com
- **Password:** password123
- **Role:** Admin
- **Permissions:**
  - All instructor permissions
  - Manage users (create, edit, deactivate)
  - Access admin dashboard
  - System configuration

## Features by Role

### Student Features
- View available courses
- Enroll in courses
- Submit feedback for enrolled courses
- View personal dashboard
- Update profile information

### Instructor Features
- All student features
- Create and manage courses
- View feedback for their courses
- Generate and export reports
- View course analytics

### Admin Features
- All instructor features
- User management
- System configuration
- Access to all feedback and reports
- Role management

## Important Notes

1. These accounts are for demonstration purposes only.
2. All accounts share the same password for convenience during demos.
3. Data is stored in the browser's localStorage and will persist until cleared.
4. For security, these accounts should not be used in production.
5. The password field is disabled in the profile page as password management is not implemented in the demo.

## Getting Started

1. Click on the "Sign In" button in the top-right corner
2. Enter the email and password for any of the test accounts
3. You'll be redirected to the dashboard based on your role
4. Explore the application's features according to your role's permissions

## Troubleshooting

If you encounter any issues:
- Clear your browser's localStorage and refresh the page
- Ensure you're using the correct email and password
- Check the browser's console for any error messages
- Try using a different test account to verify if the issue is role-specific
