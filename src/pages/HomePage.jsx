import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import SEO from '../components/SEO';
import { 
  Heart, 
  ShieldCheck, 
  Clock, 
  MapPin,
  Phone,
  Users, 
  Stethoscope, 
  FlaskConical, 
  Activity, 
  Pill,
  ArrowRight,
  Star,
  ChevronDown,
  Monitor,
  Sparkles,
  Microscope,

} from 'lucide-react';

const services = [
  { 
    title: "General Consultation", 
    description: "Expert primary care for individuals and families. Comprehensive health assessments and diagnosis in Magboro.", 
    icon: <Stethoscope className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600"
  },
  { 
    title: "Cardiology", 
    description: "Comprehensive heart care and diagnostic services provided by expert cardiologists in Magboro.", 
    icon: <Heart className="w-6 h-6" />,
    color: "bg-red-50 text-red-600"
  },
  { 
    title: "Paediatrics", 
    description: "Specialized medical care for infants, children, and adolescents.", 
    icon: <Users className="w-6 h-6" />,
    color: "bg-indigo-50 text-indigo-600"
  },
  { 
    title: "Endocrinology", 
    description: "Treatment for hormone-related conditions and metabolic disorders.", 
    icon: <Activity className="w-6 h-6" />,
    color: "bg-amber-50 text-amber-600"
  },
  { 
    title: "Dermatology", 
    description: "Comprehensive skin, hair, and nail care. Expert treatment for acute and chronic skin conditions.", 
    icon: <Sparkles className="w-6 h-6" />,
    color: "bg-pink-50 text-pink-600"
  },
  { 
    title: "Diagnostics & Imaging", 
    description: "Advanced imaging including ECG, ECHO scan, and specialized scans in Ogun State.", 
    icon: <Monitor className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600"
  },
  { 
    title: "Laboratory Services", 
    description: "On-site medical laboratory in Magboro for malaria, LFT, and full blood counts.", 
    icon: <Microscope className="w-6 h-6" />,
    color: "bg-emerald-50 text-emerald-600"
  },
  { 
    title: "Pharmacy", 
    description: "Fully stocked in-house pharmacy for all your prescription needs.", 
    icon: <Pill className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600"
  }
];

const testimonials = [
  {
    name: "Adebisi Oluchi",
    role: "Patient",
    text: "The care I received at PrimeHeart was exceptional. The staff are professional and it is truly the best hospital in Magboro.",
  },
  {
    name: "John Okafor",
    role: "Patient",
    text: "Booking an appointment was so easy. I didn't have to wait for hours for my medical laboratory tests. Highly recommended.",
  }
];

const faqs = [
  {
    question: "Where is PrimeHeart Multispecialist Clinic located?",
    answer: "We are proudly located in Magboro, Ogun State, Nigeria. We provide high-quality medical services to Magboro and neighboring communities."
  },
  {
    question: "Do you have a cardiologist in Magboro?",
    answer: "Yes, our clinic has expert cardiologists available. We conduct comprehensive cardiovascular evaluations including ECG and ECHO scans right here in Ogun State."
  },
  {
    question: "What tests are available at your medical laboratory?",
    answer: "Our medical laboratory in Magboro offers a wide range of tests including Full Blood Count (FBC), Malaria tests, Liver Function Tests (LFT), lipid profiles, and more."
  },
  {
    question: "How do I book an appointment?",
    answer: "You can book an appointment easily through our website using the 'Book Appointment' button, or by calling our hotline. We accept both walk-in and scheduled appointments."
  }
];

export default function HomePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "PrimeHeart Multispecialist Clinic",
    "image": "https://ik.imagekit.io/4lndq5ke52/primelogo1.png?",
    "@id": "https://primeheartclinic.com",
    "url": "https://primeheartclinic.com",
    "telephone": "+2349015676191",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Magboro",
      "addressRegion": "Ogun State",
      "addressCountry": "NG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 6.8182, 
      "longitude": 3.3985
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="flex flex-col">
      <SEO 
        title="PrimeHeart Multispecialist Clinic | Best Hospital in Magboro"
        description="Looking for the best hospital in Magboro, Ogun State? PrimeHeart Multispecialist Clinic offers expert cardiology, medical laboratory, ECG, ECHO scans, and general healthcare."
        schema={[schema, faqSchema]}
      />
      
      {/* Hero Section */}
      <section className="relative pt-2 pb-24 md:pt-8 md:pb-40 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-red-50/30 rounded-l-[100px] hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4" />
              Trusted Multispecialist Care
            </div>
            <h1 className="text-4xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8">
              Quality <span className="text-red-600">Multispecialist</span> Care You Can Trust
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
              Experience premium healthcare with our team of specialists. We offer diagnostics, laboratory, and pharmacy services all under one roof.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/book" 
                className="px-8 py-4 bg-red-600 text-white rounded-full font-bold text-lg text-center shadow-xl shadow-red-200 hover:bg-red-700 hover:scale-105 transition-all"
              >
                Book Appointment
              </Link>
              <a 
                href="tel:09015676191" 
                className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-full font-bold text-lg text-center hover:border-red-600 transition-all flex items-center justify-center gap-2"
              >
                Call Clinic
              </a>
            </div>
            
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-900">Certified Specialists</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                <Activity className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-blue-900">Advanced Diagnostics</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
             <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative">
                <img 
                  src="https://ik.imagekit.io/4lndq5ke52/prime1.jpeg?q=80&w=2070&auto=format&fit=crop" 
                  alt="Modern Hospital Clinic" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
             </div>
             {/* Floating Info Card */}
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block"
             >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Open 24/7</h3>
                    <p className="text-xs text-gray-500">Emergency Services</p>
                  </div>
                </div>
             </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Our Specialist Services</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Providing a wide range of specialized medical diagnostics and healthcare services.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", service.color)}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{service.description}</p>
                <Link to="/book" className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:gap-3 transition-all">
                  Book Now <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop" className="rounded-3xl shadow-lg h-64 w-full object-cover" alt="Health" referrerPolicy="no-referrer" />
                  <div className="bg-red-600 p-8 rounded-3xl text-white">
                    <h4 className="text-4xl font-bold mb-1">10+</h4>
                    <p className="text-sm opacity-80">Specialist Doctors</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-900 p-8 rounded-3xl text-white">
                    <h4 className="text-4xl font-bold mb-1">3k+</h4>
                    <p className="text-sm opacity-80">Annual Consultations</p>
                  </div>
                  <img src="https://ik.imagekit.io/4lndq5ke52/primeservice.jpeg?q=80&w=2053&auto=format&fit=crop" className="rounded-3xl shadow-lg h-72 w-full object-cover" alt="Clinic" referrerPolicy="no-referrer" />
                </div>
             </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">Patient-Centered Care that Puts You First</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Modern Facilities</h4>
                  <p className="text-gray-500 text-sm">Equipped with the latest medical diagnostics technology in Ogun State.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Expert Team</h4>
                  <p className="text-gray-500 text-sm">Our specialists bring years of experience from top hospitals globally.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Zero Wait Time</h4>
                  <p className="text-gray-500 text-sm">Our online booking system ensures you are seen exactly when scheduled.</p>
                </div>
              </div>
            </div>
            <div className="mt-12">
               <Link to="/book" className="inline-flex items-center gap-3 font-bold text-gray-900 group">
                  Start Your Health Journey <span className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all"><ArrowRight className="w-5 h-5" /></span>
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-red-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Patient Experiences</h2>
            <p className="opacity-80">Don't just take our word for it. Hear from our patients.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20">
                <p className="text-lg italic mb-8">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold">{t.name}</h5>
                    <p className="text-xs opacity-60 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Frequently Asked <span className="text-red-600">Questions</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Get quick answers about our location, cardiology services, diagnostic scans, and appointment process.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-white border border-gray-200 rounded-3xl overflow-hidden [&_summary::-webkit-details-marker]:hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                <summary className="flex items-center justify-between px-8 py-6 font-bold text-gray-900 md:text-lg">
                  {faq.question}
                  <span className="ml-4 flex-shrink-0 bg-red-50 text-red-600 rounded-full p-2 group-open:-rotate-180 transition-transform duration-300">
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </summary>
                <div className="px-8 pb-6 text-gray-600 text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
               <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">Visit Our <span className="text-red-600">Clinic</span></h2>
               <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Address</h4>
                      <p className="text-gray-500 text-sm">60 Miracle Ave, Magboro 121101, Ogun State</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Contact</h4>
                      <p className="text-gray-500 text-sm">09015676191</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Working Hours</h4>
                      <p className="text-gray-500 text-sm">Open 24/7 for Emergencies</p>
                    </div>
                  </div>
               </div>
               <div className="mt-10">
                  <Link to="/book" className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black transition-all hover:bg-black group">
                    Book Visit Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>
            
            <div className="lg:col-span-2 relative h-[450px] rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200 border border-gray-100">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.403928820641!2d3.4090338!3d6.720465600000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b95ca9f48d749%3A0xe81054ec3f835847!2sPrimeHeart%20Multispecialist%20Clinic!5e0!3m2!1sen!2sng!4v1776862065132!5m2!1sen!2sng" 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 allowFullScreen="" 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
                 title="Clinic Location"
                 className="contrast-[1.2] transition-all duration-700"
               />
               <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-gray-100 hidden md:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Easy Navigation</p>
                  <p className="text-xs font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Get Directions via GPS
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
