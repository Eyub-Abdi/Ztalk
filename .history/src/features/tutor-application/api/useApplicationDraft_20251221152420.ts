import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@lib/http";

// Feature flag to enable/disable draft API calls
const DRAFTS_ENABLED = import.meta.env.VITE_ENABLE_DRAFTS === "true";

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
      if (!DRAFTS_ENABLED) return null;
      const response = await http<{ draft: ApplicationDraftData | null }>(
        "/teacher-application/draft"
      );
      return response.draft;
    },
    enabled: enabled && DRAFTS_ENABLED,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}

// Save draft mutation
export function useSaveApplicationDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (draft: ApplicationDraftData) => {
      if (!DRAFTS_ENABLED) return { success: true } as { success: boolean };
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
      if (!DRAFTS_ENABLED) return { success: true } as { success: boolean };
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
