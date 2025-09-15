import React from "react";
import { Backdrop, CircularProgress, Box } from "@mui/material";

const PageSpinner = ({ open = false })=> {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1000,
        backdropFilter: "blur(2px)",
      }}
      open={open}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <CircularProgress />
      </Box>
    </Backdrop>
  );
}
export default PageSpinner;
