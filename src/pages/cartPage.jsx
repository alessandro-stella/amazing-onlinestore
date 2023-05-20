import { useContext, useEffect, useRef, useState } from "react";
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

    const [isPrintable, setIsPrintable] = useState(false);
    const [itemsToPrint, setItemsToPrint] = useState("");

    const cartItemsRef = useRef(null);

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
                .post("/cart/removeSinglePurchases", { userId })
                .then(
                    async (res) =>
                        await axios
                            .post("/cart/getUserCart", { userId })
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
                .post("/cart/removeItemFromCart", {
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

        setTimeout(() => {
            let itemsContainerCopy = cartItemsRef.current.cloneNode(true);

            let allToDelete = [
                ...Array.from(
                    itemsContainerCopy.getElementsByClassName(
                        "item-quantity__container"
                    )
                ),
                ...Array.from(
                    itemsContainerCopy.getElementsByClassName("item-subtotal")
                ),
            ];

            allToDelete.forEach((singleDiv) => singleDiv.remove());

            setItemsToPrint(itemsContainerCopy);
            setIsPrintable(true);
        }, 3000);
    }, [items]);

    useEffect(() => {
        if (items === "loading") {
            return;
        }

        const getCorrelated = async () => {
            await axios
                .post("/product/getCorrelatedProducts", {
                    items: items.map((singleItem) => singleItem.productId),
                })
                .then((res) => {
                    let tempCorrelated = res.data.correlatedProducts.filter(
                        (singleCorrelated) => singleCorrelated != null
                    );

                    setCorrelatedProducts(tempCorrelated);
                })
                .catch((err) => setDisplayError(true));
        };

        getCorrelated();
    }, [items]);

    function updateTotal() {
        setTotal("Loading...");

        const updateTotal = async () => {
            await axios
                .post("/cart/getCartTotal", { userId })
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

    function printCart() {
        let htmlToPrint = `<style type="text/css">
        * {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact !important; /* Chrome, Safari, Edge */
            color-adjust: exact !important;
        }

        .item-layout {
            display: flex;
            flex-direction: column;
            gap: 1em;
            --bottom-shadow: 0 0.2em 0.5em #ccc;

            width: fit-content
        }
        
        .item-container__outer {
            box-shadow: var(--bottom-shadow);
        
            display: flex;
            flex-direction: column;
        
            border-radius: 0.5em;
        
            padding: 1em;
        }
        
        .item-container__outer .MuiAlert-root {
            margin-top: 0.5em;
        }
        
        .item-container {
            display: flex;
            flex-direction: row;
            gap: 1em;
        
            position: relative;
        }
        
        .item-data__container {
            display: flex;
            flex-direction: column;
            gap: 0.5em;
        
            flex: 1;
            height: fit-content;
        }
        
        .item-image {
            margin: auto 0;
            height: 10em;
            width: calc(35% - 1em);
            aspect-ratio: 1/1;
        
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
        }
        
        .item-name {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        
            font-size: 1.5em;
        }
        
        .item-quantity__container {
            position: relative;
        }
        
        .item-quantity {
            display: flex;
            align-items: center;
            gap: 0.5em;
        
            margin-top: 0.5em;
        }
        
        .update-button {
            margin-top: 0.5em;
        }
        
        .item-price {
            font-size: 1.5em;
        
            display: flex;
        }
        
        .item-price__symbol {
            height: min-content;
            font-size: 0.5em;
            line-height: 100%;
            padding-top: 0.2em;
        }
        
        .remove-item {
            text-decoration: none;
            margin-left: 0.5em;
        
            position: relative;
        }
        
        .remove-item::before {
            background-color: #bbb;
            width: 1px;
            height: 100%;
        
            content: "";
            position: absolute;
            left: calc(-0.5em + 0.5px);
            top: 0;
        }
        
        .remove-item:after {
            background-color: transparent;
            width: 100%;
            height: 1px;
        
            content: "";
            position: absolute;
            bottom: 1.6px;
            right: 0;
        
            transition: all 0.3s ease-in-out;
        }
        
        .remove-item:hover:after {
            background-color: var(--green);
        }
        
        .alert-not-rounded {
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
        }
        
        .cart-page .button-group * {
            border-top-right-radius: 0 !important;
            border-top-left-radius: 0 !important;
        }
        
        .item-subtotal {
            text-align: end;
            position: relative;
        
            margin-top: 1em;
        }
        
        .item-subtotal::before {
            background-color: #bbb;
            width: 100%;
            height: 0.5px;
        
            content: "";
            position: absolute;
            top: calc(-0.5em + 0.5px);
            left: 0;
        }
        
        .cart-page .correlated-products,
        .correlated-products__title {
            display: none;
        }
        </style><div class="item-layout">`;

        htmlToPrint += itemsToPrint.innerHTML;
        htmlToPrint += "</div>";

        let windowToPrint = window.open("");
        windowToPrint.document.write(htmlToPrint);

        windowToPrint.print();
        windowToPrint.close();
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
                                    <div
                                        className="item-layout"
                                        ref={cartItemsRef}>
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

                                            <a
                                                className={`${
                                                    !isPrintable
                                                        ? "blockClick"
                                                        : ""
                                                }`}
                                                onClick={() => printCart()}>
                                                Print cart items
                                            </a>

                                            {displayError && (
                                                <AlertMessage alertMessage="There's been an error during the process, please try again" />
                                            )}
                                            <Button
                                                size="large"
                                                fullWidth
                                                variant="contained"
                                                color="lightButton"
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
