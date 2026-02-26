import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { FormInput } from "../FormInput/FormInput";
import passwordIcon from "../../../assets/password-icon.svg";
import { PasswordStrengthIndicator } from "../PasswordStrengthIndicator/PasswordStrengthIndicator";
import infoIcon from "../../../assets/info-icon-badge.svg";
import { useResetPasswordApi } from "../../../hooks/api/useResetPasswordApi";
import { useChangePasswordApi } from "../../../hooks/api/useChangePasswordApi";
import "./ResetPasswordForm.scss";

export interface ResetPasswordInputs {
  currentPassword?: string;
  newPassword: string;
  confirmPassword?: string;
}

interface ResetPasswordFormProps {
  userId?: string;
  token?: string;
  onSuccess?: () => void;
  showInfoBlock?: boolean;
  mode?: "reset" | "change";
}

export const ResetPasswordForm = ({
  userId = "",
  token = "",
  onSuccess,
  showInfoBlock = true,
  mode = "reset",
}: ResetPasswordFormProps) => {
  const isChangeMode = mode === "change";
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordInputs>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    mutate: resetPassword,
    isPending: isResetPending,
    isSuccess: isResetSuccess,
    error: resetError,
  } = useResetPasswordApi();

  const {
    mutate: changePassword,
    isPending: isChangePending,
    isSuccess: isChangeSuccess,
    error: changeError,
  } = useChangePasswordApi();

  const currentPasswordValue = watch("currentPassword");
  const newPasswordValue = watch("newPassword");
  const confirmPasswordValue = watch("confirmPassword");

  const onSubmit = (data: ResetPasswordInputs) => {
    if (isChangeMode) {
      changePassword(
        {
          currentPassword: data.currentPassword || "",
          newPassword: data.newPassword,
        },
        {
          onSuccess: () => {
            reset();
            onSuccess?.();
          },
        },
      );
      return;
    }

    resetPassword(
      {
        userId,
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      },
    );
  };

  const extractErrorMessage = () => {
    const activeError = isChangeMode ? changeError : resetError;
    const axiosErr = activeError as AxiosError<{
      message?: string;
      error?: string;
    }>;
    return (
      axiosErr?.response?.data?.message ||
      axiosErr?.response?.data?.error ||
      axiosErr?.message ||
      (activeError instanceof Error ? activeError.message : undefined)
    );
  };

  const errorMessage = extractErrorMessage();

  const isPending = isChangeMode ? isChangePending : isResetPending;
  const isSuccess = isChangeMode ? isChangeSuccess : isResetSuccess;

  if (isSuccess) {
    return (
      <div className="reset-password-success">
        <p className="success-message">Password changed successfully!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="reset-password-form">
      {isChangeMode && (
        <FormInput
          label="Current Password"
          id="currentPassword"
          type="password"
          icon={passwordIcon}
          placeholder="Enter your current password"
          register={register("currentPassword", {
            required: "Current password is required",
          })}
          error={errors.currentPassword}
        />
      )}
      <FormInput
        label="New Password"
        id="newPassword"
        type="password"
        icon={passwordIcon}
        placeholder="Enter your new password"
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
        placeholder="Confirm your new password"
        register={register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) =>
            value === newPasswordValue || "Passwords do not match",
        })}
        error={errors.confirmPassword}
      />
      <button
        type="submit"
        disabled={
          !newPasswordValue ||
          !confirmPasswordValue ||
          (isChangeMode && !currentPasswordValue) ||
          isPending
        }
        className="reset-password-button"
      >
        {isPending ? "Changing Password..." : "Change Password"}
      </button>
      {errorMessage ? (
        <div className="reset-password-error">{errorMessage}</div>
      ) : null}
      {showInfoBlock && (
        <div className="info-block">
          <img src={infoIcon} alt="info-icon" />
          <span className="info-text">
            Your password will be encrypted and securely stored
          </span>
        </div>
      )}
    </form>
  );
};
