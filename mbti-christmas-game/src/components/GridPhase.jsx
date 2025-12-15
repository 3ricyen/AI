import { useState, useEffect } from 'react';
import { Star, Gift, Check } from 'lucide-react';
import { QUESTIONS } from '../data/questions';
import TaskDetailModal from './TaskDetailModal';
import CameraModal from './CameraModal';
import WinModal from './WinModal';

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

export default GridPhase;





