import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: 'ghost' | 'filled';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = 'ghost',
  className = '',
  ...props
}) => {
  const styles =
    variant === 'filled'
      ? 'bg-[#FAF6F0] text-[#1B4D3E] hover:bg-[#EFE9DF]'
      : 'text-[#261D1A] hover:bg-[#FAF6F0] active:bg-[#EFE9DF]';

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`
        min-w-[44px] min-h-[44px] p-2.5 rounded-xl
        flex items-center justify-center
        transition-colors active:scale-95
        focus-visible:ring-2 focus-visible:ring-[#C04B27]
        ${styles}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
};
