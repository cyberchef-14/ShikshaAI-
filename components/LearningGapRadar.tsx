import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { useStudent } from '../context/StudentContext';

export const LearningGapRadar: React.FC = () => {
  const { digitalTwin } = useStudent();

  const data = Object.entries(digitalTwin.masteryMap).map(([key, value]) => ({
    subject: key.split('_').join(' '),
    A: (value as number) * 100,
    fullMark: 100,
  }));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Digital Twin Knowledge Map</h3>
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
                name="Student Mastery"
                dataKey="A"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="#3b82f6"
                fillOpacity={0.4}
            />
            <Tooltip />
            </RadarChart>
        </ResponsiveContainer>
    </div>
  );
};