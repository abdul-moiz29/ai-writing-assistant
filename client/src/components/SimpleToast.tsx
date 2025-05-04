import React, { useEffect } from "react";

export interface SimpleToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number; // in ms
}

export const SimpleToast: React.FC<SimpleToastProps> = ({
  message,
  show,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity">
      {message}
    </div>
  );
}; 