import { useMutation } from "@tanstack/react-query";
import { http } from "../api/http";
import type { ForgotPasswordInput } from "../types/auth";

export const useForgotPasswordApi = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      return await http.post("/auth/forgot-password", data);
    },
  });
};
