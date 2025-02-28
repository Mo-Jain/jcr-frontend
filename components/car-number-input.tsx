"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";

interface CarNumberPlateInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CarNumberPlateInput: React.FC<CarNumberPlateInputProps> = ({
  value,
  onChange,
}) => {
  const [focused, setFocused] = useState(false);

  const formatValue = useCallback((input: string) => {
    const cleaned = input.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const parts = [
      cleaned.slice(0, 2),
      cleaned.slice(2, 4),
      cleaned.slice(4, 6),
      cleaned.slice(6, 10),
    ];
    return parts.filter((part) => part.length > 0).join(" ");
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = formatValue(e.target.value);
      onChange(newValue);
    },
    [formatValue, onChange],
  );

  const getPlaceholder = useCallback(() => {
    if (!focused && !value) {
      return "XX XX XX XXXX";
    }
    const placeholder = "XX XX XX XXXX";
    return placeholder.slice(value.length);
  }, [focused, value]);

  console.log("value", value);

  return (
    <div className="relative z-0 ">
      <Input
        type="text"
        name="carNumber"
        value={value}
        placeholder="Add Car Number"
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={13}
        className="uppercase z-10 my-4 w-full rounded-none placeholder:text-[14px] max-sm:placeholder:text-[12px] max-sm:text-[12px] text-[14px] placeholder:text-zinc-700 dark:placeholder:text-gray-400  border-0 border-b focus-visible:border-b-2 border-b-gray-400 focus-visible:border-b-blue-600  focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="absolute -z-1 top-[0px] inset-y-0 left-[0px] flex items-center pointer-events-none">
        {value.length > 0 && focused && (
          <span className="pl-3 max-sm:text-[12px] text-[15px]">
            {value}
            <span className="opacity-50">{getPlaceholder()}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default CarNumberPlateInput;
