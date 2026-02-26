// import { useState } from "react";
// import FileUpload from "../../components/shared/FileUpload/FileUpload";
import { useRef, useState } from "react";
import { Card } from "../../components/shared/Card/Card";
import { useCustomerTicketsStatisticsApi } from "../../hooks/api/useTicketsStatistics";
import styles from "./styles/CustomerProfile.module.scss";
import userAvatra from "../../assets/user-avatar-default.png";
import { useAuthStore } from "../../store/authStore";
import { useAuthMeApi } from "../../hooks/api/useAuthMeApi";
import { formatDateWithPattern } from "../../utils/dateGrouping";
import { useNavigate } from "react-router";
import { ChangePasswordModal } from "../../components/shared/ChangePasswordModal/ChangePasswordModal";
import { useRecentActivitiesApi } from "../../hooks/api/useRecentActivitiesApi";
import locationIcon from "../../assets/profile-location.svg";
import emailIcon from "../../assets/profile-email.svg";
import phoneIcon from "../../assets/profile-phone.svg";
import settingEntityIcon from "../../assets/settings-entity.svg";
import userEntity from "../../assets/user-entity.svg";
import ticketEntity from "../../assets/ticket-entity.svg";
import commentEntity from "../../assets/comment-entity.svg";
export const CustomerProfile = () => {
  // const [file, setFile] = useState<File | null>(null);
  // For testing file upload - can be removed later
  // const fd = new FormData();
  // if (file) fd.append("file", file);
  // console.log(fd.get("file"));
  const navigate = useNavigate();
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { data: profileInfo } = useAuthMeApi();
  const { data: statistics } = useCustomerTicketsStatisticsApi();
  const { data: recentActivities, isLoading: isRecentActivitiesLoading } =
    useRecentActivitiesApi({ scope: "me", pageSize: 5, page: 1 });
  const displayName = useAuthStore((s) => s.displayName);
  const email = useAuthStore((s) => s.email);
  const role = useAuthStore((s) => s.roles)?.[0];

  type ActivityEntityType = "Ticket" | "Comment" | "User" | "System";
  const entityIcons: Record<ActivityEntityType, string> = {
    Ticket: ticketEntity,
    Comment: commentEntity,
    User: userEntity,
    System: settingEntityIcon,
  };

  const getActivityIcon = (entityType?: string) => {
    return entityIcons[entityType as ActivityEntityType] ?? settingEntityIcon;
  };

  const handleCreateTicket = () => {
    alert(
      "You will be redirected to create a new support ticket. Fill in the details and submit your request.",
    );
  };

  const handleAccountSettings = () => {
    navigate("/customer/settings");
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  return (
    <div className={styles.customerProfileContainer} ref={modalContainerRef}>
      {/* <FileUpload value={file} onFileChange={setFile} /> */}
      <Card className={styles.profileTicketsStats}>
        <div className={styles.userDetails}>
          <img
            src={userAvatra}
            alt="User Avatar"
            className={styles.userAvatar}
          />
          <div className={styles.userDetailsInfo}>
            <div className={styles.userName}>{displayName}</div>
            <div className={styles.userEmail}>{email}</div>
            <div className={styles.userRoles}>
              <span className={styles.role}>{role}</span>
              <span className={styles.verified}>Verified</span>
            </div>
          </div>
        </div>
        <div className={styles.lineHorizontal}></div>
        <div className={styles.ticketsStats}>
          <div className={styles.ticketStat}>
            <h3 className={`${styles.statNumber} ${styles.total}`}>
              {statistics?.totalTickets ?? 0}
            </h3>
            <p className={styles.statLabel}>Total Tickets</p>
          </div>
          <div className={styles.ticketStat}>
            <h3 className={`${styles.statNumber} ${styles.resolved}`}>
              {statistics?.resolvedTickets ?? 0}
            </h3>
            <p className={styles.statLabel}>Resolved</p>
          </div>
          <div className={styles.ticketStat}>
            <h3 className={`${styles.statNumber} ${styles.inProgress}`}>
              {statistics?.inProgressTickets ?? 0}
            </h3>
            <p className={styles.statLabel}>In Progress</p>
          </div>
          <div className={styles.ticketStat}>
            <h3 className={`${styles.statNumber} ${styles.open}`}>
              {statistics?.openTickets ?? 0}
            </h3>
            <p className={styles.statLabel}>Open</p>
          </div>
        </div>
      </Card>
      <div className={styles.profileInfo}>
        <section className={`${styles.profileInfoCards} ${styles.mainCol}`}>
          <Card className={`${styles.card} ${styles.cardMain}`}>
            <div className={styles.profileInfoHeader}>
              <h2 className={styles.profileInfoTitle}>Personal Information</h2>
              <button className={styles.editButton}>edit</button>
            </div>
            <div
              className={`${styles.profileInfoContent} ${styles.profileDetails}`}
            >
              <div className={styles.item}>
                <span className={styles.label}>Full Name</span>
                {profileInfo?.displayName}
              </div>
              <div className={styles.item}>
                <span className={styles.label}>Date Format</span>
                {profileInfo?.dateFormat}
              </div>
              <div className={styles.item}>
                <span className={styles.label}>Time Format</span>
                {profileInfo?.timeFormat}
              </div>
              <div className={styles.item}>
                <span className={styles.label}>Timezone</span>
                {profileInfo?.timezone}
              </div>
              <div className={styles.item}>
                <span className={styles.label}>Current Time</span>
                {profileInfo?.formattedCurrentTime}
              </div>
              <div className={styles.item}>
                <span className={styles.label}>Language</span>
                {profileInfo?.language === "EN" ? "English" : "Hebrew"}
              </div>
              <div className={styles.item}>
                <span className={styles.label}>Member Since</span>
                {profileInfo?.createdAt &&
                  profileInfo.dateFormat &&
                  formatDateWithPattern(
                    profileInfo.createdAt,
                    profileInfo.dateFormat,
                    profileInfo.timeFormat,
                  )}
              </div>
            </div>
          </Card>
          <Card className={`${styles.card} ${styles.cardMain}`}>
            <h2 className={styles.profileInfoTitle}>Recent Activity</h2>
            <div className={styles.recentActivityList}>
              {isRecentActivitiesLoading ? (
                <div className={styles.recentActivityEmpty}>
                  Loading recent activity...
                </div>
              ) : recentActivities?.activities?.length ? (
                recentActivities.activities.map((activity) => (
                  <div key={activity.id} className={styles.recentActivityItem}>
                    <img
                      src={getActivityIcon(activity.entityType)}
                      alt={`${activity.entityType} activity`}
                      className={styles.recentActivityIcon}
                    />
                    <div className={styles.recentActivityContent}>
                      <div className={styles.recentActivityTitle}>
                        {activity.title}
                      </div>
                      <div className={styles.recentActivityDescription}>
                        {activity.description}
                      </div>
                      <div className={styles.recentActivityTime}>
                        {activity.relativeTime}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.recentActivityEmpty}>
                  No recent activity yet.
                </div>
              )}
            </div>
          </Card>
        </section>
        <section className={`${styles.profileInfoCards} ${styles.sideCol}`}>
          <Card className={`${styles.card} ${styles.cardSide}`}>
            <div className={styles.profileInfoHeader}>
              <h2 className={styles.profileInfoTitle}>Contact Information</h2>
              <button className={styles.editButton}>edit</button>
            </div>
            <div className={styles.profileInfoContent}>
              <div className={styles.contactItem}>
                <img src={emailIcon} alt="Email Icon" className={styles.icon} />
                <div className={styles.contactInnerItem}>
                  <span className={styles.label}>Email</span>
                  {profileInfo?.email}
                </div>
              </div>
              <div className={styles.contactItem}>
                <img src={phoneIcon} alt="Phone Icon" className={styles.icon} />
                <div className={styles.contactInnerItem}>
                  <span className={styles.label}>Phone</span>
                  {profileInfo?.phoneNumber}
                </div>
              </div>
              <div className={styles.contactItem}>
                <img
                  src={locationIcon}
                  alt="Location Icon"
                  className={styles.icon}
                />
                <div className={styles.contactInnerItem}>
                  <span className={styles.label}>Location</span>
                  {`${profileInfo?.country}, ${profileInfo?.city}${profileInfo?.street ? `, ${profileInfo.street}` : ""}`}
                </div>
              </div>
            </div>
          </Card>
          <Card className={`${styles.card} ${styles.cardSide}`}>
            <div className={styles.profileInfoHeader}>
              <h2 className={styles.profileInfoTitle}>Account Status</h2>
            </div>
            <div className={styles.profileInfoContent}>
              <div className={styles.accountStatusItem}>
                <div>Email Verified</div>
                <div
                  className={`${styles.status} ${
                    profileInfo?.emailConfirmed
                      ? styles.verified
                      : styles.unverified
                  }`}
                >
                  {profileInfo?.emailConfirmed ? "Verified" : "Unverified"}
                </div>
              </div>
              <div className={styles.accountStatusItem}>
                <div>Phone Verified</div>
                <div
                  className={`${styles.status} ${
                    profileInfo?.phoneNumberConfirmed
                      ? styles.verified
                      : styles.unverified
                  }`}
                >
                  {profileInfo?.phoneNumberConfirmed
                    ? "Verified"
                    : "Unverified"}
                </div>
              </div>
              <div className={styles.accountStatusItem}>
                <div>Account Status</div>
                <div className={`${styles.status} ${styles.verified}`}>
                  Verified
                </div>
              </div>
            </div>
          </Card>
          <Card className={`${styles.card} ${styles.cardSide}`}>
            <h2 className={styles.profileInfoTitle}>Quick Actions</h2>
            <div className={styles.quickActions}>
              <button
                className={styles.quickActionButton}
                onClick={handleCreateTicket}
              >
                Create New Ticket
              </button>
              <button
                className={styles.quickActionButton}
                onClick={handleAccountSettings}
              >
                Account Settings
              </button>
              <button
                className={styles.quickActionButton}
                onClick={handleChangePassword}
              >
                Change Password
              </button>
            </div>
          </Card>
        </section>
      </div>

      <ChangePasswordModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        container={() => modalContainerRef.current}
      />
    </div>
  );
};
