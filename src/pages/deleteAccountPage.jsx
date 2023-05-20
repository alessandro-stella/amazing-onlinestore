import { Button } from "@mui/material";
import axios from "axios";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import InputField from "../components/InputField";

import LogoBlack from "../logo/logo-black.svg?component";
import siteContext from "../siteContext";
import "../styles/deleteAccountPage.css";

function deleteAccountPage() {
    const navigate = useNavigate();
    const { setUsername, setUserId, setIsSeller, setSearchKeyword } =
        useContext(siteContext);
    const { deleteAccountToken } = useParams();

    const [confirmWord, setConfirmWord] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        document.title = "Amazing - You want to leave us?";
    }, []);

    async function deleteAccount() {
        if (confirmWord !== "DELETE-ACCOUNT") {
            setAlertMessage("Wrong confirmation word");
            resetAlert();
            return;
        }

        await axios
            .post(`/user/deleteAccount/${deleteAccountToken}`)
            .then((res) => {
                setAlertMessage("Account deleted successfully");

                localStorage.removeItem("userId");

                setUsername("");
                setUserId("");
                setIsSeller("");
                setSearchKeyword("");
            })
            .catch((err) => {
                setAlertMessage(
                    err.response.data.msg === "no user found"
                        ? "The link is not valid"
                        : "There's been an error during the process, please try again"
                );
            });
    }

    function resetAlert() {
        setTimeout(() => {
            setAlertMessage("");
        }, 2500);
    }

    return (
        <div className="delete-account-page">
            <div className="logo-container">
                <LogoBlack />
            </div>

            <form className="delete-account-form">
                <div className="form-title">Delete account</div>

                <div className="delete-account-form__message">
                    We are really sorry that you want to delete your account. If
                    you are sure of your choice, as a confirmation word, write{" "}
                    <br /> "<strong>DELETE-ACCOUNT</strong>"
                </div>

                <InputField
                    fieldValue={confirmWord}
                    fieldType="text"
                    fieldLabel="Confirmation word"
                    setValue={setConfirmWord}
                />

                {alertMessage && <AlertMessage alertMessage={alertMessage} />}

                {alertMessage !== "Account deleted successfully" && (
                    <Button
                        fullWidth
                        variant="contained"
                        disabled={alertMessage ? true : false}
                        onClick={() => deleteAccount()}>
                        delete my account
                    </Button>
                )}

                <Button
                    fullWidth
                    variant={
                        alertMessage === "Account deleted successfully"
                            ? "contained"
                            : "outlined"
                    }
                    onClick={() => navigate("/loginPage")}>
                    go back
                </Button>
            </form>
        </div>
    );
}

export default deleteAccountPage;
