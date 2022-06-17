import { useEffect, useState } from "react";
import "../styles/productsContainer.css";
import ProductCard from "./ProductCard";

function ProductsContainer({
    products,
    categoryFilter,
    isSeller,
    disableClick,
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
    }, [products]);

    useEffect(() => {
        filterProducts();
    }, [categoryFilter]);

    return (
        <div className="products-container">
            {noMatches ? (
                <div className="no-products">
                    No products found with these criteria
                </div>
            ) : (
                <>
                    {filteredProducts.map((singleProduct) => (
                        <ProductCard
                            key={singleProduct._id}
                            props={{ ...singleProduct, isSeller, disableClick }}
                        />
                    ))}
                </>
            )}
        </div>
    );
}

export default ProductsContainer;
