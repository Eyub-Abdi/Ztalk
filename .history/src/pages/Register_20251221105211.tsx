import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import clsx from "clsx";
import { FcGoogle } from "react-icons/fc";
import { useRegister, API_BASE } from "@features/auth/useAuthApi";
import type { RegisterPayload } from "@features/auth/authTypes";
import { ButtonSpinner } from "../components/Spinner";

// Simple toast replacement
function useToast() {
  return {
    show: (options: {
      title: string;
      description?: string;
      status?: string;
    }) => {
      console.log(
        `[${options.status}] ${options.title}: ${options.description || ""}`
      );
    },
  };
}

export default function RegisterPage() {
  const registerMutation = useRegister();
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<RegisterPayload>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirm: "",
    user_type: "student",
    preferred_language: "en",
    phone_number: "",
    terms_accepted: false,
  });

  const passwordStrength = (() => {
    const p = form.password;
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
  const strengthColors = [
    "bg-red-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  const loading = registerMutation.isPending;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password_confirm) {
      toast.show({ title: "Passwords do not match", status: "error" });
      return;
    }
    if (!form.terms_accepted) {
      toast.show({ title: "You must accept terms", status: "error" });
      return;
    }
    registerMutation.mutate(form, {
      onSuccess: () => {
        toast.show({
          title: "Registration successful",
          description: "Check your email for verification.",
          status: "success",
        });
        navigate("/login");
      },
      onError: (err) => {
        toast.show({
          title: "Registration failed",
          description: err.message,
          status: "error",
        });
      },
    });
  };

  const googleAuth = () => {
    window.location.href = `${API_BASE}/accounts/google/login/`;
  };

  const handleChange = <K extends keyof RegisterPayload>(
    field: K,
    value: RegisterPayload[K]
  ) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  return (
    <div className="max-w-[720px] mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
        Create your account
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8 text-sm">
        Join Ztalk and start mastering languages today.
      </p>

      <div className="space-y-8">
        <form onSubmit={submit} noValidate className="space-y-6">
          {registerMutation.isError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <span className="text-red-500 mt-0.5">⚠️</span>
              <span className="text-sm text-red-800 dark:text-red-200">
                {registerMutation.error?.message}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="first-name"
                type="text"
                value={form.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                autoComplete="given-name"
                className="input w-full"
              />
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="last-name"
                type="text"
                value={form.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                autoComplete="family-name"
                className="input w-full"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              autoComplete="email"
              className="input w-full"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone_number}
              onChange={(e) => handleChange("phone_number", e.target.value)}
              autoComplete="tel"
              className="input w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  autoComplete="new-password"
                  className="input w-full pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="password-confirm"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Confirm <span className="text-red-500">*</span>
              </label>
              <input
                id="password-confirm"
                type={showPassword ? "text" : "password"}
                value={form.password_confirm}
                onChange={(e) =>
                  handleChange("password_confirm", e.target.value)
                }
                autoComplete="new-password"
                className="input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="user-type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                User Type <span className="text-red-500">*</span>
              </label>
              <select
                id="user-type"
                value={form.user_type}
                onChange={(e) => handleChange("user_type", e.target.value)}
                className="input w-full"
              >
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="preferred-language"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Language
              </label>
              <select
                id="preferred-language"
                value={form.preferred_language}
                onChange={(e) =>
                  handleChange("preferred_language", e.target.value)
                }
                className="input w-full"
              >
                <option value="en">English</option>
                <option value="sw">Swahili</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.terms_accepted}
              onChange={(e) => handleChange("terms_accepted", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I agree to the Terms & Privacy Policy
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading && <ButtonSpinner />}
            Create Account
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
              or
            </span>
          </div>
        </div>

        <button
          onClick={googleAuth}
          disabled={loading}
          className="btn btn-outline w-full flex items-center justify-center gap-2"
        >
          <FcGoogle className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-500 font-semibold hover:text-brand-600"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
