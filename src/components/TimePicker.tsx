// "use client";
// import { Control, Controller, FieldErrors } from "react-hook-form";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { bookingFormData } from "./BookingForm";
// import { Path } from "react-hook-form";
// import { get } from "lodash";

// interface TimePickerProps {
//   title?: string;
//   control: Control<bookingFormData>;
//   errors: FieldErrors<bookingFormData>;
//   name: Extract<keyof bookingFormData, string> | Path<bookingFormData> | any;
//   isRequired?: boolean;
//   outstation?: string;
//   onChange?: (value: string) => void; 
// }

// const getTimeValue = (value: any) => {
//   if (!value) return null;

//   // If it's already a Date object
//   if (value instanceof Date) return value;

//   // If it's a time string in HH:mm format (e.g., "13:45")
//   if (typeof value === "string" && /^\d{2}:\d{2}$/.test(value)) {
//     const [hours, minutes] = value.split(":").map(Number);
//     const now = new Date();
//     now.setHours(hours, minutes, 0, 0); // Set time
//     return now;
//   }

//   // If it's an ISO string or timestamp
//   const parsedDate = new Date(value);
//   if (!isNaN(parsedDate.getTime())) return parsedDate;

//   return null;
// };

// export default function TimePicker({
//   title = "Flight Time",
//   control,
//   errors,
//   name,
//   isRequired,
//   onChange
// }: TimePickerProps) {
//   const error = get(errors, name);

//   return (
//     <div className="w-full flex flex-col px-1 py-2">
//       <label className="text-[12px] font-medium">
//         {title} {isRequired && <span className="text-red-500">*</span>}
//       </label>
//       <Controller
//         control={control}
//         name={name}
//         render={({ field }) => (
//           <DatePicker
//             selected={getTimeValue(field.value)}
//             onChange={(date) => {
//               if (date instanceof Date && !isNaN(date.getTime())) {
//                 const hours = String(date.getHours()).padStart(2, "0");
//                 const minutes = String(date.getMinutes()).padStart(2, "0");
//                 const timeString = `${hours}:${minutes}`;

//                 field.onChange(timeString);

//                 if (onChange) {
//                   onChange(timeString);
//                 }
//               } else {
//                 field.onChange("");
//                 if (onChange) {
//                   onChange("");
//                 }
//               }
//             }}
//             showTimeSelect
//             showTimeSelectOnly
//             timeIntervals={15}
//             timeCaption="Time"
//             timeFormat="HH:mm"
//             dateFormat="HH:mm"
//             placeholderText="Select time"
//             className="w-full border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm dark:text-black"
//           />
//         )}
//       />
//       {error && (
//         <p className="text-xs text-red-600 mt-1">{error.message as string}</p>
//       )}
//     </div>
//   );
// }

"use client";
import { Control, Controller, FieldErrors, Path } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { bookingFormData } from "./BookingForm";
import { get } from "lodash";

interface TimePickerProps {
  title?: string;
  control: Control<bookingFormData>;
  errors: FieldErrors<bookingFormData>;
  name: Extract<keyof bookingFormData, string> | Path<bookingFormData> | any;
  isRequired?: boolean;
  outstation?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const getTimeValue = (value: any) => {
  if (!value) return null;

  if (value instanceof Date) return value;

  if (typeof value === "string" && /^\d{2}:\d{2}$/.test(value)) {
    const [hours, minutes] = value.split(":").map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now;
  }

  const parsedDate = new Date(value);
  if (!isNaN(parsedDate.getTime())) return parsedDate;

  return null;
};

export default function TimePicker({
  title = "Flight Time",
  control,
  errors,
  name,
  isRequired,
  outstation,
  className,
  onChange,
}: TimePickerProps) {
  const error = get(errors, name);

  return (
    <div className={`w-full flex flex-col px-3 sm:py-2 ${className} lg:p-1`}>
      <label className="text-[12px]">
        {title} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePicker
            selected={getTimeValue(field.value)}
            onChange={(date: Date | null) => {
              if (date instanceof Date && !isNaN(date.getTime())) {
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");
                const timeString = `${hours}:${minutes}`;

                field.onChange(timeString);

                if (onChange) {
                  onChange(timeString);
                }

                if (outstation === "multicity") {
                  console.log("Multicity extra logic:", timeString);
                }
              } else {
                field.onChange("");
                if (onChange) onChange("");
              }
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            timeFormat="HH:mm"
            dateFormat="HH:mm"
            placeholderText="Select time"
            className="w-full border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
          />
        )}
      />
      {error && (
        <p className="text-xs text-red-600 mt-1">{error.message as string}</p>
      )}
    </div>
  );
}
