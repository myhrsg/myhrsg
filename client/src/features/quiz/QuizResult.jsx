import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, RotateCcw, ChevronLeft, ChevronRight, FileText, BarChart3 } from 'lucide-react';

const QuizResult = ({ score, questions, userAnswers }) => {
    const [reviewIndex, setReviewIndex] = useState(0);

    return (
        <div className="min-h-screen bg-white pt-24 pb-16 lg:pt-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header Notice */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900 text-white p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-white/10 rounded-2xl">
                                    <FileText size={32} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold uppercase tracking-widest text-primary mb-1">Results Overview</h2>
                                    <p className="text-slate-400 font-medium text-sm leading-relaxed">
                                        Your performance has been evaluated based on the criteria provided in the HR fundamentals assessment.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Question Review Card */}
                        <motion.div 
                            key={reviewIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-8 lg:p-12 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <span className="text-5xl font-bold text-slate-50">{reviewIndex + 1}</span>
                            </div>

                            <div className="relative z-10">
                                <span className="text-primary font-bold uppercase tracking-widest text-[10px] mb-6 block">Response Review</span>
                                <h2 className="text-xl font-serif font-bold text-slate-800 mb-8 leading-snug">
                                    {questions[reviewIndex].question}
                                </h2>

                                <div className="grid grid-cols-1 gap-4">
                                    {questions[reviewIndex].options.map((option) => {
                                        const isCorrect = option === questions[reviewIndex].correctAnswer;
                                        const isSelected = option === userAnswers[reviewIndex];

                                        return (
                                            <div 
                                                key={option} 
                                                className={`flex items-center justify-between p-5 rounded-xl border transition-all ${
                                                    isCorrect 
                                                        ? 'border-green-100 bg-green-50/50' 
                                                        : isSelected 
                                                            ? 'border-red-100 bg-red-50/50' 
                                                            : 'border-slate-50 bg-white opacity-60'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                                        isCorrect ? 'bg-green-500 text-white' : isSelected ? 'bg-red-500 text-white' : 'bg-slate-100 border border-slate-200'
                                                    }`}>
                                                        {isCorrect ? <CheckCircle2 size={12} /> : isSelected ? <XCircle size={12} /> : null}
                                                    </div>
                                                    <span className={`text-base font-medium ${isCorrect ? 'text-green-700' : isSelected ? 'text-red-700' : 'text-slate-600'}`}>
                                                        {option}
                                                    </span>
                                                </div>
                                                {isCorrect && <span className="text-[9px] font-black uppercase tracking-widest text-green-600 bg-white px-3 py-1 rounded-full border border-green-100 shadow-sm font-sans">Correct Answer</span>}
                                                {isSelected && !isCorrect && <span className="text-[9px] font-black uppercase tracking-widest text-red-600 bg-white px-3 py-1 rounded-full border border-red-100 shadow-sm font-sans">Your Choice</span>}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-10 flex items-center justify-between border-t border-slate-50 pt-8">
                                    <button
                                        onClick={() => setReviewIndex(prev => Math.max(0, prev - 1))}
                                        disabled={reviewIndex === 0}
                                        className={`flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] transition-all px-4 py-2 ${
                                            reviewIndex === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg'
                                        }`}
                                    >
                                        <ChevronLeft size={16} />
                                        Previous Review
                                    </button>
                                    <button
                                        onClick={() => setReviewIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                        disabled={reviewIndex === questions.length - 1}
                                        className={`flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] transition-all px-4 py-2 ${
                                            reviewIndex === questions.length - 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg'
                                        }`}
                                    >
                                        Next Review
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Result Sidebar */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:sticky lg:top-10 space-y-6"
                    >
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Performance Score</span>
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-50" />
                                    <motion.circle 
                                        initial={{ strokeDashoffset: 502.4 }}
                                        animate={{ strokeDashoffset: 502.4 - (502.4 * score) / 100 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="10" fill="transparent"
                                        strokeDasharray={502.4}
                                        strokeLinecap="round"
                                        className="text-primary"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center pt-2">
                                    <span className="text-4xl font-black text-slate-900 leading-none">{Math.round(score)}<span className="text-primary">%</span></span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Proficiency</span>
                                </div>
                            </div>

                            <div className="mt-10 w-full space-y-3">
                                <button 
                                    onClick={() => window.location.reload()} 
                                    className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] py-4 rounded-xl hover:bg-slate-800 transition-all"
                                >
                                    <RotateCcw size={16} />
                                    Reset Assessment
                                </button>
                                <button 
                                    onClick={() => window.history.back()}
                                    className="w-full flex items-center justify-center gap-3 border border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 rounded-xl hover:bg-slate-50 transition-all font-sans"
                                >
                                    Return to Hub
                                </button>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Correct Reference</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Provided Response</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default QuizResult;