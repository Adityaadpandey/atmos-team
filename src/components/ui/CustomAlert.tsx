import clsx from "clsx";
import { useEffect, useState } from "react";

// Define alert type for props
interface CustomAlertProps {
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning"; // alert types
  onClose: () => void;
}

// alert types to styles color scheme
const alertStyles = {
  success: "bg-background text-primary-foreground",
  error: "bg-destructive text-destructive-foreground",
  info: "bg-accent text-accent-foreground",
  warning: "bg-secondary text-secondary-foreground",
};

const CustomAlert = ({ title, message, type, onClose }: CustomAlertProps) => {
  const [show, setShow] = useState(true);
  const [timeLeft, setTimeLeft] = useState(5); // 5 seconds countdown
  const [progress, setProgress] = useState(100); // Track progress for the progress bar

  // Countdown timer for 5 seconds with smooth progress
  useEffect(() => {
    if (timeLeft > 0 && show) {
      const countdown = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        setProgress((prevProgress) => prevProgress - 20); // Adjust progress
      }, 1000); // Update every second

      return () => clearInterval(countdown); // Cleanup interval
    } else if (timeLeft === 0) {
      handleClose();
    }
  }, [timeLeft, show]);

  const handleClose = () => {
    setShow(false); // Fade out the alert
    setTimeout(() => {
      onClose();
    }, 300); // Match transition duration
  };

  return (
    <div
      className={clsx(
        "fixed z-50 w-80 rounded-lg p-5 shadow-lg transition-transform duration-300",
        show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0", // Slide-out effect
        "bottom-4 right-4",
        alertStyles[type], // Apply styles based on alert type
        "animate-slide-in bg-opacity-90", // Smooth opacity and slide-in animation
      )}
      role="alert" // Make it accessible for screen readers
    >
      <div className="flex items-center justify-between space-x-4">
        <div>
          <strong className="text-xl font-medium text-primary-foreground">
            {title}
          </strong>
          <p className="mt-1 text-sm text-opacity-80">{message}</p>
        </div>
        <button
          className="text-2xl text-white hover:text-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          onClick={() => {
            setShow(false);
            onClose();
          }}
          aria-label="Close alert"
        >
          &times;
        </button>
      </div>

      {/* Countdown Progress Bar with Gradient */}
      <div
        className={clsx("mt-3 h-1 rounded-full bg-opacity-20", {
          "bg-muted": type !== "error", // Default muted background for non-error types
          "bg-destructive": type === "error", // Destructive background for error
        })}
      >
        <div
          className={clsx("h-full rounded-full", {
            "bg-gradient-to-r from-primary to-accent": type === "success", // Success gradient
            "bg-gradient-to-r from-blue-500 to-primary": type === "info", // Info gradient
            "bg-gradient-to-r from-yellow-400 to-accent": type === "warning", // Warning gradient
            "bg-gradient-to-r from-white to-red-700": type === "error", // Error gradient
          })}
          style={{
            width: `${progress}%`, // Update width based on progress
            transition: "width 1s linear", // Smooth transition
          }}
        />
      </div>
    </div>
  );
};

export default CustomAlert;