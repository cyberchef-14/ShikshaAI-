import React, { useState, useEffect } from 'react';
import { Quiz, QuizQuestion, QuizType } from '../types';
import { QuizResultView } from '../components/QuizResultView';
import { AlertTriangle, Clock, Maximize, AlertOctagon, CheckCircle2, Lightbulb, XCircle, ArrowRight, Brain, Activity } from 'lucide-react';
import { useStudent } from '../context/StudentContext';

interface QuizSessionProps {
  quiz: Quiz;
  onExit: () => void;
}

export const QuizSession: React.FC<QuizSessionProps> = ({ quiz, onExit }) => {
  const { digitalTwin, recordMistake } = useStudent();
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.durationMinutes * 60);
  
  // New: Feedback Card State
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [feedbackQuestion, setFeedbackQuestion] = useState<QuizQuestion | null>(null);

  // Safe Exam State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violations, setViolations] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);

  // Timer
  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
        setTimeLeft(prev => {
            if (prev <= 1) {
                setFinished(true);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  // Safe Exam Browsing Logic (Only for Standard Quizzes)
  useEffect(() => {
      if (!started || finished || quiz.type !== QuizType.STANDARD) return;

      const handleVisibilityChange = () => {
          if (document.hidden) {
              setViolations(v => v + 1);
              setShowViolationWarning(true);
          }
      };

      const handleFullscreenChange = () => {
          if (!document.fullscreenElement) {
              setIsFullscreen(false);
          } else {
              setIsFullscreen(true);
          }
      };

      const handleContextMenu = (e: MouseEvent) => e.preventDefault();

      document.addEventListener("visibilitychange", handleVisibilityChange);
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      document.addEventListener("contextmenu", handleContextMenu);

      return () => {
          document.removeEventListener("visibilitychange", handleVisibilityChange);
          document.removeEventListener("fullscreenchange", handleFullscreenChange);
          document.removeEventListener("contextmenu", handleContextMenu);
      };
  }, [started, finished, quiz.type]);

  const enterFullscreen = () => {
      if (quiz.type === QuizType.STANDARD) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error("Error attempting to enable full-screen mode:", err);
        });
        setIsFullscreen(true);
      }
      setStarted(true);
  };

  const handleAnswer = (qId: string, optIndex: number) => {
      const q = quiz.questions.find(q => q.id === qId);
      if (!q) return;

      setAnswers(prev => ({ ...prev, [qId]: optIndex }));

      // Immediate Logic for Interactive Quizzes (Diagnostic, Micro, Confidence)
      if (quiz.type !== QuizType.STANDARD) {
          const isCorrect = optIndex === q.correctIndex;
          setFeedbackCorrect(isCorrect);
          setFeedbackQuestion(q);
          setShowFeedback(true);
          
          if (!isCorrect) {
              recordMistake(q.conceptTag);
          }
      }
  };

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (finished) {
      return (
          <div className="min-h-screen bg-gray-50 py-10">
              <QuizResultView 
                quiz={quiz} 
                answers={answers} 
                onRetry={() => {
                    setFinished(false);
                    setStarted(false);
                    setAnswers({});
                    setTimeLeft(quiz.durationMinutes * 60);
                    setViolations(0);
                    setCurrentQIndex(0);
                }} 
                onExit={() => {
                    if (document.fullscreenElement) document.exitFullscreen();
                    onExit();
                }} 
              />
          </div>
      );
  }

  if (!started) {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
                  {/* Decorative Background */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      {quiz.type === QuizType.STANDARD ? <AlertOctagon size={32} /> : 
                       quiz.type === QuizType.DIAGNOSTIC ? <Activity size={32} /> :
                       quiz.type === QuizType.MICRO ? <Brain size={32} /> : <CheckCircle2 size={32} />}
                  </div>
                  
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
                  <p className="text-gray-500 mb-6">
                      {quiz.type === QuizType.STANDARD 
                        ? "This assessment requires full-screen mode. No switching tabs." 
                        : quiz.type === QuizType.DIAGNOSTIC
                        ? "A quick check to see where you stand before we begin."
                        : "A short practice to build your confidence and mastery."}
                  </p>
                  
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left text-sm space-y-2">
                      <div className="flex justify-between">
                          <span className="text-gray-500">Duration:</span>
                          <span className="font-bold">{quiz.durationMinutes} Minutes</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-gray-500">Questions:</span>
                          <span className="font-bold">{quiz.questions.length}</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-gray-500">Type:</span>
                          <span className="font-bold uppercase text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{quiz.type}</span>
                      </div>
                  </div>

                  <button 
                    onClick={enterFullscreen}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                      {quiz.type === QuizType.STANDARD ? <Maximize size={20} /> : <ArrowRight size={20} />} 
                      {quiz.type === QuizType.STANDARD ? "Enter Full Screen & Start" : "Start Quiz"}
                  </button>
                  <button onClick={onExit} className="mt-4 text-gray-400 hover:text-gray-600 text-sm">Cancel</button>
              </div>
          </div>
      );
  }

  // Active Quiz UI
  const question = quiz.questions[currentQIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans select-none relative">
        
        {/* Violation Warning Overlay (Standard Only) */}
        {showViolationWarning && (
            <div className="fixed inset-0 bg-red-900/90 z-50 flex items-center justify-center p-6 animate-pulse">
                <div className="bg-white rounded-2xl p-8 text-center max-w-sm">
                    <AlertTriangle size={48} className="text-red-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Exam Violation Detected!</h2>
                    <p className="text-gray-700 mb-6">Navigating away from the exam window is not allowed.</p>
                    <button 
                        onClick={() => setShowViolationWarning(false)}
                        className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        )}

        {/* FEEDBACK OVERLAY (For Micro/Confidence/Diagnostic) */}
        {showFeedback && feedbackQuestion && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
                <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all scale-100">
                    {/* Feedback Header */}
                    <div className={`p-6 flex items-center gap-4 ${feedbackCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                        <div className="bg-white/20 p-3 rounded-full text-white">
                            {feedbackCorrect ? <CheckCircle2 size={32} /> : <Brain size={32} />}
                        </div>
                        <div className="text-white">
                            <h2 className="text-xl font-bold">{feedbackCorrect ? 'Well Done!' : 'Why Am I Stuck?'}</h2>
                            <p className="opacity-90 text-sm">
                                {feedbackCorrect ? 'You nailed this concept!' : 'Let\'s analyze the confusion.'}
                            </p>
                        </div>
                    </div>
                    
                    {/* Analysis Body */}
                    <div className="p-6">
                        {!feedbackCorrect && (
                             <div className="mb-6">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Root Cause Analysis</div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                    {feedbackQuestion.conceptTag} Concept is Weak.
                                </h3>
                                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        <span className="font-bold block mb-1">AI Explanation:</span>
                                        {feedbackQuestion.explanation}
                                    </p>
                                </div>
                             </div>
                        )}
                        
                        {feedbackCorrect && (
                             <div className="mb-6">
                                <p className="text-gray-600">Great job! You demonstrated strong understanding of <strong>{feedbackQuestion.conceptTag}</strong>.</p>
                             </div>
                        )}

                        <button 
                            onClick={() => {
                                setShowFeedback(false);
                                if (currentQIndex < quiz.questions.length - 1) {
                                    setCurrentQIndex(prev => prev + 1);
                                } else {
                                    setFinished(true);
                                }
                            }}
                            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95
                                ${feedbackCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-900 hover:bg-gray-800'}
                            `}
                        >
                            {currentQIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
            <div>
                <h2 className="font-bold text-gray-800">{quiz.title}</h2>
                <div className="text-xs text-gray-400">Question {currentQIndex + 1} of {quiz.questions.length}</div>
            </div>
            <div className={`flex items-center gap-2 font-mono font-bold text-xl ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
                <Clock size={20} />
                {formatTime(timeLeft)}
            </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-5xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Question Card */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 min-h-[300px] flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <h3 className="text-xl font-medium text-gray-900 leading-relaxed">
                        {question.text}
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {question.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(question.id, idx)}
                            className={`p-5 rounded-xl border-2 text-left font-medium transition-all group relative overflow-hidden
                                ${answers[question.id] === idx 
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                                    : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50 text-gray-700'}
                            `}
                        >
                            <span className="mr-3 font-bold text-gray-400 group-hover:text-blue-500">{String.fromCharCode(65 + idx)}.</span>
                            {opt}
                        </button>
                    ))}
                </div>

                {/* Navigation (Only shown if NOT interactive immediate feedback mode) */}
                {quiz.type === QuizType.STANDARD && (
                    <div className="flex justify-between pt-4">
                        <button 
                            disabled={currentQIndex === 0}
                            onClick={() => setCurrentQIndex(prev => prev - 1)}
                            className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {currentQIndex < quiz.questions.length - 1 ? (
                            <button 
                                onClick={() => setCurrentQIndex(prev => prev + 1)}
                                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 shadow-lg"
                            >
                                Next Question
                            </button>
                        ) : (
                            <button 
                                onClick={() => setFinished(true)}
                                className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg"
                            >
                                Submit Assessment
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Sidebar Navigator */}
            <div className="hidden lg:block">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Question Map</h4>
                    <div className="grid grid-cols-4 gap-3">
                        {quiz.questions.map((q, idx) => {
                            const isAnswered = answers[q.id] !== undefined;
                            const isCurrent = currentQIndex === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentQIndex(idx)}
                                    disabled={quiz.type !== QuizType.STANDARD && !isAnswered} // Prevent skipping in linear modes
                                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-all
                                        ${isCurrent ? 'ring-2 ring-blue-500 bg-blue-50 text-blue-600' :
                                          isAnswered ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}
                                    `}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm mb-2">
                             <span className="text-gray-500">Progress</span>
                             <span className="font-bold text-blue-600">{Object.keys(answers).length}/{quiz.questions.length}</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div 
                                className="bg-blue-600 h-full transition-all duration-300" 
                                style={{ width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {violations > 0 && (
                        <div className="mt-6 bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2 text-xs text-red-600 font-bold">
                            <AlertTriangle size={16} /> {violations} Security Warnings
                        </div>
                    )}
                </div>
            </div>
        </main>
    </div>
  );
};