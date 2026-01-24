import React from 'react';
import { ShieldCheck, Scale, Users, AlertTriangle, CheckCircle, Lock, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts';

export const BiasMonitoringPanel = () => {
  // Mock Data: Performance gap closing over months due to AI intervention
  const fairnessData = [
    { month: 'Jan', urban: 78, rural: 65 },
    { month: 'Feb', urban: 79, rural: 68 },
    { month: 'Mar', urban: 80, rural: 72 }, // Intervention starts
    { month: 'Apr', urban: 81, rural: 76 },
    { month: 'May', urban: 82, rural: 79 },
    { month: 'Jun', urban: 82, rural: 81 },
  ];

  const difficultyDistribution = [
    { name: 'Visual Learners', successRate: 85 },
    { name: 'Textual Learners', successRate: 84 }, // Goal: Close to equal
  ];

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
       {/* Header with AI Status */}
       <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center shadow-lg gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="text-emerald-400" /> Bias-Aware AI Watchdog
            </h2>
            <p className="text-indigo-200 text-sm mt-1">Real-time monitoring of algorithmic fairness, content neutrality, and difficulty calibration.</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right">
                 <div className="text-3xl font-bold text-emerald-400">98.5%</div>
                 <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Fairness Score</div>
             </div>
             <div className="h-10 w-px bg-slate-700 hidden md:block"></div>
             <div className="text-right hidden md:block">
                 <div className="text-3xl font-bold text-blue-400">Active</div>
                 <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Audit Status</div>
             </div>
          </div>
       </div>

       {/* Metrics Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Metric 1: Demographic Parity */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
             <div className="mb-4">
                 <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                    <Scale size={16} className="text-indigo-500" /> Demographic Parity Gap
                 </h3>
                 <p className="text-xs text-gray-400 mt-1">Comparing mastery rates: Urban vs. Rural Students</p>
             </div>
             
             <div className="h-48 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fairnessData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                        <XAxis dataKey="month" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                        <YAxis hide domain={[60, 90]} />
                        <Tooltip contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                        <Line type="monotone" dataKey="urban" name="Urban Avg" stroke="#94a3b8" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="rural" name="Rural Avg" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} />
                        <Legend iconType="circle" wrapperStyle={{fontSize: '10px', paddingTop: '10px'}}/>
                    </LineChart>
                </ResponsiveContainer>
             </div>
             
             <div className="mt-4 bg-emerald-50 text-emerald-700 p-2 rounded-lg text-xs font-medium text-center border border-emerald-100">
                <span className="font-bold">Success:</span> Gap reduced by 11% since AI Contextualization update.
             </div>
          </div>

          {/* Metric 2: Content Neutrality */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Users size={16} className="text-blue-500" /> Inclusivity Audit
                </h3>
                <p className="text-xs text-gray-400 mb-4">Scanning generated content for gender, regional, or socioeconomic bias.</p>
              </div>
              
              <div className="space-y-5 my-2">
                  <div>
                      <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                          <span>Gender Neutral Pronouns</span>
                          <span className="text-green-600">100%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className="w-full bg-blue-500 h-full rounded-full"></div></div>
                  </div>
                  <div>
                      <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                          <span>Regional Representation</span>
                          <span className="text-green-600">94%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className="w-[94%] bg-indigo-500 h-full rounded-full"></div></div>
                  </div>
                   <div>
                      <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                          <span>Accessibility Compliance (WCAG)</span>
                          <span className="text-green-600">99%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className="w-[99%] bg-purple-500 h-full rounded-full"></div></div>
                  </div>
              </div>

              <div className="mt-4 flex gap-2">
                   <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
                       <div className="text-xl font-bold text-gray-800">0</div>
                       <div className="text-[10px] text-gray-500 uppercase">Critical Flags</div>
                   </div>
                   <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
                       <div className="text-xl font-bold text-gray-800">14k</div>
                       <div className="text-[10px] text-gray-500 uppercase">Items Scanned</div>
                   </div>
              </div>
          </div>

          {/* Metric 3: Live Alerts & Interventions */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
              <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                 <Activity size={16} className="text-orange-500" /> Active Interventions
              </h3>
              <div className="space-y-3 relative z-10">
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                      <div className="mt-0.5 min-w-[16px]"><AlertTriangle size={16} className="text-yellow-600" /></div>
                      <div>
                          <p className="text-xs font-bold text-gray-800">Difficulty Spike Mitigated</p>
                          <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
                            Chapter 4 (Physics) showed disproportionate failure rate in rural nodes. 
                            <span className="font-semibold block mt-0.5 text-yellow-700">Action: Enabled simplified analogies module.</span>
                          </p>
                      </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="mt-0.5 min-w-[16px]"><CheckCircle size={16} className="text-blue-600" /></div>
                      <div>
                          <p className="text-xs font-bold text-gray-800">Language Model Calibrated</p>
                          <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
                             Hindi dialect support improved for Jaipur region based on voice input analysis.
                          </p>
                      </div>
                  </div>
              </div>
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full mix-blend-multiply filter blur-2xl opacity-50 -mr-10 -mt-10"></div>
          </div>
       </div>

       {/* Difficulty Balance Check */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-gray-900 font-bold text-sm mb-4">Learning Style Success Rate</h3>
                <div className="h-40">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={difficultyDistribution} barSize={20}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="successRate" fill="#3b82f6" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#6b7280', fontSize: 12 }} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 mt-2 italic text-center">
                    AI ensures both Visual and Textual learners have equitable success rates by adapting content formats dynamically.
                </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Lock className="text-slate-400" size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">Policy Compliance</h4>
                        <p className="text-xs text-slate-500">National Education Policy (NEP) 2020</p>
                    </div>
                </div>
                <p className="text-sm font-medium text-slate-600 mb-4 leading-relaxed">
                    System is currently meeting all equity guidelines regarding digital access and linguistic inclusion.
                </p>
                <button className="w-full py-2 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-100 transition-colors">
                    Download Compliance Report (PDF)
                </button>
            </div>
       </div>
    </div>
  );
};
