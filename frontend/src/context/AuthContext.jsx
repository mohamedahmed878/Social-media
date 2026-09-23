import React, { createContext, useEffect, useState } from 'react';
import { getMe, loginUser, logoutUser, registerUser } from '../services/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('jeera_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jeera_token');
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then((data) => {
        setUser(data);
        localStorage.setItem('jeera_user', JSON.stringify(data));
      })
      .catch(() => {
        localStorage.removeItem('jeera_token');
        localStorage.removeItem('jeera_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persist = (data) => {
    const { token, ...rest } = data;
    localStorage.setItem('jeera_token', token);
    localStorage.setItem('jeera_user', JSON.stringify(rest));
    setUser(rest);
  };

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    persist(data);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await registerUser({ name, email, password });
    persist(data);
    return data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // مش مشكلة لو فشل - هننضف محلي برضه
    }
    localStorage.removeItem('jeera_token');
    localStorage.removeItem('jeera_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
