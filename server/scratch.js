const fs = require('fs');

const path = 'c:/Users/Admin/ANVI/myHRSG/client/src/features/events/EventsList.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. replace imports
content = content.replace(
  'import { useSearchParams } from "react-router-dom";',
  'import { useLocation } from "react-router-dom";'
);

// 2. replace state and hooks
content = content.replace(
  'const [searchParams] = useSearchParams();\n  const [events, setEvents] = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [view, setView] = useState(searchParams.get("filter") || "upcoming"); \n  const [selectedEvent, setSelectedEvent] = useState(null);\n  const [eventComments, setEventComments] = useState([]);\n  const [commentText, setCommentText] = useState("");\n  const [user, setUser] = useState(null);\n\n  useEffect(() => {\n    const filter = searchParams.get("filter");\n    if (filter && (filter === "upcoming" || filter === "past")) {\n      setView(filter);\n    }\n  }, [searchParams]);',
  `const location = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventComments, setEventComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (location.hash && !loading) {
      const id = location.hash.replace("#", "");
      setTimeout(() => scrollTo(id), 100);
    }
  }, [location, loading]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // Account for fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };`
);

// 3. replace filteredEvents with upcomingEvents and pastEvents
content = content.replace(
  `  const filteredEvents = useMemo(() => {\n    return events.filter(e => {\n      const isPast = e.type === "past" || new Date(e.date) < new Date();\n      return view === "past" ? isPast : !isPast;\n    });\n  }, [events, view]);`,
  `  const upcomingEvents = useMemo(() => {
    return events.filter(e => e.type !== "past" && new Date(e.date) >= new Date());
  }, [events]);

  const pastEvents = useMemo(() => {
    return events.filter(e => e.type === "past" || new Date(e.date) < new Date());
  }, [events]);`
);

// 4. replace masonryItems dependency from filteredEvents to pastEvents
content = content.replace(
  `    return filteredEvents.map((event, index) => ({`,
  `    return pastEvents.map((event, index) => ({`
);
content = content.replace(
  `  }, [filteredEvents]);`,
  `  }, [pastEvents]);`
);

// 5. Replace render block from L134 to L276
const eventCardCode = `
            <motion.div
              layoutId={event._id}
              key={event._id}
              className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col group relative transition-all duration-500 hover:shadow-primary/10"
            >
              {/* Image Preview */}
              <div className="relative h-64 overflow-hidden">
                {event.images && event.images.length > 0 ? (
                    <img 
                        src={\`\${event.images[0]}?tr=w-800,h-600\`} 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                ) : (
                    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center opacity-10">
                        <ImageIcon size={32} className="mb-2 text-white" />
                        <span className="text-[10px] text-white font-black uppercase">No Media Available</span>
                    </div>
                )}
                
                {/* Registration Overlay on Hover */}
                {event.registrationUrl && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <motion.a 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={event.registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-slate-900 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2"
                        >
                            Register Now
                            <ExternalLink size={14} />
                        </motion.a>
                    </div>
                )}

                <div className="absolute top-6 left-6 bg-primary text-white px-5 py-2.5 rounded-xl text-[10px] font-black shadow-2xl shadow-primary/40 uppercase tracking-widest">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
                </div>
                
                <div className="space-y-4 mb-8">
                    <div className="flex items-center text-slate-400 gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg text-primary">
                            <MapPin size={16} />
                        </div>
                        <span className="text-xs font-bold">{event.location}</span>
                    </div>
                    <div className="flex items-center text-slate-400 gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg text-primary">
                            <UserIcon size={16} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-tighter">Mentor: {event.mentorName || "Community Lead"}</span>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-300">
                        <MessageSquare size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Insights</span>
                    </div>
                    <button 
                        onClick={() => handleOpenDetail(event)}
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-primary transition-all shadow-xl hover:shadow-primary/30"
                    >
                        View Details
                    </button>
                </div>
              </div>
            </motion.div>
`;

const renderCode = `
        {/* Header */}
        <div className="mb-12">
            <span className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2 block font-sans">Experiences & Community</span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight font-sans">
                HR Events & Community Meetups
            </h1>
        </div>

        {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing events...</div>
        ) : (
            <>
               <section id="upcoming" className="mb-20 scroll-mt-32">
                   <h2 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">Upcoming Events</h2>
                   {upcomingEvents.length === 0 ? (
                       <div className="text-center py-16 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                           <CalendarIcon size={32} className="mx-auto text-slate-200 mb-4" />
                           <p className="text-slate-500 font-bold text-sm mb-1">Exciting events are on the horizon.</p>
                       </div>
                   ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                           {upcomingEvents.map((event) => (${eventCardCode}))}
                       </div>
                   )}
               </section>

               <section id="past" className="mb-20 scroll-mt-32">
                   <h2 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">Past Highlights</h2>
                   {pastEvents.length === 0 ? (
                       <div className="text-center py-16 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                           <p className="text-slate-500 font-bold text-sm mb-1">No past events to show.</p>
                       </div>
                   ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                           {pastEvents.map((event) => (${eventCardCode}))}
                       </div>
                   )}
               </section>

               <section id="gallery" className="mb-20 scroll-mt-32">
                   <h2 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">Event Gallery</h2>
                   <div className="relative w-full py-10 overflow-hidden bg-slate-900 rounded-[3rem]">
                        <div className={\`flex gap-6 \${masonryItems.length > 1 ? "group" : "justify-center"}\`}>
                            <div className={\`flex gap-6 \${masonryItems.length > 1 ? "animate-marquee" : ""} whitespace-nowrap py-4 hover:[animation-play-state:paused]\`}>
                                {(masonryItems.length > 1 ? [...masonryItems, ...masonryItems, ...masonryItems] : masonryItems).map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => handleOpenDetail(item.event)}
                                        className="shrink-0 w-80 md:w-96 aspect-square sm:aspect-[4/3] rounded-[2rem] overflow-hidden cursor-pointer group/card relative shadow-lg"
                                    >
                                        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-y-4 group-hover/card:translate-y-0 whitespace-normal">
                                            <h4 className="text-white font-black text-lg">{item.title}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                   </div>
               </section>
            </>
        )}
`;

const startIdx = content.indexOf('        {/* Header */}');
const endIdx = content.indexOf('        {/* Detailed Modal */}');
if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + renderCode + content.substring(endIdx);
} else {
  console.log("Could not find boundaries.");
}

fs.writeFileSync(path, content);
console.log("Done");