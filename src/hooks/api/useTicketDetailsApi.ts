import { useQuery } from "@tanstack/react-query";
import { http } from "../../api/core/http";

export type AdminTicketListApiParams = {
  userId?: string;
  category?: string;
  status?: number;
  sortBy?: "Title" | "Category" | "Status" | "Description" | "Priority";
  ascending?: boolean;
  pageSize?: number;
  pageNumber?: number;
};

export type TicketDetailsResponse = {
  id: string;
  title: string;
  category: string;
  description: string;
  status: number;
  priority: number;
  createdAt: string;
  updatedAt: string;
};

export const useAdminTicketListApi = (params: AdminTicketListApiParams) => {
  return useQuery<TicketDetailsResponse[]>({
    queryKey: ["/admin/tickets", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.userId) queryParams.append("userId", params.userId);
      if (params.category) queryParams.append("category", params.category);
      if (params.status !== undefined)
        queryParams.append("status", params.status.toString());
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.ascending !== undefined)
        queryParams.append("ascending", params.ascending.toString());
      if (params.pageSize !== undefined)
        queryParams.append("pageSize", params.pageSize.toString());
      if (params.pageNumber !== undefined)
        queryParams.append("pageNumber", params.pageNumber.toString());
      const response = await http.get<TicketDetailsResponse[]>(
        `/admin/tickets?${queryParams.toString()}`
      );
      return response.data;
    },
  });
};
