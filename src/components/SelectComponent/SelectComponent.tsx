import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Adjust the import path based on your project structure

// Define the type for option
interface Option {
  value: string;
  label: string;
}

// Props for the ReusableSelect component
interface ReusableSelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void; // Callback for when an option is selected
  selectedValue?: string; // Current selected value
}

const SelectComponent: React.FC<ReusableSelectProps> = ({ options, placeholder, onChange, selectedValue }) => {
  return (
    <Select onValueChange={onChange} value={selectedValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectComponent;
