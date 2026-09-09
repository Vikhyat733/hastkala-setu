import React from 'react';
import { AlertCircle } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'कुछ गड़बड़ हो गई',
  message = 'कुछ गड़बड़ हो गई। फिर से कोशिश करें।',
  onRetry,
  retryLabel = 'फिर से प्रयास करें',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[300px] text-center max-w-sm mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-[#261D1A]">
        {title}
      </h3>
      <p className="text-sm text-[#6B5E59] mt-1 mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <PrimaryButton variant="terracotta" onClick={onRetry}>
          {retryLabel}
        </PrimaryButton>
      )}
    </div>
  );
};
