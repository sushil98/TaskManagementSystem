import { useState } from "react";
import {
  Popover,
  Checkbox,
  FormControlLabel,
  Box,
  Tooltip,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { FILTER_FIELDS } from "../../utils/variablesConfig";

const PopoverFilter = ({ selected = [], onChange }) => {
  const [open, setOpen] = useState(null);
  const handleOpen = (e) => setOpen(e.currentTarget);
  const handleClose = () => setOpen(null);

  return (
    <>
      <Tooltip title="Filters">
        <img src="Filter.svg" onClick={handleOpen}></img>
        {/* <FilterList  /> */}
      </Tooltip>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Box p={2} display="flex" flexDirection="column">
          {FILTER_FIELDS.map((field) => (
            <FormControlLabel
              key={field}
              control={
                <Checkbox
                  checked={selected.includes(field)}
                  onChange={() => onChange(field)}
                />
              }
              label={field.charAt(0).toUpperCase() + field.slice(1)}
            />
          ))}
        </Box>
      </Popover>
    </>
  );
};

export default PopoverFilter;
