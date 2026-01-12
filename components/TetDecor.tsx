
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

export const BlossomBranch: React.FC<{ className?: string, flipped?: boolean }> = ({ className = "", flipped = false }) => (
  <svg className={`w-32 h-32 ${className} ${flipped ? 'scale-x-[-1]' : ''}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 100C20 80 40 90 60 50C70 30 90 10 100 0" stroke="#5D4037" strokeWidth="3"/>
    <circle cx="60" cy="50" r="5" fill="#FFD700"/>
    <circle cx="80" cy="20" r="4" fill="#FFD700"/>
    <circle cx="40" cy="70" r="4" fill="#FFD700"/>
    <circle cx="90" cy="40" r="3" fill="#FFD700"/>
  </svg>
);

export const Coin: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`w-8 h-8 ${className} animate-bounce-slow`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
    <rect x="35" y="35" width="30" height="30" stroke="#B8860B" strokeWidth="2"/>
    <text x="50" y="65" textAnchor="middle" fill="#B8860B" fontSize="40" fontFamily="serif">Tài</text>
  </svg>
);

// --- CÁC ICON MỚI CHO PHẦN KẾT QUẢ ---

// Biểu tượng Cuộn Thư (Sách Thánh Hiền) - Đại diện Công Danh
export const ScrollIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="scrollGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF9C4"/>
        <stop offset="100%" stopColor="#FFF176"/>
      </linearGradient>
    </defs>
    {/* Giấy cuộn */}
    <rect x="20" y="20" width="60" height="60" fill="url(#scrollGrad)" stroke="#FBC02D" strokeWidth="2"/>
    {/* Nội dung giả */}
    <path d="M30 35 H70 M30 50 H70 M30 65 H50" stroke="#F9A825" strokeWidth="3" strokeLinecap="round"/>
    {/* Trục gỗ trái */}
    <rect x="15" y="15" width="8" height="70" rx="2" fill="#8D6E63" stroke="#5D4037" strokeWidth="2"/>
    {/* Trục gỗ phải */}
    <rect x="77" y="15" width="8" height="70" rx="2" fill="#8D6E63" stroke="#5D4037" strokeWidth="2"/>
  </svg>
);

// Biểu tượng Túi Gấm (Túi Lộc) - Đại diện Tài Lộc
export const LuckyBagIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Thân túi */}
    <path d="M50 25 C70 25 85 45 85 70 C85 85 70 95 50 95 C30 95 15 85 15 70 C15 45 30 25 50 25 Z" fill="#D32F2F" stroke="#B71C1C" strokeWidth="2"/>
    {/* Dây buộc vàng */}
    <path d="M35 35 L65 35" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
    {/* Nút thắt */}
    <path d="M40 25 Q50 10 60 25" fill="none" stroke="#FFD700" strokeWidth="2"/>
    {/* Chữ Lộc hoặc đồng tiền giữa túi */}
    <circle cx="50" cy="65" r="12" fill="#FFD700" stroke="#F57F17" strokeWidth="2"/>
    <rect x="44" y="59" width="12" height="12" rx="1" stroke="#F57F17" strokeWidth="1"/>
  </svg>
);

// Biểu tượng Hoa Sen - Đại diện Gia Đạo (An yên, hòa thuận)
export const LotusIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
     {/* Cánh hoa chính giữa */}
     <path d="M50 15 C50 15 75 40 75 60 C75 75 65 85 50 85 C35 85 25 75 25 60 C25 40 50 15 50 15 Z" fill="#F48FB1" stroke="#C2185B" strokeWidth="2"/>
     {/* Cánh hoa trái */}
     <path d="M25 60 C15 50 5 55 5 65 C5 75 25 85 50 85" fill="#F8BBD0" stroke="#C2185B" strokeWidth="2"/>
     {/* Cánh hoa phải */}
     <path d="M75 60 C85 50 95 55 95 65 C95 75 75 85 50 85" fill="#F8BBD0" stroke="#C2185B" strokeWidth="2"/>
  </svg>
);

// Biểu tượng Hồ Lô - Đại diện Sức Khỏe (Trường thọ)
export const GourdIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bầu dưới */}
    <circle cx="50" cy="65" r="22" fill="#81C784" stroke="#2E7D32" strokeWidth="2"/>
    {/* Bầu trên */}
    <circle cx="50" cy="32" r="14" fill="#81C784" stroke="#2E7D32" strokeWidth="2"/>
    {/* Dây buộc eo */}
    <path d="M38 47 Q50 52 62 47" fill="none" stroke="#D32F2F" strokeWidth="3"/>
    {/* Cuống */}
    <path d="M50 18 V10" stroke="#5D4037" strokeWidth="3" strokeLinecap="round"/>
    {/* Lá nhỏ */}
    <path d="M50 12 Q60 5 65 15" fill="none" stroke="#4CAF50" strokeWidth="2"/>
  </svg>
);

// --- HIỆU ỨNG RƠI (Falling Decor) ---

export const FallingDecor: React.FC = () => {
  // Tạo mảng các phần tử rơi ngẫu nhiên
  const items = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100, // Vị trí ngẫu nhiên theo chiều ngang
    delay: Math.random() * 5, // Độ trễ ngẫu nhiên
    duration: 3 + Math.random() * 4, // Tốc độ rơi
    type: Math.random() > 0.5 ? 'coin' : 'blossom', // Ngẫu nhiên là tiền hay hoa
    size: 15 + Math.random() * 20, // Kích thước ngẫu nhiên
  }));

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
             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M12 2C14 6 18 8 22 12C18 16 14 18 12 22C10 18 6 16 2 12C6 8 10 6 12 2" fill="#FFEB3B" />
             </svg>
          )}
        </div>
      ))}
    </div>
  );
};
