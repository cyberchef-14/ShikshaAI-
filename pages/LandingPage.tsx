import React from 'react';
import { GraduationCap, School, Building2, Sparkles, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

export const LandingPage: React.FC<{ onLogin: (role: UserRole) => void }> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        
        {/* Left Column: Brand Identity */}
        <div className="space-y-8 text-center lg:text-left animate-[fadeIn_0.5s_ease-out]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles size={12} className="text-blue-500" />
            <span>Class 9-10 Adaptive Learning</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
              Shiksha<span className="text-blue-600">AI</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Empowering government schools with personalized, AI-driven education. No student left behind.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-8 pt-4">
            <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className={`w-12 h-12 rounded-full border-4 border-slate-50 bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 z-${10-i}`}>
                    {String.fromCharCode(64+i)}
                 </div>
               ))}
            </div>
            <div>
              <p className="font-bold text-slate-900">1.2 Million+</p>
              <p className="text-sm text-slate-500">Students Impacted</p>
            </div>
          </div>
        </div>

        {/* Right Column: Role Selection */}
        <div className="w-full max-w-md mx-auto lg:ml-auto space-y-4 animate-[fadeIn_0.7s_ease-out]">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 text-center lg:text-left">Select your Portal</p>
          
          {/* Student Button */}
          <button 
            onClick={() => onLogin('student')}
            className="w-full group bg-white hover:bg-blue-600 p-4 rounded-2xl border border-slate-200 hover:border-blue-600 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center text-left"
          >
            <div className="w-14 h-14 bg-blue-50 group-hover:bg-white/20 rounded-xl flex items-center justify-center text-blue-600 group-hover:text-white transition-colors">
              <GraduationCap size={28} />
            </div>
            <div className="ml-5 flex-1">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-white">Student</h3>
              <p className="text-sm text-slate-500 group-hover:text-blue-100">Access personalized curriculum</p>
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-white opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
          </button>

          {/* Teacher Button */}
          <button 
            onClick={() => onLogin('teacher')}
            className="w-full group bg-white hover:bg-emerald-600 p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center text-left"
          >
            <div className="w-14 h-14 bg-emerald-50 group-hover:bg-white/20 rounded-xl flex items-center justify-center text-emerald-600 group-hover:text-white transition-colors">
              <School size={28} />
            </div>
            <div className="ml-5 flex-1">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-white">Teacher</h3>
              <p className="text-sm text-slate-500 group-hover:text-emerald-100">Manage class analytics</p>
            </div>
             <ArrowRight className="text-slate-300 group-hover:text-white opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
          </button>

          {/* Official Button */}
          <button 
            onClick={() => onLogin('official')}
            className="w-full group bg-white hover:bg-orange-600 p-4 rounded-2xl border border-slate-200 hover:border-orange-600 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center text-left"
          >
            <div className="w-14 h-14 bg-orange-50 group-hover:bg-white/20 rounded-xl flex items-center justify-center text-orange-600 group-hover:text-white transition-colors">
              <Building2 size={28} />
            </div>
            <div className="ml-5 flex-1">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-white">Official</h3>
              <p className="text-sm text-slate-500 group-hover:text-orange-100">View district reports</p>
            </div>
             <ArrowRight className="text-slate-300 group-hover:text-white opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
          </button>

          <div className="pt-6 text-center lg:text-left">
             <p className="text-xs text-slate-400 font-medium">
               Ministry of Education • Government of India
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};