import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Video, Maximize2, X, MapPin, Linkedin, ExternalLink } from "lucide-react";

export const TestimonialSlider = ({ testimonials }) => {
  const [expandedTestimonial, setExpandedTestimonial] = useState(null);
  const total = testimonials.length;

  if (!testimonials || total === 0) return null;

  const isYouTubeUrl = (url) => {
    return url && (url.includes("youtube.com") || url.includes("youtu.be"));
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("youtube.com/embed/")[1].split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  return (
    <div className="space-y-8 py-12">
      <div className="text-center md:text-left">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-sans">
          Testimonials
        </h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
          Video Testimonials
        </p>
      </div>

      {/* Infinite Scrolling Marquee Slider for Testimonials */}
      <div className="relative w-full py-4 overflow-hidden">
        <div className={`flex gap-6 ${total > 1 ? "group" : "justify-center"}`}>
          <div 
            className={`flex gap-6 ${total > 1 ? "animate-marquee" : ""} whitespace-nowrap py-4 hover:[animation-play-state:paused]`}
            style={{ animationDuration: "50s" }}
          >
            {(total > 1 
              ? [...testimonials, ...testimonials, ...testimonials] 
              : testimonials
            ).map((item, idx) => {
              if (!item) return null;
              const key = `${item._id}-${idx}`;
              return (
                <div
                  key={key}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col justify-between h-full group hover:shadow-2xl transition-all duration-300 cursor-pointer w-80 flex-shrink-0 whitespace-normal"
                  onClick={() => {
                    if (item.link) {
                      window.open(item.link, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  <div className="space-y-6">
                    {/* Video Thumbnail / Preview Container */}
                    <div className="aspect-[16/9] rounded-3xl bg-slate-950 overflow-hidden relative shadow-inner group/video">
                      {/* Dark overlay with redirect icon on hover */}
                      <div className="absolute inset-0 bg-slate-900/30 group-hover/video:bg-slate-900/50 transition-all duration-300 flex items-center justify-center z-10">
                        <div className="w-12 h-12 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md flex items-center justify-center text-white scale-90 group-hover/video:scale-100 transition-all duration-300 shadow-lg">
                          <ExternalLink size={20} />
                        </div>
                      </div>
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.name || "Testimonial cover"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500">
                          <Video size={32} />
                        </div>
                      )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-150 shadow-sm flex items-center justify-center">
                        <User size={20} className="text-slate-400" />
                      </div>
                      <div className="space-y-0.5 flex-grow">
                        <h4 className="text-sm font-black text-slate-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider line-clamp-1">
                          {item.designation || (item.type === "member" ? "myHRSG Member" : "Sponsor Partner")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fullscreen Video Expansion Modal Lightbox (Clean Max-Height Fit) */}
      <AnimatePresence>
        {expandedTestimonial && (
          <div
            className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6"
            onClick={() => setExpandedTestimonial(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-3xl w-full bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col my-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setExpandedTestimonial(null)}
                className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all border border-white/10"
              >
                <X size={16} />
              </button>

              {/* Responsive Video Player */}
              <div className="w-full bg-black flex items-center justify-center overflow-hidden max-h-[55vh] aspect-video">
                {isYouTubeUrl(expandedTestimonial.video) ? (
                  <iframe
                    src={`${getYouTubeEmbedUrl(expandedTestimonial.video)}?autoplay=1`}
                    className="w-full h-full border-none aspect-video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={expandedTestimonial.video}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-h-[55vh] object-contain"
                  />
                )}
              </div>

              {/* Description/Info Footer */}
              <div className="p-6 bg-slate-900 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                <div className="flex items-center gap-4">
                  {expandedTestimonial.type === "member" && expandedTestimonial.member ? (
                    <>
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                        {expandedTestimonial.member.profileImage ? (
                          <img
                            src={expandedTestimonial.member.profileImage}
                            alt={expandedTestimonial.member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={20} className="text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-black text-white text-base">
                          {expandedTestimonial.member.name}
                        </h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                          {expandedTestimonial.member.position ? `${expandedTestimonial.member.position} at ` : ""}
                          {expandedTestimonial.member.company || "myHRSG Member"}
                        </p>
                      </div>
                    </>
                  ) : expandedTestimonial.type === "sponsor" && expandedTestimonial.sponsor ? (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center p-2 border border-white/10 shrink-0">
                        {expandedTestimonial.sponsor.logo ? (
                          <img
                            src={expandedTestimonial.sponsor.logo}
                            alt={expandedTestimonial.sponsor.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <Video size={20} className="text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-black text-white text-base">
                          {expandedTestimonial.sponsor.name}
                        </h4>
                        <p className="text-xs text-primary font-bold uppercase tracking-wider">
                          Sponsor Partner
                        </p>
                      </div>
                    </>
                  ) : null}
                </div>
                {expandedTestimonial.caption && (
                  <p className="text-sm text-slate-300 italic font-medium max-w-md sm:text-right">
                    "{expandedTestimonial.caption}"
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
