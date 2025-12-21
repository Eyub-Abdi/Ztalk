import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@lib/http";

export interface ApplicationDraftData {
  step: number;
  data: Record<string, unknown>;
}

const DRAFT_QUERY_KEY = ["application-draft"];

// Fetch the current draft
export function useApplicationDraft(enabled = true) {
  return useQuery({
    queryKey: DRAFT_QUERY_KEY,
    queryFn: async () => {
      const response = await http<{ draft: ApplicationDraftData | null }>(
        "/teacher-application/draft"
      );
      return response.draft;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}

// Save draft mutation
export function useSaveApplicationDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (draft: ApplicationDraftData) => {
      return http<{ success: boolean }>("/teacher-application/draft", {
        method: "POST",
        body: JSON.stringify(draft),
      });
    },
    onSuccess: (_, variables) => {
      // Update cache with the new draft
      queryClient.setQueryData(DRAFT_QUERY_KEY, variables);
    },
  });
}

// Delete draft mutation
export function useDeleteApplicationDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return http<{ success: boolean }>("/teacher-application/draft", {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      // Clear the draft from cache
      queryClient.setQueryData(DRAFT_QUERY_KEY, null);
      queryClient.invalidateQueries({ queryKey: DRAFT_QUERY_KEY });
    },
  });
}
