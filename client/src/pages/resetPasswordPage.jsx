import { useContext, useState } from "react";
import LogoBlack from "../logo/logo-black.svg?component";
import "../styles/forgotPasswordPage.css";

import { Button } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import PasswordInputField from "../components/PasswordInputField";
import siteContext from "../siteContext";

function resetPassword() {
    const navigate = useNavigate();

    const { resetPasswordToken } = useParams();
    const { isSmall } = useContext(siteContext);

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const [alertMessage, setAlertMessage] = useState("");

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

        axios
            .post(`/resetPassword/${resetPasswordToken}`, {
                password: newPassword,
            })
            .then((res) => {
                setAlertMessage("Password changed successfully");
            })
            .catch((err) => {
                setAlertMessage(
                    "The link is wrong or expired, please try again"
                );
            });
    }

    function resetAlert() {
        setTimeout(() => {
            setAlertMessage("");
        }, 2500);
    }

    return (
        <div className="reset-password">
            <div className="logo-container">
                <LogoBlack />
            </div>

            <div className="reset-password__form">
                <div className="form-title">Reset password</div>

                <PasswordInputField
                    fieldValue={newPassword}
                    fieldLabel="New password"
                    setValue={setNewPassword}
                    isPasswordShown={isPasswordShown}
                    setIsPasswordShown={setIsPasswordShown}
                    notAutocomplete={true}
                />

                <PasswordInputField
                    fieldValue={confirmNewPassword}
                    fieldLabel="Confirm new password"
                    setValue={setConfirmNewPassword}
                    isPasswordShown={isPasswordShown}
                    setIsPasswordShown={setIsPasswordShown}
                    notAutocomplete={true}
                />

                {alertMessage ? (
                    <AlertMessage alertMessage={alertMessage} />
                ) : null}

                {alertMessage === "Password changed successfully" ? (
                    <Button
                        size={isSmall ? "large" : "small"}
                        fullWidth
                        variant="contained"
                        onClick={() => navigate("/loginPage")}>
                        Go back
                    </Button>
                ) : (
                    <Button
                        size={isSmall ? "large" : "small"}
                        fullWidth
                        variant="contained"
                        disabled={
                            alertMessage &&
                            alertMessage !== "Password changed successfully"
                                ? true
                                : false
                        }
                        onClick={() => changePassword()}>
                        Change password
                    </Button>
                )}
            </div>
        </div>
    );
}

export default resetPassword;
