import React, { useState, useEffect, useRef } from 'react';
import { useStudent } from '../context/StudentContext';
import { LESSON_CONTENT, CONCEPT_GRAPH } from '../data/curriculum';
import { Avatar } from '../components/Avatar';
import { Language } from '../types';
import { ArrowLeft, Play, Zap, Trophy, Volume2, VolumeX, Gem, StickyNote, MessageCircle, Send, X, Lightbulb, Loader2, Brain, Baby, GraduationCap, School, Sparkles } from 'lucide-react';
import { getAIResponse, analyzeMistake, rewriteContent } from '../services/geminiService';

interface LearningSessionProps {
  conceptId: string;
  onExit: () => void;
}

export const LearningSession: React.FC<LearningSessionProps> = ({ conceptId, onExit }) => {
  const { digitalTwin, updateMastery, addXP, switchLanguage, saveQuery } = useStudent();
  const segments = LESSON_CONTENT[conceptId] || [];
  const conceptNode = CONCEPT_GRAPH.find(n => n.id === conceptId);
  
  const [segIndex, setSegIndex] = useState(0);
  const [avatarState, setAvatarState] = useState<'idle' | 'speaking' | 'thinking' | 'concerned' | 'happy'>('idle');
  const [displayedText, setDisplayedText] = useState("");
  const [originalText, setOriginalText] = useState(""); // Keep track of original for reverting
  const [isTyping, setIsTyping] = useState(false);
  const [interactionComplete, setInteractionComplete] = useState(false);
  const [showSurpriseOverlay, setShowSurpriseOverlay] = useState(false);
  const [missionStarted, setMissionStarted] = useState(false); 
  
  // Complexity Slider State
  const [complexity, setComplexity] = useState<'5-year-old' | 'Standard' | 'Professor'>('Standard');
  const [isRewriting, setIsRewriting] = useState(false);

  // Audio & Chat State
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatQuery, setChatQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Mistake Analysis State
  const [lastWrongAnswer, setLastWrongAnswer] = useState<string | null>(null);
  const [mistakeExplanation, setMistakeExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  
  const isHindi = digitalTwin.currentLanguage === Language.HINDI;
  const currentSeg = segments[segIndex];
  const typingTimeoutRef = useRef<any>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Helper: Stop Speaking
  const stopSpeaking = () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
  };

  // Helper: Speak Text
  const speakText = (text: string) => {
    if (isMuted || !window.speechSynthesis) return;
    
    // Cancel previous speech to avoid queue buildup
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Attempt to set voice based on language (browsers vary wildly here)
    // For Hindi/Hinglish, we try to find a Hindi voice, else fallback
    if (isHindi) {
        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(v => v.lang.includes('hi'));
        if (hindiVoice) utterance.voice = hindiVoice;
        utterance.lang = 'hi-IN';
        utterance.rate = 0.9; // Slightly slower for clarity
    } else {
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
    }
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Ensure voices are loaded (Chrome requirement)
  useEffect(() => {
      window.speechSynthesis.getVoices();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
      return () => {
          stopSpeaking();
          clearTimeout(typingTimeoutRef.current);
      };
  }, []);

  // TYPING & SPEAKING LOGIC
  useEffect(() => {
    if (!currentSeg || !missionStarted) return; 

    // Reset interaction states for new segment
    setLastWrongAnswer(null);
    setMistakeExplanation(null);
    setIsExplaining(false);
    setComplexity('Standard'); // Reset complexity on new slide

    const fullText = isHindi ? currentSeg.contentHi : currentSeg.contentEn;
    setOriginalText(fullText); // Save original
    setDisplayedText("");
    setIsTyping(true);
    setInteractionComplete(false);
    setShowSurpriseOverlay(false);
    stopSpeaking(); // Stop previous

    if (currentSeg.type === 'explanation') {
      setAvatarState('speaking');
      // Delay speech slightly to match visual start
      setTimeout(() => speakText(fullText), 100);
    } else {
      setAvatarState('thinking'); 
      setTimeout(() => setShowSurpriseOverlay(true), 500);
      setTimeout(() => speakText(fullText), 100);
    }

    let i = 0;
    const typeChar = () => {
      if (i < fullText.length) {
        setDisplayedText(fullText.substring(0, i + 1));
        i++;
        typingTimeoutRef.current = setTimeout(typeChar, 25);
      } else {
        setIsTyping(false);
        setAvatarState('idle');
        if (currentSeg.type === 'explanation') {
           setInteractionComplete(true);
        }
      }
    };
    typeChar();

    return () => clearTimeout(typingTimeoutRef.current);
  }, [segIndex, isHindi, currentSeg, missionStarted]); // removed isMuted to prevent re-type on mute toggle

  // Handle Complexity Change
  const handleComplexityChange = async (newLevel: '5-year-old' | 'Standard' | 'Professor') => {
      setComplexity(newLevel);
      if (newLevel === 'Standard') {
          setDisplayedText(originalText);
          stopSpeaking();
          if (!isMuted) speakText(originalText);
          return;
      }

      setIsRewriting(true);
      stopSpeaking();
      const rewritten = await rewriteContent(originalText, newLevel, isHindi ? 'hi' : 'en');
      setDisplayedText(rewritten);
      setIsRewriting(false);
      if (!isMuted) speakText(rewritten);
  };

  const handleNext = () => {
    stopSpeaking();
    if (segIndex < segments.length - 1) {
      setSegIndex(prev => prev + 1);
    } else {
      updateMastery(conceptId, 0.2); 
      addXP(50); 
      onExit();
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (!currentSeg.correctIndex && currentSeg.correctIndex !== 0) return;
    stopSpeaking();

    if (idx === currentSeg.correctIndex) {
      setAvatarState('happy');
      const msg = isHindi ? "Sahi Jawab! (+20 XP)" : "Correct Answer! (+20 XP)";
      setDisplayedText(msg);
      speakText(msg);
      addXP(20);
      setInteractionComplete(true);
      setShowSurpriseOverlay(false);
      setLastWrongAnswer(null); 
      setMistakeExplanation(null);
    } else {
      setAvatarState('concerned');
      const msg = isHindi ? "Oops! Dhyan se suno..." : "Oops! Pay attention...";
      setDisplayedText(msg);
      speakText(msg);
      if (currentSeg.options) {
          setLastWrongAnswer(currentSeg.options[idx]);
      }
      setMistakeExplanation(null);
    }
  };

  const handleExplainMistake = async () => {
    if (!currentSeg || !lastWrongAnswer) return;
    
    setIsExplaining(true);
    try {
        const explanation = await analyzeMistake(
            currentSeg.question || "Question",
            lastWrongAnswer,
            currentSeg.options ? currentSeg.options[currentSeg.correctIndex || 0] : "",
            conceptNode?.title || "Concept",
            isHindi ? 'hi' : 'en'
        );
        setMistakeExplanation(explanation);
    } catch (e) {
        console.error(e);
        setMistakeExplanation("Could not load explanation. Please try again.");
    }
    setIsExplaining(false);
  };

  // Chat Handlers
  const handleAskAI = async () => {
      if (!chatQuery.trim()) return;
      
      const userQ = chatQuery;
      setChatQuery("");
      setChatHistory(prev => [...prev, { role: 'user', text: userQ }]);
      setIsChatLoading(true);
      stopSpeaking(); // Pause lesson audio

      // Context for AI
      const context = isHindi ? currentSeg?.contentHi : currentSeg?.contentEn;
      
      const response = await getAIResponse(userQ, context || "", isHindi ? 'hi' : 'en');
      
      setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
      setIsChatLoading(false);

      // Save to Notebook automatically
      saveQuery(userQ, response, conceptId);
  };

  // MISSION BRIEFING SCREEN
  if (!missionStarted && conceptNode) {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             
             <div className="max-w-md w-full bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all animate-[fadeIn_0.5s_ease-out] relative z-10">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center relative">
                    <div className="text-white text-center">
                        <div className="bg-white/20 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2">New Mission</div>
                        <h1 className="text-2xl font-bold px-4">{conceptNode.title}</h1>
                    </div>
                </div>
                
                <div className="p-8 pt-10 relative">
                     {/* Floating Badge */}
                    <div className="absolute -top-8 left-1/2 -ml-8 w-16 h-16 bg-yellow-400 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                        <Gem size={28} className="text-white" />
                    </div>

                    <div className="text-center space-y-6">
                        <div>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Mission Reward</p>
                            <p className="text-3xl font-black text-gray-800">{conceptNode.xpValue} XP</p>
                        </div>

                        {/* The Concept Micro Note Card */}
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-left relative transform rotate-1 hover:rotate-0 transition-transform duration-300">
                             <div className="flex items-center gap-2 mb-2 text-yellow-700 font-bold text-sm border-b border-yellow-200 pb-1">
                                <StickyNote size={14} /> Mission Intel (Micro-Note)
                             </div>
                             <p className="text-gray-800 text-sm font-medium leading-relaxed">
                                {conceptNode.microNote}
                            </p>
                        </div>

                        <button 
                            onClick={() => setMissionStarted(true)}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            <Play size={20} fill="currentColor" /> Start Learning
                        </button>
                        
                        <button onClick={onExit} className="text-gray-400 text-sm hover:text-gray-600">Cancel Mission</button>
                    </div>
                </div>
             </div>
        </div>
    );
  }

  if (!currentSeg) return <div className="p-10 text-white">Loading Lesson...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative overflow-hidden font-sans">
      
      {/* GAMIFIED HEADER */}
      <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700 z-10">
        <button onClick={onExit} className="p-2 hover:bg-gray-700 rounded-full"><ArrowLeft /></button>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-yellow-400">
                <Trophy size={18} />
                <span className="font-bold">{digitalTwin.xp} XP</span>
            </div>
            <div className="flex items-center gap-1 text-blue-400">
                <Zap size={18} />
                <span className="font-bold">{digitalTwin.streak} Streak</span>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={() => {
                    const nextMute = !isMuted;
                    setIsMuted(nextMute);
                    if(nextMute) stopSpeaking();
                    else speakText(displayedText);
                }}
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                title={isMuted ? "Unmute Teacher" : "Mute Teacher"}
            >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-green-400" />}
            </button>
            <button onClick={() => switchLanguage(isHindi ? Language.ENGLISH : Language.HINDI)} className="text-sm border border-gray-500 px-3 py-1 rounded-full hover:bg-gray-700 transition-colors">
                {isHindi ? 'Switch to English' : 'Hinglish Mode'}
            </button>
        </div>
      </div>

      {/* MAIN STAGE */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        
        {/* Background Particles/Lab Effect */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>

        {/* 3D AVATAR CENTER STAGE */}
        <div className="transform scale-125 mb-8 z-0">
            <Avatar state={avatarState} />
        </div>

        {/* DIALOGUE BOX / MICRO CARD */}
        <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl z-10 min-h-[250px] flex flex-col justify-between">
            
            {/* Context Label & COMPLEXITY SLIDER */}
            <div className="flex justify-between items-start mb-4">
                <div className="opacity-70 text-xs uppercase tracking-widest">
                    <span className={`px-2 py-1 rounded mr-2 ${currentSeg.type === 'explanation' ? 'bg-blue-500/20 text-blue-200' : 'bg-yellow-500/20 text-yellow-200'}`}>
                        {currentSeg.type === 'explanation' ? 'Chapter Story' : 'Concept Check'}
                    </span>
                    <span>{segIndex + 1} / {segments.length}</span>
                </div>

                {/* FEATURE: Adaptive Complexity Slider */}
                {currentSeg.type === 'explanation' && (
                    <div className="flex items-center bg-gray-800/50 rounded-full p-1 border border-white/10">
                        <button 
                            onClick={() => handleComplexityChange('5-year-old')}
                            className={`p-2 rounded-full transition-all ${complexity === '5-year-old' ? 'bg-pink-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            title="Explain like I'm 5"
                        >
                            <Baby size={16} />
                        </button>
                        <button 
                            onClick={() => handleComplexityChange('Standard')}
                            className={`p-2 rounded-full transition-all ${complexity === 'Standard' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            title="Standard Level"
                        >
                            <School size={16} />
                        </button>
                        <button 
                            onClick={() => handleComplexityChange('Professor')}
                            className={`p-2 rounded-full transition-all ${complexity === 'Professor' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            title="Deep Dive / Academic"
                        >
                            <GraduationCap size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Main Text Content */}
            <div className="text-xl md:text-2xl leading-relaxed font-medium mb-8 text-shadow-sm">
                {currentSeg.type === 'surprise_question' && showSurpriseOverlay ? (
                    <div className="text-yellow-300 font-bold text-3xl animate-bounce mb-4 text-center">⚡ QUICK CHECK!</div>
                ) : null}
                
                {/* Visual Asset (Emoji/Icon) */}
                <div className="text-5xl mb-6 text-center animate-[float_3s_ease-in-out_infinite]">{currentSeg.visualAsset}</div>

                <div className="min-h-[3rem]">
                    {isRewriting ? (
                        <div className="flex items-center gap-2 text-blue-300 text-lg">
                            <Sparkles className="animate-spin" size={20} /> Rewriting for {complexity} level...
                        </div>
                    ) : (
                        <p>{displayedText}<span className={`${isTyping ? 'animate-pulse' : 'hidden'}`}>|</span></p>
                    )}
                </div>
            </div>

            {/* INTERACTION AREA */}
            <div className="space-y-4">
                {/* Options for Quiz/Surprise */}
                {(currentSeg.type === 'surprise_question' || currentSeg.type === 'mini_game') && currentSeg.options && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentSeg.options.map((opt, idx) => (
                            <button 
                                key={idx}
                                disabled={interactionComplete}
                                onClick={() => handleOptionSelect(idx)}
                                className={`p-4 rounded-xl border-2 text-left text-lg font-semibold transition-all transform hover:scale-[1.02] active:scale-95
                                    ${interactionComplete && idx === currentSeg.correctIndex 
                                        ? 'bg-green-500 border-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]' 
                                        : 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200'}
                                `}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}

                {/* Explain Mistake Button (Only if wrong answer selected and not yet correct) */}
                {!interactionComplete && lastWrongAnswer && (
                    <div className="mt-4 animate-[fadeIn_0.3s]">
                        {!mistakeExplanation ? (
                            <button
                                onClick={handleExplainMistake}
                                disabled={isExplaining}
                                className="text-sm flex items-center gap-2 text-orange-400 hover:text-orange-300 font-bold mx-auto border border-orange-400/30 px-4 py-2 rounded-full transition-colors"
                            >
                                {isExplaining ? <Loader2 size={16} className="animate-spin"/> : <Lightbulb size={16} />}
                                {isHindi ? "Meri Galti Samjhao (AI)" : "Explain My Mistake (AI)"}
                            </button>
                        ) : (
                            <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl text-sm text-orange-200 mt-2 relative">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold flex items-center gap-2"><Brain size={14}/> AI Insight</span>
                                    <button onClick={() => setMistakeExplanation(null)} className="p-1 hover:bg-white/10 rounded"><X size={14}/></button>
                                </div>
                                <p className="leading-relaxed">{mistakeExplanation}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Next Button */}
                {interactionComplete && !isTyping && (
                    <button 
                        onClick={handleNext}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xl rounded-xl shadow-lg transform hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                    >
                        {segIndex < segments.length - 1 ? 'Continue Chapter' : 'Finish Chapter'} <Play size={24} fill="currentColor" />
                    </button>
                )}
            </div>
        </div>
      </div>

      {/* FLOATING AI CHAT BUTTON */}
      <button 
        onClick={() => setShowChat(true)}
        className="fixed bottom-24 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-2xl z-40 transition-transform hover:scale-110 flex items-center justify-center border-2 border-purple-400"
        title="Ask AI Teacher"
      >
        <MessageCircle size={28} />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
        </span>
      </button>

      {/* CHAT OVERLAY */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 animate-[fadeIn_0.2s]">
            <div className="bg-white text-gray-900 w-full sm:w-96 h-[80vh] sm:h-[600px] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Zap size={16} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">AI Doubt Solver</h3>
                            <p className="text-[10px] text-purple-200">Answers are saved to Notebook</p>
                        </div>
                    </div>
                    <button onClick={() => setShowChat(false)} className="hover:bg-white/20 p-1 rounded transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {chatHistory.length === 0 && (
                        <div className="text-center text-gray-400 mt-10 space-y-2">
                            <MessageCircle size={40} className="mx-auto opacity-20" />
                            <p className="text-sm">Ask anything about <br/><span className="font-bold text-gray-600">{conceptNode?.title}</span></p>
                        </div>
                    )}
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                msg.role === 'user' 
                                    ? 'bg-purple-600 text-white rounded-tr-none' 
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isChatLoading && (
                        <div className="flex justify-start">
                             <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={chatQuery}
                            onChange={(e) => setChatQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                            placeholder={isHindi ? "Apna sawal yahan likhein..." : "Type your doubt here..."}
                            className="w-full pl-4 pr-12 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm font-medium"
                        />
                        <button 
                            onClick={handleAskAI}
                            disabled={!chatQuery.trim() || isChatLoading}
                            className="absolute right-2 top-2 p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
      
      {/* PROGRESS BAR */}
      <div className="h-2 bg-gray-800 w-full fixed bottom-0">
          <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${((segIndex + 1) / segments.length) * 100}%` }}></div>
      </div>

    </div>
  );
};
