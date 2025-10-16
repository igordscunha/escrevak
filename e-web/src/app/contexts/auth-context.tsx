'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface User { 
  id: number; 
  name: string;
  lastname: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = Cookies.get('authToken');
    if (storedToken) { login(storedToken); }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    try {
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      setUser({ id: payload.id, name: payload.name, lastname: payload.lastname, email: payload.email });
      setToken(newToken);
      Cookies.set('authToken', newToken, { expires: 1, secure: process.env.NODE_ENV === 'production' });
    } catch (error) {
      console.error("Erro ao descodificar token:", error);
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove('authToken');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) { throw new Error('useAuth deve ser usado dentro de um AuthProvider'); }
  return context;
};
