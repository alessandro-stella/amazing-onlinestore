import { Button, Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AlertMessage from "../components/AlertMessage";
import { CartProduct as ProductCard } from "../components/CartProduct";
import LoadingData from "../components/LoadingData";
import NavBar from "../components/NavBar";
import PaymentMethods from "../components/PaymentMethods";
import ShipmentAddress from "../components/ShipmentAddress";
import siteContext from "../siteContext";
import "../styles/checkoutPage.css";

function checkoutPage() {
    const navigate = useNavigate();

    const { userId } = useContext(siteContext);

    const [productsToBuy, setProductsToBuy] = useState("Loading...");
    const [singleCheckout, setSingleCheckout] = useState(false);

    const [total, setTotal] = useState("");
    const [totalError, setTotalError] = useState(false);

    const [fastShipping, setFastShipping] = useState(false);
    const [shippingCost, setShippingCost] = useState(0);

    const [displayError, setDisplayError] = useState(false);

    useEffect(() => {
        if (!userId) {
            navigate("/loginPage");
        }
    }, []);

    useEffect(() => {
        if (userId.length > 24) {
            return;
        }

        let cartItems;

        const getData = async () => {
            cartItems = await getCart();

            if (cartItems === "error") {
                setAlertMessage(
                    "There's been an error during the process, please try again"
                );
            }

            let check = false;

            cartItems.forEach((singleItem) => {
                if (check) {
                    return;
                }

                if (singleItem.singlePurchase) {
                    setProductsToBuy(singleItem);
                    setSingleCheckout(true);
                    check = true;
                }
            });

            if (check) {
                return;
            }

            setProductsToBuy(cartItems);
        };

        getData();

        return () => {
            removeSingleCheckout(
                cartItems.filter(
                    (singleItem) => singleItem.singlePurchase !== true
                )
            );
        };
    }, [userId]);

    useEffect(() => {
        if (productsToBuy === "Loading...") {
            return;
        }

        const getTotal = async () => {
            updateTotal();
            calculateShippingCost();
        };

        getTotal();
    }, [productsToBuy]);

    useEffect(() => {
        if (productsToBuy === "Loading...") {
            return;
        }

        calculateShippingCost();
    }, [fastShipping]);

    function calculateShippingCost() {
        if (!fastShipping) {
            setShippingCost(formatPrice(0));
            return;
        }

        let tempShippingCost = Array.isArray(productsToBuy)
            ? productsToBuy.length * 1.5
            : "1.50";

        setShippingCost(formatPrice(tempShippingCost));
    }

    async function getCart() {
        let items;

        await axios
            .post("/getUserCart", { userId })
            .then((res) => {
                items = res.data.items;
            })
            .catch((err) => (items = "error"));

        return items;
    }

    function removeSingleCheckout(updatedItems) {
        const removeItems = async () => {
            await axios
                .post("/updateCartProducts", { userId, updatedItems })
                .catch((err) =>
                    setAlertMessage(
                        "There's been an error during the process, please try again"
                    )
                );
        };

        removeItems();
    }

    function updateTotal(newQuantity) {
        setTotal("Loading...");

        const updateTotal = async () => {
            await axios
                .post("/getCartTotal", { userId })
                .then((res) => setTotal(formatPrice(res.data.totalPrice)))
                .catch((err) => setTotalError(true));
        };

        const getProductData = async () => {
            await axios
                .post("/getProductById", { productId: productsToBuy.productId })
                .then((res) => {
                    setTotal(
                        formatPrice(
                            +res.data.product.price *
                                (newQuantity
                                    ? newQuantity
                                    : productsToBuy.quantityToBuy)
                        )
                    );
                })
                .catch((err) => setTotalError(true));
        };

        if (singleCheckout) {
            getProductData();
        } else {
            updateTotal();
        }
    }

    function formatPrice(price) {
        if (
            productsToBuy === "Loading..." ||
            price[0] === "" ||
            price[0] === "Loading..."
        ) {
            return;
        }

        let tempPrice;

        if (Array.isArray(price)) {
            let tempTotal = +price[0].replace(",", "");
            let tempShippingCost = +price[1].replace(",", "");

            tempPrice = tempTotal + tempShippingCost;
        } else {
            tempPrice = price;
        }

        tempPrice = tempPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
        });

        return tempPrice;
    }

    function removeItem(itemToRemove) {
        if (singleCheckout) {
            navigate("/shopPage");
            return;
        }

        const removeFromCart = async () => {
            await axios
                .post("/removeItemFromCart", {
                    userId,
                    productId: itemToRemove,
                })
                .then((res) => {
                    setProductsToBuy(res.data.updatedItems);
                    updateTotal();
                })
                .catch((err) => {
                    setDisplayError(true);

                    setTimeout(() => setDisplayError(false), 3000);
                });
        };

        removeFromCart();
    }

    function orderProducts() {
        console.log(productsToBuy);
    }

    return (
        <>
            <NavBar />

            <div className="checkout-page">
                <div className="title">
                    Order summary (
                    {productsToBuy === "Loading..."
                        ? productsToBuy
                        : `${
                              Array.isArray(productsToBuy)
                                  ? productsToBuy.length
                                  : 1
                          } items`}
                    )
                </div>

                <div className="checkout-page__main">
                    <div className="checkout-summary">
                        <div className="checkout-section checkout-section-1">
                            <div className="checkout-section__title">
                                <div className="checkout-section__title-number">
                                    1
                                </div>
                                <div className="checkout-section__title-text">
                                    Delivery address
                                </div>
                            </div>

                            <div className="checkout-section__data">
                                <ShipmentAddress />
                            </div>
                        </div>

                        <div className="checkout-section checkout-section-2">
                            <div className="checkout-section__title">
                                <div className="checkout-section__title-number">
                                    2
                                </div>
                                <div className="checkout-section__title-text">
                                    Terms of payment
                                </div>
                            </div>

                            <div className="checkout-section__data">
                                <PaymentMethods />
                            </div>
                        </div>

                        <div className="checkout-section checkout-section-3">
                            <div className="checkout-section__title">
                                <div className="checkout-section__title-number">
                                    3
                                </div>
                                <div className="checkout-section__title-text">
                                    Review the items and shipping date
                                </div>
                            </div>

                            {displayError && (
                                <AlertMessage
                                    className="alert-message"
                                    alertMessage="There's been an error during the process, please try again"
                                />
                            )}

                            {productsToBuy === "Loading..." ? (
                                <LoadingData />
                            ) : (
                                <div className="products-summary">
                                    {singleCheckout ? (
                                        <ProductCard
                                            userId={userId}
                                            cartProductData={productsToBuy}
                                            removeItem={removeItem}
                                            updateTotal={updateTotal}
                                        />
                                    ) : (
                                        <>
                                            {productsToBuy.map(
                                                (singleProduct) => (
                                                    <ProductCard
                                                        key={
                                                            singleProduct.productId
                                                        }
                                                        userId={userId}
                                                        cartProductData={
                                                            singleProduct
                                                        }
                                                        removeItem={removeItem}
                                                        updateTotal={
                                                            updateTotal
                                                        }
                                                    />
                                                )
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="side-section">
                        <div className="side-section__pay">
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                color="yellowButton"
                                onClick={() => {
                                    orderProducts();
                                }}>
                                buy now
                            </Button>

                            {totalError ? (
                                <AlertMessage
                                    className="alert-message"
                                    alertMessage="There's been an error during the process, please try again"
                                />
                            ) : (
                                <>
                                    <div className="summary-subtext">
                                        Order summary
                                    </div>

                                    <div className="subsection">
                                        Current total (
                                        {productsToBuy === "Loading..."
                                            ? productsToBuy
                                            : `${
                                                  Array.isArray(productsToBuy)
                                                      ? productsToBuy.length
                                                      : 1
                                              } items`}
                                        ): <strong>${total}</strong>
                                    </div>

                                    <div className="subsection shipping-cost">
                                        Shipping costs:{" "}
                                        <strong>
                                            $
                                            {productsToBuy === "Loading..."
                                                ? productsToBuy
                                                : shippingCost}
                                        </strong>
                                        <div className="select-fast-shipping">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        size="small"
                                                        checked={fastShipping}
                                                        onChange={() =>
                                                            setFastShipping(
                                                                !fastShipping
                                                            )
                                                        }
                                                    />
                                                }
                                                label="Fast shipping ($1.50 per item)"
                                            />
                                        </div>
                                    </div>

                                    <div className="total">
                                        Total:{" "}
                                        <strong>
                                            $
                                            {formatPrice([total, shippingCost])}
                                        </strong>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default checkoutPage;
