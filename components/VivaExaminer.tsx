import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Play, CheckCircle2, Award, ArrowLeft, Loader2 } from 'lucide-react';
import { evaluateVivaAnswer } from '../services/geminiService';
import { useStudent } from '../context/StudentContext';

interface VivaExaminerProps {
  onBack: () => void;
}

const TOPICS = [
  "Chemical Reactions",
  "Life Processes (Digestion)",
  "Ohm's Law",
  "Acids and Bases"
];

const QUESTIONS_DB: Record<string, string[]> = {
  "Chemical Reactions": ["What happens when Magnesium ribbon is burnt in air?", "Why do we balance chemical equations?"],
  "Life Processes (Digestion)": ["What is the role of saliva in digestion?", "Why is the small intestine so long?"],
  "Ohm's Law": ["State Ohm's Law in your own words.", "Does resistance change if we change the wire thickness?"],
  "Acids and Bases": ["How can you tell if a solution is acidic without tasting it?", "What happens when an acid reacts with a metal?"]
};

export const VivaExaminer: React.FC<VivaExaminerProps> = ({ onBack }) => {
  const { addXP } = useStudent();
  const [sessionState, setSessionState] = useState<'SETUP' | 'ASKING' | 'LISTENING' | 'EVALUATING' | 'FEEDBACK'>('SETUP');
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<{score: number, feedback: string, confidence: number} | null>(null);
  
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = 'en-US'; // Default to English for Viva
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                interim += event.results[i][0].transcript;
            }
            setTranscript(interim);
        };

        recognitionRef.current.onend = () => {
            if (sessionState === 'LISTENING') {
                handleStopListening();
            }
        };
    }
  }, [sessionState]);

  const speak = (text: string) => {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.0;
      window.speechSynthesis.speak(u);
  };

  const handleStartSession = () => {
      const qs = QUESTIONS_DB[selectedTopic];
      const q = qs[Math.floor(Math.random() * qs.length)];
      setCurrentQuestion(q);
      setSessionState('ASKING');
      speak(q);
      // Auto switch to listening after speaking (approx delay)
      setTimeout(() => {
          setSessionState('LISTENING');
          startListening();
      }, q.length * 70 + 1000); 
  };

  const startListening = () => {
      setTranscript("");
      try {
        recognitionRef.current?.start();
      } catch(e) { console.error(e); }
  };

  const handleStopListening = async () => {
      setSessionState('EVALUATING');
      try { recognitionRef.current?.stop(); } catch(e) {}
      
      // Call AI
      const result = await evaluateVivaAnswer(currentQuestion, transcript);
      setFeedback(result);
      setSessionState('FEEDBACK');
      
      if (result.score > 60) addXP(50);
      speak(`You scored ${result.score}. ${result.feedback}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 font-sans animate-[fadeIn_0.5s_ease-out]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white flex justify-between items-center">
             <div className="flex items-center gap-3">
                 <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition"><ArrowLeft size={20}/></button>
                 <div>
                     <h2 className="text-xl font-bold flex items-center gap-2"><Mic size={20} /> AI Viva Examiner</h2>
                     <p className="text-xs text-teal-100 opacity-80">Oral Assessment Mode</p>
                 </div>
             </div>
             <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase">Beta</div>
        </div>

        {/* Content Area */}
        <div className="p-8 min-h-[400px] flex flex-col items-center justify-center">
            
            {sessionState === 'SETUP' && (
                <div className="w-full space-y-6">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Award size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">Ready for your Oral Exam?</h3>
                        <p className="text-gray-500 mt-2">The AI will ask you a question. Speak your answer clearly.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Topic</label>
                        <select 
                            value={selectedTopic} 
                            onChange={(e) => setSelectedTopic(e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <button onClick={handleStartSession} className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2">
                        <Play size={20} fill="currentColor" /> Start Viva
                    </button>
                </div>
            )}

            {sessionState === 'ASKING' && (
                <div className="text-center space-y-6 animate-pulse">
                    <div className="w-32 h-32 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                        <Volume2 size={64} className="text-teal-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Teacher is asking...</h3>
                    <p className="text-lg font-medium text-teal-800">"{currentQuestion}"</p>
                </div>
            )}

            {sessionState === 'LISTENING' && (
                <div className="text-center w-full space-y-8">
                     <div className="relative">
                         <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                            <Mic size={64} className="text-red-500" />
                         </div>
                         <div className="absolute inset-0 rounded-full border-4 border-red-200 animate-ping"></div>
                     </div>
                     
                     <div>
                         <p className="text-gray-400 text-sm uppercase font-bold mb-2">Listening...</p>
                         <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 min-h-[100px] text-lg text-gray-700 font-medium">
                             {transcript || "Start speaking..."}
                         </div>
                     </div>

                     <button onClick={handleStopListening} className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full shadow-lg">
                         Stop & Submit
                     </button>
                </div>
            )}

            {sessionState === 'EVALUATING' && (
                <div className="text-center">
                    <Loader2 size={48} className="text-teal-500 animate-spin mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-700">AI is grading your answer...</h3>
                    <p className="text-sm text-gray-500">Checking keywords and confidence.</p>
                </div>
            )}

            {sessionState === 'FEEDBACK' && feedback && (
                <div className="w-full space-y-6 text-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto text-3xl font-black border-4 shadow-lg
                        ${feedback.score >= 70 ? 'bg-green-100 text-green-600 border-green-200' : 'bg-orange-100 text-orange-600 border-orange-200'}
                    `}>
                        {feedback.score}
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{feedback.score >= 70 ? 'Excellent!' : 'Good Attempt'}</h3>
                        <div className="bg-gray-50 p-4 rounded-xl text-left border-l-4 border-teal-500">
                             <p className="text-gray-700 leading-relaxed">{feedback.feedback}</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                         <div className="flex-1 bg-gray-50 p-3 rounded-lg text-xs font-bold text-gray-500">
                            Confidence: <span className="text-gray-900">{feedback.confidence}%</span>
                         </div>
                         <div className="flex-1 bg-gray-50 p-3 rounded-lg text-xs font-bold text-gray-500">
                            XP Earned: <span className="text-teal-600">+{feedback.score > 60 ? 50 : 10}</span>
                         </div>
                    </div>

                    <button onClick={() => setSessionState('SETUP')} className="w-full py-3 border-2 border-gray-200 hover:bg-gray-50 text-gray-600 font-bold rounded-xl transition">
                        Next Question
                    </button>
                </div>
            )}

        </div>
    </div>
  );
};