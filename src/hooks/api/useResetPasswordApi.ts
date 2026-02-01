import { useMutation } from "@tanstack/react-query";
import { http } from "../../api/core/http";
import type { ResetPasswordInputs } from "../../pages/Auth/ResetPassword";

export const useResetPasswordApi = () => {
  return useMutation({
    mutationFn: async (
      resetPasswordData: ResetPasswordInputs & { token: string; userId: string }
    ) => {
      return await http.post("/auth/reset-password", resetPasswordData);
    },
  });
};
