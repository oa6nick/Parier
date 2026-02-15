"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { users } from "@/lib/mockData/users";
import { useRouter } from "@/navigation";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  register: (username: string, email: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check local storage on mount
    const storedUserId = localStorage.getItem("parier_user_id");
    if (storedUserId) {
      const foundUser = users.find(u => u.id === storedUserId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, we'll just log in as the first user if email matches "demo" or whatever
    // Or just always log in as the first user for simplicity in this mock
    const mockUser = users[0]; // Always login as main mock user
    
    setUser(mockUser);
    localStorage.setItem("parier_user_id", mockUser.id);
    setIsLoading(false);
  };

  const register = async (username: string, email: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser = users[0]; // For now, just map to existing user
    
    setUser(mockUser);
    localStorage.setItem("parier_user_id", mockUser.id);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("parier_user_id");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
