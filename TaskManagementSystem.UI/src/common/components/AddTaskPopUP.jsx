import React, { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
} from "@mui/material";
import Input from "./Input";
import CustomButton from "./CustomButton";
import { addTaskValidation } from "../../utils/validation";
import { useUsers } from "../../hooks/useUsers";
import { priorities, statuses } from "../../utils/variablesConfig";
import ConfirmDialog from "./ConfirmationPopUp";

const TaskForm = ({ open, onClose, onSubmit }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { users } = useUsers();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isValid },
  } = useForm({
    resolver: yupResolver(addTaskValidation),
    defaultValues: {
      title: "",
      description: "",
      status: "",
      priority: "",
      assignee: "",
    },
    mode: "onChange",
  });

  const userOptions = useMemo(() => {
    return users?.map((u) => ({
      label: u.userName,
      id: u.id,
      email: u.email,
    }));
  }, [users]);
  const handleFormSubmit = (data) => {
    const selectedUser = userOptions.find((u) => u.label === data.assignee);
    onSubmit({
      ...data,
      assigneeID: selectedUser?.id || "",
      email: selectedUser?.email || "",
    });
     reset();
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setConfirmOpen(true);
    } else {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Task</DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Input name="title" control={control} label="Title" />
          <Input name="description" control={control} label="Description" />

          <Controller
            name="status"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                options={statuses}
                onChange={(e, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Status"
                    margin="normal"
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            )}
          />

          <Controller
            name="priority"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                options={priorities}
                onChange={(e, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Priority"
                    margin="normal"
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            )}
          />

          <Controller
            name="assignee"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                options={users}
                getOptionLabel={(option) => option.userName || ""}
                value={users.find((u) => u.userName === field.value) || null}
                onChange={(e, value) =>
                  field.onChange(value ? value.userName : "")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assignee"
                    margin="normal"
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            )}
          />
        </DialogContent>

        <DialogActions>
            <CustomButton onClick={handleCancelClick} color="secondary">
            Cancel
          </CustomButton>
          <CustomButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isDirty || !isValid}
          >
            Create Task
          </CustomButton>
        </DialogActions>
      </form>
      <ConfirmDialog
        open={confirmOpen}
        title="Discard Changes"
        message="You will lose your changes. Are you sure you want to continue?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          reset()
          setConfirmOpen(false);
          onClose();
        }}
      />
    </Dialog>
  );
};
export default TaskForm;
