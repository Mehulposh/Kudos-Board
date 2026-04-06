// src/components/ui/Toast.jsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export const Toast = ({ show, emoji, message, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3200);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return createPortal(
    <div className={`
      fixed bottom-6 right-6 z-9998 max-w-80
      transform transition-transform duration-350 cubic-bezier(0.34,1.56,0.64,1)
      ${show ? 'translate-x-0' : 'translate-x-[140%]'}
    `}>
      <div className="bg-ink-900 text-cream-50 font-body font-medium px-5 py-3.5 rounded-2xl shadow-[0_8px_32px_rgba(24,18,14,0.25)] flex items-center gap-2.5">
        <span className="text-lg">{emoji}</span>
        <span>{message}</span>
      </div>
    </div>,
    document.body
  );
};