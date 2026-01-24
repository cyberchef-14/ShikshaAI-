import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { CONCEPT_GRAPH } from '../data/curriculum';
import { ArrowLeft, ArrowRight, RotateCw, Filter, Layers, Brain, Zap, Atom, Dna, HelpCircle } from 'lucide-react';

export const FlashcardsView: React.FC = () => {
  const { digitalTwin } = useStudent();
  const [filterSubject, setFilterSubject] = useState<'All' | 'Chemistry' | 'Physics' | 'Biology'>('All');
  const [showOnlyWeak, setShowOnlyWeak] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Filter logic
  const filteredCards = CONCEPT_GRAPH.filter(node => {
    if (filterSubject !== 'All' && node.category !== filterSubject) return false;
    if (showOnlyWeak) {
        const score = digitalTwin.masteryMap[node.id] || 0;
        return score < 0.8;
    }
    return true;
  });

  // Reset index when filters change
  useEffect(() => {
      setCurrentIndex(0);
      setIsFlipped(false);
  }, [filterSubject, showOnlyWeak]);

  const currentCard = filteredCards[currentIndex];

  const handleNext = () => {
      if (currentIndex < filteredCards.length - 1) {
          setIsFlipped(false);
          // Wait for flip back animation if needed, or just switch
          setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
      }
  };

  const handlePrev = () => {
      if (currentIndex > 0) {
          setIsFlipped(false);
          setTimeout(() => setCurrentIndex(prev => prev - 1), 200);
      }
  };

  const getCategoryColor = (cat: string) => {
      if (cat === 'Chemistry') return 'bg-purple-100 text-purple-700 border-purple-200';
      if (cat === 'Physics') return 'bg-orange-100 text-orange-700 border-orange-200';
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };
    
   const getCategoryIcon = (cat: string) => {
    if (cat === 'Chemistry') return <Atom size={20} />;
    if (cat === 'Physics') return <Zap size={20} />;
    return <Dna size={20} />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-[fadeIn_0.5s_ease-out]">
        {/* Controls Header */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Layers size={20} />
                </div>
                <div>
                    <h2 className="font-bold text-gray-800">Active Recall Deck</h2>
                    <p className="text-xs text-gray-500">{filteredCards.length} cards in stack</p>
                </div>
             </div>

             <div className="flex items-center gap-3">
                 <select 
                    value={filterSubject} 
                    onChange={(e) => setFilterSubject(e.target.value as any)}
                    className="p-2 rounded-lg border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                 >
                     <option value="All">All Subjects</option>
                     <option value="Chemistry">Chemistry</option>
                     <option value="Physics">Physics</option>
                     <option value="Biology">Biology</option>
                 </select>

                 <button 
                    onClick={() => setShowOnlyWeak(!showOnlyWeak)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold border transition-colors
                        ${showOnlyWeak 
                            ? 'bg-red-50 border-red-200 text-red-600' 
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                 >
                    <Brain size={16} />
                    {showOnlyWeak ? 'Review Mode' : 'All Cards'}
                 </button>
             </div>
        </div>

        {/* Card Area */}
        {filteredCards.length > 0 ? (
            <div className="[perspective:1000px] h-[400px] w-full relative group">
                <div 
                    className={`w-full h-full transition-all duration-500 [transform-style:preserve-3d] cursor-pointer relative ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    {/* FRONT: QUESTION */}
                    <div className="absolute inset-0 [backface-visibility:hidden] bg-white rounded-3xl shadow-xl border-2 border-gray-100 flex flex-col items-center justify-center p-8 hover:border-blue-300 transition-colors">
                        <div className={`absolute top-6 left-6 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${getCategoryColor(currentCard.category)}`}>
                             {getCategoryIcon(currentCard.category)} {currentCard.category}
                        </div>
                        <div className="text-center">
                            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-500">
                                <HelpCircle size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
                                {currentCard.flashcard ? currentCard.flashcard.front : "Question not available"}
                            </h3>
                            <p className="text-gray-400 text-sm font-medium flex items-center justify-center gap-2 mt-4">
                                <RotateCw size={16} /> Tap to see Answer
                            </p>
                        </div>
                    </div>

                    {/* BACK: ANSWER */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl border-2 border-slate-700 flex flex-col items-center justify-center p-10 text-white">
                         <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider border border-white/20">
                             Answer
                        </div>
                        <div className="text-center w-full">
                            <p className="text-xl md:text-2xl font-medium leading-relaxed whitespace-pre-line">
                                {currentCard.flashcard ? currentCard.flashcard.back : "Answer not available"}
                            </p>
                        </div>
                        <div className="absolute bottom-6 w-full text-center opacity-50 text-xs uppercase tracking-widest font-bold">
                            {currentCard.xpValue} XP Mastery Value
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="h-[400px] bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                <Filter size={48} className="mb-4 opacity-50" />
                <p className="font-medium">No cards match your filters.</p>
                <button onClick={() => {setFilterSubject('All'); setShowOnlyWeak(false)}} className="mt-4 text-blue-600 font-bold hover:underline">Reset Filters</button>
            </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-center items-center gap-8">
            <button 
                onClick={handlePrev} 
                disabled={currentIndex === 0 || filteredCards.length === 0}
                className="p-4 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
                <ArrowLeft size={24} className="text-gray-700" />
            </button>
            
            <div className="text-gray-400 font-mono font-bold">
                {filteredCards.length > 0 ? `${currentIndex + 1} / ${filteredCards.length}` : '0 / 0'}
            </div>

            <button 
                onClick={handleNext} 
                disabled={currentIndex === filteredCards.length - 1 || filteredCards.length === 0}
                className="p-4 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
                <ArrowRight size={24} className="text-gray-700" />
            </button>
        </div>
    </div>
  );
};
