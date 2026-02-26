import { useQuery } from "@tanstack/react-query";
import { http } from "../../api/core/http";
import type { AuthMeResponse } from "../../types/auth";

export const useAuthMeApi = () => {
  return useQuery({
    queryKey: ["/auth/me"],
    queryFn: async () => {
      const response = await http.get<AuthMeResponse>("/auth/me");
      return response.data;
    },
    retry: false, // Don't retry on auth endpoints
    staleTime: Infinity, // Cache indefinitely once fetched
    throwOnError: false, // Handle errors gracefully
  });
};

