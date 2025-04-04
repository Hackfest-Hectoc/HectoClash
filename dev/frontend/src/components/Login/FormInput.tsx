import React, { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  placeholder,
  type,
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="px-5 py-0 text-2xl text-white rounded-2xl border-4 border-gray-800 border-solid h-[61px] w-[411px] max-sm:w-full max-sm:max-w-[411px] bg-transparent focus:outline-none focus:border-green-300 transition-colors"
      {...props}
    />
  );
};
