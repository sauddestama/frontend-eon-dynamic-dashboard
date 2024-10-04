"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "./axiosInterceptor";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  token: string | null;
  username: string | null;
  roleId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const authToken =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1] || null;
    const storedUserId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userId="))
      ?.split("=")[1];
    const storedUsername = document.cookie
      .split("; ")
      .find((row) => row.startsWith("username="))
      ?.split("=")[1];
    const storedRoleId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1];

    if (authToken) {
      setIsLoggedIn(true);
      setToken(authToken);
    }
    if (storedUserId) setUserId(storedUserId);
    if (storedUsername) setUsername(decodeURIComponent(storedUsername));
    if (storedRoleId) setRoleId(storedRoleId);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/api/users/login", {
        email,
        password,
      });
      if (
        response.data.token &&
        response.data.userId &&
        response.data.username &&
        response.data.roleId
      ) {
        document.cookie = `authToken=${response.data.token}; path=/; max-age=86400`;
        document.cookie = `userId=${response.data.userId}; path=/; max-age=86400`;
        document.cookie = `username=${encodeURIComponent(
          response.data.username
        )}; path=/; max-age=86400`;
        document.cookie = `role=${response.data.roleId}; path=/; max-age=86400`;

        setIsLoggedIn(true);
        setUserId(response.data.userId);
        setToken(response.data.token);
        setUsername(response.data.username);
        setRoleId(response.data.roleId);

        console.log("Login successful. RoleId:", response.data.roleId);

        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    ["authToken", "userId", "username", "role"].forEach((cookieName) => {
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    });

    setIsLoggedIn(false);
    setUserId(null);
    setToken(null);
    setUsername(null);
    setRoleId(null);
    router.push("/auth");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userId, token, username, roleId, login, logout }}
    >
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
