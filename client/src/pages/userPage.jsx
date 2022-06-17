import axios from "axios";
import { startTransition, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import siteContext from "../siteContext";

import InputField from "../components/InputField";
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import ProductsContainer from "../components/ProductsContainer";
import "../styles/userPage.css";

import { Button, ButtonGroup, TextField } from "@mui/material";
import AlertMessage from "../components/AlertMessage";
import ChangePassword from "../components/ChangePassword";
import LoadingData from "../components/LoadingData";
import SelectCategory from "../components/SelectCategory";

import {
    faArrowUpFromBracket as uploadIcon,
    faBagShopping as ordersIcon,
    faFileLines as userIcon,
    faShop as shopIcon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChangeUsername from "../components/ChangeUsername";
import SiteInfo from "../components/SiteInfo";

function userPage() {
    const navigate = useNavigate();

    const {
        username,
        userId,
        isSeller,
        setUsername,
        setUserId,
        setIsSeller,
        setSearchKeyword,
        isSmall,
    } = useContext(siteContext);

    const stringCheck = /[#$<>\{\}\[\]^!?]/g;

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [inStock, setInStock] = useState(0);
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");

    const [products, setProducts] = useState("loading");
    const [purchases, setPurchases] = useState("Loading...");

    const [userSince, setUserSince] = useState("Loading...");
    const [selectedSection, setSelectedSection] = useState("");
    const [productsUploaded, setProductsUploaded] = useState("Loading...");

    const [alertMessage, setAlertMessage] = useState("");
    const [productsError, setProductsError] = useState(false);
    const [purchaseError, setPurchaseError] = useState(false);
    const [userSinceError, setUserSinceError] = useState(false);
    const [navigateToDeleteError, setNavigateToDeleteError] = useState(false);

    useEffect(() => {
        if (!userId) {
            navigate("/loginPage");
            return;
        }

        document.title = "Amazing - Personal Page";
        setSearchKeyword("");

        return () => {
            document.title = "Amazing - Login";
        };
    }, []);

    useEffect(() => {
        if (!userId) {
            navigate("/loginPage");
        } else {
            if (userId.length <= 24) {
                startTransition(() => {
                    axios
                        .post("/getSellerProducts", {
                            sellerUsername: username,
                        })
                        .then((res) => {
                            setProductsUploaded(res.data.products.length);
                            setProducts(res.data.products);
                        })
                        .catch((err) =>
                            setProductsError(
                                "There's been an error during the process, please try again later"
                            )
                        );

                    axios
                        .post("/getUserSince", { userId })
                        .then((res) => {
                            setUserSince(res.data.userSince);
                        })
                        .catch((err) =>
                            setUserSinceError(
                                "There's been an error during the process, please try again later"
                            )
                        );

                    axios
                        .post("/getUserOrders", { userId })
                        .then((res) => {
                            setPurchases(res.data.orders);
                        })
                        .catch((err) =>
                            setPurchaseError(
                                "There's been an error during the process, please try again later"
                            )
                        );
                });
            }
        }
    }, [userId]);

    function userLogout() {
        localStorage.removeItem("userId");

        setUsername("");
        setUserId("");
        setIsSeller("");
        setUserSince("");
        setSearchKeyword("");

        navigate("/loginPage");
    }

    function updateMessage(messageText) {
        setAlertMessage(messageText);

        setTimeout(() => {
            setAlertMessage("");
        }, 2500);
    }

    function updateImageLink(e) {
        setAlertMessage("Loading image...");

        const formData = new FormData();
        formData.append("image", e.target.files[0]);

        fetch("https://api.imgur.com/3/image/", {
            method: "post",
            headers: {
                Authorization: `Client-ID 44f1988036ecf17`,
            },
            body: formData,
        })
            .then((data) => data.json())
            .then(({ data }) => {
                setImage(data.link);

                updateMessage("Image uploaded successfully");
                setTimeout(() => updateMessage(""), 2500);
            })
            .catch((err) => {
                updateMessage("An error occurred, please try again");
            });
    }

    function uploadProduct() {
        const check = checkDataValidity();

        if (!check) {
            return;
        }

        const productData = {
            name,
            price,
            category,
            description,
            image,
            inStock,
            sellerUsername: username,
            sellerId: userId,
        };

        axios
            .post("/uploadProduct", productData)
            .then((res) => {
                updateMessage("Product uploaded successfully");

                setName("");
                setPrice(0);
                setInStock(0);
                setCategory("");
                setDescription("");
                setImage("");

                setProducts([...products, res.data.product]);
            })
            .catch((err) =>
                updateMessage("An error occurred, please try again")
            );
    }

    function checkDataValidity() {
        const nameTest =
            stringCheck.test(name) || name.trim().length === 0 ? false : true;

        const priceTest = stringCheck.test(price) || +price <= 0 ? false : true;

        const inStockTest =
            stringCheck.test(inStock) ||
            +inStock <= 0 ||
            (typeof inStock == "string"
                ? inStock.includes(",") || inStock.includes(".")
                : false)
                ? false
                : true;

        const categoryTest =
            stringCheck.test(category) || category.trim().length === 0
                ? false
                : true;

        const descriptionTest =
            stringCheck.test(description) || description.trim().length === 0
                ? false
                : true;

        const imageTest = image.length === 0 ? false : true;

        if (
            nameTest &&
            priceTest &&
            categoryTest &&
            descriptionTest &&
            inStockTest &&
            imageTest
        ) {
            return true;
        }

        updateMessage("Missing or wrong data");
        return false;
    }

    async function goToDeleteAccount() {
        await axios
            .post("/getDeleteAccountToken", { userId })
            .then((res) =>
                navigate(`/deleteAccountPage/${res.data.deleteAccountToken}`)
            )
            .catch((err) =>
                setNavigateToDeleteError(
                    "There's been an error during the process, please try again later"
                )
            );
    }

    return (
        <>
            <NavBar />

            <div className="user-page">
                <>
                    {selectedSection === "" ? (
                        <>
                            <div className="select-section__container">
                                <div
                                    className="select-section"
                                    onClick={() =>
                                        setSelectedSection("userInfo")
                                    }>
                                    <div className="icon-container">
                                        <FontAwesomeIcon
                                            icon={userIcon}
                                            size="2x"
                                            className="fa-fw"
                                        />
                                    </div>

                                    <div className="section-text__container">
                                        <div className="section-title">
                                            Account information
                                        </div>
                                        <div className="section-text">
                                            See you account personal data and
                                            change them, if you want to
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="select-section"
                                    onClick={() =>
                                        setSelectedSection("orderHistory")
                                    }>
                                    <div className="icon-container">
                                        <FontAwesomeIcon
                                            icon={ordersIcon}
                                            size="2x"
                                            className="fa-fw"
                                        />
                                    </div>

                                    <div className="section-text__container">
                                        <div className="section-title">
                                            Order history
                                        </div>
                                        <div className="section-text">
                                            Check your previous orders and buy
                                            again the items you liked the most
                                        </div>
                                    </div>
                                </div>

                                {isSeller ? (
                                    <>
                                        <div
                                            className="select-section"
                                            onClick={() =>
                                                setSelectedSection(
                                                    "uploadProduct"
                                                )
                                            }>
                                            <div className="icon-container">
                                                <FontAwesomeIcon
                                                    icon={uploadIcon}
                                                    size="2x"
                                                    className="fa-fw"
                                                />
                                            </div>

                                            <div className="section-text__container">
                                                <div className="section-title">
                                                    Upload a product
                                                </div>
                                                <div className="section-text">
                                                    Upload a new product that
                                                    you would like to sell on
                                                    our site
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className="select-section"
                                            onClick={() =>
                                                setSelectedSection(
                                                    "seeYourProducts"
                                                )
                                            }>
                                            <div className="icon-container">
                                                <FontAwesomeIcon
                                                    icon={shopIcon}
                                                    size="2x"
                                                    className="fa-fw"
                                                />
                                            </div>

                                            <div className="section-text__container">
                                                <div className="section-title">
                                                    Uploaded products
                                                </div>
                                                <div className="section-text">
                                                    Check which products you
                                                    have on sale, and replenish
                                                    inventory when they run out
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                            </div>

                            <SiteInfo />
                        </>
                    ) : null}

                    {selectedSection === "userInfo" ? (
                        <div className="user-info">
                            <div className="section">
                                <div className="title">My account</div>

                                <Button
                                    size={isSmall ? "large" : "small"}
                                    style={{ minWidth: "30%" }}
                                    variant="contained"
                                    onClick={() => setSelectedSection("")}>
                                    go back
                                </Button>
                            </div>

                            <div className="user-info__data-container">
                                <div className="user-info__data">
                                    <div className="info-section">
                                        <div className="info-section__label">
                                            Username:
                                        </div>
                                        <div className="info-section__value">
                                            {username}
                                        </div>
                                    </div>

                                    <div className="info-section">
                                        {!userSinceError ? (
                                            <>
                                                <div className="info-section__label">
                                                    User since:
                                                </div>
                                                <div className="info-section__value">
                                                    {userSince}
                                                </div>
                                            </>
                                        ) : (
                                            <AlertMessage
                                                alertMessage={userSinceError}
                                            />
                                        )}
                                    </div>

                                    <div className="info-section">
                                        {!purchaseError ? (
                                            <>
                                                <div className="info-section__label">
                                                    Purchases made:
                                                </div>

                                                <div className="info-section__value">
                                                    {purchases === "Loading..."
                                                        ? purchases
                                                        : purchases.length}
                                                </div>
                                            </>
                                        ) : (
                                            <AlertMessage
                                                alertMessage={purchaseError}
                                            />
                                        )}
                                    </div>

                                    {isSeller ? (
                                        <div className="info-section">
                                            {!productsError ? (
                                                <>
                                                    <div className="info-section__label">
                                                        Uploaded products:
                                                    </div>

                                                    <div className="info-section__value">
                                                        {productsUploaded}
                                                    </div>
                                                </>
                                            ) : (
                                                <AlertMessage
                                                    alertMessage={productsError}
                                                />
                                            )}
                                        </div>
                                    ) : null}

                                    <div className="button-group">
                                        <Button
                                            size="large"
                                            variant="contained"
                                            onClick={() => userLogout()}>
                                            Logout
                                        </Button>

                                        <Button
                                            size="large"
                                            variant="contained"
                                            onClick={() => goToDeleteAccount()}>
                                            delete account
                                        </Button>
                                    </div>

                                    {navigateToDeleteError && (
                                        <AlertMessage
                                            className="alert-message"
                                            fullWidth
                                            alertMessage={navigateToDeleteError}
                                        />
                                    )}
                                </div>

                                <ChangeUsername userId={userId} />
                                <ChangePassword userId={userId} />
                            </div>
                        </div>
                    ) : null}

                    {selectedSection === "uploadProduct" ? (
                        <>
                            <div className="section">
                                <div className="title">Upload product</div>

                                <Button
                                    size={isSmall ? "large" : "small"}
                                    style={{ minWidth: "30%" }}
                                    variant="contained"
                                    onClick={() => setSelectedSection("")}>
                                    go back
                                </Button>
                            </div>

                            <div className="uploading-product">
                                <form className="product-upload-form">
                                    <InputField
                                        fieldValue={name}
                                        fieldType="text"
                                        fieldLabel="Product Name"
                                        isRequired={true}
                                        setValue={setName}
                                    />

                                    <InputField
                                        fieldValue={price}
                                        fieldType="number"
                                        fieldLabel="Price"
                                        isRequired={true}
                                        setValue={setPrice}
                                    />

                                    <InputField
                                        fieldValue={inStock}
                                        fieldType="number"
                                        fieldLabel="Currently in stock"
                                        isRequired={true}
                                        setValue={setInStock}
                                        onlyInteger={true}
                                    />

                                    <SelectCategory
                                        value={category}
                                        setCategory={setCategory}
                                        isAllSelectable={false}
                                    />

                                    <InputField
                                        fieldValue={description}
                                        fieldType="text"
                                        fieldLabel="Description"
                                        isRequired={true}
                                        setValue={setDescription}
                                        isMultiline={true}
                                    />

                                    <TextField
                                        type="file"
                                        size="small"
                                        variant="outlined"
                                        accept="image/png, image/jpeg"
                                        onChange={(e) => updateImageLink(e)}
                                        fullWidth
                                        required={true}
                                    />

                                    {alertMessage ? (
                                        <AlertMessage
                                            fullWidth
                                            alertMessage={alertMessage}
                                        />
                                    ) : null}

                                    <Button
                                        size={isSmall ? "large" : "small"}
                                        fullWidth
                                        variant="contained"
                                        onClick={() => uploadProduct()}>
                                        Upload product
                                    </Button>
                                </form>

                                <div className="product-preview__container">
                                    <ProductCard
                                        props={{
                                            _id: "",
                                            image,
                                            name: name || "Insert a name...",
                                            category:
                                                category ||
                                                "Choose a category...",
                                            price,
                                            inStock,
                                            sellerUsername: username,
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    ) : null}

                    {selectedSection === "seeYourProducts" ? (
                        <>
                            <div className="section">
                                <div className="title">Your products</div>

                                {products.length > 0 ? (
                                    <Button
                                        size={isSmall ? "large" : "small"}
                                        style={{ minWidth: "30%" }}
                                        variant="contained"
                                        onClick={() => setSelectedSection("")}>
                                        go back
                                    </Button>
                                ) : null}
                            </div>

                            {products === "loading" ? (
                                <LoadingData />
                            ) : (
                                <>
                                    {products.length > 0 ? (
                                        <>
                                            <ProductsContainer
                                                products={products}
                                                isSeller={true}
                                                disableClick={true}
                                            />
                                        </>
                                    ) : (
                                        <div className="no-products">
                                            You don't have any products uploaded
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : null}

                    {selectedSection === "orderHistory" ? (
                        <>
                            <div>order history</div>

                            {purchases === "Loading..." ? (
                                <LoadingData />
                            ) : (
                                <>
                                    {purchases.length === 0 ? (
                                        <h1>No purchases</h1>
                                    ) : (
                                        <h1>{purchases.length}</h1>
                                    )}
                                </>
                            )}

                            <Button
                                size={isSmall ? "large" : "small"}
                                style={{ minWidth: "30%" }}
                                variant="contained"
                                onClick={() => setSelectedSection("")}>
                                go back
                            </Button>
                        </>
                    ) : null}
                </>
            </div>
        </>
    );
}

export default userPage;
