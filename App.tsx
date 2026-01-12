
import React, { useState, useRef, useEffect } from 'react';
import { AppState, UserInput, FortuneResult, FortuneData, FortuneContent } from './types';
import { FORTUNES } from './constants';
import { getFortuneInterpretation } from './services/geminiService';
import { Lantern, BlossomBranch, Coin, ScrollIcon, LuckyBagIcon, LotusIcon, GourdIcon, FallingDecor } from './components/TetDecor';
import { HorseAnimation } from './components/HorseAnimation';
import html2canvas from 'html2canvas';

// Danh sách câu chờ "Gen Z" hài hước, tích cực
const LOADING_MESSAGES = [
  "Đang call video gấp với Ngọc Hoàng...",
  "Mạng Thiên Đình hơi lag, chờ xíu nha...",
  "Đang tải nhân phẩm, vui lòng không hối...",
  "Đang check xem năm nay thoát ế chưa...",
  "Alo Thần Tài nghe rõ trả lời...",
  "Tín hiệu vũ trụ đang tới...",
  "Đang xin vía Thần Tài cho bạn giàu to...",
  "Bình tĩnh, giàu sang đang tới...",
  "Đang bật chế độ 'hốt bạc'...",
  "Loading vận may... 99%...",
  "Đang check var xem năm nay giàu cỡ nào...",
  "Vũ trụ đang gửi thông điệp, đừng tắt máy...",
  "Đang xin keo... chờ chút...",
  "Đang order trà sữa mời Táo Quân...",
  "Đang scan vân tay để mở két vàng..."
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [userInput, setUserInput] = useState<UserInput>({ day: '', month: '', year: '' });
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [error, setError] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('Đang kết nối tâm linh...');
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const fortunePromiseRef = useRef<Promise<FortuneContent> | null>(null);
  const selectedFortuneRef = useRef<FortuneData | null>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);

  // Effect để đổi câu thoại loading mỗi 2s
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (appState === AppState.LOADING_RESULT) {
      interval = setInterval(() => {
        const randomMsg = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
        setLoadingMessage(randomMsg);
      }, 3500); // Đổi text mỗi 3.5 giây
    }
    return () => clearInterval(interval);
  }, [appState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInput(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateInput = (): boolean => {
    const d = parseInt(userInput.day);
    const m = parseInt(userInput.month);
    const y = parseInt(userInput.year);
    if (!d || !m || !y || d < 1 || d > 31 || m < 1 || m > 12 || y < 1920 || y > 2026) {
      setError('Vui lòng nhập bát tự (ngày sinh) chính xác!');
      return false;
    }
    return true;
  };

  const startRace = () => {
    if (!validateInput()) return;
    
    // 1. Chọn quẻ ngẫu nhiên
    const randomIndex = Math.floor(Math.random() * FORTUNES.length);
    selectedFortuneRef.current = FORTUNES[randomIndex];

    // 2. GỌI AI NGAY LẬP TỨC (Parallel Execution)
    // Promise này sẽ chạy ngầm trong khi animation đang diễn ra
    fortunePromiseRef.current = getFortuneInterpretation(userInput, selectedFortuneRef.current);
    
    // 3. Bắt đầu animation ngựa chạy
    setAppState(AppState.RACING);
  };

  const handleRaceFinished = async () => {
    // Set một câu random ngay lập tức khi chuyển màn hình
    const randomMsg = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
    setLoadingMessage(randomMsg);

    // Khi ngựa chạy xong (sau 5s), kiểm tra xem AI xong chưa
    setAppState(AppState.LOADING_RESULT);
    try {
      if (fortunePromiseRef.current && selectedFortuneRef.current) {
        // Nếu AI xong rồi -> await trả về ngay lập tức -> Hiện kết quả luôn
        // Nếu AI chưa xong -> Chờ nốt phần còn lại -> Hiện loading (lúc này useEffect sẽ chạy để đổi text)
        const interpretation = await fortunePromiseRef.current;
        setResult({ fortune: selectedFortuneRef.current, interpretation });
        setAppState(AppState.RESULT);
      }
    } catch (err) {
      setAppState(AppState.INPUT);
      setError('Thiên cơ bất khả lộ, vui lòng thử lại!');
    }
  };

  const resetApp = () => {
    setAppState(AppState.INPUT);
    setResult(null);
    setUserInput({ day: '', month: '', year: '' });
  };

  const handleCapture = async () => {
    if (!resultCardRef.current) return;
    setIsCapturing(true); // Bật chế độ chụp

    try {
      // Đợi render layout mới lâu hơn chút để đảm bảo font và layout ổn định
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(resultCardRef.current, {
        scale: 4, // Tăng độ phân giải lên 4x (đủ nét cho Facebook/Instagram)
        backgroundColor: '#fffef0', // Màu nền cứng, tránh trong suốt
        useCORS: true,
        logging: false,
        // Cố gắng lấy chiều rộng tốt hơn nếu đang trên mobile
        windowWidth: resultCardRef.current.scrollWidth > 500 ? resultCardRef.current.scrollWidth : 500
      });

      // Tạo tên file
      const fileName = `Loc-Ma-Dao-${userInput.year}-${Date.now()}.png`;

      // Kiểm tra xem trình duyệt có hỗ trợ Web Share API với Files không
      // Tính năng này giúp share trực tiếp lên Zalo/Messenger/Instagram thay vì chỉ tải về
      if (navigator.share) {
         canvas.toBlob(async (blob) => {
            if (blob) {
                const file = new File([blob], fileName, { type: 'image/png' });
                try {
                    await navigator.share({
                        title: 'Gieo Quẻ Mã Đáo Thành Công',
                        text: 'Năm mới xem thử vận hạn thế nào nè các bạn ơi! 🧧',
                        files: [file]
                    });
                } catch (shareError) {
                    // Nếu user hủy share hoặc lỗi, fallback về download truyền thống
                    console.log("Share cancelled or failed, downloading instead.");
                    const image = canvas.toDataURL("image/png");
                    const link = document.createElement("a");
                    link.href = image;
                    link.download = fileName;
                    link.click();
                }
            }
         }, 'image/png');
      } else {
        // Fallback cho trình duyệt cũ (Desktop)
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = fileName;
        link.click();
      }

    } catch (error) {
      console.error("Capture failed:", error);
      alert("Ui da, máy ảnh bị kẹt! Bạn thử chụp màn hình thủ công nha.");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen font-body text-white overflow-x-hidden relative flex flex-col items-center py-8 px-4">
      {/* Trang trí nền */}
      <Lantern className="absolute top-0 left-4 animate-swing origin-top" />
      <Lantern className="absolute top-0 right-4 animate-swing origin-top delay-700" />
      <BlossomBranch className="absolute top-10 -left-10 opacity-70" />
      <BlossomBranch className="absolute top-10 -right-10 opacity-70" flipped />

      {/* HIỆU ỨNG MƯA TÀI LỘC - Chỉ hiện khi có kết quả */}
      {appState === AppState.RESULT && <FallingDecor />}
      
      <header className="text-center z-10 mt-4 mb-8">
        <h1 className="font-display text-5xl md:text-7xl text-tet-gold drop-shadow-[0_2px_10px_rgba(255,215,0,0.5)] mb-2 uppercase">GIEO QUẺ</h1>
        <h2 className="font-display text-2xl md:text-3xl text-white tracking-widest uppercase italic">Mã Đáo Thành Công</h2>
        <p className="text-yellow-200 mt-2 text-sm md:text-base opacity-90 font-bold">"Giải mã vận mệnh - Đón lộc đầu xuân"</p>
      </header>

      <main className="w-full max-w-lg z-10 relative">
        <div className="bg-red-900/90 border-4 border-yellow-500 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-sm border-double relative">
          {/* Góc trang trí */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-yellow-400"></div>
          <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-yellow-400"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-yellow-400"></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-yellow-400"></div>

          {appState === AppState.INPUT && (
            <div className="flex flex-col gap-8 animate-fadeIn py-4">
              <div className="text-center">
                <p className="text-xl mb-2 font-bold text-yellow-100">Khai mở bí mật của bạn</p>
                <p className="text-xs text-yellow-300/80 italic">Cung cấp sinh nhật để Thần Toán luận giải thiên cơ</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['day', 'month', 'year'].map(field => (
                  <div key={field} className="flex flex-col gap-2">
                    <label className="text-[10px] text-yellow-400 font-bold uppercase text-center">{field === 'day' ? 'Ngày' : field === 'month' ? 'Tháng' : 'Năm'}</label>
                    <input
                      type="number"
                      name={field}
                      placeholder="--"
                      value={(userInput as any)[field]}
                      onChange={handleInputChange}
                      className="bg-red-950 border-2 border-yellow-600 rounded-xl p-4 text-center text-2xl text-yellow-100 placeholder-red-800 focus:outline-none focus:border-yellow-300 shadow-inner"
                    />
                  </div>
                ))}
              </div>
              {error && <p className="text-yellow-200 bg-red-800 p-3 rounded-lg text-center text-sm font-bold border-2 border-red-500 animate-shake">{error}</p>}
              <button onClick={startRace} className="mt-4 bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 hover:scale-105 text-red-950 font-display font-bold text-3xl py-5 rounded-full shadow-[0_5px_15px_rgba(255,215,0,0.4)] transform transition active:scale-95">🎲 XIN QUẺ</button>
            </div>
          )}

          {appState === AppState.RACING && (
            <div className="py-10 text-center">
               <h3 className="text-2xl font-display text-yellow-300 mb-6 animate-pulse uppercase tracking-widest">Ngựa đang thỉnh lộc...</h3>
               <HorseAnimation isRunning={true} onFinish={handleRaceFinished} />
               <div className="mt-8 flex justify-center gap-2">
                  {[1, 2, 3].map(i => <div key={i} className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
               </div>
            </div>
          )}

          {appState === AppState.LOADING_RESULT && (
            <div className="py-16 flex flex-col items-center justify-center space-y-6">
               <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-display text-2xl text-yellow-400 font-bold">LINH</div>
               </div>
               {/* Thông báo cụ thể hơn để người dùng biết tại sao phải đợi */}
               <div className="text-center px-4 w-full">
                  <p key={loadingMessage} className="text-xl font-display text-yellow-300 animate-fadeIn uppercase tracking-wider min-h-[3rem] flex items-center justify-center">
                    {loadingMessage}
                  </p>
                  <p className="text-xs text-yellow-200/60 mt-2 italic">(Đừng tắt máy kẻo mất lộc nha)</p>
               </div>
            </div>
          )}

          {appState === AppState.RESULT && result && (
            <div className="flex flex-col items-center animate-fadeIn w-full">
              {/* Thêm ref vào div này để html2canvas chụp đúng phần thẻ kết quả */}
              <div 
                  ref={resultCardRef} 
                  className={`bg-[#fffef0] text-red-950 p-6 rounded-xl shadow-[0_10px_50px_rgba(0,0,0,0.5)] w-full border-4 border-double border-red-800 relative overflow-hidden transition-all ${isCapturing ? 'min-w-[500px] max-w-[600px] mx-auto' : 'w-full'}`}
              >
                 {/* Họa tiết nền quẻ */}
                 <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Coin className="w-20 h-20" />
                 </div>

                 <div className="text-center mb-4 relative">
                   <div className="flex justify-center flex-wrap gap-2 mb-2">
                      <span className="bg-red-800 text-yellow-200 text-[10px] px-3 py-1 rounded-full font-bold shadow-sm">{result.interpretation.zodiac}</span>
                      <span className="bg-blue-800 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-sm">{result.interpretation.element}</span>
                      <span className="bg-amber-600 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-sm">Số: {result.interpretation.destinyNumber}</span>
                   </div>
                   <h2 className="text-5xl font-display text-red-700 uppercase mb-2 drop-shadow-sm leading-tight">{result.fortune.name}</h2>
                   <div className="h-0.5 w-1/2 bg-red-800/20 mx-auto mb-2"></div>
                   <p className="text-xs font-bold italic text-red-900 bg-yellow-400/20 px-4 py-1.5 rounded-lg border border-red-800/10 inline-block">
                      “{result.interpretation.personality}”
                   </p>
                 </div>

                 <div className="space-y-4">
                    {/* LOGIC QUAN TRỌNG: 
                        - Mặc định: flex flex-col (Dọc)
                        - Khi bấm chụp (isCapturing): grid grid-cols-2 (Lưới)
                    */}
                    <div className={isCapturing ? "grid grid-cols-2 gap-3" : "flex flex-col gap-4"}>
                      {[
                        { label: 'CÔNG DANH', icon: <ScrollIcon className="w-6 h-6" />, text: result.interpretation.career, theme: 'border-red-200 bg-red-50/50' },
                        { label: 'TÀI LỘC', icon: <LuckyBagIcon className="w-6 h-6" />, text: result.interpretation.money, theme: 'border-amber-200 bg-amber-50/50' },
                        { label: 'GIA ĐẠO', icon: <LotusIcon className="w-6 h-6" />, text: result.interpretation.love, theme: 'border-rose-200 bg-rose-50/50' },
                        { label: 'SỨC KHỎE', icon: <GourdIcon className="w-6 h-6" />, text: result.interpretation.health, theme: 'border-emerald-200 bg-emerald-50/50' }
                      ].map((item, idx) => (
                        <div key={idx} className={`${item.theme} ${isCapturing ? 'p-3' : 'p-4'} rounded-xl border-2 shadow-sm relative overflow-hidden transition-all hover:shadow-md`}>
                          <h4 className="font-display text-red-800 text-sm flex items-center mb-1 uppercase tracking-tighter">
                            <span className="mr-2">{item.icon}</span> {item.label}
                          </h4>
                          {/* ĐÃ XÓA line-clamp, HIỆN FULL TEXT */}
                          <p className={`text-gray-800 leading-relaxed font-medium ${isCapturing ? 'text-xs' : 'text-sm'}`}>{item.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-1">
                      {[
                        { l: 'MÀU MAY', v: result.interpretation.luckyColor, c: 'text-indigo-700 bg-indigo-50' },
                        { l: 'SỐ TÀI', v: result.interpretation.luckyNumber, c: 'text-rose-700 bg-rose-50' },
                        { l: 'GIỜ VÀNG', v: result.interpretation.luckyHour, c: 'text-amber-700 bg-amber-50' }
                      ].map((m, i) => (
                        <div key={i} className={`${m.c} p-1.5 rounded-lg border border-current/20 text-center shadow-sm flex flex-col justify-center`}>
                           <span className="text-[8px] uppercase font-black block mb-0.5 opacity-70">{m.l}</span>
                           {/* Xóa class truncate, thêm break-words và leading-tight để xuống dòng */}
                           <p className="text-[10px] font-black leading-tight break-words">{m.v}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-red-900 text-yellow-100 p-2 rounded-lg border-2 border-yellow-500 shadow-md text-center">
                      <p className="text-xs font-bold italic">
                        🎯 Mật chỉ: {result.interpretation.warning}
                      </p>
                    </div>

                    <div className="py-4 text-center border-t-4 border-double border-red-800/20 mt-2 relative">
                       <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fffef0] px-2 text-red-800 font-display text-[10px]">SẤM TRUYỀN</div>
                       <p className="font-display text-red-800 italic text-lg leading-relaxed whitespace-pre-wrap drop-shadow-sm">
                          “{result.interpretation.poem}”
                       </p>
                    </div>
                    
                    {/* Watermark khi chụp ảnh - Sẽ chỉ hiện khi isCapturing = true */}
                    {isCapturing && (
                       <div className="text-center opacity-70 text-[10px] font-bold text-red-900 pt-2 border-t border-red-200 mt-2 font-body">
                           ✨ nhattruong.ngn ft. AI Thần Toán (uy tín luôn) ✨
                       </div>
                    )}
                 </div>
              </div>

              <div className="flex gap-4 mt-8 w-full pb-4">
                <button onClick={resetApp} className="flex-1 bg-red-950 border-2 border-yellow-500 text-yellow-500 font-bold py-4 rounded-2xl hover:bg-black transition shadow-xl active:translate-y-1">GIEO LẠI</button>
                <button 
                  onClick={handleCapture} 
                  disabled={isCapturing}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-red-950 font-bold py-4 rounded-2xl shadow-xl active:translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCapturing ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-red-950 border-t-transparent rounded-full"></span>
                      ĐANG LƯU...
                    </>
                  ) : (
                    <>📸 LƯU/SHARE</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-8 text-yellow-200/40 text-[10px] text-center z-10 flex flex-col gap-1">
        <p>nhattruong.ngn ft. AI Thần Toán (uy tín luôn)</p>
        <p>© 2026 - Mã Đáo Thành Công - Vạn Sự Như Ý</p>
      </footer>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255, 215, 0, 0.3); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255, 215, 0, 0.5); }
      `}</style>
    </div>
  );
};

export default App;
