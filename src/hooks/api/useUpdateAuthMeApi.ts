import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../../api/core/http";
import type { AuthMeResponse, UpdateAuthMeRequest } from "../../types/auth";

export const useUpdateAuthMeApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: UpdateAuthMeRequest) => {
      const response = await http.patch<AuthMeResponse>("/auth/me", updates);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/auth/me"], data);
    },
  });
};
