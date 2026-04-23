import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { doctors as staticDoctors } from '../data/clinicData';
import { Award, Star, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import SEO from '../components/SEO';

export default function DoctorsPage() {
  const doctorsRef = collection(db, 'doctors');
  const [value, loading] = useCollection(doctorsRef);

  const doctors = useMemo(() => {
    if (!value || value.empty) return staticDoctors;
    return value.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }, [value]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>
  );
  return (
    <div className="bg-white min-h-screen">
      <SEO 
        title="Our Specialists & Doctors in Magboro | PrimeHeart Clinic"
        description="Meet the best cardiologists, pediatricians, and specialists  at PrimeHeart Multispecialist Clinic. Book your appointment today."
      />
      {/* Hero */}
      <section className="bg-gray-900 pt-16 pb-32 px-6 md:px-12 text-center text-white">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            Meet Our World-Class <br /> <span className="text-red-500">Medical Experts</span> 
          </motion.h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
            Dedicated specialists  with decades of combined experience in various medical fields. Your health is safe in our hands.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {doctors.map((doctor, index) => (
            <motion.div 
              key={doctor.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative mb-8 rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl shadow-gray-200">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                <div className="absolute bottom-10 left-10 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-500 mb-2">
                    <Star className="w-3 h-3 fill-red-500" /> Specialist
                  </div>
                  <h3 className="text-3xl font-black">{doctor.name}</h3>
                </div>
              </div>

              <div className="px-4 space-y-6">
                <div className="flex flex-wrap gap-4">
                  <Badge icon={<Award className="w-4 h-4" />} text={doctor.qualification} />
                  <Badge icon={<Clock className="w-4 h-4" />} text={`${doctor.experience} Exp.`} />
                </div>
                
                <div>
                  <p className="text-red-600 font-bold text-sm uppercase tracking-widest mb-2">{doctor.specialty}</p>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">
                    {doctor.bio}
                  </p>
                </div>

                <Link 
                  to="/book"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 hover:bg-red-600 text-white rounded-2xl font-black transition-all shadow-xl shadow-gray-100"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Visit
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Badge({ icon, text }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
      {icon}
      <span>{text}</span>
    </div>
  );
}
