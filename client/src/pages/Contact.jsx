import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, User, Smartphone, MessageSquare, Send, CheckCircle2, AlertCircle, Bookmark, Instagram } from "lucide-react";
import { api } from "../services/api";
import SEOHead from "../components/SEOHead.jsx";

const ContactField = ({ icon: Icon, type, name, placeholder, value, onChange, required, rows, ...rest }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0051A1] transition-colors">
        <Icon size={18} className={rows ? "mt-[-120px]" : ""} />
      </div>
      {rows ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl outline-none focus:border-[#0051A1] focus:ring-4 focus:ring-[#0051A1]/5 transition-all font-medium resize-none placeholder:text-slate-400"
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl outline-none focus:border-[#0051A1] focus:ring-4 focus:ring-[#0051A1]/5 transition-all font-medium placeholder:text-slate-400"
          {...rest}
        />
      )}
    </motion.div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  // Auto-fill from logged-in user
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        setFormData(prev => ({
          ...prev,
          name: user.name || user.firstName || "",
          email: user.email || "",
          number: user.phone || user.number || "",
        }));
      }
    } catch (e) {
      // Ignore parse errors
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await api.submitContactForm(formData);
      setStatus({ type: "success", message: response.message });
      setFormData({ name: "", email: "", number: "", subject: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.error || "Something went wrong. Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-32 pb-20 overflow-x-hidden relative z-0">
      {/* Background Image with Lighter Overlay */}
      <div className="absolute top-0 left-0 w-full h-[60vh] -z-20 overflow-hidden">
        <img
          src="/contact-background.jpg"
          alt="Contact background"
          className="w-full h-full object-cover object-[center_30%] opacity-60 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC]/40 via-[#F8FAFC]/20 to-[#F8FAFC]" />
      </div>
      <SEOHead
        title="Contact myHRSG – Get in Touch with India's HR Community"
        description="Reach out to myHRSG for membership queries, partnerships, or collaboration. Email hello@myhrsg.org or call +91 9764-234-011."
        path="/contact"
      />
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-[#0051A1]/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-[#81C784]/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#0051A1] font-bold uppercase tracking-[0.2em] text-sm mb-4 block"
          >
            Connect With Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight"
          >
            Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0051A1] to-[#0A66C2]">Conversation</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 font-medium"
          >
            Have a question or want to collaborate? We're here to help you navigate your journey with expertise and care.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Side: Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-white/70 backdrop-blur-xl p-6 sm:p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white"
          >
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ContactField
                  icon={User}
                  name="name"
                  type="text"
                  placeholder="Full Name*"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <ContactField
                  icon={Mail}
                  name="email"
                  type="email"
                  placeholder="Email Address*"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ContactField
                  icon={Smartphone}
                  name="number"
                  type="tel"
                  placeholder="Phone Number (10 digits)"
                  value={formData.number}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  maxLength="10"
                  minLength="10"
                  title="Please enter a valid 10-digit Indian phone number"
                />
                <ContactField
                  icon={Bookmark}
                  name="subject"
                  type="text"
                  placeholder="Subject*"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <ContactField
                icon={MessageSquare}
                name="message"
                placeholder="How can we help you?*"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
              />

              <AnimatePresence>
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`flex items-center gap-3 p-4 rounded-xl text-sm font-bold ${status.type === "success"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-red-50 text-red-700 border border-red-100"
                      }`}
                  >
                    {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {status.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className={`w-full group flex items-center justify-center gap-3 bg-gradient-to-r from-[#0051A1] to-[#0A66C2] text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-[#0051A1]/20 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[#0051A2]/30'}`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send Message
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Right Side: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/70 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white group hover:border-[#0051A1]/20 transition-colors"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0051A1] to-[#0A66C2] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#0051A1]/20">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Call Us</h3>
                  <p className="text-xl font-bold text-slate-900 mb-1">+91 9764-234-011</p>

                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/70 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white group hover:border-[#0051A1]/20 transition-colors"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0051A1] to-[#0A66C2] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#0051A1]/20">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Email Us</h3>
                  <p className="text-xl font-bold text-[#0051A1]">hello@myhrsg.org</p>

                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/70 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white group hover:border-[#0051A1]/20 transition-colors"
            >
              <a 
                href="https://www.instagram.com/myhrsg/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-6"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#0051A1] to-[#0A66C2] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#0051A1]/20">
                  <Instagram size={24} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Follow Us</h3>
                  <p className="text-xl font-bold text-[#0051A1]">@myhrsg</p>
                </div>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative rounded-[2rem] overflow-hidden shadow-2xl h-64 grayscale group hover:grayscale-0 transition-all duration-700"
            >
              <iframe
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.449646870529!2d73.9452296759715!3d18.553754982546497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c138d6d6d6d6%3A0x6d6d6d6d6d6d6d6d!2sGanga%20Platino!5e0!3m2!1sen!2sin!4v1712850000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 pointer-events-none border-[12px] border-white/0 group-hover:border-white/20 transition-all rounded-[2rem]" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

