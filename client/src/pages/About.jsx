import { motion } from "motion/react";
import { Linkedin, MapPin, Target, Eye, Users } from "lucide-react";
import StarBorder from "../components/StarBorder.jsx";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../services/api.js";
import SEOHead from "../components/SEOHead.jsx";

const Committee = [
  { name: "Rohit Kalamkar", role: "Committee", city: "Pune", image: "/rohit.png" },
  { name: "Shalu Ramnani", role: "Committee", city: "Pune", image: "/shalu.png" },
  { name: "Chetan Channe", role: "Committee", city: "Nagpur", image: "/chetan.png" },
];

const CommitteeMembers = [
  { name: "Rohit Kalamkar", role: "Committee", city: "Pune", image: "/rohit.png" },
  { name: "Shalu Ramnani", role: "Committee", city: "Pune", image: "/shalu.png" },
  { name: "Chetan Channe", role: "Committee", city: "Nagpur", image: "/chetan.png" },
];

const sortCities = (a, b) => {
  const cityA = a[0].toLowerCase();
  const cityB = b[0].toLowerCase();
  if (cityA === 'pune') return -1;
  if (cityB === 'pune') return 1;
  if (cityA === 'nagpur') return -1;
  if (cityB === 'nagpur') return 1;
  return cityA.localeCompare(cityB);
};

const About = () => {
  const [mentors, setMentors] = useState([]);
  const [dynamicCommittee, setDynamicCommittee] = useState([]);
  const [activeCity, setActiveCity] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mentorData, committeeData] = await Promise.all([
          api.getMentors(),
          api.getCommittee()
        ]);
        setMentors(mentorData);
        setDynamicCommittee(committeeData);
        if (committeeData && committeeData.length > 0) {
          const grouped = committeeData.reduce((acc, member) => {
            const city = member.city ? member.city.trim().charAt(0).toUpperCase() + member.city.trim().slice(1).toLowerCase() : 'Other';
            if (!acc[city]) acc[city] = [];
            acc[city].push(member);
            return acc;
          }, {});
          const sorted = Object.entries(grouped).sort(sortCities);
          if (sorted.length > 0) setActiveCity(sorted[0][0]);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (location.hash === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => scrollTo(id), 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // Account for fixed navbar and sub-nav
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const groupedCommittee = dynamicCommittee.reduce((acc, member) => {
    const city = member.city ? member.city.trim().charAt(0).toUpperCase() + member.city.trim().slice(1).toLowerCase() : 'Other';
    if (!acc[city]) acc[city] = [];
    acc[city].push(member);
    return acc;
  }, {});

  const sortedCities = Object.entries(groupedCommittee).sort(sortCities);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <SEOHead
        title="About myHRSG – Our Mission, Vision & Mentors"
        description="Learn about myHRSG, a not-for-profit HR forum driving societal growth through meaningful connections, mentorship & community impact across India."
        path="/about"
      />
      {/* Hero Section */}
      <section className="relative pt-32 pb-0 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
              My Human Relationships <br />
              <span className="text-primary italic">for Societal Growth</span>
            </h1>
            <div className="w-24 h-2 bg-primary mx-auto rounded-full mb-8" />
          </motion.div>
        </div>

        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </section>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-10 divide-y divide-slate-100">

        {/* Who We Are */}
        <section id="who-we-are" className="pt-0 pb-20 scroll-mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">About the Forum</span>
              <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Purpose & Origins</h2>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">
                myHRSG is an independent, not-for-profit, and professionally driven forum committed to catalyzing meaningful human connections for a better society.
              </p>
              <p className="text-lg text-slate-500 mt-6 leading-relaxed font-medium">
                We bring together passionate HR professionals and changemakers to collaborate, share and act on ideas that uplift communities. myHRSG is dedicated to nurturing relationships that drive inclusive and sustainable societal growth.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-2xl">
                <img src="/about-background.jpg" alt="myHRSG community members collaborating at a social impact event" className="w-full h-full object-cover object-[center_30%]" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 scroll-mt-32 grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            id="vision"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-100"
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-8">
              <Eye size={28} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight font-sans">Our Vision</h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              To build a compassionate and inclusive society by nurturing meaningful connections and empowering every individual to contribute to social progress.
            </p>
          </motion.div>

          <motion.div
            id="mission"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-slate-50 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-100"
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-8">
              <Target size={28} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight font-sans">Our Mission</h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              To unite HR professionals and changemakers in leading impactful initiatives that uplift communities and strengthen social well-being.
            </p>
          </motion.div>
        </section>

        {/* Our Mentors */}
        {mentors.length > 0 && (
          <section id="mentors" className="pt-20 pb-10 scroll-mt-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Our Mentors</h2>
            </div>

            <div className="relative w-full py-4 overflow-hidden">
              <div className={`flex gap-6 ${mentors.length > 1 ? "group" : "justify-center"}`}>
                <div 
                  className={`flex gap-6 ${mentors.length > 1 ? "animate-marquee" : ""} whitespace-nowrap py-4 hover:[animation-play-state:paused]`}
                  style={{ animationDuration: '40s' }}
                >
                  {(mentors.length > 1 
                    ? [...mentors, ...mentors, ...mentors] 
                    : mentors
                  ).map((mentor, idx) => (
                    <motion.div
                      key={`${mentor._id || idx}-${idx}`}
                      className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden w-64 flex-shrink-0 whitespace-normal"
                    >
                      <div className="aspect-[4/5] relative">
                        {mentor.photo ? (
                          <img src={mentor.photo} alt={mentor.name} className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500" />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                            <Users size={64} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <h3 className="text-2xl font-black text-white mb-1">{mentor.name}</h3>
                        </div>
                      </div>
                      <div className="p-6 flex items-center justify-between bg-white">
                        <div className="flex items-center text-slate-500 font-bold text-xs">
                          <MapPin size={14} className="mr-1 text-primary" />
                          {mentor.city}
                        </div>
                        {mentor.linkedinUrl && (
                          <a
                            href={mentor.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
                          >
                            <Linkedin size={18} fill="currentColor" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Our Committee */}
        {sortedCities.length > 0 && (
          <section id="committee" className="pt-10 pb-20 scroll-mt-32">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-8">Our Committee</h2>
              
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {sortedCities.map(([city]) => (
                  <button
                    key={city}
                    onClick={() => setActiveCity(city)}
                    className={`px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${
                      activeCity === city 
                        ? "bg-primary text-white scale-105" 
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {sortedCities.filter(([city]) => city === activeCity).map(([city, members]) => (
                <motion.div 
                  key={city}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative w-full py-4 overflow-hidden">
                    <div className={`flex gap-6 ${members.length > 1 ? "group" : "justify-center"}`}>
                      <div 
                        className={`flex gap-6 ${members.length > 1 ? "animate-marquee" : ""} whitespace-nowrap py-4 hover:[animation-play-state:paused]`}
                        style={{ animationDuration: '40s' }}
                      >
                        {(members.length > 1 
                          ? [...members, ...members, ...members] 
                          : members
                        ).map((member, idx) => (
                          <motion.div
                            key={`${member._id || idx}-${idx}`}
                            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden w-64 flex-shrink-0 whitespace-normal"
                          >
                            <div className="aspect-[4/5] relative">
                              {member.image ? (
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500" />
                              ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                  <Users size={64} />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
                              <div className="absolute bottom-6 left-6 right-6">
                                <h3 className="text-2xl font-black text-white mb-1">{member.name}</h3>
                              </div>
                            </div>
                            <div className="p-6 flex items-center justify-between bg-white">
                              <div className="flex items-center text-slate-500 font-bold text-xs">
                                <MapPin size={14} className="mr-1 text-primary" />
                                {member.city}
                              </div>
                              {member.linkedinUrl && (
                                <a
                                  href={member.linkedinUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
                                >
                                  <Linkedin size={18} fill="currentColor" />
                                </a>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <section className="py-20 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-8">Want to be a part of our journey?</h2>
          <div className="flex justify-center">
            <Link to="/contact">
              <StarBorder>Get in Touch</StarBorder>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
