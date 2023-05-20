import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    FormControl, IconButton, InputAdornment, InputLabel,
    OutlinedInput
} from "@mui/material";

function PasswordInputField({
    isPasswordShown,
    fieldValue,
    fieldLabel,
    setValue,
    setIsPasswordShown,
    isNotRequired,
    notAutocomplete,
}) {
    return (
        <FormControl
            fullWidth
            size="small"
            required={isNotRequired === true ? null : true}>
            <InputLabel>{fieldLabel}</InputLabel>
            <OutlinedInput
                type={isPasswordShown ? "text" : "password"}
                value={fieldValue}
                onChange={(e) => {
                    setValue((fieldValue) => e.target.value);
                }}
                inputProps={{
                    autoComplete: "new-password",
                }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() => setIsPasswordShown(!isPasswordShown)}
                            size="small">
                            <FontAwesomeIcon
                                icon={isPasswordShown ? faEye : faEyeSlash}
                            />
                        </IconButton>
                    </InputAdornment>
                }
                label={fieldLabel}
            />
        </FormControl>
    );
}

export default PasswordInputField;
