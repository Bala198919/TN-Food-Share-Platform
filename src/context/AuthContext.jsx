import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('food_share_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('food_share_token');
      if (token) {
        try {
          const res = await fetch(`${API_URL}/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setUser(data.data);
            localStorage.setItem('food_share_user', JSON.stringify(data.data));
          } else {
            // Token expired or invalid
            logout();
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        const userData = data.data;
        localStorage.setItem('food_share_token', userData.token);
        // Save user without token in user state
        const { token, ...userSafe } = userData;
        setUser(userSafe);
        localStorage.setItem('food_share_user', JSON.stringify(userSafe));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Invalid email or password.' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Server connection error. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      const data = await res.json();

      if (data.success) {
        const newUserData = data.data;
        localStorage.setItem('food_share_token', newUserData.token);
        const { token, ...userSafe } = newUserData;
        setUser(userSafe);
        localStorage.setItem('food_share_user', JSON.stringify(userSafe));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Email already registered.' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Server connection error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('food_share_token');
    localStorage.removeItem('food_share_user');
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    // Keep local profile update for smooth frontend display
    setUser((prev) => {
      const nextUser = prev ? { ...prev, ...updatedData } : null;
      if (nextUser) {
        localStorage.setItem('food_share_user', JSON.stringify(nextUser));
      }
      return nextUser;
    });
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
