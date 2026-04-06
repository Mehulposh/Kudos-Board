// src/components/ui/Card.jsx
export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={`
        bg-white rounded-2xl border-2 border-cream-200
        transition-all duration-250
        ${hover ? 'hover:-translate-y-0.75 hover:shadow-kudo-hover hover:border-gold-400' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};