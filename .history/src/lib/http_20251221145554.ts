import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

// API base URL (root host only; do NOT include trailing /api)
export const API_BASE_URL = "https://88c787f44fd1.ngrok-free.app";

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
