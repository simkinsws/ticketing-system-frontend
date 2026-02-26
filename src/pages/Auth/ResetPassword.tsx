import { useSearchParams, Link } from "react-router";
import { useState } from "react";
import shieldLogo from "../../assets/shield-logo.svg";
import "../styles/ResetPassword.scss";
import { ResetPasswordForm } from "../../components/shared/ResetPasswordForm/ResetPasswordForm";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId") || "";
  const token = searchParams.get("token") || "";
  const [isSuccess, setIsSuccess] = useState(false);

  if (isSuccess) {
    return (
      <div className="reset-password-page">
        <section className="reset-password-inner">
          <img
            className="shield-logo"
            src={shieldLogo}
            width={64}
            height={64}
            alt="Reset Password"
          />
          <h2 className="reset-password-heading">Password Reset</h2>
          <p className="reset-password-subtext">
            Password reset successfully
          </p>
          <Link to="/login" className="reset-password-button secondary">
            Back to Login
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <section className="reset-password-inner">
        <img
          className="shield-logo"
          src={shieldLogo}
          width={64}
          height={64}
          alt="Reset Password"
        />
        <h2 className="reset-password-heading">Reset Your Password</h2>
        <p className="reset-password-subtext">
          Enter a new secure password for your account
        </p>
        <ResetPasswordForm
          userId={userId}
          token={token}
          onSuccess={() => setIsSuccess(true)}
          showInfoBlock={true}
        />
      </section>
    </div>
  );
};
