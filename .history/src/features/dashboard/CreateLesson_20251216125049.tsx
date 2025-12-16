import type { FormEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  FiArrowLeft,
  FiBookOpen,
  FiClock,
  FiDollarSign,
  FiPackage,
} from "react-icons/fi";
import { useCreateLesson } from "../lessons/api/useLessons";

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

const durationOptions = [
  {
    value: "30",
    label: "30 minute lesson",
    detail: "$8 • great for trial lessons",
  },
  {
    value: "60",
    label: "60 minute lesson",
    detail: "$20 • ideal for regular students",
  },
];

const formatOptions = [
  { value: "single", label: "Single lesson", helper: "One-off booking." },
  {
    value: "package",
    label: "Package lesson",
    helper: "Bundle this lesson into multi-session offers later.",
  },
];

export default function CreateLesson() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<"30" | "60">("60");
  const [format, setFormat] = useState<"single" | "package">("single");

  const price = useMemo(() => (duration === "30" ? 8 : 20), [duration]);
  const durationMinutes = useMemo(
    () => (duration === "30" ? 30 : 60),
    [duration]
  );
  const priceLabel = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price),
    [price]
  );

  const toast = useToast();
  const navigate = useNavigate();
  const createLesson = useCreateLesson();

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setDuration("60");
    setFormat("single");
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        toast.show({
          title: "Add a lesson title",
          description: "Students rely on titles to understand what you teach.",
          status: "warning",
        });
        return;
      }

      try {
        await createLesson.mutateAsync({
          title: trimmedTitle,
          description: description.trim() || undefined,
          duration_minutes: durationMinutes as 30 | 60,
          price_cents: price * 100,
          format,
        });
        toast.show({
          title: "Lesson created",
          description: "Your lesson is ready for students to book.",
          status: "success",
        });
        resetForm();
        navigate("/dashboard/bookings");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to create lesson.";
        toast.show({
          title: "Something went wrong",
          description: message,
          status: "error",
        });
      }
    },
    [
      createLesson,
      description,
      durationMinutes,
      format,
      navigate,
      price,
      resetForm,
      title,
      toast,
    ]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-5 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-ghost text-sm flex items-center gap-1"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create lesson
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Be specific about outcomes so students pick the right fit.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-outline text-sm"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={createLesson.isPending}
              className="btn btn-primary text-sm flex items-center gap-2"
            >
              {createLesson.isPending && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              Publish lesson
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* Main form - spans 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-5">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="lesson-title"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Lesson title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lesson-title"
                    type="text"
                    placeholder="e.g. Conversational English for Professionals"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input w-full"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Choose a clear, descriptive title.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="lesson-description"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Description
                  </label>
                  <textarea
                    id="lesson-description"
                    placeholder="Share the focus, materials, or structure students can expect."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="input w-full resize-y"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Explain goals, teaching approach, and resources.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Duration & price */}
              <div className="card p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4 text-brand-500" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Duration & price
                    </span>
                  </div>
                  <div className="space-y-2">
                    {durationOptions.map((option) => {
                      const isActive = duration === option.value;
                      return (
                        <div
                          key={option.value}
                          role="button"
                          tabIndex={0}
                          aria-pressed={isActive}
                          onClick={() =>
                            setDuration(option.value as "30" | "60")
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setDuration(option.value as "30" | "60");
                            }
                          }}
                          className={clsx(
                            "p-3 rounded-md border cursor-pointer transition-all",
                            isActive
                              ? "border-brand-500 bg-brand-50 dark:bg-brand-900/30"
                              : "border-gray-200 dark:border-gray-700 hover:border-brand-400"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={clsx(
                                  "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                                  isActive
                                    ? "border-brand-500"
                                    : "border-gray-300 dark:border-gray-600"
                                )}
                              >
                                {isActive && (
                                  <div className="w-2 h-2 rounded-full bg-brand-500" />
                                )}
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {option.label}
                              </span>
                            </div>
                            {isActive && (
                              <span className="text-xs font-medium text-brand-500">
                                ✓
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                            {option.detail}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Format */}
              <div className="card p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FiPackage className="w-4 h-4 text-brand-500" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Format
                    </span>
                  </div>
                  <div className="space-y-2">
                    {formatOptions.map((option) => {
                      const isActive = format === option.value;
                      return (
                        <div
                          key={option.value}
                          role="button"
                          tabIndex={0}
                          aria-pressed={isActive}
                          onClick={() =>
                            setFormat(option.value as "single" | "package")
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setFormat(option.value as "single" | "package");
                            }
                          }}
                          className={clsx(
                            "p-3 rounded-md border cursor-pointer transition-all",
                            isActive
                              ? "border-brand-500 bg-brand-50 dark:bg-brand-900/30"
                              : "border-gray-200 dark:border-gray-700 hover:border-brand-400"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={clsx(
                                  "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                                  isActive
                                    ? "border-brand-500"
                                    : "border-gray-300 dark:border-gray-600"
                                )}
                              >
                                {isActive && (
                                  <div className="w-2 h-2 rounded-full bg-brand-500" />
                                )}
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {option.label}
                              </span>
                            </div>
                            {isActive && (
                              <span className="text-xs font-medium text-brand-500">
                                ✓
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                            {option.helper}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview sidebar */}
          <div className="lg:sticky lg:top-4">
            <div className="card bg-gray-50 dark:bg-gray-900 p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-brand-500">
                  <FiBookOpen className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">
                    Preview
                  </span>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2">
                    {title.trim() || "Untitled lesson"}
                  </h3>

                  {description.trim() && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">
                      {description.trim()}
                    </p>
                  )}

                  <hr className="border-gray-200 dark:border-gray-700" />

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-1 mb-0.5">
                        <FiClock className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400 uppercase text-[10px]">
                          Duration
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {durationMinutes} min
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-0.5">
                        <FiDollarSign className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400 uppercase text-[10px]">
                          Price
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {priceLabel}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      <FiPackage className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-500 dark:text-gray-400 uppercase text-[10px]">
                        Format
                      </span>
                    </div>
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-200 capitalize">
                      {format}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
