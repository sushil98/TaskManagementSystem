import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

const Input = ({ name, control, label, type = "text", rules = {} }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          type={type}
          fullWidth
          margin="normal"
          error={!!error}
          helperText={error ? error.message : ""}
        />
      )}
    />
  );
};

export default Input;
