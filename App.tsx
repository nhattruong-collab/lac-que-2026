
import React, { useState, useRef, useEffect } from 'react';
import { AppState, UserInput, FortuneResult, FortuneData, FortuneContent } from './types';
import { FORTUNES } from './constants';
import { getFortuneInterpretation } from './services/geminiService';
import { Lantern, DecorativeBranch, Coin, ScrollIcon, LuckyBagIcon, LotusIcon, GourdIcon, FallingDecor } from './components/TetDecor';
import { HorseAnimation } from './components/HorseAnimation';
import html2canvas from 'html2canvas';

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
  
  // States cho việc xáo quẻ (shuffling)
  const [currentShuffleIdx, setCurrentShuffleIdx] = useState(0);
  const shuffleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const fortunePromiseRef = useRef<Promise<FortuneContent> | null>(null);
  const selectedFortuneRef = useRef<FortuneData | null>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);

  const dayInputRef = useRef<HTMLInputElement>(null);
  const monthInputRef = useRef<HTMLInputElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (appState === AppState.LOADING_RESULT) {
      interval = setInterval(() => {
        const randomMsg = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
        setLoadingMessage(randomMsg);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [appState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const maxLength = name === 'year' ? 4 : 2;
    const truncatedValue = value.slice(0, maxLength);
    setUserInput(prev => ({ ...prev, [name]: truncatedValue }));
    setError('');
    if (truncatedValue.length >= 2) {
      if (name === 'day') monthInputRef.current?.focus();
      else if (name === 'month') yearInputRef.current?.focus();
    }
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

  const startShuffling = () => {
    if (!validateInput()) return;
    setAppState(AppState.SHUFFLING);
    
    // Xoay nhanh tên quẻ để tạo hiệu ứng random
    if (shuffleIntervalRef.current) clearInterval(shuffleIntervalRef.current);
    shuffleIntervalRef.current = setInterval(() => {
      setCurrentShuffleIdx(prev => (prev + 1) % FORTUNES.length);
    }, 80); 
  };

  const stopShuffling = () => {
    if (shuffleIntervalRef.current) {
      clearInterval(shuffleIntervalRef.current);
      shuffleIntervalRef.current = null;
    }

    // Chọn quẻ hiện tại
    const pickedFortune = FORTUNES[currentShuffleIdx];
    selectedFortuneRef.current = pickedFortune;
    
    // Bắt đầu gọi AI giải quẻ
    fortunePromiseRef.current = getFortuneInterpretation(userInput, pickedFortune);
    
    // Chuyển sang cảnh ngựa chạy về đích (Racing)
    setAppState(AppState.RACING);
  };

  const handleRaceFinished = async () => {
    setAppState(AppState.LOADING_RESULT);
    try {
      if (fortunePromiseRef.current && selectedFortuneRef.current) {
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
    setIsCapturing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const canvas = await html2canvas(resultCardRef.current, {
        scale: 4,
        backgroundColor: '#fffef0',
        useCORS: true,
        logging: false,
        windowWidth: resultCardRef.current.scrollWidth > 500 ? resultCardRef.current.scrollWidth : 500
      });
      const fileName = `Loc-Ma-Dao-${userInput.year}-${Date.now()}.png`;
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
                    const image = canvas.toDataURL("image/png");
                    const link = document.createElement("a");
                    link.href = image;
                    link.download = fileName;
                    link.click();
                }
            }
         }, 'image/png');
      } else {
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
    <div className="min-h-screen font-body text-white overflow-x-hidden relative flex flex-col items-center pt-1 pb-8 px-4">
      <DecorativeBranch type="peach" position="top-left" className="absolute top-0 left-0 w-32 md:w-64 h-auto z-0 opacity-90" />
      <DecorativeBranch type="apricot" position="top-right" className="absolute top-0 right-0 w-32 md:w-64 h-auto z-0 opacity-90" />
      <DecorativeBranch type="apricot" position="bottom-left" className="hidden md:block absolute bottom-0 left-0 w-48 h-auto z-0 opacity-60" />
      <DecorativeBranch type="peach" position="bottom-right" className="hidden md:block absolute bottom-0 right-0 w-48 h-auto z-0 opacity-60" />

      <Lantern className="absolute top-0 left-16 md:left-16 animate-swing origin-top z-1" />
      <Lantern className="absolute top-0 right-16 md:right-16 animate-swing origin-top delay-700 z-1" />

      {appState === AppState.RESULT && <FallingDecor />}
      
      <header className="text-center z-10 mt-4 mb-3 relative">
        <h1 className="font-display text-[2.2rem] md:text-[3.5rem] text-tet-gold drop-shadow-[0_2px_10px_rgba(255,215,0,0.5)] leading-none mb-0 uppercase">GIEO QUẺ</h1>
        <h2 className="font-display text-[1.05rem] md:text-[1.4rem] text-white tracking-widest uppercase italic mt-1">Mã Đáo Thành Công</h2>
        <p className="text-yellow-200 mt-1 text-xs md:text-sm opacity-90 font-bold">"Check nhân phẩm - Hốt lộc đầu năm"</p>
      </header>

      <main className="w-full max-w-lg z-10 relative">
        <div className="bg-red-900/90 border-4 border-yellow-500 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-sm border-double relative min-h-[400px] flex flex-col justify-center">
          <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-yellow-400"></div>
          <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-yellow-400"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-yellow-400"></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-yellow-400"></div>

          {appState === AppState.INPUT && (
            <div className="flex flex-col gap-8 animate-fadeIn py-4">
              <div className="text-center pt-4">
                <p className="text-xl mb-2 font-bold text-yellow-100">Vũ trụ đang gọi tên bạn</p>
                <p className="text-xs text-yellow-300/80 italic">Nhập sinh nhật để AI Thần Toán "check var" vận mệnh</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['day', 'month', 'year'].map((name) => (
                  <div key={name} className="flex flex-col gap-2">
                    <label className="text-[10px] text-yellow-400 font-bold uppercase text-center">
                      {name === 'day' ? 'Ngày' : name === 'month' ? 'Tháng' : 'Năm'}
                    </label>
                    <input
                      ref={name === 'day' ? dayInputRef : name === 'month' ? monthInputRef : yearInputRef}
                      type="number"
                      name={name}
                      placeholder={name === 'year' ? '----' : '--'}
                      value={(userInput as any)[name]}
                      onChange={handleInputChange}
                      className="bg-red-950 border-2 border-yellow-600 rounded-xl p-4 text-center text-2xl text-yellow-100 placeholder-red-800 focus:outline-none focus:border-yellow-300 shadow-inner w-full"
                    />
                  </div>
                ))}
              </div>
              {error && <p className="text-yellow-200 bg-red-800 p-3 rounded-lg text-center text-sm font-bold border-2 border-red-500 animate-shake">{error}</p>}
              <button onClick={startShuffling} className="mt-4 bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 hover:scale-105 text-red-950 font-display font-bold text-3xl py-5 rounded-full shadow-[0_5px_15px_rgba(255,215,0,0.4)] transform transition active:scale-95">🎲 THỈNH QUẺ</button>
            </div>
          )}

          {appState === AppState.SHUFFLING && (
            <div className="flex flex-col items-center py-8 animate-fadeIn w-full overflow-hidden">
               <h3 className="text-2xl font-display text-yellow-300 mb-8 uppercase tracking-widest text-center animate-pulse">Vạn quẻ tùy duyên...</h3>
               
               <HorseAnimation 
                 isRunning={true} 
                 onFinish={() => {}} 
                 mode="run-across"
                 shufflingName={FORTUNES[currentShuffleIdx].name}
                 loop={true}
               />
               
               <button onClick={stopShuffling} className="mt-8 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-display font-bold text-3xl py-6 px-16 rounded-full shadow-[0_10px_30px_rgba(220,38,38,0.5)] border-4 border-yellow-500 transform transition hover:scale-110 active:scale-95 animate-pulse relative z-30">
                 🛑 DỪNG LẠI
               </button>
            </div>
          )}

          {appState === AppState.RACING && (
            <div className="py-10 text-center animate-fadeIn w-full overflow-hidden">
               <h3 className="text-2xl font-display text-yellow-300 mb-6 uppercase tracking-widest">Ngựa đang rước lộc về...</h3>
               <div className="mb-4 text-5xl font-display text-white drop-shadow-[0_5px_15px_rgba(255,255,255,0.4)] bg-red-950/50 py-3 rounded-xl border-2 border-yellow-500/30">
                  {selectedFortuneRef.current?.name}
               </div>
               <HorseAnimation 
                  isRunning={true} 
                  onFinish={handleRaceFinished} 
                  mode="run-across" 
                  shufflingName={selectedFortuneRef.current?.name}
                  loop={false}
               />
            </div>
          )}

          {appState === AppState.LOADING_RESULT && (
            <div className="py-16 flex flex-col items-center justify-center space-y-6 animate-fadeIn">
               <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-display text-2xl text-yellow-400 font-bold">LINH</div>
               </div>
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
              <div 
                  ref={resultCardRef} 
                  className={`bg-[#fffef0] text-red-950 p-6 rounded-xl shadow-[0_10px_50px_rgba(0,0,0,0.5)] w-full border-4 border-double border-red-800 relative overflow-hidden transition-all ${isCapturing ? 'min-w-[500px] max-w-[600px] mx-auto' : 'w-full'}`}
              >
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
        <p>App này để giải trí, check nhân phẩm cho vui. Không cổ xúy mê tín dị đoan nha mấy keo! ✨</p>
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
