import { Button } from "@mui/material";
import axios from "axios";
import { startTransition, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import siteContext from "../../siteContext";
import AlertMessage from "../AlertMessage";
import NavBar from "../NavBar";
import ChangePassword from "./ChangePassword";
import ChangeUsername from "./ChangeUsername";

function UserInfo() {
    const {
        username,
        userId,
        isSeller,
        setUsername,
        setUserId,
        setIsSeller,
        setSearchKeyword,
        isSmall,
    } = useContext(siteContext);
    const navigate = useNavigate();

    const [userSince, setUserSince] = useState("Loading...");
    const [productsUploaded, setProductsUploaded] = useState("Loading...");
    const [purchases, setPurchases] = useState("Loading...");

    const [productsError, setProductsError] = useState(false);
    const [userSinceError, setUserSinceError] = useState(false);
    const [purchaseError, setPurchaseError] = useState(false);
    const [navigateToDeleteError, setNavigateToDeleteError] = useState(false);

    useEffect(() => {
        if (!userId) {
            navigate("/loginPage");
            return;
        }

        document.title = "Amazing - Your Amazing data";
        setSearchKeyword("");

        return () => {
            document.title = "Amazing - Login";
        };
    }, []);

    useEffect(() => {
        if (!userId) {
            navigate("/loginPage");
        } else {
            if (userId.length <= 24) {
                startTransition(() => {
                    axios
                        .post("/getSellerProducts", {
                            sellerUsername: username,
                        })
                        .then((res) => {
                            setProductsUploaded(res.data.products.length);
                        })
                        .catch((err) =>
                            setProductsError(
                                "There's been an error during the process, please try again later"
                            )
                        );

                    axios
                        .post("/getUserSince", { userId })
                        .then((res) => {
                            setUserSince(res.data.userSince);
                        })
                        .catch((err) =>
                            setUserSinceError(
                                "There's been an error during the process, please try again later"
                            )
                        );

                    axios
                        .post("/getUserOrders", { userId })
                        .then((res) => {
                            setPurchases(res.data.orders);
                        })
                        .catch((err) =>
                            setPurchaseError(
                                "There's been an error during the process, please try again later"
                            )
                        );
                });
            }
        }
    }, [userId]);

    function userLogout() {
        localStorage.removeItem("userId");

        setUsername("");
        setUserId("");
        setIsSeller("");
        setUserSince("");
        setSearchKeyword("");

        navigate("/loginPage");
    }

    async function goToDeleteAccount() {
        await axios
            .post("/getDeleteAccountToken", { userId })
            .then((res) =>
                navigate(`/deleteAccountPage/${res.data.deleteAccountToken}`)
            )
            .catch((err) =>
                setNavigateToDeleteError(
                    "There's been an error during the process, please try again later"
                )
            );
    }

    return (
        <>
            <NavBar />

            <div className="user-page">
                <div className="user-info">
                    <div className="section">
                        <div className="title">My account</div>
                        <Button
                            size={isSmall ? "large" : "small"}
                            style={{ minWidth: "30%" }}
                            variant="contained"
                            onClick={() => navigate("/userPage")}>
                            go back
                        </Button>
                    </div>
                    <div className="user-info__data-container">
                        <div className="user-info__data">
                            <div className="info-section">
                                <div className="info-section__label">
                                    Username:
                                </div>
                                <div className="info-section__value">
                                    {username}
                                </div>
                            </div>
                            <div className="info-section">
                                {!userSinceError ? (
                                    <>
                                        <div className="info-section__label">
                                            User since:
                                        </div>
                                        <div className="info-section__value">
                                            {userSince}
                                        </div>
                                    </>
                                ) : (
                                    <AlertMessage
                                        alertMessage={userSinceError}
                                    />
                                )}
                            </div>
                            <div className="info-section">
                                {!purchaseError ? (
                                    <>
                                        <div className="info-section__label">
                                            Purchases made:
                                        </div>
                                        <div className="info-section__value">
                                            {purchases === "Loading..."
                                                ? purchases
                                                : purchases.length}
                                        </div>
                                    </>
                                ) : (
                                    <AlertMessage
                                        alertMessage={purchaseError}
                                    />
                                )}
                            </div>
                            {isSeller ? (
                                <div className="info-section">
                                    {!productsError ? (
                                        <>
                                            <div className="info-section__label">
                                                Uploaded products:
                                            </div>
                                            <div className="info-section__value">
                                                {productsUploaded}
                                            </div>
                                        </>
                                    ) : (
                                        <AlertMessage
                                            alertMessage={productsError}
                                        />
                                    )}
                                </div>
                            ) : null}
                            <div className="button-group">
                                <Button
                                    size="large"
                                    variant="contained"
                                    onClick={() => userLogout()}>
                                    Logout
                                </Button>
                                <Button
                                    size="large"
                                    variant="contained"
                                    onClick={() => goToDeleteAccount()}>
                                    delete account
                                </Button>
                            </div>
                            {navigateToDeleteError && (
                                <AlertMessage
                                    className="alert-message"
                                    fullWidth
                                    alertMessage={navigateToDeleteError}
                                />
                            )}
                        </div>
                        <ChangeUsername userId={userId} />
                        <ChangePassword userId={userId} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserInfo;
