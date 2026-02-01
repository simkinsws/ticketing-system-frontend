import { useQuery } from "@tanstack/react-query";
import { openCustomerConversation } from "../../api/chat/endpoints";

export const customerConversationKey = "/api/support/conversation/open";

export function useCustomerConversation() {
  return useQuery({
    queryKey: [customerConversationKey],
    queryFn: openCustomerConversation,
    staleTime: Infinity,
  });
}
