import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useCompleteRegistration,
  CompleteRegistrationPayload,
} from "../features/auth/useAuthApi";
import { useAuth } from "../features/auth/AuthProvider";
import {
  FiEye,
  FiEyeOff,
  FiCheck,
  FiLoader,
  FiAlertCircle,
  FiUser,
  FiMail,
  FiGlobe,
  FiShield,
} from "react-icons/fi";
import clsx from "clsx";

// Country options with flags
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
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "OTHER", name: "Other", flag: "🌍" },
];

// Auto-detect country using timezone
function detectCountry(): string {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneToCountry: Record<string, string> = {
      'Africa/Dar_es_Salaam': 'TZ',
      'Africa/Nairobi': 'KE',
      'Africa/Kampala': 'UG',
      'Africa/Kigali': 'RW',
      'Africa/Addis_Ababa': 'ET',
      'Africa/Lagos': 'NG',
      'Africa/Accra': 'GH',
      'Africa/Johannesburg': 'ZA',
      'America/New_York': 'US',
      'America/Chicago': 'US',
      'America/Denver': 'US',
      'America/Los_Angeles': 'US',
      'Europe/London': 'GB',
      'America/Toronto': 'CA',
      'Australia/Sydney': 'AU',
      'Europe/Berlin': 'DE',
      'Europe/Paris': 'FR',
      'Asia/Kolkata': 'IN',
      'America/Sao_Paulo': 'BR',
      'America/Mexico_City': 'MX',
      'Asia/Tokyo': 'JP',
      'Asia/Shanghai': 'CN',
    };
    return timezoneToCountry[timezone] || '';
  } catch {
    return '';
  }
}

export default function CompleteRegistration() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const registerMutation = useCompleteRegistration();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

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

  useEffect(() => {
    if (token) {
      setForm((prev) => ({ ...prev, verification_token: token }));
    }
  }, [token]);

  // Auto-detect country on mount
  useEffect(() => {
    const detectedCountry = detectCountry();
    if (detectedCountry) {
      setForm((prev) => ({ ...prev, country: detectedCountry }));
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username = "Only letters, numbers, and underscores";
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
      newErrors.password = "At least 8 characters";
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
    setApiError("");

    if (!validateForm()) return;

    try {
      const result = await registerMutation.mutateAsync(form);
      setAuth(result.user, result.access, result.refresh);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Registration failed"
      );
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
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Invalid Link
          </h1>
          <p className="text-gray-600 mb-6">
            This registration link is invalid or has expired.
          </p>
          <Link to="/" className="text-brand-600 hover:underline font-medium">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold text-brand-600">Ztalk</span>
          </Link>
        </div>

        {/* Success Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-green-200 text-green-700 rounded-full text-sm font-medium shadow-sm">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <FiCheck className="w-3 h-3" />
            </div>
            Email verified successfully
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Complete your profile
          </h1>
          <p className="text-gray-600 text-lg">
            Just a few more details to get started
          </p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
            <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Information Card */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                <FiUser className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Account Information
                </h2>
                <p className="text-sm text-gray-500">Your login credentials</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className={clsx("input", errors.username && "input-error")}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" />
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      className={clsx(
                        "input pr-10",
                        errors.password && "input-error"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <FiEyeOff className="w-4 h-4" />
                      ) : (
                        <FiEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password_confirm"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password_confirm"
                      name="password_confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.password_confirm}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className={clsx(
                        "input pr-10",
                        errors.password_confirm && "input-error"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="w-4 h-4" />
                      ) : (
                        <FiEye className="w-4 h-4" />
                      )}
                    </button>
                    {form.password_confirm &&
                      form.password === form.password_confirm && (
                        <div className="absolute right-10 top-1/2 -translate-y-1/2">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                            <FiCheck className="w-3 h-3 text-green-600" />
                          </div>
                        </div>
                      )}
                  </div>
                  {errors.password_confirm && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" />
                      {errors.password_confirm}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <FiMail className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h2>
                <p className="text-sm text-gray-500">Tell us about yourself</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="John"
                    className={clsx(
                      "input",
                      errors.first_name && "input-error"
                    )}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" />
                      {errors.first_name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={clsx("input", errors.last_name && "input-error")}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" />
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Phone Number{" "}
                  <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={form.phone_number}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Location & Preferences Card */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <FiGlobe className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Location & Preferences
                </h2>
                <p className="text-sm text-gray-500">
                  Customize your experience
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Country <span className="text-red-500">*</span>
              </label>
              <select
                id="country"
                name="country"
                value={form.country}
                onChange={handleChange}
                className={clsx(
                  "input cursor-pointer",
                  errors.country && "input-error"
                )}
              >
                <option value="">Select your country...</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <FiAlertCircle className="w-3 h-3" />
                  {errors.country}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full sm:flex-1 btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {registerMutation.isPending ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  Creating your account...
                </>
              ) : (
                <>
                  <FiShield className="w-5 h-5" />
                  Create My Account
                </>
              )}
            </button>
          </div>

          {/* Terms */}
          <p className="text-center text-sm text-gray-500 leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link
              to="/terms"
              className="text-brand-600 hover:text-brand-700 font-medium hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-brand-600 hover:text-brand-700 font-medium hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
