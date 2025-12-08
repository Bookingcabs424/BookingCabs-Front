import { useRef } from "react";
import { FieldErrors, UseFormRegister, Path } from "react-hook-form";
import { bookingFormData } from "./BookingForm";
import { get } from "react-hook-form";

type DatePickerProps = {
  title: string;
  name: keyof bookingFormData | Path<bookingFormData>;
  register: UseFormRegister<bookingFormData>;
  errors: FieldErrors<bookingFormData>;
  onChange?: (value: string) => void; 
  className?: string;
};

export default function DatePicker({
  title,
  name,
  register,
  errors,
  onChange, 
  className
}: DatePickerProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const { ref: dateRef, onChange: formOnChange, ...dateRest } = register(name);

  const today = new Date().toISOString().split("T")[0];
  const errorMessage = get(errors, name)?.message as string | undefined;

  return (
    <div
      onClick={() => dateInputRef.current?.showPicker()}
      className="date-input flex flex-col p-1"
    >
      <label htmlFor={name} className="text-[12px]">
        {title}
      </label>
      <input
        id={`${name}-input`}
        type="date"
        min={today}
        ref={(el) => {
          dateRef(el);
          dateInputRef.current = el;
        }}
        {...dateRest}
        onChange={(e) => {
          const value = e.target.value;
          formOnChange(e); 
          if (onChange) onChange(value); 
        }}
        className={`border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black !${className}`}
      />
      {errorMessage && (
        <p className="text-xs text-[#b36af7] mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
