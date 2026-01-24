import React, { useState } from 'react';
import { Beaker, FlaskConical, Flame, Droplets, Eraser, Info, CheckCircle2, FlaskRound } from 'lucide-react';
import { useStudent } from '../context/StudentContext';

type ChemicalType = 'ACID' | 'BASE' | 'INDICATOR' | 'METAL' | 'SALT';

interface Chemical {
  id: string;
  name: string;
  type: ChemicalType;
  color: string;
  formula: string;
}

const INVENTORY: Chemical[] = [
  { id: 'hcl', name: 'Dilute HCl', type: 'ACID', color: 'bg-transparent', formula: 'HCl' },
  { id: 'naoh', name: 'Sodium Hydroxide', type: 'BASE', color: 'bg-transparent', formula: 'NaOH' },
  { id: 'litmus_blue', name: 'Blue Litmus', type: 'INDICATOR', color: 'bg-blue-500', formula: 'Soln' },
  { id: 'litmus_red', name: 'Red Litmus', type: 'INDICATOR', color: 'bg-red-500', formula: 'Soln' },
  { id: 'phen', name: 'Phenolphthalein', type: 'INDICATOR', color: 'bg-transparent', formula: 'C20H14O4' },
  { id: 'zn', name: 'Zinc Granules', type: 'METAL', color: 'bg-gray-400', formula: 'Zn' },
  { id: 'cu', name: 'Copper Turnings', type: 'METAL', color: 'bg-orange-700', formula: 'Cu' },
];

export const VirtualLab: React.FC = () => {
  const { addXP } = useStudent();
  const [beakerContent, setBeakerContent] = useState<Chemical[]>([]);
  const [reactionResult, setReactionResult] = useState<{ color: string; message: string; effect?: 'BUBBLES' | 'smoke' | 'fire' } | null>(null);
  const [selectedTool, setSelectedTool] = useState<'BEAKER' | 'BURNER'>('BEAKER');

  const addToBeaker = (chem: Chemical) => {
    if (reactionResult) return; // Reset required
    if (beakerContent.length >= 2) return; // Max 2 for simplicity

    const newContent = [...beakerContent, chem];
    setBeakerContent(newContent);
    checkReaction(newContent);
  };

  const resetLab = () => {
    setBeakerContent([]);
    setReactionResult(null);
  };

  const checkReaction = (ingredients: Chemical[]) => {
    if (ingredients.length < 2) return;

    const ids = ingredients.map(c => c.id).sort();
    const combo = ids.join('+');

    let result = null;

    // REACTION LOGIC
    if (combo.includes('hcl') && combo.includes('litmus_blue')) {
      result = { color: 'bg-red-500', message: "Acid turns Blue Litmus RED!", effect: undefined };
    } 
    else if (combo.includes('naoh') && combo.includes('litmus_red')) {
      result = { color: 'bg-blue-500', message: "Base turns Red Litmus BLUE!", effect: undefined };
    }
    else if (combo.includes('naoh') && combo.includes('phen')) {
      result = { color: 'bg-pink-500', message: "Phenolphthalein turns PINK in Basic solution.", effect: undefined };
    }
    else if (combo.includes('hcl') && combo.includes('phen')) {
      result = { color: 'bg-transparent', message: "Phenolphthalein remains COLORLESS in Acid.", effect: undefined };
    }
    else if (combo.includes('hcl') && combo.includes('zn')) {
      result = { color: 'bg-gray-200', message: "Reaction! Bubbles of Hydrogen gas are evolved.", effect: 'BUBBLES' };
    }
    else if (combo.includes('hcl') && combo.includes('naoh')) {
        result = { color: 'bg-transparent', message: "Neutralization Reaction! Salt (NaCl) and Water formed. Heat is evolved.", effect: 'smoke' };
    }
    else {
      result = { color: 'bg-amber-900', message: "Mixture formed. No visible characteristic reaction.", effect: undefined };
    }

    setReactionResult(result);
    if (result.message.includes("Reaction") || result.message.includes("turns")) {
        addXP(10);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-out]">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-t-3xl flex justify-between items-center shadow-lg">
        <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <FlaskConical className="text-cyan-400" /> Virtual Science Lab
            </h2>
            <p className="text-slate-400 text-sm">Safe environment for chemical experimentation.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setSelectedTool('BEAKER')}
                className={`p-3 rounded-xl border-2 transition-all ${selectedTool === 'BEAKER' ? 'border-cyan-400 bg-cyan-900/30 text-cyan-400' : 'border-slate-700 text-slate-500'}`}
            >
                <Beaker />
            </button>
            <button 
                onClick={() => setSelectedTool('BURNER')}
                className={`p-3 rounded-xl border-2 transition-all ${selectedTool === 'BURNER' ? 'border-orange-400 bg-orange-900/30 text-orange-400' : 'border-slate-700 text-slate-500'}`}
            >
                <Flame />
            </button>
        </div>
      </div>

      <div className="bg-slate-800 min-h-[500px] rounded-b-3xl border border-slate-700 flex flex-col md:flex-row overflow-hidden">
        
        {/* SIDEBAR: CHEMICAL SHELF */}
        <div className="w-full md:w-64 bg-slate-900/50 border-r border-slate-700 p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Chemical Shelf</h3>
            <div className="grid grid-cols-2 gap-3">
                {INVENTORY.map((chem) => (
                    <button
                        key={chem.id}
                        onClick={() => addToBeaker(chem)}
                        disabled={!!reactionResult || selectedTool !== 'BEAKER'}
                        className="flex flex-col items-center justify-center p-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-cyan-500 hover:bg-slate-700 transition-all disabled:opacity-50 active:scale-95"
                    >
                        <div className={`w-8 h-8 rounded-full mb-2 border border-white/10 shadow-inner flex items-center justify-center ${chem.color === 'bg-transparent' ? 'bg-slate-200/10' : chem.color}`}>
                            <span className="text-[8px] font-bold text-white/70">{chem.formula.slice(0,2)}</span>
                        </div>
                        <span className="text-[10px] text-center font-medium text-slate-300 leading-tight">{chem.name}</span>
                    </button>
                ))}
            </div>
            
            <div className="mt-8 p-4 bg-blue-900/20 rounded-xl border border-blue-500/20">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Info size={16} /> <span className="text-xs font-bold">Lab Safety</span>
                </div>
                <p className="text-[10px] text-blue-200">
                    Always reset the apparatus between experiments. Observe color changes carefully.
                </p>
            </div>
        </div>

        {/* MAIN WORKBENCH */}
        <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-opacity-10 flex flex-col items-center justify-center p-8">
             
             {/* The Apparatus */}
             <div className="relative group">
                 {/* Reaction Result Popover */}
                 {reactionResult && (
                     <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 bg-white text-slate-900 p-4 rounded-xl shadow-2xl animate-[bounce_0.5s_ease-out] z-20">
                         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-4 h-4 bg-white rotate-45"></div>
                         <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
                             <CheckCircle2 size={16} className="text-green-500" /> Observation
                         </h4>
                         <p className="text-xs leading-relaxed">{reactionResult.message}</p>
                     </div>
                 )}

                 {/* Beaker Container */}
                 <div className="relative w-48 h-60 border-4 border-slate-400/50 border-t-0 rounded-b-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm shadow-xl flex items-end justify-center overflow-hidden">
                     
                     {/* Liquid Level */}
                     <div 
                        className={`w-full transition-all duration-1000 ease-in-out relative
                            ${beakerContent.length === 0 ? 'h-0' : beakerContent.length === 1 ? 'h-1/3' : 'h-2/3'}
                            ${reactionResult ? reactionResult.color : beakerContent.length > 0 ? beakerContent[0].color : 'bg-transparent'}
                            ${reactionResult?.color === 'bg-transparent' ? 'bg-blue-100/20' : ''}
                        `}
                     >
                         {/* Bubble Effect */}
                         {reactionResult?.effect === 'BUBBLES' && (
                             <div className="absolute inset-0 w-full h-full">
                                 {Array.from({length: 10}).map((_, i) => (
                                     <div key={i} className="absolute bottom-0 w-2 h-2 bg-white/50 rounded-full animate-[bubble_2s_infinite]" style={{ left: `${Math.random()*100}%`, animationDelay: `${Math.random()}s` }}></div>
                                 ))}
                             </div>
                         )}
                         {/* Smoke Effect */}
                         {reactionResult?.effect === 'smoke' && (
                              <div className="absolute -top-10 left-0 w-full h-20 bg-gray-200/30 blur-xl animate-pulse"></div>
                         )}
                     </div>

                     {/* Glass Reflection */}
                     <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 via-transparent to-black/10 pointer-events-none rounded-b-3xl"></div>
                 </div>
                 
                 {/* Beaker Stand / Surface */}
                 <div className="w-64 h-4 bg-slate-700 rounded-full mt-2 mx-auto shadow-lg opacity-50 blur-sm"></div>
             </div>

             {/* Contents Label */}
             <div className="mt-8 flex gap-2">
                 {beakerContent.map((c, i) => (
                     <span key={i} className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded-full border border-slate-600">
                         {c.name}
                     </span>
                 ))}
                 {beakerContent.length === 0 && <span className="text-slate-500 text-sm italic">Empty Beaker</span>}
             </div>

             {/* Controls */}
             <div className="mt-8">
                 <button 
                    onClick={resetLab}
                    className="flex items-center gap-2 px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-full hover:bg-red-500 hover:text-white transition-all"
                 >
                     <Eraser size={16} /> Clean Apparatus
                 </button>
             </div>
        </div>
      </div>
    </div>
  );
};
