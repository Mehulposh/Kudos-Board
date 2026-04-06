// src/components/ui/Input.jsx
export const Input = ({ label, id, className = '', ...props }) => {
  return (
    <div className="relative field-wrap">
      <input
        id={id}
        className={`
          w-full px-4 py-4.5 pb-2 pt-4
          border-2 border-ink-100 rounded-xl
          bg-cream-50 font-body text-ink-900 text-sm
          focus:border-gold-400 focus:shadow-[0_0_0_3px_rgba(245,200,66,0.15)]
          focus:outline-none transition-all duration-200
          placeholder-transparent peer
          ${className}
        `}
        placeholder={label}
        {...props}
      />
      <label
        htmlFor={id}
        className={`
          absolute left-4 font-body text-sm text-ink-400 pointer-events-none
          transition-all duration-200
          peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-ink-600 peer-focus:font-semibold
          peer-focus:uppercase peer-focus:tracking-wide
          peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-xs
          peer-not-placeholder-shown:text-ink-600 peer-not-placeholder-shown:font-semibold
          peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:tracking-wide
          top-3.5
        `}
      >
        {label}
      </label>
    </div>
  );
};