import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { ConceptMap } from '../components/ConceptMap';
import { SmartNotesLibrary } from '../components/SmartNotesLibrary';
import { KnowledgeGraphView } from '../components/KnowledgeGraphView';
import { LearningGapRadar } from '../components/LearningGapRadar';
import { PersonalizedTextbook } from '../components/PersonalizedTextbook';
import { GameArcade } from '../components/GameArcade';
import { FlashcardsView } from '../components/FlashcardsView';
import { VirtualLab } from '../components/VirtualLab';
import { VivaExaminer } from '../components/VivaExaminer';
import { SocraticDebate } from '../components/SocraticDebate';
import { YouVsAIQuiz } from '../components/YouVsAIQuiz';
import { Brain, LogOut, Map, StickyNote, Share2, Flame, Star, Zap, BookOpen, Activity, Gauge, Gamepad2, Calendar, X, Sparkles, Loader2, Layers, FlaskConical, Swords, Mic, History, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { generateWeeklyPlan } from '../services/geminiService';
import { Quiz } from '../types';
import { CONCEPT_GRAPH } from '../data/curriculum';

interface DashboardProps {
  onStartSession: (conceptId: string) => void;
  onStartQuiz: (quiz: Quiz) => void; 
  onBack: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartSession, onStartQuiz, onBack }) => {
  const { digitalTwin, getRecommendedConcept, updateDifficulty, markAsStarted, generateAdaptiveQuiz } = useStudent();
  const nextUp = getRecommendedConcept();
  const [activeTab, setActiveTab] = useState<'journey' | 'notes' | 'graph' | 'book' | 'arcade' | 'flashcards' | 'lab' | 'arena'>('journey');
  
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [studyPlan, setStudyPlan] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [arenaMode, setArenaMode] = useState<'MENU' | 'VIVA' | 'DEBATE' | 'QUIZ_BATTLE'>('MENU');

  const getDifficultyLabel = (val: number) => {
    if (val < 33) return { text: 'Foundations', color: 'text-green-600', desc: 'Slower pace, more analogies.' };
    if (val < 66) return { text: 'Standard', color: 'text-blue-600', desc: 'NCERT level curriculum.' };
    return { text: 'Challenger', color: 'text-purple-600', desc: 'Complex problems & deep dives.' };
  };

  const diffInfo = getDifficultyLabel(digitalTwin.difficultyLevel || 50);
  const unresolvedMistakes = (digitalTwin.mistakeLog || []).filter(m => !m.resolved).length;

  const handleGeneratePlan = async () => {
      setShowPlanModal(true);
      if (!studyPlan) {
          setLoadingPlan(true);
          const plan = await generateWeeklyPlan(digitalTwin);
          setStudyPlan(plan);
          setLoadingPlan(false);
      }
  };

  const handleConceptClick = (id: string) => {
      markAsStarted(id); 
      onStartSession(id);
  };

  const handleQuizStart = async (chapterId: string) => {
      setIsGeneratingQuiz(true);
      try {
          const quiz = await generateAdaptiveQuiz(chapterId);
          onStartQuiz(quiz);
      } catch (e) {
          console.error("Quiz generation failed", e);
          alert("Could not generate quiz. Please check connection.");
      }
      setIsGeneratingQuiz(false);
  };

  const showReviewCard = unresolvedMistakes > 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {isGeneratingQuiz && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
              <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
              <h3 className="text-xl font-bold">Constructing Adaptive Quiz...</h3>
              <p className="text-sm text-gray-300 mt-2">Mixing new AI questions with your past mistakes.</p>
          </div>
      )}

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">SA</div>
                <span className="font-bold text-slate-800 tracking-tight">ShikshaAI</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600 bg-slate-100 px-4 py-1.5 rounded-full">
                    <div className="flex items-center gap-1.5 text-orange-600">
                        <Flame size={16} fill="currentColor" />
                        <span>{digitalTwin.streak} Day Streak</span>
                    </div>
                    <div className="w-px h-4 bg-slate-300"></div>
                    <div className="flex items-center gap-1.5 text-yellow-600">
                        <Star size={16} fill="currentColor" />
                        <span>{digitalTwin.xp} XP</span>
                    </div>
                </div>
                <button onClick={onBack} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"><LogOut size={20} /></button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {activeTab === 'journey' && (
            <div className="space-y-6">
                <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 shadow-2xl text-white p-8 md:p-12 animate-[fadeIn_0.5s_ease-out]">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-blue-500/30 border border-blue-400/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 text-blue-100">
                                    <Brain size={14} /> Daily Briefing
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                    Welcome back, <span className="text-blue-200">{digitalTwin.name.split(' ')[0]}</span>! 👋
                                </h1>
                                <p className="text-lg text-blue-100 mt-2 max-w-xl leading-relaxed">
                                    You're on a roll! You are a <span className="font-bold text-yellow-300">{digitalTwin.rank}</span>. Ready to unlock some new powers?
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <button onClick={() => nextUp && handleConceptClick(nextUp.id)} className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 text-lg">
                                    <Zap size={20} fill="currentColor" /> Start Today's Mission
                                </button>
                                <button onClick={handleGeneratePlan} className="px-8 py-4 rounded-2xl font-bold text-white border border-white/30 hover:bg-white/10 transition-all flex items-center gap-2">
                                    <Calendar size={20} /> My Weekly Plan
                                </button>
                            </div>
                        </div>
                        <div className="hidden lg:flex flex-col gap-4">
                            {nextUp && (
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl transform rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105 cursor-pointer" onClick={() => handleConceptClick(nextUp.id)}>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-sm">RECOMMENDED</span>
                                        <span className="text-white font-bold text-sm">{nextUp.xpValue} XP</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">{nextUp.title}</h3>
                                    <p className="text-sm text-blue-100 line-clamp-2 opacity-90">{nextUp.description}</p>
                                    <div className="mt-4 w-full bg-white/20 h-1.5 rounded-full overflow-hidden"><div className="bg-yellow-400 h-full w-[0%]"></div></div>
                                </div>
                            )}
                            <div className="bg-white rounded-2xl p-4 shadow-lg border border-white/50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-gray-800 font-bold text-sm"><Gauge size={16} className="text-blue-600" /> Learning Intensity</div>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 ${diffInfo.color}`}>{diffInfo.text}</span>
                                </div>
                                <input type="range" min="0" max="100" step="1" value={digitalTwin.difficultyLevel || 50} onChange={(e) => updateDifficulty(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700" />
                            </div>
                        </div>
                    </div>
                </section>
                
                {showReviewCard && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between animate-[slideIn_0.3s]">
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600"><History size={24} /></div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">Review Due: {unresolvedMistakes} Mistakes Found</h3>
                                <p className="text-sm text-gray-600">We've tracked concepts you struggled with. Take a custom quiz to fix these gaps.</p>
                            </div>
                        </div>
                        <button onClick={() => { const mistakeConcept = digitalTwin.mistakeLog?.find(m => !m.resolved)?.conceptId; if(mistakeConcept) handleQuizStart(mistakeConcept); }} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap">
                            <AlertTriangle size={16} /> Fix Mistakes Now
                        </button>
                    </div>
                )}
            </div>
        )}

        <div className="flex justify-center overflow-x-auto scrollbar-hide py-2">
            <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 inline-flex gap-1 min-w-max">
                {[ { id: 'journey', label: 'Explore Courses', icon: Map }, { id: 'notes', label: 'My Notebook', icon: StickyNote }, { id: 'lab', label: 'Virtual Lab', icon: FlaskConical }, { id: 'flashcards', label: 'Flashcards', icon: Layers }, { id: 'arena', label: 'Challenge Arena', icon: Swords }, { id: 'graph', label: 'Brain Web', icon: Share2 }, { id: 'book', label: 'My Book', icon: BookOpen }, { id: 'arcade', label: 'Knowledge Arcade', icon: Gamepad2 } ].map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>
        </div>

        <div className="animate-[fadeIn_0.5s_ease-out]">
            {activeTab === 'journey' && (
                <div className="space-y-12">
                     <ConceptMap onSelectConcept={handleConceptClick} onStartQuiz={handleQuizStart} />
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Share2 size={18} className="text-purple-500"/> Knowledge Gaps
                                </h3>
                                <LearningGapRadar />
                            </div>
                            <div className="w-full md:w-48 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Critical Weak Points</h4>
                                {digitalTwin.confusionPoints.length > 0 ? (
                                    <div className="space-y-2">
                                        {digitalTwin.confusionPoints.map(id => (
                                            <div key={id} className="text-xs font-medium text-red-600 bg-red-50 px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer hover:bg-red-100" onClick={() => handleQuizStart(id)}>
                                                {CONCEPT_GRAPH.find(c => c.id === id)?.title.split(':')[0]} <ChevronRight size={12} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <CheckCircle2 size={32} className="text-green-400 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs text-slate-400">All clear! No gaps detected.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-lg text-white flex flex-col justify-center items-center text-center">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 text-3xl">🏆</div>
                            <h3 className="text-2xl font-bold mb-2">Class Leaderboard</h3>
                            <p className="text-slate-400 mb-6 max-w-xs">You are currently ranked #{digitalTwin.rank === 'Lab Assistant' ? '12' : '5'} in your class. Keep going!</p>
                            <button className="px-6 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition">View Full Board</button>
                        </div>
                     </div>
                </div>
            )}
            
            {activeTab === 'notes' && <SmartNotesLibrary />}
            {activeTab === 'lab' && <VirtualLab />}
            {activeTab === 'flashcards' && <FlashcardsView />}
            {activeTab === 'graph' && <KnowledgeGraphView />}
            {activeTab === 'book' && <PersonalizedTextbook />}
            {activeTab === 'arcade' && <div className="w-full flex justify-center py-4"><div className="w-full max-w-2xl h-[600px]"><GameArcade /></div></div>}
            {activeTab === 'arena' && (
                <div className="w-full flex flex-col items-center">
                    {arenaMode === 'MENU' && (
                        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div onClick={() => setArenaMode('VIVA')} className="bg-gradient-to-br from-teal-500 to-emerald-700 rounded-3xl p-8 text-white shadow-xl cursor-pointer hover:scale-[1.02] transition-transform relative overflow-hidden group h-96 flex flex-col justify-between">
                                 <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                                 <Mic size={48} className="mb-4 text-teal-200" />
                                 <div><h3 className="text-2xl font-bold mb-2">AI Viva Examiner</h3><p className="text-teal-100 mb-4 text-sm opacity-90 leading-relaxed">Practice your oral exams. Speak your answers and get instant grading.</p></div>
                                 <button className="bg-white text-teal-700 px-6 py-3 rounded-xl font-bold shadow-md w-full">Start Assessment</button>
                             </div>
                             <div onClick={() => setArenaMode('QUIZ_BATTLE')} className="bg-gradient-to-br from-indigo-500 to-purple-700 rounded-3xl p-8 text-white shadow-xl cursor-pointer hover:scale-[1.02] transition-transform relative overflow-hidden group h-96 flex flex-col justify-between">
                                 <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                                 <Zap size={48} className="mb-4 text-indigo-200" />
                                 <div><h3 className="text-2xl font-bold mb-2">You vs AI Battle</h3><p className="text-indigo-100 mb-4 text-sm opacity-90 leading-relaxed">Race against the AI in a high-speed quiz.</p></div>
                                 <button className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold shadow-md w-full">Challenge AI</button>
                             </div>
                             <div onClick={() => setArenaMode('DEBATE')} className="bg-gradient-to-br from-red-500 to-pink-700 rounded-3xl p-8 text-white shadow-xl cursor-pointer hover:scale-[1.02] transition-transform relative overflow-hidden group h-96 flex flex-col justify-between">
                                 <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                                 <Swords size={48} className="mb-4 text-pink-200" />
                                 <div><h3 className="text-2xl font-bold mb-2">Debate Arena</h3><p className="text-pink-100 mb-4 text-sm opacity-90 leading-relaxed">Challenge the AI on controversial scientific topics.</p></div>
                                 <button className="bg-white text-pink-700 px-6 py-3 rounded-xl font-bold shadow-md w-full">Enter Arena</button>
                             </div>
                        </div>
                    )}
                    {arenaMode === 'VIVA' && <VivaExaminer onBack={() => setArenaMode('MENU')} />}
                    {arenaMode === 'DEBATE' && <SocraticDebate onBack={() => setArenaMode('MENU')} />}
                    {arenaMode === 'QUIZ_BATTLE' && <YouVsAIQuiz onBack={() => setArenaMode('MENU')} />}
                </div>
            )}
        </div>
      </main>
      {showPlanModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
              <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl relative">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-3xl text-white">
                      <div><h3 className="font-bold text-xl flex items-center gap-2"><Calendar size={20} /> My Power Week Plan</h3><p className="text-xs text-blue-100 opacity-80">Personalized based on your {digitalTwin.learningStyle} style</p></div>
                      <button onClick={() => setShowPlanModal(false)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"><X size={20} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                      {loadingPlan ? <div className="flex flex-col items-center justify-center h-64 text-gray-500"><Loader2 size={40} className="animate-spin text-blue-500 mb-4" /><p className="font-medium">Analyzing your confusion points...</p></div> : studyPlan ? <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">{studyPlan}</div> : <div className="text-center py-10"><p>Failed to load plan.</p></div>}
                  </div>
                  <div className="p-6 border-t border-gray-100 flex justify-end">
                      <button onClick={() => { setStudyPlan(null); handleGeneratePlan(); }} className="flex items-center gap-2 px-4 py-2 text-blue-600 font-bold hover:bg-blue-50 rounded-lg transition-colors mr-2"><Sparkles size={16} /> Regenerate</button>
                      <button onClick={() => setShowPlanModal(false)} className="px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 shadow-md">Got it!</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};