"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

// Define user roles
export type UserRole = 'admin' | 'user' | 'guest';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Define the shape of your AuthContext
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Real login function that connects to the API
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);
      if (response.success) {
        const user: User = {
          id: response.token, // Use token as id for now
          name: email.split('@')[0], // Use email prefix as name
          email: email,
          role: 'user' // Default role
        };
        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  // Computed properties
  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      login, 
      logout, 
      isAuthenticated, 
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
