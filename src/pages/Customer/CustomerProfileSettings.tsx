// import { useState } from "react";
// import FileUpload from "../../components/shared/FileUpload/FileUpload";
import { Card } from "../../components/shared/Card/Card";
import { useCustomerTicketsStatisticsApi } from "../../hooks/api/useTicketsStatistics";
import "./styles/CustomerProfileSettings.scss";
import userAvatra from "../../assets/user-avatar-default.png";
import { useAuthStore } from "../../store/authStore";
export const CustomerProfileSettings = () => {
  // const [file, setFile] = useState<File | null>(null);
  // For testing file upload - can be removed later
  // const fd = new FormData();
  // if (file) fd.append("file", file);
  // console.log(fd.get("file"));
  const { data: statistics } = useCustomerTicketsStatisticsApi();
  const displayName = useAuthStore((s) => s.displayName);
  const email = useAuthStore((s) => s.email);
  const role = useAuthStore((s) => s.roles)?.[0];
  return (
    <div className="customer-profile-settings-container">
      {/* <FileUpload value={file} onFileChange={setFile} /> */}
      <Card className="profile-tickets-stats">
        <div className="user-details">
          <img src={userAvatra} alt="User Avatar" className="user-avatar" />
          <div className="user-details-info">
            <div className="user-name">{displayName}</div>
            <div className="user-email">{email}</div>
            <div className="user-roles">
              <span className="role">{role}</span>
              <span className="verified">Verified</span>
            </div>
          </div>
        </div>
        <div className="line-horizontal"></div>
        <div className="tickets-stats">
          <div className="ticket-stat">
            <h3 className="stat-number total">
              {statistics?.totalTickets ?? 0}
            </h3>
            <p className="stat-label">Total Tickets</p>
          </div>
          <div className="ticket-stat">
            <h3 className="stat-number resolved">
              {statistics?.resolvedTickets ?? 0}
            </h3>
            <p className="stat-label">Resolved</p>
          </div>
          <div className="ticket-stat">
            <h3 className="stat-number in-progress">
              {statistics?.inProgressTickets ?? 0}
            </h3>
            <p className="stat-label">In Progress</p>
          </div>
          <div className="ticket-stat">
            <h3 className="stat-number open">{statistics?.openTickets ?? 0}</h3>
            <p className="stat-label">Open</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
