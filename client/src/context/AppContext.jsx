// src/context/AppContext.jsx
// ─────────────────────────────────────────────────────────────────────────────
// AppContext owns ONLY UI-level state: toast notifications and modals.
// User state  → AuthContext   (source of truth for auth)
// Kudos state → KudosContext  (source of truth for kudos)
// ─────────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [toast, setToast] = useState({ show: false, emoji: '', message: '' });
  const [modal, setModal] = useState({ open: false, type: null, data: null });

  const showToast = useCallback((emoji, message) => {
    setToast({ show: true, emoji, message });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3200);
  }, []);

  const showModal = useCallback((type, data = null) => {
    setModal({ open: true, type, data });
  }, []);

  const hideModal = useCallback(() => {
    setModal({ open: false, type: null, data: null });
  }, []);

  return (
    <AppContext.Provider value={{ toast, modal, showToast, showModal, hideModal }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};