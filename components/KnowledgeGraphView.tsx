import React, { useState, useEffect, useRef } from 'react';
import { CONCEPT_GRAPH } from '../data/curriculum';
import { Atom, Dna, Zap, Info, Share2, X, MousePointerClick, Layers, Sparkles, Orbit, Star, BookOpen, AlertTriangle, Lightbulb, ArrowRight, ArrowLeft } from 'lucide-react';

// --- VISUAL DATA DEFINITIONS ---
// Coordinates are percentage based (0-100)

const VISUAL_NODES = [
  // CHEMISTRY (Purple/Pink)
  { id: 'c10_chem_rxn_full', x: 20, y: 50, category: 'Chemistry', label: 'Chemical Rxns', type: 'core' },
  { id: 'c10_acids_bases', x: 30, y: 35, category: 'Chemistry', label: 'Acids & Bases', type: 'core' },
  { id: 'c10_metals', x: 30, y: 65, category: 'Chemistry', label: 'Metals', type: 'core' },
  { id: 'c10_carbon', x: 40, y: 50, category: 'Chemistry', label: 'Carbon Cmpds', type: 'core' },
  { id: 'c10_periodic', x: 15, y: 70, category: 'Chemistry', label: 'Periodic Table', type: 'core' },

  // BIOLOGY (Emerald/Teal)
  { id: 'c10_life_proc', x: 50, y: 20, category: 'Biology', label: 'Life Processes', type: 'core' },
  { id: 'c10_control', x: 60, y: 30, category: 'Biology', label: 'Control & Coord', type: 'core' },
  { id: 'c10_repro', x: 70, y: 20, category: 'Biology', label: 'Reproduction', type: 'core' },
  { id: 'c10_heredity', x: 60, y: 10, category: 'Biology', label: 'Heredity', type: 'core' },
  
  // PHYSICS (Orange/Amber)
  { id: 'c10_light', x: 60, y: 75, category: 'Physics', label: 'Light', type: 'core' },
  { id: 'c10_human_eye', x: 75, y: 65, category: 'Physics', label: 'Human Eye', type: 'core' },
  { id: 'c10_electricity', x: 50, y: 85, category: 'Physics', label: 'Electricity', type: 'core' },
  { id: 'c10_magnetism', x: 40, y: 80, category: 'Physics', label: 'Magnetism', type: 'core' },
  { id: 'c10_sources', x: 80, y: 85, category: 'Physics', label: 'Energy Sources', type: 'core' },

  // CROSS-DISCIPLINARY / ADVANCED (Gray/Future)
  { id: 'env_science', x: 85, y: 40, category: 'Biology', label: 'Our Environment', type: 'future' },
  { id: 'biochem_link', x: 45, y: 35, category: 'Chemistry', label: 'Biochemistry', type: 'node' },
];

const VISUAL_EDGES = [
  // Chem Flow
  { from: 'c10_chem_rxn_full', to: 'c10_acids_bases', type: 'direct' },
  { from: 'c10_chem_rxn_full', to: 'c10_metals', type: 'direct' },
  { from: 'c10_chem_rxn_full', to: 'c10_periodic', type: 'direct' },
  { from: 'c10_acids_bases', to: 'c10_carbon', type: 'direct' },
  { from: 'c10_metals', to: 'c10_carbon', type: 'direct' },
  { from: 'c10_periodic', to: 'c10_metals', type: 'direct' },

  // Bio Flow
  { from: 'c10_life_proc', to: 'c10_control', type: 'direct' },
  { from: 'c10_control', to: 'c10_repro', type: 'direct' },
  { from: 'c10_repro', to: 'c10_heredity', type: 'direct' },
  { from: 'c10_life_proc', to: 'env_science', type: 'direct' },

  // Physics Flow
  { from: 'c10_light', to: 'c10_human_eye', type: 'direct' },
  { from: 'c10_electricity', to: 'c10_magnetism', type: 'direct' },
  { from: 'c10_electricity', to: 'c10_sources', type: 'direct' },
  
  // Cross-Domain (The "Deep" Connections)
  { from: 'c10_chem_rxn_full', to: 'c10_life_proc', type: 'cross', label: 'Metabolism' },
  { from: 'c10_carbon', to: 'c10_life_proc', type: 'cross', label: 'Organic Life' },
  { from: 'c10_control', to: 'c10_electricity', type: 'cross', label: 'Nerve Impulse' },
  { from: 'c10_electricity', to: 'c10_chem_rxn_full', type: 'cross', label: 'Electrolysis' },
  { from: 'c10_light', to: 'c10_control', type: 'cross', label: 'Vision' },
  { from: 'c10_sources', to: 'env_science', type: 'cross', label: 'Impact' },
  { from: 'c10_acids_bases', to: 'c10_life_proc', type: 'cross', label: 'pH in Digestion' }
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

  const selectedNodeData = selectedNodeId ? VISUAL_NODES.find(n => n.id === selectedNodeId) : null;
  const realNodeData = selectedNodeId ? CONCEPT_GRAPH.find(n => n.id === selectedNodeId) : null;
  
  // Calculate relations for the selected node
  const relatedEdges = selectedNodeId 
      ? VISUAL_EDGES.filter(e => e.from === selectedNodeId || e.to === selectedNodeId)
      : [];
  
  const incomingNodes = relatedEdges.filter(e => e.to === selectedNodeId).map(e => VISUAL_NODES.find(n => n.id === e.from));
  const outgoingNodes = relatedEdges.filter(e => e.from === selectedNodeId).map(e => VISUAL_NODES.find(n => n.id === e.to));

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
                    Visualizing <strong>{CONCEPT_GRAPH.length} core concepts</strong>. Click a node to see how it connects.
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
                     <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    {/* Arrow Markers for Directionality */}
                    <marker id="arrowhead-chem" markerWidth="6" markerHeight="6" refX="22" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L6,3 z" fill="#a855f7" />
                    </marker>
                    <marker id="arrowhead-bio" markerWidth="6" markerHeight="6" refX="22" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L6,3 z" fill="#10b981" />
                    </marker>
                    <marker id="arrowhead-phys" markerWidth="6" markerHeight="6" refX="22" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L6,3 z" fill="#f59e0b" />
                    </marker>
                    <marker id="arrowhead-selected" markerWidth="6" markerHeight="6" refX="22" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L6,3 z" fill="#ffffff" />
                    </marker>
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
                    
                    // Logic for highlighting flow
                    let strokeColor = conn.type === 'cross' ? '#ffffff' : getPathColor(startNode.category);
                    let markerId = `url(#arrowhead-${startNode.category === 'Chemistry' ? 'chem' : startNode.category === 'Biology' ? 'bio' : 'phys'})`;
                    let opacity = conn.type === 'cross' ? 0.4 : 0.6;
                    let width = 2;

                    if (selectedNodeId) {
                         if (conn.to === selectedNodeId) {
                             // Incoming Edge (Prerequisite)
                             strokeColor = '#3b82f6'; // Blue for Input
                             opacity = 1;
                             width = 3;
                         } else if (conn.from === selectedNodeId) {
                             // Outgoing Edge (Unlocks)
                             strokeColor = '#22c55e'; // Green for Output
                             opacity = 1;
                             width = 3;
                         } else {
                             // Unrelated
                             opacity = 0.1;
                         }
                    } else if (isDimmed) {
                        opacity = 0.1;
                    }

                    return (
                        <g key={idx} style={{ opacity, transition: 'opacity 0.3s' }}>
                            {/* The Path Line */}
                            <path 
                                d={`M ${startNode.x}% ${startNode.y}% Q ${(startNode.x + endNode.x) / 2}% ${(startNode.y + endNode.y) / 2 + (conn.type === 'cross' ? 10 : 0)}% ${endNode.x}% ${endNode.y}%`}
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth={width}
                                strokeDasharray={conn.type === 'cross' ? '5,5' : '0'}
                                markerEnd={markerId}
                                className="transition-all duration-500"
                            />

                            {/* Animated Particle for "Neural Impulse" only on active paths */}
                            {!isDimmed && (
                                <circle r="3" fill="#fff">
                                    <animateMotion 
                                        dur={conn.type === 'cross' ? "4s" : "3s"} 
                                        repeatCount="indefinite"
                                        path={`M ${startNode.x * 8} ${startNode.y * 6} Q ${(startNode.x + endNode.x) / 2 * 8} ${(startNode.y + endNode.y) / 2 * 6} ${endNode.x * 8} ${endNode.y * 6}`} // Approx path for animation
                                    >
                                        <mpath href={`#path-${idx}`} /> 
                                    </animateMotion>
                                </circle>
                            )}

                             {/* Connection Label */}
                             {conn.label && !isDimmed && (
                                <foreignObject x={`${(startNode.x + endNode.x)/2 - 5}%`} y={`${(startNode.y + endNode.y)/2}%`} width="80" height="20">
                                    <div className="bg-slate-900/90 text-[8px] text-white px-1 rounded border border-slate-700 text-center backdrop-blur-md shadow-lg">
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
                
                // Highlight connected nodes if a node is selected
                const isConnected = selectedNodeId && (
                    node.id === selectedNodeId || 
                    VISUAL_EDGES.some(e => (e.from === selectedNodeId && e.to === node.id) || (e.to === selectedNodeId && e.from === node.id))
                );

                const isDimmed = (hoveredNodeId && hoveredNodeId !== node.id) || (selectedNodeId && !isConnected);

                return (
                    <div 
                        key={node.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 cursor-pointer z-10"
                        style={{ 
                            left: `${node.x}%`, 
                            top: `${node.y}%`, 
                            opacity: isDimmed ? 0.3 : 1,
                            transform: `translate(-50%, -50%) translate(${mousePos.x * -10}px, ${mousePos.y * -10}px) scale(${isHovered || isSelected ? 1.15 : 1})`,
                            zIndex: isSelected ? 50 : 10
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
                            ${isSelected ? 'ring-4 ring-white/50 shadow-[0_0_30px_rgba(255,255,255,0.3)]' : ''}`}
                        >
                            {getIcon(node.category)}
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
        </div>

        {/* Info Panel - Deep Dive */}
        <div className="bg-white rounded-3xl border border-gray-200 flex flex-col h-[600px] shadow-lg relative overflow-hidden group">
            {selectedNodeId && realNodeData ? (
                <div className="flex flex-col h-full animate-[slideIn_0.3s_ease-out] relative z-10">
                    
                    {/* Header with Title and Close */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 backdrop-blur-md sticky top-0 z-20">
                        <div className="flex justify-between items-start mb-2">
                             <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                ${selectedNodeData?.category === 'Chemistry' ? 'bg-purple-100 text-purple-700' :
                                  selectedNodeData?.category === 'Biology' ? 'bg-emerald-100 text-emerald-700' :
                                  'bg-orange-100 text-orange-700'}`}>
                                {getIcon(selectedNodeData?.category || 'Physics')} {selectedNodeData?.category}
                             </div>
                             <button onClick={() => setSelectedNodeId(null)} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                                <X size={18} className="text-gray-500" />
                            </button>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2">{realNodeData.title}</h3>
                        <p className="text-sm text-gray-600 leading-snug">{realNodeData.description}</p>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        
                        {/* 0. Neural Connections (NEW) */}
                        <div className="bg-slate-900 rounded-xl p-4 text-white shadow-lg">
                            <h4 className="font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2 text-slate-400">
                                <Orbit size={14} /> Neural Connections
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center gap-1 text-[10px] text-blue-400 font-bold mb-1 uppercase">
                                        <ArrowRight size={12} /> Incoming Signals
                                    </div>
                                    <div className="space-y-1">
                                        {incomingNodes.length > 0 ? incomingNodes.map((n, i) => (
                                            <div key={i} className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">{n?.label}</div>
                                        )) : <span className="text-xs text-slate-600 italic">None (Foundation)</span>}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 text-[10px] text-green-400 font-bold mb-1 uppercase">
                                        <ArrowLeft size={12} className="rotate-180"/> Outgoing Signals
                                    </div>
                                    <div className="space-y-1">
                                        {outgoingNodes.length > 0 ? outgoingNodes.map((n, i) => (
                                            <div key={i} className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">{n?.label}</div>
                                        )) : <span className="text-xs text-slate-600 italic">None (End Node)</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 1. Quick Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="text-xs text-gray-400 font-bold uppercase">XP Value</div>
                                <div className="text-lg font-black text-gray-800 flex items-center gap-1">
                                    <Star size={16} className="text-yellow-500 fill-yellow-500"/> {realNodeData.xpValue}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="text-xs text-gray-400 font-bold uppercase">Prerequisites</div>
                                <div className="text-lg font-black text-gray-800">
                                    {realNodeData.prerequisites.length > 0 ? realNodeData.prerequisites.length : "None"}
                                </div>
                            </div>
                        </div>

                        {/* 2. Rich Content Sections */}
                        {realNodeData.studyMaterial ? (
                            realNodeData.studyMaterial.map((section, idx) => (
                                <div key={idx} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center gap-2">
                                        {section.icon === 'definition' && <BookOpen size={14} className="text-blue-500"/>}
                                        {section.icon === 'example' && <Lightbulb size={14} className="text-yellow-500"/>}
                                        {section.icon === 'warning' && <AlertTriangle size={14} className="text-red-500"/>}
                                        {section.icon === 'tip' && <Sparkles size={14} className="text-purple-500"/>}
                                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{section.title}</span>
                                    </div>
                                    <div className="p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {section.content}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400 italic text-sm">
                                Detailed study material loading...
                            </div>
                        )}

                        {/* 3. Micro Note (Cheat Sheet) */}
                        <div className="mt-4">
                            <h4 className="font-bold text-gray-900 mb-2 text-xs uppercase flex items-center gap-2">
                                <Sparkles size={14} className="text-purple-500"/> Exam Secret (Cheat Sheet)
                            </h4>
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm text-gray-800 font-medium italic shadow-sm relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400 rounded-l-xl"></div>
                                "{realNodeData.microNote}"
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0 z-20">
                         <button className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                            Go to Chapter <Share2 size={16} />
                        </button>
                    </div>

                </div>
            ) : (
                // Empty State
                <div className="flex flex-col h-full justify-center items-center text-center text-gray-400 p-8">
                    <div className="bg-indigo-50 p-6 rounded-full mb-6 animate-pulse ring-8 ring-indigo-50/50">
                        <MousePointerClick size={40} className="text-indigo-400" />
                    </div>
                    <h4 className="text-gray-900 font-bold text-lg mb-2">Deep Interactive Explorer</h4>
                    <p className="font-medium text-sm leading-relaxed max-w-xs mb-6 text-gray-500">
                        Select any node in the Neural Web to reveal its hidden metadata, connections, and secret cheat sheets.
                    </p>
                    <div className="flex gap-2 text-xs font-mono bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                        <span className="font-bold text-gray-700">NODES: {VISUAL_NODES.length}</span>
                        <span className="text-gray-300">|</span>
                        <span className="font-bold text-gray-700">CONNECTIONS: {VISUAL_EDGES.length}</span>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};