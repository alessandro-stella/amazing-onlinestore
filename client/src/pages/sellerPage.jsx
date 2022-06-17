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

    useEffect(() => {
        const getData = async () => {
            axios
                .post("/getSellerProducts", { sellerUsername })
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
                            <ProductsContainer products={products} />
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default sellerPage;
