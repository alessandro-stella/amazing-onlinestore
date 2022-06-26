import { Alert, Button, ButtonGroup } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import siteContext from "../siteContext";
import AlertMessage from "./AlertMessage";
import InputField from "./InputField";

function ProductCard({ props }) {
    const navigate = useNavigate();
    const { isSmall } = useContext(siteContext);

    const productId = props._id;

    const {
        image,
        name,
        category,
        price,
        sellerUsername,
        isSeller,
        disableClick,
        getProducts,
    } = props;

    const [inStock, setInStock] = useState(props.inStock);
    const [newQuantity, setNewQuantity] = useState(props.inStock);
    const [hasChanged, setHasChanged] = useState(false);
    const [confirmRemove, setConfirmRemove] = useState(false);
    const [displayError, setDisplayError] = useState(false);

    function handleNewQuantity(value) {
        if (newQuantity < 0 || isNaN(newQuantity)) {
            setNewQuantity(0);
            return;
        }

        setNewQuantity(value);
    }

    useEffect(() => {
        if (+inStock === +newQuantity) {
            setHasChanged(false);
        } else {
            setHasChanged(true);
        }
    }, [newQuantity]);

    const checkMiddleClick = (e) => {
        if (e.button === 1) {
            window.open(`/productPage/${productId}`, "_blank");
        }
    };

    function navigateToPage() {
        navigate(`/productPage/${productId}`);
    }

    async function updateQuantity() {
        await axios
            .post("/product/updateItemStock", { productId, newQuantity })
            .then((res) => {
                setInStock(res.data.newQuantity);
                setNewQuantity(res.data.newQuantity);
                setHasChanged(false);
            })
            .catch((err) => setInStock("loadingError"));
    }

    async function removeProduct() {
        setConfirmRemove(true);
    }

    function deleteItem(itemToRemove) {
        const removeFromCart = async () => {
            axios
                .post("/product/deleteProduct", {
                    productId: itemToRemove,
                })
                .then((res) => {
                    getProducts();
                })
                .catch((err) => {
                    console.dir(err);
                    setDisplayError(true);
                    resetAlert();
                });
        };

        removeFromCart();
    }

    function resetAlert() {
        setTimeout(() => {
            setDisplayError(false);
        }, 2500);
    }

    return (
        <div
            className={`product-panel${disableClick ? " disable-hover" : ""}`}
            onClick={() => {
                if (disableClick) return;
                navigateToPage();
            }}
            onMouseDown={checkMiddleClick}>
            <div
                className="product-image"
                style={
                    image !== ""
                        ? {
                              backgroundImage: `url("${image}")`,
                          }
                        : null
                }
            />

            <div className="product-name">{name}</div>

            <div className="product-price">
                <div className="product-price__symbol">$</div>
                {price}
            </div>

            <div className="product-category">{category}</div>

            <div className="product-panel__section product-data">
                <div className="product-seller">From: {sellerUsername}</div>
                <div className="product-stock">In stock: {inStock}</div>
            </div>

            {isSeller && (
                <>
                    <div className="product-panel__section restock-item">
                        <div className="restock-item__title">Restock item</div>
                        <InputField
                            fieldValue={
                                newQuantity === "" || newQuantity < 0
                                    ? 0
                                    : newQuantity
                            }
                            fieldType="number"
                            fieldLabel="New quantity"
                            setValue={handleNewQuantity}
                            onlyInteger={true}
                        />

                        {hasChanged && (
                            <Button
                                className="restock-item__button"
                                fullWidth
                                variant="contained"
                                size={isSmall ? "large" : "small"}
                                onClick={updateQuantity}>
                                Update quantity
                            </Button>
                        )}
                    </div>

                    <div className="product-panel__section delete-item">
                        <Button
                            fullWidth
                            variant="contained"
                            size={isSmall ? "large" : "small"}
                            onClick={() => removeProduct()}>
                            delete product
                        </Button>

                        {confirmRemove && (
                            <>
                                <Alert
                                    severity="info"
                                    className="alert-not-rounded delete-item-alert">
                                    <strong>Confirm</strong> - Are you sure you
                                    want to remove this item?
                                </Alert>
                                <ButtonGroup
                                    fullWidth
                                    color="info"
                                    size="large">
                                    <Button
                                        className="no-round-top-left"
                                        onClick={() => deleteItem(productId)}>
                                        Confirm
                                    </Button>
                                    <Button
                                        className="no-round-top-right"
                                        variant="contained"
                                        onClick={() => setConfirmRemove(false)}>
                                        Undo
                                    </Button>
                                </ButtonGroup>

                                {displayError && (
                                    <AlertMessage
                                        className="alert-message"
                                        alertMessage="There's been an error during the process, please try again"
                                    />
                                )}
                            </>
                        )}
                    </div>
                </>
            )}

            {inStock === "loadingError" && (
                <AlertMessage alertMessage="There's been an error during the process, please try again" />
            )}
        </div>
    );
}

export default ProductCard;
