// import { useState } from "react";
// import FileUpload from "../../components/shared/FileUpload/FileUpload";
import { Card } from "../../components/shared/Card/Card";
import { useCustomerTicketsStatisticsApi } from "../../hooks/api/useTicketsStatistics";
import "./styles/CustomerProfile.scss";
import userAvatra from "../../assets/user-avatar-default.png";
import { useAuthStore } from "../../store/authStore";
import { useAuthMeApi } from "../../hooks/api/useAuthMeApi";
export const CustomerProfile = () => {
  // const [file, setFile] = useState<File | null>(null);
  // For testing file upload - can be removed later
  // const fd = new FormData();
  // if (file) fd.append("file", file);
  // console.log(fd.get("file"));
  const { data: profileInfo } = useAuthMeApi();
  const { data: statistics } = useCustomerTicketsStatisticsApi();
  const displayName = useAuthStore((s) => s.displayName);
  const email = useAuthStore((s) => s.email);
  const role = useAuthStore((s) => s.roles)?.[0];
  return (
    <div className="customer-profile-container">
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
      <div className="profile-info">
        <section className="profile-info-cards main-col">
          <Card className="card card-main">
            <div className="profile-info-header">
              <h2 className="profile-info-title">Profile Information</h2>
              <button className="edit-button">edit</button>
            </div>
            <div className="profile-info-content">
              <div>{profileInfo?.displayName}</div>
              <div>{profileInfo?.dateFormat}</div>
              <div>{profileInfo?.timeFormat}</div>
              <div>{profileInfo?.timezone}</div>
              <div>{profileInfo?.formattedCurrentTime}</div>
              <div>{profileInfo?.language}</div>
              <div>{profileInfo?.createdAt}</div>
            </div>
          </Card>
          <Card className="card card-main">
            <h2 className="profile-info-title">Recent Activity</h2>
          </Card>
        </section>
        <section className="profile-info-cards side-col">
          <Card className="card card-side">
            <div className="profile-info-header">
              <h2 className="profile-info-title">Contact Information</h2>
              <button className="edit-button">edit</button>
            </div>
            <div className="profile-info-content">
              <div>{profileInfo?.email}</div>
              <div>{profileInfo?.phoneNumber}</div>
              <div>
                {`${profileInfo?.country}, ${profileInfo?.city}${profileInfo?.street ? `, ${profileInfo.street}` : ""}`}
              </div>
            </div>
          </Card>
          <Card className="card card-side">
            <div className="profile-info-header">
              <h2 className="profile-info-title">Account Status</h2>
            </div>
            <div className="profile-info-content">
              <div>
                <div>Email Verified</div>
                <div>
                  {profileInfo?.emailConfirmed ? "Verified" : "Unverified"}
                </div>
              </div>
              <div>
                <div>Phone Verified</div>
                <div>
                  {profileInfo?.phoneNumberConfirmed
                    ? "Verified"
                    : "Unverified"}
                </div>
              </div>
              <div>
                <div>Account Status</div>
                <div>Verified</div>
              </div>
            </div>
          </Card>
          <Card className="card card-side">
            <h2 className="profile-info-title">Quick Actions</h2>
          </Card>
        </section>
      </div>
    </div>
  );
};
