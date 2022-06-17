import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import siteContext from "../siteContext";
import "../styles/cartPage.css";

import { Button } from "@mui/material";
import axios from "axios";
import AlertMessage from "../components/AlertMessage";
import { CartProduct } from "../components/CartProduct";
import LoadingData from "../components/LoadingData";
import ProductCard from "../components/ProductCard";

function cartPage() {
    const navigate = useNavigate();
    const { userId, setSearchKeyword } = useContext(siteContext);

    const [items, setItems] = useState("loading");
    const [correlatedProducts, setCorrelatedProducts] = useState("loading");

    const [total, setTotal] = useState("Loading...");
    const [displayError, setDisplayError] = useState(false);

    useEffect(() => {
        if (!userId) {
            navigate("/loginPage");
            return;
        }

        document.title = "Amazing - Your Amazing cart";
        setSearchKeyword("");
    }, []);

    useEffect(() => {
        const getData = async () => {
            await axios
                .post("/removeSinglePurchases", { userId })
                .then(
                    async (res) =>
                        await axios
                            .post("/getUserCart", { userId })
                            .then((res) => {
                                setItems(res.data.items);
                                updateTotal();
                            })
                            .catch((err) => setItems("error"))
                )
                .catch((err) => setItems("error"));
        };

        if (userId.length <= 24) {
            getData();
        }
    }, [userId]);

    function removeItem(itemToRemove) {
        const removeFromCart = async () => {
            axios
                .post("/removeItemFromCart", {
                    userId,
                    productId: itemToRemove,
                })
                .then((res) => {
                    setItems(res.data.updatedItems);
                    updateTotal();
                })
                .catch((err) => setDisplayError(true));
        };

        removeFromCart();
    }

    useEffect(() => {
        if (items === "loading") {
            return;
        }

        const getCorrelated = async () => {
            await axios
                .post("/getCorrelatedProducts", {
                    items: items.map((singleItem) => singleItem.productId),
                })
                .then((res) =>
                    setCorrelatedProducts(res.data.correlatedProducts)
                )
                .catch((err) => setDisplayError(true));
        };

        getCorrelated();
    }, [items]);

    function updateTotal() {
        setTotal("Loading...");

        const updateTotal = async () => {
            await axios
                .post("/getCartTotal", { userId })
                .then((res) => setTotal(formatPrice(res.data.totalPrice)))
                .catch((err) => setDisplayError(true));
        };

        updateTotal();
    }

    function formatPrice(price) {
        let tempPrice = price;

        tempPrice = tempPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
        });

        return tempPrice;
    }

    return (
        <>
            <NavBar />

            <div className="cart-page">
                <div className="title">Your cart</div>

                <div className="cart-page__main">
                    {items === "loading" ? (
                        <LoadingData />
                    ) : (
                        <>
                            {items.length === 0 ? (
                                <div>
                                    It seems that your cart is empty, start
                                    shopping now!
                                </div>
                            ) : (
                                <>
                                    <div className="item-layout">
                                        {items.map((singleItem) => (
                                            <CartProduct
                                                key={singleItem.productId}
                                                userId={userId}
                                                cartProductData={singleItem}
                                                removeItem={removeItem}
                                                updateTotal={updateTotal}
                                            />
                                        ))}
                                    </div>

                                    <div className="side-section">
                                        <div className="item-total">
                                            <div className="item-total__text">
                                                Current subtotal ({items.length}{" "}
                                                items):{" "}
                                                <strong>${total}</strong>
                                            </div>
                                            {displayError && (
                                                <AlertMessage alertMessage="There's been an error during the process, please try again" />
                                            )}
                                            <Button
                                                size="large"
                                                fullWidth
                                                variant="contained"
                                                color="yellowButton"
                                                onClick={() =>
                                                    navigate("/checkoutPage")
                                                }>
                                                checkout
                                            </Button>
                                        </div>

                                        <div className="correlated-products__title">
                                            Correlated products
                                        </div>

                                        <div className="correlated-products">
                                            {correlatedProducts ===
                                            "loading" ? (
                                                <LoadingData />
                                            ) : (
                                                <>
                                                    {correlatedProducts.map(
                                                        (singleProduct) => (
                                                            <ProductCard
                                                                key={
                                                                    singleProduct._id
                                                                }
                                                                props={
                                                                    singleProduct
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </>
                                            )}

                                            {displayError && (
                                                <AlertMessage alertMessage="There's been an error during the process, please try again" />
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {items === "error" ? (
                        <AlertMessage alertMessage="There's been an error during the process, please try again" />
                    ) : null}
                </div>
            </div>
        </>
    );
}

export default cartPage;
