import { Modal } from "react-bootstrap";
import { ResetPasswordForm } from "../ResetPasswordForm/ResetPasswordForm";
import "./ChangePasswordModal.scss";
import type { RefObject } from "react";

interface ChangePasswordModalProps {
  show: boolean;
  onHide: () => void;
  container?:
    | HTMLElement
    | (() => HTMLElement | null)
    | RefObject<HTMLElement>
    | null;
}

export const ChangePasswordModal = ({
  show,
  onHide,
  container,
}: ChangePasswordModalProps) => {
  const handleSuccess = () => {
    setTimeout(() => {
      onHide();
    }, 2000);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      container={container}
      className="change-password-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="modal-description">
          Enter a new secure password for your account
        </p>
        <ResetPasswordForm
          mode="change"
          onSuccess={handleSuccess}
          showInfoBlock={true}
        />
      </Modal.Body>
    </Modal>
  );
};
