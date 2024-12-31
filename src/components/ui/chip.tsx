import { X } from "lucide-react";

export function Chip({
  children,
  onClose,
  className = "",
}: {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-1 ${className}`}
    >
      <span>{children}</span>
      <button
        onClick={onClose}
        className="text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <X size={16} />
      </button>
    </div>
  );
}
