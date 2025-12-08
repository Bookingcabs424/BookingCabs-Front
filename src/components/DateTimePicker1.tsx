import { Control, Controller, FieldErrors } from "react-hook-form";
import DatePicker from "react-datepicker";
import { bookingFormData } from "./BookingForm";
import "react-datepicker/dist/react-datepicker.css";
import { Path } from "react-hook-form";
import { get } from "lodash";

interface DateTimePickerProps {
  title?: string;
  control: Control<bookingFormData>;
  errors: FieldErrors<bookingFormData>;
  name: Extract<keyof bookingFormData, string> | Path<bookingFormData> | any;
  isRequired?: boolean;
}

export default function DateTimePicker1({
  title = "Date & Time",
  control,
  errors,
  name,
  isRequired,
}: DateTimePickerProps) {
  const getDateValue = (value: any) => {
    if (!value) return null;
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      value instanceof Date
    ) {
      return new Date(value);
    }
    return null;
  };

  const error = get(errors, name);

  return (
    <>
      {isRequired ? (
        <div className="w-full flex py-1 flex-col">
          <label className="text-[12px] sm:text-[14px]">
            {title} <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <DatePicker
                name={name}
                selected={getDateValue(field.value)}
                onChange={(date: Date | null) => {
                  // Convert Date to ISO string
                  if (date instanceof Date && !isNaN(date.getTime())) {
                    field.onChange(date.toISOString());
                  } else {
                    field.onChange("");
                  }
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                timeCaption="Time"
                placeholderText="Select date & time"
                className="w-full border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] cursor-pointer focus:border-[#9d7a20] sm:text-sm"
              />
            )}
          />
          {error && (
            <p className="text-xs text-red-600">{error.message as string}</p>
          )}
        </div>
      ) : (
        <div className="w-full flex py-1 flex-col">
          <label className="font-[500] font-medium text-[12px] sm:text-[14px]">
            {title}
          </label>
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <DatePicker
                name={name}
                selected={getDateValue(field.value)}
                onChange={(date: Date | null) => {
                  // Convert Date to ISO string
                  if (date instanceof Date && !isNaN(date.getTime())) {
                    field.onChange(date.toISOString());
                  } else {
                    field.onChange("");
                  }
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                timeCaption="Time"
                placeholderText="Select date & time"
                className="w-full border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
              />
            )}
          />
        </div>
      )}
    </>
  );
}
