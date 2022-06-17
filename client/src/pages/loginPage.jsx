import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import siteContext from "../siteContext";

import LogoBlack from "../logo/logo-black.svg?component";
import "../styles/loginPage.css";

import { Button, ButtonGroup } from "@mui/material";
import AlertMessage from "../components/AlertMessage";
import InputField from "../components/InputField";
import PasswordInputField from "../components/PasswordInputField";

function loginPage() {
    const navigate = useNavigate();
    const { isSmall } = useContext(siteContext);

    const { userId, setUsername, setUserId, setIsSeller } =
        useContext(siteContext);

    const emailPattern =
        /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;

    const emptyStringPattern = /^$/;

    const [registerUsername, setRegisterUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [registerIsSeller, setRegisterIsSeller] = useState(false);

    const [alertMessage, setAlertMessage] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    useEffect(() => {
        if (userId) {
            navigate("/shopPage");
            return;
        }

        document.title = "Amazing - Login";
    }, []);

    async function loginUser(e) {
        setEmail((email) => email.trim());
        setPassword((password) => password.trim());

        if (
            emptyStringPattern.test(email) ||
            emptyStringPattern.test(password)
        ) {
            setAlertMessage("Missing data");

            setTimeout(() => {
                setAlertMessage("");
            }, 2500);

            return;
        }

        if (!emailPattern.test(email)) {
            setAlertMessage("Invalid email");

            setTimeout(() => {
                setAlertMessage("");
            }, 2500);

            return;
        }

        const getUserData = async (e) => {
            axios
                .post("/login", {
                    email,
                    password,
                })
                .then((res) => {
                    saveUserData(res.data.user);
                })
                .catch((err) => {
                    setAlertMessage(err.response.data.msg);

                    setTimeout(() => {
                        setAlertMessage("");
                    }, 2500);
                });
        };

        await getUserData();
    }

    function registerUser(e) {
        const testRegisterUsername = registerUsername.replace(/\s/g, "");
        const testEmail = email.replace(/\s/g, "");
        const testPassword = password.replace(/\s/g, "");
        const testConfirmPassword = confirmPassword.replace(/\s/g, "");

        if (
            emptyStringPattern.test(testEmail) ||
            emptyStringPattern.test(testPassword) ||
            emptyStringPattern.test(testConfirmPassword)
        ) {
            setAlertMessage("Missing data");

            setTimeout(() => {
                setAlertMessage("");
            }, 2500);
            return;
        }

        if (!emailPattern.test(email)) {
            setAlertMessage("Invalid email");

            setTimeout(() => {
                setAlertMessage("");
            }, 2500);
            return;
        }

        if (password !== confirmPassword) {
            setAlertMessage("The passwords does not coincide");

            setTimeout(() => {
                setAlertMessage("");
            }, 2500);
            return;
        }

        if (password.length < 5) {
            setAlertMessage("Password too short");

            setTimeout(() => {
                setAlertMessage("");
            }, 2500);
            return;
        }

        const createUser = () => {
            setRegisterUsername((username) => username.trim());
            setEmail((email) => email.trim());
            setPassword((password) => password.trim());

            const newUser = {
                username:
                    testRegisterUsername !== ""
                        ? registerUsername
                        : email.trim().split("@")[0],
                email: email,
                password: password,
                isSeller: registerIsSeller,
            };

            axios
                .post("/register", newUser)
                .then((res) => {
                    saveUserData(res.data);
                    sendWelcomeEmail(
                        newUser.username,
                        newUser.email,
                        res.data.deleteAccountToken
                    );
                })
                .catch((err) => {
                    setAlertMessage(err.response.data.msg);

                    setTimeout(() => {
                        setAlertMessage("");
                    }, 2500);
                });
        };

        createUser();
    }

    async function saveUserData(data) {
        const username = data.username;
        const userId = data._id;
        const isSeller = data.isSeller;

        if (localStorage.getItem("userId")) {
            localStorage.removeItem("userId");
        }

        const encryptUserId = async () => {
            axios
                .post("/encryptUserId", { userId })
                .then((res) => {
                    localStorage.setItem("userId", res.data.encryptedId);
                })
                .catch((err) =>
                    setAlertMessage(
                        "There's been an error during the process, please try again"
                    )
                );
        };

        await encryptUserId();

        setUsername(username);
        setUserId(userId);
        setIsSeller(isSeller);

        navigate("/shopPage");
    }

    function sendWelcomeEmail(username, userEmail, deleteAccountToken) {
        axios.post("/sendWelcomeEmail", {
            username,
            userEmail,
            deleteAccountToken,
        });
    }

    return (
        <div className="login-page">
            <div className="logo-container">
                <LogoBlack />
            </div>

            <form className="login-registration-form">
                <div className="form-title">
                    {isRegistering ? "Register" : "Login"}
                </div>

                {isRegistering ? (
                    <InputField
                        fieldValue={registerUsername}
                        fieldType="text"
                        fieldLabel="Username"
                        isRequired={false}
                        setValue={setRegisterUsername}
                    />
                ) : null}

                <InputField
                    fieldValue={email}
                    fieldType="email"
                    fieldLabel="Email"
                    isRequired={true}
                    setValue={setEmail}
                />

                <PasswordInputField
                    isPasswordShown={isPasswordShown}
                    fieldValue={password}
                    fieldLabel="Password"
                    setValue={setPassword}
                    setIsPasswordShown={setIsPasswordShown}
                />
                {!isRegistering ? (
                    <Link className="forgot-link" to="/forgotPassword">
                        Forgot password?
                    </Link>
                ) : null}

                {isRegistering ? (
                    <PasswordInputField
                        isPasswordShown={isPasswordShown}
                        fieldValue={confirmPassword}
                        fieldLabel="Confirm password"
                        setValue={setConfirmPassword}
                        setIsPasswordShown={setIsPasswordShown}
                    />
                ) : null}

                {isRegistering ? (
                    <ButtonGroup fullWidth>
                        <Button
                            size={isSmall ? "large" : "small"}
                            fullWidth
                            variant={
                                registerIsSeller ? "outlined" : "contained"
                            }
                            onClick={() => {
                                setRegisterIsSeller(false);
                            }}>
                            Only a buyer
                        </Button>

                        <Button
                            size={isSmall ? "large" : "small"}
                            fullWidth
                            variant={
                                registerIsSeller ? "contained" : "outlined"
                            }
                            onClick={() => {
                                setRegisterIsSeller(true);
                            }}>
                            Also a seller
                        </Button>
                    </ButtonGroup>
                ) : null}

                {alertMessage ? (
                    <AlertMessage alertMessage={alertMessage} />
                ) : null}

                <Button
                    size={isSmall ? "large" : "small"}
                    fullWidth
                    variant="contained"
                    onClick={() => {
                        if (isRegistering) {
                            registerUser();
                        } else {
                            loginUser();
                        }
                    }}>
                    {isRegistering ? "Register" : "Login"}
                </Button>
            </form>

            <div className="change-mode">
                <div className="change-mode__label">
                    <div className="change-mode__label-text">
                        {isRegistering ? "Already registered? " : "New user? "}
                    </div>
                </div>

                <Button
                    size={isSmall ? "large" : "small"}
                    fullWidth
                    variant="contained"
                    color="secondaryButton"
                    onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering
                        ? "Login on Amazing"
                        : "Create your Amazing account"}
                </Button>
            </div>
        </div>
    );
}

export default loginPage;
