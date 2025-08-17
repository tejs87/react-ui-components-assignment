import React from "react";

type InputFieldProps = {
  label?: string;
  placeholder?: string;
  variant?: "filled" | "outlined" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  helperText?: string;
  errorText?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder = "Enter text...",
  variant = "outlined",
  size = "md",
  disabled = false,
  invalid = false,
  loading = false,
  helperText,
  errorText,
}) => {
  const uid = React.useId();

  // size styles
  const sizeClasses =
    size === "sm"
      ? "px-2 py-1 text-sm"
      : size === "lg"
      ? "px-4 py-3 text-lg"
      : "px-3 py-2 text-base";

  // variant styles
  const variantClasses =
    variant === "filled"
      ? "bg-gray-100 border border-gray-300 focus:border-blue-500"
      : variant === "ghost"
      ? "bg-transparent border-b-2 border-gray-300 rounded-none focus:border-blue-500"
      : "border border-gray-300 focus:border-blue-500";

  const stateClasses = invalid
    ? "border-red-500 focus:border-red-500"
    : disabled
    ? "bg-gray-200 cursor-not-allowed"
    : "";

  return (
    <div className="flex flex-col space-y-1 w-full max-w-md">
      {label && (
        <label htmlFor={uid} className="font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={uid}
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={`w-full rounded-md focus:outline-none ${sizeClasses} ${variantClasses} ${stateClasses}`}
        />
        {loading && (
          <span
            aria-hidden
            className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"
          />
        )}
      </div>

      {helperText && !invalid && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
      {invalid && errorText && (
        <p className="text-sm text-red-500">{errorText}</p>
      )}
    </div>
  );
};

export default InputField;
