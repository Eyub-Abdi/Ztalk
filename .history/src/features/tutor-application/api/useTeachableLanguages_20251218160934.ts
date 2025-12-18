import { useQuery } from "@tanstack/react-query";

// Mock data for language availability
// In production, this would come from the backend
const LANGUAGE_LIMITS: Record<string, { limit: number; current: number }> = {
  English: { limit: 30, current: 30 }, // Full - not available
  Swahili: { limit: 50, current: 12 },
  French: { limit: 25, current: 25 }, // Full - not available
  Spanish: { limit: 20, current: 8 },
  Arabic: { limit: 15, current: 3 },
  German: { limit: 15, current: 15 }, // Full - not available
  Portuguese: { limit: 10, current: 2 },
  Italian: { limit: 10, current: 5 },
  Chinese: { limit: 20, current: 18 },
  Japanese: { limit: 15, current: 7 },
  Korean: { limit: 10, current: 4 },
  Hindi: { limit: 10, current: 1 },
  Russian: { limit: 10, current: 6 },
};

export interface TeachableLanguage {
  name: string;
  available: boolean;
  spotsRemaining: number;
  limit: number;
}

// Mock API function
const fetchTeachableLanguages = async (): Promise<TeachableLanguage[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return Object.entries(LANGUAGE_LIMITS).map(([name, { limit, current }]) => ({
    name,
    available: current < limit,
    spotsRemaining: Math.max(0, limit - current),
    limit,
  }));
};

// Check availability for a specific language
const checkLanguageAvailability = async (
  language: string
): Promise<{ available: boolean; spotsRemaining: number; message?: string }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const langData = LANGUAGE_LIMITS[language];

  if (!langData) {
    return {
      available: true,
      spotsRemaining: 50, // Default for unlisted languages
    };
  }

  const spotsRemaining = Math.max(0, langData.limit - langData.current);
  const available = spotsRemaining > 0;

  return {
    available,
    spotsRemaining,
    message: available
      ? `${spotsRemaining} spots remaining for ${language} teachers`
      : `${language} teaching positions are currently full. Please choose another language or join the waitlist.`,
  };
};

// Hook to get all teachable languages with availability
export function useTeachableLanguages() {
  return useQuery({
    queryKey: ["teachable-languages"],
    queryFn: fetchTeachableLanguages,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to check availability for a specific language
export function useLanguageAvailability(language: string) {
  return useQuery({
    queryKey: ["language-availability", language],
    queryFn: () => checkLanguageAvailability(language),
    enabled: !!language,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
