import * as React from "react";
import { cn } from "@/lib/utils";
import { FaSearch, FaTimes } from "react-icons/fa"; // Import search and clear icons

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isSearch?: boolean; // New prop to enable search input styling
  onClear?: () => void; // Optional prop for clear button functionality
}

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", isSearch = false, onClear, ...props }, ref) => {
    const [value, setValue] = React.useState<string>(props.value?.toString() || "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      props.onChange?.(e); // Call the original onChange handler if provided
    };

    const handleClear = () => {
      setValue("");
      onClear?.(); // Trigger the onClear callback if provided
    };

    return (
      <div className={cn("relative flex items-center", className)}>
        {isSearch && (
          <FaSearch className="absolute left-3 text-muted-foreground" size={16} />
        )}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            isSearch ? "pl-10 pr-8" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {isSearch && value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-muted-foreground"
          >
            <FaTimes size={16} />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
