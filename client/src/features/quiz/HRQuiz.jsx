import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Trophy, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { api } from "../../services/api.js";

const CircularProgress = ({ current, total, size = 120, strokeWidth = 8, isPercentage = false }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = isPercentage ? current : (current / total) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Fill */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#0A66C2"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${isPercentage ? 'text-3xl' : 'text-4xl'} font-black text-slate-800 tracking-tighter`}>
            {current}{isPercentage && "%"}
        </span>
        {!isPercentage && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{current}/{total}</span>}
      </div>
    </div>
  );
};

export const HRQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selections, setSelections] = useState({}); // Store selections by question index
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
        try {
            const data = await api.getQuizQuestions();
            setQuestions(data || []);
        } catch (err) {
            console.error("Failed to fetch quiz:", err);
        } finally {
            setLoading(false);
        }
    };
    fetchQuestions();
  }, []);

  const handleNext = () => {
    const next = currentQuestion + 1;
    if (next < questions.length) {
      setCurrentQuestion(next);
    } else {
        if (isReviewMode) {
            setShowResult(true); 
        } else {
            let finalScore = 0;
            questions.forEach((q, idx) => {
                if (selections[idx] === q.answerIndex) {
                    finalScore += 1;
                }
            });
            setScore(finalScore);
            setIsReviewMode(true);
            setCurrentQuestion(0);
        }
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const currentSelection = selections[currentQuestion] ?? null;
  const isCorrect = currentSelection === questions[currentQuestion]?.answerIndex;

  if (loading) {
    return (
        <div className="pt-32 pb-12 flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <Loader2 className="text-primary animate-spin mb-4" size={40} />
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Preparing assessment...</p>
        </div>
    );
  }

  if (questions.length === 0) {
    return (
        <div className="pt-32 pb-12 flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Quiz Coming Soon!</h2>
            <p className="text-slate-500 font-medium text-sm">The assessment team is currently curating new content.</p>
        </div>
    );
  }

  const scorePercentage = Math.round((score / questions.length) * 100);

  return (
    <div className="pt-24 pb-12 bg-slate-50/50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Quiz Header */}
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight font-serif inline-block border-b-4 border-primary/10 pb-2">
            Quizzes – Let's Play, Learn, and Sharpen Your HR Basics
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-center lg:items-center">
            {!showResult ? (
                <>
                {/* Main Card */}
                <div className="flex-grow w-full lg:max-w-4xl bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-500">
                    <div className="p-8 lg:p-14 relative">
                    {/* Linear Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-50">
                        <motion.div 
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                        {/* Review Status Heading */}
                        {isReviewMode && (
                            <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                {isCorrect ? (
                                    <CheckCircle2 className="text-emerald-500" size={20} />
                                ) : (
                                    <XCircle className="text-rose-500" size={20} />
                                )}
                                <span className={`text-xs font-black uppercase tracking-[0.2em] ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {isCorrect ? "Correct Answer" : "Incorrect Answer"}
                                </span>
                            </div>
                        )}

                        {/* Question Content Layout */}
                        <div className="flex flex-col md:flex-row gap-8 lg:gap-14 items-center md:items-start">
                            {/* Index Area */}
                            <div className="flex items-start">
                                <span className="text-5xl md:text-6xl font-black text-slate-200 leading-none select-none tracking-tighter">
                                    {String(currentQuestion + 1).padStart(2, '0')}
                                </span>
                                <div className="hidden md:block w-px h-12 bg-slate-100 ml-8 lg:ml-14" />
                            </div>

                            {/* Question Area */}
                            <div className="flex-grow space-y-10 w-full md:w-auto">
                                <div>
                                    <h3 className="text-xl lg:text-2xl font-bold text-slate-800 leading-relaxed font-serif">
                                        {questions[currentQuestion].question}
                                    </h3>
                                </div>

                                {/* Options */}
                                <div className="space-y-4">
                                    {questions[currentQuestion].options.map((option, idx) => {
                                        const isAnswer = idx === questions[currentQuestion].answerIndex;
                                        const isSelected = idx === currentSelection;
                                        
                                        let optionColorClass = "border-slate-50 bg-slate-50/30 hover:border-slate-200 hover:bg-slate-50/50";
                                        let textColorClass = "text-slate-500";
                                        
                                        if (isReviewMode) {
                                            if (isAnswer) {
                                                optionColorClass = "border-emerald-200 bg-emerald-50/50";
                                                textColorClass = "text-emerald-800";
                                            } else if (isSelected) {
                                                optionColorClass = "border-rose-200 bg-rose-50/50";
                                                textColorClass = "text-rose-800";
                                            }
                                        } else if (isSelected) {
                                            optionColorClass = "border-primary/20 bg-primary/5 shadow-inner";
                                            textColorClass = "text-slate-900 font-bold";
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                disabled={isReviewMode}
                                                onClick={() => setSelections(prev => ({ ...prev, [currentQuestion]: idx }))}
                                                className={`w-full text-left flex items-start gap-4 p-5 rounded-xl border-2 transition-all outline-none ${optionColorClass}`}
                                            >
                                                <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                                    isSelected ? (isReviewMode && !isCorrect ? "border-rose-500" : "border-primary") : "border-slate-200"
                                                }`}>
                                                    {(isSelected || (isReviewMode && isAnswer)) && <div className={`w-2 h-2 rounded-full ${isReviewMode && isAnswer ? 'bg-emerald-500' : 'bg-primary'}`} />}
                                                </div>
                                                <span className={`text-sm lg:text-base font-medium leading-relaxed transition-colors ${textColorClass}`}>
                                                    {option}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-4 md:pl-[120px] lg:pl-[148px] pt-12">
                            {currentQuestion > 0 && (
                                <button 
                                    onClick={handleBack}
                                    className="text-slate-400 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:text-slate-800 hover:bg-slate-100 transition-all flex items-center gap-2"
                                >
                                    Previous
                                </button>
                            )}
                            <button 
                                onClick={handleNext}
                                disabled={!isReviewMode && currentSelection === null}
                                className="bg-primary text-white px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary-dark transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-primary/10 flex items-center gap-3"
                            >
                                {isReviewMode ? (currentQuestion === questions.length - 1 ? "Finish Session" : "Review Next") : "Next Question"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Circle Area */}
                <div className="shrink-0 lg:sticky lg:top-32 h-fit flex flex-col items-center">
                    <CircularProgress 
                        current={isReviewMode ? scorePercentage : 0} 
                        total={100} 
                        size={220}
                        strokeWidth={8}
                        isPercentage={true}
                    />
                </div>
                </>
            ) : (
                <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-12 lg:p-20 text-center animate-in fade-in zoom-in duration-500">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-16 mb-20 text-center">
                        <div>
                            <span className="text-4xl font-black text-emerald-600 block mb-2">{score}</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Qualified</span>
                        </div>
                        <div className="hidden md:block w-px h-16 bg-slate-100" />
                        <div>
                            <span className="text-4xl font-black text-rose-600 block mb-2">{questions.length - score}</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Refinement</span>
                        </div>
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6 font-serif tracking-tight">Assessment Review Optimized</h2>
                    <p className="text-slate-400 font-medium mb-12 max-w-sm mx-auto leading-relaxed text-sm italic">
                        The knowledge review process is complete. Your professional insights have been recorded.
                    </p>
                    <button 
                        onClick={() => { setCurrentQuestion(0); setSelections({}); setScore(0); setShowResult(false); setIsReviewMode(false); }}
                        className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-primary-dark transition-all shadow-2xl shadow-primary/20 flex items-center gap-3 mx-auto"
                    >
                        Reset Hub
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default HRQuiz;
