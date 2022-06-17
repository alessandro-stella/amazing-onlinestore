import {
    Button,
    FormControl,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";

import siteContext from "../siteContext";

function SelectProductQuantity({
    value,
    maxValue,
    returnQuantity,
    removeItem,
    triggerAlert,
}) {
    const [isTextField, setIsTextField] = useState("");
    const [localQuantity, setLocalQuantity] = useState(value);
    const [hasChanged, setHasChanged] = useState(false);

    const { isSmall } = useContext(siteContext);

    useEffect(() => {
        setIsTextField(value < 10 ? false : true);
        setHasChanged(false);
    }, [value]);

    function checkQuantity(quantity) {
        setHasChanged(+quantity === value ? false : true);

        if (quantity === 10) {
            setIsTextField(true);
        }

        setLocalQuantity(+quantity);
    }

    function updateQuantity() {
        if (localQuantity == 0) {
            removeItem(true);
            return;
        }

        if (localQuantity > maxValue) {
            triggerAlert();
            setLocalQuantity(+maxValue);
            setHasChanged(false);

            returnQuantity(+maxValue);
            return;
        }

        returnQuantity(localQuantity);
    }

    return (
        <div className="item-quantity__container">
            <div className="item-quantity">
                Quantity:{" "}
                {isTextField || +value >= 10 ? (
                    <TextField
                        size="small"
                        type="number"
                        value={localQuantity}
                        onChange={(e) => checkQuantity(e.target.value)}
                    />
                ) : (
                    <FormControl size="small">
                        <Select
                            value={localQuantity}
                            onChange={(e) => checkQuantity(e.target.value)}>
                            {Array(+maxValue < 10 ? +maxValue : 11)
                                .fill(0)
                                .map((_, i) => (
                                    <MenuItem value={i} key={i}>
                                        {i === 0 && "0 (remove)"}
                                        {i === 10 && "10+"}
                                        {i !== 0 && i !== 10 && i}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                )}
                {hasChanged && (
                    <>
                        {!isSmall ? (
                            <Button
                                size={isSmall ? "large" : "small"}
                                variant="contained"
                                onClick={() => updateQuantity()}>
                                {localQuantity === 0
                                    ? "Remove item"
                                    : "Update quantity"}
                            </Button>
                        ) : null}
                    </>
                )}
                <a className="remove-item" onClick={() => removeItem(true)}>
                    Remove
                </a>
            </div>
            {hasChanged && (
                <>
                    {isSmall ? (
                        <div className="update-button">
                            <Button
                                fullWidth
                                size={isSmall ? "large" : "small"}
                                variant="contained"
                                onClick={() => updateQuantity()}>
                                {localQuantity === 0
                                    ? "Remove item"
                                    : "Update quantity"}
                            </Button>
                        </div>
                    ) : null}
                </>
            )}
        </div>
    );
}

export default SelectProductQuantity;
