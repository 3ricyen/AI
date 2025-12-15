import { useState, useEffect, useRef } from 'react';
import { X, RefreshCcw, Download, Save } from 'lucide-react';

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

export default CameraModal;





