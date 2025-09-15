import { toast } from "react-toastify";
import { TOAST_OPTIONS } from "./variablesConfig";

export const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#FFA7A7";
      case "Medium":
        return "#FFE7A7"; 
      case "Low":
        return "#A7FFC9"; 
      default:
        return "default"; 
    }
  };

  
export const showSuccess = (message) => {
  toast.success(message, {
    ...TOAST_OPTIONS,
    style: { backgroundColor: "#4caf50", color: "#fff" }, 
  });
};

export const showError = (message) => {
  toast.error(message, {
    ...TOAST_OPTIONS,
    style: { backgroundColor: "#f44336", color: "#fff" }, 
  });
};