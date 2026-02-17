"use client";

import React, { createContext, useContext } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "@/navigation";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email?: string) => Promise<void>;
  register: (username: string, email: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function sessionToUser(session: { user?: { id?: string; sub?: string; name?: string | null; email?: string | null; image?: string | null } }): User | null {
  if (!session?.user) return null;
  const u = session.user;
  const id = u.id ?? u.sub ?? "";
  return {
    id,
    username: u.name ?? u.email ?? "User",
    avatar: u.image ?? undefined,
    rating: 0,
    winRate: 0,
    verified: false,
    joinedDate: new Date(),
    totalBets: 0,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session ? sessionToUser(session) : null;
  const isLoading = status === "loading";
  const accessToken = (session as { accessToken?: string })?.accessToken ?? null;

  const login = async () => {
    await signIn("keycloak", { callbackUrl: "/" });
  };

  const register = async () => {
    await signIn("keycloak", { callbackUrl: "/onboarding" });
  };

  const logout = () => {
    signOut({ callbackUrl: "/" });
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, isLoading, accessToken }}>
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
