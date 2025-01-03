"use client";
import Custom_Alert from "@/components/ui/CustomAlert"; // Import your custom alert component
import { createContext, ReactNode, useContext, useState } from "react";

// Define alert types
type AlertType = "success" | "error" | "info" | "warning";

// Context types
interface AlertContextType {
  showAlert: (title: string, message: string, type: AlertType) => void;
  alertData: { title: string; message: string; type: AlertType; show: boolean };
  hideAlert: () => void;
}

// Create context
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Alert provider
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    type: "info" as AlertType, // Default type
    show: false,
  });

  const showAlert = (
    title: string,
    message: string,
    type: AlertType = "info",
  ) => {
    setAlertData({ title, message, type, show: true });
  };

  const hideAlert = () => {
    setAlertData({ ...alertData, show: false });
  };

  return (
    <AlertContext.Provider value={{ showAlert, alertData, hideAlert }}>
      {children}
      {alertData.show && (
        <Custom_Alert
          title={alertData.title}
          message={alertData.message}
          type={alertData.type}
          onClose={hideAlert}
        />
      )}
    </AlertContext.Provider>
  );
};

// Custom hook to use the alert context
export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
