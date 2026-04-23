import React from 'react';
import { motion } from 'motion/react';
import { services } from '../data/clinicData';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

export default function ServicesPage() {
  return (
    <div className="bg-white min-h-screen">
      <SEO 
        title="Medical Services | PrimeHeart Multispecialist Clinic Magboro"
        description="Explore our specialized medical services in Magboro, Ogun State. From expert cardiology and medical laboratory tests to general healthcare and diagnostics."
      />

      {/* Hero Section */}
      <section className="bg-gray-50 pt-10 pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-6"
          >
            Our Medical <span className="text-red-600">Services</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto font-medium"
          >
            PrimeHeart Multispecialist Clinic offers a comprehensive range of health services tailored to your needs in Ogun State. Reach out to our specialists today.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-gray-100 transition-all flex flex-col"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={`${service.title} services at PrimeHeart Clinic Magboro`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h2 className="text-2xl font-black text-gray-900 mb-4">{service.title}</h2>
                <p className="text-gray-500 text-sm font-medium mb-6 line-clamp-3">
                  {service.description}
                </p>
                <div className="space-y-2 mb-8 flex-1">
                  {service.symptoms.slice(0, 3).map((symptom, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <CheckCircle className="w-3 h-3 text-red-600" />
                      <span>{symptom}</span>
                    </div>
                  ))}
                </div>
                <Link 
                  to={`/services/${service.slug}`}
                  className="flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-red-600 text-gray-900 hover:text-white rounded-2xl font-bold transition-all group"
                  title={`Learn more about ${service.title} in Magboro`}
                >
                  View Details
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
