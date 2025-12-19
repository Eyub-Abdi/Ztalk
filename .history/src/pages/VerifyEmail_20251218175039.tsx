import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useVerifyEmailToken } from "../features/auth/useAuthApi";
import { useAuthModal } from "../features/auth/AuthModalProvider";
import { useToast } from "../app/App";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { openSignup, setVerifiedEmail } = useAuthModal();
  const toast = useToast();
  const verifyMutation = useVerifyEmailToken();

  useEffect(() => {
    if (token && !verifyMutation.isPending && !verifyMutation.isSuccess && !verifyMutation.isError) {
      verifyMutation.mutate(
        { token },
        {
          onSuccess: (data) => {
            // Store verified email and redirect to home with signup modal
            setVerifiedEmail(data.email);
            toast.show("Email verified! Please complete your registration.", "success");
            navigate("/", { replace: true });
            // Small delay to ensure navigation completes before opening modal
            setTimeout(() => {
              openSignup();
            }, 100);
          },
          onError: (error) => {
            toast.show(error.message || "Email verification failed", "error");
          },
        }
      );
    }
  }, [token, verifyMutation, navigate, openSignup, setVerifiedEmail, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {verifyMutation.isPending && (
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

        {verifyMutation.isSuccess && (
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

        {verifyMutation.isError && (
          <>
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100 mb-6">
              <FiXCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification failed
            </h1>
            <p className="text-gray-600 mb-6">
              {verifyMutation.error?.message || "The verification link may have expired or is invalid."}
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
    </div>
  );
}
