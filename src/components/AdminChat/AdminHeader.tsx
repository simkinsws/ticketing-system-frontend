import { Navbar, Container } from "react-bootstrap";
import "./styles/AdminHeader.scss";
import { ConnectionStatus } from "../shared/ConnectionStatus";

export function AdminHeader() {
  return (
    <Navbar className="admin-header" variant="dark">
      <Container fluid className="px-4">
        <Navbar.Brand className="brand">
          💬 Support Chat - Admin Dashboard
        </Navbar.Brand>
        <ConnectionStatus />
      </Container>
    </Navbar>
  );
}
