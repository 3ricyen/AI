import { useRef } from 'react';
import { PartyPopper, Download } from 'lucide-react';
import { QUESTIONS } from '../data/questions';

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

export default WinModal;





