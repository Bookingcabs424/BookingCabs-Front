"use client";
import { X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";


type MultiSelectProps = {
    options: string[],
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
};

export default function MultiSelect({
    options,
  selected,
  setSelected,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

 const handleSelect = (option: string) => {
  if (!selected.includes(option)) {
    setSelected([...selected, option]);
  }
  setSearch("");
};


  const handleRemove = (option: string) => {
    setSelected(selected.filter((item) => item !== option));
  };

  const filteredOptions = options.filter(
    (option) =>
      !selected?.find((item) => item === option) &&
      option.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div
        onClick={toggleDropdown}
        className="border border-gray-300 rounded px-2 py-1 min-h-[36px] flex flex-wrap gap-1 items-center cursor-text"
      >
        {selected?.map((item) => (
          <span
            key={item}
            className="bg-gray-100 text-gray-700 px-1 py-[2px] rounded-full text-sm flex items-center text-[12px]"
          >
            {item}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(item);
              }}
              className="ml-1 text-gray-600"
            >
              <X className="w-4 h-4 cursor-pointer"/>  
            </button>
          </span>
        ))}
        
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="relative z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[12px]"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
