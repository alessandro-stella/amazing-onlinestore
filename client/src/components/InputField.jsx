import { TextField } from "@mui/material";

function InputField({
    fieldValue,
    fieldType,
    fieldLabel,
    isRequired,
    setValue,
    isMultiline,
    onlyInteger,
}) {
    function handleValue(value) {
        if (onlyInteger) {
            setValue(parseInt(value, 10));
            return;
        }

        setValue(value);
    }

    return (
        <TextField
            type={fieldType}
            size="small"
            label={fieldLabel}
            variant="outlined"
            value={fieldValue}
            onChange={(e) => {
                handleValue(e.target.value);
            }}
            fullWidth
            required={isRequired}
            multiline={isMultiline ? true : false}
            rows={4}
        />
    );
}

export default InputField;
