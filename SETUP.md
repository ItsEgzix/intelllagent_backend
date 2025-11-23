# Email API Setup Guide

## Prerequisites

1. A Supabase account and project
2. Node.js and npm installed

## Setup Steps

### 1. Configure Environment Variables

Create a `.env` file in the `intellagent-backend` directory:

```env
# Database - Get this from your Supabase project settings
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres?schema=public"

# Server
PORT=3000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001
```

**To get your Supabase connection string:**

1. Go to your Supabase project dashboard
2. Navigate to Settings → Database
3. Copy the "Connection string" under "Connection pooling" or "Direct connection"
4. Replace `[YOUR-PASSWORD]` with your database password

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will:

- Create the `emails` table in your Supabase database
- Generate the Prisma Client

### 4. Start the Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### POST /emails

Create a new email entry.

**Request Body:**

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "subject": "Contact Form",
  "message": "Hello, I'm interested in your services."
}
```

**Response:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "subject": "Contact Form",
  "message": "Hello, I'm interested in your services.",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /emails

Get all email entries (ordered by creation date, newest first).

### GET /emails/:id

Get a specific email entry by ID.

## Testing the API

You can test the API using curl or any HTTP client:

```bash
curl -X POST http://localhost:3000/emails \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "subject": "Test Subject",
    "message": "Test message"
  }'
```

## Database Schema

The `emails` table has the following structure:

- `id` (UUID, Primary Key)
- `email` (String, Required)
- `name` (String, Optional)
- `subject` (String, Optional)
- `message` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
