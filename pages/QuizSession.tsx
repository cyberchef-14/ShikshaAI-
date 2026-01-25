import React, { useState, useEffect } from 'react';
import { Quiz, QuizQuestion, QuizType } from '../types';
import { QuizResultView } from '../components/QuizResultView';
import { AlertTriangle, Clock, Maximize, AlertOctagon, CheckCircle2, Lightbulb, XCircle, ArrowRight, Brain, Activity, RefreshCcw } from 'lucide-react';
import { useStudent } from '../context/StudentContext';

interface QuizSessionProps {
  quiz: Quiz;
  onExit: () => void;
}

export const QuizSession: React.FC<QuizSessionProps> = ({ quiz, onExit }) => {
  const { digitalTwin, recordMistake, recordQuizMistake, completeActivity } = useStudent();
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.durationMinutes * 60);
  
  // Feedback Card State
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
                handleFinish();
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  const handleFinish = () => {
      setFinished(true);
      if (document.fullscreenElement) document.exitFullscreen();
      
      // Calculate Score
      let correctCount = 0;
      quiz.questions.forEach(q => {
          if (answers[q.id] === q.correctIndex) correctCount++;
      });
      const score = quiz.questions.length > 0 ? correctCount / quiz.questions.length : 0;
      
      // Update Student Stats
      completeActivity(quiz.chapterId, score, 'quiz');
  };

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

      if (quiz.type !== QuizType.STANDARD) {
          const isCorrect = optIndex === q.correctIndex;
          setFeedbackCorrect(isCorrect);
          setFeedbackQuestion(q);
          setShowFeedback(true);
          
          if (!isCorrect) {
              recordMistake(q.conceptTag);
              recordQuizMistake(q.id, q.text, q.options[optIndex], q.options[q.correctIndex], quiz.chapterId);
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
                onExit={onExit} 
              />
          </div>
      );
  }

  if (!started) {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      {quiz.type === QuizType.STANDARD ? <AlertOctagon size={32} /> : <CheckCircle2 size={32} />}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
                  <p className="text-gray-500 mb-6">
                      {quiz.type === QuizType.ADAPTIVE ? "AI generated this quiz." : "Ready to test your knowledge?"}
                  </p>
                  <button 
                    onClick={enterFullscreen}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                      {quiz.type === QuizType.STANDARD ? <Maximize size={20} /> : <ArrowRight size={20} />} 
                      Start Quiz
                  </button>
                  <button onClick={onExit} className="mt-4 text-gray-400 hover:text-gray-600 text-sm">Cancel</button>
              </div>
          </div>
      );
  }

  const question = quiz.questions[currentQIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans select-none relative">
        {showViolationWarning && (
            <div className="fixed inset-0 bg-red-900/90 z-50 flex items-center justify-center p-6 animate-pulse">
                <div className="bg-white rounded-2xl p-8 text-center max-w-sm">
                    <AlertTriangle size={48} className="text-red-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Exam Violation!</h2>
                    <button onClick={() => setShowViolationWarning(false)} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold mt-4">Continue</button>
                </div>
            </div>
        )}

        {showFeedback && feedbackQuestion && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
                <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                    <div className={`p-6 flex items-center gap-4 ${feedbackCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                        <h2 className="text-xl font-bold text-white">{feedbackCorrect ? 'Correct!' : 'Incorrect'}</h2>
                    </div>
                    <div className="p-6">
                        {!feedbackCorrect && <p className="text-sm text-gray-700 mb-4">{feedbackQuestion.explanation}</p>}
                        <button 
                            onClick={() => {
                                setShowFeedback(false);
                                if (currentQIndex < quiz.questions.length - 1) setCurrentQIndex(prev => prev + 1);
                                else handleFinish();
                            }}
                            className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        )}

        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
            <div>
                <h2 className="font-bold text-gray-800">{quiz.title}</h2>
                <div className="text-xs text-gray-400">Question {currentQIndex + 1} of {quiz.questions.length}</div>
            </div>
            <div className="flex items-center gap-2 font-mono font-bold text-xl text-gray-700">
                <Clock size={20} /> {formatTime(timeLeft)}
            </div>
        </header>

        <main className="flex-1 max-w-5xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 min-h-[200px] flex items-center">
                    <h3 className="text-xl font-medium text-gray-900">{question.text}</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {question.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(question.id, idx)}
                            className={`p-5 rounded-xl border-2 text-left font-medium transition-all ${answers[question.id] === idx ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white hover:border-blue-200'}`}
                        >
                            <span className="mr-3 font-bold text-gray-400">{String.fromCharCode(65 + idx)}.</span> {opt}
                        </button>
                    ))}
                </div>
                {quiz.type === QuizType.STANDARD && (
                    <div className="flex justify-between pt-4">
                        <button disabled={currentQIndex === 0} onClick={() => setCurrentQIndex(prev => prev - 1)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 disabled:opacity-50">Previous</button>
                        {currentQIndex < quiz.questions.length - 1 ? (
                            <button onClick={() => setCurrentQIndex(prev => prev + 1)} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg">Next</button>
                        ) : (
                            <button onClick={handleFinish} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg">Submit</button>
                        )}
                    </div>
                )}
            </div>
        </main>
    </div>
  );
};