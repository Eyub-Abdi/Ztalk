import { useQuery } from '@tanstack/react-query';
import { http } from '../../lib/http';

export interface Language {
  id: number;
  code: string;
  name: string;
  native_name: string;
  is_active: boolean;
  is_available_for_teaching: boolean;
  active_teacher_count: number;
  flag_image: string;
}

export interface LanguageAvailabilityResponse {
  success: boolean;
  message: string;
  data: {
    languages: Language[];
    total: number;
    available_count: number;
    unavailable_count: number;
    proficiency_requirements: {
      allowed_levels: string[];
      level_descriptions: Record<string, string>;
      note: string;
    };
    note: string;
  };
  errors: null | any;
}

export function useLanguageAvailability() {
  return useQuery<LanguageAvailabilityResponse>({
    queryKey: ['languageAvailability'],
    queryFn: () => http<LanguageAvailabilityResponse>('/teachers/languages/availability/'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}