'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Logout from '@/components/auth/logout';

interface AuthContextProps {
  loggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const login = () => {
    setLoggedIn(true);
  };

  const logout = async () => {
    const isLoggedOut = await Logout();
    if (isLoggedOut) {
      localStorage.removeItem('token');
      setLoggedIn(false);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
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

