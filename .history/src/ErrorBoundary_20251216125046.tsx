import { Component, type ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}
interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center">
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-4 text-gray-600">{this.state.message}</p>
          <button onClick={this.handleRetry} className="btn btn-primary">
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
