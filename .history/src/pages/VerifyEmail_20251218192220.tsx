import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useVerifyEmailToken } from "../features/auth/useAuthApi";
import { useAuthModal } from "../features/auth/AuthModalProvider";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
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

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const verifyMutation = useVerifyEmailToken();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;

      try {
        await verifyMutation.mutateAsync({ token });
        setStatus("success");
        toast.show(
          "Email verified! Please complete your registration.",
          "success"
        );

        // Redirect to complete registration page after short delay
        setTimeout(() => {
          navigate(`/complete-registration/${token}`, { replace: true });
        }, 1500);
      } catch (error) {
        setStatus("error");
        const message =
          error instanceof Error ? error.message : "Email verification failed";
        setErrorMessage(message);
        toast.show(message, "error");
      }
    };

    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-brand-100 mb-6">
              <FiLoader className="w-8 h-8 text-brand-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying your email...
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-6">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email verified!
            </h1>
            <p className="text-gray-600 mb-6">
              Redirecting you to complete your registration...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100 mb-6">
              <FiXCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification failed
            </h1>
            <p className="text-gray-600 mb-6">
              {errorMessage ||
                "The verification link may have expired or is invalid."}
            </p>
            <button
              onClick={() => navigate("/")}
              className="btn btn-primary px-6 py-2"
            >
              Go to Home
            </button>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
