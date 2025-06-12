# 🚗 Car Rental Admin Dashboard

A full-featured **admin panel** for managing a car rental platform. This dashboard allows authenticated admins to add cars, manage bookings, view basic stats, and monitor revenue trends. Built with modern tools and designed for a seamless management experience.

---

## ✨ Features

- **Authentication**: Secure admin login/logout flow
- **Car Management**: Add, edit, and remove car listings
- **Booking Overview**: View and filter all customer bookings
- **Revenue Stats**: Visual display of total earnings and booking trends
- **Calendar Integration**: See bookings across days/weeks/months
- **Payments Integration**: View payment status and history (Razorpay or similar)
- **Responsive Design**: Fully mobile-friendly and optimized UI
- **Production Ready**: Deployed on cloud infrastructure (e.g., Vercel/Netlify)

---

## 🛠️ Tech Stack

- **Framework**: React / Next.js 
- **Styling**: Tailwind CSS  
- **State Management**: Zustand
- **Authentication**: JWT / NextAuth / custom auth (specify if applicable)  
- **Calendar**: FullCalendar / react-calendar  
- **Charts**: Chart.js / Recharts  
- **Payment Gateway**: Razorpay (UPI, Cards, Netbanking)  
- **Deployment**: Vercel / Netlify / Render

---

## 🔐 Authentication

Admin access is restricted. Only authorized users can log in to manage cars and bookings. Auth flow includes:

- Secure login with email/password or OAuth (if configured)
- Session-based or token-based auth
- Route protection for all admin routes

---


## 📅 Calendar View

All bookings are displayed in an interactive calendar, making it easier to:

- Spot upcoming reservations
- Manage overlapping bookings
- Track booking trends over time

---

## 🚀 Deployment

The frontend is deployed on:

> [https://your-live-site-url.com](https://your-live-site-url.com)  
> *(Replace with actual deployed URL)*

You can deploy your own version using:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
