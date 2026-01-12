
import React, { useEffect } from 'react';

interface HorseAnimationProps {
  isRunning: boolean;
  onFinish: () => void;
}

export const HorseAnimation: React.FC<HorseAnimationProps> = ({ isRunning, onFinish }) => {
  // Cấu hình: Chạy 2 vòng.
  const LAPS = 2;
  const LAP_DURATION_MS = 2500; 
  const TOTAL_DURATION = LAPS * LAP_DURATION_MS;

  useEffect(() => {
    if (isRunning) {
      const timer = setTimeout(() => {
        onFinish();
      }, TOTAL_DURATION); 
      return () => clearTimeout(timer);
    }
  }, [isRunning, onFinish, TOTAL_DURATION]);

  return (
    <div className="w-full h-64 relative overflow-hidden flex items-center bg-transparent group">
      
      <style>{`
        @keyframes runAcrossLoop {
          0% { left: -200px; }
          100% { left: 100%; }
        }
        
        /* Gallop: Whole body bounces and rocks */
        @keyframes gallopBody {
          0% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(-5deg); } /* Lên cao, chúc đầu xuống */
          50% { transform: translateY(-5px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(5deg); } /* Lên nhẹ, ngẩng đầu */
          100% { transform: translateY(0) rotate(0deg); }
        }

        /* Head bobbing independently */
        @keyframes headBob {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(5deg); }
        }
        
        /* Tail wagging vigorously */
        @keyframes tailWag {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(25deg); }
            75% { transform: rotate(-15deg); }
        }

        /* Leg animations */
        @keyframes legFront {
            0% { transform: rotate(0deg); }
            30% { transform: rotate(-45deg); } /* Vươn tới trước */
            60% { transform: rotate(10deg); } /* Thu về */
            100% { transform: rotate(0deg); }
        }
        
        @keyframes legBack {
            0% { transform: rotate(0deg); }
            30% { transform: rotate(35deg); } /* Đạp ra sau */
            60% { transform: rotate(-10deg); } /* Co lại */
            100% { transform: rotate(0deg); }
        }

        .horse-wrapper {
          width: 160px;
          height: 160px;
          position: absolute;
          z-index: 10;
          animation: runAcrossLoop ${LAP_DURATION_MS}ms linear ${LAPS};
        }

        .horse-body-container {
          width: 100%;
          height: 100%;
          animation: gallopBody 0.4s ease-in-out infinite;
          transform-origin: center center;
        }
        
        .horse-head {
            transform-box: fill-box;
            transform-origin: 20% 80%; /* Pivot at neck base roughly */
            animation: headBob 0.4s ease-in-out infinite;
            animation-delay: 0.1s; /* Slight offset from body */
        }
        
        .horse-tail {
            transform-box: fill-box;
            transform-origin: top left;
            animation: tailWag 0.3s ease-in-out infinite; /* Faster than gallop */
        }

        .leg-front {
            transform-box: fill-box;
            transform-origin: top center;
            animation: legFront 0.4s ease-in-out infinite;
        }
        
        .leg-back {
            transform-box: fill-box;
            transform-origin: top center;
            animation: legBack 0.4s ease-in-out infinite;
        }

        /* Dust */
        .dust-cloud {
            position: absolute;
            bottom: 10px;
            left: 20px;
            width: 50px;
            height: 20px;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
            animation: dust 0.4s infinite;
            opacity: 0;
            border-radius: 50%;
            z-index: 5;
        }
        
        @keyframes dust {
            0% { transform: scale(0.5) translate(40px, 0); opacity: 0; }
            30% { opacity: 0.8; }
            100% { transform: scale(1.8) translate(-50px, -20px); opacity: 0; }
        }
      `}</style>

      {/* Track */}
      <div className="absolute bottom-12 w-full h-3 bg-yellow-900/20 rounded-full overflow-hidden">
         <div className="w-full h-full bg-yellow-500/10 animate-pulse"></div>
      </div>

      {isRunning ? (
        <div className="horse-wrapper top-16">
            <div className="horse-body-container">
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
                
                {/* TAIL - Layer 1 */}
                <path className="horse-tail" d="M30,105 Q10,95 10,125 Q10,145 40,135 Z" fill="#5D4037" stroke="#3E2723" strokeWidth="2" />

                {/* BACK LEGS - Layer 2 */}
                <g transform="translate(40, 130)">
                    <g className="leg-back" style={{ animationDelay: '0.1s' }}>
                       <path d="M10,0 L0,25 L15,25 L20,0 Z" fill="#FFC857" /> 
                       <path d="M0,25 L15,25 L14,32 L1,32 Z" fill="#3E2723" />
                    </g>
                </g>
                <g transform="translate(60, 135)">
                    <g className="leg-back">
                       <path d="M10,0 L0,20 L15,20 L20,0 Z" fill="#FFC857" />
                       <path d="M0,20 L15,20 L14,27 L1,27 Z" fill="#3E2723" />
                    </g>
                </g>

                {/* BODY - Layer 3 */}
                <ellipse cx="80" cy="110" rx="48" ry="38" fill="#FFC857" />
                <path d="M60,138 Q80,148 100,138" fill="none" stroke="#FCE4B8" strokeWidth="10" strokeLinecap="round" />
                
                {/* Yếm đỏ */}
                <path d="M90,85 Q115,115 125,95 L110,80 Z" fill="#D32F2F" />
                <circle cx="110" cy="105" r="8" fill="#FFD700" stroke="#B8860B" strokeWidth="1" />

                {/* FRONT LEGS - Layer 4 */}
                <g transform="translate(90, 120) rotate(-10)">
                    <g className="leg-front">
                        <path d="M10,0 L0,25 L15,25 L20,0 Z" fill="#FFC857" />
                        <path d="M0,25 L15,25 L14,32 L1,32 Z" fill="#3E2723" />
                    </g>
                </g>
                <g transform="translate(110, 110) rotate(-10)">
                    <g className="leg-front" style={{ animationDelay: '0.2s' }}>
                        <path d="M10,0 L0,25 L15,25 L20,0 Z" fill="#FFC857" />
                        <path d="M0,25 L15,25 L14,32 L1,32 Z" fill="#3E2723" />
                    </g>
                </g>

                {/* HEAD - Layer 5 */}
                <g transform="translate(90, 40)">
                    <g className="horse-head">
                        {/* Bờm */}
                        <path d="M-10,20 Q-25,30 -20,60 L10,50 Z" fill="#5D4037" />
                        
                        {/* Mặt */}
                        <rect x="0" y="0" width="70" height="65" rx="25" ry="25" fill="#FFC857" />
                        <ellipse cx="45" cy="45" rx="22" ry="18" fill="#FFF8E1" />
                        
                        {/* Mũi */}
                        <circle cx="40" cy="40" r="2" fill="#3E2723" />
                        <circle cx="50" cy="40" r="2" fill="#3E2723" />
                        <path d="M38,50 Q45,58 52,50" fill="#D32F2F" stroke="#3E2723" strokeWidth="1" />

                        {/* Má hồng */}
                        <ellipse cx="10" cy="45" rx="6" ry="4" fill="#FFAB91" opacity="0.6" />
                        <ellipse cx="65" cy="40" rx="6" ry="4" fill="#FFAB91" opacity="0.6" />

                        {/* Mắt */}
                        <circle cx="15" cy="30" r="6" fill="#212121" />
                        <circle cx="17" cy="28" r="2" fill="white" />
                        <circle cx="55" cy="30" r="6" fill="#212121" />
                        <circle cx="57" cy="28" r="2" fill="white" />

                        {/* Tóc/Bờm trước */}
                        <path d="M10,5 Q20,-5 35,5 Q50,-5 60,10" fill="#5D4037" stroke="#5D4037" strokeWidth="8" strokeLinecap="round" />
                        
                        {/* Tai */}
                        <path d="M10,5 Q0,-10 15,-10 Z" fill="#FFC857" stroke="#E6A63E" strokeWidth="2" />
                        <path d="M55,5 Q65,-10 50,-10 Z" fill="#FFC857" stroke="#E6A63E" strokeWidth="2" />

                        {/* Hoa mai trên đầu */}
                        <g transform="translate(35, -5)">
                            <circle cx="0" cy="0" r="5" fill="#FF9800" />
                            <circle cx="0" cy="-8" r="5" fill="#FFEB3B" />
                            <circle cx="8" cy="0" r="5" fill="#FFEB3B" />
                            <circle cx="0" cy="8" r="5" fill="#FFEB3B" />
                            <circle cx="-8" cy="0" r="5" fill="#FFEB3B" />
                        </g>
                    </g>
                </g>
              </svg>
            </div>
            
            {/* Dust */}
            <div className="dust-cloud"></div>
            
            {/* Speech bubble - Fixed positioning */}
             <div className="absolute -top-12 -right-8 animate-bounce bg-white border-2 border-red-500 rounded-xl px-3 py-1 shadow-md z-20 min-w-[120px] text-center">
                 <span className="text-xs text-red-600 font-bold whitespace-nowrap">
                    Lộc tới! Lộc tới! 🧧
                 </span>
                 {/* Speech Bubble Arrow */}
                 <div className="absolute bottom-[-6px] left-4 w-3 h-3 bg-white border-b-2 border-r-2 border-red-500 transform rotate-45"></div>
             </div>
        </div>
      ) : (
        <div className="w-full flex justify-center opacity-90 animate-bounce-slow">
           <div className="w-40 h-40">
             {/* Static version: Copy of SVG but without animations and with 'standing' legs */}
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
                {/* Tail */}
                <path d="M30,105 Q10,95 10,125 Q10,145 40,135 Z" fill="#5D4037" stroke="#3E2723" strokeWidth="2" />

                {/* Back Legs Standing */}
                <g transform="translate(40, 135)">
                    <path d="M10,0 L5,25 L20,25 L20,0 Z" fill="#FFC857" /> 
                    <path d="M5,25 L20,25 L19,32 L6,32 Z" fill="#3E2723" />
                </g>
                <g transform="translate(60, 135)">
                    <path d="M10,0 L5,25 L20,25 L20,0 Z" fill="#FFC857" />
                    <path d="M5,25 L20,25 L19,32 L6,32 Z" fill="#3E2723" />
                </g>

                {/* Body */}
                <ellipse cx="80" cy="110" rx="48" ry="38" fill="#FFC857" />
                <path d="M60,138 Q80,148 100,138" fill="none" stroke="#FCE4B8" strokeWidth="10" strokeLinecap="round" />

                <path d="M90,85 Q115,115 125,95 L110,80 Z" fill="#D32F2F" />
                <circle cx="110" cy="105" r="8" fill="#FFD700" stroke="#B8860B" strokeWidth="1" />

                {/* Front Legs Standing */}
                <g transform="translate(90, 135)">
                    <path d="M10,0 L5,25 L20,25 L20,0 Z" fill="#FFC857" />
                    <path d="M5,25 L20,25 L19,32 L6,32 Z" fill="#3E2723" />
                </g>
                <g transform="translate(110, 135)">
                    <path d="M10,0 L5,25 L20,25 L20,0 Z" fill="#FFC857" />
                    <path d="M5,25 L20,25 L19,32 L6,32 Z" fill="#3E2723" />
                </g>

                {/* Head (Static) */}
                <g transform="translate(90, 40)">
                     <path d="M-10,20 Q-25,30 -20,60 L10,50 Z" fill="#5D4037" />
                     <rect x="0" y="0" width="70" height="65" rx="25" ry="25" fill="#FFC857" />
                     <ellipse cx="45" cy="45" rx="22" ry="18" fill="#FFF8E1" />
                     <circle cx="40" cy="40" r="2" fill="#3E2723" />
                     <circle cx="50" cy="40" r="2" fill="#3E2723" />
                     <path d="M38,50 Q45,58 52,50" fill="#D32F2F" stroke="#3E2723" strokeWidth="1" />
                     <ellipse cx="10" cy="45" rx="6" ry="4" fill="#FFAB91" opacity="0.6" />
                     <ellipse cx="65" cy="40" rx="6" ry="4" fill="#FFAB91" opacity="0.6" />
                     <circle cx="15" cy="30" r="6" fill="#212121" />
                     <circle cx="17" cy="28" r="2" fill="white" />
                     <circle cx="55" cy="30" r="6" fill="#212121" />
                     <circle cx="57" cy="28" r="2" fill="white" />
                     <path d="M10,5 Q20,-5 35,5 Q50,-5 60,10" fill="#5D4037" stroke="#5D4037" strokeWidth="8" strokeLinecap="round" />
                     <path d="M10,5 Q0,-10 15,-10 Z" fill="#FFC857" stroke="#E6A63E" strokeWidth="2" />
                     <path d="M55,5 Q65,-10 50,-10 Z" fill="#FFC857" stroke="#E6A63E" strokeWidth="2" />
                     <g transform="translate(35, -5)">
                            <circle cx="0" cy="0" r="5" fill="#FF9800" />
                            <circle cx="0" cy="-8" r="5" fill="#FFEB3B" />
                            <circle cx="8" cy="0" r="5" fill="#FFEB3B" />
                            <circle cx="0" cy="8" r="5" fill="#FFEB3B" />
                            <circle cx="-8" cy="0" r="5" fill="#FFEB3B" />
                     </g>
                </g>
              </svg>
           </div>
           <div className="absolute -bottom-2 text-yellow-200 text-sm font-bold">Chờ lệnh xuất phát...</div>
        </div>
      )}
    </div>
  );
};
