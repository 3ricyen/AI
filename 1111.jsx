import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, RefreshCcw, Gift, Check, PartyPopper, Download, Star, MapPin, Search, Aperture, Save } from 'lucide-react';

// --- CSS Styles ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700;900&family=Fredoka+One&display=swap');
  
  body {
    font-family: 'Noto Sans TC', sans-serif;
    background: radial-gradient(circle at top, #1a4c3d 0%, #0f2b22 100%);
    color: #fff;
    overflow-x: hidden;
    margin: 0;
    min-height: 100vh;
  }

  /* Snowfall Effect */
  .snowflake {
    position: fixed;
    top: -10px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.2em;
    z-index: 0;
    user-select: none;
    cursor: default;
    animation: snowflakes-fall 10s linear infinite, snowflakes-shake 3s ease-in-out infinite;
  }
  @keyframes snowflakes-fall { 0% { top: -10%; } 100% { top: 100%; } }
  @keyframes snowflakes-shake { 0% { transform: translateX(0px); } 50% { transform: translateX(80px); } 100% { transform: translateX(0px); } }
  
  .snowflake:nth-of-type(1) { left: 10%; animation-delay: 0s, 0s; font-size: 1.5em; }
  .snowflake:nth-of-type(2) { left: 20%; animation-delay: 1s, 1s; font-size: 1em; }
  .snowflake:nth-of-type(3) { left: 30%; animation-delay: 6s, 0.5s; font-size: 2em; }
  .snowflake:nth-of-type(4) { left: 40%; animation-delay: 4s, 2s; font-size: 1.2em; }
  .snowflake:nth-of-type(5) { left: 50%; animation-delay: 2s, 2s; font-size: 1.8em; }
  .snowflake:nth-of-type(6) { left: 60%; animation-delay: 8s, 3s; font-size: 1em; }
  .snowflake:nth-of-type(7) { left: 70%; animation-delay: 6s, 2s; font-size: 1.4em; }
  .snowflake:nth-of-type(8) { left: 80%; animation-delay: 1s, 0s; font-size: 1.6em; }
  .snowflake:nth-of-type(9) { left: 90%; animation-delay: 3s, 1.5s; font-size: 1.2em; }

  /* 3D Game Buttons */
  .btn-3d {
    transition: all 0.1s;
    position: relative;
    top: 0;
  }
  .btn-3d:active:not(:disabled) {
    top: 4px;
    box-shadow: 0 0px 0 0 rgba(0,0,0,0.2) !important;
  }

  /* Specific Button Colors */
  .btn-red { background-color: #ef4444; color: white; box-shadow: 0 6px 0 0 #991b1b; border-radius: 1rem; }
  .btn-green { background-color: #22c55e; color: white; box-shadow: 0 6px 0 0 #15803d; border-radius: 1rem; }
  .btn-gold { background-color: #fbbf24; color: #451a03; box-shadow: 0 6px 0 0 #b45309; border-radius: 1rem; }
  .btn-white { background-color: #ffffff; color: #0f392b; box-shadow: 0 6px 0 0 #cbd5e1; border-radius: 1rem; border: 2px solid #e2e8f0; }
  .btn-blue { background-color: #3b82f6; color: white; box-shadow: 0 6px 0 0 #1d4ed8; border-radius: 1rem; }

  /* Card Styles */
  .game-card {
    background: rgba(255, 255, 255, 0.95);
    border: 4px solid #e5e7eb;
    box-shadow: 0 8px 0 rgba(0,0,0,0.2);
    border-radius: 1.5rem;
  }

  /* Christmas Pattern Overlay */
  .bg-pattern {
    background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  /* Grid Cell 3D */
  .grid-cell { transition: transform 0.1s; }
  .grid-cell:active { transform: scale(0.95); }

  /* Animations */
  @keyframes pop-in {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  .animate-pop { animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

  .text-shadow-sm { text-shadow: 2px 2px 0px rgba(0,0,0,0.2); }
`;

// --- Data ---
const QUESTIONS = [
  {
    id: 1,
    text: "旅途中遇到熱情的陌生人問路，你會怎麼應對？",
    options: [
      { text: "開心地順便聊一下他的旅程？", value: "E" },
      { text: "有禮貌地回答但不延伸話題？", value: "I" }
    ]
  },
  {
    id: 2,
    text: "朋友說要創業，你第一個問題會是？",
    options: [
      { text: "你對未來有什麼想像？", value: "N" },
      { text: "你有試算成本跟利潤嗎？", value: "S" }
    ]
  },
  {
    id: 3,
    text: "你覺得一段關係裡最重要的是？",
    options: [
      { text: "誠實地溝通問題並尋找最佳解決方式？", value: "T" },
      { text: "理解彼此的感受與情緒？", value: "F" }
    ]
  },
  {
    id: 4,
    text: "當事情有截止日時，你通常會怎麼處理？",
    options: [
      { text: "前幾天就完成?", value: "J" },
      { text: "最後一天爆發超強效率？", value: "P" }
    ]
  },
  {
    id: 5,
    text: "跨年夜晚上，你更傾向怎麼度過？",
    options: [
      { text: "找最要好的摯友們一起狂歡倒數迎接新年。", value: "E" },
      { text: "留下精心時刻給自己或重要的人。", value: "I" }
    ]
  },
  {
    id: 6,
    text: "和另一半交往，你/妳更重視的是？",
    options: [
      { text: "相處是否開心，感受上能被照顧與支持。", value: "P" },
      { text: "對未來是否有共同目標和共識。", value: "J" }
    ]
  },
  {
    id: 7,
    text: "交換禮物收到的禮物，哪一樣你更喜歡？",
    options: [
      { text: "外型好看且實用性高。", value: "S" },
      { text: "讓你意想不到卻驚喜的創意禮品。", value: "N" }
    ]
  },
  {
    id: 8,
    text: "當遇到朋友和你吐苦水時，你傾向於",
    options: [
      { text: "關心他的心情狀態，給予安慰和支持。", value: "F" },
      { text: "較聚焦在如何協助他解決問題。", value: "T" }
    ]
  }
];

// --- Components ---

// 0. Landing Phase (Cover Page)
const LandingPhase = ({ onStart }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleStart = async () => {
        setIsLoading(true);
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (err) {
            console.error("Camera permission denied or error:", err);
        }
        setIsLoading(false);
        onStart();
    };

    return (
        <div className="flex flex-col h-full items-center justify-center p-6 text-center animate-pop relative">
            <div className="absolute top-10 left-10 text-yellow-300 opacity-50 animate-pulse">
                <Star size={40} />
            </div>
            <div className="absolute bottom-20 right-10 text-yellow-300 opacity-50 animate-pulse" style={{animationDelay: '1s'}}>
                <Star size={30} />
            </div>

            <div className="game-card p-8 mb-8 transform -rotate-2 max-w-sm w-full bg-white/90 backdrop-blur-md border-4 border-red-500">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Gift size={48} className="text-red-600" />
                </div>
                <h1 className="text-4xl font-black text-gray-800 mb-2 leading-tight">
                    MBTI<br/><span className="text-red-600">聖誕連連看</span>
                </h1>
                <p className="text-gray-500 font-bold mb-6">
                    尋找你的靈魂夥伴<br/>完成九宮格連線！
                </p>
                <div className="flex justify-center gap-2 mb-2">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">#心理測驗</span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">#聖誕派對</span>
                </div>
            </div>

            <button 
                onClick={handleStart}
                disabled={isLoading}
                className="w-full max-w-xs py-4 text-xl font-black btn-3d btn-gold shadow-xl flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <span>載入中...</span>
                ) : (
                    <>
                        <span>開始遊戲</span>
                        <PartyPopper size={24} />
                    </>
                )}
            </button>
            <p className="mt-4 text-sm text-white/60 font-medium">需要開啟相機權限以進行遊戲</p>
        </div>
    );
};

// 1. Quiz Phase
const QuizPhase = ({ onComplete }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleOptionSelect = (qId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
    setTimeout(() => {
        if (currentQIndex < QUESTIONS.length - 1) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            const finalAnswers = { ...answers, [qId]: optionIndex };
            onComplete(finalAnswers);
        }
    }, 300);
  };

  const currentQ = QUESTIONS[currentQIndex];
  const progress = ((currentQIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-6 relative z-10">
      <div className="pt-4 pb-2">
        <div className="flex justify-between items-center mb-2 text-white font-bold text-shadow-sm">
          <span>MISSION {currentQIndex + 1}</span>
          <span>{QUESTIONS.length} TOTAL</span>
        </div>
        <div className="h-4 bg-black/30 rounded-full overflow-hidden border-2 border-white/20">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-red-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center animate-pop key={currentQIndex}">
        <div className="game-card p-6 mb-6 transform rotate-1">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-red-500/80 rotate-[-2deg]"></div>
          <h2 className="text-2xl font-black text-gray-800 leading-relaxed text-center mt-2">
            {currentQ.text}
          </h2>
        </div>

        <div className="space-y-4">
          {currentQ.options.map((opt, idx) => {
            const isSelected = answers[currentQ.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(currentQ.id, idx)}
                className={`w-full p-5 text-left font-bold text-lg btn-3d ${
                  isSelected ? 'btn-green transform scale-105' : 'btn-white'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 border-2 ${
                    isSelected ? 'bg-white text-green-600 border-white' : 'bg-gray-100 text-gray-400 border-gray-300'
                  }`}>
                    {idx === 0 ? 'A' : 'B'}
                  </div>
                  {opt.text}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 2. Task Detail Modal
const TaskDetailModal = ({ targetInfo, onOpenCamera, onClose }) => {
    
    const downloadExistingPhoto = () => {
        if (!targetInfo.existingPhoto) return;
        const link = document.createElement('a');
        link.download = `mbti-memory-${targetInfo.index}.jpg`;
        link.href = targetInfo.existingPhoto;
        link.click();
    };

    // Special Content for Center Cell (Index 4)
    if (targetInfo.index === 4) {
        return (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-pop">
                <div className="game-card p-0 w-full max-w-md overflow-hidden bg-white">
                    <div className="bg-yellow-500 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <Gift size={20} />
                            <span className="font-bold text-lg">特別任務</span>
                        </div>
                        <button onClick={onClose} className="bg-white/20 p-1 rounded-full hover:bg-white/30">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6">
                        <h3 className="text-2xl font-black text-gray-800 mb-4 text-center">
                            請找到跟你同樣特質的<br/>MBTI 夥伴
                        </h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">NF</div>
                                <div>
                                    <div className="font-bold text-green-800">外交家</div>
                                    <div className="text-xs text-green-600 font-bold">INFJ, INFP, ENFJ, ENFP</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                                <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">NT</div>
                                <div>
                                    <div className="font-bold text-purple-800">分析家</div>
                                    <div className="text-xs text-purple-600 font-bold">INTJ, INTP, ENTJ, ENTP</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                                <div className="w-10 h-10 rounded-full bg-yellow-400 text-white flex items-center justify-center font-bold">SP</div>
                                <div>
                                    <div className="font-bold text-yellow-800">探險家</div>
                                    <div className="text-xs text-yellow-600 font-bold">ISTP, ISFP, ESTP, ESFP</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">SJ</div>
                                <div>
                                    <div className="font-bold text-blue-800">守護者</div>
                                    <div className="text-xs text-blue-600 font-bold">ISFJ, ISTJ, ESTJ, ESFJ</div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t-2 border-dashed border-gray-200 my-4 relative">
                            <div className="absolute left-1/2 -top-3 -translate-x-1/2 bg-white px-2 text-gray-400 text-xs font-bold">
                                ACTION
                            </div>
                        </div>

                        <button 
                            onClick={onOpenCamera}
                            className="w-full py-4 text-xl font-black btn-3d btn-gold flex items-center justify-center gap-2 mb-3"
                        >
                            <Camera size={24} />
                            {targetInfo.existingPhoto ? '重新拍攝合照' : '開啟相機拍照'}
                        </button>
                        
                        {targetInfo.existingPhoto && (
                            <button 
                                onClick={downloadExistingPhoto}
                                className="w-full py-3 text-lg font-bold btn-3d btn-white flex items-center justify-center gap-2 text-gray-600"
                            >
                                <Download size={20} />
                                下載這張照片
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Standard Grid Cell
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-pop">
            <div className="game-card p-0 w-full max-w-md overflow-hidden bg-white">
                <div className="bg-red-600 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <Search size={20} />
                        <span className="font-bold text-lg">尋找任務</span>
                    </div>
                    <button onClick={onClose} className="bg-white/20 p-1 rounded-full hover:bg-white/30">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <h3 className="text-gray-500 text-xs font-bold mb-1">題目</h3>
                        <p className="text-gray-800 font-bold text-lg leading-tight mb-4">
                            {targetInfo.question.text}
                        </p>
                        
                        <div className="space-y-2">
                            {targetInfo.question.options.map((opt, idx) => {
                                const isUserAnswer = idx === targetInfo.userAnswerIndex;
                                return (
                                    <div key={idx} className={`p-3 rounded-lg border-2 flex items-center justify-between ${
                                        isUserAnswer 
                                        ? 'bg-green-50 border-green-500 text-green-800' 
                                        : 'bg-gray-50 border-transparent text-gray-400'
                                    }`}>
                                        <span className="font-bold text-sm">{opt.text}</span>
                                        {isUserAnswer && <Check size={18} className="text-green-600" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="border-t-2 border-dashed border-gray-200 my-4 relative">
                        <div className="absolute left-1/2 -top-3 -translate-x-1/2 bg-white px-2 text-gray-400 text-xs font-bold">
                            NEXT STEP
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <p className="text-gray-600 font-bold mb-1">
                            請尋找跟你一樣是 <span className="text-2xl text-red-600 font-black mx-1">{targetInfo.letter}</span> 的夥伴
                        </p>
                        <p className="text-sm text-gray-400">
                            如果確認找到夥伴請跟你的好夥伴一起合照吧
                        </p>
                    </div>

                    <button 
                        onClick={onOpenCamera}
                        className="w-full py-4 text-xl font-black btn-3d btn-green flex items-center justify-center gap-2 mb-3"
                    >
                        <Camera size={24} />
                        {targetInfo.existingPhoto ? '重新拍攝合照' : '開啟相機拍照'}
                    </button>

                    {targetInfo.existingPhoto && (
                        <button 
                            onClick={downloadExistingPhoto}
                            className="w-full py-3 text-lg font-bold btn-3d btn-white flex items-center justify-center gap-2 text-gray-600"
                        >
                            <Download size={20} />
                            下載這張照片
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// 3. Camera Modal Component
const CameraModal = ({ targetInfo, onPhotoTaken, onClose, existingPhoto }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); 
  const [tempPhoto, setTempPhoto] = useState(null);
  const [error, setError] = useState('');

  // Start Camera
  useEffect(() => {
    if (existingPhoto || tempPhoto) return; 

    const startCamera = async () => {
      try {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        const constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 1280 },
          },
          audio: false
        };
        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
        setError('');
      } catch (err) {
        console.error("Camera error:", err);
        setError('無法啟動相機，請使用上傳功能。');
      }
    };
    startCamera();
    return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
  }, [facingMode, existingPhoto, tempPhoto]);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    if (video.readyState < 2) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    const xOffset = (video.videoWidth - size) / 2;
    const yOffset = (video.videoHeight - size) / 2;

    context.save();
    if (facingMode === 'user') {
      context.translate(size, 0);
      context.scale(-1, 1);
    }
    context.drawImage(video, xOffset, yOffset, size, size, 0, 0, size, size);
    context.restore();
    
    setTempPhoto(canvas.toDataURL('image/jpeg', 0.85));
  };

  const switchCamera = () => setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  const confirmPhoto = () => onPhotoTaken(tempPhoto);
  const retake = () => setTempPhoto(null);
  
  const downloadSingle = () => {
    const link = document.createElement('a');
    link.download = `mbti-partner-${targetInfo.index}.jpg`;
    link.href = existingPhoto || tempPhoto;
    link.click();
  };

  // Review Mode (For both fresh photos and existing photos if we were to support direct review)
  if (existingPhoto || tempPhoto) {
    const displayPhoto = existingPhoto || tempPhoto;
    return (
      <div className="fixed inset-0 z-50 bg-[#0f2b22] flex flex-col animate-pop">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="relative bg-white p-2 pb-16 shadow-2xl rotate-1 max-w-sm w-full">
                <img src={displayPhoto} alt="Captured" className="w-full aspect-square object-cover bg-gray-200" />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="font-handwriting text-gray-800 font-bold text-xl transform -rotate-2">
                        My {targetInfo.index === 4 ? 'MBTI' : targetInfo.letter} Partner!
                    </p>
                </div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 shadow-md"></div>
            </div>
        </div>
        
        <div className="p-6 space-y-3 bg-black/20 backdrop-blur-md">
            {/* Added Download Button Here for Fresh Photos */}
            {!existingPhoto && (
                 <button 
                    onClick={downloadSingle} 
                    className="w-full py-3 mb-2 font-black btn-3d btn-blue flex items-center justify-center gap-2"
                 >
                    <Save size={20} />
                    先下載這張
                 </button>
            )}

          {!existingPhoto && (
            <div className="grid grid-cols-2 gap-4">
              <button onClick={retake} className="py-3 font-black btn-3d btn-white">重拍</button>
              <button onClick={confirmPhoto} className="py-3 font-black btn-3d btn-green">確認</button>
            </div>
          )}
          
          {existingPhoto && (
            <div className="grid grid-cols-2 gap-4">
              <button onClick={downloadSingle} className="py-3 font-black btn-3d btn-gold flex items-center justify-center gap-2"><Download size={20}/>保存</button>
              <button onClick={onClose} className="py-3 font-black btn-3d btn-white">返回</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Camera Mode
  return (
    <div className="fixed inset-0 z-50 bg-[#0f2b22] flex flex-col">
      <div className="p-4 flex justify-between items-center z-10 bg-black/30 backdrop-blur-sm">
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white">
          <X className="w-6 h-6" />
        </button>
        <span className="font-bold text-white">拍攝合照</span>
        <div className="w-10"></div>
      </div>

      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        {error ? (
          <div className="text-center p-6 text-white">
            <p className="mb-4">{error}</p>
            <label className="btn-3d btn-green py-3 px-8 inline-block cursor-pointer font-bold">
              上傳照片
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setTempPhoto(ev.target.result);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <div className="absolute inset-8 border-4 border-white/30 rounded-3xl pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-xs shadow-md">
                    Target in sight
                </div>
            </div>
          </>
        )}
      </div>

      <div className="p-8 flex justify-around items-center bg-black/30 backdrop-blur-md">
        <div className="w-12"></div>
        <button 
            onClick={takePhoto} 
            className="relative z-50 w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 active:scale-95 transition-all shadow-lg cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-red-500 border-4 border-white shadow-inner pointer-events-none"></div>
        </button>
        <button onClick={switchCamera} className="relative z-50 p-3 rounded-full bg-white/20 text-white active:scale-95 transition-all cursor-pointer">
          <RefreshCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

// 4. Grid Phase
const GridPhase = ({ answers, onFinish }) => {
  const [gridMapping, setGridMapping] = useState([]);
  const [gridPhotos, setGridPhotos] = useState({});
  const [selectedTask, setSelectedTask] = useState(null); 
  const [isCameraOpen, setIsCameraOpen] = useState(false); 
  const [showWinModal, setShowWinModal] = useState(false);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random());
    const mapping = new Array(9).fill(null);
    let qIdx = 0;
    for (let i = 0; i < 9; i++) {
      if (i === 4) continue;
      mapping[i] = shuffled[qIdx];
      qIdx++;
    }
    setGridMapping(mapping);
  }, []);

  useEffect(() => {
    if (gridMapping.length === 0) return;
    
    // UPDATED LOGIC: All cells must have a photo, including index 4
    const isFilled = (idx) => gridPhotos[idx];

    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    let count = 0;
    lines.forEach(line => { if (line.every(isFilled)) count++; });
    setLineCount(count);

    if (count >= 3 && !showWinModal && count > (window.lastLineCount || 0)) {
      setShowWinModal(true);
      window.lastLineCount = count;
    }
  }, [gridPhotos, gridMapping, showWinModal]);

  const handleCellClick = (index) => {
    // Special handling for center cell (index 4)
    if (index === 4) {
        setSelectedTask({
            index: 4,
            question: null,
            userAnswerIndex: null,
            letter: "GIFT",
            existingPhoto: gridPhotos[4]
        });
        return;
    }

    const question = gridMapping[index];
    const userAnsIdx = answers[question.id];
    const letter = question.options[userAnsIdx].value;
    
    setSelectedTask({ 
        index, 
        question, 
        userAnswerIndex: userAnsIdx, 
        letter, 
        existingPhoto: gridPhotos[index] 
    });
  };

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  const handlePhotoTaken = (photoUrl) => {
    setGridPhotos(prev => ({ ...prev, [selectedTask.index]: photoUrl }));
    setIsCameraOpen(false);
    setSelectedTask(null);
  };

  const handleCloseAll = () => {
    setIsCameraOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="flex flex-col min-h-full pb-20 relative z-10 bg-pattern">
      <header className="p-4 flex justify-between items-center">
        <div className="bg-red-600 text-white px-4 py-1 rounded-full border-b-4 border-red-800 font-black shadow-lg transform -rotate-1">
            MBTI BINGO
        </div>
        <div className="bg-white text-green-800 px-4 py-1 rounded-full border-b-4 border-green-800 font-bold shadow-lg flex items-center gap-2">
            <Star size={16} className="text-yellow-500 fill-current" />
            <span>LINES: {lineCount}</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center px-4 max-w-md mx-auto w-full">
        <div className="bg-black/20 p-4 rounded-3xl backdrop-blur-sm border-2 border-white/10 shadow-2xl">
            <div className="grid grid-cols-3 gap-3 aspect-square">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => {
                const hasPhoto = gridPhotos[idx];

                if (idx === 4) {
                    return (
                        <button 
                            key={idx}
                            onClick={() => handleCellClick(idx)}
                            className={`
                                relative rounded-xl flex flex-col items-center justify-center p-2 text-center shadow-lg overflow-hidden transition-all
                                ${hasPhoto 
                                    ? 'bg-white border-4 border-yellow-500' 
                                    : 'bg-yellow-400 border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1'
                                }
                            `}
                        >
                             {hasPhoto ? (
                                <img src={hasPhoto} alt="Gift Done" className="w-full h-full object-cover absolute inset-0" />
                            ) : (
                                <>
                                    <Gift className="w-6 h-6 text-red-600 mb-1" />
                                    <span className="text-[10px] leading-tight font-black text-yellow-900">
                                        請找到<br/>跟你同樣<br/>特質的<br/>MBTI夥伴
                                    </span>
                                </>
                            )}
                            {hasPhoto && (
                                <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1 shadow-md border border-white z-10">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </button>
                    );
                }

                const question = gridMapping[idx];
                if (!question) return <div key={idx} className="bg-white/10 rounded-xl animate-pulse"></div>;

                const userAnsIdx = answers[question.id];
                const letter = question.options[userAnsIdx].value;

                return (
                    <button
                        key={idx}
                        onClick={() => handleCellClick(idx)}
                        className={`
                            relative rounded-xl overflow-hidden aspect-square transition-all grid-cell
                            flex flex-col items-center justify-center shadow-lg
                            ${hasPhoto 
                                ? 'bg-white border-4 border-green-500' 
                                : 'bg-white border-b-4 border-gray-300 active:border-b-0 active:translate-y-1'
                            }
                        `}
                    >
                        {hasPhoto ? (
                            <img src={hasPhoto} alt="Done" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <span className="text-4xl font-black text-gray-800">{letter}</span>
                                <span className="text-[10px] text-gray-400 font-bold mt-1">TAP ME</span>
                            </>
                        )}
                        {hasPhoto && (
                            <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1 shadow-md border border-white">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </button>
                );
            })}
            </div>
        </div>
        
        <div className="mt-6 text-center">
            <p className="text-white text-shadow-sm font-bold opacity-90">
                點擊格子尋找你的 MBTI 夥伴！
            </p>
            {lineCount >= 3 && (
                <button 
                    onClick={() => setShowWinModal(true)}
                    className="mt-4 w-full py-4 btn-3d btn-gold font-black text-lg animate-bounce"
                >
                    🎉 領取聖誕回憶卡 🎉
                </button>
            )}
        </div>
      </div>

      {selectedTask && !isCameraOpen && (
          <TaskDetailModal 
            targetInfo={selectedTask}
            onOpenCamera={handleOpenCamera}
            onClose={handleCloseAll}
          />
      )}

      {selectedTask && isCameraOpen && (
        <CameraModal
          targetInfo={selectedTask}
          existingPhoto={selectedTask.existingPhoto} 
          onPhotoTaken={handlePhotoTaken}
          onClose={() => setIsCameraOpen(false)} 
        />
      )}

      {showWinModal && (
        <WinModal 
          gridPhotos={gridPhotos} 
          gridMapping={gridMapping}
          answers={answers}
          onClose={() => setShowWinModal(false)}
          lineCount={lineCount}
        />
      )}
    </div>
  );
};

// 5. Win Modal
const WinModal = ({ gridPhotos, gridMapping, answers, onClose, lineCount }) => {
  const canvasRef = useRef(null);

  const downloadAll = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = 1200; 
    const gap = 24;
    const cellSize = (size - (gap * 4)) / 3;
    
    canvas.width = size;
    canvas.height = size + 200; 

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0f2b22');
    gradient.addColorStop(1, '#1a4c3d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px "Noto Sans TC", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 10;
    ctx.fillText("🎄 我的 MBTI 小夥伴 🎄", size / 2, 100);
    ctx.font = '30px "Noto Sans TC", sans-serif';
    ctx.fillText("MBTI Connected 聖誕活動", size / 2, 150);
    ctx.shadowBlur = 0;

    const loadImage = (src) => new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });

    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const x = gap + col * (cellSize + gap);
      const y = 200 + row * (cellSize + gap);

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(x, y, cellSize, cellSize, 20);
      ctx.fill();

      if (i === 4) {
        // Center
        const photoUrl = gridPhotos[i];
        if (photoUrl) {
            const img = await loadImage(photoUrl);
            if (img) {
                const scale = Math.max(cellSize / img.width, cellSize / img.height);
                const w = img.width * scale;
                const h = img.height * scale;
                const ox = (cellSize - w) / 2;
                const oy = (cellSize - h) / 2;
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x + 10, y + 10, cellSize - 20, cellSize - 20, 15);
                ctx.clip();
                ctx.drawImage(img, x + ox, y + oy, w, h);
                ctx.restore();
            }
        } else {
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.roundRect(x + 10, y + 10, cellSize - 20, cellSize - 20, 15);
            ctx.fill();
            ctx.fillStyle = '#92400e';
            ctx.font = 'bold 80px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("🎁", x + cellSize/2, y + cellSize/2);
        }
      } else {
        const photoUrl = gridPhotos[i];
        if (photoUrl) {
          const img = await loadImage(photoUrl);
          if (img) {
            const scale = Math.max(cellSize / img.width, cellSize / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            const ox = (cellSize - w) / 2;
            const oy = (cellSize - h) / 2;
            
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x + 10, y + 10, cellSize - 20, cellSize - 20, 15);
            ctx.clip();
            ctx.drawImage(img, x + ox, y + oy, w, h);
            ctx.restore();
          }
        } else {
          const question = gridMapping[i];
          const userAnsIdx = answers[question.id];
          const letter = question.options[userAnsIdx].value;
          
          ctx.fillStyle = '#e5e7eb';
          ctx.beginPath();
          ctx.roundRect(x + 10, y + 10, cellSize - 20, cellSize - 20, 15);
          ctx.fill();
          
          ctx.fillStyle = '#374151';
          ctx.font = 'bold 100px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(letter, x + cellSize/2, y + cellSize/2);
        }
      }
    }

    const link = document.createElement('a');
    link.download = 'mbti-christmas-memory.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.85);
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-pop">
      <div className="bg-white rounded-3xl p-6 text-center space-y-4 max-w-sm w-full shadow-2xl border-4 border-yellow-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffd700_2px,transparent_2px)] bg-[length:16px_16px]"></div>
        
        <div className="relative z-10">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <PartyPopper className="w-10 h-10 text-yellow-600" />
            </div>
            
            <h2 className="text-3xl font-black text-gray-800">CONGRATS!</h2>
            <p className="text-gray-500 font-bold">
                你完成了 {lineCount} 條連線！<br/>
                完美的聖誕 MBTI 團隊！
            </p>
            
            <canvas ref={canvasRef} style={{display: 'none'}}></canvas>

            <div className="pt-6 space-y-3">
            <button 
                onClick={downloadAll}
                className="w-full py-4 btn-3d btn-gold text-lg font-black flex items-center justify-center gap-2"
            >
                <Download className="w-5 h-5" />
                下載紀念卡片
            </button>
            <button 
                onClick={onClose}
                className="w-full py-4 btn-3d btn-white font-bold text-gray-600"
            >
                繼續遊戲
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};

// Main App
export default function App() {
  const [phase, setPhase] = useState('landing'); 
  const [userAnswers, setUserAnswers] = useState({});

  const handleStart = () => {
    setPhase('quiz');
  };

  const handleQuizComplete = (answers) => {
    setUserAnswers(answers);
    setPhase('grid');
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col relative bg-pattern">
      <style>{styles}</style>
      
      {/* Snowflakes */}
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="snowflake">
          {i % 2 === 0 ? '❅' : '❆'}
        </div>
      ))}

      {phase === 'landing' && <LandingPhase onStart={handleStart} />}
      {phase === 'quiz' && <QuizPhase onComplete={handleQuizComplete} />}
      {phase === 'grid' && <GridPhase answers={userAnswers} />}
    </div>
  );
}