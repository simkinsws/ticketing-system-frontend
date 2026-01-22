import "./PasswordStrengthIndicator.scss";

type ValidationRule = {
  rule: string;
  isValid: boolean;
};

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({
  password,
}: PasswordStrengthIndicatorProps) => {
  const validations: ValidationRule[] = [
    {
      rule: "At least 8 characters",
      isValid: password.length >= 8,
    },
    {
      rule: "One uppercase letter",
      isValid: /[A-Z]/.test(password),
    },
    {
      rule: "One number",
      isValid: /[0-9]/.test(password),
    },
    {
      rule: "One special character",
      isValid: /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/.test(password),
    },
  ];

  const allValid = validations.every((v) => v.isValid);

  return (
    <div className="password-strength-indicator">
      {validations.map((validation) => (
        <div
          key={validation.rule}
          className={`strength-item ${
            validation.isValid ? "valid" : "invalid"
          }`}
        >
          <span className={`strength-check`}>
            {validation.isValid ? "✓" : "○"}
          </span>
          <span className="strength-text">{validation.rule}</span>
        </div>
      ))}
      {password && (
        <div className={`strength-status ${allValid ? "strong" : "weak"}`}>
          Password strength: {allValid ? "Strong" : "Weak"}
        </div>
      )}
    </div>
  );
};
