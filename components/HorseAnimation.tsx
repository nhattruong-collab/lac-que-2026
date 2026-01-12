import React, { useEffect } from 'react';

interface HorseAnimationProps {
  isRunning: boolean;
  onFinish: () => void;
}

export const HorseAnimation: React.FC<HorseAnimationProps> = ({ isRunning, onFinish }) => {
  // Cấu hình: Chạy 2 vòng thay vì 3. Tổng thời gian 5s là đẹp để chờ AI.
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
    <div className="w-full h-48 relative overflow-hidden flex items-center bg-transparent group">
      
      <style>{`
        /* Animation di chuyển ngang màn hình */
        @keyframes runAcrossLoop {
          0% { left: -180px; }
          100% { left: 100%; }
        }
        
        /* Hiệu ứng ngựa phi (nhún nhảy cute) */
        @keyframes gallop {
          0% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(-5deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-5px) rotate(3deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        
        /* Animation đuôi vẫy */
        @keyframes tailWag {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(15deg); }
        }

        .horse-wrapper {
          width: 150px; /* Điều chỉnh kích thước cho phù hợp tỷ lệ chibi */
          height: 150px;
          position: absolute;
          z-index: 10;
          /* Chạy animation di chuyển lặp lại LAPS lần */
          animation: runAcrossLoop ${LAP_DURATION_MS}ms linear ${LAPS};
        }

        .horse-svg-container {
          width: 100%;
          height: 100%;
          /* Animation phi ngựa tại chỗ */
          animation: gallop 0.4s ease-in-out infinite;
          transform-origin: bottom center;
        }
        
        .horse-tail {
            transform-origin: 20px 80px;
            animation: tailWag 0.4s ease-in-out infinite;
        }

        /* Bụi bay */
        .dust-cloud {
            position: absolute;
            bottom: 20px;
            left: 10px;
            width: 40px;
            height: 20px;
            background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%);
            animation: dust 0.4s infinite;
            opacity: 0.8;
            border-radius: 50%;
            z-index: 5;
        }
        
        @keyframes dust {
            0% { transform: scale(0.5) translate(30px, 0); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: scale(1.5) translate(-40px, -10px); opacity: 0; }
        }
      `}</style>

      {/* Đường chạy */}
      <div className="absolute bottom-6 w-full h-2 bg-yellow-900/20 rounded-full overflow-hidden">
         <div className="w-full h-full bg-yellow-500/10 animate-pulse"></div>
      </div>

      {isRunning ? (
        <div className="horse-wrapper top-6">
            <div className="horse-svg-container">
              {/* SVG CHIBI HORSE - Được vẽ chi tiết dựa trên ảnh mẫu */}
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
                {/* 1. Cái đuôi (Nâu đậm) - Layer dưới cùng */}
                <path className="horse-tail" d="M30,100 Q10,90 10,120 Q10,140 40,130 Z" fill="#5D4037" stroke="#3E2723" strokeWidth="2" />

                {/* 2. Chân sau (Vàng + Móng nâu) */}
                <g transform="translate(40, 130)">
                    {/* Chân sau trái */}
                    <path d="M10,0 L0,25 L15,25 L20,0 Z" fill="#FFC857" /> 
                    <path d="M0,25 L15,25 L14,32 L1,32 Z" fill="#3E2723" />
                </g>
                <g transform="translate(60, 135)">
                    {/* Chân sau phải */}
                    <path d="M10,0 L0,20 L15,20 L20,0 Z" fill="#FFC857" />
                    <path d="M0,20 L15,20 L14,27 L1,27 Z" fill="#3E2723" />
                </g>

                {/* 3. Thân (Vàng cam tròn trịa) */}
                <ellipse cx="80" cy="110" rx="45" ry="35" fill="#FFC857" />
                {/* Bụng sáng hơn một chút */}
                <path d="M60,135 Q80,145 100,135" fill="none" stroke="#FCE4B8" strokeWidth="10" strokeLinecap="round" />

                {/* 4. Khăn đỏ/Yếm + Chuông */}
                <path d="M90,90 Q110,110 120,95 L110,85 Z" fill="#D32F2F" />
                <circle cx="105" cy="110" r="8" fill="#FFD700" stroke="#B8860B" strokeWidth="1" /> {/* Chuông */}

                {/* 5. Chân trước (Vàng + Móng nâu) - Đang giơ lên */}
                <g transform="translate(90, 120) rotate(-30)">
                    <path d="M10,0 L0,25 L15,25 L20,0 Z" fill="#FFC857" />
                    <path d="M0,25 L15,25 L14,32 L1,32 Z" fill="#3E2723" />
                </g>
                <g transform="translate(110, 110) rotate(-45)">
                    <path d="M10,0 L0,25 L15,25 L20,0 Z" fill="#FFC857" />
                    <path d="M0,25 L15,25 L14,32 L1,32 Z" fill="#3E2723" />
                </g>

                {/* 6. Đầu (Vàng cam) */}
                <g transform="translate(90, 40)">
                    {/* Bờm sau (Nâu) */}
                    <path d="M-10,20 Q-25,30 -20,60 L10,50 Z" fill="#5D4037" />
                    
                    {/* Khuôn mặt */}
                    <rect x="0" y="0" width="70" height="65" rx="25" ry="25" fill="#FFC857" />
                    
                    {/* Mõm (Kem sáng) */}
                    <ellipse cx="45" cy="45" rx="22" ry="18" fill="#FFF8E1" />
                    
                    {/* Mũi (Nâu nhỏ) */}
                    <circle cx="40" cy="40" r="2" fill="#3E2723" />
                    <circle cx="50" cy="40" r="2" fill="#3E2723" />
                    
                    {/* Miệng (Cười D) */}
                    <path d="M38,50 Q45,58 52,50" fill="#D32F2F" stroke="#3E2723" strokeWidth="1" />

                    {/* Má hồng */}
                    <ellipse cx="10" cy="45" rx="6" ry="4" fill="#FFAB91" opacity="0.6" />
                    <ellipse cx="65" cy="40" rx="6" ry="4" fill="#FFAB91" opacity="0.6" />

                    {/* Mắt (Đen to tròn có đốm trắng) */}
                    <circle cx="15" cy="30" r="6" fill="#212121" />
                    <circle cx="17" cy="28" r="2" fill="white" />
                    
                    <circle cx="55" cy="30" r="6" fill="#212121" />
                    <circle cx="57" cy="28" r="2" fill="white" />

                    {/* Bờm mái (Nâu) */}
                    <path d="M10,5 Q20,-5 35,5 Q50,-5 60,10" fill="#5D4037" stroke="#5D4037" strokeWidth="8" strokeLinecap="round" />

                    {/* Tai */}
                    <path d="M10,5 Q0,-10 15,-10 Z" fill="#FFC857" stroke="#E6A63E" strokeWidth="2" />
                    <path d="M55,5 Q65,-10 50,-10 Z" fill="#FFC857" stroke="#E6A63E" strokeWidth="2" />

                    {/* Hoa trên đầu (Vàng + Cam) */}
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
            
            {/* Hiệu ứng bụi */}
            <div className="dust-cloud"></div>
            
             {/* Bóng nói */}
             <div className="absolute -top-6 -right-4 animate-bounce bg-white border-2 border-red-500 rounded-xl px-3 py-1 shadow-md z-20">
                 <span className="text-xs text-red-600 font-bold whitespace-nowrap">
                    Lộc về! Lộc về! 🌸
                 </span>
             </div>
        </div>
      ) : (
        <div className="w-full flex justify-center opacity-90 animate-bounce-slow">
           <div className="w-40 h-40">
              {/* SVG TĨNH (Đứng yên) */}
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
                {/* Copy y nguyên cấu trúc trên nhưng không có group transform cho chân để đứng thẳng */}
                <path d="M30,100 Q10,90 10,120 Q10,140 40,130 Z" fill="#5D4037" stroke="#3E2723" strokeWidth="2" />

                <g transform="translate(40, 135)"> {/* Chân sau đứng */}
                    <path d="M10,0 L5,25 L20,25 L20,0 Z" fill="#FFC857" /> 
                    <path d="M5,25 L20,25 L19,32 L6,32 Z" fill="#3E2723" />
                </g>
                <g transform="translate(60, 135)"> {/* Chân sau đứng */}
                    <path d="M10,0 L5,25 L20,25 L20,0 Z" fill="#FFC857" />
                    <path d="M5,25 L20,25 L19,32 L6,32 Z" fill="#3E2723" />
                </g>

                <ellipse cx="80" cy="110" rx="45" ry="35" fill="#FFC857" />
                <path d="M60,135 Q80,145 100,135" fill="none" stroke="#FCE4B8" strokeWidth="10" strokeLinecap="round" />

                <path d="M90,90 Q110,110 120,95 L110,85 Z" fill="#D32F2F" />
                <circle cx="105" cy="110" r="8" fill="#FFD700" stroke="#B8860B" strokeWidth="1" />

                <g transform="translate(90, 135)"> {/* Chân trước đứng */}
                    <path d="M10,0 L5,25 L20,25 L20,0 Z" fill="#FFC857" />
                    <path d="M5,25 L20,25 L19,32 L6,32 Z" fill="#3E2723" />
                </g>
                <g transform="translate(110, 135)"> {/* Chân trước đứng */}
                    <path d="M10,0 L5,25 L20,25 L20,0 Z" fill="#FFC857" />
                    <path d="M5,25 L20,25 L19,32 L6,32 Z" fill="#3E2723" />
                </g>

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