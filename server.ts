import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { initializeApp, getApps } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc 
} from "firebase/firestore";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy initialize Firebase Client SDK on server
function getDb() {
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    firestoreDatabaseId: process.env.VITE_FIREBASE_DATABASE_ID || "(default)"
  };

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error("Missing Firebase configuration environment variables.");
  }

  const apps = getApps();
  const firebaseApp = apps.length ? apps[0] : initializeApp(firebaseConfig);
  return getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || "(default)");
}

// Email utility function for consistency
async function sendClinicEmail({ to, subject, patientName, content, type }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email credentials missing. Type:", type, "to:", to);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"PrimeHeart Multispecialist Clinic" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a; border: 1px solid #f0f0f0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://ik.imagekit.io/4lndq5ke52/primelogo1.png?" alt="PrimeHeart Logo" style="width: 80px; height: auto; margin-bottom: 10px;" />
          <h1 style="color: #dc2626; margin: 0; font-size: 24px;">PrimeHeart</h1>
          <p style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px;">Multispecialist Clinic</p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${patientName}</strong>,</p>
        
        <div style="font-size: 15px; line-height: 1.6;">
          ${content}
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
          <p style="font-size: 14px; margin-bottom: 5px;"><strong>Best regards,</strong></p>
          <p style="font-size: 14px; color: #dc2626; font-weight: bold; margin: 0;">PrimeHeart Multispecialist Clinic</p>
          <p style="font-size: 12px; color: #666; margin-top: 10px;">
             Magboro, Ogun State, Nigeria<br>
             Tel: 09015676191
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${type} to ${to}`);
  } catch (error) {
    console.error(`Error sending ${type} email:`, error);
    throw error;
  }
}

// API Routes
app.post("/api/appointments", async (req, res) => {
  try {
    const appointmentData = req.body;
    const { fullName, email, phone, service, date, time } = appointmentData;
    
    // 1. Save to Firestore
    const db = getDb();
    const docRef = await addDoc(collection(db, "appointments"), {
      ...appointmentData,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    // 2. Notify Clinic (Existing behavior)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await sendClinicEmail({
        to: process.env.RECEIVER_EMAIL || "primeheartmultispecialisthosp@gmail.com",
        subject: `New Appointment Request [Ref: ${docRef.id.slice(0, 6).toUpperCase()}] - PrimeHeart Clinic`,
        patientName: "Admin",
        type: "Clinic Notification",
        content: `
          <p>A new appointment request has been received (Ref: <strong>${docRef.id.slice(0, 6).toUpperCase()}</strong>):</p>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Patient:</strong> ${fullName}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Email:</strong> ${email || "Not provided"}</li>
            <li><strong>Service:</strong> ${service}</li>
            <li><strong>Date:</strong> ${date}</li>
            <li><strong>Time:</strong> ${time}</li>
          </ul>
        `
      });

      // 3. Send Acknowledgment to Patient
      if (email) {
        await sendClinicEmail({
          to: email,
          subject: `Appointment Request Received [Ref: ${docRef.id.slice(0, 6).toUpperCase()}] – PrimeHeart Clinic`,
          patientName: fullName,
          type: "Patient Acknowledgment",
          content: `
            <p>Thank you for booking an appointment with PrimeHeart Multispecialist Clinic.</p>
            <p>Your request (Ref: <strong>${docRef.id.slice(0, 6).toUpperCase()}</strong>) has been received and is currently being reviewed by our team.</p>
            <p>You will receive a confirmation email once your appointment is approved.</p>
            <p>Thank you for choosing us.</p>
            <p style="font-size: 10px; color: #fff; opacity: 0.1;">Timestamp: ${new Date().toISOString()}</p>
          `
        });
      }
    }

    res.status(201).json({ id: docRef.id, message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ error: "Failed to book appointment" });
  }
});

app.patch("/api/appointments/:id", async (req, res) => {
  const { id } = req.params;
  const { status, appointmentData } = req.body;

  try {
    // Note: Firestore update is now handled on the client-side by authenticated admin
    // because the server (using client SDK) would hit PERMISSION_DENIED without auth.
    
    // Trigger Confirmation Email if status is "confirmed"
    if (status === "confirmed" && appointmentData && appointmentData.email) {
      const { fullName, email, date, time, service } = appointmentData;
      
      await sendClinicEmail({
        to: email,
        subject: `Your Appointment is Confirmed [Ref: ${id.slice(0, 6).toUpperCase()}] – PrimeHeart Clinic`,
        patientName: fullName,
        type: "Patient Confirmation",
        content: `
          <p>Your appointment with PrimeHeart Multispecialist Clinic has been successfully confirmed (Ref: <strong>${id.slice(0, 6).toUpperCase()}</strong>).</p>
          <div style="background: #fef2f2; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>⏰ Time:</strong> ${time}</p>
            <p style="margin: 5px 0;"><strong>🩺 Service:</strong> ${service}</p>
          </div>
          <p><strong>📍 Location:</strong><br>
          PrimeHeart Multispecialist Clinic<br>
          60 Miracle Ave, Magboro 121101<br>
          Ogun State, Nigeria<br>
          <a href="https://www.google.com/maps/search/?api=1&query=PrimeHeart+Multispecialist+Clinic+Magboro" target="_blank" style="color: #dc2626; text-decoration: underline; font-size: 14px; font-weight: bold; display: inline-block; margin-top: 5px;">Get Directions on Google Maps</a></p>
          <p>We encourage you to arrive a few minutes early for a smooth consultation.</p>
          <p>If you have any questions or need to reschedule, feel free to contact us.</p>
          <p>We look forward to taking care of you.</p>
          <p style="font-size: 10px; color: #fff; opacity: 0.1;">Timestamp: ${new Date().toISOString()}</p>
        `
      });
    }

    res.status(200).json({ message: "Appointment updated successfully" });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Failed to update appointment" });
  }
});

// Serve frontend
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;

if (process.env.NODE_ENV !== "production") {
  startServer();
}
