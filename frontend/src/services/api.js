const API_BASE_URL = 'http://localhost:5000/api/v1';

export const api = {
  // Health Check
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  // Auth API
  login: async (username, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  // Directory API
  getDirectory: async (category = '', search = '') => {
    try {
      const queryParams = new URLSearchParams();
      if (category && category !== 'All') queryParams.append('category', category);
      if (search) queryParams.append('search', search);

      const res = await fetch(`${API_BASE_URL}/directory?${queryParams.toString()}`);
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch {
      return null; // Fallback to Context local state
    }
  },

  createDirectoryItem: async (itemData) => {
    const res = await fetch(`${API_BASE_URL}/directory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    return await res.json();
  },

  // Events API
  getEvents: async (category = '') => {
    try {
      const queryParams = new URLSearchParams();
      if (category && category !== 'All') queryParams.append('category', category);

      const res = await fetch(`${API_BASE_URL}/events?${queryParams.toString()}`);
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  // Contact API
  submitContactForm: async (formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      return data;
    } catch (err) {
      throw err;
    }
  }
};
