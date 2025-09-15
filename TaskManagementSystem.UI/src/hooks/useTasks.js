import { useState, useEffect, useCallback } from "react";
import { getAllTasks } from "../api/services/taskService";
import { startTaskWS, stopTaskWS } from "../ws/wsConfig";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllTasks();
      if (res.success) {
        setTasks(res.data);
        setError(null);
      } else {
        setError(res.message || "Failed to fetch tasks");
      }
    } catch (err) {
      setError(err.message || "API error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();

    startTaskWS((taskId, status) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status } : task
        )
      );
    });

    return () => {
      stopTaskWS();
    };
  }, [fetchTasks]);

  return { tasks, loading, error, refetchTasks: fetchTasks };
}
