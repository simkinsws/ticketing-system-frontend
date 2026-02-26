import { useQuery } from "@tanstack/react-query";
import { http } from "../../api/core/http";

export type RecentActivity = {
  id: string;
  userId: string;
  userName: string;
  userDisplayName: string;
  category: string;
  title: string;
  description: string;
  entityType: string;
  entityId: string;
  relativeTime: string;
  createdAt: string;
};

export type RecentActivitiesResponse = {
  activities: RecentActivity[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type RecentActivitiesParams = {
  pageSize?: number;
  page?: number;
  scope?: "me" | "all";
};

export const useRecentActivitiesApi = ({
  scope = "all",
  ...params
}: RecentActivitiesParams) => {
  return useQuery<RecentActivitiesResponse>({
    queryKey: ["/activities", scope, params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.pageSize !== undefined) {
        queryParams.append("pageSize", params.pageSize.toString());
      }
      if (params.page !== undefined) {
        queryParams.append("page", params.page.toString());
      }

      const endpoint =
        scope === "me" ? "/api/activities/me" : "/api/activities";
      const response = await http.get<RecentActivitiesResponse>(
        `${endpoint}?${queryParams.toString()}`,
      );
      return response.data;
    },
  });
};
