import axios from "axios";
import { startTransition, useContext, useEffect, useState } from "react";
import siteContext from "../siteContext";
import "../styles/shopPage.css";

import AlertMessage from "../components/AlertMessage";
import LoadingData from "../components/LoadingData";
import NavBar from "../components/NavBar";
import ProductsContainer from "../components/ProductsContainer";
import RadioCategory from "../components/RadioCategory";
import SelectCategory from "../components/SelectCategory";

function shopPage() {
    const { isSmall, searchKeyword, setSearchKeyword } =
        useContext(siteContext);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [products, setProducts] = useState("loading");

    const [alertMessage, setAlertMessage] = useState("");

    function orderProducts(products) {
        products.sort((a, b) => {
            if (a.category > b.category) {
                return 1;
            }

            if (b.category > a.category) {
                return -1;
            }

            if (a.category === b.category) {
                if (a.name > b.name) {
                    return 1;
                }

                if (b.name > a.name) {
                    return -1;
                }

                if (a.name === b.name) {
                    if (a.price > b.price) {
                        return 1;
                    }

                    if (b.price > a.price) {
                        return -1;
                    }
                }
            }

            return 0;
        });

        setProducts(products);
    }

    const getProducts = () => {
        document.querySelector("input").blur();
        setSelectedCategory("All");

        if (searchKeyword === "") {
            axios
                .post("/getAllProducts")
                .then((res) => {
                    orderProducts(res.data.products);
                })
                .catch((err) => {
                    setProducts("loadingError");
                    setAlertMessage(
                        "There's been an error during the process, please try again"
                    );
                });
        } else {
            axios
                .post("/getProductsByName", { keyword: searchKeyword })
                .then((res) => {
                    orderProducts(res.data.products);
                })
                .catch((err) => {
                    setProducts("loadingError");
                    setAlertMessage(
                        "There's been an error during the process, please try again"
                    );
                });
        }

        setSearchKeyword("");
    };

    useEffect(() => {
        startTransition(() => {
            getProducts();
        });

        document.title = "Amazing - Shopping, as simple as it can get";
    }, []);

    return (
        <>
            <NavBar searchProducts={getProducts} />

            <div className="shop-page">
                <div className="select-category">
                    <div className="title">NEGROOO</div>

                    <div className="section">
                        {isSmall ? (
                            <SelectCategory
                                value={selectedCategory}
                                setCategory={setSelectedCategory}
                                isAllSelectable={true}
                            />
                        ) : (
                            <RadioCategory
                                value={selectedCategory}
                                setCategory={setSelectedCategory}
                                isAllSelectable={true}
                            />
                        )}
                    </div>
                </div>

                {products === "loading" ? (
                    <LoadingData />
                ) : (
                    <>
                        {products !== "loadingError" ? (
                            <ProductsContainer
                                products={products}
                                categoryFilter={selectedCategory}
                            />
                        ) : (
                            <AlertMessage alertMessage={alertMessage} />
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default shopPage;
