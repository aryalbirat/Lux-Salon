# 💅 BlissSalon - Beauty Salon Booking System

<div align="center">

*Elevate your beauty experience with our premium salon booking platform.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933.svg?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000.svg?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248.svg?logo=mongodb)](https://www.mongodb.com/)

</div>

BlissSalon is a full-stack beauty salon booking application that empowers clients to securely schedule services with their preferred stylists. Built with modern web technologies, the platform offers an elegant user interface and robust backend functionality.

## ✨ Features

### 👤 User Authentication & Authorization
- **Secure JWT Authentication**: Industry-standard security for user sessions
- **Multi-Role System**: Separate interfaces for clients, staff, and administrators
- **Protected Routes**: Role-based access control to application features

### 📅 Booking System
- **Intuitive Appointment Scheduling**: Multi-step booking process
- **Service Catalog**: Browse and select from a variety of beauty services
- **Staff Selection**: Choose your preferred stylist
- **Smart Availability**: Real-time time slot availability
- **Appointment Management**: View, reschedule, or cancel bookings

### 👩‍💼 Client Experience
- **Personalized Dashboard**: Quick overview of upcoming appointments
- **Booking History**: Complete record of past services
- **Profile Management**: Update personal information securely

### 💇‍♀️ Staff Portal
- **Appointment Tracking**: View all assigned bookings
- **Service Management**: Mark appointments as completed
- **Schedule Management**: View daily and weekly schedules

### 🔑 Administration
- **Full System Control**: Comprehensive management interface
- **Client Management**: View and manage all clients
- **Staff Oversight**: Manage staff information and assignments
- **Service Control**: Add, update, or remove salon services

## 🛠️ Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **Routing**: React Router for seamless SPA navigation
- **UI Components**: Shadcn UI (built on Radix UI primitives)
- **Styling**: Tailwind CSS with custom salon-themed design
- **State Management**: React Context API
- **Forms**: Custom form implementations 
- **Notifications**: Toast notification system with sonner

### Backend
- **Server**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with Bearer authentication
- **Security**: bcryptjs for password hashing
- **API Design**: RESTful API architecture

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Create .env file in the backend directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/BlissSalon
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=1d
   ```

4. Start the development server:
   ```powershell
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   npm run dev
   ```

4. Access the application at [http://localhost:8000](http://localhost:8000)

## 👥 Default User Accounts

The system comes with a pre-configured admin account:

| Role  | Email | Password | Access |
|-------|-------|----------|--------|
| Admin | admin@salon.com | Admin@123!Secure | Full system access |

Other user accounts (staff and clients) can be created through the registration functionality.

## 🔒 Authentication Flow

1. User submits login credentials or registers a new account
2. Server validates credentials and generates a JWT token
3. Token is stored securely in the client
4. Protected API requests include the token in the Authorization header
5. Server validates token for protected routes
6. User is redirected to their role-specific dashboard

## 📂 Project Structure

```
BlissSalon/
├── backend/                # Node.js + Express backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── utils/              # Utility functions
│
└── frontend/               # React + TypeScript frontend
    ├── public/             # Static assets
    └── src/
        ├── components/     # UI components
        │   ├── admin/      # Admin-specific components
        │   └── ui/         # Shadcn UI components
        ├── contexts/       # React context providers
        ├── data/           # Static data sources
        ├── hooks/          # Custom React hooks
        ├── lib/            # Utility functions
        ├── pages/          # Page components
        └── services/       # API service functions
```

## 📱 Responsive Design

BlissSalon is fully responsive and optimized for:
- Desktop browsers
- Tablets
- Mobile devices

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
