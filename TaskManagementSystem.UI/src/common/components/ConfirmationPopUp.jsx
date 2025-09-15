import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import CustomButton from "./CustomButton";

const ConfirmDialog = ({ open, title, message, onCancel, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title || "Confirm"}</DialogTitle>
      <DialogContent>
        <Typography>{message || "Are you sure?"}</Typography>
      </DialogContent>
      <DialogActions>
        <CustomButton onClick={onCancel} color="secondary">
          Cancel
        </CustomButton>
        <CustomButton onClick={onConfirm} color="primary" variant="contained">
          Confirm
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDialog;
