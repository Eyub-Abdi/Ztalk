import { useQuery } from "@tanstack/react-query";
import { http } from "../../../lib/http";

export interface LanguageAvailabilityLanguage {
  id: number;
  code: string;
  name: string;
  native_name: string;
  is_active: boolean;
  is_available_for_teaching: boolean;
  active_teacher_count: number;
  flag_image: string;
}

export interface LanguageAvailabilityProficiencyRequirements {
  allowed_levels: string[];
  level_descriptions: Record<string, string>;
  note: string;
}

export interface LanguageAvailabilityData {
  languages: LanguageAvailabilityLanguage[];
  total: number;
  available_count: number;
  unavailable_count: number;
  proficiency_requirements: LanguageAvailabilityProficiencyRequirements;
  note: string;
}

export interface LanguageAvailabilityResponse {
  success: boolean;
  message: string;
  data: LanguageAvailabilityData;
  errors: unknown;
}

export function useLanguageAvailability() {
  return useQuery<LanguageAvailabilityResponse>({
    queryKey: ["languageAvailability"],
    queryFn: () =>
      http<LanguageAvailabilityResponse>("/teachers/languages/availability/"),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
