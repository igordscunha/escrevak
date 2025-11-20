'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { LoadingComponent } from '../components/LoadingComponent';
import { useRouter } from 'next/navigation';

interface User { 
  id: number; 
  name: string;
  lastname: string;
  email: string;
  profile_picture: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

//Isso tudo é pra conseguir ler a porcaria do payload do token em utf-8
function decodeJwtPayload(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    
    return JSON.parse(jsonPayload);
  }
  catch(error) {
    console.error("Falha ao descofificar JWT: ", error)
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Isso tudo é pra conseguir ler a porcaria do payload do token em utf-8
  useEffect(() => {
    const storedToken = Cookies.get('authToken');
    if (storedToken) {

      const payload = decodeJwtPayload(storedToken);

      if(payload){
        setUser({
          id: payload.userId,
          name: payload.name,
          email: payload.email,
          lastname: payload.lastname,
          profile_picture: payload.profile_picture
        });
        setToken(storedToken);
      } else {
        console.error("Falha ao decodificar token do cookie");
        Cookies.remove('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, userObject: User) => {
    setUser(userObject);
    setToken(newToken);

    const twelveHours = new Date(new Date().getTime() + 12 * 60 * 60 * 1000);
    Cookies.set('authToken', newToken, { expires: twelveHours, secure: true });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove('authToken');
    router.push("/");
  };

  if(isLoading) {
    return <LoadingComponent />;
  }

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
