import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useLogin } from "@features/auth/useAuthApi";
import { useAuth } from "@features/auth/AuthProvider";

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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const loginMutation = useLogin();
  const { setAuth } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const loading = loginMutation.isPending;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email: form.email, password: form.password },
      {
        onSuccess: (d) => {
          setAuth(d.user, d.access, d.refresh);
          toast.show({ title: "Logged in", status: "success" });
          navigate("/dashboard");
        },
        onError: (err) => {
          toast.show({
            title: "Login failed",
            description: err.message,
            status: "error",
          });
        },
      }
    );
  };

  const googleAuth = () => {
    const base =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
    window.location.href = `${base}/accounts/google/login/`;
  };

  return (
    <div className="max-w-[480px] mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
        Welcome back
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8 text-sm">
        Sign in to continue your learning journey.
      </p>

      <div className="space-y-6">
        <form onSubmit={submit} noValidate className="space-y-5">
          {loginMutation.isError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <span className="text-red-500 mt-0.5">⚠️</span>
              <span className="text-sm text-red-800 dark:text-red-200">
                {loginMutation.error?.message}
              </span>
            </div>
          )}

          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="login-email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              autoComplete="email"
              className="input w-full"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                autoComplete="current-password"
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

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Login
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
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-brand-500 font-semibold hover:text-brand-600"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
