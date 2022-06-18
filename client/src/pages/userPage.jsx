import axios from "axios";
import { startTransition, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import siteContext from "../siteContext";

import InputField from "../components/InputField";
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import ProductsContainer from "../components/ProductsContainer";
import "../styles/userPage.css";

import { Button, TextField } from "@mui/material";
import AlertMessage from "../components/AlertMessage";
import ChangeUsername from "../components/userPage/ChangeUsername";
import LoadingData from "../components/LoadingData";
import SelectCategory from "../components/SelectCategory";
import ChangePassword from "../components/userPage/ChangePassword";

import {
    faArrowUpFromBracket as uploadIcon,
    faBagShopping as ordersIcon,
    faFileLines as userIcon,
    faShop as shopIcon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SiteInfo from "../components/SiteInfo";

function userPage() {
    const navigate = useNavigate();

    const { username, userId, isSeller, setSearchKeyword, isSmall } =
        useContext(siteContext);

    const [products, setProducts] = useState("loading");
    const [purchases, setPurchases] = useState("Loading...");

    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        if (!userId) {
            navigate("/loginPage");
            return;
        }

        document.title = "Amazing - Personal Page";
        setSearchKeyword("");
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
                            setProducts(res.data.products);
                        })
                        .catch((err) => console.log(err));
                });
            }
        }
    }, [userId]);

    function navigateTo(page) {
        window.location = `/userPage/${page}`;
    }

    return (
        <>
            <NavBar />

            <div className="user-page">
                <>
                    <div className="select-section__container">
                        <div
                            className="select-section"
                            onClick={() => navigateTo("userInfo")}>
                            <div className="icon-container">
                                <FontAwesomeIcon
                                    icon={userIcon}
                                    size="2x"
                                    className="fa-fw"
                                />
                            </div>

                            <div className="section-text__container">
                                <div className="section-title">
                                    Account information
                                </div>
                                <div className="section-text">
                                    See you account personal data and change
                                    them, if you want to
                                </div>
                            </div>
                        </div>

                        <div
                            className="select-section"
                            onClick={() => navigateTo("orderHistory")}>
                            <div className="icon-container">
                                <FontAwesomeIcon
                                    icon={ordersIcon}
                                    size="2x"
                                    className="fa-fw"
                                />
                            </div>

                            <div className="section-text__container">
                                <div className="section-title">
                                    Order history
                                </div>
                                <div className="section-text">
                                    Check your previous orders and buy again the
                                    items you liked the most
                                </div>
                            </div>
                        </div>

                        {isSeller ? (
                            <>
                                <div
                                    className="select-section"
                                    onClick={() => navigateTo("uploadProduct")}>
                                    <div className="icon-container">
                                        <FontAwesomeIcon
                                            icon={uploadIcon}
                                            size="2x"
                                            className="fa-fw"
                                        />
                                    </div>

                                    <div className="section-text__container">
                                        <div className="section-title">
                                            Upload a product
                                        </div>
                                        <div className="section-text">
                                            Upload a new product that you would
                                            like to sell on our site
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="select-section"
                                    onClick={() =>
                                        navigateTo("uploadedProducts")
                                    }>
                                    <div className="icon-container">
                                        <FontAwesomeIcon
                                            icon={shopIcon}
                                            size="2x"
                                            className="fa-fw"
                                        />
                                    </div>

                                    <div className="section-text__container">
                                        <div className="section-title">
                                            Uploaded products
                                        </div>
                                        <div className="section-text">
                                            Check which products you have on
                                            sale, and replenish inventory when
                                            they run out
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>

                    <SiteInfo />

                    <>
                        <div className="section">
                            <div className="title">Your products</div>

                            {products.length > 0 ? (
                                <Button
                                    size={isSmall ? "large" : "small"}
                                    style={{ minWidth: "30%" }}
                                    variant="contained"
                                    onClick={() => setSelectedSection("")}>
                                    go back
                                </Button>
                            ) : null}
                        </div>

                        {products === "loading" ? (
                            <LoadingData />
                        ) : (
                            <>
                                {products.length > 0 ? (
                                    <>
                                        <ProductsContainer
                                            products={products}
                                            isSeller={true}
                                            disableClick={true}
                                        />
                                    </>
                                ) : (
                                    <div className="no-products">
                                        You don't have any products uploaded
                                    </div>
                                )}
                            </>
                        )}
                    </>

                    <>
                        <div>order history</div>

                        {purchases === "Loading..." ? (
                            <LoadingData />
                        ) : (
                            <>
                                {purchases.length === 0 ? (
                                    <h1>No purchases</h1>
                                ) : (
                                    <h1>{purchases.length}</h1>
                                )}
                            </>
                        )}

                        <Button
                            size={isSmall ? "large" : "small"}
                            style={{ minWidth: "30%" }}
                            variant="contained"
                            onClick={() => setSelectedSection("")}>
                            go back
                        </Button>
                    </>
                </>
            </div>
        </>
    );
}

export default userPage;
