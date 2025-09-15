import apiReq from "../instance";

export async function getAllTasks() {
  const res = await apiReq.get("/api/TaskManager/GetTasks");
  return res.data;
}

export async function createTask(task) {
  const res = await apiReq.post("/api/TaskManager/CreateTask", task);
  return res.data;
}

export async function updateTask(taskId, updatedTask) {
  const res = await apiReq.put(`/api/TaskManager/UpdateTask/${taskId}`, updatedTask);
  return res.data;
}

export async function deleteTask(taskId) {
  const res = await apiReq.delete(`/api/TaskManager/DeleteTask/${taskId}`);
  return res.data;
}

export async function getAllUsers() {
  const res = await apiReq.get("/api/Account/GetAllUsers");
  return res.data; 
}