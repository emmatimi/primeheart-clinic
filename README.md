# PrimeHeart Multispecialist Clinic

PrimeHeart Multispecialist Clinic is a modern healthcare web application built to provide a seamless appointment booking and clinic management experience. Located in Magboro, Ogun State, the app enables patients to easily access medical services online while ensuring clinic operations are streamlined in the admin panel.

## Key Features
- **Patient Booking System:** An easy-to-use, multi-step interface for patients to schedule appointments with specific specialists (Cardiology, Paediatrics, Dermatology, etc.).
- **Specialist Profiles:** A dedicated section detailing the hospital's experienced doctors, their qualifications, and their specialties.
- **Service Listings:** Detailed information on all available medical services, laboratories, and diagnostics offered by the clinic.
- **Admin Dashboard (CMS):** A secure login area for clinic administrators to view, manage, and update patient appointment statuses.
- **Automated Email Notifications:** Sends instant email confirmations and updates to both patients and clinic staff when an appointment is booked or confirmed.
- **Responsive UI:** A beautifully polished, mobile-first design leveraging Tailwind CSS and Framer Motion.

## Tech Stack
- **Frontend:** React 18, Vite, React Router, Tailwind CSS, Lucide React (Icons), Framer Motion (Animations)
- **Backend / API:** Express.js, Firebase (Firestore Database & Auth for Admin)
- **External Services:** Nodemailer (Email Delivery Setup)

## Setup & Local Development
To run this application locally on your machine:

1. Clone the repository and navigate into the folder.
2. Install the required Node packages:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your environment variables (Firebase config, Email service details).
4. Run the development server:
   ```bash
   npm run dev
   ```
   *Note: This command spins up both the Vite frontend and Express backend concurrently on port 3000.*

## Deployment
To build the application for a production environment:

1. Build static assets:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```
