import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { CONCEPT_GRAPH } from '../data/curriculum';
import { Lock, StickyNote, Atom, Dna, Zap, Bookmark, Sparkles, MessageCircle, Clock, X, Volume2, Share2, Sigma } from 'lucide-react';
import { ConceptNode } from '../types';

const FORMULAS = [
  {
    id: 'f1',
    title: "Ohm's Law",
    category: 'Physics',
    expression: "V = I × R",
    terms: [
      { symbol: "V", definition: "Potential Difference (Volts)" },
      { symbol: "I", definition: "Current (Amperes)" },
      { symbol: "R", definition: "Resistance (Ohms)" }
    ]
  },
  {
    id: 'f2',
    title: "Mirror Formula",
    category: 'Physics',
    expression: "1/v + 1/u = 1/f",
    terms: [
      { symbol: "v", definition: "Image Distance" },
      { symbol: "u", definition: "Object Distance" },
      { symbol: "f", definition: "Focal Length" }
    ]
  },
  {
    id: 'f3',
    title: "Electric Power",
    category: 'Physics',
    expression: "P = V × I",
    terms: [
      { symbol: "P", definition: "Electric Power (Watts)" },
      { symbol: "V", definition: "Voltage (Volts)" },
      { symbol: "I", definition: "Current (Amperes)" }
    ]
  },
  {
    id: 'f4',
    title: "Lens Power",
    category: 'Physics',
    expression: "P = 1 / f",
    terms: [
      { symbol: "P", definition: "Power (Dioptre)" },
      { symbol: "f", definition: "Focal Length (Meters)" }
    ]
  },
  {
    id: 'f5',
    title: "Snell's Law",
    category: 'Physics',
    expression: "n₁ sin i = n₂ sin r",
    terms: [
      { symbol: "n₁", definition: "Refractive Index (Medium 1)" },
      { symbol: "n₂", definition: "Refractive Index (Medium 2)" },
      { symbol: "i", definition: "Angle of Incidence" },
      { symbol: "r", definition: "Angle of Refraction" }
    ]
  },
  {
    id: 'f6',
    title: "Resistors in Series",
    category: 'Physics',
    expression: "R = R₁ + R₂ + ...",
    terms: [
      { symbol: "R", definition: "Equivalent Resistance" },
      { symbol: "R₁, R₂", definition: "Individual Resistors" }
    ]
  }
];

export const SmartNotesLibrary: React.FC = () => {
  const { digitalTwin, getUnlockedConcepts } = useStudent();
  const [filter, setFilter] = useState<'All' | 'Chemistry' | 'Physics' | 'Biology' | 'Formulas' | 'Notebook'>('All');
  const [selectedNote, setSelectedNote] = useState<ConceptNode | null>(null);
  
  const unlockedIds = new Set(getUnlockedConcepts().map(n => n.id));

  // If filter is 'Notebook' or 'Formulas', we don't use filteredNodes logic for cards
  const filteredNodes = CONCEPT_GRAPH.filter(node => {
     if (filter === 'Notebook' || filter === 'Formulas') return false; 
     if (filter !== 'All' && node.category !== filter) return false;
     return true;
  });

  const getSubjectIcon = (cat: string) => {
    if (cat === 'Chemistry') return <Atom size={16} />;
    if (cat === 'Physics') return <Zap size={16} />;
    return <Dna size={16} />;
  };

  const getCardStyle = (cat: string) => {
    if (cat === 'Chemistry') return 'bg-purple-50 text-purple-700 border-purple-200';
    if (cat === 'Physics') return 'bg-orange-50 text-orange-700 border-orange-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full animate-[fadeIn_0.5s_ease-out] pb-20">
        
        {/* Header Section */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <StickyNote className="text-yellow-500" /> My Smart Notes Library
                </h2>
                <p className="text-gray-500 text-sm">Review your unlocked concept cards, formulas, and saved queries here.</p>
            </div>
            
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
                {['All', 'Chemistry', 'Physics', 'Biology', 'Formulas', 'Notebook'].map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2
                            ${filter === f 
                                ? 'bg-gray-900 text-white shadow-lg transform scale-105' 
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                        {f === 'Notebook' && <MessageCircle size={14} />}
                        {f === 'Formulas' && <Sigma size={14} />}
                        {f === 'Notebook' ? 'My Q&A' : f}
                    </button>
                ))}
            </div>
        </div>

        {/* View Switcher */}
        {filter === 'Notebook' ? (
            /* Notebook (Q&A) View */
            <div className="space-y-4">
                {digitalTwin.queryNotebook.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <MessageCircle size={40} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-500">No Queries Saved Yet</h3>
                        <p className="text-gray-400 text-sm">Ask the AI Teacher a question during a lesson to save it here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {digitalTwin.queryNotebook.map((entry) => (
                            <div key={entry.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                        Q&A
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <Clock size={12} />
                                        {new Date(entry.timestamp).toLocaleDateString()}
                                    </div>
                                </div>
                                <h4 className="font-bold text-gray-900 mb-2">{entry.question}</h4>
                                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed border border-gray-200">
                                    {entry.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ) : filter === 'Formulas' ? (
            /* Formulas View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FORMULAS.map(formula => (
                    <div key={formula.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                        <div className="bg-slate-50 p-4 border-b border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-slate-700 flex items-center gap-2">
                                <Sigma size={16} className="text-slate-400"/> {formula.title}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${formula.category === 'Physics' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                                {formula.category}
                            </span>
                        </div>
                        <div className="p-8 text-center border-b border-gray-100 bg-white group-hover:bg-blue-50/50 transition-colors">
                            <div className="text-2xl font-serif font-bold text-slate-800 tracking-wider">
                                {formula.expression}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50/30">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Term Definitions</h4>
                            <div className="space-y-2">
                                {formula.terms.map((term, i) => (
                                    <div key={i} className="flex items-center text-sm border-b border-dashed border-gray-200 last:border-0 pb-1 last:pb-0">
                                        <span className="w-8 font-bold text-slate-700 font-serif italic text-lg">{term.symbol}</span>
                                        <span className="text-gray-300 mx-2">=</span>
                                        <span className="text-gray-600 font-medium text-xs">{term.definition}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            /* Standard Grid Layout for Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNodes.map(node => {
                    const isUnlocked = unlockedIds.has(node.id);
                    const mastered = (digitalTwin.masteryMap[node.id] || 0) >= 0.8;

                    return (
                        <div key={node.id} className="relative group">
                            {/* The Card Container */}
                            <div className={`h-full rounded-2xl border-2 p-1 transition-all duration-300 flex flex-col 
                                ${isUnlocked 
                                    ? 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1' 
                                    : 'bg-gray-50 border-gray-100 opacity-60 grayscale'}`}>
                                
                                <div className="bg-white p-5 rounded-xl h-full flex flex-col relative overflow-hidden">
                                    {/* Decorative Background for unlocked cards */}
                                    {isUnlocked && (
                                        <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 ${
                                            node.category === 'Chemistry' ? 'bg-purple-500' :
                                            node.category === 'Physics' ? 'bg-orange-500' : 'bg-emerald-500'
                                        }`}></div>
                                    )}

                                    {/* Card Header */}
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getCardStyle(node.category)}`}>
                                            {getSubjectIcon(node.category)}
                                            {node.category}
                                        </div>
                                        {mastered ? (
                                            <div className="text-green-500 bg-green-50 p-1.5 rounded-full" title="Mastered">
                                                <Bookmark size={16} fill="currentColor" />
                                            </div>
                                        ) : isUnlocked ? (
                                            <div className="text-blue-400 bg-blue-50 p-1.5 rounded-full">
                                                <Sparkles size={16} />
                                            </div>
                                        ) : (
                                            <Lock size={18} className="text-gray-400" />
                                        )}
                                    </div>

                                    <h3 className="font-bold text-lg text-gray-900 mb-3 leading-tight min-h-[3rem]">
                                        {node.title}
                                    </h3>
                                    
                                    {/* Micro Note Section (The "Meat" of the card) */}
                                    <div className="flex-1">
                                        {isUnlocked ? (
                                            <div 
                                                onClick={() => setSelectedNote(node)}
                                                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 relative mt-2 group-hover:bg-yellow-100 transition-colors cursor-pointer"
                                            >
                                                <div className="absolute -top-2.5 -right-2 text-yellow-600 bg-white rounded-full p-1 border border-yellow-100 shadow-sm z-10">
                                                    <StickyNote size={12} fill="currentColor" />
                                                </div>
                                                {/* Tape Effect */}
                                                <div className="absolute -top-3 left-1/2 -ml-4 w-8 h-3 bg-yellow-200/50 rotate-2"></div>
                                                
                                                <p className="font-serif text-sm text-gray-800 leading-relaxed italic line-clamp-3">
                                                    "{node.microNote}"
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="h-28 flex flex-col items-center justify-center bg-gray-100 rounded-xl mt-2 border border-dashed border-gray-300">
                                                <Lock size={20} className="text-gray-300 mb-2" />
                                                <span className="text-xs text-gray-400 font-medium text-center px-4">
                                                    Complete this level to reveal the secret note.
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Footer Stats */}
                                    <div className="mt-5 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 font-medium">
                                        <span>XP Value: {node.xpValue}</span>
                                        {isUnlocked && (
                                            <button 
                                                onClick={() => setSelectedNote(node)}
                                                className="text-blue-600 font-bold hover:text-blue-800 hover:underline"
                                            >
                                                Read Note
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )}

        {/* Note Viewer Modal */}
        {selectedNote && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
                <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden transform scale-100 transition-all">
                    
                    {/* Header */}
                    <div className={`p-6 ${getCardStyle(selectedNote.category)} border-b-0`}>
                        <div className="flex justify-between items-start">
                             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                {getSubjectIcon(selectedNote.category)} {selectedNote.category}
                             </div>
                             <button onClick={() => setSelectedNote(null)} className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors">
                                 <X size={18} />
                             </button>
                        </div>
                        <h2 className="text-2xl font-bold mt-4 text-gray-900">{selectedNote.title}</h2>
                        <p className="text-sm opacity-80 mt-1">{selectedNote.description}</p>
                    </div>

                    {/* Note Content */}
                    <div className="p-8 bg-yellow-50 relative min-h-[200px] flex flex-col justify-center">
                        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/5 to-transparent"></div>
                        
                        <div className="font-serif text-xl text-gray-800 leading-loose italic text-center">
                            "{selectedNote.microNote}"
                        </div>
                        
                        <div className="mt-8 flex justify-center gap-4">
                            <button 
                                onClick={() => handleSpeak(selectedNote.microNote)}
                                className="flex items-center gap-2 px-4 py-2 bg-yellow-200 hover:bg-yellow-300 text-yellow-900 rounded-full font-bold text-sm transition-colors"
                            >
                                <Volume2 size={16} /> Listen
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-full font-bold text-sm transition-colors">
                                <Share2 size={16} /> Share
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-white border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                        <span>ShikshaAI Smart Note</span>
                        <span>XP: {selectedNote.xpValue}</span>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
