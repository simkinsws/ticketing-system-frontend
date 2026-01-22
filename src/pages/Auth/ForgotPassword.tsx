import forgotPasswordIcon from "../../assets/forgot-password-icon.svg";
import { FormInput } from "../../components/shared/FormInput/FormInput";
import emailIcon from "../../assets/email-icon.svg";
import { useForm } from "react-hook-form";
import infoIcon from "../../assets/info-icon.svg";
import arrowLink from "../../assets/arrow-link.svg";
import type { ForgotPasswordInput } from "../../types/auth";
import { useForgotPasswordApi } from "../../hooks/useForgotPasswordApi";
import { Link } from "react-router";
import "../styles/ForgotPassword.scss";
import type { AxiosError } from "axios";
const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    defaultValues: {
      email: "",
    },
  });

  const {
    mutate: forgotPassword,
    error,
    isSuccess,
    isPending,
  } = useForgotPasswordApi();

  const onSubmit = (data: ForgotPasswordInput) => {
    forgotPassword(data);
  };

  if (isSuccess) {
    return (
      <div className="forgot-password-page">
        <section className="forgot-password-page-inner">
          <img
            src={forgotPasswordIcon}
            alt="Success Icon"
            width={64}
            height={64}
            className="logo-image"
          />
          <h2 className="forgot-password-heading">Check Your Email</h2>
          <span className="forgot-password-text">
            We've sent password reset instructions to your email address. Please
            check your inbox and follow the link to reset your password.
          </span>
          <div className="back-to-login-text">
            <img src={arrowLink} alt="Arrow Link" />
            <Link to="/login" className="back-link">
              Back to Login
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <section className="forgot-password-page-inner">
        <img
          src={forgotPasswordIcon}
          alt="Forgot Password Icon"
          width={64}
          height={64}
          className="logo-image"
        />
        <h2 className="forgot-password-heading">Forgot Password?</h2>
        <span className="forgot-password-text">
          No worries! Enter your email address and we'll send you a link to
          reset your password.
        </span>
        <form
          className="forgot-password-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormInput
            label="Email address"
            id="email"
            type="text"
            icon={emailIcon}
            register={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email",
              },
            })}
            error={errors.email}
          />
          {error && (
            <p className="error-message">
              {
                (error as AxiosError<{ message: string }>).response?.data
                  .message
              }
            </p>
          )}
          <button
            type="submit"
            className="forgot-password-button"
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <div className="spacer">
          <div className="line"></div>
        </div>
        <div className="back-to-login-text">
          <img src={arrowLink} alt="Arrow Link" />
          <Link to="/login" className="back-link">
            Back to Login
          </Link>
        </div>
        <Link to="/register" className="signup-link">
          <span className="dont-text">Don't have an account?</span> Sign Up
        </Link>
        <div className="forgot-password-info-block">
          <img src={infoIcon} alt="Info Icon" width={40} height={40} />
          <div className="forgot-password-info-text">
            <h3 className="info-headline">Check your email</h3>
            <span className="info-subtext">
              We'll send you a password reset link if an account exists with
              this email address. The link will expire in 24 hours.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;
