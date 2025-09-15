export const BASE_URL = "https://localhost:7024";

export const statuses = ["Pending", "InProgress", "Done"];
export const priorities = ["Low", "Medium", "High"];

export const statusImg = {
  Pending: "Assignee.svg",
  InProgress: "Calendar (3).svg",
  Done: "#A5D6A7",
};

export const FILTER_FIELDS = [
  "title",
  "description",
  "status",
  "priority",
  "assignee",
];

export const TOAST_OPTIONS = {
  position: "bottom-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};
