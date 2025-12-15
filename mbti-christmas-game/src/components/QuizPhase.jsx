import { useState } from 'react';
import { QUESTIONS } from '../data/questions';

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

export default QuizPhase;





