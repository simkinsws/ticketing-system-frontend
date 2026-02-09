import type { ReactNode } from "react";
import "./Card.scss";

type CardProps = {
  children?: ReactNode;
  className?: string;
};

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={`shared-card${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
};
