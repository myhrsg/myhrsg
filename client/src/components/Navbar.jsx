import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ConfigContext } from "../App.jsx";
import { api } from "../services/api.js";
import { motion, AnimatePresence } from "motion/react";
import {
  Linkedin,
  LogIn,
  Menu,
  X,
  Eye,
  Target,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Users2,
  CalendarDays,
  FileText,
  GraduationCap,
  Settings,
  BookOpen
} from "lucide-react";
import StarBorder from "./StarBorder.jsx";

export const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isQuizEnabled } = useContext(ConfigContext);

  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsedUser = JSON.parse(stored);
          setUser(parsedUser);
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    syncUser();

    // Fetch fresh user data from server to avoid stale status (Waitlist bug fix)
    const refreshUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const data = await api.getMe();
        if (data?.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
          
          // Force redirect if profile is incomplete and user is not already on completion/login/otp/waitlist/profile pages
          const exemptPaths = ["/complete-profile", "/login", "/verify-otp", "/waitlist", "/profile"];
          const isExempt = exemptPaths.some(p => location.pathname.startsWith(p));
          
          if (!data.user.isProfileComplete && !isExempt) {
            navigate("/complete-profile", { replace: true });
          }
        }
      } catch (err) {
        console.error("Auth sync failed:", err);
      }
    };

    refreshUser();

    // Also listen for storage events to handle multi-tab logout/login
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    {
      name: "About Us",
      path: "/about",
      dropdown: [
        { name: "Who We Are", path: "/about#top", icon: Users2 },
        { name: "Vision & Mission", path: "/about#vision", icon: Eye },
        { name: "Our Mentors", path: "/about#mentors", icon: Users2 },
        { name: "Our Committee", path: "/about#committee", icon: Users2 },
      ]
    },
    {
      name: "HR Events",
      path: "/events",
      dropdown: [
        { name: "Upcoming Events", path: "/events#upcoming", icon: CalendarDays },
        { name: "Past Events", path: "/events#past", icon: Users2 },
        { name: "Event Gallery", path: "/events#gallery", icon: Eye },
      ]
    },
    {
      name: "Knowledge Hub",
      path: "/hr-certifications",
      dropdown: [
        { name: "HR Articles", path: "/articles", icon: FileText },
        { name: "HR Certifications", path: "/hr-certifications", icon: GraduationCap },
        ...(isQuizEnabled ? [{ name: "Take HR Quiz", path: "/quiz", icon: Target }] : []),
        ...(user?.role?.toLowerCase() === "admin" ? [
          { name: "Manage Quiz", path: "/admin?tab=Quiz", icon: Settings }
        ] : []),
      ]
    },
    { name: "Membership", path: "/membership" },
    { name: "Partners & Sponsors", path: "/partners" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[60] bg-white/95 backdrop-blur-md border-b border-slate-100 py-1">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex justify-between py-2 items-center min-h-[5rem] gap-4">
            <Link to="/" className="flex items-center space-x-3 group shrink-0">
              <img
                src="/logo-myHRSG.jpeg"
                alt="myHRSG Logo"
                className="h-14 sm:h-16 w-auto group-hover:scale-105 transition-transform"
              />
              <div className="hidden sm:flex flex-col justify-center border-l-2 border-slate-200 pl-3">
                <span className="text-[9px] md:text-[10px] 2xl:text-[11px] font-black uppercase tracking-wider 2xl:tracking-widest text-slate-600 leading-tight">Stronger</span>
                <span className="text-[9px] md:text-[10px] 2xl:text-[11px] font-black uppercase tracking-wider 2xl:tracking-widest text-slate-600 leading-tight mb-0.5">Relationships</span>
                <span className="text-[9px] md:text-[10px] 2xl:text-[11px] font-black uppercase tracking-wider 2xl:tracking-widest text-primary leading-tight">Stronger</span>
                <span className="text-[9px] md:text-[10px] 2xl:text-[11px] font-black uppercase tracking-wider 2xl:tracking-widest text-primary leading-tight">Communities</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden xl:flex items-center space-x-4 2xl:space-x-6">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative group py-4"
                  onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.dropdown ? (
                    <button className="flex items-center gap-1 text-base font-semibold text-slate-600 hover:text-primary transition-colors whitespace-nowrap">
                      {link.name}
                      <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      to={link.path}
                      className={`text-base font-semibold transition-all hover:text-primary whitespace-nowrap ${location.pathname === link.path ? "text-primary" : "text-slate-600"
                        }`}
                    >
                      {link.name}
                    </Link>
                  )}

                  {/* Desktop Dropdown */}
                  {link.dropdown && (
                    <AnimatePresence>
                      {activeDropdown === link.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full left-0 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2"
                        >
                          {link.dropdown.map((sub, sIdx) => (
                            sub.isHeader ? (
                              <div key={sIdx} className="px-4 py-2 mt-2 text-[8px] font-black uppercase text-slate-400 tracking-widest border-t border-slate-50 first:mt-0 first:border-0">
                                {sub.label}
                              </div>
                            ) : sub.isExternal ? (
                              <a
                                key={sub.name}
                                href={sub.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-primary font-bold text-xs transition-all"
                              >
                                <sub.icon size={16} />
                                {sub.name}
                              </a>
                            ) : (
                              <Link
                                key={sub.name}
                                to={sub.path}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-primary font-bold text-xs transition-all"
                              >
                                <sub.icon size={16} />
                                {sub.name}
                              </Link>
                            )
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}

              {user ? (
                <div className="ml-4 flex items-center gap-2">
                  <Link
                    to={user?.status === "pending" && user?.isProfileComplete ? "/waitlist" : user?.role?.toLowerCase() === "admin" ? "/admin" : "/profile"}
                    className="flex items-center gap-2 border border-slate-100 bg-white px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:border-primary/30 hover:text-primary transition-all shadow-sm"
                  >
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-6 h-6 rounded-lg object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-lg bg-primary text-white text-[10px] font-black flex items-center justify-center">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <LayoutDashboard size={14} />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <StarBorder as={Link} to="/login" className="ml-4" color="#22d3ee" speed="5s">
                  <LogIn size={16} />
                  Login
                </StarBorder>
              )}
            </div>

            <div className="xl:hidden flex items-center gap-4">
              {user && (
                <Link to={user?.status === "pending" && user?.isProfileComplete ? "/waitlist" : user?.role?.toLowerCase() === "admin" ? "/admin" : "/profile"} className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xs">
                  {user.name?.charAt(0).toUpperCase()}
                </Link>
              )}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="text-slate-600 p-2 hover:bg-slate-50 rounded-xl transition-colors"
              >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="xl:hidden fixed inset-0 top-[65px] bg-white z-[60] p-4 sm:p-6 space-y-2 overflow-y-auto"
          >
            {navLinks.map((link) => (
              <div key={link.name} className="space-y-1">
                {link.dropdown ? (
                  <>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                      className="w-full flex items-center justify-between px-5 py-4 text-base font-bold rounded-2xl text-slate-700 hover:bg-slate-50 transition-all border border-transparent"
                    >
                      {link.name}
                      <ChevronDown size={18} className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === link.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 pb-4 space-y-2 px-2 border-l-2 border-slate-100 ml-4">
                            {link.dropdown.map((sub, sIdx) => (
                              sub.isHeader ? (
                                <div key={sIdx} className="px-5 py-3 mt-4 text-[9px] font-black uppercase text-slate-400 tracking-widest border-l-2 border-primary/20 bg-slate-50/50 first:mt-0">
                                  {sub.label}
                                </div>
                              ) : sub.isExternal ? (
                                <a
                                  key={sub.name}
                                  href={sub.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setIsMobileOpen(false)}
                                  className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white border border-slate-50 text-slate-600 font-bold shadow-sm text-sm hover:text-primary transition-colors"
                                >
                                  <sub.icon size={18} className="text-primary" />
                                  {sub.name}
                                </a>
                              ) : (
                                <Link
                                  key={sub.name}
                                  to={sub.path}
                                  onClick={() => setIsMobileOpen(false)}
                                  className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white border border-slate-50 text-slate-600 font-bold shadow-sm text-sm hover:text-primary transition-colors"
                                >
                                  <sub.icon size={18} className="text-primary" />
                                  {sub.name}
                                </Link>
                              )
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`block px-5 py-4 text-base font-bold rounded-2xl transition-all ${location.pathname === link.path ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}

            {!user && (
              <div className="pt-6">
                <Link
                  to="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full flex items-center justify-center space-x-3 bg-primary text-white py-5 rounded-2xl text-base font-bold shadow-xl shadow-primary/20"
                >
                  <LogIn size={20} />
                  <span>Login / Register</span>
                </Link>
              </div>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-5 text-red-500 font-black uppercase tracking-widest text-xs border border-red-50 rounded-2xl"
              >
                <LogOut size={16} /> Sign Out
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};