"use client";

import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { subscribeToAuthChange } from "@/lib/firebase/auth";
import { getAdminByUid, updateLastLogin } from "@/lib/firestore/admins";
import { Admin } from "@/types/user";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChange(async (currentUser) => {
      try {
        setUser(currentUser);

        if (currentUser) {
          const adminData = await withTimeout(
            getAdminByUid(currentUser.uid),
            15000
          );
          setAdmin(adminData);

          if (adminData) {
            updateLastLogin(currentUser.uid).catch(() => {});
          }
        } else {
          setAdmin(null);
        }
        setAuthError(null);
      } catch (error) {
        console.error("Auth check error:", error);
        setAdmin(null);
        setAuthError(
          error instanceof Error
            ? error.message
            : "Gagal terhubung ke server. Periksa koneksi internet Anda."
        );
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    admin,
    loading,
    isAuthenticated: !!user,
    isAdmin: !!admin,
    role: admin?.role || null,
    authError,
  };
}
