import { useEffect, useState } from "react";
import "../styles/productsContainer.css";
import ProductCard from "./ProductCard";

function ProductsContainer({
    products,
    categoryFilter,
    getProducts,
    isSeller,
    disableClick,
    productsDisplayed,
}) {
    const [noMatches, setNoMatches] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);

    function filterProducts() {
        let tempProducts = products.map((singleProduct) => {
            if (singleProduct.inStock === "0" && isSeller !== true) {
                return "not-valid";
            }

            if (categoryFilter === "All" || categoryFilter === undefined) {
                return singleProduct;
            }

            if (singleProduct.category === categoryFilter) {
                return singleProduct;
            }

            return "not-valid";
        });

        tempProducts = tempProducts.filter(
            (product) => product !== "not-valid"
        );

        if (tempProducts.length === 0) {
            setNoMatches(true);
        } else {
            setNoMatches(false);
        }

        setFilteredProducts(tempProducts);
    }

    useEffect(() => {
        filterProducts();
    }, [products, categoryFilter]);

    return (
        <div className="products-container">
            {noMatches ? (
                <div className="no-products">
                    No products found with these criteria
                </div>
            ) : (
                <>
                    {filteredProducts.map((singleProduct, index) => {
                        if (!productsDisplayed) {
                            return (
                                <ProductCard
                                    key={singleProduct._id}
                                    props={{
                                        ...singleProduct,
                                        isSeller,
                                        disableClick,
                                        getProducts,
                                    }}
                                />
                            );
                        }

                        return (
                            index + 1 <= productsDisplayed && (
                                <ProductCard
                                    key={singleProduct._id}
                                    props={{
                                        ...singleProduct,
                                        isSeller,
                                        disableClick,
                                        getProducts,
                                    }}
                                />
                            )
                        );
                    })}
                </>
            )}
        </div>
    );
}

export default ProductsContainer;
