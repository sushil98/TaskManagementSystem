import * as signalR from "@microsoft/signalr";
import { BASE_URL } from "../utils/variablesConfig";

let connection;

export const startTaskWS = (onTaskUpdate) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${BASE_URL}/liveTaskStatus`)
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveTaskUpdate", (taskId, status) => {
    console.log("Task updated:", taskId, status);
    if (onTaskUpdate) onTaskUpdate(taskId, status);
  });

  connection
    .start()
    .then(() => console.log("SignalR connected!"))
    .catch((err) => console.error("SignalR connection error:", err));

  return connection;
};

export const stopTaskWS = () => {
  if (connection) connection.stop();
};


export const updateTaskStatus = async (taskId, status) => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    try {
      await connection.invoke("UpdateTaskStatus", taskId, status); 
      console.log("WS Task update sent:", taskId, status);
    } catch (err) {
      console.error("Error sending WS task update:", err);
    }
  } else {
    console.warn("WS connection not ready to send");
  }
};
