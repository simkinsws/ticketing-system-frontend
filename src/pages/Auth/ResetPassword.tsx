import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { AxiosError } from "axios";
import shieldLogo from "../../assets/shield-logo.svg";
import "../styles/ResetPassword.scss";
import { FormInput } from "../../components/shared/FormInput/FormInput";
import passwordIcon from "../../assets/password-icon.svg";
import { PasswordStrengthIndicator } from "../../components/shared/PasswordStrengthIndicator/PasswordStrengthIndicator";
import infoIcon from "../../assets/info-icon-badge.svg";
import { useResetPasswordApi } from "../../hooks/useResetPasswordApi";
export interface ResetPasswordInputs {
  newPassword: string;
  confirmPassword?: string;
}

export const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInputs>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    mutate: resetPassword,
    isPending,
    isSuccess,
    data,
    error,
  } = useResetPasswordApi();

  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId") || "";
  const token = searchParams.get("token") || "";

  const newPasswordValue = watch("newPassword");
  const confirmPasswordValue = watch("confirmPassword");

  const onSubmit = (data: ResetPasswordInputs) => {
    resetPassword({ ...data, userId, token });
  };

  const successMessage = data?.data?.message ?? "Password reset successfully";

  const extractErrorMessage = () => {
    const axiosErr = error as AxiosError<{ message?: string; error?: string }>;
    return (
      axiosErr?.response?.data?.message ||
      axiosErr?.response?.data?.error ||
      axiosErr?.message ||
      (error instanceof Error ? error.message : undefined)
    );
  };

  const errorMessage = extractErrorMessage();

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
          <p className="reset-password-subtext">{successMessage}</p>
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
        <form onSubmit={handleSubmit(onSubmit)} className="reset-password-form">
          <FormInput
            label="New Password"
            id="password"
            type="password"
            icon={passwordIcon}
            placeholder="Enter your password"
            register={register("newPassword", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            error={errors.newPassword}
          />
          <div className="password-validations">
            <div className="basic-line"></div>
            <PasswordStrengthIndicator password={newPasswordValue} />
          </div>
          <FormInput
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            icon={passwordIcon}
            placeholder="Enter your password again"
            register={register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === newPasswordValue || "Passwords do not match",
            })}
            error={errors.confirmPassword}
          />
          <button
            type="submit"
            disabled={!newPasswordValue || !confirmPasswordValue || isPending}
            className="reset-password-button"
          >
            Reset Password
          </button>
          {errorMessage ? (
            <div className="reset-password-error">{errorMessage}</div>
          ) : null}
        </form>
        <div className="info-block">
          <img src={infoIcon} alt="info-icon" />
          <span className="info-text">
            Your password will be encrypted and securely stored
          </span>
        </div>
      </section>
    </div>
  );
};
