import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        
        try {
            const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
            await axios.post(`${apiBase}/contact/submit`, formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error('Contact error:', error);
            setStatus('error');
            setErrorMessage(error.response?.data?.error || 'Something went wrong. Please try again.');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    const inputClasses = "w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium text-slate-900 placeholder:text-slate-400";

    return (
        <div className="relative">
            <AnimatePresence mode="wait">
                {status === 'success' ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-emerald-50 border-2 border-emerald-100 p-10 rounded-[2.5rem] text-center"
                    >
                        <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Message Sent!</h3>
                        <p className="text-slate-600 font-medium">Thank you for reaching out. Our team will get back to you shortly.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white p-8 lg:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100"
                    >
                        <div className="mb-10">
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Send us a message</h3>
                            <p className="text-slate-500 font-medium italic">Fields marked with * are required</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className={inputClasses}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className={inputClasses}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject *</label>
                                <input
                                    type="text"
                                    id="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="How can we help?"
                                    className={inputClasses}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Message *</label>
                                <textarea
                                    id="message"
                                    required
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Write your message here..."
                                    className={`${inputClasses} resize-none`}
                                ></textarea>
                            </div>

                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 text-sm font-bold"
                                >
                                    <AlertCircle size={18} />
                                    <span>{errorMessage}</span>
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={status === 'loading'}
                                type="submit"
                                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-primary transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        <span>Send Inquiry</span>
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ContactForm;
