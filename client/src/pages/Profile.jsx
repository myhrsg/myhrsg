import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Linkedin,
  LayoutDashboard,
  Calendar,
  Users,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Building2,
  Mail,
  ExternalLink,
  Star,
  Settings,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { api } from "../services/api.js";

const StatusBadge = ({ status }) => {
  const map = {
    accepted: {
      cls: "bg-green-50 text-green-700 border-green-200",
      icon: <CheckCircle2 size={12} />,
      label: "Active Member",
    },
    pending: {
      cls: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock size={12} />,
      label: "On Waitlist",
    },
    rejected: {
      cls: "bg-red-50 text-red-600 border-red-200",
      icon: <AlertCircle size={12} />,
      label: "Declined",
    },
  };
  const s = map[status] || map.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${s.cls}`}
    >
      {s.icon}
      {s.label}
    </span>
  );
};

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }
  const [linkedinError, setLinkedinError] = useState("");

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview" },
    { icon: Calendar, label: "Events" },
    { icon: Settings, label: "Settings" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.getMe();
        setUser(data.user);
        // Sync localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (err) {
        console.error("Failed to fetch user:", err);
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
        else navigate("/login");
      }
    };

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchUser();

    api
      .getEvents()
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch(() => { });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const upcomingEvents = events.filter(ev => new Date(ev.date) >= currentDate).slice(0, 5);

  return (
    <div className="h-screen bg-white pt-24 flex flex-col">
      {/* ── Mobile Header ─────────────────────────────────────────── */}
      <header className="xl:hidden h-16 flex items-center px-6 bg-white z-40 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-slate-600"><Menu size={24} /></button>
          <h1 className="font-black text-slate-900 tracking-tight text-lg">Member Dashboard</h1>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden relative">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/50 z-40 xl:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className={`fixed inset-y-0 left-0 z-50 xl:relative w-64 bg-white border-r border-slate-100 flex flex-col p-4 gap-1 shrink-0 transform transition-transform duration-300 xl:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Avatar card */}
          <div className="px-3 py-5 mb-2">
            <div className="flex flex-col items-center gap-3 text-center">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-2 ring-primary/10"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/25">
                  {initials}
                </div>
              )}
              <div>
                <p className="font-black text-slate-900 text-sm leading-tight">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  {user.role}
                </p>
              </div>
              <StatusBadge status={user.status} />
            </div>
          </div>

          <div className="h-px bg-slate-100 mx-3 mb-2" />

          {sidebarItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === label
                  ? "bg-primary/5 text-primary"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}

          <div className="mt-auto">
            <div className="h-px bg-slate-100 mx-3 mb-3" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-3 rounded-xl font-bold text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────── */}
        <main className="flex-grow overflow-y-auto bg-slate-50/30 p-8 pt-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Welcome back, {user.name?.split(" ")[0]}! 👋
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                  Member Dashboard
                </p>
              </div>
              <a
                href={user.linkedin ? (user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`) : `https://linkedin.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#0A66C2] text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
              >
                <Linkedin size={14} fill="currentColor" />
                LinkedIn Profile
                <ExternalLink size={12} />
              </a>
            </div>

            {/* ── Overview Tab ─────────────────────────────────── */}
            {activeTab === "Overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Waitlist Notice */}
                {user.status === "pending" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex items-start gap-4">
                    <Clock className="text-amber-500 mt-0.5 shrink-0" size={20} />
                    <div>
                      <p className="font-black text-amber-800 text-sm">
                        Your application is under review
                      </p>
                      <p className="text-amber-700 text-xs font-medium mt-1 leading-relaxed">
                        Our team is reviewing your profile. You'll receive an
                        email once your membership is approved. In the meantime
                        feel free to explore our public events and knowledge hub!
                      </p>
                    </div>
                  </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Events Available",
                      value: events.length || "—",
                      icon: Calendar,
                      color: "text-violet-600 bg-violet-50",
                    },
                    {
                      label: "Membership Status",
                      value:
                        user.status === "accepted"
                          ? "Active"
                          : user.status === "pending"
                            ? "Pending"
                            : "Inactive",
                      icon: Star,
                      color: "text-primary bg-primary/5",
                    },
                    {
                      label: "Member Since",
                      value: user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric",
                        })
                        : "—",
                      icon: Users,
                      color: "text-emerald-600 bg-emerald-50",
                    },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div
                      key={label}
                      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}
                      >
                        <Icon size={18} />
                      </div>
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        {label}
                      </p>
                      <p className="text-2xl font-black text-slate-900 mt-1">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Profile Card + Upcoming Events */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Profile Info */}
                  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-7">
                    <h3 className="text-sm font-black text-slate-900 mb-5">
                      Your Profile
                    </h3>
                    <div className="space-y-4">
                      {[
                        { icon: Mail, label: "Email", value: user.email },

                        {
                          icon: Building2,
                          label: "Company",
                          value: user.company,
                        },
                        { icon: MapPin, label: "City", value: user.city },
                      ]
                        .filter((r) => r.value)
                        .map(({ icon: Icon, label, value }) => (
                          <div
                            key={label}
                            className="flex items-center gap-4 p-3 bg-slate-50/70 rounded-xl"
                          >
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm shrink-0">
                              <Icon size={14} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                {label}
                              </p>
                              <p className="text-sm font-bold text-slate-800 leading-tight break-all">
                                {value}
                              </p>
                            </div>
                          </div>
                        ))}
                      {!user.company && !user.city && (
                        <p className="text-slate-400 text-xs font-medium text-center py-4">
                          Profile details are pulled from your LinkedIn account.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Upcoming Events */}
                  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-7">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-sm font-black text-slate-900">
                        Upcoming Events
                      </h3>
                      <Link
                        to="/events"

                        className="text-primary font-black text-[10px] uppercase tracking-widest hover:underline"
                      >
                        View All
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {upcomingEvents.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                          <Calendar
                            size={32}
                            className="mx-auto mb-3 opacity-30"
                          />
                          <p className="text-xs font-bold">
                            No upcoming events yet
                          </p>
                        </div>
                      ) : (
                        upcomingEvents.map((ev, i) => (
                          <div
                            key={ev._id || i}
                            className="flex items-start gap-3 p-3 bg-slate-50/70 rounded-xl hover:bg-primary/5 transition-colors group"
                          >
                            <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shrink-0 font-black text-xs group-hover:bg-primary group-hover:text-white transition-all">
                              {new Date(ev.date).getDate?.() || i + 1}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 text-sm truncate">
                                {ev.title || ev.name || "Event"}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                                {ev.date
                                  ? new Date(ev.date).toLocaleDateString(
                                    "en-IN",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )
                                  : "TBA"}
                                {ev.location ? ` · ${ev.location}` : ""}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Events Tab ───────────────────────────────────── */}
            {activeTab === "Events" && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-8 py-5 border-b border-slate-50">
                    <h3 className="text-sm font-black text-slate-900">
                      All Events
                    </h3>
                  </div>
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {events.length === 0 ? (
                      <p className="text-slate-400 text-sm font-medium col-span-2 text-center py-12">
                        No events announced yet. Check back soon!
                      </p>
                    ) : (
                      events.map((ev, i) => (
                        <div
                          key={ev._id || i}
                          className="p-5 rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-lg transition-all group"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-full">
                              {ev.Event || "myHRSG"}
                            </span>
                            <Calendar
                              size={14}
                              className="text-slate-300 group-hover:text-primary transition-colors"
                            />
                          </div>
                          <h4 className="font-black text-slate-900 mb-1">
                            {ev.title || ev.name || "Event"}
                          </h4>
                          <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                            {ev.description || "Details to be announced."}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                            <Clock size={11} />
                            {ev.date
                              ? new Date(ev.date).toLocaleDateString("en-IN", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })
                              : "TBA"}
                            {ev.location && (
                              <>
                                <MapPin size={11} className="ml-2" />
                                {ev.location}
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Settings Tab (Profile Edit) ───────────────────── */}
            {activeTab === "Settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Success/Error Overlay Modal */}
                {toast && (
                  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
                    >
                      <div className={`h-1.5 ${toast.type === 'success'
                          ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                          : 'bg-gradient-to-r from-red-400 to-rose-500'
                        }`} />
                      <div className="p-8 text-center">
                        <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5 ${toast.type === 'success'
                            ? 'bg-emerald-50 text-emerald-500'
                            : 'bg-red-50 text-red-500'
                          }`}>
                          {toast.type === 'success' ? <Sparkles size={28} /> : <AlertCircle size={28} />}
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">
                          {toast.type === 'success' ? 'All Done!' : 'Oops!'}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium mb-6">
                          {toast.message}
                        </p>
                        <button
                          onClick={() => setToast(null)}
                          className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all shadow-lg ${toast.type === 'success'
                              ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200/50'
                              : 'bg-red-500 hover:bg-red-600 shadow-red-200/50'
                            }`}
                        >
                          OK
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}

                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        Profile Settings
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                        Manage your professional information
                      </p>
                    </div>
                  </div>

                  {/* Missing Info Alert */}
                  {!user.isProfileComplete && (
                    <div className="mx-8 mt-6 bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm shrink-0">
                        <AlertCircle size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-red-800">Action Required: Profile Incomplete</p>
                        <p className="text-xs text-red-700/80 font-medium mt-1 leading-relaxed">
                          Your profile is missing some mandatory professional details (including your LinkedIn URL). 
                          Please fill in the missing fields below to ensure your membership remains active and visible.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const data = Object.fromEntries(formData);
                        const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/;
                        if (!linkedinPattern.test(data.linkedin)) {
                          setLinkedinError("Please enter a valid LinkedIn profile URL (e.g. https://linkedin.com/in/username)");
                          return;
                        }
                        setLinkedinError("");
                        try {
                          const res = await api.completeProfile(data);
                          setUser(res.user);
                          localStorage.setItem("user", JSON.stringify(res.user));
                          setToast({ type: 'success', message: 'Profile updated successfully!' });
                        } catch (err) {
                          setToast({ type: 'error', message: 'Failed to update profile. Please try again.' });
                        }
                      }}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Full Name</label>
                          <input name="name" defaultValue={user.name} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Date of Birth</label>
                          <input type="date" name="dob" defaultValue={user.dob ? new Date(user.dob).toISOString().split('T')[0] : ""} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary outline-none transition-all text-slate-700" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Company</label>
                          <input name="company" defaultValue={user.company} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">City</label>
                          <input name="city" defaultValue={user.city} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Pincode</label>
                          <input name="pincode" defaultValue={user.pincode} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary outline-none transition-all" />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Position / Role</label>
                          <input name="position" defaultValue={user.position} placeholder="e.g. HR Manager" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">LinkedIn URL</label>
                          <input
                            name="linkedin"
                            defaultValue={user.linkedin}
                            required
                            onChange={(e) => {
                              if (e.target.value && !/^https?:\/\/(www\.)?linkedin\.com\/in\/.+/.test(e.target.value)) {
                                setLinkedinError("Please enter a valid LinkedIn profile URL (e.g. https://linkedin.com/in/username)");
                              } else {
                                setLinkedinError("");
                              }
                            }}
                            placeholder="https://linkedin.com/in/..."
                            className={`w-full bg-slate-50 border ${linkedinError ? 'border-red-300 focus:border-red-400' : 'border-slate-100 focus:border-primary'} rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all`}
                          />
                          {linkedinError && (
                            <p className="mt-1 text-[11px] font-bold text-red-500 pl-2">{linkedinError}</p>
                          )}
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;

