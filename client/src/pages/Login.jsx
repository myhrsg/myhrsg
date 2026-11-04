import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Linkedin,
  User,
  ShieldCheck,
  Mail,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("member");
  const [authMode, setAuthMode] = useState("social"); // "social" or "manual"
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedin: "",
  });
  const [linkedinError, setLinkedinError] = useState("");

  const [searchParams] = useSearchParams();
  const errorParam = searchParams.get("error");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser.isProfileComplete) {
          navigate("/complete-profile", { replace: true });
        } else {
          navigate(parsedUser.role === "admin" ? "/admin" : "/profile", {
            replace: true,
          });
        }
      } catch (e) { }
    }
  }, [navigate]);

  const handleLinkedInLogin = () => {
    const API_URL = import.meta.env.VITE_API_URL || "/api";
    window.location.href = `${API_URL}/auth/linkedin?role=${role}`;
  };

  const handleGoogleLogin = () => {
    const API_URL = import.meta.env.VITE_API_URL || "/api";
    window.location.href = `${API_URL}/auth/google?role=${role}`;
  };

  const handleManualAuth = async (e) => {
    e.preventDefault();
    setFormError("");
    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/;
    if (!linkedinPattern.test(formData.linkedin)) {
      setLinkedinError("Please enter a valid LinkedIn profile URL (e.g. https://linkedin.com/in/username)");
      return;
    }
    setLinkedinError("");
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "/api";
      const response = await fetch(`${API_URL}/auth/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Authentication failed");

      navigate(`/verify-otp?token=${data.token}`);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl border border-slate-100 text-center relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-[#0A66C2]/10 text-[#0A66C2] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
            Welcome to myHRSG
          </h2>
          <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
            Select your role and sign in
          </p>

          {/* Role Toggle */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-6">
            <button
              onClick={() => setRole("member")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === "member"
                  ? "bg-white text-[#0A66C2] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <User size={16} />
              Member
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === "admin"
                  ? "bg-white text-[#0A66C2] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <ShieldCheck size={15} />
              Admin
            </button>
          </div>

          {/* Context hint — changes with role */}
          <AnimatePresence mode="wait">
            <motion.p
              key={role}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="text-[11px] text-slate-400 font-medium text-center leading-relaxed mb-6 px-1"
            >
              {role === "admin"
                ? "Admins get access to the management dashboard to approve members."
                : "Members get access to events, knowledge hub & the HR community."}
            </motion.p>
          </AnimatePresence>

          {(errorParam || formError) && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl text-center leading-relaxed">
              {decodeURIComponent(errorParam || formError)}
            </div>
          )}

          <AnimatePresence mode="wait">
            {authMode === "social" ? (
              <motion.div
                key="social"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <button
                  onClick={handleLinkedInLogin}
                  className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-[#0A66C2] text-white py-4 px-2 rounded-2xl font-bold text-[11px] sm:text-sm hover:bg-[#084d91] active:scale-[0.98] transition-all shadow-lg shadow-[#0A66C2]/25"
                >
                  <Linkedin size={20} className="shrink-0" />
                  <span>
                    Continue as {role === "admin" ? "Admin" : "Member"} with LinkedIn
                  </span>
                </button>

                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-white text-slate-700 py-4 px-2 rounded-2xl font-bold text-[11px] sm:text-sm border-2 border-slate-100 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>
                    Continue as {role === "admin" ? "Admin" : "Member"} with Google
                  </span>
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="shrink-0 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    OR
                  </span>
                  <div className="flex-grow border-t border-slate-100"></div>
                </div>

                <button
                  onClick={() => setAuthMode("manual")}
                  className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-white border-2 border-slate-100 text-slate-600 py-4 px-2 rounded-2xl font-bold text-[11px] sm:text-sm hover:border-primary/30 hover:text-primary active:scale-[0.98] transition-all"
                >
                  <Mail size={20} className="shrink-0" />
                  <span>Continue with Email</span>
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="manual"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleManualAuth}
                className="space-y-4 text-left"
              >
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.linkedin}
                    onChange={(e) => {
                      setFormData({ ...formData, linkedin: e.target.value });
                      if (e.target.value && !/^https?:\/\/(www\.)?linkedin\.com\/in\/.+/.test(e.target.value)) {
                        setLinkedinError("Please enter a valid LinkedIn profile URL (e.g. https://linkedin.com/in/username)");
                      } else {
                        setLinkedinError("");
                      }
                    }}
                    placeholder="https://linkedin.com/in/username"
                    className={`w-full mt-1 px-4 py-3 bg-slate-50 border ${linkedinError ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/20'} rounded-xl text-sm focus:ring-2 outline-none transition-all placeholder:text-slate-400 font-medium`}
                  />
                  {linkedinError && (
                    <p className="mt-1.5 text-[11px] font-bold text-red-500 pl-1">{linkedinError}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Must match your LinkedIn email"
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                  />
                  <p className="mt-1 text-[10px] text-slate-400 pl-1">
                    * Email should be the same as your LinkedIn account email.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-2xl font-bold text-sm hover:bg-primary-dark active:scale-[0.98] transition-all shadow-lg shadow-primary/25 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <ArrowRight size={20} />
                    )}
                    <span>Get Verification Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("social")}
                    className="w-full mt-3 flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 font-semibold text-xs transition-colors py-2"
                  >
                    Back to LinkedIn Login
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-8">
            Secure · Professional · Verified
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
