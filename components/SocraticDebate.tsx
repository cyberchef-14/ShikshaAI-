import React, { useState, useRef, useEffect } from 'react';
import { Swords, Send, Shield, Trophy, RefreshCcw, ArrowLeft } from 'lucide-react';
import { getDebateResponse } from '../services/geminiService';
import { useStudent } from '../context/StudentContext';

const TOPICS = [
  "Nuclear Energy should be banned.",
  "Plastic is actually good for the environment.",
  "Viruses are not alive.",
  "Gravity is just a theory."
];

export const SocraticDebate: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addXP } = useStudent();
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [messages, setMessages] = useState<{role: 'ai'|'user', text: string}[]>([]);
  const [input, setInput] = useState("");
  const [logicScore, setLogicScore] = useState(50); // Start at 50/100
  const [isTyping, setIsTyping] = useState(false);
  const [gameStatus, setGameStatus] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startDebate = (topic: string) => {
      setActiveTopic(topic);
      setMessages([{ role: 'ai', text: `I believe "${topic}". Convince me otherwise using scientific logic.` }]);
      setLogicScore(50);
      setGameStatus('PLAYING');
  };

  const handleSend = async () => {
      if (!input.trim() || !activeTopic) return;
      
      const userMsg = input;
      setInput("");
      setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
      setIsTyping(true);

      const response = await getDebateResponse(activeTopic, [...messages, { role: 'user', text: userMsg }]);
      
      setMessages(prev => [...prev, { role: 'ai', text: response.reply }]);
      setIsTyping(false);
      
      const newScore = Math.min(100, Math.max(0, logicScore + response.logicScoreChange));
      setLogicScore(newScore);

      if (response.isWin || newScore >= 90) {
          setGameStatus('WON');
          addXP(100);
      } else if (newScore <= 10) {
          setGameStatus('LOST');
      }
  };

  if (!activeTopic) {
      return (
          <div className="w-full max-w-4xl mx-auto p-6 animate-[fadeIn_0.5s_ease-out]">
              <div className="flex items-center gap-4 mb-8">
                  <button onClick={onBack} className="p-2 bg-white rounded-full shadow hover:bg-gray-50"><ArrowLeft/></button>
                  <h1 className="text-3xl font-black text-gray-800 italic flex items-center gap-3">
                      <Swords size={32} className="text-red-600" /> DEBATE ARENA
                  </h1>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {TOPICS.map((topic, i) => (
                      <div key={i} onClick={() => startDebate(topic)} className="bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-red-500 cursor-pointer group transition-all transform hover:-translate-y-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">"{topic}"</h3>
                          <p className="text-gray-500 text-sm">Challenge the AI's stance using logic and science.</p>
                          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                              Enter Arena <ArrowLeft className="rotate-180" size={12}/>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto h-[600px] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col font-sans animate-[fadeIn_0.5s_ease-out]">
        
        {/* Arena Header */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
                 <button onClick={() => setActiveTopic(null)} className="p-2 hover:bg-white/10 rounded-full"><ArrowLeft size={20}/></button>
                 <div>
                     <h2 className="font-bold text-sm text-gray-400 uppercase tracking-widest">Debate Topic</h2>
                     <p className="font-bold text-lg">"{activeTopic}"</p>
                 </div>
            </div>
            
            {/* Logic Health Bar */}
            <div className="w-48">
                <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-red-400">AI Logic</span>
                    <span className="text-green-400">Your Logic</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden relative">
                    <div className="absolute left-0 h-full bg-red-500 transition-all duration-500" style={{ width: '50%' }}></div>
                    <div className="absolute right-0 h-full bg-green-500 transition-all duration-500" style={{ width: `${logicScore - 50 + 50}%` }}></div> {/* Visual trick */}
                    {/* Simplified bar: Left is <50, Right is >50 */}
                    <div className="absolute inset-0 w-full h-full bg-gray-700">
                         <div className={`h-full transition-all duration-500 ${logicScore > 50 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${logicScore}%` }}></div>
                    </div>
                </div>
                <div className="text-center text-[10px] mt-1">{logicScore}/100 Points</div>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50" ref={scrollRef}>
            {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-5 shadow-sm relative ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}>
                        <div className={`absolute -top-3 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold shadow-sm ${msg.role === 'user' ? '-right-2 bg-blue-800 text-white' : '-left-2 bg-red-600 text-white'}`}>
                            {msg.role === 'user' ? 'YOU' : 'AI'}
                        </div>
                        <p className="leading-relaxed">{msg.text}</p>
                    </div>
                </div>
            ))}
            {isTyping && (
                 <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm text-gray-400 italic text-sm">
                        Analyzing logic...
                    </div>
                </div>
            )}
            
            {/* End Game States */}
            {gameStatus !== 'PLAYING' && (
                <div className="flex justify-center my-8 animate-bounce">
                    <div className={`text-center p-6 rounded-3xl shadow-xl border-4 ${gameStatus === 'WON' ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800'}`}>
                        {gameStatus === 'WON' ? <Trophy size={48} className="mx-auto mb-2"/> : <Shield size={48} className="mx-auto mb-2"/>}
                        <h2 className="text-3xl font-black uppercase mb-2">{gameStatus === 'WON' ? 'VICTORY!' : 'DEFEATED'}</h2>
                        <p className="font-bold">{gameStatus === 'WON' ? '+100 XP Awarded' : 'Try a different angle.'}</p>
                        <button onClick={() => setActiveTopic(null)} className="mt-4 px-6 py-2 bg-white rounded-full font-bold shadow-sm text-sm border hover:bg-gray-50">Back to Arena</button>
                    </div>
                </div>
            )}
        </div>

        {/* Input Area */}
        {gameStatus === 'PLAYING' && (
            <div className="p-4 bg-white border-t border-gray-200">
                <div className="relative">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your scientific argument here..."
                        className="w-full pl-6 pr-14 py-4 bg-gray-100 rounded-full font-medium focus:ring-2 focus:ring-red-500 outline-none transition-shadow"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 top-2 w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};