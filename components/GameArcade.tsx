import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, Play, RefreshCw, Zap, Brain, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Pause, Grid, ArrowLeft, Gamepad2, Timer, CheckCircle2 } from 'lucide-react';
import { useStudent } from '../context/StudentContext';

// --- SHARED TYPES & DATA ---
type GameView = 'MENU' | 'SNAKE' | 'MEMORY';

// --- GAME 1: BIO-SNAKE LOGIC ---
const KNOWLEDGE_BITES = [
  { type: 'Formula', text: 'Ohm\'s Law: V = IR' },
  { type: 'Fact', text: 'Mitochondria is the powerhouse of the cell.' },
  { type: 'Formula', text: 'Mirror Formula: 1/v + 1/u = 1/f' },
  { type: 'Fact', text: 'Acids turn Blue litmus Red.' },
  { type: 'Formula', text: 'Power: P = VI' },
  { type: 'Fact', text: 'Xylem transports water, Phloem transports food.' },
  { type: 'Formula', text: 'Lens Power: P = 1/f (in meters)' },
  { type: 'Fact', text: 'Sodium is kept in Kerosene to prevent reaction.' },
  { type: 'Formula', text: 'Glucose: C6H12O6' },
  { type: 'Fact', text: 'The pH of pure water is 7 (Neutral).' },
  { type: 'Formula', text: 'Limestone: CaCO3' },
  { type: 'Fact', text: 'Convex mirrors always form virtual, diminished images.' }
];

const GRID_SIZE = 20;
const SPEED = 150;

const BioSnakeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addXP } = useStudent();
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameover'>('menu');
  const [snake, setSnake] = useState<{x: number, y: number}[]>([{x: 10, y: 10}]);
  const [food, setFood] = useState<{x: number, y: number}>({x: 15, y: 10});
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentFact, setCurrentFact] = useState<string>("Collect orbs to unlock facts!");
  const [lastFactType, setLastFactType] = useState<'Formula' | 'Fact' | 'Info'>('Info');
  
  const directionRef = useRef(direction);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGame = () => {
    setSnake([{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}]);
    setFood(generateFood());
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setScore(0);
    setGameState('playing');
    setCurrentFact("Collect orbs to unlock facts!");
    setLastFactType('Info');
  };

  const generateFood = () => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  };

  const handleInput = useCallback((newDir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    const current = directionRef.current;
    if (newDir === 'UP' && current === 'DOWN') return;
    if (newDir === 'DOWN' && current === 'UP') return;
    if (newDir === 'LEFT' && current === 'RIGHT') return;
    if (newDir === 'RIGHT' && current === 'LEFT') return;
    setDirection(newDir);
    directionRef.current = newDir;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      switch(e.key) {
        case 'ArrowUp': case 'w': handleInput('UP'); break;
        case 'ArrowDown': case 's': handleInput('DOWN'); break;
        case 'ArrowLeft': case 'a': handleInput('LEFT'); break;
        case 'ArrowRight': case 'd': handleInput('RIGHT'); break;
        case ' ': setGameState('paused'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleInput]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(() => {
        moveSnake();
      }, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, snake]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (directionRef.current) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    if (
      head.x < 0 || head.x >= GRID_SIZE || 
      head.y < 0 || head.y >= GRID_SIZE || 
      newSnake.some(seg => seg.x === head.x && seg.y === head.y)
    ) {
      setGameState('gameover');
      if (score > highScore) setHighScore(score);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(s => s + 10);
      setFood(generateFood());
      const randomFact = KNOWLEDGE_BITES[Math.floor(Math.random() * KNOWLEDGE_BITES.length)];
      setCurrentFact(randomFact.text);
      setLastFactType(randomFact.type as any);
      addXP(5); 
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  };

  return (
    <div className="w-full h-full flex flex-col p-4 bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-2xl relative overflow-hidden font-mono">
      {/* Header */}
      <div className="z-10 w-full flex justify-between items-center mb-4 text-green-400">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1 hover:bg-slate-800 rounded"><ArrowLeft size={20}/></button>
            <div>
                <h2 className="text-xl font-black italic tracking-tighter flex items-center gap-2">
                    <Zap size={20} className="animate-pulse" /> BIO-SNAKE
                </h2>
                <p className="text-[10px] text-green-600">EAT ORBS. LEARN FACTS.</p>
            </div>
        </div>
        <div className="text-right">
           <div className="text-2xl font-bold">{score}</div>
           <div className="text-[10px] opacity-70">HIGH: {highScore}</div>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative z-10 mx-auto bg-black/80 border-2 border-green-900 rounded-lg p-1 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
        {/* Toast */}
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-[90%] text-center pointer-events-none transition-all duration-300 ${gameState === 'playing' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className={`inline-block px-4 py-2 rounded-full text-xs font-bold border shadow-lg backdrop-blur-md ${lastFactType === 'Formula' ? 'bg-blue-900/80 border-blue-500 text-blue-200' : 'bg-purple-900/80 border-purple-500 text-purple-200'}`}>
                <span className="uppercase opacity-70 mr-2">{lastFactType}:</span>{currentFact}
            </div>
        </div>

        {gameState === 'menu' && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 text-center">
                 <Brain size={48} className="text-green-500 mb-4 animate-bounce" />
                 <h3 className="text-white font-bold text-lg mb-2">Ready to Learn?</h3>
                 <button onClick={startGame} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-black font-bold rounded flex items-center gap-2"><Play size={16} /> START GAME</button>
             </div>
        )}

        {gameState === 'gameover' && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 text-center">
                 <Trophy size={48} className="text-yellow-500 mb-4" />
                 <h3 className="text-white font-bold text-lg mb-1">Game Over!</h3>
                 <p className="text-gray-400 text-sm mb-4">Score: {score}</p>
                 <button onClick={startGame} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-black font-bold rounded flex items-center gap-2"><RefreshCw size={16} /> TRY AGAIN</button>
             </div>
        )}

        {/* Grid */}
        <div className="grid gap-px bg-gray-900" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, width: '300px', height: '300px' }}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            const isHead = snake[0].x === x && snake[0].y === y;
            return <div key={i} className={`w-full h-full rounded-sm transition-all duration-100 ${isHead ? 'bg-green-400 shadow-[0_0_10px_#4ade80] z-10' : isSnake ? 'bg-green-600' : isFood ? 'bg-yellow-400 animate-pulse rounded-full shadow-[0_0_10px_#facc15]' : 'bg-transparent'}`}></div>;
          })}
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="mt-4 z-10 grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
          <div></div>
          <button onClick={() => handleInput('UP')} className="p-3 bg-gray-800 rounded-xl active:bg-gray-700 shadow-lg border-b-4 border-gray-950 active:border-b-0 active:translate-y-1"><ChevronUp className="text-white"/></button>
          <div></div>
          <button onClick={() => handleInput('LEFT')} className="p-3 bg-gray-800 rounded-xl active:bg-gray-700 shadow-lg border-b-4 border-gray-950 active:border-b-0 active:translate-y-1"><ChevronLeft className="text-white"/></button>
          <button onClick={() => setGameState(g => g === 'playing' ? 'paused' : 'playing')} className="p-3 bg-gray-800 rounded-xl active:bg-gray-700 shadow-lg border-b-4 border-gray-950 active:border-b-0 active:translate-y-1">{gameState === 'playing' ? <Pause className="text-yellow-500" /> : <Play className="text-green-500"/>}</button>
          <button onClick={() => handleInput('RIGHT')} className="p-3 bg-gray-800 rounded-xl active:bg-gray-700 shadow-lg border-b-4 border-gray-950 active:border-b-0 active:translate-y-1"><ChevronRight className="text-white"/></button>
          <div></div>
          <button onClick={() => handleInput('DOWN')} className="p-3 bg-gray-800 rounded-xl active:bg-gray-700 shadow-lg border-b-4 border-gray-950 active:border-b-0 active:translate-y-1"><ChevronDown className="text-white"/></button>
          <div></div>
      </div>
    </div>
  );
};

// --- GAME 2: MOLECULAR MEMORY LOGIC ---
const MEMORY_CARDS_DATA = [
  { id: 1, content: 'H₂O', matchId: 2, type: 'formula' }, { id: 2, content: 'Water', matchId: 1, type: 'name' },
  { id: 3, content: 'NaCl', matchId: 4, type: 'formula' }, { id: 4, content: 'Salt', matchId: 3, type: 'name' },
  { id: 5, content: 'CO₂', matchId: 6, type: 'formula' }, { id: 6, content: 'Carbon Dioxide', matchId: 5, type: 'name' },
  { id: 7, content: 'O₂', matchId: 8, type: 'formula' }, { id: 8, content: 'Oxygen', matchId: 7, type: 'name' },
  { id: 9, content: 'HCl', matchId: 10, type: 'formula' }, { id: 10, content: 'Hydrochloric Acid', matchId: 9, type: 'name' },
  { id: 11, content: 'Au', matchId: 12, type: 'formula' }, { id: 12, content: 'Gold', matchId: 11, type: 'name' },
];

const MolecularMemoryGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addXP } = useStudent();
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    shuffleCards();
  }, []);

  const shuffleCards = () => {
    const shuffled = [...MEMORY_CARDS_DATA]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, key: Math.random() })); // Add random key to force re-render
    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setWon(false);
  };

  const handleClick = (index: number) => {
    if (disabled || flipped.includes(index) || solved.includes(index)) return;

    if (flipped.length === 0) {
      setFlipped([index]);
    } else {
      setFlipped([flipped[0], index]);
      setDisabled(true);
      setMoves(m => m + 1);
      checkForMatch(index);
    }
  };

  const checkForMatch = (secondIndex: number) => {
    const firstIndex = flipped[0];
    if (cards[firstIndex].matchId === cards[secondIndex].id) {
      setSolved(prev => [...prev, firstIndex, secondIndex]);
      setFlipped([]);
      setDisabled(false);
      addXP(5); // XP per match
      if (solved.length + 2 === cards.length) setWon(true);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-2xl relative overflow-hidden font-sans">
      <div className="z-10 w-full flex justify-between items-center mb-4 text-cyan-400">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1 hover:bg-slate-800 rounded"><ArrowLeft size={20}/></button>
            <div>
                <h2 className="text-xl font-black flex items-center gap-2">
                    <Grid size={20} /> MOLECULAR MEMORY
                </h2>
                <p className="text-[10px] text-cyan-600">MATCH FORMULAS. TRAIN BRAIN.</p>
            </div>
        </div>
        <div className="text-right">
           <div className="text-2xl font-bold">{moves}</div>
           <div className="text-[10px] opacity-70">MOVES</div>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center">
        {won && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 text-center animate-in fade-in">
                 <CheckCircle2 size={64} className="text-cyan-400 mb-4" />
                 <h3 className="text-white font-bold text-2xl mb-2">Level Complete!</h3>
                 <p className="text-cyan-200 mb-6">You mastered the molecules in {moves} moves.</p>
                 <button onClick={shuffleCards} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105">
                    PLAY AGAIN
                 </button>
             </div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full max-w-sm">
            {cards.map((card, index) => {
                const isFlipped = flipped.includes(index) || solved.includes(index);
                return (
                    <div 
                        key={card.key}
                        onClick={() => handleClick(index)}
                        className={`aspect-square cursor-pointer relative perspective-1000 group`}
                    >
                        <div className={`w-full h-full transition-all duration-500 transform-style-3d rounded-xl shadow-md border-2
                            ${isFlipped ? 'bg-cyan-900 border-cyan-400 rotate-y-180' : 'bg-slate-800 border-slate-700 hover:border-cyan-700'}
                        `}>
                            {/* Front (Hidden) */}
                            {!isFlipped && (
                                <div className="absolute inset-0 flex items-center justify-center text-cyan-900 opacity-20">
                                    <Grid size={24} />
                                </div>
                            )}
                            {/* Back (Revealed) */}
                            {isFlipped && (
                                <div className="absolute inset-0 flex items-center justify-center text-center p-1">
                                    <span className={`font-bold ${card.type === 'formula' ? 'text-2xl text-white' : 'text-xs text-cyan-200 uppercase tracking-tighter'}`}>
                                        {card.content}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

// --- MAIN ARCADE MENU COMPONENT ---
export const GameArcade: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameView>('MENU');

  if (activeGame === 'SNAKE') return <BioSnakeGame onBack={() => setActiveGame('MENU')} />;
  if (activeGame === 'MEMORY') return <MolecularMemoryGame onBack={() => setActiveGame('MENU')} />;

  return (
    <div className="w-full h-[600px] flex flex-col bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.4),transparent_70%)]"></div>
            <div className="grid grid-cols-12 h-full opacity-30">
                {Array.from({length: 12}).map((_, i) => (
                    <div key={i} className="border-r border-slate-700/50"></div>
                ))}
            </div>
        </div>

        {/* Menu Header */}
        <div className="relative z-10 p-8 text-center">
            <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2 flex items-center justify-center gap-3 text-shadow-lg">
                <Gamepad2 size={36} className="text-purple-500" /> KNOWLEDGE ARCADE
            </h2>
            <p className="text-slate-400 font-mono text-sm">SELECT A CARTRIDGE TO START</p>
        </div>

        {/* Game Cards */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-6 gap-6 overflow-x-auto snap-x">
            
            {/* Card 1: Snake */}
            <div 
                onClick={() => setActiveGame('SNAKE')}
                className="group relative w-64 h-80 bg-slate-800 rounded-2xl border-4 border-slate-700 hover:border-green-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] snap-center shrink-0 overflow-hidden"
            >
                <div className="absolute inset-0 bg-green-500/10 group-hover:bg-green-500/20 transition-colors"></div>
                <div className="absolute top-4 right-4 bg-green-900 text-green-300 text-[10px] font-bold px-2 py-1 rounded border border-green-700">POPULAR</div>
                
                <div className="h-1/2 flex items-center justify-center text-green-500">
                    <Zap size={64} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <div className="p-4 bg-slate-900/90 h-1/2 border-t-2 border-slate-700 group-hover:border-green-500 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-1">BIO-SNAKE</h3>
                    <p className="text-xs text-slate-400 mb-4 h-8">Eat knowledge orbs to grow. Avoid walls.</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                        <Trophy size={12} /> High Score Saved
                    </div>
                    <button className="mt-4 w-full py-2 bg-green-600 text-white font-bold text-xs rounded uppercase tracking-wider group-hover:bg-green-500">
                        Insert Coin
                    </button>
                </div>
            </div>

            {/* Card 2: Memory */}
            <div 
                onClick={() => setActiveGame('MEMORY')}
                className="group relative w-64 h-80 bg-slate-800 rounded-2xl border-4 border-slate-700 hover:border-cyan-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] snap-center shrink-0 overflow-hidden"
            >
                 <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors"></div>
                 <div className="absolute top-4 right-4 bg-cyan-900 text-cyan-300 text-[10px] font-bold px-2 py-1 rounded border border-cyan-700">NEW</div>

                 <div className="h-1/2 flex items-center justify-center text-cyan-500">
                    <Grid size={64} className="group-hover:rotate-90 transition-transform duration-500" />
                </div>
                
                <div className="p-4 bg-slate-900/90 h-1/2 border-t-2 border-slate-700 group-hover:border-cyan-500 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-1">MOLECULAR MEMORY</h3>
                    <p className="text-xs text-slate-400 mb-4 h-8">Match chemical formulas to their names.</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                        <Timer size={12} /> Speed Challenge
                    </div>
                    <button className="mt-4 w-full py-2 bg-cyan-600 text-white font-bold text-xs rounded uppercase tracking-wider group-hover:bg-cyan-500">
                        Insert Coin
                    </button>
                </div>
            </div>

            {/* Card 3: Coming Soon */}
            <div className="group relative w-64 h-80 bg-slate-800/50 rounded-2xl border-4 border-dashed border-slate-700 cursor-not-allowed snap-center shrink-0 opacity-60">
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <Brain size={48} className="mb-4 opacity-50" />
                    <h3 className="font-bold text-lg">QUIZ RUSH</h3>
                    <p className="text-xs uppercase tracking-widest mt-2">Coming Soon</p>
                </div>
            </div>

        </div>

        <div className="relative z-10 text-center pb-4 text-[10px] text-slate-500 font-mono">
            EARN XP • UNLOCK SKINS • CLIMB LEADERBOARD
        </div>
    </div>
  );
};
