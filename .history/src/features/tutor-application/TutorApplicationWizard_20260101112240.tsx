import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { FiArrowRight, FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useLanguageAvailability } from './api/useLanguageAvailability';

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

interface TutorApplicationState {
  teaching_languages: number[];
  video_introduction: File | null;
  has_webcam: boolean;
  video_requirements_agreed: boolean;
  about_me: string;
  me_as_teacher: string;
  lessons_teaching_style: string;
  teaching_materials: string;
  education_experience: string;
  teaching_experience: string;
  teacher_bio: string;
  industry_experience: string;
  profile_visibility: "public" | "private";
  teaching_interests: string[];
}

type StoredApplication = {
  formSnapshot: Omit<TutorApplicationState, "video_introduction">;
};

const APPLICATION_STORAGE_KEY = "tutor_application_progress_v1";

const TEACHING_INTEREST_OPTIONS = [
  "Music",
  "Sports & Fitness",
  "Food",
  "Films & TV Series",
  "Reading",
  "Writing",
  "Art",
  "History",
  "Science",
  "Business & Finance",
  "Medical & Healthcare",
  "Tech",
  "Pets & Animals",
  "Gaming",
  "Travel",
  "Legal Services",
  "Marketing",
  "Fashion & Beauty",
  "Environment & Nature",
  "Animation & Comics",
];

const getInitialApplicationState = (): TutorApplicationState => ({
  teaching_languages: [],
  video_introduction: null,
  has_webcam: false,
  video_requirements_agreed: false,
  about_me: "",
  me_as_teacher: "",
  lessons_teaching_style: "",
  teaching_materials: "",
  education_experience: "",
  teaching_experience: "",
  teacher_bio: "",
  industry_experience: "",
  profile_visibility: "public",
  teaching_interests: [],
});

export function TutorApplicationWizard() {
  const [form, setForm] = useState<TutorApplicationState>(() =>
    getInitialApplicationState()
  );
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasHydrated = useRef(false);
  const skipPersistence = useRef(false);
  const toast = useToast();
  const navigate = useNavigate();
  
  // Fetch language availability
  const { data: languageData, isLoading: isLoadingLanguages, error: languageError } = useLanguageAvailability();
  const availableLanguages = languageData?.data.languages.filter(lang => lang.is_available_for_teaching) || [];
  const proficiencyRequirements = languageData?.data.proficiency_requirements;

  const sanitizeForStorage = useCallback(
    (state: TutorApplicationState): StoredApplication["formSnapshot"] => {
      const sanitized = { ...state };
      delete (sanitized as Record<string, unknown>).video_introduction;
      return sanitized as StoredApplication["formSnapshot"];
    },
    []
  );

  const resetProgress = useCallback(() => {
    skipPersistence.current = true;
    localStorage.removeItem(APPLICATION_STORAGE_KEY);
    setForm(getInitialApplicationState());
    setVideoPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  useEffect(() => {
    if (hasHydrated.current) return;
    try {
      const stored = localStorage.getItem(APPLICATION_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as StoredApplication;
      if (parsed.formSnapshot) {
        setForm((prev) => ({ ...prev, ...parsed.formSnapshot }));
      }
    } catch (err) {
      console.warn("Failed to load tutor application progress", err);
    } finally {
      hasHydrated.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    if (skipPersistence.current) {
      skipPersistence.current = false;
      return;
    }
    const payload: StoredApplication = {
      formSnapshot: sanitizeForStorage(form),
    };
    try {
      localStorage.setItem(APPLICATION_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn("Failed to persist tutor application progress", err);
    }
  }, [form, sanitizeForStorage]);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [videoPreviewUrl]);

  const handleVideoChange = (file: File | null) => {
    setForm((prev) => ({ ...prev, video_introduction: file }));
    setVideoPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const handleSubmit = () => {
    if (form.teaching_languages.length === 0) {
      toast.show({
        title: "Select at least one teaching language",
        status: "error",
      });
      return;
    }
    if (!form.video_introduction) {
      toast.show({ title: "Video introduction is required", status: "error" });
      return;
    }
    if (!form.video_requirements_agreed) {
      toast.show({ title: "Confirm the video requirements", status: "error" });
      return;
    }
    if (!form.about_me || !form.me_as_teacher || !form.lessons_teaching_style) {
      toast.show({
        title: "Complete your tutor introduction",
        status: "error",
      });
      return;
    }
    if (!form.teacher_bio.trim() || form.teacher_bio.trim().length < 50) {
      toast.show({
        title: "Teacher bio required",
        description:
          "Please write at least 50 characters describing yourself as a teacher",
        status: "error",
      });
      return;
    }
    if (form.teaching_interests.length < 5) {
      toast.show({
        title: "Pick at least 5 teaching interests",
        status: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.show({
        title: "Application submitted",
        description:
          "Thanks! We will review your tutor profile and follow up via email.",
        status: "success",
      });
      resetProgress();
      navigate("/teacher-application-success");
    }, 2000);
  };

  const submitDisabled =
    isSubmitting ||
    form.teaching_languages.length === 0 ||
    !form.video_introduction ||
    !form.video_requirements_agreed ||
    !form.about_me ||
    !form.me_as_teacher ||
    !form.lessons_teaching_style ||
    !form.teacher_bio.trim() ||
    form.teacher_bio.trim().length < 50 ||
    form.teaching_interests.length < 5;

  const toggleLanguage = (langId: number) => {
    setForm((prev) => ({
      ...prev,
      teaching_languages: prev.teaching_languages.includes(langId)
        ? prev.teaching_languages.filter((l) => l !== langId)
        : [...prev.teaching_languages, langId],
    }));
  };

  const toggleInterest = (interest: string) => {
    setForm((prev) => {
      const includes = prev.teaching_interests.includes(interest);
      if (includes) {
        return {
          ...prev,
          teaching_interests: prev.teaching_interests.filter(
            (i) => i !== interest
          ),
        };
      }
      if (prev.teaching_interests.length >= 5) return prev;
      return {
        ...prev,
        teaching_interests: [...prev.teaching_interests, interest],
      };
    });
  };

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tutor Application
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Complete the sections below to submit your teaching application. You
          can leave and return any time—your progress is saved locally.
        </p>
      </div>

      <div className="flex justify-end">
        <button onClick={resetProgress} className="btn btn-ghost text-sm">
          Clear saved progress
        </button>
      </div>

      {/* Teaching Languages */}
      <div className="card bg-gray-50 dark:bg-gray-900 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Teaching Languages
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select the language(s) you are confident teaching. Only languages at a
          native or C2 level are currently accepted.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4 flex items-start gap-3">
          <span className="text-blue-500 mt-0.5">ℹ️</span>
          <span className="text-sm text-blue-800 dark:text-blue-200">
            Due to the volume of applications, English submissions are paused.
            Other languages remain open.
          </span>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.teaching_languages.includes("swahili")}
              onChange={() => toggleLanguage("swahili")}
              className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            />
            <span className="text-gray-900 dark:text-white">Swahili</span>
          </label>
          <label className="flex items-center gap-3 opacity-50 cursor-not-allowed">
            <input
              type="checkbox"
              disabled
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-gray-900 dark:text-white">English</span>
            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
              Not accepting applications
            </span>
          </label>
        </div>
      </div>

      {/* Video Introduction */}
      <div className="card bg-gray-50 dark:bg-gray-900 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Video Introduction
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Record a short video introducing yourself and your teaching style.
        </p>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-outline text-sm">
              Video instructions
            </button>
            <button className="btn btn-outline text-sm">Sample 1</button>
            <button className="btn btn-outline text-sm">Sample 2</button>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
            <span className="text-yellow-500 mt-0.5">⚠️</span>
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              Review the requirements below carefully. Applications without a
              valid introduction video are automatically rejected.
            </span>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p className="font-semibold">File requirements</p>
            <p>• Maximum size: 200 MB</p>
            <p>• Recommended aspect ratio: 16:9</p>
            <p>• Length: 1-4 minutes</p>
            <p className="text-red-500">• Video submission is mandatory</p>
          </div>

          <div>
            <label
              htmlFor="intro-video"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Upload video <span className="text-red-500">*</span>
            </label>
            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-white dark:bg-gray-800 hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all cursor-pointer">
              <input
                id="intro-video"
                type="file"
                accept="video/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleVideoChange(e.target.files?.[0] ?? null)}
              />
              <div className="space-y-2">
                <FiUpload className="w-8 h-8 mx-auto text-gray-400" />
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                  Click to upload your introduction video
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Accepted formats: MP4, AVI, MOV
                </p>
              </div>
            </div>
          </div>

          {videoPreviewUrl && (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Video preview
              </p>
              <div className="border-2 border-brand-200 dark:border-brand-700 rounded-lg p-4 bg-brand-50 dark:bg-brand-900/20">
                <video
                  src={videoPreviewUrl}
                  controls
                  preload="metadata"
                  className="w-full max-h-[300px] rounded-lg bg-black"
                >
                  <track kind="captions" />
                </video>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {form.video_introduction?.name}
                    </p>
                    {form.video_introduction && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Size:{" "}
                        {(form.video_introduction.size / 1024 / 1024).toFixed(
                          2
                        )}{" "}
                        MB
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleVideoChange(null)}
                    className="btn btn-outline text-red-600 border-red-300 hover:bg-red-50 text-sm"
                  >
                    Remove video
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm">
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              Your video should:
            </p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-brand-500"
              />
              <span className="text-gray-600 dark:text-gray-400">
                Show you speaking the teaching language
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-brand-500"
              />
              <span className="text-gray-600 dark:text-gray-400">
                Be recorded in landscape orientation
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-brand-500"
              />
              <span className="text-gray-600 dark:text-gray-400">
                Have clear audio and lighting
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-brand-500"
              />
              <span className="text-gray-600 dark:text-gray-400">
                Exclude personal contact details
              </span>
            </label>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.has_webcam}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, has_webcam: e.target.checked }))
              }
              className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            />
            <span className="text-gray-900 dark:text-white">
              I have a webcam and can host video lessons.
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.video_requirements_agreed}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  video_requirements_agreed: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-900 dark:text-white">
              I understand my video must follow these rules and may appear on
              Ztalk channels.
            </span>
          </label>
        </div>
      </div>

      {/* Tutor Introduction */}
      <div className="card bg-gray-50 dark:bg-gray-900 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tutor Introduction
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Share details that help students understand your background and lesson
          style.
        </p>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="about-me"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              About me <span className="text-red-500">*</span>
            </label>
            <textarea
              id="about-me"
              placeholder="Tell students about yourself..."
              value={form.about_me}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, about_me: e.target.value }))
              }
              maxLength={700}
              rows={4}
              className="input w-full resize-y"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
              {form.about_me.length}/700
            </p>
          </div>

          <div>
            <label
              htmlFor="me-as-teacher"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Me as a teacher <span className="text-red-500">*</span>
            </label>
            <textarea
              id="me-as-teacher"
              placeholder="Describe your teaching approach..."
              value={form.me_as_teacher}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, me_as_teacher: e.target.value }))
              }
              maxLength={700}
              rows={4}
              className="input w-full resize-y"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
              {form.me_as_teacher.length}/700
            </p>
          </div>

          <div>
            <label
              htmlFor="teacher-bio"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Teacher bio <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Write a compelling bio that helps students understand your
              teaching style and personality (minimum 50 characters)
            </p>
            <textarea
              id="teacher-bio"
              placeholder="Tell students what makes you unique as a teacher, your teaching philosophy, and how you help students achieve their goals..."
              value={form.teacher_bio}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  teacher_bio: e.target.value,
                }))
              }
              maxLength={500}
              rows={4}
              className={clsx(
                "input w-full resize-y",
                form.teacher_bio.trim().length > 0 &&
                  form.teacher_bio.trim().length < 50
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : form.teacher_bio.trim().length >= 50
                  ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                  : ""
              )}
            />
            <div className="flex justify-between items-center mt-1">
              <span
                className={clsx(
                  "text-xs",
                  form.teacher_bio.trim().length < 50
                    ? "text-red-500"
                    : "text-green-600"
                )}
              >
                {form.teacher_bio.trim().length < 50
                  ? `${
                      50 - form.teacher_bio.trim().length
                    } more characters needed`
                  : "✓ Bio looks good!"}
              </span>
              <span className="text-xs text-gray-400">
                {form.teacher_bio.length}/500
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="lessons-teaching-style"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              My lessons & teaching style{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="lessons-teaching-style"
              placeholder="Explain how you structure lessons..."
              value={form.lessons_teaching_style}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  lessons_teaching_style: e.target.value,
                }))
              }
              maxLength={700}
              rows={4}
              className="input w-full resize-y"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
              {form.lessons_teaching_style.length}/700
            </p>
          </div>

          <div>
            <label
              htmlFor="teaching-materials"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Teaching materials (optional)
            </label>
            <textarea
              id="teaching-materials"
              placeholder="List the materials you rely on..."
              value={form.teaching_materials}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  teaching_materials: e.target.value,
                }))
              }
              rows={3}
              className="input w-full resize-y"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                "PDF",
                "Slides",
                "Audio",
                "Video",
                "Flashcards",
                "Homework",
              ].map((item) => (
                <span
                  key={item}
                  className="px-2 py-1 text-xs font-medium rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Background */}
      <div className="card bg-gray-50 dark:bg-gray-900 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Background
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="education-experience"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Education experience
            </label>
            <textarea
              id="education-experience"
              placeholder="Summarize your education history..."
              value={form.education_experience}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  education_experience: e.target.value,
                }))
              }
              rows={3}
              className="input w-full resize-y"
            />
          </div>

          <div>
            <label
              htmlFor="teaching-experience"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Teaching experience
            </label>
            <textarea
              id="teaching-experience"
              placeholder="Share any teaching roles you've held..."
              value={form.teaching_experience}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  teaching_experience: e.target.value,
                }))
              }
              rows={3}
              className="input w-full resize-y"
            />
          </div>

          <div>
            <label
              htmlFor="industry-experience"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Industry experience
            </label>
            <textarea
              id="industry-experience"
              placeholder="Mention relevant industry background..."
              value={form.industry_experience}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  industry_experience: e.target.value,
                }))
              }
              rows={3}
              className="input w-full resize-y"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.profile_visibility === "public"}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  profile_visibility: e.target.checked ? "public" : "private",
                }))
              }
              className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            />
            <span className="text-gray-900 dark:text-white">
              Make my profile public once approved.
            </span>
          </label>
        </div>
      </div>

      {/* Teaching Interests */}
      <div className="card bg-gray-50 dark:bg-gray-900 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Teaching Interests
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Pick up to five topics you love discussing. This helps match you with
          new students.
        </p>
        <div className="flex flex-wrap gap-3">
          {TEACHING_INTEREST_OPTIONS.map((interest) => {
            const selected = form.teaching_interests.includes(interest);
            const disabled = form.teaching_interests.length >= 5 && !selected;
            return (
              <label
                key={interest}
                className={clsx(
                  "flex items-center gap-2 cursor-pointer",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  disabled={disabled}
                  onChange={() => toggleInterest(interest)}
                  className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {interest}
                </span>
              </label>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Selected: {form.teaching_interests.length}/5
        </p>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <div className="space-y-2 text-right">
          <button
            onClick={handleSubmit}
            disabled={submitDisabled}
            className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Submit application
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Demo mode – submissions are mocked while the API is offline.
          </p>
        </div>
      </div>
    </div>
  );
}
