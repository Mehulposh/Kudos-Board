// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../service/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('kudos_token');
      
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData.user || userData);
        } catch (err) {
          localStorage.removeItem('kudos_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const register = useCallback(async (name, username, email, password) => {
    const credentials = {
         name: String(name).trim(),      // Ensure strings, not objects
      username: String(username).trim().toLowerCase(),
      email: String(email).trim().toLowerCase(),
      password: String(password)
    }
     console.log('🔐 Register called with:', credentials);
    setError(null);
    try {
         console.log('📡 Calling authService.register()...');
      const response = await authService.register(credentials);
      console.log('✅ Register response:', response);
      
      if (response.token) {
        localStorage.setItem('kudos_token', response.token);
        console.log('💾 Token saved to localStorage');
      }
      const userData = response.user || response;
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (err) {
        console.error('❌ Register failed:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  const login = useCallback(async (email,password) => {
    const credentials = {
        email: String(email).trim().toLowerCase(),
      password: String(password)
    }
    setError(null);
    try {
      const response = await authService.login(credentials);
      
      if (response.token) {
        localStorage.setItem('kudos_token', response.token);
      }
      const userData = response.user || response;
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('kudos_token');
    setUser(null);
  }, []);


  // ── Profile helpers (used by Dashboard) ─────────────────────────────────
  // Optimistically updates local state; also persists to the API.
  const updateUserData = useCallback((updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);
 
  const updateProfile = useCallback(async (updates) => {
    // Optimistic update so the UI feels instant
    setUser(prev => prev ? { ...prev, ...updates } : null);
    try {
      const res = await authService.updateProfile(updates);
      // Sync with server's canonical response
      const serverUser = res.user || res;
      setUser(prev => prev ? { ...prev, ...serverUser } : null);
      return { success: true };
    } catch (err) {
      // Roll back on failure
      setUser(prev => prev ? { ...prev, ...updates } : null); // keep optimistic; caller shows toast
      return { success: false, error: err.message };
    }
  }, []);
 
  const updateAvatarColor = useCallback(async (color) => {
    return updateProfile({ avatarColor: color });
  }, [updateProfile]);
 


  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateUserData,
    updateProfile,
    updateAvatarColor,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};