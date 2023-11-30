import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { isEmpty } from "lodash";
import { forwardRef, memo, useImperativeHandle, useState } from "react";

export const HgtDropdown = memo(forwardRef(({title, options}, ref) => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  useImperativeHandle(
    ref,
    () => ({
      currentValue: selectedValue
    }),
    [selectedValue]
  )

  return (
    <FormControl fullWidth>
      <InputLabel id="dropdown-title-id">{title}</InputLabel>
      <Select
        labelId="dropdown-title-id"
        id="dropdown-select-id"
        value={selectedValue}
        label={title}
        onChange={handleChange}
        MenuProps={{ PaperProps: { style: { maxHeight: '33%' } } }}
      >
        { !isEmpty(options) && 
          options.map(({key, label, value}) => <MenuItem key={key} value={value}>{label}</MenuItem>)
        }
      </Select>
    </FormControl>
  )
}))