import { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import "../styles/sellerPage.css";

import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@mui/material";
import LoadingData from "../components/LoadingData";
import ProductsContainer from "../components/ProductsContainer";
import siteContext from "../siteContext";

function sellerPage() {
    const navigate = useNavigate();

    const { sellerUsername } = useParams();
    const { userId } = useContext(siteContext);

    const [products, setProducts] = useState("Loading...");
    const [sellerId, setSellerId] = useState("");

    const [productsDisplayed, setProductDisplayed] = useState(15);
    const [loadingMoreProducts, setLoadingMoreProducts] = useState(false);

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
        const getData = async () => {
            axios
                .post("/product/getSellerProducts", { sellerUsername })
                .then((res) => {
                    setSellerId(res.data.sellerId);
                    setProducts(res.data.products);
                })
                .catch((err) => navigate("/page404"));
        };

        getData();

        document.title = "Amazing - " + sellerUsername;
    }, [sellerUsername]);

    return (
        <>
            <NavBar />

            <div className="seller-page">
                <div className="seller-page__info-container">
                    <div className="seller-page__seller">
                        Seller username: {sellerUsername}
                    </div>

                    <div className="seller-page__products">
                        {products !== "Loading..." && sellerId === userId
                            ? "You are the seller - "
                            : null}
                        Products currently available:{" "}
                        {products === "Loading..." ? products : products.length}
                    </div>
                </div>

                {products === "Loading..." ? (
                    <LoadingData />
                ) : (
                    <>
                        {products.length === 0 ? (
                            <div className="no-products">
                                <div className="title">
                                    No products uploaded yet!
                                </div>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    style={{ maxWidth: "30%" }}
                                    onClick={() => navigate("/shopPage")}>
                                    go back
                                </Button>
                            </div>
                        ) : (
                            <>
                                <ProductsContainer
                                    products={products}
                                    productsDisplayed={productsDisplayed}
                                />

                                {loadingMoreProducts &&
                                    productsDisplayed < products.length && (
                                        <div className="loading-more">
                                            <LoadingData />
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

export default sellerPage;
