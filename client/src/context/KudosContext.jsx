// src/context/KudosContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { kudosService, userService } from '../service/api.js';
import { useAuth } from './AuthContext.jsx';

const KudosContext = createContext();

export function KudosProvider({ children }) {
  const { user } = useAuth();
  const [boardUser, setBoardUser] = useState(null);
  const [kudos, setKudos] = useState([]);
  const [stats, setStats] = useState({ total: 0, pinned: 0, hidden: 0, thisWeek: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rateLimitError, setRateLimitError] = useState(null);

  // Load board data: kudos + user info + stats
  const loadBoard = useCallback(async (username) => {
    if (!username) return;
    
    setLoading(true);
    setError(null);
    setRateLimitError(null);
    
    try {
      // 1. Fetch kudos from /api/kudos/:username
      const kudosData = await kudosService.getKudos(username);
      
      // 2. Fetch public profile from /api/users/:username
      const profileData = await userService.getPublicProfile(username);
      
      // 3. Fetch stats from /api/users/:username/stats
      const statsData = await userService.getPublicStats(username);
      
      // Normalize responses
      setBoardUser(profileData.user || profileData);
      setKudos(Array.isArray(kudosData) ? kudosData : kudosData.kudos || []);
      setStats(statsData.stats || statsData || {});
      
    } catch (err) {
      if (err.isRateLimit) {
        setRateLimitError(err.message);
      } else {
        setError(err.message);
      }
      console.error('Failed to load board:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a kudo (with rate limit handling)
  const sendKudo = useCallback(async (username, kudoData) => {
    try {
      setRateLimitError(null);
      const newKudo = await kudosService.sendKudo(username, kudoData);
      
      // Optimistic update
      setKudos(prev => [newKudo.kudo || newKudo, ...prev]);
      
      return { success: true, kudo: newKudo.kudo || newKudo };
    } catch (err) {
      console.error('rate limit error', err);
      
      if (err.isRateLimit) {
        setRateLimitError('Slow down! Please wait before sending another kudo.');
        return { success: false, error: err.message, isRateLimit: true };
      }
      return { success: false, error: err.message };
    }
  }, []);

  // Moderate kudos (owner only)
  const moderateKudo = useCallback(async (username, kudoId, action) => {
    try {
      let result;
      
      switch (action) {
        case 'pin':
          result = await kudosService.togglePin(username, kudoId);
          break;
        case 'hide':
          result = await kudosService.toggleHide(username, kudoId);
          break;
        case 'delete':
          await kudosService.deleteKudo(username, kudoId);
          setKudos(prev => prev.filter(k => k.id !== kudoId));
          return { success: true };
        default:
          throw new Error('Unknown action');
      }
      
      // Update local state
      const updated = result.kudo || result;
      setKudos(prev => prev.map(k => 
        k.id === kudoId ? { ...k, ...updated } : k
      ));
      
      return { success: true, kudo: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Filter kudos for display
  const getFilteredKudos = useCallback((filter, isOwner = false) => {
    let list = [...kudos];
    
    // Public viewers never see hidden kudos
    if (!isOwner) {
      list = list.filter(k => !k.hide);
    }
    
    if (filter === 'pinned') {
      list = list.filter(k => k.pin);
    } else if (filter === 'hidden' && isOwner) {
      list = list.filter(k => k.hide);
    }
    
    return list;
  }, [kudos]);


  // ── Stats helper (used by Dashboard) ────────────────────────────────────
  const getStats = useCallback(() => {
    const visible  = kudos.filter(k => !k.hide && !k.isHidden);
    const weekAgo  = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
 
    return {
      total:    visible.length,
      pinned:   kudos.filter(k => (k.pin || k.isPinned) && !k.hide && !k.isHidden).length,
      hidden:   kudos.filter(k => k.hide || k.isHidden).length,
      thisWeek: visible.filter(k => new Date(k.date || k.createdAt) > weekAgo).length,
    };
  }, [kudos]);

  // Keep `stats` in sync for components that read it directly (e.g. Board hero)
  useEffect(() => {
    if (kudos.length > 0) setStats(getStats());
  }, [kudos, getStats]);

  const value = {
    boardUser,
    kudos,
    stats,
    loading,
    error,
    rateLimitError,
    loadBoard,
    sendKudo,
    moderateKudo,
    getFilteredKudos,
    getStats
  };

  return (
    <KudosContext.Provider value={value}>
      {children}
    </KudosContext.Provider>
  );
}

export const useKudos = () => {
  const context = useContext(KudosContext);
  if (!context) throw new Error('useKudos must be used within KudosProvider');
  return context;
};