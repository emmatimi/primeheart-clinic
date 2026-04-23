import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Heart, Menu, X, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdmin = location.pathname.startsWith('/admin');

  React.useEffect(() => {
    if (isAdmin) {
      const handleOpen = () => setIsMenuOpen(true);
      const handleClose = () => setIsMenuOpen(false);
      window.addEventListener('admin-sidebar-opened', handleOpen);
      window.addEventListener('admin-sidebar-closed', handleClose);
      return () => {
        window.removeEventListener('admin-sidebar-opened', handleOpen);
        window.removeEventListener('admin-sidebar-closed', handleClose);
      };
    }
  }, [isAdmin]);

  const logoUrl = "https://ik.imagekit.io/4lndq5ke52/primelogo1.png?";

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[110] h-[72px] border-b border-gray-100 transition-all duration-300",
        isMenuOpen ? "bg-white" : "bg-white/80 backdrop-blur-md"
      )}>
        <div className={cn(
          "h-full flex justify-between items-center",
          isAdmin ? "px-6 w-full" : "max-w-7xl mx-auto px-6 md:px-12"
        )}>
          <Link to="/" className="flex items-center gap-3 z-[110] shrink-0" onClick={closeMenu}>
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shrink-0">
              <img 
                src={logoUrl} 
                alt="PrimeHeart Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-[15px] sm:text-lg md:text-xl leading-none tracking-tight text-gray-900 truncate max-w-[140px] sm:max-w-none">
                PrimeHeart
              </span>
              <span className="text-[7.5px] sm:text-[9px] md:text-[10px] font-bold text-red-600 uppercase tracking-[0.2em] mt-1 block">
                Multispecialist
              </span>
            </div>
          </Link>
    
          <div className="flex items-center gap-6">
            {!isAdmin && (
              <div className="hidden lg:flex items-center gap-8 text-sm font-black uppercase tracking-widest text-gray-400">
                 <Link to="/" className={cn("hover:text-red-600 transition-colors", location.pathname === "/" && "text-red-600")}>Home</Link>
                 <Link to="/services" className={cn("hover:text-red-600 transition-colors", location.pathname.startsWith("/services") && "text-red-600")}>Services</Link>
                 <Link to="/doctors" className={cn("hover:text-red-600 transition-colors", location.pathname.startsWith("/doctors") && "text-red-600")}>Specialists</Link>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {!isAdmin && (
                <a
                  href="tel:09015676191"
                  className="hidden xl:flex items-center gap-2 px-4 py-2 text-xs font-black text-gray-900 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <Phone className="w-4 h-4 text-red-600" />
                  09015676191
                </a>
              )}
              
              <div className="hidden lg:block">
                <Link
                  to={isAdmin ? "/admin" : "/book"}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-red-100 transition-all active:scale-95"
                >
                  {isAdmin ? "Dashboard" : "Book Appointment"}
                </Link>
              </div>
    
              {(isAdmin || !isAdmin) && (
                <button 
                  onClick={() => {
                    if (isAdmin) {
                      window.dispatchEvent(new CustomEvent('toggle-admin-sidebar'));
                    } else {
                      setIsMenuOpen(!isMenuOpen);
                    }
                  }}
                  className="lg:hidden relative z-[110] p-2 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 transition-all ml-2"
                  aria-label="Toggle Menu"
                >
                  {isMenuOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Menu className="w-5 h-5 md:w-6 md:h-6" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay Background */}
      {!isAdmin && (
        <div 
          className={cn(
            "fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-500",
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Content Overlay */}
      {!isAdmin && (
        <div className={cn(
          "fixed top-[72px] left-0 right-0 bottom-0 bg-white z-[105] lg:hidden transition-all duration-500 ease-in-out transform overflow-y-auto shadow-2xl",
          isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        )}>
          <div className="pt-6 px-6 flex flex-col min-h-full justify-between pb-10">
            <div className="space-y-4">
              {!isAdmin ? (
                <>
                  <Link to="/" onClick={closeMenu} className="block group">
                    <div className={cn("flex items-center justify-between p-6 rounded-2xl group-hover:bg-red-50 transition-all", location.pathname === "/" ? "bg-red-50" : "bg-gray-50")}>
                      <span className={cn("text-xl font-black uppercase tracking-widest group-hover:text-red-600", location.pathname === "/" ? "text-red-600" : "text-gray-900")}>Home</span>
                    </div>
                  </Link>
                  <Link to="/services" onClick={closeMenu} className="block group">
                    <div className={cn("flex items-center justify-between p-6 rounded-2xl group-hover:bg-red-50 transition-all", location.pathname.startsWith("/services") ? "bg-red-50" : "bg-gray-50")}>
                      <span className={cn("text-xl font-black uppercase tracking-widest group-hover:text-red-600", location.pathname.startsWith("/services") ? "text-red-600" : "text-gray-900")}>Services</span>
                    </div>
                  </Link>
                  <Link to="/doctors" onClick={closeMenu} className="block group">
                    <div className={cn("flex items-center justify-between p-6 rounded-2xl group-hover:bg-red-50 transition-all", location.pathname.startsWith("/doctors") ? "bg-red-50" : "bg-gray-50")}>
                      <span className={cn("text-xl font-black uppercase tracking-widest group-hover:text-red-600", location.pathname.startsWith("/doctors") ? "text-red-600" : "text-gray-900")}>Specialists</span>
                    </div>
                  </Link>
                  <a href="tel:09015676191" className="flex items-center gap-4 p-6 bg-red-50/50 rounded-2xl text-red-600 font-bold border border-red-100">
                    <Phone className="w-5 h-5 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest font-black opacity-60">Call Emergency</span>
                      <span className="text-lg">09015676191</span>
                    </div>
                  </a>
                </>
              ) : null}
            </div>

            {!isAdmin && (
              <Link
                to="/book"
                onClick={closeMenu}
                className="w-full py-6 bg-red-600 text-white rounded-2xl text-center font-black uppercase tracking-widest shadow-2xl shadow-red-200 mt-6 active:scale-95 transition-all"
              >
                Book Appointment Now
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
