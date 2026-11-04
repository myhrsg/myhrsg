import { motion } from "motion/react";
import { Linkedin, MapPin } from "lucide-react";

export const MentorCards = () => {
  const mentors = [
    {
      name: "Kaustubh Karwe",
      role: "Senior HR Leader",
      location: "Pune",
      initials: "KK",
      linkedin: "#",
    },
    {
      name: "Avijit Mohapatra",
      role: "Business Leader",
      location: "Pan-India",
      initials: "AM",
      linkedin: "#",
    },
    {
      name: "Mayank Khanna",
      role: "HR Strategist",
      location: "Delhi",
      initials: "MK",
      linkedin: "#",
    },
    {
      name: "Pardip More",
      role: "HR Excellence",
      location: "Mumbai",
      initials: "PM",
      linkedin: "#",
    },
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">
            Our Guidance
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Mentors & Committee
          </h2>
          <p className="text-slate-500 font-medium italic">
            Guided by industry veterans and HR leaders committed to societal
            growth and professional excellence.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 mx-auto">
          {mentors.map((mentor, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group text-center w-full sm:w-72"
            >
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                  {mentor.initials}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                {mentor.name}
              </h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
                {mentor.role}
              </p>

              <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-50">
                <MapPin size={14} className="text-primary" />
                <span className="text-slate-400 font-bold text-xs uppercase tracking-tight">
                  {mentor.location}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
