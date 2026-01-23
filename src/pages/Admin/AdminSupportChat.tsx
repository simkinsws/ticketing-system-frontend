import { ChatPanel } from "../../components/AdminChat/ChatPanel";
import { InboxPanel } from "../../components/Inbox/InboxPanel";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useUiStore } from "../../store/uiStore";
import { useSignalR } from "../../realtime/useSignalR";
// import { AdminHeader } from "../../components/AdminChat/AdminHeader";
import "./styles/AdminSupportChat.scss";


const AdminSupportChat = () => {
  useSignalR();
  const isMobile = useIsMobile();
  const selectedId = useUiStore((s) => s.selectedConversationId);

  return (
    <div>
      {/* <AdminHeader /> */}
      {isMobile ? (
        selectedId ? (
          <ChatPanel isMobile={isMobile} />
        ) : (
          <InboxPanel />
        )
      ) : (
        <div className="support-chat-admin-desktop">
          <InboxPanel />
          <ChatPanel isMobile={isMobile} />
        </div>
      )}
    </div>
  );
};

export default AdminSupportChat;
