import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  variant?: 'green' | 'terracotta';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  icon,
  isLoading = false,
  fullWidth = true,
  variant = 'green',
  className = '',
  disabled,
  ...props
}) => {
  const bgStyles =
    variant === 'green'
      ? 'bg-[#1B4D3E] hover:bg-[#153D31] active:bg-[#103026] text-white shadow-md shadow-[#1B4D3E]/20'
      : 'bg-[#C04B27] hover:bg-[#A83E1E] active:bg-[#8F3316] text-white shadow-md shadow-[#C04B27]/25';

  return (
    <button
      className={`
        ${fullWidth ? 'w-full' : 'w-auto'}
        min-h-[52px] px-6 py-3.5
        rounded-2xl font-bold text-base md:text-lg
        flex items-center justify-center gap-3
        transition-all duration-200 active:scale-[0.98]
        focus-visible:ring-4 focus-visible:ring-[#C04B27]/30
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${bgStyles}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          <span>...</span>
        </div>
      ) : (
        <>
          {icon && <span className="text-xl flex-shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
