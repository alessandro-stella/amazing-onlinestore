import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import siteContext from "../../siteContext";
import AlertMessage from "../AlertMessage";
import InputField from "../InputField";
import NavBar from "../NavBar";
import ProductCard from "../ProductCard";
import SelectCategory from "../SelectCategory";

function UploadProduct() {
    const { username, userId, isSeller, setSearchKeyword, isSmall } =
        useContext(siteContext);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [inStock, setInStock] = useState(0);
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");

    const [alertMessage, setAlertMessage] = useState("");
    const stringCheck = /[#$<>\{\}\[\]^!?]/g;

    useEffect(() => {
        if (!userId) {
            navigate("/loginPage");
            return;
        }

        if (!isSeller) {
            navigate("/userPage");
            return;
        }

        document.title = "Amazing - Upload a new product";
        setSearchKeyword("");
    }, []);

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

    return (
        <>
            <NavBar />

            <div className="user-page">
                <div className="section">
                    <div className="title">Upload product</div>

                    <Button
                        size={isSmall ? "large" : "small"}
                        style={{ minWidth: "30%" }}
                        variant="contained"
                        onClick={() => navigate("/userPage")}>
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
                                category: category || "Choose a category...",
                                price,
                                inStock,
                                sellerUsername: username,
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default UploadProduct;
