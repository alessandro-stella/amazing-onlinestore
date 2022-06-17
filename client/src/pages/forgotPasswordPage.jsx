import { useContext, useEffect, useState } from "react";
import LogoBlack from "../logo/logo-black.svg?component";
import siteContext from "../siteContext";
import "../styles/forgotPasswordPage.css";

import { Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import AlertMessage from "../components/AlertMessage";

function forgotPasswordPage() {
    const { isSmall } = useContext(siteContext);

    const navigate = useNavigate();

    const emailPattern =
        /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;

    const [email, setEmail] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        document.title = "Amazing - You forgot something?";
    }, []);

    function sendResetEmail() {
        if (!emailPattern.test(email)) {
            setAlertMessage("Invalid email");

            alertTimeout = setTimeout(() => {
                setAlertMessage("");
            }, 2000);

            return;
        }

        axios
            .post("/sendResetEmail", {
                userEmail: email,
            })
            .then(() => {
                setAlertMessage(
                    "We've sent you an email with the instructions to reset your password"
                );
            })
            .catch((err) => {
                setAlertMessage(
                    "There's been an error during the process, please try again later"
                );
            });
    }

    return (
        <div className="forgot-password">
            <div className="logo-container">
                <LogoBlack />
            </div>

            <div className="forgot-password__form">
                <div className="form-title">Forgot password</div>

                <InputField
                    fieldValue={email}
                    fieldType="email"
                    fieldLabel="Your email"
                    isRequired={false}
                    setValue={setEmail}
                />

                {alertMessage && <AlertMessage alertMessage={alertMessage} />}

                {alertMessage !==
                "We've sent you an email with the instructions to reset your password" ? (
                    <Button
                        size={isSmall ? "large" : "small"}
                        fullWidth
                        variant="contained"
                        disabled={alertMessage ? true : false}
                        onClick={() => sendResetEmail()}>
                        Send recovery email
                    </Button>
                ) : null}

                <Button
                    size={isSmall ? "large" : "small"}
                    fullWidth
                    variant={alertMessage ? "contained" : "outlined"}
                    onClick={() => navigate("/loginPage")}>
                    Go back
                </Button>
            </div>
        </div>
    );
}

export default forgotPasswordPage;
