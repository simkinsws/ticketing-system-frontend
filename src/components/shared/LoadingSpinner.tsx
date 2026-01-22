import { Spinner as BootstrapSpinner } from "react-bootstrap";

export function LoadingSpinner({
  size = "sm",
  className = "",
}: {
  size?: "sm" | undefined;
  className?: string;
}) {
  return <BootstrapSpinner size={size} className={`me-2 ${className}`} />;
}
