import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Users, Target, Rocket, BookOpen } from "lucide-react";
import { api } from "../services/api.js";
import StarBorder from "../components/StarBorder.jsx";
import DomeGallery from "../components/DomeGallery.jsx";
import { MentorCards } from "../components/MentorCards.jsx";
import SEOHead from "../components/SEOHead.jsx";

const Counter = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime;
          const animateCount = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const currentCount = Math.min(Math.floor((progress / (duration * 1000)) * end), end);
            setCount(currentCount);
            if (progress < duration * 1000) {
              requestAnimationFrame(animateCount);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(animateCount);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={countRef}>{count}</span>;
};

const Home = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [articles, setArticles] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const events = await api.getEvents();
        if (Array.isArray(events)) {
          const allImages = events
            .flatMap((e) => e.images || [])
            .map((src) => ({ src, alt: "Community Event" }));
          if (allImages.length > 0) setGalleryImages(allImages);
        }
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
      }
    };
    const fetchArticles = async () => {
      try {
        const data = await api.getArticles();
        if (Array.isArray(data)) {
          const sorted = [...data]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
          setArticles(sorted);
        }
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      }
    };
    const fetchTestimonials = async () => {
      try {
        const data = await api.getTestimonials();
        if (Array.isArray(data)) {
          setTestimonials(data);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      }
    };
    fetchGallery();
    fetchArticles();
    fetchTestimonials();
  }, []);

  const getRepeatedTestimonials = (items) => {
    if (!items || items.length === 0) return [];
    let repeated = [...items];
    while (repeated.length < 10) {
      repeated = [...repeated, ...items];
    }
    return repeated;
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 overflow-x-hidden">
      <SEOHead
        title="myHRSG – India's HR Community for Societal Growth"
        description="Join myHRSG, a not-for-profit HR forum connecting 500+ professionals across India. Free membership, events, mentorship & certifications for HR practitioners."
        path="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.myhrsg.org/"
          }]
        }}
      />
      {/* Premium Hero Section */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Hero Image with Lighter Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/main-background.jpg"
            alt="myHRSG HR professionals networking at a community event in India"
            className="w-full h-full object-cover opacity-60 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-black tracking-[0.2em] uppercase bg-primary/10 text-primary border border-primary/20 rounded-full animate-pulse">
            Social Impact Through HR
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black mb-8 tracking-tighter leading-none text-slate-900">
            Welcome to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              myHRSG
            </span>
          </h1>

          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Join a community of forward-thinking HR professionals dedicated to
            meaningful human connections and societal growth.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/membership">
              <StarBorder as="div" color="#22d3ee" speed="3s" className="px-10 py-5 text-lg">
                Become myHRSG Member
              </StarBorder>
            </Link>
            <Link to="/membership#whatsapp">
              <StarBorder as="div" color="#25D366" speed="3.5s" className="px-10 py-5 text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Join myHRSG WhatsApp Groups
              </StarBorder>
            </Link>
            <Link to="/events">
              <StarBorder as="div" color="#3b82f6" speed="4s" className="px-10 py-5 text-lg flex items-center gap-2">
                Explore Engagements
                <ArrowRight size={20} />
              </StarBorder>
            </Link>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="pt-10 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-slate-900 mb-6">
            myHRSG Activities
          </h2>
          <p className="text-primary font-black uppercase tracking-[0.3em] text-xs">
            Shaping Society the HR WAY
          </p>
        </div>

        <div className="max-w-[100vw] overflow-hidden px-4">
          <div className="relative overflow-hidden">
            <div className="flex gap-8 group">
              <div className="flex gap-8 animate-marquee whitespace-nowrap py-10 hover:[animation-play-state:paused]">
                {[
                  { image: "/partners-background.jpg", title: "HR Social Impact Initiatives", subtitle: "Community First", pos: "object-[center_30%]" },
                  { image: "/contact-background.jpg", title: "HR Connect", subtitle: "Elite Networking", pos: "object-[center_30%]" },
                  { image: "/about-background.jpg", title: "HR Counselling", subtitle: "Strategic Advisory", pos: "object-[center_30%]" },
                  { image: "/digital-hr.jpg", title: "Digital HR Transformation", subtitle: "Tech in HR", pos: "object-center" },
                  { image: "/main-background.jpg", title: "HR Mentorship", subtitle: "Industry Insights", pos: "object-center" },
                  { image: "/membership-background.jpg", title: "HR Learning & Certifications", subtitle: "Skill Advancement", pos: "object-[center_20%]" },
                  { image: "/podcast.jpg", title: "HR Podcast", subtitle: "Knowledge Sharing", pos: "object-center" },
                  { image: "/partners-background.jpg", title: "HR Social Impact Initiatives", subtitle: "Community First", pos: "object-[center_30%]" },
                  { image: "/contact-background.jpg", title: "HR Connect", subtitle: "Elite Networking", pos: "object-[center_30%]" },
                  { image: "/about-background.jpg", title: "HR Counselling", subtitle: "Strategic Advisory", pos: "object-[center_30%]" },
                  { image: "/digital-hr.jpg", title: "Digital HR Transformation", subtitle: "Tech in HR", pos: "object-center" },
                  { image: "/main-background.jpg", title: "HR Mentorship", subtitle: "Industry Insights", pos: "object-center" },
                  { image: "/membership-background.jpg", title: "HR Learning & Certifications", subtitle: "Skill Advancement", pos: "object-[center_20%]" },
                  { image: "/podcast.jpg", title: "HR Podcast", subtitle: "Knowledge Sharing", pos: "object-center" }
                ].map((activity, idx) => (
                  <div key={idx} className="relative flex-shrink-0 group rounded-[2.5rem] overflow-hidden shadow-xl w-80 h-64 md:w-96 md:h-72">
                    <img src={activity.image} alt={activity.title} className={`absolute inset-0 w-full h-full object-cover ${activity.pos || 'object-center'} grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 p-8 w-full whitespace-normal">
                      <span className="text-cyan-400 drop-shadow-md font-black uppercase tracking-widest text-[10px] mb-2 block">{activity.subtitle}</span>
                      <h3 className="text-xl md:text-2xl font-black text-white leading-tight">{activity.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="pt-10 pb-24 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-slate-900 mb-6">
              What People Say
            </h2>
            <p className="text-primary font-black uppercase tracking-[0.3em] text-xs">
              Hear from our community members and partners
            </p>
          </div>

          <div className="max-w-[100vw] overflow-hidden px-4">
            <div className="relative overflow-hidden">
              <div className="flex gap-8 group">
                <div className="flex gap-8 animate-marquee whitespace-nowrap py-10 hover:[animation-play-state:paused]">
                  {getRepeatedTestimonials(testimonials).map((t, idx) => (
                    <a 
                      key={idx}
                      href={t.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative flex-shrink-0 group rounded-[2.5rem] overflow-hidden shadow-xl w-80 h-[28rem] bg-white border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 block cursor-pointer"
                    >
                      {/* Image container */}
                      <div className="h-2/3 w-full relative overflow-hidden bg-slate-100">
                        {t.thumbnail ? (
                          <img 
                            src={t.thumbnail} 
                            alt={`${t.name}'s testimonial`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                            <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                          </div>
                        )}
                        {/* Redirection Indicator overlay */}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="bg-white/90 backdrop-blur-sm text-slate-950 font-black text-xs uppercase tracking-widest px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
                            View Post
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                          </span>
                        </div>
                      </div>

                      {/* Info container */}
                      <div className="p-6 flex flex-col justify-between h-1/3 whitespace-normal">
                        <div>
                          <h3 className="text-lg font-black text-slate-900 line-clamp-1 mb-1 leading-tight group-hover:text-primary transition-colors">
                            {t.name}
                          </h3>
                          <p className="text-slate-500 font-medium text-xs line-clamp-1">
                            {t.designation || 'HR Professional'}
                          </p>
                        </div>
                        <div className="mt-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${t.type === 'sponsor' ? 'bg-cyan-50 text-cyan-600' : 'bg-primary/10 text-primary'}`}>
                            {t.type}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest News & Insights Section */}
      {articles.length > 0 && (
        <section className="py-24 bg-white text-slate-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <p className="text-primary font-black uppercase tracking-widest text-[10px] sm:text-xs mb-3">
                  Stay Informed. Stay Inspired.
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 tracking-tight leading-tight">
                  Latest News & Insights
                </h2>
              </div>
              <Link to="/articles" className="shrink-0">
                <button className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2 group">
                  <span>View All Articles</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            {/* Grid list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link 
                  to={`/blog/${article.slug || article._id}`}
                  key={article._id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 group flex flex-col h-full cursor-pointer"
                >
                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden bg-slate-100 rounded-3xl m-4">
                    {article.image ? (
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <BookOpen size={40} strokeWidth={1} />
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="px-6 pb-6 pt-2 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-3">
                      <span className="text-primary">{article.category}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400">
                        {new Date(article.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    
                    <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-3 flex-1">
                      {article.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 group-hover:text-primary transition-colors mt-auto">
                      <span>Read More</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 sm:py-24 bg-white text-slate-900 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-4 sm:gap-6 lg:gap-12 lg:divide-x divide-slate-100">
            {[
              { label: "Cities & growing", value: 10, icon: Target, suffix: "+" },
              { label: "HR professionals", value: 500, icon: Users, suffix: "+" },
              { label: "Events hosted", value: 12, icon: Calendar, suffix: "+" },
              { label: "Membership fee", value: 0, icon: Rocket, suffix: "" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center lg:items-start lg:text-left lg:pl-8 group">
                <stat.icon className="w-6 h-6 text-cyan-500 mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 flex items-center justify-center lg:justify-start">
                  <Counter end={stat.value} duration={2.5} /><span className="text-cyan-500 ml-1">{stat.suffix}</span>
                </div>
                <div className="text-slate-500 font-bold uppercase tracking-widest text-[10px] leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Membership CTA */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-none">
                Want to become a member?
              </h2>
              <p className="text-xl text-slate-500 mb-12 font-medium italic">
                Join a community of forward-thinking HR professionals and start
                making a real impact today.
              </p>
              <Link to="/membership">
                <StarBorder as="div" color="#22d3ee" className="px-12 py-5 text-lg">
                  Become a Member
                  <ArrowRight size={20} />
                </StarBorder>
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
        </div>
      </section>
    </div>
  );
};

export default Home;
