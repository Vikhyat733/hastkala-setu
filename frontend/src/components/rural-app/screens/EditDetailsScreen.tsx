import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Edit3, Plus, Minus, Volume2, Check } from 'lucide-react';
import { speakText, playSoundEffect } from '../../../services/voiceAssistant';

interface EditDetailsScreenProps {
  initialName: string;
  initialCategory: string;
  initialPrice: number;
  initialDescription: string;
  onBack: () => void;
  onConfirm: (edited: { name: string; category: string; price: number; description: string }) => void;
}

export const EditDetailsScreen: React.FC<EditDetailsScreenProps> = ({
  initialName,
  initialCategory,
  initialPrice,
  initialDescription,
  onBack,
  onConfirm
}) => {
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState(initialCategory);
  const [price, setPrice] = useState(initialPrice);
  const [description, setDescription] = useState(initialDescription);

  const [activeEditingField, setActiveEditingField] = useState<string | null>(null);

  const handleVoiceAdvice = () => {
    playSoundEffect('tap');
    speakText('यदि आप नाम, श्रेणी, कीमत या विवरण बदलना चाहते हैं तो पेंसिल आइकन पर टैप करें। कीमत बढ़ाने या घटाने के लिए प्लस या माइनस दबाएं।');
  };

  const handlePriceAdjust = (delta: number) => {
    playSoundEffect('tap');
    const newPrice = Math.max(50, price + delta);
    setPrice(newPrice);
  };

  const handleDone = () => {
    playSoundEffect('tap');
    onConfirm({ name, category, price, description });
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#FAF6ED] text-[#2C241E] select-none p-4 sm:p-5">
      
      {/* Top Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              playSoundEffect('tap');
              onBack();
            }}
            className="p-2.5 rounded-2xl bg-white border border-[#E5DAC8] text-[#3B3026] shadow-sm hover:bg-[#F4EDE0]"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <h1 className="text-lg font-black text-[#1E3A1E] font-sans">
            जाँचें और बदलें
          </h1>

          <button
            onClick={handleVoiceAdvice}
            className="p-2.5 rounded-2xl bg-[#E8F0E3] border border-[#3A6B35]/30 text-[#3A6B35] shadow-sm hover:bg-[#DCEAD5]"
            title="निर्देश सुनें"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Section Instructions */}
        <p className="text-xs font-bold text-[#7D6E5D] text-center">
          जानकारी सही है तो आगे बढ़ें, या बदलने के लिए पेंसिल पर टैप करें
        </p>

        {/* 4 EDITABLE TILES */}
        <div className="space-y-3 pt-1">
          
          {/* 1. नाम (Name) */}
          <div className="p-3.5 rounded-2xl bg-white border-2 border-[#E5DAC8] shadow-sm hover:border-[#3A6B35]/40 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-black text-[#7D6E5D]">
                नाम (Title)
              </span>
              <button
                onClick={() => setActiveEditingField(activeEditingField === 'name' ? null : 'name')}
                className="p-1 text-[#3A6B35] hover:bg-[#E8F0E3] rounded-lg"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            {activeEditingField === 'name' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-base font-extrabold text-[#1E3A1E] p-1.5 border border-[#3A6B35] rounded-xl focus:outline-none bg-[#F9F6F0]"
                  autoFocus
                />
                <button
                  onClick={() => setActiveEditingField(null)}
                  className="p-2 rounded-xl bg-[#3A6B35] text-white"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-base font-extrabold text-[#1E3A1E]">
                {name}
              </p>
            )}
          </div>

          {/* 2. श्रेणी (Category) */}
          <div className="p-3.5 rounded-2xl bg-white border-2 border-[#E5DAC8] shadow-sm hover:border-[#3A6B35]/40 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-black text-[#7D6E5D]">
                श्रेणी (Category)
              </span>
              <button
                onClick={() => setActiveEditingField(activeEditingField === 'category' ? null : 'category')}
                className="p-1 text-[#3A6B35] hover:bg-[#E8F0E3] rounded-lg"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            {activeEditingField === 'category' ? (
              <div className="flex items-center gap-2">
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setActiveEditingField(null);
                  }}
                  className="w-full text-base font-extrabold text-[#1E3A1E] p-2 border border-[#3A6B35] rounded-xl focus:outline-none bg-[#F9F6F0]"
                >
                  <option value="घर सजावट">घर सजावट (Home Decor)</option>
                  <option value="कपड़ा">कपड़ा (Textiles)</option>
                  <option value="सजावट">सजावट (Decor)</option>
                  <option value="आभूषण">आभूषण (Jewelry)</option>
                  <option value="लकड़ी शिल्प">लकड़ी शिल्प (Woodcraft)</option>
                </select>
              </div>
            ) : (
              <p className="text-base font-extrabold text-[#1E3A1E]">
                {category}
              </p>
            )}
          </div>

          {/* 3. कीमत (Price with +/- quick adjustment buttons) */}
          <div className="p-3.5 rounded-2xl bg-white border-2 border-[#E5DAC8] shadow-sm hover:border-[#3A6B35]/40 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-black text-[#7D6E5D]">
                कीमत (Price in ₹)
              </span>
              <span className="text-[10px] font-bold text-[#3A6B35]">
                + / - से बदलें
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black text-[#1E3A1E]">
                ₹{price.toLocaleString('en-IN')}
              </span>
              
              {/* Easy +/- buttons for rural artisans */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePriceAdjust(-50)}
                  className="w-9 h-9 rounded-xl bg-[#FAF0DD] border border-[#EAD0A8] text-[#935213] flex items-center justify-center font-bold hover:bg-[#F4E3C6] active:scale-95 transition-all shadow-sm"
                  title="₹50 कम करें"
                >
                  <Minus className="w-4 h-4 stroke-[3]" />
                </button>
                <button
                  onClick={() => handlePriceAdjust(50)}
                  className="w-9 h-9 rounded-xl bg-[#3A6B35] text-white flex items-center justify-center font-bold hover:bg-[#2C5528] active:scale-95 transition-all shadow-sm"
                  title="₹50 बढ़ाएं"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>

          {/* 4. विवरण (Description) */}
          <div className="p-3.5 rounded-2xl bg-white border-2 border-[#E5DAC8] shadow-sm hover:border-[#3A6B35]/40 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-black text-[#7D6E5D]">
                विवरण (Description)
              </span>
              <button
                onClick={() => setActiveEditingField(activeEditingField === 'desc' ? null : 'desc')}
                className="p-1 text-[#3A6B35] hover:bg-[#E8F0E3] rounded-lg"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            {activeEditingField === 'desc' ? (
              <div className="space-y-2">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full text-xs font-semibold text-[#1E3A1E] p-2 border border-[#3A6B35] rounded-xl focus:outline-none bg-[#F9F6F0]"
                />
                <button
                  onClick={() => setActiveEditingField(null)}
                  className="w-full py-1.5 rounded-xl bg-[#3A6B35] text-white text-xs font-bold"
                >
                  बदलाव सुरक्षित करें
                </button>
              </div>
            ) : (
              <p className="text-xs font-semibold text-[#4A3E31] leading-relaxed">
                {description}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Big Action CTA: "ठीक है, आगे बढ़ें ->" */}
      <div className="pt-4">
        <button
          onClick={handleDone}
          className="w-full py-4 px-6 rounded-2xl bg-[#3A6B35] hover:bg-[#2F582B] active:scale-[0.98] text-white font-extrabold text-lg flex items-center justify-center gap-3 shadow-lg shadow-[#3A6B35]/30 transition-all"
        >
          <span>ठीक है, आगे बढ़ें</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

    </div>
  );
};
