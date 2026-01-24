import React, { useState, useEffect, useRef } from 'react';
import { useStudent } from '../context/StudentContext';
import { QUIZZES } from '../data/curriculum';
import { Trophy, Timer, X, Zap, User, Bot, Swords, CheckCircle2, XCircle, Brain, Crown, ArrowLeft } from 'lucide-react';

interface YouVsAIQuizProps {
  onBack: () => void;
}

// Flatten questions for the battle pool
const BATTLE_QUESTIONS = Object.values(QUIZZES).flatMap(q => q.questions).sort(() => Math.random() - 0.5).slice(0, 5);

export const YouVsAIQuiz: React.FC<YouVsAIQuizProps> = ({ onBack }) => {
  const { digitalTwin, addXP } = useStudent();
  const [gameState, setGameState] = useState<'LOBBY' | 'BATTLE' | 'RESULT'>('LOBBY');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [aiAnswer, setAiAnswer] = useState<number | null>(null); // null = thinking, -1 = answered hidden, 0-3 = revealed
  const [roundResult, setRoundResult] = useState<'WAITING' | 'REVEAL'>('WAITING');

  // AI Persona
  const aiName = "NewtonBot 3000";
  const aiAvatarColor = "bg-purple-600";

  // Timer Ref
  const timerRef = useRef<any>(null);

  // --- LOBBY LOGIC ---
  useEffect(() => {
    if (gameState === 'LOBBY') {
      const timeout = setTimeout(() => {
        setGameState('BATTLE');
        startRound();
      }, 2500); // Fake matchmaking delay
      return () => clearTimeout(timeout);
    }
  }, [gameState]);

  // --- ROUND LOGIC ---
  const startRound = () => {
    setUserAnswer(null);
    setAiAnswer(null);
    setRoundResult('WAITING');
    setTimeLeft(10);
    
    // Start Timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleRoundEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // AI Logic: Decide when and what to answer
    const aiThinkTime = Math.random() * 4000 + 2000; // 2s to 6s delay
    setTimeout(() => {
        // AI randomly answers correctly (80% chance) or wrong
        const q = BATTLE_QUESTIONS[currentQIndex];
        const isCorrect = Math.random() > 0.2; 
        const aiChoice = isCorrect ? q.correctIndex : (q.correctIndex + 1) % 4;
        
        // Only set if round is still active
        setAiAnswer(prev => prev === null ? -1 : prev); // -1 means "Answered but hidden"
        
        // Store actual choice in a temp variable or state to reveal later? 
        // For simplicity, we just set a "ready" state (-1) and store the real choice in a ref or derived state logic
        // But since we need to show it at Reveal, let's actually set it to a specialized state or just keep it simple:
        // We'll use a separate effect or just logic at reveal time.
        // Actually, let's stick to: AI answers "hidden" (-1) then we reveal at end.
        // We need to know the AI's real choice to score. 
        // Let's store real choice in a dataset attribute or similar? No, state is better.
        // Let's use a hidden state for AI's real choice.
    }, aiThinkTime);
  };

  // We need a ref to store AI's real choice so we don't reveal it instantly
  const aiRealChoiceRef = useRef<number>(-1);

  // Reset AI choice per round
  useEffect(() => {
      if (gameState === 'BATTLE' && roundResult === 'WAITING' && timeLeft === 10) {
          // New round started
          aiRealChoiceRef.current = -1;
          const q = BATTLE_QUESTIONS[currentQIndex];
          const isCorrect = Math.random() > 0.2; // 80% accuracy
          const realChoice = isCorrect ? q.correctIndex : Math.floor(Math.random() * 4);
          
          // Schedule AI answer
          const delay = Math.random() * 5000 + 1000; // 1-6s
          const timeout = setTimeout(() => {
              if (roundResult === 'WAITING') {
                  setAiAnswer(-1); // Visual: AI has answered
                  aiRealChoiceRef.current = realChoice;
              }
          }, delay);
          return () => clearTimeout(timeout);
      }
  }, [currentQIndex, gameState, roundResult]); // Removed timeLeft dependency to avoid re-scheduling

  const handleUserClick = (idx: number) => {
    if (userAnswer !== null || roundResult === 'REVEAL') return;
    setUserAnswer(idx);
  };

  const handleRoundEnd = () => {
    clearInterval(timerRef.current);
    setRoundResult('REVEAL');
    
    // Reveal AI Answer
    setAiAnswer(aiRealChoiceRef.current === -1 ? null : aiRealChoiceRef.current); // If -1 (didn't answer in time), set null. Else real choice.

    // Calculate Scores
    const q = BATTLE_QUESTIONS[currentQIndex];
    let uPoints = 0;
    let aPoints = 0;

    if (userAnswer === q.correctIndex) uPoints += 100 + (timeLeft * 10); // Speed bonus
    if (aiRealChoiceRef.current === q.correctIndex) aPoints += 100 + (Math.floor(Math.random()*5) * 10); // Random speed bonus for AI simulation

    setUserScore(prev => prev + uPoints);
    setAiScore(prev => prev + aPoints);

    // Next Round Delay
    setTimeout(() => {
        if (currentQIndex < BATTLE_QUESTIONS.length - 1) {
            setCurrentQIndex(prev => prev + 1);
            startRound();
        } else {
            setGameState('RESULT');
            if (userScore > aiScore) addXP(200);
        }
    }, 3000);
  };

  // Trigger round end if both answered
  useEffect(() => {
      if (userAnswer !== null && aiAnswer === -1 && roundResult === 'WAITING') {
          // Both answered, short delay then reveal
          setTimeout(handleRoundEnd, 500);
      }
  }, [userAnswer, aiAnswer]);


  if (gameState === 'LOBBY') {
      return (
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-sans relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              
              <div className="z-10 text-center space-y-8 animate-[fadeIn_0.5s]">
                  <div className="relative">
                      <div className="w-32 h-32 rounded-full border-4 border-blue-500 flex items-center justify-center bg-slate-800 shadow-[0_0_50px_rgba(59,130,246,0.5)] mx-auto animate-pulse">
                          <Swords size={64} className="text-blue-400" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full border-4 border-purple-500 flex items-center justify-center bg-slate-800 shadow-[0_0_50px_rgba(168,85,247,0.5)] mx-auto translate-x-12 translate-y-4">
                          <Bot size={64} className="text-purple-400" />
                      </div>
                  </div>
                  
                  <div>
                      <h2 className="text-3xl font-black italic tracking-wider mb-2">SEARCHING OPPONENT...</h2>
                      <div className="flex justify-center gap-2">
                          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-100"></div>
                          <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-200"></div>
                      </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-4 rounded-xl max-w-sm mx-auto">
                      <p className="text-sm text-slate-400">Match found: <span className="text-purple-400 font-bold">{aiName}</span> (Level 10 AI)</p>
                  </div>
              </div>
          </div>
      );
  }

  if (gameState === 'RESULT') {
      const won = userScore >= aiScore;
      return (
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-sans p-4">
              <div className={`max-w-md w-full bg-slate-800 border-4 ${won ? 'border-yellow-500' : 'border-red-500'} rounded-3xl p-8 text-center shadow-2xl animate-[scaleIn_0.3s]`}>
                  {won ? <Trophy size={64} className="text-yellow-400 mx-auto mb-4" /> : <XCircle size={64} className="text-red-400 mx-auto mb-4" />}
                  <h2 className="text-4xl font-black italic mb-2">{won ? 'VICTORY!' : 'DEFEAT'}</h2>
                  <p className="text-slate-400 mb-6">{won ? 'You outsmarted the AI!' : 'The machine was faster this time.'}</p>
                  
                  <div className="flex justify-center gap-8 mb-8 text-2xl font-bold font-mono">
                      <div className="text-blue-400">
                          <p className="text-xs text-slate-500 mb-1">YOU</p>
                          {userScore}
                      </div>
                      <div className="text-purple-400">
                          <p className="text-xs text-slate-500 mb-1">AI</p>
                          {aiScore}
                      </div>
                  </div>

                  <button onClick={onBack} className="w-full py-4 bg-slate-700 hover:bg-slate-600 font-bold rounded-xl transition-colors">
                      Return to Arena
                  </button>
              </div>
          </div>
      );
  }

  const currentQ = BATTLE_QUESTIONS[currentQIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
        {/* TOP BAR: SCORES */}
        <div className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center shadow-lg z-10">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center border-2 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <User size={24} />
                </div>
                <div>
                    <p className="text-xs text-blue-400 font-bold uppercase">You</p>
                    <p className="text-2xl font-black font-mono leading-none">{userScore}</p>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <div className="text-xl font-black italic text-slate-700 bg-slate-200 px-4 py-1 rounded-full skew-x-[-12deg]">
                    VS
                </div>
                <div className={`mt-2 font-mono font-bold flex items-center gap-1 ${timeLeft < 4 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                    <Timer size={14} /> {timeLeft}s
                </div>
            </div>

            <div className="flex items-center gap-4 text-right">
                <div>
                    <p className="text-xs text-purple-400 font-bold uppercase">{aiName}</p>
                    <p className="text-2xl font-black font-mono leading-none">{aiScore}</p>
                </div>
                <div className={`w-12 h-12 rounded-full ${aiAvatarColor} flex items-center justify-center border-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)] relative`}>
                    <Bot size={24} />
                    {aiAnswer !== null && roundResult === 'WAITING' && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center animate-bounce">
                            <CheckCircle2 size={12} className="text-black"/>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* MAIN BATTLE AREA */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 left-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>

            {/* Question Card */}
            <div className="w-full max-w-3xl mb-8 relative z-10">
                <div className="text-center mb-4">
                    <span className="bg-slate-800 text-slate-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-slate-700">
                        Question {currentQIndex + 1} / 5
                    </span>
                </div>
                <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl text-center min-h-[160px] flex items-center justify-center border-b-8 border-slate-300">
                    <h2 className="text-xl md:text-2xl font-bold leading-relaxed">{currentQ.text}</h2>
                </div>
            </div>

            {/* Options Grid */}
            <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {currentQ.options.map((opt, idx) => {
                    // Logic for card styling based on state
                    let cardStyle = "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200";
                    let icon = null;

                    // If Revealed
                    if (roundResult === 'REVEAL') {
                        if (idx === currentQ.correctIndex) {
                            cardStyle = "bg-green-600 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]";
                            icon = <CheckCircle2 size={20} />;
                        } else if (idx === userAnswer) {
                            cardStyle = "bg-red-600 border-red-500 text-white";
                            icon = <XCircle size={20} />;
                        } else if (idx === aiAnswer) {
                            // AI got it wrong
                            cardStyle = "bg-purple-900/50 border-purple-500 text-purple-200 opacity-50"; 
                        } else {
                            cardStyle = "bg-slate-900 border-slate-800 text-slate-600 opacity-50";
                        }
                    } 
                    // If Waiting (User selected)
                    else if (userAnswer === idx) {
                        cardStyle = "bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] transform scale-105";
                    }

                    return (
                        <button
                            key={idx}
                            disabled={userAnswer !== null || roundResult === 'REVEAL'}
                            onClick={() => handleUserClick(idx)}
                            className={`p-6 rounded-2xl border-4 text-left font-bold text-lg transition-all duration-200 flex justify-between items-center relative overflow-hidden group ${cardStyle}`}
                        >
                            <span className="relative z-10">{opt}</span>
                            {icon}
                            
                            {/* AI Indicator on the card if revealed and AI picked it */}
                            {roundResult === 'REVEAL' && aiAnswer === idx && (
                                <div className="absolute top-2 right-2 flex items-center gap-1 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-md z-20">
                                    <Bot size={10} /> Picked
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Commentary / Status */}
            <div className="h-12 mt-6 flex items-center justify-center">
                {roundResult === 'WAITING' && aiAnswer === -1 && (
                    <div className="flex items-center gap-2 text-purple-400 animate-pulse font-bold bg-purple-900/30 px-4 py-2 rounded-full">
                        <Bot size={16} /> {aiName} has answered!
                    </div>
                )}
                {roundResult === 'WAITING' && aiAnswer === null && (
                    <div className="text-slate-500 text-sm italic flex items-center gap-2">
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                        {aiName} is thinking...
                    </div>
                )}
                {roundResult === 'REVEAL' && (
                    <div className="font-bold text-white text-lg">
                        {userAnswer === currentQ.correctIndex ? "You got it right!" : "Missed it!"} 
                        {aiAnswer === currentQ.correctIndex && userAnswer === currentQ.correctIndex ? " (AI matched you!)" : aiAnswer === currentQ.correctIndex ? " (AI stole the point!)" : ""}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};