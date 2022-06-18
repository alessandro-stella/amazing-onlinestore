import { useContext, useState } from "react";
import siteContext from "../../siteContext";
import "../../styles/changePassword.css";

import { Button } from "@mui/material";
import axios from "axios";
import AlertMessage from "../AlertMessage";
import InputField from "../InputField";

function ChangeUsername({ userId }) {
    const { isSmall, setUsername } = useContext(siteContext);

    const [newUsername, setNewUsername] = useState("");
    const [confirmNewUsername, setConfirmNewUsername] = useState("");

    const [alertMessage, setAlertMessage] = useState("");

    function resetAlert() {
        setTimeout(() => {
            setAlertMessage("");
        }, 2500);
    }

    function changeUsername() {
        if (newUsername.trim().length <= 0) {
            setAlertMessage("The username is too short");

            resetAlert();
            return;
        }

        if (newUsername.trim() !== confirmNewUsername.trim()) {
            setAlertMessage("The usernames does not coincide");

            resetAlert();
            return;
        }

        setAlertMessage("We're processing your request");

        axios
            .post("/privateChangeUsername", {
                userId,
                newUsername,
            })
            .then((res) => {
                setAlertMessage("Username changed successfully");
                resetAlert();

                setUsername(newUsername);
                setNewUsername("");
                setConfirmNewUsername("");
            })
            .catch((err) => {
                setAlertMessage(
                    err.response.data.msg === "existing username"
                        ? "A user with this username already exists"
                        : "There's been an error during the process, please try again"
                );

                resetAlert();

                setNewUsername("");
                setConfirmNewUsername("");
            });
    }

    return (
        <div className="change-password">
            <div className="title">Change username</div>

            <InputField
                fieldValue={newUsername}
                fieldType="text"
                fieldLabel="New username"
                isRequired={true}
                setValue={setNewUsername}
            />

            <InputField
                fieldValue={confirmNewUsername}
                fieldType="text"
                fieldLabel="Confirm new username"
                isRequired={true}
                setValue={setConfirmNewUsername}
            />

            {alertMessage && <AlertMessage alertMessage={alertMessage} />}

            <Button
                size={isSmall ? "large" : "small"}
                variant="contained"
                onClick={() => changeUsername()}>
                change username
            </Button>
        </div>
    );
}

export default ChangeUsername;
