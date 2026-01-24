import React, { useState } from 'react';
import { ConceptNode, StudentDigitalTwin } from '../types';
import { Users, BookOpen, Lightbulb, ArrowRight, MessageSquare, Sparkles, AlertCircle, CheckCircle, X, Brain, Loader2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { generateQuizForTopic } from '../services/geminiService';

interface TeacherCoPilotProps {
  students: StudentDigitalTwin[];
  curriculum: ConceptNode[];
  onRefreshData: () => void;
}

export const TeacherCoPilot: React.FC<TeacherCoPilotProps> = ({ students, curriculum, onRefreshData }) => {
  const [selectedConcept, setSelectedConcept] = useState<string>(curriculum[0].id);
  const [showAnalogy, setShowAnalogy] = useState(false);
  
  // Interactive States
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<string | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [revisionModeActive, setRevisionModeActive] = useState(false);

  // 1. Identify Struggling Students
  const strugglingStudents = students.filter(s => {
      const avgMastery = Object.values(s.masteryMap).reduce((a, b) => a + b, 0) / Math.max(1, Object.values(s.masteryMap).length);
      return avgMastery < 0.6 || s.confusionPoints.length > 0;
  });

  // 2. Determine Revision Topic (Lowest Class Average)
  let lowestAvg = 1.0;
  let revisionTopicId = curriculum[0].id;

  curriculum.forEach(concept => {
      let total = 0;
      students.forEach(s => total += (s.masteryMap[concept.id] || 0));
      const avg = total / Math.max(1, students.length);
      if (avg < lowestAvg) {
          lowestAvg = avg;
          revisionTopicId = concept.id;
      }
  });
  
  const revisionTopic = curriculum.find(c => c.id === revisionTopicId);

  // ACTIONS
  const handleAssignTask = async (studentId: string) => {
      setAssigningId(studentId);
      // Simulate API call / Database update
      setTimeout(() => {
          // Remove confusion points to simulate "Task Assigned & Issue Resolved" for the demo
          storageService.updateStudentData(studentId, { confusionPoints: [] });
          onRefreshData(); // Refresh parent data
          setAssigningId(null);
      }, 1000);
  };

  const handleGenerateQuiz = async () => {
      if (!revisionTopic) return;
      setIsGeneratingQuiz(true);
      const quizContent = await generateQuizForTopic(revisionTopic.title, 'Medium');
      setGeneratedQuiz(quizContent);
      setIsGeneratingQuiz(false);
  };

  const handleStartRevision = () => {
      setRevisionModeActive(true);
      setTimeout(() => setRevisionModeActive(false), 3000); // Auto hide after 3s for demo
  };

  // Mock Analogies for "How to explain better"
  const analogies: Record<string, string> = {
      'c10_chem_rxn_full': "Think of a Chemical Reaction like baking a cake. You have ingredients (reactants) like flour and eggs. Once you bake them (reaction), you get a cake (product). You can't turn the cake back into raw eggs! That's a chemical change.",
      'c10_acids_bases': "Imagine Acids as 'Givers' (they give H+ ions) and Bases as 'Takers' (they take H+ ions). Or use the 'Red Danger' analogy: Acids turn litmus Red (danger/burn), while Bases turn it Blue (cool/soapy).",
      'c10_life_proc': "Explain the heart like a double-pump system in a building. One pump pushes used water to the filter (lungs), and the other pushes clean water to the apartments (body cells).",
      'c10_light': "Reflection is like a ball bouncing off a wall. Refraction is like a car driving from smooth road (air) into mud (glass) - one wheel slows down first, causing the car to turn."
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out] relative">
        
        {/* REVISION MODE OVERLAY */}
        {revisionModeActive && (
            <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
                <Brain size={24} />
                <span className="font-bold text-lg">Classroom Revision Mode Activated!</span>
            </div>
        )}

        {/* QUIZ MODAL */}
        {generatedQuiz && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-[fadeIn_0.2s_ease-out]">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-orange-50 rounded-t-2xl">
                        <h3 className="font-bold text-xl text-orange-900 flex items-center gap-2">
                            <Sparkles size={20} className="text-orange-500"/> AI Generated Quiz
                        </h3>
                        <button onClick={() => setGeneratedQuiz(null)} className="p-2 hover:bg-white/50 rounded-full">
                            <X size={20} className="text-gray-500"/>
                        </button>
                    </div>
                    <div className="p-8 overflow-y-auto whitespace-pre-wrap font-mono text-sm bg-gray-50 text-gray-700">
                        {generatedQuiz}
                    </div>
                    <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
                        <button onClick={() => setGeneratedQuiz(null)} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg">Discard</button>
                        <button onClick={() => { setGeneratedQuiz(null); alert('Quiz Sent to Student Devices!'); }} className="px-6 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700">
                            Distribute to Class
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
                <div className="flex items-center gap-2 mb-2 text-indigo-200 uppercase tracking-widest text-xs font-bold">
                    <Sparkles size={14} /> AI Teaching Assistant
                </div>
                <h2 className="text-3xl font-bold mb-2">Good Morning, Teacher!</h2>
                <p className="text-indigo-100 max-w-xl leading-relaxed">
                    I've analyzed yesterday's quiz data. You have <strong className="text-white">{strugglingStudents.length} students</strong> needing attention, and the class is struggling with <strong className="text-white">{revisionTopic?.title}</strong>.
                </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl min-w-[200px] text-center">
                 <div className="text-3xl font-bold">{Math.round(lowestAvg * 100)}%</div>
                 <div className="text-xs text-indigo-200">Class Avg on Weakest Topic</div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* CARD 1: WHO NEEDS HELP */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Focus Group</h3>
                        <p className="text-xs text-gray-500">Students requiring immediate intervention</p>
                    </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto max-h-64 pr-2">
                    {strugglingStudents.map(student => (
                        <div key={student.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{student.name}</p>
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                       <AlertCircle size={10} /> {student.confusionPoints.length || 1} Concepts Stuck
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleAssignTask(student.id)}
                                disabled={assigningId === student.id}
                                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2
                                    ${assigningId === student.id 
                                        ? 'bg-gray-100 text-gray-400 cursor-wait' 
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                                    }`}
                            >
                                {assigningId === student.id ? 'Assigning...' : 'Assign Remedial'}
                            </button>
                        </div>
                    ))}
                    {strugglingStudents.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <CheckCircle size={32} className="mb-2 text-green-500" />
                            <p className="font-medium">All students are on track!</p>
                            <p className="text-xs">No critical gaps detected.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* CARD 2: WHAT TO REVISE */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Revision Priority</h3>
                        <p className="text-xs text-gray-500">Recommended topic for today's class</p>
                    </div>
                </div>
                
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-4 flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-orange-900 text-xl mb-1">{revisionTopic?.title}</h4>
                            <p className="text-orange-700 text-sm mb-4">{revisionTopic?.description}</p>
                        </div>
                        <span className="bg-white text-orange-600 px-2 py-1 rounded text-xs font-bold shadow-sm">
                            Avg: {Math.round(lowestAvg * 100)}%
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                         <button 
                            onClick={handleGenerateQuiz}
                            disabled={isGeneratingQuiz}
                            className="bg-white text-orange-700 font-bold py-3 rounded-xl text-sm shadow-sm hover:bg-orange-100 transition flex items-center justify-center gap-2 disabled:opacity-70"
                         >
                            {isGeneratingQuiz ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            {isGeneratingQuiz ? 'Generating...' : 'Generate Quiz'}
                         </button>
                         <button 
                            onClick={handleStartRevision}
                            className="bg-orange-600 text-white font-bold py-3 rounded-xl text-sm shadow-sm hover:bg-orange-700 transition flex items-center justify-center gap-2"
                         >
                            <Brain size={16} /> Start Revision
                         </button>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h5 className="font-bold text-gray-700 text-xs uppercase mb-2">Why this topic?</h5>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        35% of class scored below average on "{revisionTopic?.title}".
                    </div>
                </div>
            </div>

            {/* CARD 3: HOW TO EXPLAIN BETTER (Full Width) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Lightbulb size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Pedagogy Co-Pilot</h3>
                        <p className="text-xs text-gray-500">Generate creative analogies and explanations</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3 space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Select Concept</label>
                        <select 
                            value={selectedConcept}
                            onChange={(e) => { setSelectedConcept(e.target.value); setShowAnalogy(false); }}
                            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                            {curriculum.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                        <button 
                            onClick={() => setShowAnalogy(true)}
                            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            <Sparkles size={18} /> Generate Insight
                        </button>
                    </div>

                    <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 p-6 relative min-h-[160px] flex items-center">
                        {!showAnalogy ? (
                             <div className="text-center w-full text-gray-400">
                                 <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
                                 <p className="text-sm">Select a concept and click generate to see AI teaching tips.</p>
                             </div>
                        ) : (
                            <div className="animate-[fadeIn_0.5s_ease-out]">
                                <div className="absolute top-4 left-4 bg-white border border-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                    <Lightbulb size={12} /> Pro Analogy
                                </div>
                                <p className="text-gray-800 text-lg leading-relaxed pt-6 font-medium">
                                    "{analogies[selectedConcept] || "Break this down into 3 simple steps. Use real-world examples."}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};
