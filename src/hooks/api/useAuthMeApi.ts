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
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
