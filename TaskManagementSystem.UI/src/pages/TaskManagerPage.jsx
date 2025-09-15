import { useState, useMemo } from "react";
import styles from "./TaskManager.module.css";
import {
  Box,
  Paper,
  Typography,
  InputBase,
  Autocomplete,
  TextField,
  Tooltip,
  Chip,
} from "@mui/material";
import { Add, Delete, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import CustomButton from "../common/components/CustomButton";
import TaskForm from "../common/components/AddTaskPopUP";
import { useUsers } from "../hooks/useUsers";
import {
  createTask,
  deleteTask,
  updateTask,
} from "../api/services/taskService";
import ConfirmDialog from "../common/components/ConfirmationPopUp";
import { useTasks } from "../hooks/useTasks";
import { getPriorityColor } from "../utils/utilsFunctions";
import { userLogout } from "../api/services/authService";
import {
  FILTER_FIELDS,
  priorities,
  // statusColors,
  statuses,
} from "../utils/variablesConfig";
import { useNavigate } from "react-router-dom";
import { updateTaskStatus } from "../ws/wsConfig";
import PopoverFilter from "../common/components/PopoverFilter";
import PageSpinner from "../common/components/PageSpinner";

////css

const TaskManager = () => {
  const navigate = useNavigate();
  const { users } = useUsers();
  const { tasks, refetchTasks, loading: taskLoading } = useTasks();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [sortOrder, setSortOrder] = useState({});
  const [searchValues, setSearchValues] = useState({});
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [editingField, setEditingField] = useState({
    taskId: null,
    field: null,
  });
  const [tempValue, setTempValue] = useState("");
  const [searchFilters, setSearchFilters] = useState(
    statuses.reduce((acc, s) => {
      acc[s] = FILTER_FIELDS;
      return acc;
    }, {})
  );

  const handleFilterChange = (status, field) => {
    setSearchFilters((prev) => {
      const current = prev[status] || [];
      return {
        ...prev,
        [status]: current.includes(field)
          ? current.filter((f) => f !== field)
          : [...current, field],
      };
    });
  };

  const handleSortToggle = (status) => {
    setSortOrder((prev) => {
      const newOrder = prev[status] === "asc" ? "desc" : "asc";
      return { ...prev, [status]: newOrder };
    });
  };

  const tasksByStatus = useMemo(() => {
    return statuses.reduce((acc, status) => {
      let filtered = tasks.filter((t) => t.status === status);

      if (sortOrder[status]) {
        filtered = [...filtered].sort((a, b) => {
          if (sortOrder[status] === "asc") {
            return a.title.localeCompare(b.title);
          } else {
            return b.title.localeCompare(a.title);
          }
        });
      }

      acc[status] = filtered;
      return acc;
    }, {});
  }, [tasks, sortOrder]);

  const startEditing = (taskId, field, initialValue) => {
    setEditingField({ taskId, field });
    setTempValue(initialValue || "");
  };

  const saveEditing = (taskId) => {
    handleUpdateTask(taskId, { [editingField.field]: tempValue });
    setEditingField({ taskId: null, field: null });
    setTempValue("");
  };

  const handleUpdateTask = async (taskId, updatedFields) => {
    try {
      setLoading(true);
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      const taskToUpdate = {
        ...task,
        ...updatedFields,
        email: updatedFields.assigneeEmail || task.assigneeEmail,
      };
      const res = await updateTask(taskId, taskToUpdate);
      if (res.success) {
        if (updatedFields.status) {
          updateTaskStatus(taskId, updatedFields.status);
        }
        await refetchTasks();
        setEditingField({ taskId: null, field: null });
        setLoading(false);
      } else {
        console.error("Failed to update task", res.message);
        setLoading(false);
      }
    } catch (err) {
      console.error("API error", err);
      setLoading(false);
    }
  };

  const handleCreateTask = async (data) => {
    try {
      setLoading(true);
      const res = await createTask(data);
      if (res.success) {
        refetchTasks();
        setOpen(false);
        setLoading(false);
      } else {
        console.error("Failed to create task", res.message);
        setLoading(false);
      }
    } catch (err) {
      console.error("API error", err);
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      setLoading(true);
      const res = await deleteTask(taskToDelete.id);
      if (res.success) {
        refetchTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
        setLoading(false);
      } else {
        console.error("Failed to delete task", res.message);
        setLoading(false);
      }
    } catch (err) {
      console.error("API error", err);
      setLoading(false);
    } finally {
      setConfirmOpen(false);
      setTaskToDelete(null);
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setTaskToDelete(null);
  };
  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setConfirmOpen(true);
  };

  const handleSearchChange = (status, value) => {
    setSearchValues((prev) => ({ ...prev, [status]: value }));
  };

  const handleLogout = () => {
    console.log("Logged out");
    userLogout();
    navigate("/login");
  };

  const handleDragStart = (taskId) => {
    setDraggedTaskId(taskId);
  };

  const handleDrop = async (newStatus) => {
    if (!draggedTaskId) return;
    const task = tasks.find((t) => t.id === draggedTaskId);
    if (!task) return;
    setLoading(true);

    const payload = {
      ...task,
      status: newStatus,
      email: task.assigneeEmail,
    };
    try {
      const res = await updateTask(task.id, payload);
      if (res.success) {
        refetchTasks();
        setLoading(false);
      } else {
        console.error("Failed to update task", res.message);
        setLoading(false);
      }
    } catch (err) {
      console.error("API error", err);
      setLoading(false);
    } finally {
      setDraggedTaskId(null);
      setLoading(false);
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.addButtonBox}>
        <CustomButton
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          fullWidth={false}
          className={styles.addtaskButton}
        >
          Add Task
        </CustomButton>

        <CustomButton
          variant="contained"
          onClick={handleLogout}
          fullWidth={false}
          className={styles.addtaskButton}
        >
          log out
        </CustomButton>
      </Box>

      <Box className={styles.maincontainer}>
        {statuses.map((status) => (
          <Paper
            key={status}
            className={styles.statusbox}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(status)}
            // className={styles.statusbox}
          >
            <Box className={styles.outerflex}>
              <div className={styles.inlineflex}>
                <img
                  className={styles.statusicon}
                  src={
                    status == "Done"
                      ? "Completed.svg"
                      : status == "InProgress"
                      ? "In Progress.svg"
                      : "Pending Icon.svg"
                  }
                ></img>

                <Typography className={styles.statusTitle}>{status}</Typography>
              </div>
              <Box className={styles.inlineflex}>
                <TextField
                  placeholder="Search..."
                  size="small"
                  value={searchValues[status] || ""}
                  onChange={(e) => handleSearchChange(status, e.target.value)}
                  sx={{ width: "180px" }}
                />
                <Tooltip
                  title={
                    sortOrder[status] === "asc"
                      ? "Ascending by title"
                      : "Descending by title"
                  }
                >
                  <CustomButton
                    onClick={() => handleSortToggle(status)}
                    fullWidth={false}
                    className={styles.sortButton}
                  >
                    {sortOrder[status] === "asc" ? (
                      <img src="sort-down.svg"></img>
                    ) : (
                      <img src="sort-up.svg"></img>
                    )}
                  </CustomButton>
                </Tooltip>
                <PopoverFilter
                  selected={searchFilters[status]}
                  onChange={(field) => handleFilterChange(status, field)}
                />
              </Box>
            </Box>

            {tasksByStatus[status]
              ?.filter((task) => {
                const searchText = (searchValues[status] || "").toLowerCase();
                if (!searchText) return true;

                const fields = searchFilters[status] || [];
                return fields.some((field) => {
                  const value = task[field] || "";
                  return String(value).toLowerCase().includes(searchText);
                });
              })
              .map((task) => (
                <Paper
                  key={task.id}
                  className={styles.taskCard}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                >
                  {editingField.taskId === task.id &&
                  editingField.field === "title" ? (
                    <InputBase
                      value={tempValue}
                      autoFocus
                      onChange={(e) => setTempValue(e.target.value)}
                      onBlur={() => saveEditing(task.id)}
                      className={styles.editingInput}
                    />
                  ) : (
                    <Typography
                      className={styles.taskTitle}
                      onClick={() => startEditing(task.id, "title", task.title)}
                    >
                      {task.title}
                    </Typography>
                  )}

                  {editingField.taskId === task.id &&
                  editingField.field === "description" ? (
                    <InputBase
                      value={tempValue}
                      autoFocus
                      onChange={(e) => setTempValue(e.target.value)}
                      onBlur={() => saveEditing(task.id)}
                      className={styles.editingInput}
                      fullWidth
                    />
                  ) : (
                    <Typography
                      className={styles.taskDescription}
                      onClick={() =>
                        startEditing(task.id, "description", task.description)
                      }
                    >
                   {task.description}
                    </Typography>
                  )}

                  {editingField.taskId === task.id &&
                  editingField.field === "status" ? (
                    <Autocomplete
                      options={statuses}
                      value={task.status}
                      onChange={(e, value) =>
                        handleUpdateTask(task.id, { status: value })
                      }
                      onBlur={() =>
                        setEditingField({ taskId: null, field: null })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          autoFocus
                          className={styles.editingInput}
                        />
                      )}
                    />
                  ) : (
                    <Typography
                      onClick={() =>
                        setEditingField({ taskId: task.id, field: "status" })
                      }
                    >
                      <strong>Status:</strong> {task.status}
                    </Typography>
                  )}

                  {editingField.taskId === task.id &&
                  editingField.field === "priority" ? (
                    <Autocomplete
                      options={priorities}
                      value={task.priority}
                      onChange={(e, value) =>
                        handleUpdateTask(task.id, { priority: value })
                      }
                      onBlur={() =>
                        setEditingField({ taskId: null, field: null })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          autoFocus
                          className={styles.editingInput}
                        />
                      )}
                    />
                  ) : (
                    <Box
                    className={styles.priorityrow}
                      onClick={() =>
                        setEditingField({ taskId: task.id, field: "priority" })
                      }
                      sx={{ cursor: "pointer" }}
                    >
                      <Typography mr={1}>
                        <strong>Priority:</strong>
                      </Typography>
                      <Typography className={styles.priorityTag}
                        mr={1}
                        sx ={{background : `${getPriorityColor(task.priority)} !important`}}
                      >
                        {task.priority}
                      </Typography>
                    </Box>
                  )}

                  {editingField.taskId === task.id &&
                  editingField.field === "assignee" ? (
                    <Autocomplete
                    
                      options={users || []}
                      getOptionLabel={(option) => option.userName}
                      value={
                        users.find((u) => u.id === task.assigneeID) || null
                      }
                      onChange={(e, value) =>
                        handleUpdateTask(task.id, {
                          assigneeID: value?.id,
                          assigneeEmail: value?.email,
                        })
                      }
                      onBlur={() =>
                        setEditingField({ taskId: null, field: null })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          autoFocus
                          className={styles.editingInput}
                        />
                      )}
                    />
                  ) : (
                    <Typography
                    className={styles.assigneerow}
                      onClick={() =>
                        setEditingField({ taskId: task.id, field: "assignee" })
                      }
                    >
                      <img src="Assignee.svg"></img>
                      {users.find((u) => u.id === task.assigneeID)?.userName ||
                        ""}
                    </Typography>
                  )}

                  <Box>
                    <CustomButton
                      onClick={() => handleDeleteClick(task)}
                      size="small"
                      fullWidth={false}
                      className={styles.deleteButton}
                    >
                      <img src="remove.svg"></img>
                    </CustomButton>
                  </Box>
                </Paper>
              ))}
          </Paper>
        ))}
      </Box>

      <TaskForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateTask}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Task"
        message={`Are you sure you want to delete task?`}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
      <PageSpinner open={taskLoading || loading} />
    </Box>
  );
};

export default TaskManager;
