import { useQuery } from "@tanstack/react-query";
import { fetchAdminInbox } from "../api/chatApi";

export const adminInboxKey = "/api/admin/inbox";

export function useAdminInbox() {
  return useQuery({
    queryKey: [adminInboxKey],
    queryFn: fetchAdminInbox,
    refetchInterval: 10000,
  });
}
