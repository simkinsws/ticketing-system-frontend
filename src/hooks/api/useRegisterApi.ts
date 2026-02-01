import { useMutation } from "@tanstack/react-query";
import { http } from "../../api/core/http";
import type { RegisterFormInputs } from "../../pages/Auth/Register";

export const useRegisterApi = () => {
  return useMutation({
    mutationFn: async (userData: RegisterFormInputs) => {
      return await http.post("/auth/register", userData);
    },
  });
};
