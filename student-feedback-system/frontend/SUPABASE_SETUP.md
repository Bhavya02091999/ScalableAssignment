# Supabase Setup Guide

This guide will help you set up Supabase for the Student Feedback System.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com/))
2. A new or existing Supabase project

## Setup Instructions

### 1. Create a new Supabase project

1. Go to the [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Fill in your project details (name, password, etc.)
4. Select a region close to your users
5. Click "Create new project"

### 2. Set up the database schema

1. Go to the SQL Editor in the Supabase dashboard
2. Click "New Query"
3. Copy the contents of `supabase/migrations/20240518000000_create_users_table.sql`
4. Paste the SQL into the query editor
5. Click "Run" to execute the SQL

### 3. Configure Authentication

1. Go to Authentication > Settings in the Supabase dashboard
2. Under "Site URL", add your application's URL (e.g., `http://localhost:3000` for local development)
3. Under "JWT Settings", note the JWT Secret (you'll need this for API authentication)
4. Under "Email Auth", enable "Enable Confirm Email" if you want to verify user emails

### 4. Configure CORS

1. Go to Authentication > URL Configuration in the Supabase dashboard
2. Add your application's URL to the "Site URL" and "Redirect URLs" sections
3. Add any additional domains where your frontend will be hosted

### 5. Set up environment variables

Create a `.env.local` file in the root of your frontend project with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these values in your Supabase project settings under Project Settings > API.

### 6. Test the setup

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```
2. Navigate to the registration page and create a new account
3. Verify that you can log in and that your user is created in the Supabase database

## Troubleshooting

### User roles not being set correctly

If user roles aren't being set correctly:
1. Check the `users` table in your Supabase database to ensure the trigger is working
2. Verify that the `handle_new_user` function exists and is being called
3. Check the browser console for any errors during registration

### Authentication issues

If you're having trouble with authentication:
1. Verify that your Supabase URL and anon key are correct in your environment variables
2. Check that CORS is properly configured in your Supabase project settings
3. Look for errors in the browser console and network tab

## Production Deployment

For production deployment:
1. Update the environment variables in your hosting provider
2. Configure a custom domain in your Supabase project
3. Set up proper CORS policies for your production domain
4. Consider enabling email confirmations for user signups
5. Set up logging and monitoring for authentication events
