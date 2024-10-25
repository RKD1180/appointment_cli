// StatusHandle.tsx
import React from "react";

interface StatusHandleProps {
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
}

const StatusHandle: React.FC<StatusHandleProps> = ({ status }) => {
  const statusStyles = {
    pending: 'text-yellow-500',
    confirmed: 'text-green-500',
    canceled: 'text-red-500',
    completed: 'text-blue-500',
  };

  return (
    <span className={statusStyles[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusHandle;
