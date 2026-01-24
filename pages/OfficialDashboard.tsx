import React, { useState } from 'react';
import { Building2, Map, BarChart3, PieChart, Download, Calendar, ArrowLeft, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BiasMonitoringPanel } from '../components/BiasMonitoringPanel';

interface OfficialDashboardProps {
  onBack: () => void;
}

export const OfficialDashboard: React.FC<OfficialDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bias'>('overview');

  // Mock Data for chart
  const data = [
    { name: 'School A', mastery: 85 },
    { name: 'School B', mastery: 72 },
    { name: 'School C', mastery: 64 },
    { name: 'School D', mastery: 90 },
    { name: 'School E', mastery: 55 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-4">
             <button 
                onClick={onBack} 
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                title="Back to Login"
             >
                <ArrowLeft size={20} />
             </button>
            <div className="flex items-center gap-3">
                <div className="bg-orange-600 p-2 rounded-lg text-white">
                    <Building2 size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">District Education Dashboard</h1>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Jaipur District • Rajasthan</p>
                </div>
            </div>
        </div>
        
        {/* Tab Switcher */}
        <div className="hidden md:flex bg-gray-100 p-1 rounded-xl">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <LayoutDashboard size={16} /> Overview
            </button>
            <button 
                onClick={() => setActiveTab('bias')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'bias' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <ShieldCheck size={16} /> AI Fairness & Bias
            </button>
        </div>

        <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium">
                <Download size={16} /> Export Report
             </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10 space-y-8">
        
        {activeTab === 'overview' ? (
            <div className="animate-[fadeIn_0.5s_ease-out] space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Active Students</p>
                                <h3 className="text-4xl font-bold text-gray-900 mt-1">12,450</h3>
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">+12%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-orange-500 h-full w-[75%]"></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">75% Goal Reached</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Avg. District Mastery</p>
                                <h3 className="text-4xl font-bold text-gray-900 mt-1">68.4%</h3>
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">+5.2%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full w-[68%]"></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Compared to last month</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Schools Onboarded</p>
                                <h3 className="text-4xl font-bold text-gray-900 mt-1">42</h3>
                            </div>
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold">Total 50</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full w-[84%]"></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">8 Schools Pending</p>
                    </div>
                </div>

                {/* Charts & Map Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <BarChart3 size={20} className="text-gray-400" />
                            Top Performing Schools (Science Mastery)
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                    <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                                    <Bar dataKey="mastery" fill="#f97316" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Actions / Map Placeholder */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Map size={20} className="text-gray-400" />
                            Priority Zones
                        </h3>
                        <div className="space-y-4">
                            {[
                                { zone: "Zone North", status: "Critical", color: "red" },
                                { zone: "Zone East", status: "Stable", color: "green" },
                                { zone: "Zone West", status: "Improving", color: "yellow" },
                            ].map((z, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">{z.zone}</span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded bg-${z.color}-100 text-${z.color}-700`}>
                                        {z.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-blue-900 mb-1">New Policy Directive</h4>
                            <p className="text-xs text-blue-700 mb-3">
                                NEP 2020: Focus on practical lab assessments for Class 10 started.
                            </p>
                            <button className="text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded hover:bg-blue-700 transition">
                                View Compliance
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <BiasMonitoringPanel />
        )}

      </main>
    </div>
  );
};
