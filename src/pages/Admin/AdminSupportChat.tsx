import { Col, Container, Row } from "react-bootstrap";
import { ChatPanel } from "../../components/AdminChat/ChatPanel";
import { InboxPanel } from "../../components/Inbox/InboxPanel";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useUiStore } from "../../store/uiStore";
import { useSignalR } from "../../realtime/useSignalR";
import { AdminHeader } from "../../components/AdminChat/AdminHeader";

const AdminSupportChat = () => {
  useSignalR();
  const isMobile = useIsMobile();
  const selectedId = useUiStore((s) => s.selectedConversationId);

  return (
    <div>
      <AdminHeader />
      {isMobile ? (
        selectedId ? (
          <ChatPanel isMobile={isMobile} />
        ) : (
          <InboxPanel />
        )
      ) : (
        <Container fluid className="admin-layout">
          <Row className="g-0">
            <Col xs="auto" className="inbox-panel">
              <InboxPanel />
            </Col>
            <Col className="chat-panel">
              <ChatPanel isMobile={isMobile} />
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default AdminSupportChat;
