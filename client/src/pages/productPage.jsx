import { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import "../styles/productPage.css";

import { Button } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import LoadingData from "../components/LoadingData";
import ProductCard from "../components/ProductCard";
import SelectProductQuantity from "../components/SelectProductQuantity";
import siteContext from "../siteContext";
import AlertMessage from "../components/AlertMessage";

function productPage() {
    const { productId } = useParams();
    const { userId, isSmall } = useContext(siteContext);
    const navigate = useNavigate();

    const [productData, setProductData] = useState("loading");
    const [quantityToBuy, setQuantityToBuy] = useState("1");
    const [correlatedProducts, setCorrelatedProducts] = useState("loading");
    const correlatedQuantity = 6;

    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        const getProductData = async () => {
            axios
                .post("/product/getProductById", { productId })
                .then((res) => {
                    setProductData(res.data.product);

                    setQuantityToBuy(1);
                    setAlertMessage("");
                    setCorrelatedProducts("loading");

                    getProductsByCategory(
                        res.data.product.category,
                        res.data.product._id
                    );
                })
                .catch((err) => navigate("/page404"));
        };

        const getProductsByCategory = async (category, currentProductId) => {
            axios
                .post("/product/getProductsByCategory", {
                    category,
                })
                .then((res) => {
                    let tempProducts = res.data.products.filter(
                        (singleProduct) =>
                            singleProduct._id !== currentProductId
                    );

                    tempProducts = shuffleArray(tempProducts);

                    if (tempProducts.length > correlatedQuantity) {
                        tempProducts.length = correlatedQuantity;
                    }

                    setCorrelatedProducts(tempProducts);
                })
                .catch((err) => setProductData(""));
        };

        getProductData();
    }, [productId]);

    useEffect(() => {
        document.title = "Amazing - " + productData.name;
    }, [productData]);

    function goToSellerPage() {
        navigate(`/sellerPage/${productData.sellerUsername}`);
    }

    async function goToCheckout() {
        if (!userId) {
            navigate("/loginPage");
            return;
        }

        const newItem = {
            singlePurchase: true,
            productId,
            quantityToBuy,
        };

        let items;

        await axios
            .post("/cart/removeSinglePurchases", { userId })
            .then(async (res) => {
                await axios
                    .post("/cart/getUserCart", { userId })
                    .then((cartItems) => (items = cartItems.data.items))
                    .catch((err) => {
                        setAlertMessage(
                            "There's been an error during the process, please try again"
                        );
                    });
            })
            .catch((err) => {
                setAlertMessage(
                    "There's been an error during the process, please try again"
                );
            });

        items.push(newItem);

        await axios
            .post("/cart/updateCartProducts", { userId, updatedItems: items })
            .then((cartItems) => {
                navigate(`/checkoutPage`);
            })
            .catch((err) => {
                setAlertMessage(
                    "There's been an error during the process, please try again"
                );
            });
    }

    async function addToCart() {
        if (!userId) {
            navigate("/loginPage");
            return;
        }

        const newItem = {
            productId,
            quantityToBuy,
        };

        let items;

        await axios
            .post("/cart/getUserCart", { userId })
            .then((cartItems) => (items = cartItems.data.items))
            .catch((err) => {
                setAlertMessage(
                    "There's been an error during the process, please try again"
                );

                resetAlert();
            });

        let check = false;

        items.forEach((singleItem) => {
            if (singleItem.productId === newItem.productId) {
                singleItem.quantityToBuy =
                    +singleItem.quantityToBuy + +newItem.quantityToBuy;
                check = true;
                return;
            }
        });

        if (!check) {
            items.push(newItem);
        }

        await axios
            .post("/cart/updateCartProducts", { userId, updatedItems: items })
            .then((cartItems) => {
                setAlertMessage("Product added successfully");
            })
            .catch((err) => {
                setAlertMessage(
                    "There's been an error during the process, please try again"
                );
            });

        resetAlert();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    function resetAlert() {
        setTimeout(() => {
            setAlertMessage("");
        }, 2500);
    }

    return (
        <>
            <NavBar />

            <div className="product-page">
                {productData === "loading" ? (
                    <LoadingData />
                ) : (
                    <>
                        <div className="product-page-category">
                            Category: {productData.category}
                        </div>

                        <div className="page-flex-container">
                            <div
                                className="product-image shown-at-full"
                                style={{
                                    backgroundImage: `url("${productData.image}")`,
                                }}></div>

                            <div className="product-data__container">
                                <div className="img-zoomed"></div>

                                <div className="product-subcontainer">
                                    <div className="product-name">
                                        {productData.name}
                                    </div>
                                    <div className="product-seller">
                                        Product seller:{" "}
                                        <a onClick={() => goToSellerPage()}>
                                            {productData.sellerUsername}
                                        </a>
                                    </div>
                                </div>

                                <div
                                    className="product-image shown-at-half"
                                    style={{
                                        backgroundImage: `url("${productData.image}")`,
                                    }}></div>

                                <div className="product-price">
                                    <div className="product-price__symbol">
                                        $
                                    </div>
                                    {productData.price}
                                </div>

                                <div className="product-stock__container">
                                    <div className="product-stock">
                                        Currently in stock:{" "}
                                        {productData.inStock}
                                    </div>

                                    <div className="product-stock__select-quantity">
                                        Quantity to add:
                                        <SelectProductQuantity
                                            value={quantityToBuy}
                                            maxValue={productData.inStock}
                                            returnQuantity={setQuantityToBuy}
                                        />
                                    </div>
                                </div>

                                <div className="buttons">
                                    <Button
                                        size={isSmall ? "large" : "small"}
                                        variant="contained"
                                        color="lightButton"
                                        className="light-button"
                                        onClick={() => addToCart()}>
                                        add to cart
                                    </Button>

                                    <Button
                                        size={isSmall ? "large" : "small"}
                                        variant="contained"
                                        onClick={() => goToCheckout()}>
                                        buy now
                                    </Button>
                                </div>

                                {alertMessage && (
                                    <AlertMessage alertMessage={alertMessage} />
                                )}

                                <div className="product-description__container">
                                    <div className="product-description__label">
                                        Product description:
                                    </div>

                                    <div className="product-description__text">
                                        {productData.description}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="correlated-products__container">
                            <div className="title">Correlated products</div>

                            <div className="correlated-products">
                                {correlatedProducts === "loading" ? (
                                    <LoadingData />
                                ) : (
                                    <>
                                        {correlatedProducts.length > 0 ? (
                                            <>
                                                {correlatedProducts.map(
                                                    (singleProduct) => (
                                                        <ProductCard
                                                            props={
                                                                singleProduct
                                                            }
                                                            key={
                                                                singleProduct._id
                                                            }
                                                        />
                                                    )
                                                )}
                                            </>
                                        ) : (
                                            <div className="no-correlated-products">
                                                There are no correlated products
                                                to this one
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default productPage;
