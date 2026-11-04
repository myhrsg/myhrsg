import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle2, ArrowRight, Gem, BookOpen, Handshake, Rocket, MapPin, ExternalLink } from "lucide-react";
import SEOHead from "../components/SEOHead.jsx";
import { TestimonialSlider } from "../components/TestimonialSlider.jsx";
import { api } from "../services/api.js";
import { useLocation } from "react-router-dom";
                
const Membership = () => {
  const [user, setUser] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [whatsappCommunities, setWhatsappCommunities] = useState([]);
  const location = useLocation();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }

    api.getTestimonials()
      .then(data => setTestimonials(data.filter(t => t.type === "member")))
      .catch(err => console.error(err));

    api.getWhatsAppCommunities()
      .then(data => setWhatsappCommunities(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (location.hash === "#whatsapp") {
      setTimeout(() => {
        const el = document.getElementById("whatsapp");
        if (el) {
          const offset = 120;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = el.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
        }
      }, 300);
    }
  }, [location, whatsappCommunities]);

  const perksCategories = [
    {
      icon: Gem,
      title: "Impact & Privileges",
      items: [
        "Participation in Social Impact & HR for Good Initiatives",
        "Access to Partner Benefits & Exclusive Offers",
        "Entry to Conferences, Workshops & Premium Experiences"
      ]
    },
    {
      icon: BookOpen,
      title: "Learning & Insights",
      items: [
        "Curated HR Reports, Playbooks & Thought Leadership Publishing",
        "Expert-led Webinars, Masterclasses & Podcast Series",
        "Access to Research-driven Content & Industry Trends"
      ]
    },
    {
      icon: Handshake,
      title: "Community & Networking",
      items: [
        "Chapter Meetups, Local Events & Closed-door Roundtables",
        "Access to Peer Groups / Pods for focused discussions",
        "Mentorship Circles with Industry Leaders"
      ]
    },
    {
      icon: Rocket,
      title: "Career & Leadership Growth",
      items: [
        "Leadership Development Programs & Certification Access",
        "Opportunities to Speak, Present & Build Personal Brand",
        "Recognition through Spotlights, Awards & Community Visibility"
      ]
    },
  ];

  return (
    <div className="relative bg-[#F8FAFC] min-h-screen pt-32 pb-20 font-sans text-slate-900 z-0 overflow-x-hidden">
      {/* Background Image with Lighter Overlay */}
      <div className="absolute top-0 left-0 w-full h-[70vh] -z-10 overflow-hidden">
        <img
          src="/membership-background.jpg"
          alt="Membership background"
          className="w-full h-full object-cover object-[center_20%] opacity-60 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC]/40 via-[#F8FAFC]/20 to-[#F8FAFC]" />
      </div>
      <SEOHead
        title="Join myHRSG | Free HR Membership India – Connect & Grow"
        description="Become a member of India's fastest-growing HR community. Free access to events, mentorship circles, HR certifications & leadership programs."
        path="/membership"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center max-w-full mx-auto mb-20 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-black uppercase tracking-[0.2em] text-xs mb-4 block"
          >
            Become a Member
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[10vw] sm:text-[5vw] md:text-[4vw] lg:text-[3.5vw] xl:text-[4.5rem] font-black mb-6 tracking-tighter leading-tight"
          >
            Connect &middot; Collaborate &middot; <span className="text-blue-600">Contribute</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Join a community of forward-thinking HR professionals dedicated to meaningful human connections and societal growth.
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-2">Membership Perks</h2>
              <p className="text-slate-500 font-medium">Everything you need to grow and make an impact.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {perksCategories.map((category, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 group hover:border-primary/20 transition-all flex flex-col"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <category.icon size={24} />
                  </div>
                  <h3 className="font-black text-xl mb-6 text-slate-900">{category.title}</h3>
                  <ul className="space-y-4 flex-grow">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-emerald-500 mt-1 shrink-0" />
                        <span className="text-sm text-slate-600 font-medium leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Testimonials Section */}
            <TestimonialSlider testimonials={testimonials} />

            {/* Bottom CTA Section */}
            <div className="mt-20 pt-16 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-10 pb-10">
              <div>
                <h2 className="text-5xl md:text-6xl font-serif font-black text-slate-900 mb-6 tracking-tight leading-tight">Want to become a<br />member?</h2>
                <p className="text-lg md:text-xl text-slate-600 font-medium italic mb-10 max-w-2xl">
                  Join a community of forward-thinking HR professionals and start making a real impact today.
                </p>
                <Link 
                  to={user ? (user.role?.toLowerCase() === "admin" ? "/admin" : "/profile") : "/login"}
                  className="inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:bg-slate-800 shadow-xl"
                >
                  Become a Member
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="w-full lg:w-96">
                <div className="bg-white border border-slate-100 p-8 rounded-[2rem] space-y-8 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                    <span className="text-slate-400 font-bold text-sm">Mentorship</span>
                    <span className="text-primary font-black">Included</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold text-sm">Events Access</span>
                    <span className="text-slate-900 font-black">Unlimited</span>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Community Section */}
            {whatsappCommunities.length > 0 && (
              <section id="whatsapp" className="mt-20 pt-16 border-t border-slate-200 scroll-mt-32">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-black mb-2">Join Our WhatsApp Communities</h2>
                  <p className="text-slate-500 font-medium">Connect with HR professionals in your city. Scan the QR code or click to join.</p>
                </div>

                <div className="relative w-full py-4 overflow-hidden">
                  <div className={`flex gap-8 ${whatsappCommunities.length > 1 ? "group" : "justify-center"}`}>
                    <div 
                      className={`flex gap-8 ${whatsappCommunities.length > 1 ? "animate-marquee" : ""} whitespace-nowrap py-4 hover:[animation-play-state:paused]`}
                      style={{ animationDuration: '30s' }}
                    >
                      {(whatsappCommunities.length > 1 
                        ? [...whatsappCommunities, ...whatsappCommunities, ...whatsappCommunities] 
                        : whatsappCommunities
                      ).map((community, idx) => (
                        <div
                          key={`${community._id}-${idx}`}
                          className="snap-start min-w-[280px] sm:min-w-[320px] max-w-[320px] flex-shrink-0 bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 group hover:border-[#25D366]/30 transition-all flex flex-col whitespace-normal"
                        >
                          <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#25D366]/10 rounded-xl flex items-center justify-center">
                              <MapPin size={20} className="text-[#25D366]" />
                            </div>
                            <h3 className="font-black text-xl text-slate-900">{community.city}</h3>
                          </div>

                          {community.qrImage && (
                            <div className="mb-6 flex justify-center">
                              <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-slate-100 bg-white p-2 shadow-inner">
                                <img src={community.qrImage} alt={`QR Code for ${community.city} WhatsApp Community`} className="w-full h-full object-contain" />
                              </div>
                            </div>
                          )}

                          <a
                            href={community.whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366] text-white py-4 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#1da851] transition-all shadow-lg shadow-[#25D366]/20 group-hover:shadow-[#25D366]/30 mt-auto text-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            <span className="leading-tight">Join {community.city} Community</span>
                            <ExternalLink size={14} className="shrink-0" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;
