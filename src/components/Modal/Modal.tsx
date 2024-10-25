import React, { ReactNode } from "react";
import { cn } from "@/lib/utils"; // Optional: utility to combine class names
import { FaTimes } from "react-icons/fa";

// Props for the Modal component
interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  hideActions?: boolean; // Optionally hide footer buttons
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  hideActions = false,
}) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      )}
    >
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            className="text-gray-500 hover:text-black"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">{children}</div>

        {/* Footer (Actions) */}
        {!hideActions && (
          <div className="flex justify-end gap-4 p-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              {cancelLabel}
            </button>
            {onConfirm && (
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                {confirmLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
