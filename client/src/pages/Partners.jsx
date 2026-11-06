import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, ArrowRight, CheckCircle2, AlertCircle, Handshake, Gem } from "lucide-react";
import { api } from "../services/api";
import SEOHead from "../components/SEOHead.jsx";
import { TestimonialSlider } from "../components/TestimonialSlider.jsx";
import ZohoPartnerForm from "../components/ZohoPartnerForm.jsx";

const Reasons = [
  { title: "Strategic Visibility", desc: "Showcase your brand at the forefront of India's HR transformation." },
  { title: "Targeted Engagement", desc: "Connect with CHROs, HR leaders, and policymakers at curated forums." },
  { title: "Thought Leadership", desc: "Share insights through keynotes, panels, and co-branded content." },
  { title: "Innovation Showcases", desc: "Present your HR solutions in areas like talent, DEI, and digital transformation." },
  { title: "Talent & Ecosystem Access", desc: "Network with leaders, startups, academia, and future talent partners." },
];

const Perks = [
  "Logo Placement",
  "Speaking Opportunities",
  "Exhibit Presence",
  "Co-Branded Campaigns",
  "Social Media Spotlights",
  "Exclusive Access",
  "Impact Recognition",
];

const Partners = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    company: "",
    city: "",
    background: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [inquiryType, setInquiryType] = useState("partner"); // "partner" or "sponsor"
  const [displaySponsors, setDisplaySponsors] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Auto-fill from logged-in user
  useEffect(() => {
    // Fetch Sponsors
    api.getDisplaySponsors().then(data => setDisplaySponsors(data)).catch(err => console.error(err));
    // Fetch Testimonials
    api.getTestimonials().then(data => setTestimonials(data.filter(t => t.type === "sponsor"))).catch(err => console.error(err));

    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        setFormData(prev => ({
          ...prev,
          name: user.name || user.firstName || "",
          email: user.email || "",
          phone: user.phone || user.number || "",
          company: user.company || "",
          city: user.city || "",
          designation: user.designation || "",
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
      const submitFn = inquiryType === "partner" ? api.createPartnerInquiry : api.createSponsorInquiry;
      const response = await submitFn(formData);
      setStatus({ type: "success", message: response.message });
      setFormData(prev => ({ ...prev, designation: "", company: "", city: "", background: "" }));
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.error || "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen relative z-0 overflow-x-hidden">
      <SEOHead
        title="Partner with myHRSG – HR Sponsorship & Collaboration"
        description="Become a strategic partner or sponsor of myHRSG. Gain brand visibility, speaking opportunities & access to India's HR leader network."
        path="/partners"
      />
      {/* ── Background Image with Lighter Overlay ────────────────── */}
      <div className="absolute top-0 left-0 w-full h-[60vh] -z-20 overflow-hidden">
        <img
          src="/partners-background.jpg"
          alt="Partnerships & Sponsorships background"
          className="w-full h-full object-cover object-[center_30%] opacity-60 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC]/40 via-[#F8FAFC]/20 to-[#F8FAFC]" />
      </div>

      {/* ── Hero Content ─────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6">
            Join the Movement
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-slate-900 tracking-tight mb-4 italic">
            Strategic Partners and Sponsors
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Elevating the HR ecosystem through strategic collaboration and shared vision.
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pb-32">
        {/* ── Dynamic Sponsor Logo Grid ─────────────────────────────── */}
        {displaySponsors.length > 0 && (
          <section className="mb-20">
            <div className="relative overflow-hidden">
                {/* Film Reel Mode (Carousel) Always Active */}
                <div className="flex gap-8 group">
                  <div className="flex gap-8 animate-marquee whitespace-nowrap py-4">
                    {[...displaySponsors, ...displaySponsors, ...displaySponsors].map((sponsor, idx) => (
                      <motion.a
                        key={`${sponsor._id}-${idx}`}
                        href={sponsor.websiteUrl ? (sponsor.websiteUrl.startsWith('http') ? sponsor.websiteUrl : `https://${sponsor.websiteUrl}`) : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 flex items-center justify-center p-10 h-52 md:h-64 aspect-square bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(10,102,194,0.08)] transition-all duration-500 mx-2"
                      >
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="max-w-full max-h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-105"
                        />
                      </motion.a>
                    ))}
                  </div>
                </div>
            </div>
          </section>
        )}

        {/* ── Main Content Grid ────────────────────────────────────── */}
        <div className="flex flex-col gap-20 max-w-4xl mx-auto">
          {/* Content Column */}
          <div className="space-y-16 w-full">
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Partners <span className="text-primary italic">&</span> Sponsors
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">
                At myHRSG, we believe collaboration fuels growth and innovation in the HR community.
                As a partner or sponsor, you gain exclusive access to a dynamic platform that brings
                together HR leaders, practitioners, and changemakers. Whether you are a technology
                enabler, consulting firm, learning partner, or industry association, joining hands
                with myHRSG positions your brand at the heart of conversations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Reasons.map((reason, idx) => (
                <div key={idx} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <CheckCircle size={20} />
                  </div>
                  <h4 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-widest">{reason.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-bold">{reason.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-10 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />
              <h3 className="text-xl font-black mb-8 relative z-10 uppercase tracking-widest">Sponsorship Perks</h3>
              <div className="flex flex-wrap gap-3 relative z-10">
                {Perks.map((perk, idx) => (
                  <span key={idx} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all cursor-default border border-white/10">
                    {perk}
                  </span>
                ))}
            </div>
          </div>

          <TestimonialSlider testimonials={testimonials} />
        </div>

          {/* Form Column */}
          <div id="inquiry-form" className="bg-white p-6 sm:p-10 lg:p-14 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-slate-100 relative items-start">
            <div className="flex flex-col gap-8 w-full">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                  {inquiryType === "partner" ? "Become a Partner with myHRSG" : "Become a Sponsor"}
                </h2>
                <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
                  {inquiryType === "partner"
                    ? "Collaborate with myHRSG and become part of a growing network of partners. Share your details through the form below, and our team will connect with you."
                    : "Partner with us as a sponsor to gain brand visibility, showcase your HR innovations, and connect with leaders."}
                </p>
              </div>

              {/* Inquiry Type Toggle */}
              <div className="flex flex-col sm:flex-row p-2 bg-slate-50 rounded-[1.5rem] border border-slate-100 gap-2 sm:gap-0">
                <button
                  type="button"
                  onClick={() => setInquiryType("partner")}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-2 sm:px-6 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest transition-all ${inquiryType === "partner"
                    ? "bg-white text-primary shadow-lg"
                    : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                  <Handshake size={16} /> Partnership
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType("sponsor")}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-2 sm:px-6 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest transition-all ${inquiryType === "sponsor"
                    ? "bg-white text-primary shadow-lg"
                    : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                  <Gem size={16} /> Sponsorship
                </button>
              </div>

              {inquiryType === "partner" ? (
                <ZohoPartnerForm />
              ) : (
                <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-4">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-primary outline-none transition-all text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-4">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@company.com"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-primary outline-none transition-all text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-4">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      placeholder="Organization Name"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-primary outline-none transition-all text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-4">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Current Location"
                      className="w-full px-6 py-4 border border-slate-100 rounded-2xl focus:border-primary outline-none transition-all text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-4">Tell us about your background</label>
                  <textarea
                    name="background"
                    value={formData.background}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Why do you want to partner with us?"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-primary outline-none transition-all text-sm font-bold resize-none"
                  />
                </div>

                <AnimatePresence>
                  {status.message && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`flex items-center gap-3 p-4 rounded-2xl text-xs font-black uppercase tracking-tight ${status.type === "success"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-red-50 text-red-700 border border-red-100"
                        }`}
                    >
                      {status.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      {status.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary-dark transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Submit Inquiry
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
