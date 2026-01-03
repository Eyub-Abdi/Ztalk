import { useMutation } from "@tanstack/react-query";
import { AuthResponse, LoginPayload, RegisterPayload, User } from "./authTypes";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../../lib/http";

// Use the centralized API_BASE_URL from http.ts
export const API_BASE = API_BASE_URL;

// Default headers for all requests (skip ngrok browser warning)
export const defaultHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

// Email verification request schema
const requestEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Zod validation schemas
const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirm: z.string().min(1, "Please confirm your password"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    user_type: z.enum(["student", "tutor"], {
      message: "Please select a user type",
    }),
    country: z.string().optional(),
    preferred_language: z.string().optional(),
    phone_number: z.string().optional(),
    terms_accepted: z.boolean().refine((val: boolean) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine(
    (data: { password: string; password_confirm: string }) =>
      data.password === data.password_confirm,
    {
      message: "Passwords don't match",
      path: ["password_confirm"],
    }
  );

// Teaching profile interface
interface TeachingProfilePayload {
  teaching_languages: string[];
  video_introduction: File | null;
  about_me: string;
  me_as_teacher: string;
  lessons_teaching_style: string;
  teaching_materials: string;
  has_webcam: boolean;
  video_requirements_agreed: boolean;
  education_experience: string;
  teaching_certificates: string[];
  teaching_experience: string;
  industry_experience: string;
  specialty_certificates: string[];
  profile_visibility: "public" | "private";
  teaching_interests: string[];
}

export { loginSchema, registerSchema, requestEmailSchema };

// Response type for email verification request
interface RequestEmailResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string | string[]>;
}

// Response type for email verification with token
interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
    status: string;
    email: string;
    verified_at: string;
  };
  errors?: Record<string, string | string[]>;
}

async function postJson<TReq extends object, TRes>(
  url: string,
  payload: TReq
): Promise<TRes> {
  try {
    const { data } = await axios.post<TRes>(url, payload, {
      headers: defaultHeaders,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        message?: string;
        detail?: string;
      }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.detail ||
        axiosError.message ||
        "Request failed";
      throw new Error(message);
    }
    throw error;
  }
}

export function useRegister<
  T extends RegisterPayload | (RegisterPayload & Record<string, unknown>)
>() {
  return useMutation<{ user: User }, Error, T>({
    mutationFn: async (payload: T) => {
      // Validate payload with Zod
      const validatedPayload = registerSchema.parse(payload);

      const data = await postJson<RegisterPayload, AuthResponse>(
        `${API_BASE}/accounts/register/`,
        validatedPayload as RegisterPayload
      );
      if (!data.success || !data.data) {
        // Prioritize errors.error field for backend error messages
        const errorMessage =
          formatErrors(data.errors) || data.message || "Registration failed";
        throw new Error(errorMessage);
      }
      return { user: data.data.user };
    },
  });
}

// Hook for requesting email verification (Step 1 of signup)
export function useRequestEmailVerification() {
  return useMutation<
    { success: boolean; message: string },
    Error,
    { email: string }
  >({
    mutationFn: async (payload) => {
      // Validate email with Zod
      const validatedPayload = requestEmailSchema.parse(payload);

      try {
        const { data } = await axios.post<RequestEmailResponse>(
          `${API_BASE}/auth/request-email/`,
          validatedPayload
        );

        if (!data.success) {
          const errorMessage =
            formatErrors(data.errors) ||
            data.message ||
            "Failed to send verification email";
          throw new Error(errorMessage);
        }

        return {
          success: true,
          message: data.message || "Verification email sent successfully",
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<RequestEmailResponse>;
          const errorMessage =
            formatErrors(axiosError.response?.data?.errors) ||
            axiosError.response?.data?.message ||
            "Failed to send verification email";
          throw new Error(errorMessage);
        }
        throw error;
      }
    },
  });
}

// Hook for resending email verification
export function useResendEmailVerification() {
  return useMutation<
    { success: boolean; message: string },
    Error,
    { email: string }
  >({
    mutationFn: async (payload) => {
      const validatedPayload = requestEmailSchema.parse(payload);

      try {
        const { data } = await axios.post<RequestEmailResponse>(
          `${API_BASE}/auth/request-email/`,
          validatedPayload,
          { headers: defaultHeaders }
        );

        if (!data.success) {
          const errorMessage =
            formatErrors(data.errors) ||
            data.message ||
            "Failed to resend verification email";
          throw new Error(errorMessage);
        }

        return {
          success: true,
          message: data.message || "Verification email resent successfully",
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<RequestEmailResponse>;
          const errorMessage =
            formatErrors(axiosError.response?.data?.errors) ||
            axiosError.response?.data?.message ||
            "Failed to resend verification email";
          throw new Error(errorMessage);
        }
        throw error;
      }
    },
  });
}

// Hook for verifying email with token (called when user clicks link in email)
export function useVerifyEmailToken() {
  return useMutation<
    { success: boolean; email: string; message: string },
    Error,
    { token: string }
  >({
    mutationFn: async ({ token }) => {
      const url = `${API_BASE}/auth/verify-email/${token}/`;
      console.log("Making GET request to:", url);

      try {
        const { data } = await axios.get<VerifyEmailResponse>(url, {
          headers: defaultHeaders,
        });
        console.log("Verify email response:", data);

        if (!data.success || !data.data) {
          const errorMessage =
            formatErrors(data.errors) ||
            data.message ||
            "Email verification failed";
          throw new Error(errorMessage);
        }

        const result = {
          success: true,
          email: data.data.email,
          message: data.data.message || "Email verified successfully",
        };
        console.log("Returning result:", result);
        return result;
      } catch (error) {
        console.error("Verify email error:", error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<VerifyEmailResponse>;
          const errorMessage =
            formatErrors(axiosError.response?.data?.errors) ||
            axiosError.response?.data?.message ||
            "Email verification failed";
          throw new Error(errorMessage);
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Mutation onSuccess in hook:", data);
    },
    onError: (error) => {
      console.log("Mutation onError in hook:", error);
    },
  });
}

// Complete registration payload (after email verification)
export interface CompleteRegistrationPayload {
  verification_token: string;
  username: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  country: string;
  preferred_language: string;
}

// Complete registration response
interface CompleteRegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    access: string;
    refresh: string;
  };
  errors?: Record<string, string | string[]>;
}

// Hook for completing registration after email verification
export function useCompleteRegistration() {
  return useMutation<
    { user: User; access: string; refresh: string },
    Error,
    CompleteRegistrationPayload
  >({
    mutationFn: async (payload) => {
      try {
        const { data } = await axios.post<CompleteRegistrationResponse>(
          `${API_BASE}/auth/register/complete/`,
          payload,
          { headers: defaultHeaders }
        );

        if (!data.success || !data.data) {
          const errorMessage =
            formatErrors(data.errors) || data.message || "Registration failed";
          throw new Error(errorMessage);
        }

        const raw = data.data as any;
        const access: string | undefined =
          raw?.access ||
          raw?.access_token ||
          raw?.token ||
          raw?.jwt ||
          raw?.tokens?.access;
        const refresh: string | undefined =
          raw?.refresh || raw?.refresh_token || raw?.tokens?.refresh;
        const user: User =
          raw?.user || raw?.profile || raw?.data || raw?.account;

        if (!access || !refresh || !user) {
          console.warn("Complete registration: missing tokens or user", raw);
          throw new Error(
            "Registration failed: missing tokens in server response"
          );
        }

        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user", JSON.stringify(user));

        return { access, refresh, user };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<CompleteRegistrationResponse>;
          const errorMessage =
            formatErrors(axiosError.response?.data?.errors) ||
            axiosError.response?.data?.message ||
            "Registration failed";
          throw new Error(errorMessage);
        }
        throw error;
      }
    },
  });
}

export function useLogin() {
  return useMutation<
    { user: User; access: string; refresh: string },
    Error,
    LoginPayload
  >({
    mutationFn: async (payload: LoginPayload) => {
      // Validate payload with Zod
      const validatedPayload = loginSchema.parse(payload);

      try {
        const { data } = await axios.post<AuthResponse>(
          `${API_BASE}/auth/login/`,
          validatedPayload,
          { headers: defaultHeaders }
        );

        // Debug: log the entire response to see what we're getting
        console.log("Login response:", data);

        if (!data.success || !data.data) {
          // Prioritize errors.error field for backend error messages
          const errorMessage =
            formatErrors(data.errors) || data.message || "Login failed";
          console.log("Final error message:", errorMessage);
          throw new Error(errorMessage);
        }

        const raw = data.data as any;
        const access: string | undefined =
          raw?.access ||
          raw?.access_token ||
          raw?.token ||
          raw?.jwt ||
          raw?.tokens?.access;
        const refresh: string | undefined =
          raw?.refresh || raw?.refresh_token || raw?.tokens?.refresh;
        const user: User =
          raw?.user || raw?.profile || raw?.data || raw?.account;

        if (!access || !refresh || !user) {
          console.warn("Login: missing tokens or user in response", raw);
          throw new Error("Login failed: missing tokens in server response");
        }

        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user", JSON.stringify(user));
        return { access, refresh, user };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<AuthResponse>;
          const errorMessage =
            formatErrors(axiosError.response?.data?.errors) ||
            axiosError.response?.data?.message ||
            "Login failed";
          throw new Error(errorMessage);
        }
        throw error;
      }
    },
  });
}

// Hook for submitting teaching profile (step 3)
export function useSubmitTeachingProfile() {
  return useMutation<
    { success: boolean; message: string },
    Error,
    TeachingProfilePayload
  >({
    mutationFn: async (teachingData: TeachingProfilePayload) => {
      // For now, simulate API call - replace with actual endpoint
      // TODO: Create FormData for file uploads
      const formData = new FormData();

      // Add non-file fields
      (Object.keys(teachingData) as (keyof TeachingProfilePayload)[]).forEach(
        (key) => {
          if (
            key !== "video_introduction" &&
            teachingData[key] !== null &&
            teachingData[key] !== undefined
          ) {
            const value = teachingData[key];
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        }
      );

      // Add video file if present
      if (teachingData.video_introduction) {
        formData.append("video_introduction", teachingData.video_introduction);
      }

      // TODO: Replace with actual API endpoint
      // const res = await fetch(`${API_BASE}/auth/teaching-profile/`, {
      //   method: "POST",
      //   body: formData,
      // });

      // Simulate success for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Teaching profile submitted successfully",
          });
        }, 1000);
      });
    },
  });
}

function formatErrors(errs?: Record<string, string[] | string>) {
  if (!errs) return null;

  // Debug: log the errors object to see what we're getting
  console.log("formatErrors received:", errs);

  // Handle the specific case where error message is in "error" key
  if (errs.error) {
    const errorMsg = Array.isArray(errs.error)
      ? errs.error.join(", ")
      : String(errs.error);
    console.log("Found error in errors.error:", errorMsg);
    return errorMsg;
  }

  // Handle other error formats
  const formatted = Object.entries(errs)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
    .join("; ");
  console.log("Formatted other errors:", formatted);
  return formatted;
}
