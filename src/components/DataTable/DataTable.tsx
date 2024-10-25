import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

// Define the type for each column
type Column<T> = {
  label: string;
  key: keyof T;
  render?: (row: T) => ReactNode; 
};

// Define the type for each action button
type Action<T> = {
  label: string;
  icon?: React.ComponentType<{ size: number }>;
  variant?: "destructive" | "default";
  onClick: (row: T) => void;
};

// Props for the DataTable component
interface DataTableProps<T> {
  caption: string;
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[];
}

// Helper function to ensure ReactNode compatibility
const renderCellContent = (content: any): ReactNode => {
  if (content === null || content === undefined) return "—"; 
  return content.toString(); 
};

const DataTable = <T,>({
  caption,
  columns,
  data,
  actions,
}: DataTableProps<T>) => {
  return (
    <Table>
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow className="bg-[#9191911f]">
          {columns.map((col, index) => (
            <TableHead key={index}>{col.label}</TableHead>
          ))}
          {actions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col, colIndex) => (
                <TableCell key={colIndex}>
                  {col.render ? col.render(row) : renderCellContent(row[col.key])}
                </TableCell>
              ))}
              {actions && (
                <TableCell>
                  <div className="flex gap-2">
                    {actions.map((action, actionIndex) => (
                      <Button
                        key={actionIndex}
                        onClick={() => action.onClick(row)}
                        className={`flex gap-2 items-center ${
                          action.variant === "destructive" ? "bg-red-500" : "bg-[#062552]"
                        }`}
                      >
                        {action.icon && <action.icon size={15} />}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length + (actions ? 1 : 0)}
              className="text-center"
            >
              No data available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DataTable;
