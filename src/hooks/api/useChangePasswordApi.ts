import { useMutation } from "@tanstack/react-query";
import { http } from "../../api/core/http";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const useChangePasswordApi = () => {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      return await http.post("/auth/change-password", payload);
    },
  });
};
