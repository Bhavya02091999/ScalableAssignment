# Student Feedback System - Frontend

This is the frontend for the Student Feedback System, built with Next.js 14 and TypeScript.

## Features

- Modern, responsive UI built with Tailwind CSS
- Authentication with JWT and HTTP-only cookies
- Role-based access control (student/instructor)
- Protected routes
- Form handling with React Hook Form and Zod

## Prerequisites

- Node.js 18 or later
- npm or yarn
- Auth service running (see [auth-service](../auth-service/README.md) for setup)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

2. Copy the environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

3. Update the `.env.local` file with your configuration:
   ```
   NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `app/` - Application routes and pages
- `components/` - Reusable UI components
- `context/` - React context providers
- `lib/` - Utility functions and API clients
- `public/` - Static assets
- `styles/` - Global styles and Tailwind configuration

## Authentication

The application uses JWT for authentication with HTTP-only cookies for security. The auth flow is handled by a dedicated auth service.

### Available Authentication Pages

- `/auth/login` - User login
- `/auth/register` - User registration
- `/auth/verify-email` - Email verification

## Deployment

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

Or deploy to your favorite platform (Vercel, Netlify, etc.).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
