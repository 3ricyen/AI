import { X, Camera, Download, Check, Search, Gift } from 'lucide-react';

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

export default TaskDetailModal;





