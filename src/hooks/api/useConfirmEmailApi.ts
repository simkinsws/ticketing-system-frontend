import { useMutation } from "@tanstack/react-query";
import { http } from "../../api/core/http";

interface ConfirmEmailPayload {
  userId: string;
  token: string;
}

export const useConfirmEmailApi = () => {
  return useMutation({
    mutationFn: async (payload: ConfirmEmailPayload) => {
      return await http.post("/auth/confirm-email", payload);
    },
  });
};
