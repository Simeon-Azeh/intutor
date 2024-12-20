import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  darkMode?: boolean; // Add darkMode prop
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
  darkMode = false, // Default to false
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{label}</label>
      <input
        type={type}
        {...register(name)}
        className={`border p-2 rounded-md text-sm w-full outline-none ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-black border-gray-300'}`}
        {...inputProps}
        defaultValue={defaultValue}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;