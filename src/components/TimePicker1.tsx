import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


type TimePickerProps ={
  title?: string;
}

export default function TimePicker1({title}: TimePickerProps) {
  const [time, setTime] = useState<Date | null>(null);

  const handleChange = (date: Date | null) => {
    setTime(date);
  };

  return (
    <div className="w-full flex flex-col py-2 dark:text-black">
      <label className="font-medium text-[8px] sm:text-[12px] sm:text-sm">{title ? title : "Flight Time"}</label>
      <DatePicker
        selected={time}
       onChange={handleChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        timeFormat="HH:mm"
        dateFormat="HH:mm"
        placeholderText="Select time"
        className="w-full border rounded-md border-gray-400 text-[9px] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] outline-none sm:text-sm"
      />
    </div>
  );
}
