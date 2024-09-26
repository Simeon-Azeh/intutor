import { FieldError, UseFormRegister } from "react-hook-form";

type InputFieldProps<TFormValues> = {
  label: string;
  type?: string;
  register: UseFormRegister<TFormValues>; // Make register type-safe
  name: keyof TFormValues; // Use keyof to reference form fields correctly
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = <TFormValues,>({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
}: InputFieldProps<TFormValues>) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        {...register(name)} // Properly typed register function
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full outline-none"
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
