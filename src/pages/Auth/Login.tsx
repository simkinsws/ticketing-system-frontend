import { useForm } from "react-hook-form";
import { useLoginApi } from "../../hooks/useLoginApi";
import { FormInput } from "../../components/shared/FormInput/FormInput";
import ticketLogo from "../../assets/ticket-logo.svg";
import lightning from "../../assets/lightning.svg";
import emailIcon from "../../assets/email-icon.svg";
import passwordIcon from "../../assets/password-icon.svg";
import teams from "../../assets/teams.svg";
import shield from "../../assets/shield.svg";
import "../styles/Login.scss";
import Form from "react-bootstrap/Form";
import { AuthInfoPanel } from "../../components/shared/AuthInfoPanel/AuthInfoPanel";
import { Link, useNavigate } from "react-router";
import type { LoginFormInputs } from "../../types/auth";
import type { AxiosError } from "axios";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const navigate = useNavigate();

  const { mutate: login, isPending, error } = useLoginApi();

  const onSubmit = (data: LoginFormInputs) => {
    login(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="login-page-wrapper">
      <section className="login-container">
        <img
          src={ticketLogo}
          className="ticket-logo"
          alt="Ticketing System Logo"
          width={80}
        />
        <h2 className="welcome-text">Welcome back</h2>
        <span className="sign-in-text">Sign in to your account</span>
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
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
          <FormInput
            label="Password"
            id="password"
            type="password"
            icon={passwordIcon}
            register={register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={errors.password}
          />
          <section className="forgot-password">
            <Form.Check
              type="checkbox"
              label="Remember me"
              {...register("rememberMe")}
            />
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot your password?
            </Link>
          </section>
          <button className="submit-button" type="submit" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign in"}
          </button>
          {error && (
            <p className="error-message">
              {
                (error as AxiosError<{ message: string }>).response?.data
                  .message
              }
            </p>
          )}
        </form>
        <div className="sign-up-block">
          <div className="divider">
            <span>or</span>
          </div>
          <div className="sign-up-link-block">
            <span className="dont-text">Don't have an account?</span>
            <Link to="/register" className="sign-up-link">
              Sign Up
            </Link>
          </div>
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
