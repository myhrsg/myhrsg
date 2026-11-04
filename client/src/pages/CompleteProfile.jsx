import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { UserCircle, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { API_URL } from "../config.js";

export const CompleteProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    pincode: "",
    company: "",
    linkedin: "",
    position: "",
    dob: ""
  });

  const [status, setStatus] = useState("idle"); // idle, loading, success, waitlist
  const [error, setError] = useState("");
  const [linkedinError, setLinkedinError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedToken) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);

      // Pre-fill name and linkedin if available (from linkedin auth)
      setFormData(prev => ({
        ...prev,
        name: parsedUser.name || "",
        linkedin: parsedUser.linkedin || "",
        dob: parsedUser.dob ? new Date(parsedUser.dob).toISOString().split('T')[0] : "",
        position: parsedUser.position || "",
        company: parsedUser.company || "",
        city: parsedUser.city || "",
        pincode: parsedUser.pincode || "",
      }));
    } catch (e) {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/;
    if (!linkedinPattern.test(formData.linkedin)) {
      setLinkedinError("Please enter a valid LinkedIn profile URL (e.g. https://linkedin.com/in/username)");
      setStatus("idle");
      return;
    }
    setLinkedinError("");

    try {
      const res = await fetch(`${API_URL}/auth/complete-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      // Update local storage
      const updatedUser = { ...user, ...data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      if (updatedUser.status === "pending") {
        navigate("/waitlist");
      } else {
        navigate(updatedUser?.role?.toLowerCase() === "admin" ? "/admin" : "/profile");
      }
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  if (status === "waitlist") {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center px-4"
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Profile Completed!</h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
            Thank you for providing your details. Your application is now on the **Waitlist** for review. We'll notify you soon!
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-2xl border border-slate-100"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0A66C2]/10 text-[#0A66C2] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UserCircle size={32} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Almost There</h2>
            <p className="text-sm text-slate-500 font-medium px-4">
              Please complete your {user.role} profile to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {/* Show Name only if NOT (LinkedIn + Admin) */}
            {!(user.isLinkedIn && user?.role?.toLowerCase() === "admin") && (
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full mt-1.5 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Date of Birth</label>
              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full mt-1.5 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Company Name</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Acme Corp"
                className="w-full mt-1.5 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Position / Title</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="HR Manager"
                className="w-full mt-1.5 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            {user?.role?.toLowerCase() === "member" && (
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New York"
                    className="w-full mt-1.5 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="10001"
                    className="w-full mt-1.5 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>
            )}

            {/* LinkedIn URL - Mandatory for all paths to ensure visibility in Dashboard */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">LinkedIn URL</label>
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
                className={`w-full mt-1.5 px-4 py-3.5 bg-slate-50 border ${linkedinError ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/20'} rounded-xl text-sm focus:ring-2 outline-none transition-all placeholder:text-slate-400 font-medium`}
              />
              {linkedinError && (
                <p className="mt-1.5 text-[11px] font-bold text-red-500 pl-1">{linkedinError}</p>
              )}
            </div>


            {error && (
              <div className="text-red-500 text-center text-sm font-bold bg-red-50 py-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button
                disabled={status === "loading"}
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-dark transition-all flex items-center justify-center group shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    Complete Profile
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CompleteProfile;
