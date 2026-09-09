import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { PrimaryButton } from '../../../core/design-system/PrimaryButton';

interface EditFieldModalProps {
  isOpen: boolean;
  fieldTitle: string;
  fieldKey: string;
  initialValue: string;
  isTextArea?: boolean;
  onSave: (val: string) => void;
  onClose: () => void;
}

export const EditFieldModal: React.FC<EditFieldModalProps> = ({
  isOpen,
  fieldTitle,
  initialValue,
  isTextArea = false,
  onSave,
  onClose,
}) => {
  const [value, setValue] = useState(initialValue);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(value);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 border-2 border-[#E0D8CE] shadow-2xl space-y-4 animate-in slide-in-from-bottom-6">
        <div className="flex items-center justify-between pb-2 border-b border-[#EFE9DF]">
          <h3 className="text-lg font-black text-[#261D1A]">{fieldTitle} बदलें</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#6B5E59] hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5E59] mb-1.5">
              {fieldTitle}
            </label>
            {isTextArea ? (
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={4}
                className="w-full p-4 rounded-2xl bg-[#FAF6F0] border-2 border-[#E0D8CE] text-sm text-[#261D1A] font-medium focus:border-[#C04B27] focus:outline-hidden transition-all resize-none"
                placeholder={`सही ${fieldTitle} लिखें...`}
                required
              />
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-4 rounded-2xl bg-[#FAF6F0] border-2 border-[#E0D8CE] text-base text-[#261D1A] font-bold focus:border-[#C04B27] focus:outline-hidden transition-all"
                placeholder={`सही ${fieldTitle} लिखें...`}
                required
              />
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl border-2 border-[#E0D8CE] font-bold text-sm text-[#6B5E59] hover:bg-stone-50 active:scale-98 transition-all"
            >
              रद्द करें
            </button>
            <div className="flex-1">
              <PrimaryButton type="submit">
                <span className="flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" />
                  सहेजें
                </span>
              </PrimaryButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
