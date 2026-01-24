import React from 'react';

interface AvatarProps {
  state: 'idle' | 'speaking' | 'thinking' | 'concerned' | 'happy';
  message?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ state, message }) => {
  
  const getColor = () => {
    switch(state) {
      case 'concerned': return 'bg-orange-500 shadow-orange-500/50';
      case 'happy': return 'bg-green-500 shadow-green-500/50';
      case 'thinking': return 'bg-purple-500 shadow-purple-500/50';
      default: return 'bg-blue-500 shadow-blue-500/50';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 transition-all duration-500">
      <style>{`
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes talk {
          0% { height: 4px; width: 12px; border-radius: 4px; }
          50% { height: 14px; width: 16px; border-radius: 50%; }
          100% { height: 6px; width: 14px; border-radius: 6px; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Holographic Circle Representation */}
      <div className={`relative mb-6 ${state === 'idle' ? 'animate-[float_6s_ease-in-out_infinite]' : ''}`}>
        {/* Outer Ring */}
        <div className={`w-32 h-32 rounded-full border-4 border-dashed border-opacity-30 animate-[spin_10s_linear_infinite] ${state === 'concerned' ? 'border-orange-400' : 'border-blue-400'}`}></div>
        
        {/* Core Sphere */}
        <div className={`absolute top-0 left-0 w-32 h-32 rounded-full shadow-[0_0_40px] opacity-90 backdrop-blur-sm flex flex-col items-center justify-center transition-colors duration-500 ${getColor()} ${state === 'speaking' ? 'avatar-pulse' : ''}`}>
           
           {/* Face Container */}
           <div className="flex flex-col items-center gap-3 transform translate-y-1">
               
               {/* Eyes */}
               <div className="flex gap-6">
                  <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-300 
                    ${state === 'thinking' ? 'animate-bounce' : ''} 
                    ${state === 'idle' ? 'animate-[blink_4s_infinite]' : ''}
                    ${state === 'happy' ? 'h-2 w-3 rounded-t-full scale-y-[-1]' : ''}
                  `}></div>
                  <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-300 
                    ${state === 'thinking' ? 'animate-bounce delay-100' : ''} 
                    ${state === 'idle' ? 'animate-[blink_4s_infinite]' : ''}
                    ${state === 'happy' ? 'h-2 w-3 rounded-t-full scale-y-[-1]' : ''}
                  `}></div>
               </div>

               {/* Mouth */}
               <div className={`bg-white/90 transition-all duration-300 shadow-sm
                  ${state === 'speaking' ? 'animate-[talk_0.2s_infinite]' : ''}
                  ${state === 'idle' ? 'w-2 h-1 rounded-full opacity-60' : ''}
                  ${state === 'happy' ? 'w-6 h-3 border-b-4 border-white bg-transparent rounded-b-full' : ''}
                  ${state === 'concerned' ? 'w-6 h-1 rounded-full rotate-3' : ''}
                  ${state === 'thinking' ? 'w-2 h-2 rounded-full opacity-80' : ''}
                  ${(state !== 'speaking' && state !== 'happy' && state !== 'concerned' && state !== 'idle' && state !== 'thinking') ? 'w-4 h-1 rounded-full' : ''}
               `}></div>

           </div>
        </div>
      </div>

      {/* Speech Bubble */}
      {message && (
        <div className="glass-panel p-4 rounded-xl rounded-tr-none max-w-sm animate-[fadeIn_0.5s_ease-out]">
          <p className="text-gray-800 text-lg font-medium leading-relaxed">
            {message}
          </p>
        </div>
      )}
    </div>
  );
};