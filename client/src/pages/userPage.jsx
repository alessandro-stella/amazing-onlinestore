import axios from "axios";
import { startTransition, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import siteContext from "../siteContext";

import NavBar from "../components/NavBar";
import "../styles/userPage.css";

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

    const { userId, isSeller, setSearchKeyword } = useContext(siteContext);

    useEffect(() => {
        if (!userId) {
            navigate("/loginPage");
            return;
        }

        document.title = "Amazing - Personal Page";
        setSearchKeyword("");
    }, []);

    function navigateTo(page) {
        navigate(`/userPage/${page}`);
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
                </>
            </div>
        </>
    );
}

export default userPage;
