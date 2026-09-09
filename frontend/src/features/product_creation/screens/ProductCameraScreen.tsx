import React, { useRef, useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, ArrowLeft, RefreshCw, Zap, Lightbulb, AlertCircle, Upload } from 'lucide-react';
import { useProductCreation } from '../context/ProductCreationContext';
import { useMela } from '../../../context/MelaContext';
import { AppHeader } from '../../../core/design-system/AppHeader';
import { PrimaryButton } from '../../../core/design-system/PrimaryButton';

// Beautiful sample artisan craft images for instant testing/demonstration
const SAMPLE_CRAFT_IMAGES = [
  {
    name: 'टेराकोटा फूलदान (Terracotta Vase)',
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'हाथ की नक्काशीदार सुराही (Earthen Pitcher)',
    url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'हस्तशिल्प दीया (Handcrafted Clay Diya)',
    url: 'https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&q=80&w=600',
  },
];

export const ProductCameraScreen: React.FC = () => {
  const { setImageAndEnhance, isEnhancing, errorMessage, setErrorMessage, clearError } = useProductCreation();
  const { t, selectedLanguage, navigate, viewMode } = useMela();
  const lang = selectedLanguage;
  const isDesktop = viewMode === 'desktop';

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Initialize camera preview
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
        setCameraActive(true);
        setCameraError(false);
      } else {
        setCameraError(true);
      }
    } catch {
      // Graceful fallback to gallery mode if camera permission denied
      setCameraError(true);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Capture image frame from video stream
  const handleShutterClick = async () => {
    if (videoRef.current && cameraActive) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        stopCamera();
        await setImageAndEnhance(dataUrl);
      }
    } else {
      // Prompt file picker if camera stream is inactive
      fileInputRef.current?.click();
    }
  };

  // Validate and handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format
    const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validFormats.includes(file.type.toLowerCase())) {
      setErrorMessage(t.sellProduct.camera.invalidFile);
      return;
    }

    // Validate size (<10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(t.sellProduct.camera.fileTooLarge);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      if (result) {
        stopCamera();
        await setImageAndEnhance(result);
      }
    };
    reader.onerror = () => {
      setErrorMessage(t.sellProduct.camera.invalidFile);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = async (sampleUrl: string) => {
    stopCamera();
    await setImageAndEnhance(sampleUrl);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between">
      {/* Top Header */}
      <AppHeader
        title={t.sellProduct.camera.title}
        subtitle="MELA Camera"
        onBack={() => {
          stopCamera();
          navigate('/dashboard');
        }}
        showLanguageToggle={false}
      />

      <main className={`flex-1 w-full mx-auto p-4 md:p-6 flex flex-col justify-between space-y-4 pb-20 ${isDesktop ? 'max-w-5xl' : 'max-w-md'}`}>
        <div className="text-center md:text-left space-y-1">
          <h2 className="text-2xl md:text-3xl font-black text-[#1B4D3E] tracking-tight">
            {t.sellProduct.camera.title}
          </h2>
          <p className="text-xs md:text-sm text-[#6B5E59] font-medium">
            {t.sellProduct.camera.subtitle}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className={`flex-1 ${isDesktop ? 'md:grid md:grid-cols-2 md:gap-8 items-center' : 'space-y-6'}`}>
          <div className="w-full">
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-black border-4 border-[#E0D8CE] shadow-2xl flex items-center justify-center">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-white/80 p-6">
                  <p className="text-sm font-semibold">{t.sellProduct.camera.cameraNotAllowed}</p>
                </div>
              )}
              {isEnhancing && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-30">
                  <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mb-3" />
                  <p className="text-sm font-black">{t.sellProduct.studio.enhancing}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 md:mt-0 space-y-6">
            <div className="space-y-4">
              <PrimaryButton
                onClick={handleShutterClick}
                disabled={!cameraActive || isEnhancing}
                className={`py-4 shadow-xl ${
                  !cameraActive || isEnhancing ? 'opacity-50' : 'hover:scale-102 active:scale-95'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">📸</span>
                  <span className="text-sm">
                    {isEnhancing ? t.sellProduct.studio.enhancing : t.sellProduct.camera.takePhoto}
                  </span>
                </div>
              </PrimaryButton>

              <button
                type="button"
                disabled={isEnhancing}
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-[#1B4D3E]/30 bg-white text-[#1B4D3E] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#1B4D3E]/5 hover:border-[#1B4D3E] transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#C04B27]" />
                {t.sellProduct.camera.chooseGallery}
              </button>
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px bg-[#E0D8CE]" />
                <span className="text-[10px] uppercase font-bold text-[#6B5E59] tracking-wider">
                  {lang === 'hi' ? 'या डेमो तस्वीरें चुनें' : 'Or use demo photos'}
                </span>
                <div className="flex-1 h-px bg-[#E0D8CE]" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_CRAFT_IMAGES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isEnhancing}
                    onClick={() => handleSelectSample(sample.url)}
                    className="group relative aspect-video rounded-xl overflow-hidden border-2 border-[#E0D8CE] hover:border-[#C04B27] transition-all cursor-pointer"
                  >
                    <img src={sample.url} alt={sample.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-[9px] font-bold py-0.5 px-1 truncate block text-center">
                      {sample.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </main>
    </div>
  );
};
