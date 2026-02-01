import { useForm } from "react-hook-form";
import { FormInput } from "../../components/shared/FormInput/FormInput";
import { AuthInfoPanel } from "../../components/shared/AuthInfoPanel/AuthInfoPanel";
import { PasswordStrengthIndicator } from "../../components/shared/PasswordStrengthIndicator/PasswordStrengthIndicator";
import ticketLogo from "../../assets/ticket-logo.svg";
import lightning from "../../assets/lightning.svg";
import emailIcon from "../../assets/email-icon.svg";
import passwordIcon from "../../assets/password-icon.svg";
import teams from "../../assets/teams.svg";
import userIcon from "../../assets/user-icon.svg";
import shield from "../../assets/shield.svg";
import "../styles/Register.scss";
import { Link } from "react-router";
import type { AxiosError } from "axios";
import { useRegisterApi } from "../../hooks/useRegisterApi";

export type RegisterFormInputs = {
  email: string;
  password: string;
  displayName: string;
  confirmPassword?: string;
};

export type ErrorResponse = {
  message?: string;
  error?: string;
  errors?: Array<{
    description?: string;
    message?: string;
    code?: string;
  }>;
  description?: string;
  code?: string;
};

export const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
      confirmPassword: "",
    },
  });

  const {
    mutate: registerUser,
    error,
    isSuccess,
    data,
    isPending,
  } = useRegisterApi();

  const passwordValue = watch("password");

  const onSubmit = (data: RegisterFormInputs) => {
    registerUser(data);
  };

  const successMessage = data?.data?.message ?? "Account created successfully";

  const extractErrorMessage = () => {
    const axiosErr = error as AxiosError<ErrorResponse>;
    const resp = axiosErr?.response?.data;

    if (Array.isArray(resp) && resp.length) {
      return resp
        .map((item) => item?.description || item?.message || item?.code)
        .filter(Boolean)
        .join(", ");
    }

    if (resp?.errors && Array.isArray(resp.errors) && resp.errors.length) {
      return resp.errors
        .map((item) => item?.description || item?.message || item?.code)
        .filter(Boolean)
        .join(", ");
    }

    return (
      resp?.message ||
      resp?.error ||
      axiosErr?.message ||
      (error instanceof Error ? error.message : undefined)
    );
  };

  const errorMessage = extractErrorMessage();

  if (isSuccess) {
    return (
      <div className="register-page-wrapper">
        <section className="register-container">
          <div className="register-success-card">
            <img
              src={ticketLogo}
              className="ticket-logo"
              alt="Ticketing System Logo"
              width={80}
            />
            <h2 className="welcome-text">Registration Successful</h2>
            <p className="success-message-text">{successMessage}</p>
            <Link to="/login" className="success-login-link">
              Back to Login
            </Link>
          </div>
        </section>
        <AuthInfoPanel
          headline="Professional ticketing system for modern teams"
          subtext="Streamline your support workflow and deliver exceptional customer experiences."
          items={[
            {
              icon: lightning,
              title: "Lightning Fast",
              description:
                "Respond to tickets in seconds with our intuitive interface",
              alt: "Lightning Icon",
            },
            {
              icon: shield,
              title: "Secure & Reliable",
              description: "Enterprise-grade security to protect your data",
              alt: "Shield Icon",
            },
            {
              icon: teams,
              title: "Team Collaboration",
              description: "Work together seamlessly with your team members",
              alt: "Teams Icon",
            },
          ]}
        />
      </div>
    );
  }

  return (
    <div className="register-page-wrapper">
      <section className="register-container">
        <img
          src={ticketLogo}
          className="ticket-logo"
          alt="Ticketing System Logo"
          width={80}
        />
        <h2 className="welcome-text">Create account</h2>
        <span className="register-text">
          Get started with your free account
        </span>
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="Name"
            id="displayName"
            type="text"
            icon={userIcon}
            placeholder="John Doe"
            register={register("displayName", {
              required: "Display name is required",
              minLength: {
                value: 6,
                message: "Display name must be at least 6 characters",
              },
            })}
            error={errors.displayName}
          />
          <FormInput
            label="Email address"
            id="email"
            type="email"
            icon={emailIcon}
            placeholder="you@example.com"
            register={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email",
              },
            })}
            error={errors.email}
          />
          <FormInput
            label="Password"
            id="password"
            type="password"
            icon={passwordIcon}
            placeholder="Enter your password"
            register={register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            error={errors.password}
          />
          <div className="password-validations">
            <span className="basic-line"></span>
            <PasswordStrengthIndicator password={passwordValue} />
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
                value === passwordValue || "Passwords do not match",
            })}
            error={errors.confirmPassword}
          />
          <button className="submit-button" type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Account"}
          </button>
          {errorMessage ? (
            <p className="error-message">{errorMessage}</p>
          ) : null}
        </form>
        <div className="signin-link">
          <span className="dont-text">Already have an account?</span>
          <Link to="/login" className="signin-link-text">
            Sign in
          </Link>
        </div>
      </section>
      <AuthInfoPanel
        headline="Professional ticketing system for modern teams"
        subtext="Streamline your support workflow and deliver exceptional customer experiences."
        items={[
          {
            icon: lightning,
            title: "Lightning Fast",
            description:
              "Respond to tickets in seconds with our intuitive interface",
            alt: "Lightning Icon",
          },
          {
            icon: shield,
            title: "Secure & Reliable",
            description: "Enterprise-grade security to protect your data",
            alt: "Shield Icon",
          },
          {
            icon: teams,
            title: "Team Collaboration",
            description: "Work together seamlessly with your team members",
            alt: "Teams Icon",
          },
        ]}
      />
    </div>
  );
};
