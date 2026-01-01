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
  const availableLanguages = languageData?.data.languages.filter((lang: any) => lang.is_available_for_teaching) || [];
  const proficiencyRequirements = languageData?.data.proficiency_requirements;

  const sanitizeForStorage = useCallback(
    (state: TutorApplicationState): StoredApplication["formSnapshot"] => {
      const sanitized = { ...state };
      delete (sanitized as Record<string, unknown>).video_introduction;
      return sanitized as StoredApplication["formSnapshot"];
    },
    []
  );

  const saveToStorage = useCallback(
    (state: TutorApplicationState) => {
      if (skipPersistence.current) return;
      try {
        const storedData: StoredApplication = {
          formSnapshot: sanitizeForStorage(state),
        };
        localStorage.setItem(
          APPLICATION_STORAGE_KEY,
          JSON.stringify(storedData)
        );
      } catch (error) {
        console.error("Failed to save application state:", error);
      }
    },
    [sanitizeForStorage]
  );

  const loadFromStorage = useCallback((): Partial<TutorApplicationState> => {
    try {
      const stored = localStorage.getItem(APPLICATION_STORAGE_KEY);
      if (!stored) return {};

      const parsed: StoredApplication = JSON.parse(stored);
      return parsed.formSnapshot || {};
    } catch (error) {
      console.error("Failed to load stored application state:", error);
      return {};
    }
  }, []);

  const resetProgress = useCallback(() => {
    skipPersistence.current = true;
    localStorage.removeItem(APPLICATION_STORAGE_KEY);
    setForm(getInitialApplicationState());
    setVideoPreviewUrl(null);
    skipPersistence.current = false;
    toast.show({
      title: "Progress cleared",
      description: "Your application progress has been reset.",
      status: "info",
    });
  }, [toast]);

  // Load saved data on mount
  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;

    const savedState = loadFromStorage();
    if (Object.keys(savedState).length > 0) {
      setForm((prev) => ({ ...prev, ...savedState }));
    }
  }, [loadFromStorage]);

  // Save state changes
  useEffect(() => {
    if (!hasHydrated.current) return;
    const timeoutId = setTimeout(() => {
      saveToStorage(form);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [form, saveToStorage]);

  const handleSubmit = async () => {
    if (form.teaching_languages.length === 0) {
      toast.show({
        title: "Select at least one teaching language",
        status: "error",
      });
      return;
    }

    if (!form.video_introduction) {
      toast.show({
        title: "Video introduction is required",
        status: "error",
      });
      return;
    }

    if (!form.video_requirements_agreed) {
      toast.show({
        title: "Please confirm video requirements",
        status: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.show({
        title: "Application submitted!",
        description: "We'll review your application and get back to you.",
        status: "success",
      });

      skipPersistence.current = true;
      localStorage.removeItem(APPLICATION_STORAGE_KEY);
      navigate("/teacher-application-success");
    } catch (error) {
      toast.show({
        title: "Submission failed",
        description: "Please try again later.",
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitDisabled =
    form.teaching_languages.length === 0 ||
    !form.video_introduction ||
    !form.video_requirements_agreed ||
    isSubmitting ||
    form.about_me.trim().length < 20 ||
    form.me_as_teacher.trim().length < 20 ||
    form.lessons_teaching_style.trim().length < 20 ||
    form.teaching_materials.trim().length < 20 ||
    form.education_experience.trim().length < 20 ||
    form.teaching_experience.trim().length < 20 ||
    form.industry_experience.trim().length < 20 ||
    form.teaching_interests.length < 5;

  const toggleLanguage = (langId: number) => {
    setForm((prev) => ({
      ...prev,
      teaching_languages: prev.teaching_languages.includes(langId)
        ? prev.teaching_languages.filter((l) => l !== langId)
        : [...prev.teaching_languages, langId],
    }));
  };

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tutor Application
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Complete the sections below to submit your teaching application.
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
          Select the language(s) you are confident teaching. {proficiencyRequirements?.note || 'Only native or C2 level languages are accepted.'}
        </p>
        
        {/* Proficiency Requirements Info */}
        {proficiencyRequirements && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-500 mt-0.5">ℹ️</span>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-2">Proficiency Requirements:</p>
                {Object.entries(proficiencyRequirements.level_descriptions).map(([level, description]) => (
                  <p key={level} className="mb-1">
                    <strong>{level.toUpperCase()}:</strong> {String(description)}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Language Selection */}
        {isLoadingLanguages ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading languages...</p>
          </div>
        ) : languageError ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <span className="text-sm text-red-800 dark:text-red-200">
              Error loading languages. Please refresh the page and try again.
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            {availableLanguages.map((language: any) => (
              <label key={language.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.teaching_languages.includes(language.id)}
                  onChange={() => toggleLanguage(language.id)}
                  className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <div className="flex items-center gap-2">
                  <img 
                    src={language.flag_image} 
                    alt={`${language.name} flag`}
                    className="w-5 h-5 rounded-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="text-gray-900 dark:text-white">
                    {language.name} ({language.native_name})
                  </span>
                </div>
              </label>
            ))}
            
            {/* Show unavailable languages */}
            {languageData?.data.languages
              .filter((lang: any) => !lang.is_available_for_teaching)
              .map((language: any) => (
                <label key={language.id} className="flex items-center gap-3 opacity-50 cursor-not-allowed">
                  <input
                    type="checkbox"
                    disabled
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <div className="flex items-center gap-2">
                    <img 
                      src={language.flag_image} 
                      alt={`${language.name} flag`}
                      className="w-5 h-5 rounded-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span className="text-gray-900 dark:text-white">
                      {language.name} ({language.native_name})
                    </span>
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                      Not accepting applications
                    </span>
                  </div>
                </label>
              ))}
          </div>
        )}
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