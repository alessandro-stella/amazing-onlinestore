import axios from "axios";
import { useEffect, useState } from "react";
import LoadingData from "./LoadingData";
import AlertMessage from "./AlertMessage";

function OrderCard({ orderData }) {
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

    const [orderDate, setOrderDate] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [time, setTime] = useState("");
    const [productData, setProductData] = useState("loading");

    useEffect(() => {
        const getProductData = async () => {
            await axios
                .post("/product/getProductById", {
                    productId: orderData.productId,
                })
                .then((res) => {
                    setProductData(res.data.product);
                })
                .catch((err) => console.log(err));
        };

        if (orderData.msg !== "deleted-item") {
            getProductData();
        } else {
            setProductData(orderData.msg);
        }

        formatDates(orderData.orderDate, orderData.deliveryDate);
        formatTime(orderData.orderDate);
    }, []);

    function formatDates(orderDate, deliveryDate) {
        const tempOrderDate = new Date(orderDate);
        const tempDeliveryDate = new Date(deliveryDate);

        let day, month, year, fullDate;

        day = tempOrderDate.getDate();
        month = months[tempOrderDate.getMonth()];
        year = tempOrderDate.getFullYear().toString();

        fullDate = day + " " + month + " " + year;

        setOrderDate(fullDate);

        day = tempDeliveryDate.getDate();
        month = months[tempDeliveryDate.getMonth()];
        year = tempDeliveryDate.getFullYear().toString();

        fullDate = day + " " + month + " " + year;

        setDeliveryDate(fullDate);
    }

    function formatTime(date) {
        const orderDate = new Date(date);

        let hour = orderDate.getHours().toString();
        hour = hour.length === 2 ? hour : "0" + hour;
        let minute = orderDate.getMinutes().toString();
        minute = minute.length === 2 ? minute : "0" + minute;

        setTime(hour + ":" + minute);
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
                <div className="ordered-item">
                    {productData === "deleted-item" ? (
                        <div className="deleted-item">
                            <AlertMessage alertMessage="The seller has deleted this item" />
                            <div>Order date: {orderDate}</div>
                            <div>Delivery date: {deliveryDate}</div>
                        </div>
                    ) : (
                        <div>
                            <div>Name: {productData.name}</div>
                            <div>Time: {time}</div>
                            <div>Order date: {orderDate}</div>
                            <div>Delivery date: {deliveryDate}</div>
                            <div>
                                Quantity: {orderData.productQuantity} items
                            </div>
                            <div>
                                Total price:{" "}
                                {formatPrice(
                                    productData.price *
                                        orderData.productQuantity
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default OrderCard;
