import { useMutation } from "@tanstack/react-query";
import { http } from "../../api/core/http";
interface ResetPasswordPayload {
  userId: string;
  token: string;
  newPassword: string;
  confirmPassword?: string;
}

export const useResetPasswordApi = () => {
  return useMutation({
    mutationFn: async (resetPasswordData: ResetPasswordPayload) => {
      return await http.post("/auth/reset-password", resetPasswordData);
    },
  });
};
