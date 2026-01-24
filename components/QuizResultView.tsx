import React from 'react';
import { Quiz } from '../types';
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, RefreshCcw } from 'lucide-react';

interface QuizResultViewProps {
  quiz: Quiz;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
  onRetry: () => void;
  onExit: () => void;
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({ quiz, answers, onRetry, onExit }) => {
  // 1. Calculate Score
  let score = 0;
  let total = quiz.questions.length;
  
  // 2. Concept Analysis
  const conceptAnalysis: Record<string, { total: number; correct: number }> = {};

  quiz.questions.forEach(q => {
    const isCorrect = answers[q.id] === q.correctIndex;
    if (isCorrect) score++;

    if (!conceptAnalysis[q.conceptTag]) {
      conceptAnalysis[q.conceptTag] = { total: 0, correct: 0 };
    }
    conceptAnalysis[q.conceptTag].total++;
    if (isCorrect) conceptAnalysis[q.conceptTag].correct++;
  });

  const percentage = Math.round((score / total) * 100);

  // Helper to categorize mastery
  const getMasteryStatus = (correct: number, total: number) => {
    const p = (correct / total) * 100;
    if (p >= 80) return { label: 'Strong', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle };
    if (p >= 50) return { label: 'Normal', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: TrendingUp };
    return { label: 'Weak', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle };
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Score Header */}
      <div className="bg-white rounded-3xl p-8 text-center shadow-lg border border-gray-100 mb-8">
        <div className="inline-block p-4 rounded-full bg-blue-50 mb-4">
           <div className="text-5xl font-black text-blue-600">{percentage}%</div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete!</h2>
        <p className="text-gray-500">You scored {score} out of {total}. See your concept breakdown below.</p>
        
        <div className="flex justify-center gap-4 mt-6">
           <button onClick={onRetry} className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
              <RefreshCcw size={18} /> Retry Quiz
           </button>
           <button onClick={onExit} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors">
              Return to Dashboard
           </button>
        </div>
      </div>

      {/* Concept Breakdown Grid */}
      <h3 className="text-xl font-bold text-gray-800 mb-6 px-2">Concept Mastery Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(conceptAnalysis).map(([tag, data]) => {
              const status = getMasteryStatus(data.correct, data.total);
              const StatusIcon = status.icon;

              return (
                  <div key={tag} className={`p-6 rounded-2xl border-2 flex flex-col items-center text-center transition-transform hover:scale-105 ${status.color}`}>
                      <div className="mb-3 p-3 bg-white rounded-full shadow-sm">
                          <StatusIcon size={24} />
                      </div>
                      <h4 className="font-bold text-lg mb-1">{tag}</h4>
                      <div className="text-sm font-medium opacity-80 mb-4">
                          {data.correct}/{data.total} Correct
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wider bg-white/50 px-2 py-1 rounded">
                          {status.label} Concept
                      </div>
                  </div>
              );
          })}
      </div>

      {/* Recommendations */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <h4 className="font-bold text-blue-800 mb-2">AI Recommendation</h4>
          <p className="text-blue-700 text-sm leading-relaxed">
             Based on your weak areas, we recommend reviewing <strong>{Object.entries(conceptAnalysis).filter(([_, d]) => (d.correct/d.total) < 0.5).map(([t]) => t).join(', ') || "Advanced Topics"}</strong> before moving to the next chapter.
          </p>
      </div>

    </div>
  );
};
