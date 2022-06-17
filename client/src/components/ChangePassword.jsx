import { useContext, useState } from "react";
import siteContext from "../siteContext";
import "../styles/changePassword.css";

import { Button } from "@mui/material";
import axios from "axios";
import AlertMessage from "./AlertMessage";
import PasswordInputField from "./PasswordInputField";

function ChangePassword({ userId }) {
    const { isSmall } = useContext(siteContext);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const [alertMessage, setAlertMessage] = useState("");

    function resetAlert() {
        setTimeout(() => {
            setAlertMessage("");
        }, 2500);
    }

    function changePassword() {
        if (newPassword !== confirmNewPassword) {
            setAlertMessage("The passwords does not coincide");

            resetAlert();
            return;
        }

        if (
            newPassword.trim().length < 5 ||
            confirmNewPassword.trim().length < 5
        ) {
            setAlertMessage("The password is too short");

            resetAlert();
            return;
        }

        setAlertMessage("We're processing your request");

        axios
            .post("/privateResetPassword", {
                userId,
                currentPassword,
                newPassword,
            })
            .then((res) => {
                setAlertMessage("Password changed successfully");
                resetAlert();

                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
            })
            .catch((err) => {
                setAlertMessage(
                    err.response.data.msg === "wrong password"
                        ? "Wrong current password"
                        : "There's been an error during the process, please try again"
                );

                resetAlert();
                setCurrentPassword("");

                if (err.response.data.msg !== "wrong password") {
                    setNewPassword("");
                    setConfirmNewPassword("");
                }
            });
    }

    return (
        <div className="change-password">
            <div className="title">Change password</div>

            <PasswordInputField
                fieldLabel={"Current password"}
                fieldValue={currentPassword}
                setValue={setCurrentPassword}
                isPasswordShown={isPasswordShown}
                setIsPasswordShown={setIsPasswordShown}
                isNotRequired={true}
                notAutocomplete={true}
            />

            <PasswordInputField
                fieldLabel={"New password"}
                fieldValue={newPassword}
                setValue={setNewPassword}
                isPasswordShown={isPasswordShown}
                setIsPasswordShown={setIsPasswordShown}
                isNotRequired={true}
                notAutocomplete={true}
            />

            <PasswordInputField
                fieldLabel={"Confirm new password"}
                fieldValue={confirmNewPassword}
                setValue={setConfirmNewPassword}
                isPasswordShown={isPasswordShown}
                setIsPasswordShown={setIsPasswordShown}
                isNotRequired={true}
                notAutocomplete={true}
            />

            {alertMessage ? <AlertMessage alertMessage={alertMessage} /> : null}

            <Button
                size={isSmall ? "large" : "small"}
                variant="contained"
                onClick={() => changePassword()}>
                change password
            </Button>
        </div>
    );
}

export default ChangePassword;
