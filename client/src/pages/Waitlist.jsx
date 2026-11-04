import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Clock,
  ShieldCheck,
  Mail,
  Building2,
  MapPin,
  LogOut,
  CheckCircle2,
  Loader2,
  Sparkles
} from "lucide-react";
import { api } from "../services/api.js";

const Waitlist = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch fresh user data to check if status has changed
    const checkStatus = async () => {
      try {
        const data = await api.getMe();
        if (data?.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);

          // If no longer pending, redirect to appropriate dashboard
          if (data.user.status === "accepted") {
            navigate(data.user.role === "admin" ? "/admin" : "/profile");
            return;
          }
          // If profile not complete, send to complete profile
          if (!data.user.isProfileComplete) {
            navigate("/complete-profile");
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        const stored = localStorage.getItem("user");
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          navigate("/login");
          return;
        }
      }
      setChecking(false);
    };

    checkStatus();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (checking || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  const steps = [
    { label: "Account Created", done: true },
    { label: "Email Verified", done: true },
    { label: "Profile Completed", done: true },
    { label: "Admin Review", done: false, active: true },
    { label: "Membership Active", done: false },
  ];

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
      {/* Minimal Header */}
      <header className="w-full px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo-myHRSG.jpeg"
            alt="myHRSG"
            className="h-10 w-auto"
          />
          <div className="hidden sm:block border-l-2 border-slate-200 pl-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Member Portal
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl text-xs font-bold transition-all"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-lg">
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400" />

            <div className="p-8 sm:p-10">
              {/* Avatar + Status */}
              <div className="flex flex-col items-center text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative mb-5"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-20 h-20 rounded-2xl object-cover ring-4 ring-amber-100 shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-amber-200/50">
                      {initials}
                    </div>
                  )}
                  {/* Pulsing dot */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-200/50">
                    <Clock size={12} className="text-white" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                    You're on the Waitlist
                  </h1>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                    Hi <span className="font-bold text-slate-700">{user.name?.split(" ")[0]}</span>, your application is currently being reviewed by our team.
                  </p>
                </motion.div>
              </div>

              {/* Progress Steps */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between relative px-2">
                  {/* Connection line */}
                  <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-100" />
                  <div
                    className="absolute top-4 left-6 h-0.5 bg-gradient-to-r from-green-400 to-amber-400 transition-all"
                    style={{ width: "60%" }}
                  />

                  {steps.map((step, i) => (
                    <div key={i} className="relative flex flex-col items-center z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                          step.done
                            ? "bg-green-500 text-white shadow-lg shadow-green-200/50"
                            : step.active
                              ? "bg-amber-400 text-white shadow-lg shadow-amber-200/50 animate-pulse"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {step.done ? (
                          <CheckCircle2 size={14} />
                        ) : step.active ? (
                          <Clock size={14} />
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>
                      <p
                        className={`mt-2 text-[9px] font-bold uppercase tracking-wider text-center leading-tight max-w-[60px] ${
                          step.done
                            ? "text-green-600"
                            : step.active
                              ? "text-amber-600"
                              : "text-slate-400"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 mb-6"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-800 mb-1">
                      What happens next?
                    </p>
                    <p className="text-xs text-amber-700/80 leading-relaxed">
                      Our admin team reviews every application carefully. Once approved, you'll receive an email notification and gain full access to the myHRSG member dashboard, events, quiz, and more.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Your Details */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                  Application Details
                </p>
                {[
                  { icon: Mail, label: "Email", value: user.email },
                  user.company && { icon: Building2, label: "Company", value: user.company },
                  user.city && { icon: MapPin, label: "Location", value: `${user.city}${user.pincode ? ` • ${user.pincode}` : ""}` },
                ]
                  .filter(Boolean)
                  .map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 p-3 bg-slate-50/70 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm shrink-0">
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          {label}
                        </p>
                        <p className="text-sm font-bold text-slate-700 truncate">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
              </motion.div>
            </div>

            {/* Bottom section */}
            <div className="border-t border-slate-100 px-8 sm:px-10 py-5 bg-slate-50/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Applied {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Recently"}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                    Under Review
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-[11px] text-slate-400 mt-6 font-medium"
          >
            Have questions? Reach out to us at{" "}
            <a
              href="mailto:hello@myhrsg.org"
              className="text-primary font-bold hover:underline"
            >
              hello@myhrsg.org
            </a>
          </motion.p>
        </div>
      </main>
    </div>
  );
};

export default Waitlist;
