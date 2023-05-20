import { FormControl, MenuItem, Select } from "@mui/material";

function SelectProductQuantity({ value, maxValue, returnQuantity }) {
    return (
        <FormControl size="small">
            <Select
                value={value}
                onChange={(e) => returnQuantity(e.target.value)}>
                {Array(+maxValue < 20 ? +maxValue : 20)
                    .fill(0)
                    .map((_, i) => (
                        <MenuItem value={i + 1} key={i + 1}>
                            {i + 1}
                        </MenuItem>
                    ))}
            </Select>
        </FormControl>
    );
}

export default SelectProductQuantity;
