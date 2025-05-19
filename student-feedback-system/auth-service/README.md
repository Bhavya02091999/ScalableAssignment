# Auth Service

Authentication microservice for the Student Feedback System using Next.js and Supabase.

## Features

- User registration with email/password
- Email verification
- User login/logout
- Session management
- Role-based access control (student/instructor)

## Prerequisites

- Node.js 18 or later
- npm or yarn
- Docker (for containerization)
- Supabase account and project

## Setup

1. Copy the environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
2. Update the `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3001
   PORT=3001
   ```

## Development

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

2. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will be available at [http://localhost:3001](http://localhost:3001)

## Build

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Docker

1. Build the Docker image:
   ```bash
   docker build -t auth-service .
   ```

2. Run the container:
   ```bash
   docker run -p 3001:3001 --env-file .env.local auth-service
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | - |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | - |
| `NEXT_PUBLIC_APP_URL` | Base URL of the application | `http://localhost:3001` |
| `PORT` | Port to run the application on | `3001` |

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe",
    "role": "student"
  }
  ```

- `POST /api/auth/signin` - Sign in a user
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```

- `POST /api/auth/signout` - Sign out the current user

- `GET /api/auth/session` - Get the current user session

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_APP_URL` | URL of the frontend application | Yes | `http://localhost:3000` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes | - |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | - |
| `PORT` | Port to run the auth service on | No | `3001` |

## License

MIT
