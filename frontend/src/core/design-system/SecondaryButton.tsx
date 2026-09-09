import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  icon,
  fullWidth = true,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={`
        ${fullWidth ? 'w-full' : 'w-auto'}
        min-h-[50px] px-6 py-3
        rounded-2xl font-semibold text-base
        bg-white border-2 border-[#E0D8CE] hover:border-[#C04B27]
        text-[#261D1A] hover:text-[#C04B27] active:bg-[#F5F0E8]
        flex items-center justify-center gap-2.5
        transition-all duration-200 active:scale-[0.98]
        focus-visible:ring-4 focus-visible:ring-[#C04B27]/20
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="text-lg flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
