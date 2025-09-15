import * as yup from "yup";

export const loginValidation = yup.object({
  username: yup.string()
    .min(2, "Username must be at least 2 characters")
    .required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const registerValidation = yup.object({
  username: yup
    .string()
    .min(2, "Username must be at least 2 characters")
    .required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const addTaskValidation = yup.object({
  title: yup.string().required("Task title is required"),
  description: yup.string().required("Description is required"),
  status: yup.string().required("Status is required"),
  assignee: yup.string().required("Assignee is required"),
  priority: yup.string().required("Priority is required"),
});
