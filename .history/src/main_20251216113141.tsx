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
