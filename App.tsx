import React, { useState, useRef } from 'react';
import { AppState, UserInput, FortuneResult, FortuneData, FortuneContent } from './types';
import { FORTUNES, TET_WISHES } from './constants';
import { getFortuneInterpretation } from './services/geminiService';
import { Lantern, BlossomBranch, Coin } from './components/TetDecor';
import { HorseAnimation } from './components/HorseAnimation';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [userInput, setUserInput] = useState<UserInput>({ day: '', month: '', year: '' });
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [error, setError] = useState<string>('');

  // Refs để lưu trữ Promise của AI và Quẻ đã chọn khi chạy song song
  const fortunePromiseRef = useRef<Promise<FortuneContent> | null>(null);
  const selectedFortuneRef = useRef<FortuneData | null>(null);

  // Audio for effect (optional, handled visually mostly)
  const shakeRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInput(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateInput = (): boolean => {
    const d = parseInt(userInput.day);
    const m = parseInt(userInput.month);
    const y = parseInt(userInput.year);

    if (isNaN(d) || d < 1 || d > 31) {
      setError('Ngày sinh không hợp lệ');
      return false;
    }
    if (isNaN(m) || m < 1 || m > 12) {
      setError('Tháng sinh không hợp lệ');
      return false;
    }
    if (isNaN(y) || y < 1900 || y > new Date().getFullYear()) {
      setError('Năm sinh không hợp lệ');
      return false;
    }
    return true;
  };

  const startRace = () => {
    if (!validateInput()) return;

    // 1. CHỌN QUẺ NGAY LẬP TỨC
    const randomIndex = Math.floor(Math.random() * FORTUNES.length);
    const selectedFortune = FORTUNES[randomIndex];
    selectedFortuneRef.current = selectedFortune;

    // 2. GỌI AI NGAY LẬP TỨC (Parallel Execution)
    fortunePromiseRef.current = getFortuneInterpretation(userInput, selectedFortune);

    // 3. BẮT ĐẦU HIỆU ỨNG NGỰA CHẠY
    setAppState(AppState.RACING);
  };

  const handleRaceFinished = async () => {
    // Ngựa đã chạy xong (khoảng 7.5s).
    setAppState(AppState.LOADING_RESULT);

    try {
        if (fortunePromiseRef.current && selectedFortuneRef.current) {
            const interpretation = await fortunePromiseRef.current;

            setResult({
              fortune: selectedFortuneRef.current,
              interpretation
            });
            
            setAppState(AppState.RESULT);
        }
    } catch (err) {
        console.error("Error getting fortune:", err);
        // Fallback an toàn
        setResult({
            fortune: selectedFortuneRef.current || FORTUNES[0],
            interpretation: {
                career: "Mạng hơi nghẽn chút xíu, nhưng quẻ báo năm nay bạn cực kỳ kiên nhẫn.",
                money: "Tiền tài vẫn đang trên đường tới, chờ chút nhé!",
                love: "Tình yêu rực rỡ như hoa mai nở muộn.",
                poem: "Mạng lag nhưng lộc vẫn về\nCả năm vui vẻ hả hê cười đùa"
            }
        });
        setAppState(AppState.RESULT);
    }
  };

  const resetApp = () => {
    setAppState(AppState.INPUT);
    setResult(null);
    setUserInput({ day: '', month: '', year: '' });
    fortunePromiseRef.current = null;
    selectedFortuneRef.current = null;
  };

  return (
    <div className="min-h-screen font-body text-white overflow-x-hidden relative flex flex-col items-center py-8 px-4">
      {/* Decorative Background Elements */}
      <Lantern className="absolute top-0 left-4 animate-swing origin-top" />
      <Lantern className="absolute top-0 right-4 animate-swing origin-top delay-700" />
      <BlossomBranch className="absolute top-10 -left-10 opacity-80" />
      <BlossomBranch className="absolute top-10 -right-10 opacity-80" flipped />
      
      {/* Header */}
      <header className="text-center z-10 mt-4 mb-8">
        <h1 className="font-display text-4xl md:text-6xl text-tet-gold drop-shadow-md mb-2">
            Gieo Quẻ
        </h1>
        <h2 className="font-display text-2xl md:text-3xl text-white uppercase tracking-wider">
            Mã Đáo Thành Công
        </h2>
        <p className="text-yellow-200 mt-2 text-sm md:text-base italic opacity-90">
            "Ngựa chiến chạy KPI, mang lộc siêu to về ví!"
        </p>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-lg bg-red-800/90 border-4 border-yellow-500 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,215,0,0.5)] z-10 relative backdrop-blur-sm">
        
        {/* Decorative Corners */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 border-yellow-400"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 border-yellow-400"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 border-yellow-400"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 border-yellow-400"></div>

        {appState === AppState.INPUT && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="text-center">
              <p className="text-lg mb-4">Nhập ngày tháng năm sinh để Ngựa Thần mang quẻ về cho bạn nhé!</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-xs text-yellow-300 mb-1 font-bold">Ngày</label>
                <input
                  type="number"
                  name="day"
                  placeholder="DD"
                  value={userInput.day}
                  onChange={handleInputChange}
                  className="bg-red-900 border-2 border-yellow-600 rounded-lg p-3 text-center text-xl text-yellow-100 placeholder-red-400 focus:outline-none focus:border-yellow-300 transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-yellow-300 mb-1 font-bold">Tháng</label>
                <input
                  type="number"
                  name="month"
                  placeholder="MM"
                  value={userInput.month}
                  onChange={handleInputChange}
                  className="bg-red-900 border-2 border-yellow-600 rounded-lg p-3 text-center text-xl text-yellow-100 placeholder-red-400 focus:outline-none focus:border-yellow-300 transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-yellow-300 mb-1 font-bold">Năm</label>
                <input
                  type="number"
                  name="year"
                  placeholder="YYYY"
                  value={userInput.year}
                  onChange={handleInputChange}
                  className="bg-red-900 border-2 border-yellow-600 rounded-lg p-3 text-center text-xl text-yellow-100 placeholder-red-400 focus:outline-none focus:border-yellow-300 transition-colors"
                />
              </div>
            </div>

            {error && <p className="text-yellow-200 bg-red-900/50 p-2 rounded text-center text-sm font-bold border border-red-500">{error}</p>}

            <button
              onClick={startRace}
              className="mt-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-red-900 font-display font-bold text-2xl py-4 rounded-full shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>🎲</span> Xin Quẻ Ngay
            </button>
          </div>
        )}

        {appState === AppState.RACING && (
          <div className="py-8 text-center">
             <h3 className="text-2xl font-display text-yellow-300 mb-4 animate-bounce">
               Ngựa đang chạy deadline lấy quẻ...
             </h3>
             <HorseAnimation isRunning={true} onFinish={handleRaceFinished} />
             <p className="text-sm text-yellow-100 mt-4 italic">
               "Đường xa mới biết ngựa cày KPI..."
             </p>
          </div>
        )}

        {appState === AppState.LOADING_RESULT && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
             <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
             <p className="text-lg font-display text-yellow-300">Đang mở quẻ...</p>
          </div>
        )}

        {appState === AppState.RESULT && result && (
          <div className="flex flex-col items-center animate-slideUp w-full">
            
            {/* The Card - Giấy Điệp Cream Background */}
            <div className="bg-[#fffdf5] text-red-900 p-4 rounded-lg shadow-2xl w-full text-center border-4 border-double border-red-700 relative overflow-hidden">
               {/* Họa tiết chìm */}
               <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
                    style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h2v2H1V1zm4 4h2v2H5V5zm4 4h2v2H9V9zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2z' fill='%23d00000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")"}}>
               </div>
               
               <div className="mb-4 relative z-10">
                 <span className="inline-block bg-red-800 text-yellow-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-2 border border-yellow-500">
                   Quẻ Số {Math.floor(Math.random() * 90) + 10}
                 </span>
                 <h2 className="text-4xl md:text-5xl font-display text-red-700 uppercase drop-shadow-sm mb-2">
                   {result.fortune.name}
                 </h2>
                 <div className="flex items-center justify-center gap-2 opacity-80">
                    <div className="h-px bg-red-800 w-12"></div>
                    <span className="text-red-800 text-xl">❀</span>
                    <div className="h-px bg-red-800 w-12"></div>
                 </div>
               </div>

               <div className="flex flex-col gap-4 text-left relative z-10">
                  
                  {/* Công danh & Sự nghiệp - Đỏ May Mắn */}
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200 border-l-4 border-l-red-600 shadow-sm hover:shadow-md transition-shadow">
                     <h4 className="flex items-center text-red-800 font-bold mb-2 font-display uppercase tracking-wide border-b border-red-200 pb-1">
                        <span className="text-2xl mr-2">💼</span> Công Danh
                     </h4>
                     <p className="text-sm md:text-base text-gray-800 leading-relaxed font-medium">
                        {result.interpretation.career}
                     </p>
                  </div>

                  {/* Tiền tài - Vàng Hổ Phách */}
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
                     <h4 className="flex items-center text-amber-800 font-bold mb-2 font-display uppercase tracking-wide border-b border-amber-200 pb-1">
                        <span className="text-2xl mr-2">💰</span> Tiền Tài
                     </h4>
                     <p className="text-sm md:text-base text-gray-800 leading-relaxed font-medium">
                        {result.interpretation.money}
                     </p>
                  </div>

                   {/* Tình yêu - Hồng Đào */}
                   <div className="bg-rose-50 p-4 rounded-lg border border-rose-200 border-l-4 border-l-rose-400 shadow-sm hover:shadow-md transition-shadow">
                     <h4 className="flex items-center text-rose-700 font-bold mb-2 font-display uppercase tracking-wide border-b border-rose-200 pb-1">
                        <span className="text-2xl mr-2">❤️</span> Tình Duyên
                     </h4>
                     <p className="text-sm md:text-base text-gray-800 leading-relaxed font-medium">
                        {result.interpretation.love}
                     </p>
                  </div>

                  {/* Thơ - Phong cách thư pháp */}
                  <div className="mt-2 text-center relative py-4 px-2 bg-yellow-50/50 rounded-xl border border-dashed border-red-300">
                     <p className="font-display text-red-800 italic text-lg md:text-xl whitespace-pre-wrap leading-relaxed">
                        “ {result.interpretation.poem} ”
                     </p>
                  </div>

               </div>
            </div>

            <div className="flex gap-4 mt-6 w-full">
              <button 
                onClick={resetApp}
                className="flex-1 bg-red-900 border-2 border-yellow-500 text-yellow-400 font-bold py-3 rounded-lg hover:bg-red-950 transition shadow-lg active:translate-y-1"
              >
                Gieo Quẻ Khác
              </button>
              <button 
                onClick={() => alert("Đã copy nội dung quẻ! Hãy gửi cho bạn bè nhé.")}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-red-900 font-bold py-3 rounded-lg hover:from-yellow-300 hover:to-yellow-500 transition shadow-lg active:translate-y-1"
              >
                Chia Sẻ Lộc
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Coins Effect */}
      <div className="fixed bottom-10 left-10 pointer-events-none opacity-50 hidden md:block">
        <Coin />
      </div>
      <div className="fixed top-1/2 right-10 pointer-events-none opacity-50 hidden md:block delay-500">
        <Coin className="w-12 h-12" />
      </div>

      <footer className="mt-8 text-yellow-200/60 text-xs text-center z-10">
        <p>© 2026 Bói Vui Ngày Tết. Ứng dụng chỉ mang tính chất giải trí.</p>
        <p>Kết hợp công nghệ AI Gemini</p>
      </footer>
    </div>
  );
};

export default App;