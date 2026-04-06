// src/services/api.js
import { API_BASE_URL } from '../../config/index.js';

class ApiError extends Error {
  constructor(message, status, data, isRateLimit = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.isRateLimit = isRateLimit;
  }
}

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // 🔍 DEBUG LOGS
  console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
  console.log('📦 Request body:', options.body);

  const token = localStorage.getItem('kudos_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    console.log('📡 Fetching...');
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    console.log(`📥 Response status: ${response.status}`);
    const data = await response.json();
    console.log('📥 Response data:', data);
    if (!response.ok) {
      // Handle rate limiting from postLimiter
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || 2000;
        throw new ApiError(
          data.message || 'Too many requests. Please slow down.',
          429,
          data,
          true
        );
      }
      throw new ApiError(data.message || 'Request failed', response.status, data);
    }

    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error. Please check your connection.', 0, null);
  }
};

// ============ AUTH SERVICES (/api/auth) ============
export const authService = {
  // POST /api/auth/register
  register: (credentials) => 
    request('/auth/register', { 
      method: 'POST', 
      body: JSON.stringify(credentials) 
    }),
  
  // POST /api/auth/login
  login: (credentials) => 
    request('/auth/login', { 
      method: 'POST', 
      body: JSON.stringify(credentials) 
    }),
  
  // GET /api/auth/me (protect middleware)
  getCurrentUser: () => request('/auth/me'),
  
  // PATCH /api/auth/profile (protect middleware)
  updateProfile: (updates) => 
    request('/auth/profile', { 
      method: 'PATCH', 
      body: JSON.stringify(updates) 
    }),
};

// ============ USER SERVICES (/api/users) ============
export const userService = {
  // GET /api/users/:username (optionalAuth) - public profile
  getPublicProfile: (username) => 
    request(`/users/${username}`),
  
  // GET /api/users/:username/stats - public stats
  getPublicStats: (username) => 
    request(`/users/${username}/stats`),
};

// ============ KUDOS SERVICES (/api/kudos) ============
export const kudosService = {
  // GET /api/kudos/:username (optionalAuth) - get kudos for user
  getKudos: (username, filters = {}) => {
    const params = new URLSearchParams(filters);
    return request(`/kudos/${username}${params.toString() ? `?${params}` : ''}`);
  },
  
  // POST /api/kudos/:username (postLimiter applied) - send a kudo
  sendKudo: (username, kudoData) => 
    request(`/kudos/${username}`, { 
      method: 'POST', 
      body: JSON.stringify({
        emoji: kudoData.emoji,
        message: kudoData.message,
        nick: kudoData.nick,
      })
    }),
  
  // PATCH /api/kudos/:username/:kudoId/pin (protect)
  togglePin: (username, kudoId) => 
    request(`/kudos/${username}/${kudoId}/pin`, { 
      method: 'PATCH' 
    }),
  
  // PATCH /api/kudos/:username/:kudoId/hide (protect)
  toggleHide: (username, kudoId) => 
    request(`/kudos/${username}/${kudoId}/hide`, { 
      method: 'PATCH' 
    }),
  
  // DELETE /api/kudos/:username/:kudoId (protect)
  deleteKudo: (username, kudoId) => 
    request(`/kudos/${username}/${kudoId}`, { 
      method: 'DELETE' 
    }),
};

export { ApiError };