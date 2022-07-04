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

    const [productsDisplayed, setProductDisplayed] = useState(15);

    const getProducts = () => {
        document.querySelector("input").blur();
        setSelectedCategory("All");

        if (searchKeyword === "") {
            axios
                .post("/product/getAllProducts")
                .then((res) => {
                    if (products === "loading") {
                        setProducts(res.data.products);
                    } else {
                        setProducts([...products, ...res.data.products]);
                    }
                })
                .catch((err) => {
                    setProducts("loadingError");
                    setAlertMessage(
                        "There's been an error during the process, please try again"
                    );
                });
        } else {
            axios
                .post("/product/getProductsByName", { keyword: searchKeyword })
                .then((res) => {
                    if (products === "loading") {
                        setProducts(res.data.products);
                    } else {
                        setProducts([...products, ...res.data.products]);
                    }
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
        window.scrollTo(0, 0);

        window.addEventListener("scroll", () => {
            scrolling = true;
        });

        startTransition(() => {
            getProducts();
        });

        document.title = "Amazing - Shopping, as simple as it can get";
    }, []);

    let scrolling = false;

    setInterval(() => {
        if (scrolling) {
            scrolling = false;

            let documentHeight = document.body.scrollHeight;
            let currentScroll = window.scrollY + window.innerHeight;

            if (currentScroll + 100 > documentHeight) {
                setProductDisplayed(
                    (productsDisplayed) => productsDisplayed + 3
                );
            }
        }
    }, 300);

    return (
        <>
            <NavBar searchProducts={getProducts} />

            <div className="shop-page">
                <div className="select-category">
                    <div className="title">Filter by category</div>

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
                                productsDisplayed={productsDisplayed}
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
