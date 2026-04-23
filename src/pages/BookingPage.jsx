import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  ChevronRight, 
  User, 
  Phone, 
  Mail, 
  Stethoscope, 
  Clock, 
  MessageSquare,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import SEO from '../components/SEO';

const SERVICES = [
  "General Consultation",
  "Cardiology",
  "Paediatrics",
  "Endocrinology",
  "Dermatology",
  "Wellness Check",
  "Malaria Test",
  "Full Blood Count (FBC)",
  "ECG / ECHO / Scan"
];

const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", 
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", 
  "04:00 PM", "05:00 PM"
];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // GA4 Fast tracking element for generic button clicking (analytics proxy if loaded natively)
    if (window.gtag) {
      window.gtag('event', 'appointment_booked', {
        'service': formData.service
      });
    }

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppLink = () => {
    if (window.gtag) {
      window.gtag('event', 'whatsapp_click_booking');
    }
    const text = `Hello PrimeHeart Clinic, I just booked an appointment for ${formData.service} on ${formData.date} at ${formData.time}. My name is ${formData.fullName}.`;
    return `https://wa.me/2349015676191?text=${encodeURIComponent(text)}`;
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <SEO 
          title="Appointment Confirmation | PrimeHeart Clinic Magboro"
          description="Your medical appointment at PrimeHeart Multispecialist Clinic in Magboro has been successfully booked."
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Request Sent!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you, {formData.fullName.split(' ')[0]}. We've received your request and redirected it to our specialist team. We'll call you shortly to confirm.
          </p>
          <div className="space-y-4">
            <a 
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 bg-[#25D366] text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-green-100"
            >
              Send Confirmation via WhatsApp
            </a>
            <Link 
              to="/" 
              className="block w-full py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold hover:bg-gray-100 transition-all underline underline-offset-4"
            >
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <SEO 
        title="Book Appointment | PrimeHeart Clinic Magboro"
        description="Book an appointment for cardiology, medical laboratory tests, or specialist consultation at PrimeHeart Multispecialist Clinic in Magboro, Ogun State."
      />
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100 relative overflow-hidden">
               {/* Progress Bar */}
               <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / 3) * 100}%` }}
                    className="h-full bg-red-600"
                  />
               </div>

               <form onSubmit={handleSubmit} className="mt-4">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h2 className="text-3xl font-black text-gray-900 mb-6">Patient Information</h2>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input 
                                required
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-red-600 transition-all text-sm font-medium"
                                value={formData.fullName}
                                onChange={e => setFormData({...formData, fullName: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                               <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                               <div className="relative">
                                 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                 <input 
                                   required
                                   type="tel"
                                   placeholder="090..."
                                   className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-red-600 transition-all text-sm font-medium"
                                   value={formData.phone}
                                   onChange={e => setFormData({...formData, phone: e.target.value})}
                                 />
                               </div>
                             </div>
                             <div>
                               <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email (Optional)</label>
                               <div className="relative">
                                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                 <input 
                                   type="email"
                                   placeholder="you@email.com"
                                   className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-red-600 transition-all text-sm font-medium"
                                   value={formData.email}
                                   onChange={e => setFormData({...formData, email: e.target.value})}
                                 />
                               </div>
                             </div>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => formData.fullName && formData.phone && nextStep()}
                          className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-100 hover:bg-red-700 transition-all mt-8"
                        >
                          Next Step <ChevronRight className="w-5 h-5" />
                        </button>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h2 className="text-3xl font-black text-gray-900 mb-6">Service & Schedule</h2>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Required Service</label>
                            <div className="relative">
                              <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <select 
                                required
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-red-600 transition-all text-sm font-medium appearance-none"
                                value={formData.service}
                                onChange={e => setFormData({...formData, service: e.target.value})}
                              >
                                <option value="">Select a service</option>
                                {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Preferred Date</label>
                            <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input 
                                required
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-red-600 transition-all text-sm font-medium"
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                          <button type="button" onClick={prevStep} className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all">Back</button>
                          <button type="button" onClick={() => formData.service && formData.date && nextStep()} className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-all">Select Time</button>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <h2 className="text-3xl font-black text-gray-900 mb-6">Choose Time</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                           {TIME_SLOTS.map(t => (
                             <button
                               key={t}
                               type="button"
                               onClick={() => setFormData({...formData, time: t})}
                               className={cn(
                                 "py-3 rounded-2xl text-sm font-bold border transition-all",
                                 formData.time === t 
                                  ? "bg-red-600 text-white border-red-600 shadow-md" 
                                  : "bg-white text-gray-600 border-gray-100 hover:border-red-200"
                               )}
                             >
                               {t}
                             </button>
                           ))}
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Additional Notes (Optional)</label>
                           <textarea
                             rows="3"
                             placeholder="Is there anything else we should know?"
                             className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-red-600 transition-all text-sm font-medium resize-none"
                             value={formData.notes}
                             onChange={e => setFormData({...formData, notes: e.target.value})}
                           />
                        </div>
                        <div className="flex gap-4 mt-8">
                          <button type="button" onClick={prevStep} className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all" disabled={loading}>Back</button>
                          <button 
                            type="submit" 
                            disabled={!formData.time || loading}
                            className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-bold shadow-xl shadow-red-200 hover:bg-red-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                          >
                            {loading ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                              "Confirm Appointment"
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </form>
            </div>
          </div>

          {/* Info Side */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-900 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Clinic Info</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                   <Clock className="w-5 h-5 text-red-500 shrink-0" />
                   <div>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Clinic Hours</p>
                     <p className="text-sm">Mon - Sun: 24/7</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <MessageSquare className="w-5 h-5 text-red-500 shrink-0" />
                   <div>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Need Help?</p>
                     <p className="text-sm">Call 09015676191</p>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-3xl p-8 border border-red-100">
               <h4 className="font-black text-red-900 mb-4 uppercase text-xs tracking-widest">Why book online?</h4>
               <ul className="space-y-3">
                  {["Guaranteed time slot", "Instant confirmation", "Priority triage", "Automated notification"].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-red-700">
                      <CheckCircle2 className="w-4 h-4" /> {item}
                    </li>
                  ))}
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
