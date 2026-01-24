
import React, { useState, useEffect, useRef } from 'react';
import { CONCEPT_GRAPH } from '../data/curriculum';
import { Atom, Dna, Zap, Info, Share2, X, MousePointerClick, Filter, Layers, Sparkles, Orbit } from 'lucide-react';

// --- DATA DEFINITIONS ---

// Extended nodes to show the "Full Roadmap" (Deep View)
// Status: 'active' (in current curriculum), 'future' (roadmap item)
const VISUAL_NODES = [
  // CHEMISTRY (Purple/Pink)
  { id: 'c10_chem_rxn_full', x: 15, y: 50, category: 'Chemistry', label: 'Chemical Rxns', type: 'core' },
  { id: 'c10_acids_bases', x: 30, y: 35, category: 'Chemistry', label: 'Acids & Bases', type: 'core' },
  { id: 'c10_metals', x: 30, y: 65, category: 'Chemistry', label: 'Metals & Non-Metals', type: 'future' },
  { id: 'c10_carbon', x: 45, y: 50, category: 'Chemistry', label: 'Carbon Compounds', type: 'future' },

  // BIOLOGY (Emerald/Teal)
  { id: 'c10_life_proc', x: 45, y: 20, category: 'Biology', label: 'Life Processes', type: 'core' },
  { id: 'c10_control', x: 60, y: 30, category: 'Biology', label: 'Control & Coord', type: 'future' },
  { id: 'c10_repro', x: 75, y: 20, category: 'Biology', label: 'Reproduction', type: 'future' },
  { id: 'c10_heredity', x: 60, y: 10, category: 'Biology', label: 'Heredity', type: 'future' },
  
  // PHYSICS (Orange/Amber)
  { id: 'c10_light', x: 60, y: 80, category: 'Physics', label: 'Light', type: 'core' },
  { id: 'c10_human_eye', x: 75, y: 70, category: 'Physics', label: 'Human Eye', type: 'future' },
  { id: 'c10_electricity', x: 45, y: 90, category: 'Physics', label: 'Electricity', type: 'future' },
  { id: 'c10_magnetism', x: 30, y: 85, category: 'Physics', label: 'Magnetism', type: 'future' },
];

const VISUAL_EDGES = [
  // Chem Flow
  { from: 'c10_chem_rxn_full', to: 'c10_acids_bases', type: 'direct' },
  { from: 'c10_chem_rxn_full', to: 'c10_metals', type: 'direct' },
  { from: 'c10_acids_bases', to: 'c10_carbon', type: 'direct' },
  { from: 'c10_metals', to: 'c10_carbon', type: 'direct' },

  // Bio Flow
  { from: 'c10_life_proc', to: 'c10_control', type: 'direct' },
  { from: 'c10_control', to: 'c10_repro', type: 'direct' },
  { from: 'c10_repro', to: 'c10_heredity', type: 'direct' },

  // Physics Flow
  { from: 'c10_light', to: 'c10_human_eye', type: 'direct' },
  { from: 'c10_electricity', to: 'c10_magnetism', type: 'direct' },
  
  // Cross-Domain (The "Deep" Connections)
  { from: 'c10_chem_rxn_full', to: 'c10_life_proc', type: 'cross', label: 'Biochemistry' },
  { from: 'c10_carbon', to: 'c10_life_proc', type: 'cross', label: 'Organic Life' },
  { from: 'c10_electricity', to: 'c10_light', type: 'cross', label: 'EM Waves' },
  { from: 'c10_electricity', to: 'c10_chem_rxn_full', type: 'cross', label: 'Electrolysis' },
];

export const KnowledgeGraphView: React.FC = () => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Chemistry' | 'Physics' | 'Biology'>('All');
  const graphRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax Effect State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (graphRef.current) {
            const rect = graphRef.current.getBoundingClientRect();
            setMousePos({
                x: (e.clientX - rect.left) / rect.width - 0.5,
                y: (e.clientY - rect.top) / rect.height - 0.5
            });
        }
    };
    const el = graphRef.current;
    if (el) el.addEventListener('mousemove', handleMouseMove);
    return () => { if (el) el.removeEventListener('mousemove', handleMouseMove); }
  }, []);

  const getIcon = (cat: string) => {
    if (cat === 'Chemistry') return <Atom size={20} />;
    if (cat === 'Biology') return <Dna size={20} />;
    return <Zap size={20} />;
  };

  const getNodeColor = (cat: string, isFuture: boolean) => {
    if (isFuture) return 'bg-slate-800 border-slate-600 text-slate-400';
    if (cat === 'Chemistry') return 'bg-purple-900/90 border-purple-500 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.4)]';
    if (cat === 'Biology') return 'bg-emerald-900/90 border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.4)]';
    return 'bg-amber-900/90 border-amber-500 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.4)]';
  };

  const getPathColor = (cat: string) => {
      if (cat === 'Chemistry') return '#a855f7';
      if (cat === 'Biology') return '#10b981';
      if (cat === 'Physics') return '#f59e0b';
      return '#64748b';
  };

  // Helper to calculate Bezier Curve
  const getPath = (start: {x: number, y: number}, end: {x: number, y: number}) => {
      const dist = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
      const curvature = dist * 0.5; // Control point offset
      // Create a curve that bends slightly
      return `M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${(start.y + end.y) / 2 - (curvature * 0.2)} ${end.x} ${end.y}`;
  };

  const selectedNodeData = selectedNodeId ? VISUAL_NODES.find(n => n.id === selectedNodeId) : null;
  const realNodeData = selectedNodeId ? CONCEPT_GRAPH.find(n => n.id === selectedNodeId) : null;

  return (
    <div className="w-full animate-[fadeIn_0.5s_ease-out]">
      
      {/* Header */}
      <div className="mb-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                <Share2 size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-900">Neural Knowledge Web</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Visualizing the deep connections across the entire Class 10 science curriculum.
                </p>
            </div>
        </div>

        {/* Filters */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
             {['All', 'Physics', 'Chemistry', 'Biology'].map(f => (
                 <button
                    key={f}
                    onClick={() => setActiveFilter(f as any)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2
                        ${activeFilter === f ? 'bg-white shadow-sm text-indigo-900' : 'text-gray-500 hover:text-gray-700'}
                    `}
                 >
                    {f === 'All' && <Layers size={14} />}
                    {f}
                 </button>
             ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* The Graph Canvas - Dark/Sci-Fi Theme */}
        <div 
            ref={graphRef}
            className="lg:col-span-2 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl relative h-[600px] overflow-hidden group perspective-1000"
        >
            
            {/* Background Grid & Stars */}
            <div className="absolute inset-0 opacity-20" 
                 style={{ 
                     backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', 
                     backgroundSize: '40px 40px',
                     transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` // Parallax Background
                 }}>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)] pointer-events-none"></div>
            
            {/* SVG Layer for Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                <defs>
                    <linearGradient id="grad-chem" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
                    </linearGradient>
                     {/* Glow Filters */}
                     <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {VISUAL_EDGES.map((conn, idx) => {
                    const startNode = VISUAL_NODES.find(n => n.id === conn.from);
                    const endNode = VISUAL_NODES.find(n => n.id === conn.to);
                    if (!startNode || !endNode) return null;

                    // Filter Logic
                    if (activeFilter !== 'All' && startNode.category !== activeFilter && endNode.category !== activeFilter) {
                        return null;
                    }

                    // Hover/Focus Logic
                    const isDimmed = (hoveredNodeId && hoveredNodeId !== conn.from && hoveredNodeId !== conn.to) ||
                                     (selectedNodeId && selectedNodeId !== conn.from && selectedNodeId !== conn.to);

                    const pathD = getPath(
                        {x: startNode.x * 10, y: startNode.y * 10}, // Scaling 0-100 to approx SVG coord space assuming 1000x1000 viewBox concept
                        {x: endNode.x * 10, y: endNode.y * 10}
                    );
                    
                    const color = conn.type === 'cross' ? '#fff' : getPathColor(startNode.category);

                    return (
                        <g key={idx} style={{ opacity: isDimmed ? 0.1 : 1, transition: 'opacity 0.3s' }}>
                            {/* The Path Line */}
                            <path 
                                d={`M ${startNode.x}% ${startNode.y}% Q ${(startNode.x + endNode.x) / 2}% ${(startNode.y + endNode.y) / 2 + (conn.type === 'cross' ? 10 : 0)}% ${endNode.x}% ${endNode.y}%`}
                                fill="none"
                                stroke={color}
                                strokeWidth={conn.type === 'cross' ? 1 : 2}
                                strokeDasharray={conn.type === 'cross' ? '5,5' : '0'}
                                className="transition-all duration-500"
                            />

                            {/* Animated Particle for "Neural Impulse" */}
                            {!isDimmed && (
                                <circle r="3" fill="#fff">
                                    <animateMotion 
                                        dur={conn.type === 'cross' ? "4s" : "2s"} 
                                        repeatCount="indefinite"
                                        path={`M ${startNode.x * 8} ${startNode.y * 6} Q ${(startNode.x + endNode.x) / 2 * 8} ${(startNode.y + endNode.y) / 2 * 6} ${endNode.x * 8} ${endNode.y * 6}`} // Approx path for animation
                                    >
                                        <mpath href={`#path-${idx}`} /> {/* Simplified: In real implementation, matching path data exactly is tricky in React without IDs. Using CSS animation on the stroke is easier. */}
                                    </animateMotion>
                                    {/* CSS Alternative for pulsing line */}
                                </circle>
                            )}

                             {/* Connection Label */}
                             {conn.label && !isDimmed && (
                                <foreignObject x={`${(startNode.x + endNode.x)/2 - 5}%`} y={`${(startNode.y + endNode.y)/2}%`} width="80" height="20">
                                    <div className="bg-slate-900/80 text-[8px] text-white px-1 rounded border border-slate-700 text-center backdrop-blur-sm">
                                        {conn.label}
                                    </div>
                                </foreignObject>
                             )}
                        </g>
                    );
                })}
            </svg>

            {/* HTML Layer for Nodes */}
            {VISUAL_NODES.map((node) => {
                // Filter Logic
                if (activeFilter !== 'All' && node.category !== activeFilter) return null;

                const isFuture = node.type === 'future';
                const isHovered = hoveredNodeId === node.id;
                const isSelected = selectedNodeId === node.id;
                const isDimmed = (hoveredNodeId && hoveredNodeId !== node.id) || (selectedNodeId && selectedNodeId !== node.id);

                return (
                    <div 
                        key={node.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 cursor-pointer z-10"
                        style={{ 
                            left: `${node.x}%`, 
                            top: `${node.y}%`, 
                            opacity: isDimmed ? 0.3 : 1,
                            transform: `translate(-50%, -50%) translate(${mousePos.x * -10}px, ${mousePos.y * -10}px) scale(${isHovered ? 1.1 : 1})`
                        }}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                    >
                        {/* Orbit Animation for selected node */}
                        {isSelected && (
                            <div className="absolute inset-0 -m-4 border border-dashed border-white/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                        )}

                        <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 backdrop-blur-md
                            ${getNodeColor(node.category, isFuture)} 
                            ${isSelected ? 'ring-4 ring-white/20' : ''}`}
                        >
                            {getIcon(node.category)}
                            
                            {/* Inner Glow Pulse */}
                            {!isFuture && (
                                <div className="absolute inset-0 bg-current opacity-20 rounded-full animate-ping"></div>
                            )}
                        </div>
                        
                        {/* Label */}
                        <div className={`absolute top-20 left-1/2 -translate-x-1/2 w-32 text-center transition-all duration-300 pointer-events-none`}>
                            <div className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm
                                ${isFuture ? 'bg-slate-800/80 border-slate-700 text-slate-400' : 'bg-white/90 border-white text-slate-900 shadow-lg'}
                            `}>
                                {node.label}
                            </div>
                        </div>
                    </div>
                );
            })}
            
            {/* Legend / Instructions */}
            <div className="absolute bottom-6 left-6 text-xs text-slate-500 bg-slate-900/80 p-3 rounded-xl border border-slate-800 backdrop-blur pointer-events-none">
                <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Chemistry</div>
                <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Biology</div>
                <div className="flex items-center gap-2 mb-3"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Physics</div>
                <div className="opacity-50 text-[10px]">Scroll or Drag to Pan (Coming Soon)</div>
            </div>

        </div>

        {/* Info Panel - Deep Dive */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 flex flex-col h-[600px] shadow-lg relative overflow-hidden">
            {/* Decorative BG */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-[100px] pointer-events-none"></div>

            {selectedNodeId ? (
                <div className="animate-[slideIn_0.3s_ease-out] relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border mb-2 inline-block
                                ${selectedNodeData?.category === 'Chemistry' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                  selectedNodeData?.category === 'Biology' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                {selectedNodeData?.category}
                            </span>
                            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                                {selectedNodeData?.label}
                            </h3>
                        </div>
                        <button onClick={() => setSelectedNodeId(null)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {realNodeData ? (
                        <>
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6 shadow-inner">
                                <h4 className="font-bold text-indigo-900 mb-2 text-sm flex items-center gap-2">
                                    <Info size={16} /> Core Concept
                                </h4>
                                <p className="text-indigo-800 text-sm leading-relaxed">
                                    {realNodeData.description}
                                </p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-xs font-bold text-gray-500 uppercase">XP Value</span>
                                    <span className="font-bold text-gray-900">{realNodeData.xpValue} XP</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Prerequisites</span>
                                    <span className="font-bold text-gray-900">{realNodeData.prerequisites.length || 'None'}</span>
                                </div>
                            </div>
                            
                            <div className="mt-auto">
                                <h4 className="font-bold text-gray-900 mb-3 text-sm">Micro-Note (Cheat Sheet)</h4>
                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-xs text-gray-700 font-medium italic relative">
                                    <Sparkles size={12} className="absolute top-2 right-2 text-yellow-500" />
                                    "{realNodeData.microNote}"
                                </div>
                                <button className="w-full mt-4 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2">
                                    Start Chapter <Share2 size={16} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                            <Orbit size={48} className="mb-4 text-gray-400 animate-spin-slow" />
                            <h4 className="text-lg font-bold text-gray-700">Future Roadmap</h4>
                            <p className="text-sm text-gray-500 mt-2 max-w-xs">
                                This concept is part of the advanced Class 10 curriculum. Master the core nodes first to unlock this pathway.
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col h-full justify-center items-center text-center text-gray-400 p-8">
                    <div className="bg-indigo-50 p-6 rounded-full mb-6 animate-pulse">
                        <MousePointerClick size={40} className="text-indigo-400" />
                    </div>
                    <h4 className="text-gray-900 font-bold text-lg mb-2">Deep Interactive Explorer</h4>
                    <p className="font-medium text-sm leading-relaxed max-w-xs mb-6">
                        Select a node to reveal detailed metrics, secret micro-notes, and learning pathways.
                    </p>
                    <div className="flex gap-2 text-xs font-mono bg-gray-100 px-3 py-1 rounded">
                        <span>NODES: {VISUAL_NODES.length}</span>
                        <span>|</span>
                        <span>EDGES: {VISUAL_EDGES.length}</span>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
