import { Button } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import siteContext from "../siteContext";
import "../styles/completedCheckout.css";

function CompletedCheckout({ orderInfo }) {
    const total = formatPrice(orderInfo.totalPayment);
    const { address, city, country, intercom, postalCode } = JSON.parse(
        orderInfo.shipmentInfo
    );

    const { isSmall } = useContext(siteContext);
    const navigate = useNavigate();

    function formatPrice(price) {
        let tempPrice = price;

        tempPrice = tempPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
        });

        return tempPrice;
    }

    return (
        <div className="completed-order">
            <div className="completed-order__title">Order completed!</div>

            <div className="completed-order__message">
                Thank you for your purchase! We've sent you an email with all
                the informations about your order
            </div>

            <div className="completed-order__info">
                <div className="completed-order__info__title">
                    Shipment info
                </div>

                <div className="completed-order__info-section">
                    <div className="completed-order__info-section__category">
                        Address
                    </div>
                    {address}
                </div>
                <div className="completed-order__info-section">
                    <div className="completed-order__info-section__category">
                        City
                    </div>
                    {city}
                </div>
                <div className="completed-order__info-section">
                    <div className="completed-order__info-section__category">
                        Country
                    </div>
                    {country}
                </div>
                <div className="completed-order__info-section">
                    <div className="completed-order__info-section__category">
                        Intercom
                    </div>
                    {intercom}
                </div>
                <div className="completed-order__info-section">
                    <div className="completed-order__info-section__category">
                        Postal Code
                    </div>
                    {postalCode}
                </div>
            </div>

            <div className="completed-order__info total">
                <div className="completed-order__info-section">
                    <div className="completed-order__info-section__category">
                        Amount payed
                    </div>
                    ${total}
                </div>
            </div>

            <div className="completed-order__buttons-container">
                <Button
                    size="large"
                    fullWidth
                    variant="contained"
                    className="completed-order__button"
                    onClick={() => navigate("/shopPage")}>
                    Back to the shop
                </Button>

                <div className="completed-order__buttons-container__inner">
                    <Button
                        size={isSmall ? "large" : "small"}
                        variant="outlined"
                        className="completed-order__button"
                        onClick={() => navigate("/userPage/orderHistory")}>
                        order history
                    </Button>
                    <Button
                        size={isSmall ? "large" : "small"}
                        variant="outlined"
                        className="completed-order__button"
                        onClick={() => alert("PRINT ORDER")}>
                        Print order
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CompletedCheckout;
