import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { Heart, Lock, Key, Mail } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === 'auth/network-request-failed') {
        setError("Network connection blocked. Please disable any AD-BLOCKERS (like uBlock Origin or Brave Shields). If you are viewing this in the Studio Preview, try clicking 'Open Full Screen' or open the app URL in a new browser tab.");
      } else {
        setError("Failed to sign in. Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gray-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <img src="https://ik.imagekit.io/4lndq5ke52/primelogo1.png?" alt="PrimeHeart Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">PrimeHeart CMS</h1>
          <p className="text-gray-500 text-sm font-medium">Clinic Management System Login</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl font-bold text-center">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 text-gray-400 mb-2">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Admin Access Only</span>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all"
                  placeholder="Admin Email"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-100 hover:bg-red-700 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center text-xs text-gray-400 font-medium">
          Forgot your credentials? Contact IT Support.
        </div>
      </motion.div>
    </div>
  );
}
