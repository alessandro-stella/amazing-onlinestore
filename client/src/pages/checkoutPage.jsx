import { Alert, Button, Checkbox, FormControlLabel } from "@mui/material";
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
    const [checkoutError, setCheckoutError] = useState("");

    const [completedOrder, setCompletedOrder] = useState("");

    useEffect(() => {
        if (!userId) {
            navigate("/loginPage");
            return;
        }

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

        if (productsToBuy.length === 0) {
            navigate("/userPage/orderHistory");
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

    function resetCheckoutAlert() {
        setTimeout(() => {
            setCheckoutError("");
        }, 2500);
    }

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
            .post("/cart/getUserCart", { userId })
            .then((res) => {
                items = res.data.items;
            })
            .catch((err) => (items = "error"));

        return items;
    }

    function removeSingleCheckout(updatedItems) {
        const removeItems = async () => {
            await axios
                .post("/cart/updateCartProducts", { userId, updatedItems })
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
                .post("/cart/getCartTotal", { userId })
                .then((res) => setTotal(formatPrice(res.data.totalPrice)))
                .catch((err) => setTotalError(true));
        };

        const getProductData = async () => {
            await axios
                .post("/product/getProductById", {
                    productId: productsToBuy.productId,
                })
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
                .post("/cart/removeItemFromCart", {
                    userId,
                    productId: itemToRemove,
                })
                .then((res) => {
                    if (res.data.updatedItems.length === 0) {
                        navigate("/shopPage");
                        return;
                    }

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

    async function buyProducts() {
        await axios
            .post("/user/getShipmentInfo", { userId })
            .then(async (res) => {
                let shipmentInfo = res.data.shipmentInfo;

                await axios
                    .post("/history/addNewOrders", {
                        userId,
                        productsToAdd: productsToBuy,
                        shipmentInfo,
                        fastShipping,
                    })
                    .then((res) => {
                        setCompletedOrder("loading");

                        setTimeout(() => {
                            navigate(0);
                        }, 2500);
                    })
                    .catch((err) => {
                        setCompletedOrder("error");
                    });
            })
            .catch((err) => {
                setCheckoutError("Missing shipment info");
                resetCheckoutAlert();
            });
    }

    return (
        <>
            <NavBar />

            <div className="checkout-page">
                <div className="title">
                    Order summary
                    {completedOrder === "loading" ? (
                        ""
                    ) : (
                        <>
                            {productsToBuy === "Loading..."
                                ? productsToBuy
                                : ` (${
                                      Array.isArray(productsToBuy)
                                          ? productsToBuy.length
                                          : 1
                                  } items)`}
                        </>
                    )}
                </div>

                <div className="checkout-page__main">
                    {completedOrder === "" && (
                        <>
                            <div className="checkout-summary">
                                <div className="checkout-section checkout-section-1">
                                    <div className="checkout-section__inner">
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
                                </div>

                                <div className="checkout-section checkout-section-2">
                                    <div className="checkout-section__inner">
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

                                    <Alert severity="info">
                                        <strong>Info</strong> - This feature is
                                        currently for decorative purposes only,
                                        a payment system may be implemented in
                                        the future
                                    </Alert>
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
                                                    cartProductData={
                                                        productsToBuy
                                                    }
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
                                                                removeItem={
                                                                    removeItem
                                                                }
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
                                        color="lightButton"
                                        onClick={() => {
                                            buyProducts();
                                        }}>
                                        buy now
                                    </Button>

                                    {checkoutError && (
                                        <AlertMessage
                                            alertMessage={checkoutError}
                                        />
                                    )}

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
                                                          Array.isArray(
                                                              productsToBuy
                                                          )
                                                              ? productsToBuy.length
                                                              : 1
                                                      } items`}
                                                ): <strong>${total}</strong>
                                            </div>

                                            <div className="subsection shipping-cost">
                                                Shipping costs:{" "}
                                                <strong>
                                                    $
                                                    {productsToBuy ===
                                                    "Loading..."
                                                        ? productsToBuy
                                                        : shippingCost}
                                                </strong>
                                                <div className="select-fast-shipping">
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                size="small"
                                                                checked={
                                                                    fastShipping
                                                                }
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
                                                    {formatPrice([
                                                        total,
                                                        shippingCost,
                                                    ])}
                                                </strong>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {completedOrder === "error" && (
                        <AlertMessage alertMessage="There's been an error during the process, please try again" />
                    )}

                    {completedOrder === "loading" && <LoadingData />}

                    {completedOrder === true && <h1>order completed</h1>}
                </div>
            </div>
        </>
    );
}

export default checkoutPage;
