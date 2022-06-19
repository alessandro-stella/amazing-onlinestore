import axios from "axios";
import { useContext, useEffect, useState } from "react";

import { Alert, Button, ButtonGroup } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SelectCartProducts from "../components/SelectCartProducts";
import siteContext from "../siteContext";
import AlertMessage from "./AlertMessage";

export function CartProduct({
    userId,
    cartProductData,
    removeItem,
    updateTotal,
}) {
    const navigate = useNavigate();

    const productId = cartProductData.productId;
    const { isSmall } = useContext(siteContext);

    const [productData, setProductData] = useState("Loading...");
    const [quantityToBuy, setQuantityToBuy] = useState("Loading...");
    const [displayedPrice, setDisplayedPrice] = useState("Loading...");
    const [hasLoaded, setHasLoaded] = useState(false);

    const [subtotal, setSubtotal] = useState("Loading...");
    const [alertMessage, setAlertMessage] = useState("");
    const [confirmRemove, setConfirmRemove] = useState(false);

    const getProductData = async () => {
        if (quantityToBuy !== "Loading...") {
            return;
        }

        await axios
            .post("/getProductById", { productId })
            .then((res) => {
                setProductData(res.data.product);
                setQuantityToBuy(+cartProductData.quantityToBuy);

                setDisplayedPrice(formatPrice(+res.data.product.price));
            })
            .catch((err) => setProductData("loadingError"));
    };

    useEffect(() => {
        getProductData();
    }, [productId]);

    useEffect(() => {
        if (quantityToBuy === "Loading...") {
            return;
        }

        setSubtotal(formatPrice(quantityToBuy * +productData.price));

        updateQuantity();
    }, [quantityToBuy]);

    function formatPrice(price) {
        let tempPrice = price;
        tempPrice = tempPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
        });

        return tempPrice;
    }

    async function updateQuantity() {
        if (quantityToBuy === "Loading...") {
            return;
        }

        await axios
            .post("/updateItemQuantity", { userId, productId, quantityToBuy })
            .then((res) => {
                getProductData();

                if (hasLoaded) {
                    updateTotal(quantityToBuy);
                }

                setHasLoaded((hasLoaded) => (hasLoaded = true));
            })
            .catch((err) => triggerAlert(true));
    }

    function resetAlert() {
        setTimeout(() => {
            setAlertMessage("");
        }, 2500);
    }

    function triggerAlert(error) {
        if (error) {
            setAlertMessage(
                "There's been an error during the process, please try again"
            );
        } else {
            setAlertMessage("Exceeded maximum quantity");
        }

        resetAlert();
    }

    function goToSellerPage() {
        navigate(`/sellerPage/${productData.sellerUsername}`);
    }

    return (
        <div className="item-container__outer">
            {productData !== "loadingError" ? (
                <>
                    <div className="item-container">
                        <div
                            className="item-image"
                            style={{
                                backgroundImage: `url("${productData.image}")`,
                            }}></div>

                        <div className="item-data__container">
                            <div className="item-name">
                                {productData === "Loading..."
                                    ? productData
                                    : productData.name}
                            </div>

                            <div className="item-price">
                                <div className="item-price__symbol">$</div>
                                {displayedPrice}
                            </div>

                            <div className="item-stock">
                                In stock: {productData.inStock}
                            </div>

                            <div className="item-seller">
                                Seller:{" "}
                                <a onClick={() => goToSellerPage()}>
                                    {productData.sellerUsername}
                                </a>
                            </div>
                        </div>
                    </div>

                    {quantityToBuy !== "Loading..." && (
                        <SelectCartProducts
                            value={quantityToBuy}
                            maxValue={productData.inStock}
                            returnQuantity={setQuantityToBuy}
                            removeItem={setConfirmRemove}
                            triggerAlert={triggerAlert}
                        />
                    )}

                    {alertMessage && (
                        <AlertMessage alertMessage={alertMessage} />
                    )}

                    {confirmRemove &&
                        (isSmall ? (
                            <>
                                <Alert
                                    severity="info"
                                    className="alert-not-rounded"
                                    >
                                    <strong>Confirm</strong> - Are you sure you
                                    want to remove this item?
                                </Alert>
                                <ButtonGroup
                                    className="button-group"
                                    fullWidth
                                    color="info"
                                    size="large">
                                    <Button
                                        onClick={() => removeItem(productId)}>
                                        Confirm
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => setConfirmRemove(false)}>
                                        Undo
                                    </Button>
                                </ButtonGroup>
                            </>
                        ) : (
                            <Alert
                                severity="info"
                                action={
                                    <ButtonGroup size="small" color="info">
                                        <Button
                                            onClick={() =>
                                                removeItem(productId)
                                            }>
                                            Confirm
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                setConfirmRemove(false)
                                            }>
                                            Undo
                                        </Button>
                                    </ButtonGroup>
                                }>
                                <strong>Confirm</strong> - Are you sure you want
                                to remove this item?
                            </Alert>
                        ))}

                    <div className="item-subtotal">
                        Subtotal: <strong>${subtotal}</strong>
                    </div>
                </>
            ) : (
                <AlertMessage alertMessage="There's been an error during the process, please try again" />
            )}
        </div>
    );
}
