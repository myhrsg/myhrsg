import React from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CertificationCard = ({ title, description, link, index, isOpen, onToggle }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className={`bg-white border transition-all duration-300 rounded-[2rem] overflow-hidden ${
                isOpen ? 'ring-2 ring-primary/20 border-primary/20 shadow-2xl' : 'border-slate-100 shadow-sm'
            }`}
        >
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center p-8 text-left transition-colors bg-white hover:bg-slate-50/50 group"
            >
                <div className="flex gap-6 items-center">
                    <span className={`text-4xl font-black transition-colors ${isOpen ? 'text-primary' : 'text-slate-200 group-hover:text-slate-300'}`}>
                        {index < 10 ? `0${index}` : index}
                    </span>
                    <span className={`text-xl font-bold transition-all ${isOpen ? 'text-primary' : 'text-slate-800'}`}>
                        {title}
                    </span>
                </div>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 shadow-sm ${
                    isOpen ? 'bg-primary text-white rotate-180 shadow-primary/30' : 'bg-slate-900 text-white'
                }`}>
                    <ChevronDown size={20} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-8 pt-0 text-slate-600">
                            <div className="border-t border-slate-100 pt-6">
                                <div className="mb-8 leading-relaxed text-lg font-medium">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px] block mb-2">Program Overview</span>
                                    {description}
                                </div>
                                <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 group/btn"
                                >
                                    Visit Official Site
                                    <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CertificationCard;