import axios from "axios";
import { useEffect, useState } from "react";
import LoadingData from "./LoadingData";

function OrderCard({ orderData }) {
    console.log(orderData);
    useEffect(() => {
        formatDate(orderData.orderDate);

        const getProductData = async () => {
            await axios
                .post("/product/getProductById", {
                    productId: orderData.productId,
                })
                .then((res) => setProductData(res.data.product))
                .catch((err) => console.log(err));
        };

        getProductData();
    }, []);

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [productData, setProductData] = useState("loading");

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    function formatDate(date) {
        const orderDate = new Date(date);

        let day = orderDate.getDay();
        let month = months[orderDate.getMonth()];
        let year = orderDate.getFullYear().toString();

        let fullDate = day + " " + month + " " + year;

        let hour = orderDate.getHours().toString();
        hour = hour.length === 2 ? hour : "0" + hour;
        let minute = orderDate.getMinutes().toString();
        minute = minute.length === 2 ? minute : "0" + minute;

        setTime(hour + ":" + minute);
        setDate(fullDate);
    }

    function formatPrice(price) {
        let tempPrice = price;

        tempPrice = tempPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
        });

        return tempPrice;
    }

    return (
        <>
            {productData === "loading" ? (
                <LoadingData />
            ) : (
                <>
                    <div>
                        <div>Name: {productData.name}</div>
                        <div>Time: {time}</div>
                        <div>Date: {date}</div>
                        <div>Quantity: {orderData.productQuantity} items</div>
                        <div>
                            Total price:{" "}
                            {formatPrice(
                                productData.price * orderData.productQuantity
                            )}
                        </div>
                    </div>

                    <br />
                </>
            )}
        </>
    );
}

export default OrderCard;
