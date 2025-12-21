import { useState, useMemo } from "react";
import {
  useNavigate,
  useSearchParams,
  useParams,
  Link as RouterLink,
} from "react-router-dom";
import { FiEye, FiEyeOff, FiCheck, FiAlertTriangle } from "react-icons/fi";
import axios from "axios";
import { API_BASE, defaultHeaders } from "../features/auth/useAuthApi";

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  noSpaces: boolean;
}

export default function ResetPasswordConfirm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token: tokenParam } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  // Token can come from path param or query param
  const token = tokenParam || searchParams.get("token") || "";

  // Password validation rules
  const passwordValidation = useMemo((): PasswordValidation => {
    return {
      minLength: newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasLowercase: /[a-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
      noSpaces: !/\s/.test(newPassword),
    };
  }, [newPassword]);

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = newPassword === newPasswordConfirm;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError("Reset token is missing. Please use the link from your email.");
      return;
    }
    if (!newPassword || !newPasswordConfirm) {
      setError("Please enter and confirm your new password.");
      return;
    }
    if (!isPasswordValid) {
      setError("Password does not meet the required criteria.");
      setShowValidation(true);
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${API_BASE}/auth/password/reset/confirm/`,
        {
          token,
          new_password: newPassword,
          new_password_confirm: newPasswordConfirm,
        },
        { headers: defaultHeaders }
      );

      setMessage(
        "Your password has been reset successfully! You can now log in with your new password."
      );
      // Clear form after success
      setNewPassword("");
      setNewPasswordConfirm("");
      setShowValidation(false);
    } catch (err: any) {
      const fallback = "Failed to reset password. Please try again.";
      const msg =
        (err?.response?.data?.message as string) ||
        (err?.response?.data?.detail as string) ||
        (err?.message as string) ||
        fallback;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Reset Your Password
          </h1>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Create a new secure password for your account
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row lg:justify-end items-start gap-8 lg:gap-12">
          {/* Password Requirements Section - Left on desktop, top on mobile */}
          <div className="w-full lg:w-64 order-2 lg:order-1">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Security Requirements
                </h3>
                <p className="text-xs text-gray-500">
                  Your password must meet these criteria
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { key: "minLength", label: "8+ characters" },
                  { key: "hasUppercase", label: "Uppercase letter" },
                  { key: "hasLowercase", label: "Lowercase letter" },
                  { key: "hasNumber", label: "Number" },
                  { key: "hasSpecialChar", label: "Special character" },
                  { key: "noSpaces", label: "No spaces" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                        passwordValidation[key as keyof PasswordValidation]
                          ? "bg-emerald-500"
                          : "bg-gray-200"
                      }`}
                    >
                      <FiCheck
                        className={`w-2 h-2 transition-all duration-300 ${
                          passwordValidation[key as keyof PasswordValidation]
                            ? "text-white opacity-100"
                            : "text-transparent opacity-0"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs transition-all duration-300 ${
                        passwordValidation[key as keyof PasswordValidation]
                          ? "text-emerald-700 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Section - Right on desktop, bottom on mobile */}
          <div className="w-full max-w-md lg:max-w-lg order-1 lg:order-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              {/* Token Missing Warning */}
              {!token && (
                <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <FiAlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-amber-800 mb-1">
                        Token Missing
                      </h3>
                      <p className="text-sm text-amber-700">
                        Please use the reset link from your email to access this
                        page.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-red-800 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {message && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiCheck className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-sm text-green-800 font-medium">
                      {message}
                    </p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-4">
                {/* New Password */}
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      name="new-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (e.target.value.length > 0) setShowValidation(true);
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-base"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={showPasswordConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-base"
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswordConfirm(!showPasswordConfirm)
                      }
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {showPasswordConfirm ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {newPasswordConfirm && !passwordsMatch && (
                    <p className="mt-3 text-sm text-red-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      Passwords do not match
                    </p>
                  )}
                  {newPasswordConfirm && passwordsMatch && (
                    <p className="mt-3 text-sm text-emerald-600 flex items-center gap-2">
                      <FiCheck className="w-4 h-4" />
                      Passwords match
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Password Requirements Section - Small text on right */}
          <div className="w-64 mt-8">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Security Requirements
                </h3>
                <p className="text-xs text-gray-500">
                  Your password must meet these criteria
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { key: "minLength", label: "8+ characters" },
                  { key: "hasUppercase", label: "Uppercase letter" },
                  { key: "hasLowercase", label: "Lowercase letter" },
                  { key: "hasNumber", label: "Number" },
                  { key: "hasSpecialChar", label: "Special character" },
                  { key: "noSpaces", label: "No spaces" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                        passwordValidation[key as keyof PasswordValidation]
                          ? "bg-emerald-500"
                          : "bg-gray-200"
                      }`}
                    >
                      <FiCheck
                        className={`w-2 h-2 transition-all duration-300 ${
                          passwordValidation[key as keyof PasswordValidation]
                            ? "text-white opacity-100"
                            : "text-transparent opacity-0"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs transition-all duration-300 ${
                        passwordValidation[key as keyof PasswordValidation]
                          ? "text-emerald-700 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
