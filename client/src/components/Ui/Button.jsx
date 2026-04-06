// src/components/ui/Button.jsx
import { forwardRef } from 'react';

const variants = {
  primary: 'bg-ink-900 text-cream-50 hover:bg-ink-700 shadow-lg shadow-ink-900/18',
  secondary: 'bg-white text-ink-700 border-2 border-ink-100 hover:bg-cream-100',
  ghost: 'bg-transparent text-ink-600 hover:text-ink-900 hover:bg-cream-100/50',
  danger: 'bg-coral-500 text-white hover:bg-coral-600',
  tab: 'text-ink-600 hover:bg-cream-100',
  tabActive: 'bg-ink-900 text-cream-50',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

export const Button = forwardRef(({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}, ref) => {
  const isTab = variant === 'tab' || variant === 'tabActive';
  
  return (
    <button
      ref={ref}
      className={`
        font-body font-medium rounded-full transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-cream-50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isTab ? 'px-4 py-1.5 text-xs font-medium rounded-full' : sizes[size]}
        ${variant === 'tabActive' ? variants.tabActive : variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';