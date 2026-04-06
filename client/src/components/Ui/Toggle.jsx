// src/components/ui/Toggle.jsx
export const Toggle = ({ enabled, onChange, className = '' }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange?.(!enabled)}
      className={`
        w-11 h-6 rounded-full cursor-pointer transition-colors duration-250
        shrink-0 border-none relative
        ${enabled ? 'bg-ink-900' : 'bg-ink-200'}
        ${className}
      `}
    >
      <span className={`
        absolute top-0.75 left-0.75 w-4.5 h-4.5 bg-white rounded-full
        transition-left duration-250 shadow-[0_1px_4px_rgba(0,0,0,0.2)]
        ${enabled ? 'left-5.75' : 'left-0.75'}
      `} />
    </button>
  );
};