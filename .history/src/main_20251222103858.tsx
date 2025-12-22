import { AuthModalProvider } from "./features/auth/AuthModalProvider";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ErrorBoundary } from "./ErrorBoundary";
import { queryClient } from "@lib/http";
import { AuthProvider } from "./features/auth/AuthProvider";
import "./index.css";

// Clean up legacy Chakra UI persisted theme key if it exists
if (typeof window !== "undefined") {
  try {
    window.localStorage.removeItem("chakra-ui-color-mode");
    // Also clear any legacy cookie (used in some Chakra setups)
    document.cookie = "chakra-ui-color-mode=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  } catch {
    // no-op
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AuthModalProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </AuthModalProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
