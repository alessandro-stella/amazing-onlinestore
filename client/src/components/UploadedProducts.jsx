import { Button } from "@mui/material";
import axios from "axios";
import { startTransition, useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import siteContext from "../siteContext";
import AlertMessage from "./AlertMessage";
import LoadingData from "./LoadingData";
import NavBar from "./NavBar";
import ProductsContainer from "./ProductsContainer";

function UploadedProducts() {
    const navigate = useNavigate();
    const { isSmall, username, userId, setSearchKeyword } =
        useContext(siteContext);
    const [products, setProducts] = useState("loading");
    const [alertMessage, setAlertMessage] = useState("");

    const [productsDisplayed, setProductDisplayed] = useState(15);
    const [loadingMoreProducts, setLoadingMoreProducts] = useState(false);

    useEffect(() => {
        if (!userId) {
            navigate("/loginPage");
            return;
        }

        document.title = "Amazing - Your shop";
        setSearchKeyword("");
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);

        window.addEventListener("scroll", () => {
            scrolling = true;
        });

        let scrolling = false;

        let checkScrollInterval = setInterval(() => {
            if (scrolling) {
                scrolling = false;

                let documentHeight = document.body.scrollHeight;
                let currentScroll = window.scrollY + window.innerHeight;

                if (currentScroll + 100 > documentHeight) {
                    setLoadingMoreProducts(true);

                    setTimeout(() => {
                        setLoadingMoreProducts(false);

                        setProductDisplayed(
                            (productsDisplayed) => productsDisplayed + 5
                        );
                    }, 1000);
                }
            }
        }, 300);

        return () => {
            window.clearInterval(checkScrollInterval);

            window.removeEventListener("scroll", () => {
                scrolling = true;
            });
        };
    }, []);

    useEffect(() => {
        if (loadingMoreProducts) window.scrollTo(0, document.body.scrollHeight);
    }, [loadingMoreProducts]);

    useEffect(() => {
        if (!userId) {
            navigate("/loginPage");
        } else {
            if (userId.length <= 24) {
                startTransition(() => {
                    getProducts();
                });
            }
        }
    }, [userId]);

    function getProducts() {
        axios
            .post("/product/getSellerProducts", {
                sellerUsername: username,
            })
            .then((res) => {
                setProducts(res.data.products);
            })
            .catch((err) => setAlertMessage("loadingError"));
    }

    return (
        <>
            <NavBar />

            <div className="user-page">
                <div className="section">
                    <div className="title">Your products</div>

                    <Button
                        size={isSmall ? "large" : "small"}
                        style={{ minWidth: "30%" }}
                        variant="contained"
                        onClick={() => navigate("/userPage")}>
                        go back
                    </Button>
                </div>

                {alertMessage === "loadingError" ? (
                    <AlertMessage alertMessage="There's been an error during the process, please try again" />
                ) : (
                    <>
                        {products === "loading" ? (
                            <LoadingData />
                        ) : (
                            <>
                                {products.length > 0 ? (
                                    <>
                                        <ProductsContainer
                                            products={products}
                                            getProducts={getProducts}
                                            isSeller={true}
                                            disableClick={true}
                                            productsDisplayed={
                                                productsDisplayed
                                            }
                                        />

                                        {loadingMoreProducts &&
                                            productsDisplayed <
                                                products.length && (
                                                <div className="loading-more">
                                                    <LoadingData />
                                                </div>
                                            )}
                                    </>
                                ) : (
                                    <div className="no-products">
                                        You don't have any products uploaded,
                                        start growing your online shop now
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default UploadedProducts;
