import { useAdminTicketListApi } from "../../../hooks/useTicketDetailsApi";
import { useAuthStore } from "../../../store/authStore";

const BasicTable = () => {
  const { data } = useAdminTicketListApi({});
  const autoStore = useAuthStore((state) => state);
  return (
    <div>
      BasicTable {JSON.stringify(data)}
      <div>IsAuthenticated: {autoStore.isAuthenticated.toString()}</div>
      <div>Roles: {autoStore.roles.toString()}</div>
      <div>: {autoStore.userId}</div>
    </div>
  );
};

export default BasicTable;
