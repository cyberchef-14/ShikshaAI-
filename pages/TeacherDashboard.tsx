import React, { useState, useEffect } from 'react';
import { Users, BookOpen, AlertCircle, TrendingUp, Bell, Search, ArrowLeft, ChevronRight, X, Activity, Brain, LayoutDashboard, Sparkles, Clock, RefreshCw, Gauge, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { CONCEPT_GRAPH } from '../data/curriculum';
import { TeacherCoPilot } from '../components/TeacherCoPilot';
import { storageService } from '../services/storageService';
import { generateStudentAnalysis } from '../services/geminiService';
import { StudentDigitalTwin, ActivityLog } from '../types';

interface TeacherDashboardProps {
  onBack: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'copilot'>('overview');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [classStudents, setClassStudents] = useState<StudentDigitalTwin[]>([]);
  const [recentActivities, setRecentActivities] = useState<(ActivityLog & { studentName: string })[]>([]);
  
  // AI Analysis State
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Function to refresh data from storage
  const loadData = () => {
    const students = storageService.getAllStudents();
    setClassStudents(students);

    // Aggregate recent activities
    const allActivities: (ActivityLog & { studentName: string })[] = [];
    students.forEach(s => {
        s.recentActivities.forEach(a => {
            allActivities.push({ ...a, studentName: s.name });
        });
    });
    // Sort by timestamp desc
    allActivities.sort((a, b) => b.timestamp - a.timestamp);
    setRecentActivities(allActivities.slice(0, 10)); // Top 10
  };

  // Real-time Polling & Event Listener
  useEffect(() => {
    loadData(); // Initial load

    // Poll every 2 seconds to simulate real-time updates from student devices
    const interval = setInterval(() => {
        loadData();
    }, 2000);

    // Also listen for local storage events (cross-tab)
    const handleStorageChange = () => loadData();
    window.addEventListener('storage', handleStorageChange);

    return () => {
        clearInterval(interval);
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const selectedStudent = classStudents.find(s => s.id === selectedStudentId);

  // Generate AI Report for Student
  const handleGenerateReport = async () => {
      if (!selectedStudent) return;
      setIsGeneratingReport(true);
      const report = await generateStudentAnalysis(selectedStudent);
      setAiReport(report);
      setIsGeneratingReport(false);
  };

  // Helper for Heatmap Colors
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-emerald-500';
    if (score >= 0.5) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  // Prepare Radar Data for Selected Student
  const radarData = selectedStudent ? CONCEPT_GRAPH.map(concept => ({
    subject: concept.title.split(':')[0], // Short name
    A: (selectedStudent.masteryMap[concept.id] || 0) * 100,
    fullMark: 100
  })) : [];

  // Calculate Class Average
  const calculateClassAvg = () => {
      if (classStudents.length === 0) return 0;
      let totalScore = 0;
      let count = 0;
      classStudents.forEach(s => {
          Object.values(s.masteryMap).forEach(v => {
              totalScore += v;
              count++;
          });
      });
      return count === 0 ? 0 : Math.round((totalScore / count) * 100);
  };

  const classAvg = calculateClassAvg();
  const criticalGaps = classStudents.filter(s => s.confusionPoints.length > 0).length;

  // New Analytics: Learning Intensity Distribution
  const getIntensityStats = () => {
    let easy = 0, standard = 0, hard = 0;
    classStudents.forEach(s => {
       const lvl = s.difficultyLevel || 50;
       if (lvl < 33) easy++;
       else if (lvl < 66) standard++;
       else hard++;
    });
    return [
        { name: 'Foundations', count: easy, fill: '#10b981' },
        { name: 'Standard', count: standard, fill: '#3b82f6' },
        { name: 'Challenger', count: hard, fill: '#a855f7' }
    ];
  };
  const intensityData = getIntensityStats();

  // New Analytics: Learning Style Distribution
  const learningStyleData = [
      { name: 'Visual', value: classStudents.filter(s => s.learningStyle === 'visual').length, fill: '#f59e0b' },
      { name: 'Textual', value: classStudents.filter(s => s.learningStyle === 'textual').length, fill: '#6366f1' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            title="Back to Login"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <BookOpen className="text-emerald-600" size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-gray-800 leading-none">ShikshaAI <span className="text-emerald-600 font-normal">Educator</span></h1>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Class 10-B • Science</p>
            </div>
          </div>
        </div>

        {/* Center Tabs */}
        <div className="hidden md:flex bg-gray-100 p-1 rounded-xl">
             <button 
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <LayoutDashboard size={16} /> Overview
            </button>
            <button 
                onClick={() => setActiveTab('copilot')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'copilot' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Sparkles size={16} /> AI Co-Pilot
            </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full animate-pulse">
             <Activity size={12} /> LIVE SYNC
          </div>
          <Bell className="text-gray-500 cursor-pointer hover:text-emerald-600 transition" />
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200 shadow-sm">
            R
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {activeTab === 'overview' ? (
          <div className="animate-[fadeIn_0.5s_ease-out] space-y-8">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Class Average", val: `${classAvg}%`, icon: TrendingUp, color: "blue" },
                    { label: "Critical Gaps", val: `${criticalGaps}`, icon: AlertCircle, color: "red" },
                    { label: "Active Today", val: `${classStudents.length}/45`, icon: Activity, color: "emerald" },
                    { label: "AI Insights", val: "3 New", icon: Brain, color: "purple" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.val}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SECTION: CLASSROOM HEATMAP (2/3 width) */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Activity className="text-emerald-500" size={20} /> Real-Time Mastery Heatmap
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">Live updates from student devices.</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium">
                            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-500"></div> Mastered</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-yellow-400"></div> Learning</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-400"></div> Critical Gap</div>
                        </div>
                    </div>

                    <div className="overflow-x-auto pb-2">
                        <div className="min-w-[600px]">
                            {/* Header Row */}
                            <div className="flex gap-1 mb-2">
                                <div className="w-40 shrink-0 font-bold text-gray-400 text-xs uppercase tracking-wider px-2">Student Name</div>
                                {CONCEPT_GRAPH.map(concept => (
                                    <div key={concept.id} className="flex-1 min-w-[80px] text-center">
                                        <div className="text-xs font-bold text-gray-600 truncate px-1" title={concept.title}>
                                            {concept.title.split(':')[0]}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Data Rows */}
                            <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {classStudents.map(student => (
                                    <div key={student.id} className="flex items-center gap-1 group hover:bg-gray-50 rounded-lg p-1 transition-colors">
                                        <div className="w-40 shrink-0 font-medium text-gray-700 text-sm px-2 truncate flex items-center gap-2">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${student.id === 's1' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'}`}>
                                                {student.name.charAt(0)}
                                            </div>
                                            {student.name}
                                        </div>
                                        {CONCEPT_GRAPH.map(concept => {
                                            const score = student.masteryMap[concept.id] || 0;
                                            return (
                                                <div key={concept.id} className="flex-1 min-w-[80px] h-8 px-1 relative group/cell">
                                                    <div 
                                                        className={`w-full h-full rounded-md ${getScoreColor(score)} opacity-80 group-hover/cell:opacity-100 transition-all cursor-pointer`}
                                                    ></div>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/cell:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 shadow-xl">
                                                        {Math.round(score * 100)}%
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* LIVE ACTIVITY FEED (1/3 width) */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-full">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock size={20} className="text-blue-500" /> Live Classroom Feed
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[400px]">
                        {recentActivities.map((log) => (
                            <div key={log.id} className="flex gap-3 text-sm animate-[slideIn_0.3s_ease-out]">
                                <div className={`w-2 h-2 mt-2 rounded-full shrink-0 
                                    ${log.type === 'confusion_flagged' ? 'bg-red-500' : 
                                      log.type === 'concept_mastered' ? 'bg-green-500' : 'bg-blue-400'}`}></div>
                                <div>
                                    <p className="font-bold text-gray-800">{log.studentName}</p>
                                    <p className="text-gray-600 leading-tight">{log.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{Math.floor((Date.now() - log.timestamp) / 60000)}m ago</p>
                                </div>
                            </div>
                        ))}
                        {recentActivities.length === 0 && (
                            <p className="text-gray-400 text-sm italic text-center py-10">Waiting for live activity...</p>
                        )}
                    </div>
                </div>
            </div>
            
            {/* SECTION: PEDAGOGICAL ANALYTICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Learning Intensity Distribution */}
                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                     <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Gauge size={20} className="text-purple-500" /> Learning Intensity Distribution
                     </h3>
                     <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={intensityData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                                    {intensityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="bg-purple-50 rounded-lg p-3 mt-2 flex gap-2 items-start">
                        <Brain size={16} className="text-purple-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-purple-800 leading-tight">
                            <strong>Pedagogical Insight:</strong> {intensityData[1].count >= intensityData[0].count ? "Good distribution. Most students are handling standard rigor well." : "High number of students in 'Foundations' mode. Consider reviewing basics."}
                        </p>
                     </div>
                 </div>

                 {/* Learning Style Distribution */}
                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                     <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <PieChartIcon size={20} className="text-orange-500" /> Learning Style Mix
                     </h3>
                     <div className="flex items-center">
                        <div className="h-48 w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={learningStyleData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                        {learningStyleData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{borderRadius: '8px'}} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 space-y-3">
                            {learningStyleData.map((entry, i) => (
                                <div key={i}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: entry.fill}}></div>
                                        <span className="text-sm font-bold text-gray-700">{entry.name}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 ml-5">{entry.value} Students ({Math.round((entry.value/classStudents.length)*100)}%)</div>
                                </div>
                            ))}
                        </div>
                     </div>
                 </div>
            </div>

            {/* SECTION: STUDENT DRILLDOWN */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left: Student Directory */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Student Directory</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {classStudents.map(student => (
                            <div 
                                key={student.id}
                                onClick={() => { setSelectedStudentId(student.id); setAiReport(null); }}
                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md
                                    ${selectedStudentId === student.id 
                                        ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' 
                                        : 'bg-white border-gray-100 hover:border-emerald-200'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs
                                        ${selectedStudentId === student.id ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                                        {student.name.charAt(0)}
                                    </div>
                                    <span className="font-bold text-sm text-gray-800">{student.name}</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-300" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Detailed Profile Panel */}
                <div className="lg:col-span-1">
                    {selectedStudent ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 sticky top-24 animate-[fadeIn_0.3s_ease-out]">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full uppercase">{selectedStudent.rank}</span>
                                        <span className="text-xs text-gray-500">{selectedStudent.xp} XP</span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedStudentId(null)} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Radar Chart */}
                            <div className="h-48 -mx-4 mb-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                        <PolarGrid stroke="#e5e7eb" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar
                                            name="Mastery"
                                            dataKey="A"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            fill="#10b981"
                                            fillOpacity={0.3}
                                        />
                                        <RechartsTooltip />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                             {/* AI Analysis Section */}
                             <div className="mb-4">
                                {!aiReport ? (
                                    <button 
                                        onClick={handleGenerateReport}
                                        disabled={isGeneratingReport}
                                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        {isGeneratingReport ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                        Generate Deep Dive Analysis
                                    </button>
                                ) : (
                                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 animate-[fadeIn_0.5s]">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-purple-900 text-sm flex items-center gap-2"><Brain size={14}/> AI Insights</h4>
                                            <button onClick={() => setAiReport(null)} className="text-purple-400 hover:text-purple-600"><RefreshCw size={12}/></button>
                                        </div>
                                        <div className="text-xs text-purple-800 leading-relaxed whitespace-pre-wrap font-medium">
                                            {aiReport}
                                        </div>
                                    </div>
                                )}
                             </div>

                            {/* Confusion Points List */}
                            <div className="bg-red-50 rounded-xl p-4 mb-4 border border-red-100">
                                <h4 className="font-bold text-red-800 text-sm mb-2 flex items-center gap-2">
                                    <AlertCircle size={14} /> Attention Needed
                                </h4>
                                {selectedStudent.confusionPoints.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1">
                                        {selectedStudent.confusionPoints.map((point, idx) => (
                                            <li key={idx} className="text-xs text-red-700 font-medium">{point}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-red-400 italic">No specific issues detected recently.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-2xl border border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
                            <Users size={40} className="mb-4 opacity-50" />
                            <p className="font-medium">Select a student to view their AI-generated Digital Twin profile.</p>
                        </div>
                    )}
                </div>
            </div>
          </div>
        ) : (
          <TeacherCoPilot students={classStudents} curriculum={CONCEPT_GRAPH} onRefreshData={loadData} />
        )}
      </main>
    </div>
  );
};