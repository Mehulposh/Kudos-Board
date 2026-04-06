// src/components/ui/EmojiPicker.jsx
import { useApp } from '../../context/AppContext.jsx';
import { EMOJIS } from '../../constants/index.js';
export const EmojiPicker = () => {
  const {  selectedEmoji, setSelectedEmoji } = useApp();
  
  return (
    <div className="grid grid-cols-10 gap-0.75">
      {EMOJIS.map(emoji => (
        <button
          key={emoji}
          type="button"
          onClick={() => setSelectedEmoji(emoji)}
          className={`
            text-lg p-1.25 rounded-lg cursor-pointer
            transition-transform duration-150 bg-transparent border-none text-center
            hover:scale-130 hover:bg-cream-200
            ${selectedEmoji === emoji ? 'bg-gold-400 scale-115' : ''}
          `}
          aria-label={`Select ${emoji}`}
          aria-pressed={selectedEmoji === emoji}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};