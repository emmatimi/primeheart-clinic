import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { services } from '../data/clinicData';
import { CheckCircle, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = services.find(s => s.slug === slug);

  if (!service) return <Navigate to="/services" replace />;

  return (
    <div className="bg-white min-h-screen">
      <SEO 
        title={`${service.title} in Magboro, Ogun State | PrimeHeart Clinic`}
        description={`Get expert ${service.title}  at PrimeHeart Multispecialist Clinic. Serving our patient with advanced facilities and experienced healthcare professionals.`}
      />
      {/* Detail Header */}
      <section className="relative h-[60vh] flex items-end">
        <div className="absolute inset-0 z-0">
          <img src={service.image} alt={`${service.title} clinic in Magboro`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-16 w-full">
          <Link to="/services" className="inline-flex items-center gap-2 text-gray-900 font-bold mb-8 hover:text-red-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-black text-gray-900"
          >
            {service.title}
          </motion.h1>
          <p className="mt-4 text-xl font-bold tracking-tight text-red-600 bg-white/80 inline-block px-4 py-2 rounded-xl backdrop-blur-sm">
            Your wellness is our priority
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-6">What We Do</h2>
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                {service.description}
              </p>
              <p className="text-gray-600 text-lg font-medium leading-relaxed mt-4">
                At PrimeHeart Multispecialist Clinic located in Magboro, Ogun State, we prioritize your health. Our dedicated {service.title} department uses modern diagnostic equipment to provide high-quality healthcare.
              </p>
            </div>

            <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-8">When To Visit Our {service.title} Center</h2>
              <p className="mb-6 text-gray-600">If you are in Ogun State or its environs and experience any of the following symptoms, we advise booking a consultation with our experts immediately.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.symptoms.map((symptom, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                    <CheckCircle className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-gray-700">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-red-600 p-8 rounded-[3rem] text-white shadow-2xl shadow-red-200">
              <h3 className="text-2xl font-black mb-4 italic">Ready to feel better?</h3>
              <p className="font-medium mb-8 opacity-90">Schedule your consultation with our {service.title} specialists in Magboro today.</p>
              
              <Link 
                to="/book" 
                className="w-full flex items-center justify-between px-8 py-5 bg-white text-red-600 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all group"
              >
                Book Appointment
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <p className="text-center text-xs font-bold uppercase tracking-widest mt-6 opacity-60">
                100% Secure & Confidential
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
