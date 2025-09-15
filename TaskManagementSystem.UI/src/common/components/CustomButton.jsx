import { Button } from "@mui/material";

export default function CustomButton({
  children,
  onClick,
  type = "button",
  color = "primary",
  variant = "contained",
  fullWidth = true,
  ...props
}) {
  return (
    <Button
      type={type}
      onClick={onClick}
      color={color}
      variant={variant}
      fullWidth={fullWidth}
      sx={{
        mt: 2,
        background: "linear-gradient(to bottom, #2c3e50, #1a1a1a)",
        color: "white",
        fontWeight: "bold",
        borderRadius: "8px",
        padding: "10px 0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
        "&:hover": {
          background: "linear-gradient(to bottom, #34495e, #111)",
        },
        "&.Mui-disabled": {
          background: "linear-gradient(to bottom, #b0b0b0, #8d8d8d)",
          color: "#e0e0e0",
          boxShadow: "none",
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
