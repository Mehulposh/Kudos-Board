// src/components/ui/Avatar.jsx
export const Avatar = ({ name, color, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-[90px] h-[90px] text-[36px]',
  };
  
  return (
    <div
      className={`
        rounded-full flex items-center justify-center
        font-display font-bold text-white shrink-0
        ${sizes[size]}
        ${className}
      `}
      style={{ backgroundColor: color }}
    >
      {name?.charAt(0).toUpperCase()}
    </div>
  );
};