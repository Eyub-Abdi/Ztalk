import { useCallback, useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  FiArrowLeft,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiGlobe,
  FiMail,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "./AuthModalProvider";
import { useAuth } from "./AuthProvider";
import { useLogin } from "./useAuthApi";
import clsx from "clsx";

interface WizardRegisterState {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  user_type: "student" | "tutor";
  preferred_language: string;
  phone_number: string;
  country: string;
  terms_accepted: boolean;
}

const getInitialRegisterState = (): WizardRegisterState => ({
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  password_confirm: "",
  user_type: "student",
  preferred_language: "en",
  phone_number: "",
  country: "",
  terms_accepted: false,
});

// Toast state type
interface ToastState {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

// Global toast state
let toastListeners: ((toasts: ToastState[]) => void)[] = [];
let toasts: ToastState[] = [];
let toastId = 0;

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toasts]));
}

function addToast(message: string, type: "success" | "error" | "info") {
  const id = ++toastId;
  toasts = [...toasts, { id, message, type }];
  notifyListeners();

  // Auto-remove after 4 seconds
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notifyListeners();
  }, 4000);
}

function useToastState() {
  const [state, setState] = useState<ToastState[]>([]);

  useEffect(() => {
    toastListeners.push(setState);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setState);
    };
  }, []);

  return state;
}

// Simple toast hook
function useSimpleToast() {
  return {
    show: (message: string, type: "success" | "error" | "info" = "info") => {
      addToast(message, type);
    },
  };
}

// Toast container component
function ToastContainer() {
  const toastList = useToastState();

  if (toastList.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[10000] flex flex-col gap-2">
      {toastList.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            "px-5 py-3 rounded-xl shadow-xl backdrop-blur-md flex items-center gap-3 animate-slide-in-right min-w-[280px]",
            toast.type === "success" &&
              "bg-gradient-to-r from-green-500/95 to-emerald-600/95 text-white",
            toast.type === "error" &&
              "bg-gradient-to-r from-red-500/95 to-rose-600/95 text-white",
            toast.type === "info" &&
              "bg-gradient-to-r from-brand-500/95 to-indigo-600/95 text-white"
          )}
        >
          <span className="text-lg">
            {toast.type === "success" && "✓"}
            {toast.type === "error" && "✕"}
            {toast.type === "info" && "ℹ"}
          </span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

export function AuthModal() {
  const { isOpen, view, close, openLogin, openSignup } = useAuthModal();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const toast = useSimpleToast();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [formLogin, setFormLogin] = useState({ email: "", password: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to trigger animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before hiding
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      close();
    }, 200);
  }, [close]);

  const SIGNUP_PROGRESS_KEY = "auth_signup_progress_v1";

  const [formRegister, setFormRegister] = useState<WizardRegisterState>(() =>
    getInitialRegisterState()
  );
  const [signupStep, setSignupStep] = useState<0 | 1 | 2>(0);
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [mockLoading, setMockLoading] = useState(false);
  const [accountSubmitted, setAccountSubmitted] = useState(false);

  type StoredProgress = {
    step: number;
    accountSubmitted: boolean;
    formSnapshot: Partial<WizardRegisterState>;
  };

  const hasHydrated = useRef(false);
  const skipPersistence = useRef(false);

  const clampStep = useCallback((value: number): 0 | 1 | 2 => {
    const clamped = Math.max(0, Math.min(2, Math.floor(value)));
    return clamped as 0 | 1 | 2;
  }, []);

  const sanitizeFormForStorage = useCallback(
    (form: WizardRegisterState): StoredProgress["formSnapshot"] => ({
      ...form,
    }),
    []
  );

  const resetProgress = useCallback(() => {
    skipPersistence.current = true;
    localStorage.removeItem(SIGNUP_PROGRESS_KEY);
    setAccountSubmitted(false);
    setSignupStep(0);
    setFormRegister(getInitialRegisterState());
    setEmailSent(false);
    setEmailVerified(false);
  }, []);

  useEffect(() => {
    if (hasHydrated.current) return;
    try {
      const stored = localStorage.getItem(SIGNUP_PROGRESS_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored) as StoredProgress;

      if (parsed.formSnapshot) {
        setFormRegister((prev) => ({ ...prev, ...parsed.formSnapshot }));
      }
      if (typeof parsed.step === "number") {
        setSignupStep(clampStep(parsed.step));
      }
      if (parsed.accountSubmitted) {
        setAccountSubmitted(true);
      }
    } catch (err) {
      console.warn("Failed to load saved signup progress", err);
    } finally {
      hasHydrated.current = true;
    }
  }, [clampStep]);

  useEffect(() => {
    if (!hasHydrated.current) return;
    if (skipPersistence.current) {
      skipPersistence.current = false;
      return;
    }

    const payload: StoredProgress = {
      step: signupStep,
      accountSubmitted,
      formSnapshot: sanitizeFormForStorage(formRegister),
    };

    try {
      localStorage.setItem(SIGNUP_PROGRESS_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn("Failed to persist signup progress", err);
    }
  }, [accountSubmitted, formRegister, sanitizeFormForStorage, signupStep]);

  // Auto-detect country
  useEffect(() => {
    if (!formRegister.country) {
      try {
        const locale = Intl.DateTimeFormat().resolvedOptions().locale;
        const guess = locale.split("-")[1] || "";
        if (guess)
          setFormRegister((f) => ({ ...f, country: guess.toUpperCase() }));
      } catch {
        // ignore
      }
    }
  }, [formRegister.country]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email: formLogin.email, password: formLogin.password },
      {
        onSuccess: (d) => {
          setAuth(d.user, d.access, d.refresh);
          toast.show("Logged in successfully", "success");
          close();
          navigate("/dashboard");
        },
        onError: (err) => {
          toast.show(`Login failed: ${err.message}`, "error");
        },
      }
    );
  };

  const handleBasicRegister = () => {
    if (formRegister.password !== formRegister.password_confirm) {
      toast.show("Passwords do not match", "error");
      return;
    }
    if (!formRegister.terms_accepted) {
      toast.show("You must accept terms", "error");
      return;
    }

    setMockLoading(true);

    const isFormValid =
      formRegister.email &&
      formRegister.password &&
      formRegister.first_name &&
      formRegister.last_name &&
      formRegister.user_type;

    setTimeout(() => {
      setMockLoading(false);

      if (isFormValid) {
        setAccountSubmitted(true);
        toast.show("Account created successfully", "success");
        resetProgress();
        openLogin();
      } else {
        toast.show("Please fill in all required fields", "error");
      }
    }, 1500);
  };

  const loading = loginMutation.isPending || mockLoading;

  const passwordStrength = (() => {
    const p = formRegister.password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ["Very weak", "Weak", "Fair", "Good", "Strong"][
    passwordStrength
  ];

  const pwReq = {
    length: formRegister.password.length >= 8,
    upper: /[A-Z]/.test(formRegister.password),
    digit: /[0-9]/.test(formRegister.password),
    special: /[^A-Za-z0-9]/.test(formRegister.password),
  };

  const googleAuth = () => {
    const base =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
    window.location.href = `${base}/accounts/google/login/`;
  };

  if (!isOpen) return <ToastContainer />;

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          role="button"
          tabIndex={0}
          aria-label="Close authentication modal"
          onClick={close}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
              close();
            }
          }}
        />

        {/* Modal content */}
        <div className="relative bg-white rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-center flex-1">
              {view === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <button
              onClick={close}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Tabs */}
            <div className="flex mb-4 border border-gray-300 rounded-lg overflow-hidden">
              <button
                className={clsx(
                  "flex-1 py-2 text-sm font-medium transition-colors",
                  view === "login"
                    ? "bg-gray-50 text-gray-900"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                )}
                onClick={() => {
                  openLogin();
                  setSignupStep(0);
                }}
              >
                Login
              </button>
              <button
                className={clsx(
                  "flex-1 py-2 text-sm font-medium transition-colors",
                  view === "signup"
                    ? "bg-gray-50 text-gray-900"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                )}
                onClick={openSignup}
              >
                Sign Up
              </button>
            </div>

            {view === "login" ? (
              <div className="flex flex-col gap-6">
                {/* Login form */}
                <div className="w-full">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                      <label
                        htmlFor="login-email"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formLogin.email}
                        onChange={(e) =>
                          setFormLogin((f) => ({ ...f, email: e.target.value }))
                        }
                        className="input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="login-password"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          required
                          value={formLogin.password}
                          onChange={(e) =>
                            setFormLogin((f) => ({
                              ...f,
                              password: e.target.value,
                            }))
                          }
                          className="input pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-full disabled:opacity-50"
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </form>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-500">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Social login */}
                <div className="w-full">
                  <button
                    onClick={googleAuth}
                    disabled={loading}
                    className="btn w-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2 py-3"
                  >
                    <FcGoogle className="w-5 h-5" />
                    <span>Continue with Google</span>
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    We never post to any account. You&#39;ll choose a password
                    later if needed.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Progress indicator */}
                <div className="mb-4 px-2">
                  <div className="flex items-center justify-center gap-0 mb-3">
                    {[0, 1, 2].map((step) => (
                      <div key={step} className="flex items-center flex-1">
                        <div
                          className={clsx(
                            "w-full h-[3px] rounded-full transition-all relative",
                            signupStep >= step ? "bg-brand-500" : "bg-gray-200"
                          )}
                        >
                          <div
                            className={clsx(
                              "absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-[3px] transition-all",
                              signupStep >= step
                                ? "bg-brand-500 border-brand-500"
                                : "bg-gray-200 border-white",
                              signupStep === step && "ring-4 ring-brand-100"
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between px-2">
                    {["Verify", "Details", "Preferences"].map((label, idx) => (
                      <span
                        key={label}
                        className={clsx(
                          "text-xs transition-colors",
                          signupStep === idx
                            ? "text-brand-600 font-semibold"
                            : "text-gray-500"
                        )}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Step 0: Email verification */}
                  {signupStep === 0 && (
                    <div className="px-3">
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="p-3 rounded-2xl bg-brand-50 text-brand-600 mb-2">
                          <FiMail className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Let&apos;s get started
                        </h3>
                        <p className="text-sm text-gray-600 max-w-[340px]">
                          Enter your email to begin your journey with us
                        </p>
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="signup-email"
                          className="block text-sm font-semibold text-gray-700 mb-1.5"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="signup-email"
                          type="email"
                          value={formRegister.email}
                          autoComplete="email"
                          onChange={(e) =>
                            setFormRegister((f) => ({
                              ...f,
                              email: e.target.value,
                            }))
                          }
                          placeholder="your@email.com"
                          className="input h-12 text-base"
                        />
                      </div>

                      <div className="space-y-2.5 mb-3">
                        {!emailSent && (
                          <button
                            onClick={() => {
                              if (
                                !formRegister.email ||
                                !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(
                                  formRegister.email
                                )
                              ) {
                                toast.show("Enter a valid email", "error");
                                return;
                              }
                              setEmailSent(true);
                              toast.show("Verification email sent", "info");
                            }}
                            className="btn btn-primary w-full h-12 text-base font-semibold flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg transition-all"
                          >
                            Send verification link
                            <FiArrowRight />
                          </button>
                        )}

                        <div className="relative my-2">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-white text-gray-500 font-medium">
                              Or continue with
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={googleAuth}
                          className="btn w-full h-12 border border-gray-300 hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-sm transition-all flex items-center justify-center gap-2 font-semibold"
                        >
                          <FcGoogle className="w-5 h-5" />
                          Continue with Google
                        </button>
                      </div>

                      {emailSent && !emailVerified && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <FiMail className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                              <p className="text-sm font-semibold text-blue-900">
                                Check your email
                              </p>
                              <p className="text-xs text-blue-700">
                                We sent a verification link to{" "}
                                <span className="font-semibold">
                                  {formRegister.email}
                                </span>
                              </p>
                              <div className="flex gap-2 pt-1">
                                <button
                                  onClick={() =>
                                    toast.show(
                                      "Verification link resent",
                                      "success"
                                    )
                                  }
                                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  Resend link
                                </button>
                                <button
                                  onClick={() => {
                                    setEmailVerified(true);
                                    setSignupStep(1);
                                  }}
                                  className="text-xs text-green-600 hover:text-green-800 font-medium"
                                >
                                  [Demo] Mark as verified
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 1: Details */}
                  {signupStep === 1 && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="p-3 rounded-full bg-brand-100 text-brand-600 mb-2">
                          <FiUser className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Tell us about yourself
                        </h3>
                        <p className="text-sm text-gray-600">
                          We need some basic information to set up your account
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label
                            htmlFor="reg-first-name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="reg-first-name"
                            value={formRegister.first_name}
                            onChange={(e) =>
                              setFormRegister((f) => ({
                                ...f,
                                first_name: e.target.value,
                              }))
                            }
                            placeholder="John"
                            className="input h-12 bg-white border-2 focus:border-brand-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="reg-last-name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="reg-last-name"
                            value={formRegister.last_name}
                            onChange={(e) =>
                              setFormRegister((f) => ({
                                ...f,
                                last_name: e.target.value,
                              }))
                            }
                            placeholder="Doe"
                            className="input h-12 bg-white border-2 focus:border-brand-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="reg-password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              id="reg-password"
                              type={showPassword ? "text" : "password"}
                              value={formRegister.password}
                              autoComplete="new-password"
                              onChange={(e) =>
                                setFormRegister((f) => ({
                                  ...f,
                                  password: e.target.value,
                                }))
                              }
                              placeholder="Create a strong password"
                              className="input h-12 bg-white border-2 focus:border-brand-500 pr-12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((s) => !s)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                              {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="reg-password-confirm"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Confirm Password{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="reg-password-confirm"
                            type={showPassword ? "text" : "password"}
                            value={formRegister.password_confirm}
                            autoComplete="new-password"
                            onChange={(e) =>
                              setFormRegister((f) => ({
                                ...f,
                                password_confirm: e.target.value,
                              }))
                            }
                            placeholder="Confirm your password"
                            className="input h-12 bg-white border-2 focus:border-brand-500"
                          />
                        </div>
                      </div>

                      {/* Password strength */}
                      <div className="mb-4 p-3 bg-white rounded-md border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Password strength
                        </p>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
                          <div
                            className={clsx(
                              "h-full transition-all",
                              passwordStrength >= 4
                                ? "bg-green-500"
                                : passwordStrength === 3
                                ? "bg-blue-500"
                                : passwordStrength === 2
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            )}
                            style={{
                              width: `${(passwordStrength / 4) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          {strengthLabel}
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>
                            • 8+ characters{" "}
                            {pwReq.length && (
                              <span className="text-green-500">✔</span>
                            )}
                          </li>
                          <li>
                            • Uppercase letter{" "}
                            {pwReq.upper && (
                              <span className="text-green-500">✔</span>
                            )}
                          </li>
                          <li>
                            • Number{" "}
                            {pwReq.digit && (
                              <span className="text-green-500">✔</span>
                            )}
                          </li>
                          <li>
                            • Special character{" "}
                            {pwReq.special && (
                              <span className="text-green-500">✔</span>
                            )}
                          </li>
                        </ul>
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          onClick={() => setSignupStep(0)}
                          className="btn btn-outline flex items-center gap-2"
                        >
                          <FiArrowLeft />
                          Back
                        </button>
                        <button
                          onClick={() => {
                            if (
                              !formRegister.first_name ||
                              !formRegister.last_name
                            ) {
                              toast.show("Enter your name", "error");
                              return;
                            }
                            if (formRegister.password.length < 8) {
                              toast.show("Password too weak", "error");
                              return;
                            }
                            setSignupStep(2);
                          }}
                          className="btn btn-primary flex items-center gap-2"
                        >
                          Next
                          <FiArrowRight />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Preferences */}
                  {signupStep === 2 && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="p-3 rounded-full bg-brand-100 text-brand-600 mb-2">
                          <FiGlobe className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Almost there!
                        </h3>
                        <p className="text-sm text-gray-600">
                          Help us customize your learning experience
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label
                            htmlFor="reg-user-type"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            User Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="reg-user-type"
                            value={formRegister.user_type}
                            onChange={(e) =>
                              setFormRegister((f) => ({
                                ...f,
                                user_type: e.target.value as
                                  | "student"
                                  | "tutor",
                              }))
                            }
                            className="input h-12"
                          >
                            <option value="student">Student</option>
                            <option value="tutor">Tutor</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="reg-language"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Preferred Language
                          </label>
                          <select
                            id="reg-language"
                            value={formRegister.preferred_language}
                            onChange={(e) =>
                              setFormRegister((f) => ({
                                ...f,
                                preferred_language: e.target.value,
                              }))
                            }
                            className="input h-12"
                          >
                            <option value="en">English</option>
                            <option value="sw">Swahili</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="reg-phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Phone (optional)
                          </label>
                          <input
                            id="reg-phone"
                            value={formRegister.phone_number}
                            onChange={(e) =>
                              setFormRegister((f) => ({
                                ...f,
                                phone_number: e.target.value,
                              }))
                            }
                            autoComplete="tel"
                            className="input h-12"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="reg-country"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Country
                          </label>
                          <input
                            id="reg-country"
                            value={formRegister.country}
                            onChange={(e) =>
                              setFormRegister((f) => ({
                                ...f,
                                country: e.target.value,
                              }))
                            }
                            className="input h-12"
                          />
                        </div>
                      </div>

                      <label className="flex items-start gap-2 mb-4 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formRegister.terms_accepted}
                          onChange={(e) =>
                            setFormRegister((f) => ({
                              ...f,
                              terms_accepted: e.target.checked,
                            }))
                          }
                          className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                        />
                        <span className="text-sm text-gray-700">
                          I agree to the{" "}
                          <a
                            href="/terms"
                            className="text-brand-500 hover:underline"
                          >
                            Terms
                          </a>{" "}
                          &{" "}
                          <a
                            href="/privacy"
                            className="text-brand-500 hover:underline"
                          >
                            Privacy Policy
                          </a>
                        </span>
                      </label>

                      <div className="flex justify-between items-start mb-4">
                        <button
                          onClick={() => setSignupStep(1)}
                          className="btn btn-ghost text-sm"
                        >
                          Back
                        </button>
                        <div className="text-center">
                          <button
                            onClick={handleBasicRegister}
                            disabled={loading || accountSubmitted}
                            className="btn btn-primary disabled:opacity-50"
                          >
                            {loading
                              ? "Submitting..."
                              : accountSubmitted
                              ? "Submitted"
                              : "Submit"}
                          </button>
                          <p className="text-xs text-gray-500 mt-2">
                            Demo mode - submission mocked
                          </p>
                        </div>
                      </div>

                      <hr className="border-gray-200 my-4" />

                      <div className="text-center space-y-3">
                        <p className="text-sm text-gray-600">Or sign up with</p>
                        <button
                          onClick={googleAuth}
                          disabled={loading}
                          className="btn w-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                        >
                          <FcGoogle className="w-5 h-5" />
                          Google
                        </button>
                        <p className="text-xs text-gray-500 max-w-[260px] mx-auto">
                          We only use your name & email for account creation.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
