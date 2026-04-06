// src/components/layout/Footer.jsx
export const Footer = () => {
  return (
    <footer className="bg-ink-900 py-12">
      <div className="max-w-6xl mx-auto px-5 flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gold-400 flex items-center justify-center text-ink-900 font-display text-xs font-bold">
            K
          </div>
          <span className="font-display text-ink-200 font-semibold">Kudos Board</span>
        </div>
        <p className="text-sm text-ink-600">Spreading positivity, one message at a time 💛</p>
        <p className="text-sm text-ink-700">© 2025 Kudos Board</p>
      </div>
    </footer>
  );
};