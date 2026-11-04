import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
    MapPin,
    Image as ImageIcon,
    MessageSquare,
    Send,
    Calendar as CalendarIcon,
    User as UserIcon,
    Trash2,
    ExternalLink,
    Sliders
} from "lucide-react";
import { api } from "../../services/api.js";
import Masonry from "../../components/Masonry.jsx";
import SEOHead from "../../components/SEOHead.jsx";

export const EventsList = () => {
    const location = useLocation();
    const [events, setEvents] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventComments, setEventComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [user, setUser] = useState(null);
    const [expandedPastEventId, setExpandedPastEventId] = useState(null);
    const [gallerySpeed, setGallerySpeed] = useState(40);

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
    };

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));

        fetchEvents();

        api.getConfig("gallerySpeed")
            .then(res => {
                if (res && res.value) setGallerySpeed(res.value);
            })
            .catch(() => {});
    }, []);

    const fetchEvents = async () => {
        try {
            const [eventsData, galleryData] = await Promise.all([
                api.getEvents(),
                api.getGalleryItems()
            ]);
            setEvents(eventsData);
            setGalleryItems(galleryData);
        } catch (err) {
            console.error("Failed to fetch events:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (eventId) => {
        try {
            const data = await api.getComments(eventId);
            setEventComments(data);
        } catch (err) {
            console.error("Failed to fetch comments:", err);
        }
    };

    const handleOpenDetail = (event) => {
        setSelectedEvent(event);
        fetchComments(event._id);
    };

    const upcomingEvents = useMemo(() => {
        return events.filter(e => e.type !== "past" && new Date(e.date) >= new Date());
    }, [events]);

    const pastEvents = useMemo(() => {
        return events.filter(e => e.type === "past" || new Date(e.date) < new Date());
    }, [events]);

    const handleAddComment = async (eventId) => {
        if (!commentText.trim()) return;
        try {
            await api.postComment({ eventId, text: commentText });
            setCommentText("");
            fetchComments(eventId);
        } catch (err) {
            console.error("Failed to add comment:", err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Delete this comment permanently?")) return;
        try {
            await api.deleteComment(commentId);
            if (selectedEvent) fetchComments(selectedEvent._id);
        } catch (err) {
            console.error("Failed to delete comment:", err);
        }
    };

    const getPublicImage = (index) => {
        const list = ["a", "b", "c", "d", "e", "f", "g", "1"];
        const name = list[index % list.length];
        const mapping = {
            'a': '/a.png',
            'b': '/b.png',
            'c': '/main-background.jpg',
            'd': '/contact-background.jpg',
            'e': '/membership-background.jpg',
            'f': '/digital-hr.jpg',
            'g': '/ethics-hr.jpg',
            '1': '/about-background.jpg'
        };
        return mapping[name] || `/logo-myHRSG.jpeg`;
    };

    // Legacy masonry items kept for fallback if no gallery items exist
    const masonryItems = useMemo(() => {
        const heights = [400, 600, 300, 500, 450, 550, 350, 480];
        return pastEvents.map((event, index) => ({
            id: event._id,
            img: event.images && event.images.length > 0 ? event.images[0] : getPublicImage(index),
            title: event.title,
            mentor: event.mentorName,
            location: event.location,
            height: heights[index % heights.length],
            url: "#", // Trigger modal instead of external link for masonry
            event: event
        }));
    }, [pastEvents]);

    const displayGallery = galleryItems.length > 0 ? galleryItems.map(item => ({
        id: item._id,
        img: item.image,
        title: item.caption
    })) : masonryItems;

    return (
        <div className="pt-24 pb-12 bg-white min-h-screen overflow-x-hidden">
            <SEOHead
                title="HR Events & Workshops in India | myHRSG Community"
                description="Discover upcoming HR events, workshops & networking meetups organized by myHRSG across Pune, Mumbai, Nagpur & more Indian cities."
                path="/events"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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

                            {/* Upcoming Ticker - Only if many events */}
                            {upcomingEvents.length > 4 && (
                                <div className="mb-10 group relative">
                                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
                                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
                                    <div className="flex gap-8 animate-marquee whitespace-nowrap hover:[animation-play-state:paused] py-2">
                                        {[...upcomingEvents, ...upcomingEvents].map((event, idx) => (
                                            <div
                                                key={`${event._id}-${idx}`}
                                                onClick={() => scrollTo(event._id)}
                                                className="inline-flex items-center gap-4 bg-slate-50 hover:bg-primary/5 px-6 py-4 rounded-[1.5rem] border border-slate-100 cursor-pointer transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <CalendarIcon size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-900">{event.title}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[9px] text-slate-400 font-bold uppercase">{event.location}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                        <span className="text-[9px] text-primary font-black uppercase tracking-tighter">Live Track</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {upcomingEvents.length === 0 ? (
                                <div className="relative text-center py-16 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 overflow-hidden z-0">
                                    <img src="/contact-background.jpg" alt="Background" className="absolute inset-0 w-full h-full object-cover object-center opacity-30 grayscale -z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC]/40 via-[#F8FAFC]/20 to-[#F8FAFC] -z-10" />
                                    <CalendarIcon size={32} className="mx-auto text-slate-400 mb-4 relative z-10" />
                                    <p className="text-slate-700 font-bold text-sm mb-1 relative z-10">Exciting events are on the horizon.</p>
                                </div>
                            ) : (
                                <div className="relative w-full py-4 overflow-hidden">
                                    <div className={`flex gap-10 ${upcomingEvents.length > 1 ? "group" : "justify-center"}`}>
                                        <div 
                                            className={`flex gap-10 ${upcomingEvents.length > 1 ? "animate-marquee" : ""} whitespace-nowrap py-4 hover:[animation-play-state:paused]`}
                                            style={{ animationDuration: '40s' }}
                                        >
                                            {(upcomingEvents.length > 1 
                                                ? [...upcomingEvents, ...upcomingEvents, ...upcomingEvents] 
                                                : upcomingEvents
                                            ).map((event, idx) => (
                                                <motion.div
                                                    layoutId={event._id}
                                                    key={`${event._id}-${idx}`}
                                                    className="snap-start min-w-[280px] sm:min-w-[340px] max-w-[340px] flex-shrink-0 bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col group relative transition-all duration-500 hover:shadow-primary/10 whitespace-normal"
                                                >
                                                    {/* Image Preview */}
                                                    <div className="relative h-64 overflow-hidden">
                                                        {event.images && event.images.length > 0 ? (
                                                            <img
                                                                src={`${event.images[0]}?tr=w-800,h-600`}
                                                                alt={event.title}
                                                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
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
                                                            {new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
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
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        <section id="past" className="mb-20 scroll-mt-32">
                            <h2 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">Past Events</h2>

                            {/* Past Ticker - Archive overview */}
                            {pastEvents.length > 4 && (
                                <div className="mb-10 group relative">
                                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
                                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
                                    <div className="flex gap-6 animate-marquee whitespace-nowrap hover:[animation-play-state:paused] py-2 opacity-70 hover:opacity-100 transition-opacity">
                                        {[...pastEvents, ...pastEvents].map((event, idx) => (
                                            <div
                                                key={`${event._id}-${idx}`}
                                                onClick={() => scrollTo(event._id)}
                                                className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-dashed border-slate-200 cursor-pointer"
                                            >
                                                <span className="text-[11px] font-bold text-slate-600">{event.title}</span>
                                                <span className="text-[8px] text-slate-400 font-black px-1.5 py-0.5 bg-slate-50 rounded uppercase tracking-tighter">Archive</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {pastEvents.length === 0 ? (
                                <div className="text-center py-16 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                    <p className="text-slate-500 font-bold text-sm mb-1">No past events to show.</p>
                                </div>
                            ) : (
                                <div className="relative w-full py-4 overflow-hidden">
                                    <div className={`flex gap-10 ${pastEvents.length > 1 ? "group" : "justify-center"}`}>
                                        <div 
                                            className={`flex gap-10 ${pastEvents.length > 1 ? "animate-marquee" : ""} whitespace-nowrap py-4 hover:[animation-play-state:paused]`}
                                            style={{ animationDuration: '50s' }}
                                        >
                                            {(pastEvents.length > 1 
                                                ? [...pastEvents, ...pastEvents, ...pastEvents] 
                                                : pastEvents
                                            ).map((event, idx) => (
                                                <motion.div
                                                    layoutId={event._id}
                                                    key={`${event._id}-${idx}`}
                                                    onClick={() => setExpandedPastEventId(expandedPastEventId === event._id ? null : event._id)}
                                                    className="snap-start min-w-[280px] sm:min-w-[340px] max-w-[340px] flex-shrink-0 bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col group relative transition-all duration-500 hover:shadow-primary/10 cursor-pointer md:cursor-default whitespace-normal"
                                                >
                                                    {/* Image Preview */}
                                                    <div className="relative h-64 overflow-hidden">
                                                        {event.images && event.images.length > 0 ? (
                                                            <img
                                                                src={`${event.images[0]}?tr=w-800,h-600`}
                                                                alt={event.title}
                                                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
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
                                                            {new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                        </div>
                                                    </div>

                                                    <div className="p-8 flex flex-col flex-grow z-10 bg-white">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
                                                        </div>

                                                        <div className={`grid transition-all duration-500 ease-in-out md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] ${expandedPastEventId === event._id ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                                            <div className="overflow-hidden">
                                                                <div className="pt-6">
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

                                                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                                                        <div className="flex items-center gap-2 text-slate-300">
                                                                            <MessageSquare size={16} />
                                                                            <span className="text-[10px] font-black uppercase tracking-widest">Insights</span>
                                                                        </div>
                                                                        <button
                                                                            onClick={(e) => { e.stopPropagation(); handleOpenDetail(event); }}
                                                                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-primary transition-all shadow-xl hover:shadow-primary/30"
                                                                        >
                                                                            View Details
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        <section id="gallery" className="mb-20 scroll-mt-32">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-8 gap-4">
                                <h2 className="text-3xl font-black text-slate-900">Event Gallery</h2>
                            </div>
                            <div className="relative w-full py-10 overflow-hidden bg-slate-900 rounded-[3rem]">
                                <div className={`flex gap-6 ${displayGallery.length > 1 ? "group" : "justify-center"}`}>
                                    <div 
                                        className={`flex gap-6 ${displayGallery.length > 1 ? "animate-marquee" : ""} whitespace-nowrap py-4 hover:[animation-play-state:paused]`}
                                        style={{ animationDuration: '150s' }}
                                    >
                                        {(displayGallery.length > 1 ? [...displayGallery, ...displayGallery, ...displayGallery] : displayGallery).map((item, idx) => (
                                            <a
                                                key={idx}
                                                href={item.img}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="shrink-0 w-80 md:w-96 aspect-square sm:aspect-[4/3] rounded-[2rem] overflow-hidden cursor-pointer group/card relative shadow-lg block"
                                            >
                                                <img src={item.img} alt={item.title} className="w-full h-full object-cover object-top group-hover/card:scale-110 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover/card:opacity-100 transition-opacity duration-300" />
                                                <div className="absolute bottom-6 left-6 right-6 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover/card:opacity-100 md:group-hover/card:translate-y-0 transition-all duration-300 whitespace-normal">
                                                    <h4 className="text-white font-black text-lg">{item.title}</h4>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
                {/* Detailed Modal */}
                <AnimatePresence>
                    {selectedEvent && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedEvent(null)}
                                className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                                className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/20"
                            >
                                {/* Gallery Left */}
                                <div className="md:w-1/2 bg-slate-950 h-64 md:h-full overflow-hidden p-0 relative flex items-center">
                                    {(!selectedEvent.images || selectedEvent.images.length === 0) ? (
                                        <div className="w-full py-32 text-center text-slate-700">
                                            <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                                                <ImageIcon size={32} className="opacity-20" />
                                            </div>
                                            <p className="text-[11px] font-black uppercase tracking-[0.2em]">Archival Mode</p>
                                        </div>
                                    ) : (
                                        <div className="flex gap-4 group">
                                            <div className="flex gap-4 animate-marquee whitespace-nowrap hover:[animation-play-state:paused] items-center">
                                                {[...selectedEvent.images, ...selectedEvent.images, ...selectedEvent.images].map((img, idx) => (
                                                    <div key={idx} className="shrink-0 aspect-square h-56 md:h-80 rounded-[2rem] overflow-hidden shadow-2xl border border-white/5">
                                                        <img src={img} alt={`${selectedEvent.title} - photo ${idx + 1}`} className="w-full h-full object-cover object-top" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Details Right */}
                                <div className="md:w-1/2 flex flex-col p-8 md:p-14 overflow-y-auto bg-white">
                                    <div className="mb-10">
                                        <span className="text-primary font-bold uppercase tracking-widest text-[10px] mb-3 block">Event Details</span>
                                        <h3 className="text-4xl font-black text-slate-900 mb-6 leading-[1.1]">{selectedEvent.title}</h3>

                                        <div className="flex flex-wrap gap-4">
                                            <div className="flex items-center gap-2.5 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                                                <CalendarIcon size={14} className="text-primary" />
                                                <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{new Date(selectedEvent.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                                                <MapPin size={14} className="text-primary" />
                                                <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{selectedEvent.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-12">
                                        <div className="flex items-center gap-4 p-5 bg-slate-900 rounded-[2rem] text-white">
                                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary">
                                                <UserIcon size={24} />
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Mentor / Speaker</span>
                                                <span className="text-lg font-bold">{selectedEvent.mentorName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Comments Moderation Area */}
                                    <div className="border-t border-slate-100 pt-10 flex-grow flex flex-col min-h-0">
                                        <div className="flex items-center justify-between mb-8">
                                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em]">Community Insights</h4>
                                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                <span className="text-[9px] text-slate-500 font-bold uppercase">{eventComments.length} Contributions</span>
                                            </div>
                                        </div>

                                        <div className="space-y-6 mb-10 overflow-y-auto pr-3 custom-scrollbar flex-grow">
                                            {eventComments.map((c, i) => (
                                                <div key={i} className="group/comment relative">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center text-primary font-black text-xs border border-slate-100 shadow-sm">
                                                            {c.userName?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-[11px] font-black text-slate-900">{c.userName}</span>
                                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                                                                    {new Date(c.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-[12px] text-slate-600 font-medium leading-[1.6] bg-slate-50/50 p-4 rounded-2xl rounded-tl-none border border-slate-50">
                                                                {c.text}
                                                            </p>
                                                        </div>

                                                        {/* Admin Delete Action */}
                                                        {(user?.role?.toLowerCase() === "admin") && (
                                                            <button
                                                                onClick={() => handleDeleteComment(c._id)}
                                                                className="opacity-0 group-hover/comment:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all h-fit"
                                                                title="Delete Comment"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {eventComments.length === 0 && (
                                                <div className="text-center py-12 bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Awaiting the first insight...</p>
                                                </div>
                                            )}
                                        </div>

                                        {user ? (
                                            <div className="relative mt-auto">
                                                <input
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    placeholder="Share your perspective..."
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-8 pr-16 text-xs font-bold focus:border-primary focus:bg-white outline-none transition-all shadow-inner"
                                                />
                                                <button
                                                    onClick={() => handleAddComment(selectedEvent._id)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-xl hover:bg-primary-dark transition-all shadow-lg"
                                                >
                                                    <Send size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="mt-auto bg-blue-50/30 p-5 rounded-2xl border border-blue-100/50 text-center">
                                                <p className="text-[10px] text-blue-600 font-black uppercase tracking-tight">Login to join the dialogue</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
