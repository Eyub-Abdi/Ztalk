import { createContext, useCallback, useContext, useState } from "react";

type AuthView = "login" | "signup";

interface AuthModalContextValue {
  isOpen: boolean;
  view: AuthView;
  openLogin: () => void;
  openSignup: () => void;
  close: () => void;
  verifiedEmail: string | null;
  setVerifiedEmail: (email: string | null) => void;
}

const AuthModalContext = createContext<AuthModalContextValue | undefined>(
  undefined
);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthView>("login");
  const [verifiedEmail, setVerifiedEmailState] = useState<string | null>(null);

  const openLogin = useCallback(() => {
    setView("login");
    setIsOpen(true);
  }, []);
  const openSignup = useCallback(() => {
    setView("signup");
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const setVerifiedEmail = useCallback((email: string | null) => {
    setVerifiedEmailState(email);
  }, []);

  return (
    <AuthModalContext.Provider
      value={{ isOpen, view, openLogin, openSignup, close, verifiedEmail, setVerifiedEmail }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx)
    throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}
