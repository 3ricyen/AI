import { useState } from 'react';
import { Star, Gift, PartyPopper } from 'lucide-react';

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

export default LandingPhase;





