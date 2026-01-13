
import React, { useEffect, useState } from 'react';

// --- CẤU HÌNH ẢNH ---
// Sử dụng link Cloudinary với tham số f_auto,q_auto để tối ưu hóa tự động
const HORSE_FRAMES = [
  "https://res.cloudinary.com/diw7mix0q/image/upload/f_auto,q_auto/v1768310350/horse1_ocejxs.png", // Frame 1: Chân co
  "https://res.cloudinary.com/diw7mix0q/image/upload/f_auto,q_auto/v1768310351/horse2_vegdjv.png", // Frame 2: Chân duỗi
  "https://res.cloudinary.com/diw7mix0q/image/upload/f_auto,q_auto/v1768310361/horse3_frxriy.png", // Frame 3: Chân đáp
  "https://res.cloudinary.com/diw7mix0q/image/upload/f_auto,q_auto/v1768310361/horse4_el32lh.png", // Frame 4: Chân bật
];

interface HorseAnimationProps {
  isRunning: boolean;
  onFinish: () => void;
  shufflingName?: string; // Tên quẻ đang xoay
  mode?: 'run-across' | 'run-in-place'; // Chế độ chạy
  loop?: boolean; // Chạy lặp lại vô hạn
}

export const HorseAnimation: React.FC<HorseAnimationProps> = ({ 
  isRunning, 
  onFinish, 
  shufflingName,
  mode = 'run-across',
  loop = false
}) => {
  const LAPS = 1; // Nếu không loop thì chạy 1 vòng để finish nhanh
  const LAP_DURATION_MS = 6000; // Tăng thời gian lên 6s để chạy chậm lại
  const TOTAL_DURATION = LAPS * LAP_DURATION_MS;

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [imgError, setImgError] = useState(false); 

  // Preload hình ảnh
  useEffect(() => {
    HORSE_FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Logic chuyển đổi frame
  useEffect(() => {
    let frameInterval: ReturnType<typeof setInterval>;
    
    if (isRunning && !imgError) {
      frameInterval = setInterval(() => {
        setCurrentFrameIndex(prev => (prev + 1) % HORSE_FRAMES.length);
      }, 200); // Tăng lên 200ms để chân chuyển động chậm hơn
    } else {
      setCurrentFrameIndex(0);
    }

    return () => clearInterval(frameInterval);
  }, [isRunning, imgError]);

  // Logic kết thúc đua (chỉ kích hoạt khi mode là run-across và isRunning = true và không loop)
  useEffect(() => {
    if (isRunning && mode === 'run-across' && !loop) {
      const timer = setTimeout(() => {
        onFinish();
      }, TOTAL_DURATION); 
      return () => clearTimeout(timer);
    }
  }, [isRunning, onFinish, TOTAL_DURATION, mode, loop]);

  return (
    <div className="w-full h-80 relative overflow-hidden flex items-end pb-3 bg-transparent group">
      
      <style>{`
        @keyframes runAcrossLoop {
          0% { left: -200px; }
          100% { left: 100%; }
        }
        
        /* Đã xóa keyframes gallopBody để bỏ hiệu ứng nhảy */

        /* Animations cho ngựa SVG (Fallback) */
        @keyframes headBob { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-8deg); } 75% { transform: rotate(5deg); } }
        @keyframes tailWag { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(25deg); } 75% { transform: rotate(-15deg); } }
        @keyframes legFront { 0% { transform: rotate(0deg); } 30% { transform: rotate(-45deg); } 60% { transform: rotate(10deg); } 100% { transform: rotate(0deg); } }
        @keyframes legBack { 0% { transform: rotate(0deg); } 30% { transform: rotate(35deg); } 60% { transform: rotate(-10deg); } 100% { transform: rotate(0deg); } }

        .horse-wrapper {
          width: 190px;
          height: 190px;
          position: absolute;
          z-index: 10;
        }

        .mode-across { animation: runAcrossLoop ${LAP_DURATION_MS}ms linear ${loop ? 'infinite' : LAPS}; }
        /* Chế độ chạy tại chỗ: Căn giữa */
        .mode-in-place { left: 50%; transform: translateX(-50%); }

        .horse-body-container {
          width: 100%;
          height: 100%;
          /* Đã xóa animation gallopBody */
          transform-origin: center center;
        }

        /* SVG Classes */
        .horse-head { transform-box: fill-box; transform-origin: 20% 80%; animation: headBob 0.4s ease-in-out infinite; animation-delay: 0.1s; }
        .horse-tail { transform-box: fill-box; transform-origin: top left; animation: tailWag 0.3s ease-in-out infinite; }
        .leg-front { transform-box: fill-box; transform-origin: top center; animation: legFront 0.4s ease-in-out infinite; }
        .leg-back { transform-box: fill-box; transform-origin: top center; animation: legBack 0.4s ease-in-out infinite; }
        
        /* Dust Effect */
        .dust-particle {
            position: absolute;
            background: radial-gradient(circle, rgba(255,248,220,0.8) 0%, rgba(255,255,255,0) 70%);
            border-radius: 50%;
            opacity: 0;
            z-index: 5;
            pointer-events: none;
        }

        @keyframes dustKick {
            0% { transform: translate(0, 0) scale(0.5); opacity: 0.8; }
            100% { transform: translate(-40px, -25px) scale(2.2); opacity: 0; }
        }

        .d1 { width: 25px; height: 25px; bottom: 25px; left: 35px; animation: dustKick 0.4s infinite ease-out; animation-delay: 0.05s; }
        .d2 { width: 18px; height: 18px; bottom: 30px; left: 25px; animation: dustKick 0.4s infinite ease-out; animation-delay: 0.2s; }
        .d3 { width: 30px; height: 20px; bottom: 20px; left: 45px; animation: dustKick 0.4s infinite ease-out; animation-delay: 0.1s; }
      `}</style>

      {/* Track */}
      <div className="absolute bottom-[60px] w-full h-3 bg-yellow-900/20 rounded-full overflow-hidden">
         <div className="w-full h-full bg-yellow-500/10 animate-pulse"></div>
      </div>

      {isRunning ? (
        <div className={`horse-wrapper bottom-0 ${mode === 'run-across' ? 'mode-across' : 'mode-in-place'}`}>
            <div className="horse-body-container">
              {!imgError ? (
                <img 
                    src={HORSE_FRAMES[currentFrameIndex]}
                    alt="Running Horse" 
                    className="w-full h-full object-contain drop-shadow-xl"
                    style={{ transform: 'scaleX(-1)' }}
                    onError={(e) => {
                        console.error(`Lỗi tải ảnh: ${e.currentTarget.src}. Chuyển sang SVG.`);
                        setImgError(true);
                    }}
                />
              ) : (
                // SVG Fallback
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
                    <path className="horse-tail" d="M30,105 Q10,95 10,125 Q10,145 40,135 Z" fill="#5D4037" stroke="#3E2723" strokeWidth="2" />
                    <g transform="translate(40, 130)"><g className="leg-back" style={{ animationDelay: '0.1s' }}><path d="M10,0 L0,25 L15,25 L20,0 Z" fill="#FFC857" /><path d="M0,25 L15,25 L14,32 L1,32 Z" fill="#3E2723" /></g></g>
                    <g transform="translate(60, 135)"><g className="leg-back"><path d="M10,0 L0,20 L15,20 L20,0 Z" fill="#FFC857" /><path d="M0,20 L15,20 L14,27 L1,27 Z" fill="#3E2723" /></g></g>
                    <ellipse cx="80" cy="110" rx="48" ry="38" fill="#FFC857" />
                    <path d="M60,138 Q80,148 100,138" fill="none" stroke="#FCE4B8" strokeWidth="10" strokeLinecap="round" />
                    <path d="M90,85 Q115,115 125,95 L110,80 Z" fill="#D32F2F" />
                    <circle cx="110" cy="105" r="8" fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
                    <g transform="translate(90, 120) rotate(-10)"><g className="leg-front"><path d="M10,0 L0,25 L15,25 L20,0 Z" fill="#FFC857" /><path d="M0,25 L15,25 L14,32 L1,32 Z" fill="#3E2723" /></g></g>
                    <g transform="translate(110, 110) rotate(-10)"><g className="leg-front" style={{ animationDelay: '0.2s' }}><path d="M10,0 L0,25 L15,25 L20,0 Z" fill="#FFC857" /><path d="M0,25 L15,25 L14,32 L1,32 Z" fill="#3E2723" /></g></g>
                    <g transform="translate(90, 40)"><g className="horse-head"><path d="M-10,20 Q-25,30 -20,60 L10,50 Z" fill="#5D4037" /><rect x="0" y="0" width="70" height="65" rx="25" ry="25" fill="#FFC857" /><ellipse cx="45" cy="45" rx="22" ry="18" fill="#FFF8E1" /><circle cx="40" cy="40" r="2" fill="#3E2723" /><circle cx="50" cy="40" r="2" fill="#3E2723" /><path d="M38,50 Q45,58 52,50" fill="#D32F2F" stroke="#3E2723" strokeWidth="1" /><ellipse cx="10" cy="45" rx="6" ry="4" fill="#FFAB91" opacity="0.6" /><ellipse cx="65" cy="40" rx="6" ry="4" fill="#FFAB91" opacity="0.6" /><circle cx="15" cy="30" r="6" fill="#212121" />
                    <circle cx="17" cy="28" r="2" fill="white" /><circle cx="55" cy="30" r="6" fill="#212121" /><circle cx="57" cy="28" r="2" fill="white" /><path d="M10,5 Q20,-5 35,5 Q50,-5 60,10" fill="#5D4037" stroke="#5D4037" strokeWidth="8" strokeLinecap="round" /><path d="M10,5 Q0,-10 15,-10 Z" fill="#FFC857" stroke="#E6A63E" strokeWidth="2" /><path d="M55,5 Q65,-10 50,-10 Z" fill="#FFC857" stroke="#E6A63E" strokeWidth="2" /><g transform="translate(35, -5)"><circle cx="0" cy="0" r="5" fill="#FF9800" /><circle cx="0" cy="-8" r="5" fill="#FFEB3B" /><circle cx="8" cy="0" r="5" fill="#FFEB3B" /><circle cx="0" cy="8" r="5" fill="#FFEB3B" /><circle cx="-8" cy="0" r="5" fill="#FFEB3B" /></g></g></g>
                </svg>
              )}
            </div>
            
            {imgError && (
              <>
                <div className="dust-particle d1"></div>
                <div className="dust-particle d2"></div>
                <div className="dust-particle d3"></div>
              </>
            )}
            
             <div className="absolute -top-8 -right-12 animate-bounce bg-white border-4 border-red-600 rounded-2xl px-4 py-3 shadow-2xl z-20 min-w-[140px] text-center transform scale-110">
                 <span className="text-lg text-red-700 font-display font-black whitespace-nowrap uppercase tracking-tighter">
                    {shufflingName || "Lộc tới! 🧧"}
                 </span>
                 <div className="absolute bottom-[-10px] left-6 w-5 h-5 bg-white border-b-4 border-r-4 border-red-600 transform rotate-45"></div>
             </div>
        </div>
      ) : (
        // TRẠNG THÁI ĐỨNG YÊN
        <div className="w-full flex justify-center opacity-90 animate-bounce-slow">
           <div className="w-40 h-40">
              {!imgError ? (
                  <img 
                    src={HORSE_FRAMES[0]} 
                    alt="Standing Horse" 
                    className="w-full h-full object-contain drop-shadow-md"
                    style={{ transform: 'scaleX(-1)' }} // Lật ngược ảnh để đầu hướng về phía trước
                    onError={() => setImgError(true)}
                  />
              ) : (
                  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
                     <path d="M30,105 Q10,95 10,125 Q10,145 40,135 Z" fill="#5D4037" stroke="#3E2723" strokeWidth="2" />
                     <g transform="translate(40, 135)"><path d="M10,0 L5,25 L20,25 L20,0 Z" fill="#FFC857" /><path d="M5,25 L20,25 L19,32 L6,32 Z" fill="#3E2723" /></g>
                     <g transform="translate(60, 135)"><path d="M10,0 L5,25 L20,25 L20,0 Z" fill="#FFC857" /><path d="M5,25 L20,25 L19,32 L6,32 Z" fill="#3E2723" /></g>
                     <ellipse cx="80" cy="110" rx="48" ry="38" fill="#FFC857" />
                     <path d="M60,138 Q80,148 100,138" fill="none" stroke="#FCE4B8" strokeWidth="10" strokeLinecap="round" />
                     <path d="M90,85 Q115,115 125,95 L110,80 Z" fill="#D32F2F" />
                     <circle cx="110" cy="105" r="8" fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
                     <g transform="translate(90, 135)"><path d="M10,0 L5,25 L20,25 L20,0 Z" fill="#FFC857" /><path d="M5,25 L20,25 L19,32 L6,32 Z" fill="#3E2723" /></g>
                     <g transform="translate(110, 135)"><path d="M10,0 L5,25 L20,25 L20,0 Z" fill="#FFC857" /><path d="M5,25 L20,25 L19,32 L6,32 Z" fill="#3E2723" /></g>
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
                                <circle cx="0" cy="0" r="5" fill="#FF9800" /><circle cx="0" cy="-8" r="5" fill="#FFEB3B" /><circle cx="8" cy="0" r="5" fill="#FFEB3B" /><circle cx="0" cy="8" r="5" fill="#FFEB3B" /><circle cx="-8" cy="0" r="5" fill="#FFEB3B" />
                         </g>
                     </g>
                  </svg>
              )}
           </div>
           <div className="absolute -bottom-2 text-yellow-200 text-sm font-bold">Chờ lệnh xuất phát...</div>
        </div>
      )}
    </div>
  );
};
