import { useEffect, useState, useRef } from "react";
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
  FiShield,
  FiZap,
  FiHeart,
  FiMessageCircle,
  FiChevronDown,
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
    <div className="fixed top-4 right-4 z-[10000] flex flex-col gap-3">
      {toastList.map((t) => (
        <div
          key={t.id}
          className={clsx(
            "px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-slide-in-right min-w-[300px] border",
            t.type === "success" &&
              "bg-gradient-to-r from-emerald-500/90 to-green-600/90 text-white border-emerald-400/30",
            t.type === "error" &&
              "bg-gradient-to-r from-rose-500/90 to-red-600/90 text-white border-rose-400/30",
            t.type === "info" &&
              "bg-gradient-to-r from-brand-500/90 to-indigo-600/90 text-white border-brand-400/30"
          )}
        >
          <div className={clsx(
            "w-8 h-8 rounded-full flex items-center justify-center",
            t.type === "success" && "bg-white/20",
            t.type === "error" && "bg-white/20",
            t.type === "info" && "bg-white/20"
          )}>
            {t.type === "success" && <FiCheck className="w-4 h-4" />}
            {t.type === "error" && <span className="text-sm">✕</span>}
            {t.type === "info" && <span className="text-sm">ℹ</span>}
          </div>
          <span className="text-sm font-medium">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// Country options
const countries = [
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "OTHER", name: "Other", flag: "🌍" },
];

// Language options
const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "sw", name: "Swahili", flag: "🇹🇿" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
];

// Password strength calculation
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score: 2, label: "Fair", color: "bg-orange-500" };
  if (score <= 3) return { score: 3, label: "Good", color: "bg-yellow-500" };
  if (score <= 4) return { score: 4, label: "Strong", color: "bg-emerald-500" };
  return { score: 5, label: "Excellent", color: "bg-green-500" };
}

// Floating Input Component
interface FloatingInputProps {
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  placeholder?: string;
}

function FloatingInput({
  id,
  name,
  type = "text",
  value,
  onChange,
  label,
  required,
  error,
  icon,
  suffix,
  placeholder,
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || value.length > 0;

  return (
    <div className="relative group">
      <div className="relative">
        {icon && (
          <div className={clsx(
            "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200",
            isFocused ? "text-brand-500" : "text-gray-400",
            error && "text-red-400"
          )}>
            {icon}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFloating ? placeholder : ""}
          className={clsx(
            "peer w-full px-4 py-4 rounded-2xl border-2 bg-white/80 backdrop-blur-sm transition-all duration-300 outline-none text-gray-900",
            icon ? "pl-12" : "pl-4",
            suffix ? "pr-12" : "pr-4",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-gray-200 hover:border-gray-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10",
            "placeholder:text-gray-400"
          )}
        />
        <label
          htmlFor={id}
          className={clsx(
            "absolute left-4 transition-all duration-200 pointer-events-none",
            icon ? "left-12" : "left-4",
            isFloating
              ? "-top-2.5 text-xs font-medium bg-white px-2 rounded"
              : "top-1/2 -translate-y-1/2 text-base",
            isFocused
              ? "text-brand-600"
              : isFloating
                ? "text-gray-600"
                : "text-gray-500",
            error && "text-red-500"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {suffix && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
}

// Custom Select Component
interface CustomSelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  required?: boolean;
  error?: string;
  options: { code: string; name: string; flag?: string }[];
  placeholder?: string;
  icon?: React.ReactNode;
}

function CustomSelect({
  id,
  name,
  value,
  onChange,
  label,
  required,
  error,
  options,
  placeholder = "Select...",
  icon,
}: CustomSelectProps) {
  const selectedOption = options.find((o) => o.code === value);

  return (
    <div className="relative group">
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            {icon}
          </div>
        )}
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={clsx(
            "peer w-full px-4 py-4 rounded-2xl border-2 bg-white/80 backdrop-blur-sm transition-all duration-300 outline-none appearance-none cursor-pointer text-gray-900",
            icon ? "pl-12" : "pl-4",
            "pr-12",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-gray-200 hover:border-gray-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.code} value={opt.code}>
              {opt.flag ? `${opt.flag} ${opt.name}` : opt.name}
            </option>
          ))}
        </select>
        <label
          htmlFor={id}
          className={clsx(
            "absolute transition-all duration-200 pointer-events-none",
            icon ? "left-12" : "left-4",
            value
              ? "-top-2.5 text-xs font-medium bg-white px-2 rounded text-gray-600"
              : "top-1/2 -translate-y-1/2 text-base text-gray-500",
            error && "text-red-500"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          {selectedOption?.flag && (
            <span className="mr-2 text-lg">{selectedOption.flag}</span>
          )}
          <FiChevronDown className="w-5 h-5 inline-block" />
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
}

// Feature Item Component
function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className="text-white/70 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function CompleteRegistration() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const toast = useToast();
  const registerMutation = useCompleteRegistration();
  const formRef = useRef<HTMLFormElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

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

  const passwordStrength = getPasswordStrength(form.password);

  // Calculate form completion
  const getCompletionPercentage = () => {
    const fields = [
      form.username,
      form.first_name,
      form.last_name,
      form.password,
      form.password_confirm,
      form.country,
    ];
    const filled = fields.filter((f) => f.length > 0).length;
    return Math.round((filled / fields.length) * 100);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username = "Only letters, numbers, and underscores allowed";
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
      toast.show("Welcome to Ztalk! 🎉", "success");
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Auto-advance step logic
    if (currentStep === 1 && form.username && form.first_name && form.last_name) {
      setCurrentStep(2);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-brand-900 to-indigo-900 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 text-center border border-white/20 shadow-2xl">
            <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-red-500/20 backdrop-blur-sm mb-6">
              <FiUser className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              Invalid Registration Link
            </h1>
            <p className="text-gray-300 mb-8 leading-relaxed">
              This registration link is invalid or has expired. Please request a new verification email.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-xl"
            >
              Go to Home
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/5 to-transparent rounded-full" />
        </div>

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">
          {/* Logo */}
          <div>
            <Link to="/" className="inline-block">
              <h1 className="text-4xl font-bold text-white tracking-tight">Ztalk</h1>
            </Link>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
                Join thousands of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                  language learners
                </span>
              </h2>
              <p className="text-xl text-white/80 leading-relaxed">
                Connect with expert tutors and start your language journey today.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              <FeatureItem
                icon={<FiMessageCircle className="w-6 h-6 text-white" />}
                title="1-on-1 Live Sessions"
                description="Learn with native speakers through personalized video lessons"
              />
              <FeatureItem
                icon={<FiZap className="w-6 h-6 text-white" />}
                title="Flexible Scheduling"
                description="Book lessons at times that work for your schedule"
              />
              <FeatureItem
                icon={<FiHeart className="w-6 h-6 text-white" />}
                title="Verified Tutors"
                description="All tutors are vetted for quality and experience"
              />
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-8 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <FiShield className="w-5 h-5" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="w-5 h-5" />
              <span>10k+ Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <Link to="/" className="text-2xl font-bold text-brand-600">
            Ztalk
          </Link>
          <div className="text-sm text-gray-500">
            Step {currentStep} of 2
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-lg">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                <span className="text-sm font-bold text-brand-600">{getCompletionPercentage()}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                <FiCheck className="w-4 h-4" />
                Email verified successfully
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Complete your profile
              </h1>
              <p className="text-gray-600 text-lg">
                Just a few more details to get you started
              </p>
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <FloatingInput
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                label="Username"
                required
                error={errors.username}
                placeholder="johndoe"
                icon={<span className="text-lg font-medium">@</span>}
              />

              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <FloatingInput
                  id="first_name"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  label="First Name"
                  required
                  error={errors.first_name}
                  placeholder="John"
                  icon={<FiUser className="w-5 h-5" />}
                />
                <FloatingInput
                  id="last_name"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  label="Last Name"
                  required
                  error={errors.last_name}
                  placeholder="Doe"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <FloatingInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  label="Password"
                  required
                  error={errors.password}
                  placeholder="••••••••"
                  icon={<FiLock className="w-5 h-5" />}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {showPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  }
                />
                {form.password && (
                  <div className="flex items-center gap-3 px-1">
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={clsx(
                            "h-1.5 flex-1 rounded-full transition-all duration-300",
                            i <= passwordStrength.score
                              ? passwordStrength.color
                              : "bg-gray-200"
                          )}
                        />
                      ))}
                    </div>
                    <span className={clsx(
                      "text-xs font-medium",
                      passwordStrength.score <= 2 ? "text-red-500" :
                      passwordStrength.score <= 3 ? "text-yellow-600" : "text-emerald-600"
                    )}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <FloatingInput
                id="password_confirm"
                name="password_confirm"
                type={showConfirmPassword ? "text" : "password"}
                value={form.password_confirm}
                onChange={handleChange}
                label="Confirm Password"
                required
                error={errors.password_confirm}
                placeholder="••••••••"
                icon={<FiLock className="w-5 h-5" />}
                suffix={
                  form.password_confirm && form.password === form.password_confirm ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <FiCheck className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  )
                }
              />

              {/* Phone Number */}
              <FloatingInput
                id="phone_number"
                name="phone_number"
                type="tel"
                value={form.phone_number}
                onChange={handleChange}
                label="Phone Number (Optional)"
                placeholder="+255 684 106 419"
                icon={<FiPhone className="w-5 h-5" />}
              />

              {/* Country & Language */}
              <div className="grid grid-cols-2 gap-4">
                <CustomSelect
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  label="Country"
                  required
                  error={errors.country}
                  options={countries}
                  placeholder="Select..."
                  icon={<FiGlobe className="w-5 h-5" />}
                />
                <CustomSelect
                  id="preferred_language"
                  name="preferred_language"
                  value={form.preferred_language}
                  onChange={handleChange}
                  label="Language"
                  options={languages}
                  placeholder="Select..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className={clsx(
                  "w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3",
                  "bg-gradient-to-r from-brand-600 to-indigo-600 text-white",
                  "hover:from-brand-700 hover:to-indigo-700 hover:shadow-2xl hover:shadow-brand-500/30",
                  "active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none",
                  "shadow-xl shadow-brand-500/20"
                )}
              >
                {registerMutation.isPending ? (
                  <>
                    <FiLoader className="w-6 h-6 animate-spin" />
                    Creating your account...
                  </>
                ) : (
                  <>
                    Create Account
                    <FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Terms */}
              <p className="text-center text-sm text-gray-500 leading-relaxed">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-brand-600 hover:text-brand-700 font-medium underline-offset-4 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-brand-600 hover:text-brand-700 font-medium underline-offset-4 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
