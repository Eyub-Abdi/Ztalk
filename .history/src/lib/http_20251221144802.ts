import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

// API base URL
// Use env var if provided, otherwise default to the ngrok URL provided by backend
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://88c787f44fd1.ngrok-free.app/api";

export async function http<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await axios({
      url: `${API_BASE_URL}${path}`,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      data: options.body,
    });
    return response.data as T;
  } catch (error: any) {
    // Basic error shape normalization
    const message =
      error.response?.data?.message ||
      JSON.stringify(error.response?.data) ||
      error.message;
    throw new Error(message);
  }
}

export const queryClient = new QueryClient();
