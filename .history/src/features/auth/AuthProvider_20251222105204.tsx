import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import type { User } from "./authTypes";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (u: User, access: string, refresh: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // hydrate from storage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedAccessRaw = localStorage.getItem("access_token");
      const storedRefreshRaw = localStorage.getItem("refresh_token");
      const storedAccess =
        storedAccessRaw &&
        storedAccessRaw !== "undefined" &&
        storedAccessRaw !== "null"
          ? storedAccessRaw
          : null;
      const storedRefresh =
        storedRefreshRaw &&
        storedRefreshRaw !== "undefined" &&
        storedRefreshRaw !== "null"
          ? storedRefreshRaw
          : null;
      if (storedUser && storedAccess && storedRefresh) {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
      }
    } catch (e) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setAuth = useCallback((u: User, access: string, refresh: string) => {
    setUser(u);
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }, []);

  const value: AuthContextValue = {
    user,
    accessToken,
    refreshToken,
    setAuth,
    logout,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
