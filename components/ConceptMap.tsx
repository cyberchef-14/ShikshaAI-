import React from 'react';
import { useStudent } from '../context/StudentContext';
import { CONCEPT_GRAPH, QUIZZES } from '../data/curriculum';
import { CheckCircle, Lock, Play, Star, ChevronRight, Atom, Dna, Zap, AlertOctagon } from 'lucide-react';
import { ConceptNode } from '../types';

interface ConceptMapProps {
  onSelectConcept: (id: string) => void;
  onStartQuiz?: (id: string) => void; // Optional for now
}

export const ConceptMap: React.FC<ConceptMapProps> = ({ onSelectConcept, onStartQuiz }) => {
  const { digitalTwin, getUnlockedConcepts } = useStudent();
  const unlocked = getUnlockedConcepts();

  const getNodeStatus = (id: string) => {
    const mastery = digitalTwin.masteryMap[id] || 0;
    const isUnlocked = unlocked.some(n => n.id === id);
    if (mastery >= 0.8) return 'mastered';
    if (isUnlocked) return 'active';
    return 'locked';
  };

  const categories = [
    { id: 'Chemistry', icon: Atom, color: 'purple', bg: 'bg-purple-50', text: 'text-purple-700' },
    { id: 'Biology', icon: Dna, color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    { id: 'Physics', icon: Zap, color: 'orange', bg: 'bg-orange-50', text: 'text-orange-700' }
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
            <div className="flex overflow-x-auto pb-6 -mx-4 px-4 space-x-6 scrollbar-hide snap-x">
                {nodes.map((node) => {
                    const status = getNodeStatus(node.id);
                    const hasQuiz = QUIZZES[node.id] !== undefined;
                    
                    return (
                        <div
                            key={node.id}
                            className={`snap-start shrink-0 w-72 flex flex-col relative group transition-all duration-300 rounded-3xl border-2 overflow-hidden bg-white
                                ${status === 'locked' 
                                    ? 'border-slate-100 opacity-60' 
                                    : status === 'active'
                                        ? 'border-blue-500 shadow-xl ring-4 ring-blue-500/10 transform hover:-translate-y-1'
                                        : 'border-slate-200 hover:border-green-400 hover:shadow-lg'
                                }
                            `}
                        >
                            {/* Card Image / Banner Area */}
                            <div className={`h-32 w-full relative flex items-center justify-center
                                ${status === 'locked' ? 'bg-slate-200' : `bg-gradient-to-br from-${cat.color}-100 to-white`}
                            `}>
                                <div className={`text-4xl transform transition-transform duration-500 group-hover:scale-110`}>
                                    {status === 'locked' ? '🔒' : node.category === 'Chemistry' ? '⚗️' : node.category === 'Biology' ? '🌿' : '🧲'}
                                </div>
                                
                                {status === 'mastered' && (
                                    <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full shadow-sm">
                                        <CheckCircle size={16} />
                                    </div>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded
                                        ${status === 'locked' ? 'bg-slate-200 text-slate-500' : cat.bg + ' ' + cat.text}
                                    `}>
                                        {status === 'locked' ? 'LOCKED' : status === 'active' ? 'IN PROGRESS' : 'COMPLETED'}
                                    </span>
                                    {status !== 'mastered' && status !== 'locked' && (
                                        <span className="text-xs font-bold text-yellow-600 flex items-center gap-1">
                                            <Star size={12} fill="currentColor" /> {node.xpValue}
                                        </span>
                                    )}
                                </div>
                                
                                <h3 className={`font-bold text-lg leading-tight mb-2 ${status === 'locked' ? 'text-slate-400' : 'text-slate-900'}`}>
                                    {node.title}
                                </h3>
                                
                                <p className="text-xs text-slate-500 line-clamp-2 mb-4 h-8">
                                    {node.description}
                                </p>

                                <div className="mt-auto space-y-2">
                                    {/* Action Button */}
                                    <button
                                        onClick={() => status !== 'locked' && onSelectConcept(node.id)}
                                        disabled={status === 'locked'}
                                        className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors
                                            ${status === 'locked' 
                                                ? 'bg-slate-100 text-slate-400' 
                                                : status === 'active'
                                                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-green-100 hover:text-green-700'
                                            }
                                        `}
                                    >
                                        {status === 'locked' ? (
                                            <> <Lock size={14} /> Locked </>
                                        ) : status === 'active' ? (
                                            <> <Play size={14} fill="currentColor" /> Resume </>
                                        ) : (
                                            <> <CheckCircle size={14} /> Review </>
                                        )}
                                    </button>

                                    {/* Test Button (Only if unlocked and quiz exists) */}
                                    {status !== 'locked' && hasQuiz && onStartQuiz && (
                                         <button 
                                            onClick={() => onStartQuiz(node.id)}
                                            className="w-full py-2.5 border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                                         >
                                            <AlertOctagon size={14} /> Take Exam
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