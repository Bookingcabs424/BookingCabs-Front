import { format } from "date-fns"; // make sure this is installed
import DatePicker from "react-datepicker";

interface TimeProps {
  label?: string;
  value?: string;
  onChange?: (val: string) => void;
  onBlur?: () => void;
  className?: string;
}

export default function Time({ label = "Time", value, onChange,onBlur,className }: TimeProps) {
  const handleChange = (date: Date | null) => {
    if (date) {
      const formatted = format(date, "HH:mm");
      onChange?.(formatted);
    } else {
      onChange?.("");
    }
  };

  return (
    <div className="w-full flex flex-col pt-2">
      <label className="font-medium text-[12px] sm:text-sm">{label}</label>
      <DatePicker
        selected={value ? new Date(`1970-01-01T${value}:00`) : null}
        onChange={handleChange}
        showTimeSelect
        onBlur={onBlur}
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        timeFormat="HH:mm"
        dateFormat="HH:mm"
        placeholderText="Select time"
        className={`w-full text-sm text-black px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${className}`}
      />
    </div>
  );
}
