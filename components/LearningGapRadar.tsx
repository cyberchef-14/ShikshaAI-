import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { useStudent } from '../context/StudentContext';
import { CONCEPT_GRAPH } from '../data/curriculum';

export const LearningGapRadar: React.FC = () => {
  const { digitalTwin } = useStudent();

  const data = CONCEPT_GRAPH.map(node => {
      const score = digitalTwin.masteryMap[node.id] || 0;
      return {
          subject: node.title.split(' ')[0], // Short name
          A: Math.round(score * 100),
          fullMark: 100,
          rawScore: score
      };
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Mastery Landscape</h3>
        <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                    name="My Mastery"
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
        <div className="mt-2 text-center text-xs text-gray-400">
            Current Knowledge Footprint
        </div>
    </div>
  );
};