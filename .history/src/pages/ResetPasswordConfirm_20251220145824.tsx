import { useState, useMemo } from "react";
import { useNavigate, useSearchParams, useParams, Link as RouterLink } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiCheck, FiAlertTriangle } from "react-icons/fi";
import axios from "axios";
import { API_BASE, defaultHeaders } from "../features/auth/useAuthApi";

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  noSpaces: boolean;

      );

      setMessage("Your password has been reset successfully! You can now log in with your new password.");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-brand-50/30 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mt-6 text-3xl font-bold bg-gradient-to-r from-gray-900 via-brand-600 to-indigo-600 bg-clip-text text-transparent">
            Reset Your Password
          </h1>
          <p className="mt-3 text-gray-600">
            Enter your new password below to secure your account.
          </p>
        </div>

        {/* Flex Container */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="flex-1 max-w-md mx-auto lg:mx-0">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-gray-200/50 border border-white/60 p-8">
              {/* Token Missing Warning */}
              {!token && (
                <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl">
                  <div className="flex items-start gap-3">
                    <FiAlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-amber-800 mb-1">Token Missing</h3>
                      <p className="text-sm text-amber-700">
                        Please use the reset link from your email to access this page.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm text-red-800 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {message && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiCheck className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-sm text-green-800 font-medium">{message}</p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-6">
                {/* New Password */}
                <div>
                  <label htmlFor="new-password" className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="input pr-12 transition-all duration-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand-600 transition-colors"
                    >
                      {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="input pr-12 transition-all duration-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand-600 transition-colors"
                    >
                      {showPasswordConfirm ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                    </button>
                  </div>
                  {newPasswordConfirm && !passwordsMatch && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="h-1 w-1 bg-red-500 rounded-full"></span>
                      Passwords do not match
                    </p>
                  )}
                  {newPasswordConfirm && passwordsMatch && (
                    <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                      <FiCheck className="h-3 w-3" />
                      Passwords match
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !token}
                  className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <FiLock className="h-4 w-4" />
                      Reset Password
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Password Requirements Section */}
          <div className="flex-1 max-w-md mx-auto lg:mx-0">
            {showValidation && newPassword ? (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-gray-200/50 border border-white/60 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 bg-brand-500 rounded-full flex items-center justify-center">
                    <FiLock className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Password Requirements</h3>
                </div>
                
                <div className="space-y-3">
                  {[
                    { key: 'minLength', label: 'At least 8 characters' },
                    { key: 'hasUppercase', label: 'One uppercase letter (A-Z)' },
                    { key: 'hasLowercase', label: 'One lowercase letter (a-z)' },
                    { key: 'hasNumber', label: 'One number (0-9)' },
                    { key: 'hasSpecialChar', label: 'One special character (!@#$%^&*)' },
                    { key: 'noSpaces', label: 'No spaces allowed' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50 border transition-colors">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                        passwordValidation[key as keyof PasswordValidation] 
                          ? 'bg-green-500 scale-105' 
                          : 'bg-gray-300'
                      }`}>
                        {passwordValidation[key as keyof PasswordValidation] && (
                          <FiCheck className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className={`text-sm font-medium transition-colors ${
                        passwordValidation[key as keyof PasswordValidation] 
                          ? 'text-green-700' 
                          : 'text-gray-600'
                      }`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress Indicator */}
                <div className="mt-6 p-4 bg-brand-50/50 rounded-lg border border-brand-200/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-brand-700">Security Strength</span>
                    <span className="text-sm text-brand-600">
                      {Object.values(passwordValidation).filter(Boolean).length}/6
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-brand-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(Object.values(passwordValidation).filter(Boolean).length / 6) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-gray-200/50 border border-white/60 p-8 opacity-50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <FiLock className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-500">Password Requirements</h3>
                </div>
                <p className="text-gray-500 text-center">
                  Start typing your password to see security requirements
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="input pr-12 transition-all duration-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand-600 transition-colors"
                >
                  {showPasswordConfirm ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
              {newPasswordConfirm && !passwordsMatch && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span className="h-1 w-1 bg-red-500 rounded-full"></span>
                  Passwords do not match
                </p>
              )}
              {newPasswordConfirm && passwordsMatch && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <FiCheck className="h-3 w-3" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !token}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting Password...
                </>
              ) : (
                <>
                  <FiLock className="h-4 w-4" />
                  Reset Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
