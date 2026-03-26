import crypto from 'crypto';

// Simple HTML entity encoding to prevent XSS (no DOM needed in Node)
const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

// Sanitize kudos input
const sanitizeKudosInput = (data) => {
  return {
    message: sanitizeText(data.message || ''),
    emoji: sanitizeText(data.emoji || '🌟').substring(0, 10),
    senderNickname: sanitizeText(data.senderNickname || 'Anonymous').substring(0, 30) || 'Anonymous',
  };
};

// Hash IP for spam prevention (one-way, privacy-preserving)
const hashIP = (ip) => {
  return crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'fallback-secret')
    .update(ip || 'unknown')
    .digest('hex')
    .substring(0, 16); // only store partial hash
};

export { sanitizeText, sanitizeKudosInput, hashIP };