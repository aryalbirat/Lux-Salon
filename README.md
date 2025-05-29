# LuxSalon - Salon Booking System

LuxSalon is a comprehensive salon booking application with JWT authentication, allowing clients to securely book services with their preferred stylists.

## Features

- **User Authentication**
  - Secure JWT-based authentication
  - User registration and login
  - Role-based access control (client, staff, admin)

- **Booking System**
  - Appointment scheduling
  - Service selection
  - Staff member selection
  - Time slot availability

- **Client Dashboard**
  - View upcoming appointments
  - Booking history
  - Profile management

- **Staff Features**
  - View assigned appointments
  - Mark appointments as completed

- **Admin Features**
  - Manage services
  - Manage staff
  - View all appointments

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Shadcn UI components
- Context API for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create .env file with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/luxsalon
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   ```

4. Seed the database with initial data:
   ```
   npm run seed
   ```

5. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Default Users

The seed data creates the following users:

- **Admin:** admin@luxsalon.com / password123
- **Staff:** john@luxsalon.com / password123 and sarah@luxsalon.com / password123
- **Client:** client@example.com / password123

## JWT Authentication Flow

1. User registers or logs in
2. Server validates credentials and issues a JWT token
3. Token is stored in localStorage
4. API requests include the token in Authorization header
5. Protected routes verify the token before granting access
6. On successful authentication, user is redirected to their dashboard based on role
