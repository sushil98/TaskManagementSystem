import { showError, showSuccess } from "../../utils/utilsFunctions";
import apiReq from "../instance";

export async function userLogin(credentials) {
  try {
    const res = await apiReq.post("/api/Account/Login", credentials);
    const { data, message } = res.data;

    if (data?.token) {
      localStorage.setItem("token", data.token);
      showSuccess(message || "Login successful!");
    } else {
      showError(message || "Login failed");
    }

    return res.data;
  } catch (err) {
    showError("Something went wrong. Please try again.");
    throw err;
  }
}

export async function userSignup(userData) {
  try {
    const res = await apiReq.post("/api/Account/Register", userData);
    const { success, message, } = res.data;

    if (success) {
      showSuccess(message || "Registration successful!");
    } else {
      showError(message || "Registration failed");
    }

    return res.data;
  } catch (err) {
    showError("Something went wrong. Please try again.");
    throw err;
  }
}

export function userLogout() {
  localStorage.removeItem("token");
  showSuccess("Logged out successfully!");
}
