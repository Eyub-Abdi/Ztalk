import clsx from "clsx";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "white" | "brand" | "gray";
  className?: string;
}

/**
 * iOS Activity Indicator style spinner with 12 bars - Main spinner used throughout the app
 */
export function Spinner({
  size = "md",
  color = "white",
  className,
}: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    white: "text-white",
    brand: "text-brand-500",
    gray: "text-gray-500",
  };

  return (
    <div
      className={clsx(
        "relative inline-block",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    >
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-0 w-[8%] h-[24%] bg-current rounded-full origin-[center_200%]"
          style={{
            transform: `rotate(${i * 30}deg)`,
            opacity: 1 - i * 0.0667,
            animation: `ios-spinner 1s linear infinite`,
            animationDelay: `${-1 + i * (1 / 12)}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes ios-spinner {
          0% { opacity: 1; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

// Alias for backwards compatibility
export const IOSSpinner = Spinner;

/**
 * Full page loading overlay with spinner
 */
export function LoadingOverlay({
  message = "Loading...",
  show = true,
}: {
  message?: string;
  show?: boolean;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
        <Spinner size="xl" color="brand" />
        <p className="text-gray-700 dark:text-gray-200 font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}

/**
 * Inline iOS-style spinner for buttons
 */
export function ButtonSpinner({ className }: { className?: string }) {
  return <Spinner size="sm" color="white" className={className} />;
}

export default Spinner;
