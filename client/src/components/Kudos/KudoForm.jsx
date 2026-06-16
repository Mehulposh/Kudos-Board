// src/components/kudos/KudoForm.jsx
import { useState } from 'react';
import { TextArea } from '../Ui/Textarea.jsx';
import { Input } from '../Ui/Input.jsx';
import { Button } from '../Ui/Button.jsx';
import { EmojiPicker } from '../Ui/EmojiPicker.jsx';

export const KudoForm = ({ recipientName ,onSend}) => {
  const [message,  setMessage]  = useState('');
  const [nickname, setNickname] = useState('');
  const [emoji,    setEmoji]    = useState('🌟');   // lifted from EmojiPicker
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || message.trim().length < 5) {
      setError('Message must be at least 5 characters.');
      return;
    }
 
    setLoading(true);
    setError('');
 
    const result = await onSend({
      message:  message.trim(),
      nick: nickname.trim() || 'Anonymous',
      emoji,
    });
 
    setLoading(false);
 
    if (result?.success) {
      setMessage('');
      setNickname('');
      setEmoji('🌟');
    } else {
      setError(result?.error || 'Failed to send. Please try again.');
    }
  };
  
  const charCount = 500 - message.length;
  
  return (
    <form onSubmit={handleSubmit} className="bg-white border-2 border-cream-200 rounded-2xl p-6 -mt-6 relative z-10 shadow-[0_12px_40px_rgba(24,18,14,0.08)] mb-8">
      <h2 className="font-display text-xl font-semibold text-ink-900 mb-4.5">
        Send {recipientName?.split(' ')[0]} some love 💌
      </h2>
      
      <p className="text-[11px] text-ink-400 uppercase tracking-wide font-semibold mb-2">
        Pick a vibe
      </p>
      <div className="mb-4">
        <EmojiPicker 
          selectedEmoji={emoji}
          setSelectedEmoji={setEmoji}
        />
      </div>
      
      <div className="mb-3">
        <TextArea
          id="kudo-msg"
          label="Your message (anonymous)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          maxLength={500}
          required
        />
      </div>
      
      <div className="flex gap-3 items-end mb-4">
        <div className="flex-1 max-w-[220px]">
          <Input
            id="kudo-nick"
            label="Nickname (optional)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={30}
          />
        </div>
        <span className={`font-mono text-xs shrink-0 ${charCount < 50 ? 'text-coral-500' : 'text-ink-200'}`}>
          {charCount}
        </span>
      </div>
      
      <Button type="submit" variant="primary" size="lg" className="w-full">
        Send kudos 🚀
      </Button>
      
      <p className="text-center text-[11px] text-ink-200 mt-2.5">
        Anonymous · No account required · Moderated by owner
      </p>
    </form>
  );
};