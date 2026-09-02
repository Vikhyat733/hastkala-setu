import React, { useState } from 'react';
import { X, Volume2, VolumeX, Share2, Tag, Eye, ShoppingCart, Trash2, Edit3, ShieldCheck } from 'lucide-react';
import { RuralAppProductItem } from '../../../types';
import { speakText, stopSpeaking, isSpeaking, playSoundEffect } from '../../../services/voiceAssistant';

interface RuralProductDetailModalProps {
  product: RuralAppProductItem | null;
  onClose: () => void;
  onDeleteProduct?: (id: string) => void;
}

export const RuralProductDetailModal: React.FC<RuralProductDetailModalProps> = ({
  product,
  onClose,
  onDeleteProduct
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!product) return null;

  const handleToggleVoice = () => {
    playSoundEffect('tap');
    if (isPlayingAudio || isSpeaking()) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToSpeak = `${product.name}। श्रेणी ${product.category}। कीमत ${product.price} रुपये। ${product.description}`;
      speakText(textToSpeak, 'hi-IN', () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleShareWhatsApp = () => {
    playSoundEffect('tap');
    const msg = `नमस्ते! मेरा हस्तशिल्प "${product.name}" देखें: केवल ₹${product.price} में हस्तकलाशेतू पर उपलब्ध।`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-[#FAF6ED] w-full max-w-sm rounded-3xl overflow-hidden border-2 border-[#E5DAC8] shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Top Sticky Header */}
        <div className="p-3.5 bg-white/90 backdrop-blur-md border-b border-[#E5DAC8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#1E3A1E] px-2.5 py-1 rounded-lg bg-[#E8F0E3]">
              {product.category}
            </span>
            <span className="text-[11px] font-bold text-[#3A6B35]">
              {product.status === 'published' ? 'लाइव प्रकाशित' : 'ऑर्डर प्राप्त'}
            </span>
          </div>

          <button
            onClick={() => {
              playSoundEffect('tap');
              stopSpeaking();
              onClose();
            }}
            className="p-1.5 rounded-full bg-[#FAF6ED] hover:bg-[#EAE1D2] text-[#3B3026]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 space-y-4 overflow-y-auto">
          
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden border border-[#E5DAC8] bg-black">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-52 object-cover"
            />
            <div className="absolute top-2.5 right-2.5">
              <button
                onClick={handleToggleVoice}
                className="p-2 rounded-xl bg-white/90 backdrop-blur-md text-[#3A6B35] shadow"
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4 text-[#D95D39]" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Title & Price */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-black text-[#1E3A1E]">
                {product.name}
              </h2>
              <p className="text-xl font-black text-[#3A6B35] mt-0.5">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            </div>

            {product.viewsCount && (
              <div className="px-2.5 py-1 rounded-xl bg-white border border-[#E5DAC8] text-xs font-bold text-[#7D6E5D] flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-[#3A6B35]" />
                <span>{product.viewsCount} लोगों ने देखा</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E5DAC8] space-y-1">
            <p className="text-[11px] font-black text-[#7D6E5D]">
              विवरण
            </p>
            <p className="text-xs font-semibold text-[#4A3E31] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Action Buttons: WhatsApp Share & Delete */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleShareWhatsApp}
              className="py-3 px-3 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <Share2 className="w-4 h-4" />
              <span>व्हाट्सएप पर शेयर</span>
            </button>

            {onDeleteProduct && (
              <button
                onClick={() => {
                  playSoundEffect('tap');
                  onDeleteProduct(product.id);
                  onClose();
                }}
                className="py-3 px-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-extrabold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-100"
              >
                <Trash2 className="w-4 h-4" />
                <span>हटाएं</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
