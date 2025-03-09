"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase, UserProfile, getUserProfile } from "./client";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Obtener el usuario actual
    const fetchUser = async () => {
      try {
        setLoading(true);

        // Verificar si hay un usuario autenticado
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);

          // Obtener el perfil del usuario
          const { data, error } = await getUserProfile(session.user.id);

          if (error) {
            throw error;
          }

          if (data) {
            setProfile(data);
          }
        }
      } catch (err) {
        console.error("Error al cargar el usuario:", err);
        setError(err instanceof Error ? err : new Error("Error desconocido"));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Suscribirse a cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);

          // Obtener el perfil del usuario
          const { data } = await getUserProfile(session.user.id);
          if (data) {
            setProfile(data);
          }
        } else {
          setUser(null);
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      setError(
        err instanceof Error ? err : new Error("Error al cerrar sesión")
      );
    }
  };

  const value = {
    user,
    profile,
    loading,
    error,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  return context;
}
