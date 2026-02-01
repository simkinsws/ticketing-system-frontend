import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { AxiosError } from "axios";
import { useConfirmEmailApi } from "../../hooks/useConfirmEmailApi";
import shieldLogo from "../../assets/shield-logo.svg";
import successIcon from "../../assets/info-icon-badge.svg";
import "../styles/ConfirmEmail.scss";

export const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId") || "";
  const token = searchParams.get("token") || "";

  const { mutate, isPending, isSuccess, data, error } = useConfirmEmailApi();

  useEffect(() => {
    if (userId && token) {
      mutate({ userId, token });
    }
  }, [mutate, token, userId]);

  const extractMessage = () => {
    const axiosErr = error as AxiosError<{ message?: string; error?: string }>;
    if (!userId || !token) return "Invalid confirmation link";
    return (
      axiosErr?.response?.data?.message ||
      axiosErr?.response?.data?.error ||
      axiosErr?.message ||
      (error instanceof Error ? error.message : undefined)
    );
  };

  const successMessage = data?.data?.message ?? "Email confirmed successfully";
  const errorMessage = extractMessage();

  return (
    <div className="confirm-email-page">
      <section className="confirm-email-card">
        <img
          className="shield-logo"
          src={shieldLogo}
          width={64}
          height={64}
          alt="Confirm Email"
        />

        <h2 className="confirm-email-heading">Confirming your email</h2>
        <p className="confirm-email-subtext">
          We are validating your confirmation link. This only takes a moment.
        </p>

        <div className="confirm-email-status">
          {isPending && <p className="status-text">Working on it...</p>}

          {isSuccess && (
            <div className="status-success">
              <img src={successIcon} alt="success" width={20} height={20} />
              <span>{successMessage}</span>
            </div>
          )}

          {!isPending && errorMessage && !isSuccess ? (
            <div className="status-error">{errorMessage}</div>
          ) : null}
        </div>

        {isSuccess && (
          <Link to="/login" className="confirm-email-button">
            Go to Login
          </Link>
        )}

        {!isSuccess && !isPending && (
          <div className="fallback-actions">
            <Link to="/login" className="confirm-email-link">
              Back to Login
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};