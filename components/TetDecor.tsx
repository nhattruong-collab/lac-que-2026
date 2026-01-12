
import React from 'react';

export const Lantern: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`w-16 h-24 ${className}`} viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="50" y1="0" x2="50" y2="20" stroke="#FFD700" strokeWidth="2"/>
    <rect x="20" y="20" width="60" height="80" rx="10" fill="#D00000" stroke="#FFD700" strokeWidth="2"/>
    <path d="M20 30H80" stroke="#FFD700" strokeOpacity="0.5"/>
    <path d="M20 90H80" stroke="#FFD700" strokeOpacity="0.5"/>
    <circle cx="50" cy="60" r="15" fill="#FFD700" fillOpacity="0.8"/>
    <path d="M30 100L25 130" stroke="#FFD700" strokeWidth="2"/>
    <path d="M50 100L50 140" stroke="#FFD700" strokeWidth="2"/>
    <path d="M70 100L75 130" stroke="#FFD700" strokeWidth="2"/>
  </svg>
);

export const Coin: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`w-8 h-8 ${className} animate-bounce-slow`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
    <rect x="35" y="35" width="30" height="30" stroke="#B8860B" strokeWidth="2"/>
    <text x="50" y="65" textAnchor="middle" fill="#B8860B" fontSize="40" fontFamily="serif">Tài</text>
  </svg>
);

// --- CÀNH HOA TRANG TRÍ MỚI (ĐÀO & MAI) ---

interface BranchProps {
  className?: string;
  type?: 'peach' | 'apricot'; // peach = đào (hồng), apricot = mai (vàng)
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const DecorativeBranch: React.FC<BranchProps> = ({ className = "", type = 'apricot', position = 'top-left' }) => {
  const flowerColor = type === 'peach' ? '#FFB7C5' : '#FFD700'; // Hồng phấn hoặc Vàng
  const pistilColor = type === 'peach' ? '#D50000' : '#E65100'; // Nhụy đỏ hoặc cam đậm
  
  // Xác định hướng xoay dựa trên vị trí
  let transform = "";
  if (position === 'top-right') transform = "scale(-1, 1)";
  if (position === 'bottom-left') transform = "scale(1, -1)";
  if (position === 'bottom-right') transform = "scale(-1, -1)";

  return (
    <svg className={`${className} pointer-events-none`} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform }}>
      {/* Cành cây chính */}
      <path d="M0 0 C40 20, 80 80, 180 60" stroke="#3E2723" strokeWidth="4" strokeLinecap="round" />
      <path d="M80 50 C100 80, 120 120, 160 130" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 20 C50 50, 40 80, 20 100" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
      
      {/* Các bông hoa */}
      <g>
         {/* Bông 1 */}
         <g transform="translate(180, 60)">
            <circle r="12" fill={flowerColor} />
            <circle r="3" fill={pistilColor} />
            <path d="M0 -12 L0 -6 M10 -6 L5 -3 M7 9 L3 4 M-7 9 L-3 4 M-10 -6 L-5 -3" stroke={pistilColor} strokeWidth="1"/>
         </g>
         {/* Bông 2 */}
         <g transform="translate(160, 130) scale(0.8)">
            <circle r="12" fill={flowerColor} />
            <circle r="3" fill={pistilColor} />
         </g>
         {/* Bông 3 */}
         <g transform="translate(80, 50) scale(0.9)">
            <circle r="12" fill={flowerColor} />
            <circle r="3" fill={pistilColor} />
         </g>
          {/* Bông 4 */}
         <g transform="translate(20, 100) scale(0.7)">
            <circle r="12" fill={flowerColor} />
            <circle r="3" fill={pistilColor} />
         </g>
         {/* Nụ hoa */}
         <circle cx="120" cy="100" r="4" fill={flowerColor} />
         <circle cx="100" cy="20" r="4" fill={flowerColor} />
         <circle cx="50" cy="70" r="4" fill={flowerColor} />
      </g>
    </svg>
  );
};

// --- CÁC ICON KẾT QUẢ ---

export const ScrollIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="scrollGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9C4"/>
        <stop offset="100%" stopColor="#FFF176"/>
      </linearGradient>
    </defs>
    <rect x="20" y="20" width="60" height="60" fill="url(#scrollGrad)" stroke="#FBC02D" strokeWidth="2"/>
    <path d="M30 35 H70 M30 50 H70 M30 65 H50" stroke="#F9A825" strokeWidth="3" strokeLinecap="round"/>
    <rect x="15" y="15" width="8" height="70" rx="2" fill="#8D6E63" stroke="#5D4037" strokeWidth="2"/>
    <rect x="77" y="15" width="8" height="70" rx="2" fill="#8D6E63" stroke="#5D4037" strokeWidth="2"/>
  </svg>
);

export const LuckyBagIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 25 C70 25 85 45 85 70 C85 85 70 95 50 95 C30 95 15 85 15 70 C15 45 30 25 50 25 Z" fill="#D32F2F" stroke="#B71C1C" strokeWidth="2"/>
    <path d="M35 35 L65 35" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
    <path d="M40 25 Q50 10 60 25" fill="none" stroke="#FFD700" strokeWidth="2"/>
    <circle cx="50" cy="65" r="12" fill="#FFD700" stroke="#F57F17" strokeWidth="2"/>
    <rect x="44" y="59" width="12" height="12" rx="1" stroke="#F57F17" strokeWidth="1"/>
  </svg>
);

export const LotusIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M50 15 C50 15 75 40 75 60 C75 75 65 85 50 85 C35 85 25 75 25 60 C25 40 50 15 50 15 Z" fill="#F48FB1" stroke="#C2185B" strokeWidth="2"/>
     <path d="M25 60 C15 50 5 55 5 65 C5 75 25 85 50 85" fill="#F8BBD0" stroke="#C2185B" strokeWidth="2"/>
     <path d="M75 60 C85 50 95 55 95 65 C95 75 75 85 50 85" fill="#F8BBD0" stroke="#C2185B" strokeWidth="2"/>
  </svg>
);

export const GourdIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="65" r="22" fill="#81C784" stroke="#2E7D32" strokeWidth="2"/>
    <circle cx="50" cy="32" r="14" fill="#81C784" stroke="#2E7D32" strokeWidth="2"/>
    <path d="M38 47 Q50 52 62 47" fill="none" stroke="#D32F2F" strokeWidth="3"/>
    <path d="M50 18 V10" stroke="#5D4037" strokeWidth="3" strokeLinecap="round"/>
    <path d="M50 12 Q60 5 65 15" fill="none" stroke="#4CAF50" strokeWidth="2"/>
  </svg>
);

// --- HIỆU ỨNG RƠI (Falling Decor) ---

export const FallingDecor: React.FC = () => {
  const items = Array.from({ length: 25 }).map((_, i) => {
    const typeRandom = Math.random();
    let type = 'coin';
    if (typeRandom > 0.6) type = 'peach-flower'; // 40% hoa đào
    else if (typeRandom > 0.3) type = 'apricot-flower'; // 30% hoa mai
    else type = 'coin'; // 30% tiền

    return {
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      type: type,
      size: 15 + Math.random() * 20,
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes fallDown {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute top-0"
          style={{
            left: `${item.left}%`,
            animation: `fallDown ${item.duration}s linear infinite`,
            animationDelay: `${item.delay}s`,
            width: `${item.size}px`,
            height: `${item.size}px`,
          }}
        >
          {item.type === 'coin' ? (
             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <circle cx="12" cy="12" r="10" fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
               <rect x="8" y="8" width="8" height="8" stroke="#B8860B" strokeWidth="1.5" />
             </svg>
          ) : (
             // Hoa: Dùng currentColor để đổi màu dựa theo class text
             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M12 2C14 6 18 8 22 12C18 16 14 18 12 22C10 18 6 16 2 12C6 8 10 6 12 2" 
                     fill={item.type === 'peach-flower' ? '#FFB7C5' : '#FFD700'} 
                     stroke={item.type === 'peach-flower' ? '#D50000' : '#F57F17'} strokeWidth="1" />
               <circle cx="12" cy="12" r="2" fill={item.type === 'peach-flower' ? '#D50000' : '#F57F17'} />
             </svg>
          )}
        </div>
      ))}
    </div>
  );
};
