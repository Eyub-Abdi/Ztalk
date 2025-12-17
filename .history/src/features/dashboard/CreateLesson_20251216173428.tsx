import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  FiArrowLeft,
  FiBookOpen,
  FiClock,
  FiDollarSign,
  FiPackage,
  FiImage,
  FiUpload,
  FiX,
  FiCheck,
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
    label: "30 minutes",
    price: "$8",
    detail: "Great for trial lessons",
  },
  {
    value: "60",
    label: "60 minutes",
    price: "$20",
    detail: "Ideal for regular students",
  },
];

const formatOptions = [
  { value: "single", label: "Single lesson", helper: "One-off booking" },
  {
    value: "package",
    label: "Package lesson",
    helper: "Bundle into multi-session offers",
  },
];

export default function CreateLesson() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<"30" | "60">("60");
  const [format, setFormat] = useState<"single" | "package">("single");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setThumbnail(null);
    setThumbnailFile(null);
  }, []);

  const handleThumbnailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.show({
            title: "File too large",
            description: "Please choose an image under 5MB",
            status: "warning",
          });
          return;
        }
        setThumbnailFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnail(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [toast]
  );

  const removeThumbnail = useCallback(() => {
    setThumbnail(null);
    setThumbnailFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
    <div className="max-w-7xl mx-auto px-6 py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create Lesson
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Design a lesson that students will love
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={createLesson.isPending}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {createLesson.isPending ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiCheck className="w-4 h-4" />
              )}
              Publish Lesson
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main form - spans 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thumbnail Upload */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-lg">
                  <FiImage className="w-4 h-4 text-brand-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Lesson Thumbnail
                </span>
              </div>

              {thumbnail ? (
                <div className="relative group">
                  <img
                    src={thumbnail}
                    alt="Lesson thumbnail"
                    className="w-full h-48 object-cover rounded-xl border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all group"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 flex items-center justify-center group-hover:from-brand-500/20 group-hover:to-brand-600/10 transition-colors">
                    <FiUpload className="w-6 h-6 text-brand-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Upload thumbnail
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 5MB • Recommended 16:9 ratio
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </div>

            {/* Lesson Details */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-1.5 bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-lg">
                  <FiBookOpen className="w-4 h-4 text-brand-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Lesson Details
                </span>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="lesson-title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lesson-title"
                    type="text"
                    placeholder="e.g. Conversational English for Professionals"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lesson-description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="lesson-description"
                    placeholder="Share the focus, materials, or structure students can expect..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Duration & Format */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Duration */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-1.5 bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-lg">
                    <FiClock className="w-4 h-4 text-brand-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    Duration & Price
                  </span>
                </div>

                <div className="space-y-3">
                  {durationOptions.map((option) => {
                    const isActive = duration === option.value;
                    return (
                      <div
                        key={option.value}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isActive}
                        onClick={() => setDuration(option.value as "30" | "60")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setDuration(option.value as "30" | "60");
                          }
                        }}
                        className={clsx(
                          "p-4 rounded-xl border-2 cursor-pointer transition-all",
                          isActive
                            ? "border-brand-500 bg-brand-50/50"
                            : "border-gray-100 hover:border-brand-200 hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={clsx(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                isActive
                                  ? "border-brand-500 bg-brand-500"
                                  : "border-gray-300"
                              )}
                            >
                              {isActive && (
                                <FiCheck className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-gray-900">
                                {option.label}
                              </span>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {option.detail}
                              </p>
                            </div>
                          </div>
                          <span
                            className={clsx(
                              "text-sm font-bold",
                              isActive ? "text-brand-600" : "text-gray-600"
                            )}
                          >
                            {option.price}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Format */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-1.5 bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-lg">
                    <FiPackage className="w-4 h-4 text-brand-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    Lesson Format
                  </span>
                </div>

                <div className="space-y-3">
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
                          "p-4 rounded-xl border-2 cursor-pointer transition-all",
                          isActive
                            ? "border-brand-500 bg-brand-50/50"
                            : "border-gray-100 hover:border-brand-200 hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={clsx(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                              isActive
                                ? "border-brand-500 bg-brand-500"
                                : "border-gray-300"
                            )}
                          >
                            {isActive && (
                              <FiCheck className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-900">
                              {option.label}
                            </span>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {option.helper}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Preview sidebar */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Preview header */}
              <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-lg">
                    <FiBookOpen className="w-3.5 h-3.5 text-brand-600" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Live Preview
                  </span>
                </div>
              </div>

              {/* Thumbnail preview */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <FiImage className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">No thumbnail</p>
                  </div>
                )}
              </div>

              {/* Content preview */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 line-clamp-2">
                    {title.trim() || "Untitled lesson"}
                  </h3>
                  {description.trim() && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {description.trim()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <FiClock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {durationMinutes} min
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiDollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-900">
                      {priceLabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "inline-flex px-3 py-1.5 text-xs font-semibold rounded-lg capitalize",
                      format === "package"
                        ? "bg-brand-100 text-brand-700"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {format} lesson
                  </span>
                </div>
              </div>
            </div>

            {/* Tips card */}
            <div className="mt-4 bg-gradient-to-br from-brand-50 to-white rounded-2xl p-5 border border-brand-100">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                💡 Quick Tips
              </h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-brand-500 mt-0.5">•</span>
                  <span>Use a clear, descriptive title</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-500 mt-0.5">•</span>
                  <span>Add an eye-catching thumbnail</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-500 mt-0.5">•</span>
                  <span>Describe what students will learn</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
