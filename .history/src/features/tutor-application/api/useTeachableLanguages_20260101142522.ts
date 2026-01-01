import { useQuery } from "@tanstack/react-query";
import { http } from "../../../lib/http";

// Backend language availability shape from /teachers/languages/availability/
interface AvailabilityLanguage {
  id: number;
  code: string;
  name: string;
  native_name: string;
  is_active: boolean;
  is_available_for_teaching: boolean;
  active_teacher_count: number;
  flag_image: string;
}

interface AvailabilityData {
  languages: AvailabilityLanguage[];
  total: number;
  available_count: number;
  unavailable_count: number;
  proficiency_requirements: {
    allowed_levels: string[];
    level_descriptions: Record<string, string>;
    note: string;
  };
  note: string;
}

interface AvailabilityResponse {
  success: boolean;
  message: string;
  data: AvailabilityData;
  errors: unknown;
}

export interface TeachableLanguage {
  name: string;
  available: boolean;
  spotsRemaining: number;
  limit: number;
}

// Real API function backed by /teachers/languages/availability/
const fetchTeachableLanguages = async (): Promise<TeachableLanguage[]> => {
  const res = await http<AvailabilityResponse>(
    "/teachers/languages/availability/"
  );

  if (!res.success || !res.data) {
    throw new Error("Failed to load language availability");
  }

  return res.data.languages.map((lang) => {
    const available = lang.is_available_for_teaching && lang.is_active;

    return {
      name: lang.name,
      available,
      // Backend does not give per-language capacity, so we expose
      // a simple 0/1-style count and let the UI show a textual status.
      spotsRemaining: available ? 1 : 0,
      limit: 1,
    };
  });
};

// Hook to get all teachable languages with availability
export function useTeachableLanguages() {
  return useQuery({
    queryKey: ["teachable-languages"],
    queryFn: fetchTeachableLanguages,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
