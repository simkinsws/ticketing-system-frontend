import type { ChangeEventHandler } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import type { UseFormRegisterReturn, FieldError } from "react-hook-form";
import "./FormInput.scss";

interface FormInputProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  icon?: string;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  disabled?: boolean;
  className?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  ariaLabel?: string;
}

export const FormInput = ({
  label,
  id,
  type = "text",
  placeholder,
  icon,
  register,
  error,
  disabled = false,
  className,
  value,
  onChange,
  ariaLabel,
}: FormInputProps) => {
  // Avoid mixing controlled props with react-hook-form register handlers
  const controlProps =
    value !== undefined || onChange !== undefined
      ? { value, onChange }
      : register ?? {};

  return (
    <div className={`form-input-wrapper ${className || ""}`}>
      <Form.Label htmlFor={id}>{label}</Form.Label>
      <InputGroup className="form-input-group">
        {icon && (
          <InputGroup.Text
            id={`${id}-prefix`}
            className={`${error ? "input-error" : ""}`}
          >
            <img src={icon} alt={`${label} Icon`} />
          </InputGroup.Text>
        )}
        <Form.Control
          type={type}
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-describedby={icon ? `${id}-prefix` : undefined}
          className={error ? "input-error" : ""}
          {...controlProps}
        />
      </InputGroup>
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};
