import React from 'react';
import { useStudent } from '../context/StudentContext';
import { CONCEPT_GRAPH, QUIZZES } from '../data/curriculum';
import { CheckCircle, Lock, Play, Star, ChevronRight, Atom, Dna, Zap, AlertOctagon, RotateCw, BookOpen } from 'lucide-react';
import { ConceptNode } from '../types';

interface ConceptMapProps {
  onSelectConcept: (id: string) => void;
  onStartQuiz?: (id: string) => void;
}

export const ConceptMap: React.FC<ConceptMapProps> = ({ onSelectConcept, onStartQuiz }) => {
  const { digitalTwin, getUnlockedConcepts } = useStudent();
  const unlocked = getUnlockedConcepts();

  const getNodeState = (id: string) => {
    const mastery = digitalTwin.masteryMap[id] || 0;
    const isUnlocked = unlocked.some(n => n.id === id);
    
    // Status Logic
    if (!isUnlocked) return 'LOCKED';
    if (mastery >= 0.8) return 'MASTERED';
    if (mastery > 0) return 'IN_PROGRESS';
    return 'NOT_STARTED';
  };

  const categories = [
    { id: 'Chemistry', icon: Atom, color: 'purple', bg: 'bg-purple-50', text: 'text-purple-700', bar: 'bg-purple-500' },
    { id: 'Biology', icon: Dna, color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' },
    { id: 'Physics', icon: Zap, color: 'orange', bg: 'bg-orange-50', text: 'text-orange-700', bar: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-10">
      {categories.map((cat) => {
        const nodes = CONCEPT_GRAPH.filter(n => n.category === cat.id);
        if (nodes.length === 0) return null;

        return (
          <div key={cat.id} className="animate-[fadeIn_0.5s_ease-out]">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${cat.bg} ${cat.text}`}>
                        <cat.icon size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{cat.id}</h2>
                </div>
                <button className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1">
                    View All <ChevronRight size={16} />
                </button>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto pb-8 pt-2 -mx-4 px-4 space-x-6 scrollbar-hide snap-x">
                {nodes.map((node) => {
                    const status = getNodeState(node.id);
                    const mastery = digitalTwin.masteryMap[node.id] || 0;
                    const progressPercent = Math.round(mastery * 100);
                    const hasQuiz = QUIZZES[node.id] !== undefined;
                    
                    return (
                        <div
                            key={node.id}
                            className={`snap-start shrink-0 w-72 flex flex-col relative group transition-all duration-300 rounded-3xl border-2 overflow-hidden bg-white
                                ${status === 'LOCKED' 
                                    ? 'border-slate-100 opacity-60' 
                                    : status === 'IN_PROGRESS'
                                        ? 'border-blue-500 shadow-xl ring-4 ring-blue-500/10 transform -translate-y-1'
                                        : 'border-slate-200 hover:border-green-400 hover:shadow-lg'
                                }
                            `}
                        >
                            {/* Card Image / Banner Area */}
                            <div className={`h-32 w-full relative flex items-center justify-center
                                ${status === 'LOCKED' ? 'bg-slate-200' : `bg-gradient-to-br from-${cat.color}-100 to-white`}
                            `}>
                                <div className={`text-4xl transform transition-transform duration-500 group-hover:scale-110`}>
                                    {status === 'LOCKED' ? '🔒' : node.category === 'Chemistry' ? '⚗️' : node.category === 'Biology' ? '🌿' : '🧲'}
                                </div>
                                
                                {status === 'MASTERED' && (
                                    <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full shadow-sm">
                                        <CheckCircle size={16} />
                                    </div>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                {/* Status Badges */}
                                <div className="flex justify-between items-start mb-2">
                                    {status === 'LOCKED' && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-500">Locked</span>}
                                    {status === 'NOT_STARTED' && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-green-100 text-green-700">To Start</span>}
                                    {status === 'IN_PROGRESS' && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700 animate-pulse">In Progress</span>}
                                    {status === 'MASTERED' && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-700">Completed</span>}

                                    {status !== 'MASTERED' && status !== 'LOCKED' && (
                                        <span className="text-xs font-bold text-yellow-600 flex items-center gap-1">
                                            <Star size={12} fill="currentColor" /> {node.xpValue}
                                        </span>
                                    )}
                                </div>
                                
                                <h3 className={`font-bold text-lg leading-tight mb-2 ${status === 'LOCKED' ? 'text-slate-400' : 'text-slate-900'}`}>
                                    {node.title}
                                </h3>
                                
                                <p className="text-xs text-slate-500 line-clamp-2 mb-4 h-8">
                                    {node.description}
                                </p>

                                {/* Progress Bar */}
                                {status !== 'LOCKED' && (
                                    <div className="mb-4">
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                            <span>Progress</span>
                                            <span>{progressPercent}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-500 ${cat.bar}`} 
                                                style={{ width: `${progressPercent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-auto space-y-2">
                                    {/* Action Button */}
                                    <button
                                        onClick={() => status !== 'LOCKED' && onSelectConcept(node.id)}
                                        disabled={status === 'LOCKED'}
                                        className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm
                                            ${status === 'LOCKED' 
                                                ? 'bg-slate-100 text-slate-400' 
                                                : status === 'NOT_STARTED'
                                                    ? 'bg-slate-900 text-white hover:bg-black'
                                                    : status === 'IN_PROGRESS'
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }
                                        `}
                                    >
                                        {status === 'LOCKED' && <><Lock size={14} /> Locked</>}
                                        {status === 'NOT_STARTED' && <><Play size={14} fill="currentColor" /> Start Learning</>}
                                        {status === 'IN_PROGRESS' && <><RotateCw size={14} /> Resume</>}
                                        {status === 'MASTERED' && <><BookOpen size={14} /> Review</>}
                                    </button>

                                    {/* Test Button (Only if unlocked and quiz exists) */}
                                    {status !== 'LOCKED' && hasQuiz && onStartQuiz && (
                                         <button 
                                            onClick={() => onStartQuiz(node.id)}
                                            className="w-full py-2.5 border-2 border-red-50 text-red-600 hover:bg-red-50 hover:border-red-100 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                                         >
                                            <AlertOctagon size={14} /> {progressPercent === 0 ? 'Diagnostic Test' : 'Take Exam'}
                                         </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
};