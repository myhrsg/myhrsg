import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ShieldCheck, ArrowRight, RefreshCcw } from "lucide-react";

export const VerifyOTP = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || "/api";
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otp.join(""), token }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // includes profileImage & role

        if (!data.user.isProfileComplete) {
          navigate("/complete-profile");
        } else if (data.user.status === "pending") {
          navigate("/waitlist");
        } else {
          navigate(data.user.role === "admin" ? "/admin" : "/profile");
        }
      } else {
        setError(data.error);
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setError(`Verification failed: ${err.message}`);
      setStatus("error");
    }
  };

  const resendOtp = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "/api";
      const res = await fetch(`${API_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        alert("A new code has been sent to your email.");
      }
    } catch (err) {
      alert("Failed to resend code.");
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
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
            Verified!
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
            Your email is verified. Your membership application is now on the
            **Waitlist** for review. We'll notify you soon!
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
          className="bg-white p-5 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl border border-slate-100"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
              Verify it's you
            </h2>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
            <div className="flex gap-1 sm:gap-2 justify-center sm:justify-between">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="flex-1 min-w-0 max-w-[3rem] aspect-[4/5] sm:aspect-square bg-slate-50 border border-slate-100 rounded-xl text-center text-lg sm:text-xl font-black text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>

            <div className="space-y-4">
              <button
                disabled={status === "loading" || otp.join("").length < 6}
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-dark transition-all flex items-center justify-center group disabled:opacity-50"
              >
                {status === "loading" ? "Verifying..." : "Verify & Continue"}
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={16}
                />
              </button>

              <button
                type="button"
                onClick={resendOtp}
                className="w-full flex items-center justify-center gap-2 text-slate-400 font-bold text-xs hover:text-primary transition-colors"
              >
                <RefreshCcw size={14} />
                Resend Code
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-center text-sm font-bold bg-red-50 py-3 rounded-xl">
                {error}
              </p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};
