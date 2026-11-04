# myHRSG - Elevating HR Professionals
## Exclusive Community for Human Resource Leaders

Welcome to **myHRSG**, an exclusive, state-of-the-class platform engineered to connect, empower, and elevate HR professionals across cities and companies. 

This platform serves as a modern dashboard, knowledge hub, and networking bridge featuring extremely robust two-tier security.

---

### 🔥 Key Features
- **Role-Based Workflows**: Tailored, dual-mode views protecting standard community content from powerful "Admin-Only" managerial dashboard features.
- **Dynamic Secure Authentication**: Completely password-free environments. Choose between instant OAuth using **LinkedIn**, or Magic-Link powered email verification.
- **Enterprise-Grade Two Factor Security**: Both Admins and Members are forced through a strict 6-digit OTP confirmation pipeline to verify session tokens statically and dynamically.
- **Premium Glassmorphism Design**: Fluid interface designs, interactive hover states, micro-animations, and modern SVG implementations engineered with **Vanilla CSS** and Tailwind conventions.
- **Member Approval System**: Users must be explicitly verified and approved by myHRSG Admins before gaining full ecosystem capabilities.

### 🛠️ Tech Stack
- **Frontend**: React + Vite + TailwindCSS + Motion (Framer)
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose Schema Architecture)
- **Authentication**: JWT (+ OAuth via LinkedIn / Nodemailer)

### 🚀 Getting Started

#### Prerequisites
- Node.js (v18+)
- Local or Atlas MongoDB Cluster URL
- Valid SMTP Email credentials for triggering OTP sequences.

#### 1. Configure the Backend
Navigate to the `server/` directory and configure your `.env` file:
```shell
cd server
npm i

# Ensure your .env has:
MONGO_URI=your_cluster_url
JWT_SECRET=your_secret_crypto_string
EMAIL_USER=your_smtp_address
EMAIL_PASS=your_smtp_app_password
LINKEDIN_CLIENT_ID=your_linkedin_key
LINKEDIN_CLIENT_SECRET=your_linkedin_secret
APP_URL=http://localhost:5173
```
Start the backend daemon:
```shell
npm run dev
```

#### 2. Start the Frontend
Navigate to the `client/` directory and spin up Vite:
```shell
cd client
npm i
npm run dev
```

*(By default, this project is served natively on port 5173 while the API bridges across proxy from port 5000).*

---
*Developed with a strict focus on modern web aesthetics, performance, and uncompromised application security.*
