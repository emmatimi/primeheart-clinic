import React, { useState, useMemo } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { 
  collection, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  where,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { 
  BarChart3, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  Phone,
  Mail, 
  MoreVertical,
  Trash2,
  Eye,
  ExternalLink,
  ChevronRight,
  LogOut,
  User,
  Activity,
  UserCheck,
  TrendingUp,
  UploadCloud,
  Award,
  Image as ImageIcon,
  Upload,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { signOut } from 'firebase/auth';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const performanceData = [
  { name: 'Mon', bookings: 4 },
  { name: 'Tue', bookings: 7 },
  { name: 'Wed', bookings: 5 },
  { name: 'Thu', bookings: 8 },
  { name: 'Fri', bookings: 12 },
  { name: 'Sat', bookings: 9 },
  { name: 'Sun', bookings: 6 },
];

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview'); // overview, appointments, staff

  const appointmentsRef = collection(db, 'appointments');
  const q = query(appointmentsRef, orderBy('createdAt', 'desc'));
  const [value, loading, error] = useCollection(q);

  const appointments = useMemo(() => {
    if (!value) return [];
    return value.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }, [value]);

  // Specialists/Doctors Management
  const doctorsRef = collection(db, 'doctors');
  const [doctorsVal, doctorsLoading] = useCollection(doctorsRef);
  const currentDoctors = useMemo(() => {
    if (!doctorsVal) return [];
    return doctorsVal.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }, [doctorsVal]);

  const [editingDoctor, setEditingDoctor] = useState(null);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(null);
  const [deleteConfig, setDeleteConfig] = useState(null); // { id, type, name, onConfirm }
  const [statusUpdating, setStatusUpdating] = useState(null); // id of updating appointment
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewingAppointment, setViewingAppointment] = useState(null);

  React.useEffect(() => {
    const handleToggle = () => setIsSidebarMobileOpen(prev => !prev);
    window.addEventListener('toggle-admin-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-admin-sidebar', handleToggle);
  }, []);

  React.useEffect(() => {
    if (isSidebarMobileOpen) {
      window.dispatchEvent(new CustomEvent('admin-sidebar-opened'));
    } else {
      window.dispatchEvent(new CustomEvent('admin-sidebar-closed'));
    }
  }, [isSidebarMobileOpen]);

  const handleSaveDoctor = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const doctorData = Object.fromEntries(formData.entries());
    
    // Ensure bio is trimmed
    doctorData.bio = doctorData.bio?.trim();
    
    // Prioritize the uploaded image data URL if present
    if (uploadingImage) {
      doctorData.image = uploadingImage;
    }
    
    if (!doctorData.image) {
      alert("Please upload a specialist profile image.");
      return;
    }
    
    try {
      if (editingDoctor) {
        await updateDoc(doc(db, 'doctors', editingDoctor.id), doctorData);
      } else {
        await addDoc(collection(db, 'doctors'), doctorData);
      }
      setEditingDoctor(null);
      setIsAddingDoctor(false);
      setUploadingImage(null);
    } catch (err) {
      console.error("Firestore Save Error:", err);
      alert(`Error saving doctor info: ${err.message}`);
    }
  };

  const handleDeleteDoctor = (docItem) => {
    setDeleteConfig({
      id: docItem.id,
      title: "Delete Specialist",
      message: `Are you sure you want to remove ${docItem.name} from the staff registry? This action cannot be undone.`,
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await deleteDoc(doc(db, 'doctors', docItem.id));
          setDeleteConfig(null);
          setSuccessMessage(`Dr. ${docItem.name} has been removed.`);
          setTimeout(() => setSuccessMessage(null), 5000);
        } catch (error) {
          console.error("Error deleting doctor:", error);
          alert("Failed to delete the specialist. You may not have the required permissions.");
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  const liveChartData = useMemo(() => {
    // Generate last 7 days including today
    const chartLabels = [];
    const counts = {};
    const details = {}; // Store scheduled dates for tooltip
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = format(d, 'EEE');
      chartLabels.push(dayName);
      counts[dayName] = 0;
      details[dayName] = [];
    }

    if (appointments.length === 0) {
      return chartLabels.map(name => ({ name, bookings: 0, scheduledDates: '' }));
    }

    // Populate counts from real appointments using 'createdAt' which is when they were made
    appointments.forEach(app => {
      try {
        let date;
        if (app.createdAt && typeof app.createdAt.toDate === 'function') {
          date = app.createdAt.toDate();
        } else if (app.createdAt) {
          date = new Date(app.createdAt);
        } else {
          date = new Date(app.date + 'T12:00:00');
        }

        if (date && !isNaN(date)) {
          const dayName = format(date, 'EEE');
          if (counts[dayName] !== undefined) {
            counts[dayName]++;
            if (app.date) details[dayName].push(app.date);
          }
        }
      } catch (e) {
        console.error("Error parsing date for chart:", e);
      }
    });

    return chartLabels.map(name => {
      const uniqueDates = [...new Set(details[name])].sort().slice(0, 3);
      const scheduledStr = uniqueDates.length > 0 
        ? `Scheduled for: ${uniqueDates.join(', ')}${details[name].length > 3 ? '...' : ''}`
        : 'No scheduled dates';
        
      return {
        name,
        bookings: counts[name],
        scheduledInfo: scheduledStr,
        fullDate: name // We could put a more descriptive date here if needed
      };
    });
  }, [appointments]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 min-w-[200px]">
          <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">{label} Bookings</p>
          <p className="text-2xl font-black text-gray-900 mb-2">{payload[0].value} New Requests</p>
          <div className="pt-2 border-t border-gray-50">
            <p className="text-[10px] text-gray-400 font-bold leading-tight">
              {payload[0].payload.scheduledInfo}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      const matchesSearch = 
        app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone?.includes(searchTerm) ||
        app.service?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'pending').length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      today: appointments.filter(a => {
        const today = new Date().toISOString().split('T')[0];
        return a.date === today;
      }).length
    };
  }, [appointments]);

  const handleUpdateStatus = async (app, status) => {
    setStatusUpdating(app.id);
    try {
      // 1. Update Firestore directly from client (since we are authenticated as admin)
      const appRef = doc(db, 'appointments', app.id);
      await updateDoc(appRef, { status });

      // 2. Call API to send confirmation email (if confirmed)
      if (status === 'confirmed') {
        await fetch(`/api/appointments/${app.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            status,
            appointmentData: app 
          }),
        });
      }

      setSuccessMessage(`Appointment marked as ${status}.`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error("Error updating appointment:", err);
      alert("Error updating appointment. Please check your connection and try again.");
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleDelete = (app) => {
    setDeleteConfig({
      id: app.id,
      title: "Delete Appointment",
      message: `Are you sure you want to delete the appointment for ${app.fullName}?`,
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await deleteDoc(doc(db, 'appointments', app.id));
          setDeleteConfig(null);
          setSuccessMessage(`Appointment for ${app.fullName} has been deleted.`);
          setTimeout(() => setSuccessMessage(null), 5000);
        } catch (error) {
          console.error("Error deleting appointment:", error);
          alert("Failed to delete the appointment. You may not have the required permissions.");
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  const handleLogout = () => signOut(auth);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Sidebar Toggle - Hidden if open */}

      {/* Sidebar Overlay */}
      {isSidebarMobileOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-gray-100 flex flex-col py-6 px-2 fixed h-[calc(100vh-72px)] top-[72px] z-50 overflow-y-auto transition-transform duration-300 lg:translate-x-0 lg:w-64",
        isSidebarMobileOpen ? "translate-x-0 w-72" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between lg:justify-start gap-2 mb-10 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center p-1 rounded-lg">
              <img src="https://ik.imagekit.io/4lndq5ke52/primelogo1.png" alt="PrimeHeart" className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-lg tracking-tight">PrimeHeart CMS</span>
          </div>
          <button 
            onClick={() => setIsSidebarMobileOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:bg-gray-50 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 space-y-2">
           <SidebarItem 
             icon={<BarChart3 className="w-5 h-5" />} 
             label="Overview" 
             active={activeTab === 'overview'} 
             onClick={() => {
               setActiveTab('overview');
               setIsSidebarMobileOpen(false);
             }}
           />
           <SidebarItem 
             icon={<Calendar className="w-5 h-5" />} 
             label="Appointments" 
             active={activeTab === 'appointments'} 
             onClick={() => {
               setActiveTab('appointments');
               setIsSidebarMobileOpen(false);
             }}
           />
           <SidebarItem 
             icon={<UserCheck className="w-5 h-5" />} 
             label="Staff Management" 
             active={activeTab === 'staff'} 
             onClick={() => {
               setActiveTab('staff');
               setIsSidebarMobileOpen(false);
             }}
           />
        </nav>

        <div className="pt-6 border-t border-gray-100 mt-auto px-4">
           <div className="flex items-center gap-3 mb-6 p-2 rounded-2xl bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                 {auth.currentUser?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                 <p className="text-xs font-bold text-gray-900 truncate">{auth.currentUser?.email}</p>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Administrator</p>
              </div>
           </div>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
           >
              <LogOut className="w-4 h-4" /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen bg-gray-50 pt-[72px] lg:pt-0">
        {/* Sticky Sub-Header */}
        <header className="sticky top-[72px] lg:top-0 z-10 bg-gray-50/80 backdrop-blur-md px-4 md:px-10 py-3 md:py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
           <div className="flex items-center justify-between w-full sm:w-auto">
             <div>
               <h1 className="text-xl md:text-2xl font-black text-gray-900 capitalize leading-none mb-1">{activeTab}</h1>
               <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">Managing Clinic {activeTab}</p>
             </div>
           </div>
           <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar shrink-0">
              <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1 shrink-0">
                 <span className="px-4 py-2 text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.1em] sm:tracking-widest whitespace-nowrap">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              </div>
           </div>
        </header>

        <div className="px-6 md:px-10 pb-10">
          {activeTab === 'overview' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard label="Total Bookings" value={stats.total} icon={<BarChart3 className="text-blue-600" />} color="bg-blue-50" />
                 <StatCard label="Pending" value={stats.pending} icon={<Clock className="text-amber-600" />} color="bg-amber-50" />
                 <StatCard label="Confirmed" value={stats.confirmed} icon={<CheckCircle className="text-green-600" />} color="bg-green-50" />
                 <StatCard label="Completed" value={stats.completed} icon={<UserCheck className="text-purple-600" />} color="bg-purple-50" />
              </div>
              
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-black text-gray-900 mb-1">Booking Performance</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Weekly trend of appointment requests</p>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-[10px] font-bold">
                    <TrendingUp className="w-3 h-3" />
                    +12% vs last week
                  </div>
                </div>
                
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={liveChartData}>
                      <defs>
                        <linearGradient id="colorBook" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#b91c1c" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#b91c1c" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 'bold', fill: '#9ca3af'}} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 'bold', fill: '#9ca3af'}} 
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="bookings" 
                        stroke="#b91c1c" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorBook)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {/* Stats Grid for appointments view too */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
               <StatCard label="Pending" value={stats.pending} icon={<Clock className="text-amber-600" />} color="bg-amber-50" />
               <StatCard label="Today" value={stats.today} icon={<Calendar className="text-red-600" />} color="bg-red-50" />
               <StatCard label="Confirmed" value={stats.confirmed} icon={<CheckCircle className="text-green-600" />} color="bg-green-50" />
               <StatCard label="Total" value={stats.total} icon={<BarChart3 className="text-blue-600" />} color="bg-blue-50" />
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search patient, phone or service..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-600 transition-all"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                     <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select 
                          className="bg-transparent border-0 text-sm font-bold text-gray-600 focus:ring-0 cursor-pointer outline-none"
                          value={statusFilter}
                          onChange={e => setStatusFilter(e.target.value)}
                        >
                           <option value="all">All Status</option>
                           <option value="pending">Pending</option>
                           <option value="confirmed">Confirmed</option>
                           <option value="completed">Completed</option>
                        </select>
                     </div>
                  </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                     <thead className="bg-gray-50/50">
                       <tr>
                          <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left rounded-tl-2xl">Patient</th>
                          <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Service</th>
                          
                          <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Schedule</th>
                          <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                          <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right rounded-tr-2xl">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {filteredAppointments.length === 0 ? (
                         <tr>
                            <td colSpan="5" className="px-6 py-20 text-center text-gray-400 text-sm italic font-medium">
                               No appointments found matching your criteria.
                            </td>
                         </tr>
                       ) : filteredAppointments.map((app) => (
                         <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-5 flex items-center gap-4">
                               <div className="relative">
                                  <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 font-black flex items-center justify-center text-lg border border-red-100">
                                     {app.fullName?.charAt(0).toUpperCase()}
                                  </div>
                                  {app.status === 'pending' && (
                                     <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 border-2 border-white rounded-full animate-bounce"></div>
                                  )}
                               </div>
                               <p className="text-sm font-black text-gray-900">{app.fullName}</p></td>
                            <td className="px-6 py-5">
                               <span className="inline-flex px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 text-[9px] font-black uppercase tracking-widest max-w-[140px] leading-relaxed text-center break-words">
                                  {app.service}
                               </span>
                            </td>
                            
                            <td className="px-6 py-5">
                               <div className="flex flex-col bg-red-50 px-4 py-2 border border-red-100 rounded-xl w-max">
                                  <span className="text-xs font-black text-red-600 leading-tight">
                                     {app.date ? format(new Date(app.date + 'T12:00:00'), 'MMM dd, yyyy') : 'Unknown Date'}
                                  </span>
                                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest mt-0.5">
                                     {app.time}
                                  </span>
                                </div>
                            </td>
                        <td className="px-6 py-5 text-center">
                           <StatusBadge status={app.status} />
                           {app.status !== 'completed' && (
                             <div className="mt-2 flex items-center justify-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                               {app.status === 'pending' && (
                                 <button 
                                   onClick={() => handleUpdateStatus(app, 'confirmed')}
                                   disabled={statusUpdating === app.id}
                                   className="px-2 py-0.5 text-[8px] font-black text-green-600 border border-green-200 rounded-md hover:bg-green-50 transition-colors flex items-center gap-1"
                                 >
                                   {statusUpdating === app.id ? (
                                     <div className="w-2 h-2 border border-green-600/30 border-t-green-600 rounded-full animate-spin" />
                                   ) : null}
                                   CONFIRM
                                 </button>
                               )}
                               <button 
                                 onClick={() => handleUpdateStatus(app, 'completed')}
                                 disabled={statusUpdating === app.id}
                                 className="px-2 py-0.5 text-[8px] font-black text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                               >
                                 COMPLETE
                               </button>
                             </div>
                           )}
                        </td>
                            <td className="px-6 py-5">
                               <div className="flex items-center justify-end gap-2"><button onClick={() => setViewingAppointment(app)} className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black text-gray-600 bg-gray-50 hover:bg-gray-100 uppercase tracking-widest rounded-lg transition-all">View Details</button><button onClick={() => handleDelete(app)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete Appointment"><Trash2 className="w-4 h-4" /></button></div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex-col md:flex-row gap-4">
               <div className="text-center md:text-left">
                  <h2 className="text-2xl font-black text-gray-900">Staff Management</h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">Manage specialist profiles and qualifications</p>
               </div>
               <div className="flex gap-3">
                 <button 
                   onClick={() => setIsAddingDoctor(true)}
                   className="px-6 py-3 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-red-100"
                 >
                    Add Specialist
                 </button>
               </div>
            </div>

            {(isAddingDoctor || editingDoctor) && (
              <div className="bg-white p-10 rounded-[2.5rem] border-2 border-red-100 shadow-xl">
                 <h3 className="text-xl font-black text-gray-900 mb-8">{editingDoctor ? 'Edit Specialist' : 'Add New Specialist'}</h3>
                 <form onSubmit={handleSaveDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Full Name" name="name" defaultValue={editingDoctor?.name} required />
                    <InputField label="Qualification" name="qualification" defaultValue={editingDoctor?.qualification} placeholder="MD, FWACP..." required />
                    <InputField label="Specialty" name="specialty" defaultValue={editingDoctor?.specialty} required />
                    <InputField label="Experience" name="experience" defaultValue={editingDoctor?.experience} placeholder="12 Years" required />
                    
                    <div className="md:col-span-2">
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Profile Image</label>
                       <ImageUpload 
                         currentImage={uploadingImage || editingDoctor?.image} 
                         onImageChange={setUploadingImage} 
                       />
                       <input type="hidden" name="image" value={uploadingImage || editingDoctor?.image || ''} />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Short Bio</label>
                      <textarea 
                        name="bio" 
                        defaultValue={editingDoctor?.bio}
                        className="w-full p-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-red-600 min-h-[100px]"
                        required
                      ></textarea>
                    </div>
                    <div className="md:col-span-2 flex gap-4 mt-4">
                       <button type="submit" className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm transition-all hover:bg-black">
                          Save Profile
                       </button>
                       <button 
                         type="button" 
                         onClick={() => {setEditingDoctor(null); setIsAddingDoctor(false);}}
                         className="px-10 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-sm transition-all hover:bg-gray-200"
                       >
                          Cancel
                       </button>
                    </div>
                 </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {currentDoctors.map(doc => (
                 <div key={doc.id} className="bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm group hover:shadow-xl transition-all">
                    <div className="relative mb-6">
                       <img src={doc.image} alt={doc.name} className="w-full aspect-square object-cover rounded-3xl" />
                       <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setEditingDoctor(doc)}
                            className="p-3 bg-white text-gray-900 rounded-xl shadow-lg hover:text-blue-600"
                          >
                             <User className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteDoctor(doc)}
                            className="p-3 bg-white text-gray-900 rounded-xl shadow-lg hover:text-red-600"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                    <h4 className="text-xl font-black text-gray-900 mb-1">{doc.name}</h4>
                    <p className="text-red-600 text-[10px] font-black uppercase tracking-widest mb-4">{doc.specialty}</p>
                    <div className="space-y-2 pt-4 border-t border-gray-50">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                          <Award className="w-3 h-3" /> {doc.qualification}
                       </p>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                          <Clock className="w-3 h-3" /> {doc.experience} Experience
                       </p>
                    </div>
                 </div>
               ))}
               {currentDoctors.length === 0 && !doctorsLoading && (
                 <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold italic">No specialists registered yet.</p>
                 </div>
               )}
            </div>
          </div>
        )}
        </div>
      </main>

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white border border-gray-100 text-gray-900 pl-4 pr-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="text-sm font-bold tracking-tight">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {viewingAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-1">Appointment Details</h3>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Ref: {viewingAppointment.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <button 
                onClick={() => setViewingAppointment(null)}
                className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Patient Info */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 font-black flex items-center justify-center text-xl border border-red-200">
                    {viewingAppointment.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-lg leading-none">{viewingAppointment.fullName}</p>
                    <div className="mt-1 flex items-center gap-2">
                       <span className={cn(
                         "text-[10px] font-black uppercase tracking-widest",
                         viewingAppointment.status === "pending" && "text-amber-500",
                         viewingAppointment.status === "confirmed" && "text-green-500",
                         viewingAppointment.status === "completed" && "text-blue-500"
                       )}>
                         {viewingAppointment.status}
                       </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Phone</p>
                    <a href={`tel:${viewingAppointment.phone}`} className="text-sm font-bold text-gray-900 hover:text-red-600 transition-colors flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-red-500" />
                      {viewingAppointment.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Email</p>
                    {viewingAppointment.email ? (
                      <a href={`mailto:${viewingAppointment.email}`} className="text-sm font-bold text-gray-900 hover:text-red-600 transition-colors flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-red-500" />
                        <span className="truncate">{viewingAppointment.email}</span>
                      </a>
                    ) : (
                      <span className="text-sm font-bold text-gray-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> No Email provided</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Appointment Info */}
              <div className="grid grid-cols-2 gap-4 bg-red-50/50 p-5 rounded-2xl border border-red-50">
                <div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Service Type</p>
                   <p className="text-sm font-black text-gray-900">{viewingAppointment.service}</p>
                </div>
                <div className="row-span-2">
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Creation Date</p>
                   <p className="text-xs font-black text-gray-900">
                     {viewingAppointment.createdAt ? new Date(viewingAppointment.createdAt.toDate ? viewingAppointment.createdAt.toDate() : viewingAppointment.createdAt).toLocaleString() : 'N/A'}
                   </p>
                </div>
                <div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Schedule</p>
                   <p className="text-sm font-black text-red-600">
                     {viewingAppointment.date ? new Date(viewingAppointment.date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}
                   </p>
                   <p className="text-xs font-bold text-red-500">{viewingAppointment.time}</p>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-50">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                   <AlertTriangle className="w-3.5 h-3.5 text-blue-500" /> Additional Notes
                </p>
                {viewingAppointment.notes ? (
                  <p className="text-sm font-medium text-gray-900 leading-relaxed whitespace-pre-wrap">
                    {viewingAppointment.notes}
                  </p>
                ) : (
                  <p className="text-sm italic text-gray-400">No additional notes provided by the patient.</p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <button 
                 onClick={() => setViewingAppointment(null)}
                 className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfig && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <button 
                onClick={() => setDeleteConfig(null)}
                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 mb-2">{deleteConfig.title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed mb-10">
              {deleteConfig.message}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={deleteConfig.onConfirm}
                disabled={isDeleting}
                className="flex-1 px-8 py-4 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : "Confirm Delete"}
              </button>
              <button 
                onClick={() => setDeleteConfig(null)}
                disabled={isDeleting}
                className="flex-1 px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Keep Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-black transition-all",
        active ? "bg-red-600 text-white shadow-lg shadow-red-200" : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      {icon}
      {label}
      {active && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
    </button>
  );
}

function ImageUpload({ currentImage, onImageChange }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className={cn(
        "relative w-full h-96 border-2 border-dashed rounded-[2rem] transition-all flex flex-col items-center justify-center gap-2 overflow-hidden bg-gray-50",
        isDragging ? "border-red-600 bg-red-50" : "border-gray-200 hover:border-red-400",
        currentImage && "border-none"
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
      }}
    >
      {currentImage ? (
        <>
          <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
             <label className="p-3 bg-white text-gray-900 rounded-xl cursor-copy shadow-lg">
                <Upload className="w-4 h-4" />
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} />
             </label>
             <button 
               type="button" 
               onClick={() => onImageChange(null)}
               className="p-3 bg-white text-red-600 rounded-xl shadow-lg"
             >
                <Trash2 className="w-4 h-4" />
             </button>
          </div>
        </>
      ) : (
        <>
          <div className="p-4 bg-white rounded-2xl shadow-sm">
             <UploadCloud className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-center">
             <p className="text-sm font-bold text-gray-900">Drag & drop photo here</p>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">or click to browse files</p>
          </div>
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </>
      )}
    </div>
  );
}

function InputField({ label, name, defaultValue, placeholder, required }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</label>
      <input 
        type="text" 
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-red-600 transition-all"
        required={required}
      />
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
       <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", color)}>
          {icon}
       </div>
       <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
          <h3 className="text-2xl font-black text-gray-900">{value}</h3>
       </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-700 border-amber-200 shadow-sm shadow-amber-100",
    confirmed: "bg-green-100 text-green-700 border-green-200 shadow-sm shadow-green-100",
    completed: "bg-blue-100 text-blue-700 border-blue-200 shadow-sm shadow-blue-100"
  };

  return (
    <span className={cn(
      "inline-flex px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-[0.1em]",
      styles[status]
    )}>
      {status}
    </span>
  );
}
