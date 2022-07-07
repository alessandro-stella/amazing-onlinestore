import axios from "axios";
import { useContext, useEffect, useState } from "react";
import LoadingData from "./LoadingData";
import AlertMessage from "./AlertMessage";
import { Button, Tooltip, tooltipClasses } from "@mui/material";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import siteContext from "../siteContext";

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#fff",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: 220,
        border: "1px solid #dadde9",
        padding: "1em 1.5em 1em 1em",
    },
}));

function OrderCard({ orderData, orderIndex }) {
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

    const navigate = useNavigate();
    const { userId } = useContext(siteContext);

    const [orderDate, setOrderDate] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [deliveryMessage, setDeliveryMessage] = useState("");
    const shipmentInfo = orderData.shipmentInfo;

    const [productData, setProductData] = useState("loading");

    const [alertMessage, setAlertMessage] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");

    useEffect(() => {
        const getProductData = async () => {
            await axios
                .post("/product/getProductById", {
                    productId: orderData.productId,
                })
                .then((res) => {
                    setProductData(res.data.product);
                })
                .catch((err) =>
                    setAlertMessage(
                        "There's been an error during the process, please try again"
                    )
                );
        };

        if (orderData.msg !== "deleted-item") {
            getProductData();
        } else {
            setProductData(orderData.msg);
        }

        formatDates(orderData.orderDate, orderData.deliveryDate);
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

        let today = new Date();

        if (today.toDateString() === tempDeliveryDate.toDateString()) {
            fullDate = "Today";
        } else {
            day = tempDeliveryDate.getDate();
            month = months[tempDeliveryDate.getMonth()];
            year = tempDeliveryDate.getFullYear().toString();

            fullDate = day + " " + month + " " + year;
        }

        if (fullDate !== "Today") {
            if (today.getTime() > tempDeliveryDate.getTime()) {
                setDeliveryMessage("Delivered on ");
            } else {
                setDeliveryMessage("Delivery scheduled for ");
            }
        }

        setDeliveryDate(fullDate);
    }

    function formatPrice(price) {
        let tempPrice = price;

        tempPrice = tempPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
        });

        return tempPrice;
    }

    async function deleteOrder() {
        await axios
            .post("/history/deleteOrder", { userId, orderIndex })
            .then((res) => navigate(0))
            .catch((err) => {
                setDeleteMessage(
                    "There's been an error during the process, please try again"
                );
                resetAlert();
            });
    }

    function resetAlert() {
        setTimeout(() => {
            setDeleteMessage("");
        }, 2500);
    }

    return (
        <>
            {alertMessage ? (
                <AlertMessage alertMessage={alertMessage} />
            ) : (
                <>
                    {productData === "loading" ? (
                        <LoadingData />
                    ) : (
                        <div className="ordered-item">
                            <div className="ordered-item__header">
                                <div className="order-info__section">
                                    <div className="order-info__section-title">
                                        Order date
                                    </div>
                                    <div className="order-info__section-body">
                                        {orderDate}
                                    </div>
                                </div>

                                <div className="order-info__section">
                                    <div className="order-info__section-title">
                                        Total price
                                    </div>
                                    <div className="order-info__section-body">
                                        $
                                        {formatPrice(
                                            productData.price *
                                                orderData.productQuantity
                                        )}
                                    </div>
                                </div>
                                <div className="order-info__section">
                                    <div className="order-info__section-title">
                                        Send to
                                    </div>
                                    <div className="order-info__section-body">
                                        <HtmlTooltip
                                            title={
                                                <>
                                                    <h2>
                                                        {shipmentInfo.intercom}
                                                    </h2>
                                                    <p>
                                                        {shipmentInfo.address}
                                                    </p>
                                                    <p>
                                                        {shipmentInfo.city}{" "}
                                                        {
                                                            shipmentInfo.postalCode
                                                        }
                                                        , {shipmentInfo.country}
                                                    </p>
                                                    <p></p>
                                                </>
                                            }
                                            arrow>
                                            <a>{shipmentInfo.intercom}</a>
                                        </HtmlTooltip>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`ordered-item__body${
                                    productData === "deleted-item"
                                        ? "no-padding"
                                        : ""
                                }`}>
                                {productData === "deleted-item" ? (
                                    <AlertMessage alertMessage="The seller has deleted this item" />
                                ) : (
                                    <div className="order-card__body">
                                        <div className="delivery-info">
                                            <div>
                                                {deliveryMessage} {deliveryDate}
                                            </div>
                                        </div>

                                        <div className="order-card__body-inner">
                                            <div
                                                className="order-card__body__image"
                                                style={{
                                                    backgroundImage: `url("${productData.image}")`,
                                                }}></div>

                                            <div className="order-card__body__info">
                                                <div className="product-name">
                                                    {productData.name}
                                                </div>
                                                <div>
                                                    Units purchased:{" "}
                                                    {orderData.productQuantity}{" "}
                                                    units
                                                </div>

                                                <Button
                                                    variant="contained"
                                                    onClick={() => {
                                                        navigate(
                                                            `/productPage/${productData._id}`
                                                        );
                                                    }}>
                                                    Buy again
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="ordered-item__footer">
                                <a onClick={() => deleteOrder()}>
                                    Delete order
                                </a>

                                {deleteMessage && (
                                    <AlertMessage
                                        alertMessage={deleteMessage}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default OrderCard;
