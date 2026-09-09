import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'MELA तैयार हो रहा है...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[300px] text-center">
      <div className="relative w-16 h-16 mb-4">
        <div className="w-16 h-16 rounded-full border-4 border-[#FAF6F0] border-t-[#C04B27] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-xl">
          🏺
        </div>
      </div>
      <p className="text-base font-bold text-[#261D1A]">
        {message}
      </p>
      <p className="text-xs text-[#6B5E59] mt-1">
        Market • Empower • Link • Artisans
      </p>
    </div>
  );
};
