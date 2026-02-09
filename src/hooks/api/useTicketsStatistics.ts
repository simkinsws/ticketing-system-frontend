import { useQuery } from "@tanstack/react-query";
import { http } from "../../api/core/http";

export type TicketsStatisticsResponse = {
  totalTickets: number;
  resolvedTickets: number;
  inProgressTickets: number;
  openTickets: number;
  closedTickets: number;
};

export const useAdminTicketsStatisticsApi = () => {
  return useQuery<TicketsStatisticsResponse>({
    queryKey: ["/admin/tickets/statistics"],
    queryFn: async () => {
      const response = await http.get<TicketsStatisticsResponse>(
        "/admin/tickets/statistics",
      );
      return response.data;
    },
  });
};

export const useCustomerTicketsStatisticsApi = () => {
  return useQuery<TicketsStatisticsResponse>({
    queryKey: ["/tickets/my/statistics"],
    queryFn: async () => {
      const response = await http.get<TicketsStatisticsResponse>(
        "/tickets/my/statistics",
      );
      return response.data;
    },
  });
};
