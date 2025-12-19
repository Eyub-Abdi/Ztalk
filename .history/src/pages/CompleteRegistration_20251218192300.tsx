import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useCompleteRegistration,
  CompleteRegistrationPayload,
} from "../features/auth/useAuthApi";
import { useAuth } from "../features/auth/AuthProvider";
import {
  FiUser,
  FiLock,
  FiPhone,
  FiGlobe,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiArrowRight,
  FiLoader,
} from "react-icons/fi";
import clsx from "clsx";

// Toast state type
interface ToastState {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

// Simple toast implementation
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

function useToast() {
  return {
    show: (message: string, type: "success" | "error" | "info" = "info") => {
      addToast(message, type);
    },
  };
}

function ToastContainer() {
  const toastList = useToastState();
  if (toastList.length === 0) return null;
  return (
    <div className="fixed top-4 right-4 z-[10000] flex flex-col gap-2">
      {toastList.map((t) => (
        <div
          key={t.id}
          className={clsx(
            "px-5 py-3 rounded-xl shadow-xl backdrop-blur-md flex items-center gap-3 animate-slide-in-right min-w-[280px]",
            t.type === "success" &&
              "bg-gradient-to-r from-green-500/95 to-emerald-600/95 text-white",
            t.type === "error" &&
              "bg-gradient-to-r from-red-500/95 to-rose-600/95 text-white",
            t.type === "info" &&
              "bg-gradient-to-r from-brand-500/95 to-indigo-600/95 text-white"
          )}
        >
          <span className="text-lg">
            {t.type === "success" && "✓"}
            {t.type === "error" && "✕"}
            {t.type === "info" && "ℹ"}
          </span>
          <span className="text-sm font-medium">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// Country options
const countries = [
  { code: "TZ", name: "Tanzania" },
  { code: "KE", name: "Kenya" },
  { code: "UG", name: "Uganda" },
  { code: "RW", name: "Rwanda" },
  { code: "ET", name: "Ethiopia" },
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
  { code: "ZA", name: "South Africa" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "OTHER", name: "Other" },
];

// Language options
const languages = [
  { code: "en", name: "English" },
  { code: "sw", name: "Swahili" },
  { code: "fr", name: "French" },
  { code: "ar", name: "Arabic" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
];

export default function CompleteRegistration() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const toast = useToast();
  const registerMutation = useCompleteRegistration();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<CompleteRegistrationPayload>({
    verification_token: token || "",
    username: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    country: "",
    preferred_language: "en",
  });

  // Update token if it changes
  useEffect(() => {
    if (token) {
      setForm((prev) => ({ ...prev, verification_token: token }));
    }
  }, [token]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    if (!form.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!form.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!form.password_confirm) {
      newErrors.password_confirm = "Please confirm your password";
    } else if (form.password !== form.password_confirm) {
      newErrors.password_confirm = "Passwords don't match";
    }

    if (!form.country) {
      newErrors.country = "Please select your country";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.show("Please fix the errors in the form", "error");
      return;
    }

    try {
      const result = await registerMutation.mutateAsync(form);
      setAuth(result.user, result.access, result.refresh);
      toast.show("Registration successful! Welcome to Ztalk!", "success");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      toast.show(message, "error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100 mb-6">
            <FiUser className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Registration Link
          </h1>
          <p className="text-gray-600 mb-6">
            This registration link is invalid or has expired.
          </p>
          <Link
            to="/"
            className="btn btn-primary px-6 py-2 inline-flex items-center gap-2"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-brand-600">Ztalk</h1>
          </Link>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-white mb-4">
            <FiCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Your Registration
          </h2>
          <p className="text-gray-600">
            Your email has been verified. Fill in your details to get started.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    @
                  </span>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="johndoe"
                    className={clsx(
                      "w-full pl-9 pr-4 py-3 rounded-xl border-2 bg-gray-50 focus:bg-white transition-all outline-none",
                      errors.username
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-brand-500"
                    )}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      placeholder="John"
                      className={clsx(
                        "w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-gray-50 focus:bg-white transition-all outline-none",
                        errors.first_name
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-brand-500"
                      )}
                    />
                  </div>
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.first_name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={clsx(
                      "w-full px-4 py-3 rounded-xl border-2 bg-gray-50 focus:bg-white transition-all outline-none",
                      errors.last_name
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-brand-500"
                    )}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={clsx(
                      "w-full pl-10 pr-12 py-3 rounded-xl border-2 bg-gray-50 focus:bg-white transition-all outline-none",
                      errors.password
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-brand-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="password_confirm"
                    value={form.password_confirm}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={clsx(
                      "w-full pl-10 pr-12 py-3 rounded-xl border-2 bg-gray-50 focus:bg-white transition-all outline-none",
                      errors.password_confirm
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-brand-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password_confirm && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password_confirm}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone Number{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    placeholder="+255 684 106 419"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-500 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Country & Language */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className={clsx(
                        "w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-gray-50 focus:bg-white transition-all outline-none appearance-none cursor-pointer",
                        errors.country
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-brand-500"
                      )}
                    >
                      <option value="">Select...</option>
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Preferred Language
                  </label>
                  <select
                    name="preferred_language"
                    value={form.preferred_language}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-500 transition-all outline-none appearance-none cursor-pointer"
                  >
                    {languages.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registerMutation.isPending ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              By registering, you agree to our{" "}
              <Link
                to="/terms"
                className="text-brand-600 hover:text-brand-700 font-medium"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-brand-600 hover:text-brand-700 font-medium"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
