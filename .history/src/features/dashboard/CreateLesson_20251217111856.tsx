import type { FormEvent } from "react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  FiX,
  FiCheck,
  FiGlobe,
  FiTag,
  FiToggleLeft,
  FiToggleRight,
  FiChevronDown,
  FiDollarSign,
  FiArrowLeft,
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

const languageOptions = [
  { value: "", label: "Choose language" },
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "italian", label: "Italian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "chinese", label: "Chinese (Mandarin)" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "arabic", label: "Arabic" },
  { value: "russian", label: "Russian" },
  { value: "hindi", label: "Hindi" },
  { value: "turkish", label: "Turkish" },
  { value: "dutch", label: "Dutch" },
  { value: "polish", label: "Polish" },
  { value: "somali", label: "Somali" },
];

const levelOptions = [
  { value: "", label: "Choose level" },
  { value: "beginner", label: "Beginner (A1-A2)" },
  { value: "intermediate", label: "Intermediate (B1-B2)" },
  { value: "advanced", label: "Advanced (C1-C2)" },
  { value: "all", label: "All Levels" },
];

const categoryOptions = [
  { value: "", label: "Choose category" },
  { value: "conversation", label: "Conversation Practice" },
  { value: "business", label: "Business Language" },
  { value: "exam-prep", label: "Exam Preparation" },
  { value: "grammar", label: "Grammar & Writing" },
  { value: "pronunciation", label: "Pronunciation" },
  { value: "kids", label: "Kids & Teens" },
  { value: "travel", label: "Travel & Culture" },
  { value: "academic", label: "Academic" },
];

const tagOptions = [
  { value: "", label: "Choose tag" },
  { value: "popular", label: "Popular" },
  { value: "new", label: "New" },
  { value: "intensive", label: "Intensive" },
  { value: "flexible", label: "Flexible Schedule" },
  { value: "native", label: "Native Speaker" },
  { value: "certified", label: "Certified" },
];

interface PackagePrices {
  lessons5: string;
  lessons10: string;
  lessons15: string;
  lessons20: string;
}

interface DurationPrices {
  min30: string;
  min45: string;
  min60: string;
  min90: string;
}

export default function CreateLesson() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [languageTaught, setLanguageTaught] = useState("");
  const [studentLevel, setStudentLevel] = useState("");
  const [category, setCategory] = useState("");
  const [lessonTag, setLessonTag] = useState("");
  const [singlePrice, setSinglePrice] = useState("");
  const [packagePrices, setPackagePrices] = useState<PackagePrices>({
    lessons5: "",
    lessons10: "",
    lessons15: "",
    lessons20: "",
  });
  const [durationPrices, setDurationPrices] = useState<DurationPrices>({
    min30: "",
    min45: "",
    min60: "",
    min90: "",
  });
  const [isAvailable, setIsAvailable] = useState(true);

  const toast = useToast();
  const navigate = useNavigate();
  const createLesson = useCreateLesson();

  // Calculate average prices for packages
  const getAveragePrice = (total: string, lessons: number) => {
    const num = parseFloat(total);
    if (isNaN(num) || num <= 0) return "—";
    return `$${(num / lessons).toFixed(2)}`;
  };

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setLanguageTaught("");
    setStudentLevel("");
    setCategory("");
    setLessonTag("");
    setSinglePrice("");
    setPackagePrices({
      lessons5: "",
      lessons10: "",
      lessons15: "",
      lessons20: "",
    });
    setDurationPrices({ min30: "", min45: "", min60: "", min90: "" });
    setIsAvailable(true);
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

      if (!languageTaught) {
        toast.show({
          title: "Select a language",
          description: "Please choose the language you will teach.",
          status: "warning",
        });
        return;
      }

      if (!singlePrice || parseFloat(singlePrice) < 5) {
        toast.show({
          title: "Set a price",
          description: "Minimum price is $5 USD per lesson.",
          status: "warning",
        });
        return;
      }

      try {
        await createLesson.mutateAsync({
          title: trimmedTitle,
          description: description.trim() || undefined,
          duration_minutes: 60,
          price_cents: parseFloat(singlePrice) * 100,
          format: "single",
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
      languageTaught,
      navigate,
      resetForm,
      singlePrice,
      title,
      toast,
    ]
  );

  // Dropdown component
  const SelectField = ({
    label,
    value,
    onChange,
    options,
    required,
  }: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
    required?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all appearance-none bg-white pr-10"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900">
          Create New Lesson
        </h1>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Title & Description */}
          <div className="p-6 space-y-5 border-b border-gray-100">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-400">
                  {title.length}/200
                </span>
              </div>
              <input
                type="text"
                maxLength={200}
                placeholder="e.g. Conversational English for Professionals"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <span className="text-xs text-gray-400">
                  {description.length}/2000
                </span>
              </div>
              <textarea
                maxLength={2000}
                placeholder="Describe what students will learn, your teaching approach, and what materials you'll use..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Language & Level */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-lg">
                <FiGlobe className="w-4 h-4 text-brand-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                Language Settings
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SelectField
                label="Language Taught"
                value={languageTaught}
                onChange={setLanguageTaught}
                options={languageOptions}
                required
              />
              <SelectField
                label="Student Language Level"
                value={studentLevel}
                onChange={setStudentLevel}
                options={levelOptions}
              />
            </div>
          </div>

          {/* Category & Tag */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-lg">
                <FiTag className="w-4 h-4 text-brand-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                Category & Tag
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SelectField
                label="Category"
                value={category}
                onChange={setCategory}
                options={categoryOptions}
              />
              <SelectField
                label="Lesson Tag"
                value={lessonTag}
                onChange={setLessonTag}
                options={tagOptions}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-lg">
                <FiDollarSign className="w-4 h-4 text-brand-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Price</span>
            </div>
            <p className="text-xs text-gray-500 mb-6">
              Min. $5 USD/lesson, Max. $120 USD/lesson | 60 minute lessons are
              mandatory.
            </p>

            {/* Single Lesson Price */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Single lesson price (USD){" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative max-w-xs">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  min="5"
                  max="120"
                  step="0.01"
                  placeholder="0"
                  value={singlePrice}
                  onChange={(e) => setSinglePrice(e.target.value)}
                  className="w-full pl-8 pr-16 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  / 60 min
                </span>
              </div>
            </div>

            {/* Package Prices Table */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Package Pricing
              </h4>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">
                        Package length
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">
                        Total price (USD)
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">
                        Average price (USD)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { key: "lessons5", label: "5 lessons", count: 5 },
                      { key: "lessons10", label: "10 lessons", count: 10 },
                      { key: "lessons15", label: "15 lessons", count: 15 },
                      { key: "lessons20", label: "20 lessons", count: 20 },
                    ].map((pkg) => (
                      <tr key={pkg.key}>
                        <td className="px-4 py-3 text-gray-700">{pkg.label}</td>
                        <td className="px-4 py-3">
                          <div className="relative max-w-[140px]">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                              $
                            </span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0"
                              value={
                                packagePrices[pkg.key as keyof PackagePrices]
                              }
                              onChange={(e) =>
                                setPackagePrices((prev) => ({
                                  ...prev,
                                  [pkg.key]: e.target.value,
                                }))
                              }
                              className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {getAveragePrice(
                            packagePrices[pkg.key as keyof PackagePrices],
                            pkg.count
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Duration Prices */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Price by Duration
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: "min30", label: "30 min" },
                  { key: "min45", label: "45 min" },
                  { key: "min60", label: "60 min", required: true },
                  { key: "min90", label: "90 min" },
                ].map((dur) => (
                  <div key={dur.key}>
                    <label className="block text-xs text-gray-500 mb-1.5">
                      {dur.label}{" "}
                      {dur.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0"
                        value={
                          dur.key === "min60"
                            ? singlePrice
                            : durationPrices[dur.key as keyof DurationPrices]
                        }
                        onChange={(e) => {
                          if (dur.key === "min60") {
                            setSinglePrice(e.target.value);
                          } else {
                            setDurationPrices((prev) => ({
                              ...prev,
                              [dur.key]: e.target.value,
                            }));
                          }
                        }}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Status</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Make this lesson visible to students
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAvailable(!isAvailable)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                {isAvailable ? (
                  <>
                    <FiToggleRight className="w-5 h-5" />
                    Available
                  </>
                ) : (
                  <>
                    <FiToggleLeft className="w-5 h-5" />
                    Unavailable
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={createLesson.isPending}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {createLesson.isPending ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiCheck className="w-4 h-4" />
            )}
            Create Lesson
          </button>
        </div>
      </form>
    </div>
  );
}
