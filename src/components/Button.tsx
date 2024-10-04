import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
}) => {
  const baseClasses =
    "px-4 py-2 rounded font-bold text-white transition-colors duration-200";
  const variantClasses = {
    primary: "bg-primary hover:bg-blue-700",
    secondary: "bg-secondary hover:bg-yellow-500 text-gray-800",
    danger: "bg-danger hover:bg-red-700",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
