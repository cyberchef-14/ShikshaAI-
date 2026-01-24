import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { CONCEPT_GRAPH, LESSON_CONTENT } from '../data/curriculum';
import { Book, Sparkles, Download, Printer, ChevronRight, Brain, Image as ImageIcon, FileText, AlertCircle } from 'lucide-react';

export const PersonalizedTextbook: React.FC = () => {
  const { digitalTwin } = useStudent();
  const [status, setStatus] = useState<'idle' | 'generating' | 'ready'>('idle');
  const [progress, setProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState("");
  const [activeChapterId, setActiveChapterId] = useState<string>(CONCEPT_GRAPH[0].id);

  // Simulate AI Generation Process
  const handleGenerate = () => {
    setStatus('generating');
    setProgress(0);
    
    const steps = [
      "Analyzing your mastery data...",
      `Adapting content for ${digitalTwin.learningStyle} learning style...`,
      "Identifying weak concepts from recent quizzes...",
      "Compiling custom remedial notes...",
      "Finalizing layout and typography..."
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex >= steps.length) {
        clearInterval(interval);
        setStatus('ready');
      } else {
        setGenerationStep(steps[stepIndex]);
        setProgress(prev => prev + 20);
        stepIndex++;
      }
    }, 800);
  };

  const getChapterContent = (chapterId: string) => {
    const rawSegments = LESSON_CONTENT[chapterId] || [];
    // Filter out mini-games/quizzes for the textbook view, keep explanations
    return rawSegments.filter(s => s.type === 'explanation');
  };

  const activeChapterNode = CONCEPT_GRAPH.find(n => n.id === activeChapterId);

  // RENDER: IDLE STATE (Landing)
  if (status === 'idle') {
    return (
      <div className="w-full h-[600px] flex items-center justify-center animate-[fadeIn_0.5s_ease-out]">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-blue-100 text-center max-w-lg relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
           
           <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
              <Book size={48} className="text-blue-600" />
           </div>
           
           <h2 className="text-3xl font-bold text-gray-900 mb-3">AI Personal Textbook</h2>
           <p className="text-gray-500 mb-8 leading-relaxed">
             Generate a unique textbook tailored specifically to <strong>{digitalTwin.name}</strong>. 
             It adapts explanations to your <strong>{digitalTwin.learningStyle}</strong> style and includes extra notes for topics you find difficult.
           </p>
           
           <div className="bg-gray-50 rounded-xl p-4 mb-8 text-sm text-left space-y-2 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-700">
                <Brain size={16} className="text-purple-500"/> 
                <span>Customized for: <strong>{digitalTwin.learningStyle === 'visual' ? 'Visual Learners (More Diagrams)' : 'Textual Learners (Detailed Notes)'}</strong></span>
              </div>
              {digitalTwin.confusionPoints.length > 0 && (
                <div className="flex items-center gap-2 text-gray-700">
                    <AlertCircle size={16} className="text-red-500"/>
                    <span>Remedial Focus: <strong>{digitalTwin.confusionPoints.length} Concepts</strong></span>
                </div>
              )}
           </div>

           <button 
             onClick={handleGenerate}
             className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
           >
             <Sparkles size={20} /> Generate My Book
           </button>
        </div>
      </div>
    );
  }

  // RENDER: GENERATING STATE
  if (status === 'generating') {
      return (
        <div className="w-full h-[600px] flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-inner">
            <div className="w-20 h-20 mb-8 relative">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto text-blue-500 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Compiling Your Edition...</h3>
            <p className="text-gray-500 text-sm mb-6 min-h-[1.5rem]">{generationStep}</p>
            
            <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
      );
  }

  // RENDER: READY STATE (The Book Viewer)
  return (
    <div className="flex flex-col lg:flex-row h-[800px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 font-serif animate-[fadeIn_0.5s_ease-out]">
        
        {/* Sidebar: Table of Contents */}
        <div className="w-full lg:w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200 bg-white">
                <h1 className="font-bold text-gray-900 text-xl font-sans">ShikshaAI <span className="text-blue-600">SmartBook</span></h1>
                <p className="text-xs text-gray-500 mt-1 font-sans">Edition: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-sans">Table of Contents</h3>
                {CONCEPT_GRAPH.map((chapter, idx) => (
                    <button
                        key={chapter.id}
                        onClick={() => setActiveChapterId(chapter.id)}
                        className={`w-full text-left p-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group
                            ${activeChapterId === chapter.id 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <span className="line-clamp-1">{idx + 1}. {chapter.title}</span>
                        {activeChapterId === chapter.id && <ChevronRight size={14} />}
                    </button>
                ))}
            </div>
            <div className="p-4 border-t border-gray-200 bg-white font-sans">
                <button className="flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium">
                    <Download size={16} /> Download PDF
                </button>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-white relative">
             {/* Paper Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

            <div className="max-w-3xl mx-auto p-10 md:p-16 relative z-10">
                
                {/* Book Header */}
                <div className="mb-12 text-center border-b-2 border-gray-100 pb-8">
                    <span className="text-blue-600 font-bold tracking-widest text-xs uppercase font-sans mb-2 block">Chapter {CONCEPT_GRAPH.findIndex(c => c.id === activeChapterId) + 1}</span>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">{activeChapterNode?.title}</h2>
                    <p className="text-gray-500 italic text-lg">{activeChapterNode?.description}</p>
                    
                    {/* Personalized Foreword per chapter */}
                    <div className="mt-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100 inline-block text-left">
                        <p className="text-sm text-blue-800 font-sans">
                            <span className="font-bold">✨ AI Note for {digitalTwin.name}:</span> This chapter builds on your knowledge of <em>{activeChapterNode?.prerequisites.map(p => CONCEPT_GRAPH.find(n => n.id === p)?.title).join(', ') || 'basic science'}</em>. 
                            {digitalTwin.learningStyle === 'visual' ? " Since you learn best visually, we've prioritized diagrams below." : " We've included detailed textual breakdowns for you."}
                        </p>
                    </div>
                </div>

                {/* Content Generation */}
                <div className="space-y-10 text-gray-800 leading-loose text-lg">
                    {getChapterContent(activeChapterId).map((block, idx) => (
                        <div key={idx} className="group">
                            {/* The Text Content */}
                            <p className="mb-4 first-letter:text-5xl first-letter:font-bold first-letter:text-gray-900 first-letter:mr-1 first-letter:float-left">
                                {block.contentEn}
                            </p>
                            
                            {/* Dynamic Insertion based on Learning Style - Visual */}
                            {digitalTwin.learningStyle === 'visual' && (idx % 2 === 0) && (
                                <div className="my-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                                    <div className="bg-white p-4 rounded-full shadow-sm mb-3 text-blue-500">
                                        <ImageIcon size={32} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-500 font-sans uppercase tracking-wider">Interactive Diagram Generated</span>
                                    <p className="text-xs text-gray-400 font-sans mt-1 max-w-xs">
                                        Visualizing: {block.contentEn.substring(0, 30)}...
                                    </p>
                                </div>
                            )}

                             {/* Dynamic Insertion based on Confusion Points */}
                             {digitalTwin.confusionPoints.includes(activeChapterId) && idx === 1 && (
                                <div className="my-8 bg-red-50 border-l-4 border-red-400 p-6 rounded-r-xl">
                                    <h4 className="font-bold text-red-800 font-sans mb-2 flex items-center gap-2">
                                        <AlertCircle size={18} /> Deep Dive: Remedial Concept
                                    </h4>
                                    <p className="text-sm text-red-700 font-sans">
                                        We noticed you found this tricky earlier. Remember: Break this concept down into smaller steps.
                                        (1) Identify reactants, (2) Check states, (3) Balance atoms.
                                    </p>
                                </div>
                             )}

                            {/* Dynamic Insertion based on Learning Style - Textual */}
                            {digitalTwin.learningStyle === 'textual' && (idx % 2 !== 0) && (
                                <div className="my-6 pl-6 border-l-2 border-gray-300 italic text-gray-600 text-base">
                                    Key Takeaway: {block.contentEn.split('.')[0]}.
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Chapter Footer */}
                <div className="mt-16 pt-8 border-t border-gray-200 text-center font-sans text-gray-400 text-sm">
                    Page {CONCEPT_GRAPH.findIndex(c => c.id === activeChapterId) + 4} • ShikshaAI Generated Material
                </div>

            </div>
        </div>
    </div>
  );
};
