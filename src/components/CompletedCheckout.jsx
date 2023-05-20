import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import siteContext from "../siteContext";
import "../styles/completedCheckout.css";

function CompletedCheckout({ orderInfo }) {
    const total = formatPrice(orderInfo.totalPayment);
    const { address, city, country, intercom, postalCode } = JSON.parse(
        orderInfo.shipmentInfo
    );

    const { userId } = useContext(siteContext);

    const outputBody = useRef(null);
    const buttonsContainer = useRef(null);

    const { isSmall } = useContext(siteContext);
    const navigate = useNavigate();

    function formatPrice(price) {
        let tempPrice = price;

        tempPrice = tempPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
        });

        return tempPrice;
    }

    function printPage() {
        let htmlToPrint = `<style type="text/css">
        .completed-order {
            padding: 2em 3em;
            box-shadow: var(--bottom-shadow);
        
            display: flex;
            flex-direction: column;
            gap: 1em;
        }
        
        .completed-order__title {
            text-align: center;
            font-size: 2.5em;
            font-weight: bold;
        }
        
        .completed-order__message {
            text-align: center;
            margin-bottom: 5em;
        }
        
        .completed-order__info:not(.total) {
            display: flex;
            flex-direction: column;
            gap: 0.5em;
        }
        
        .completed-order__info__title {
            font-size: 1.25em;
        }
        
        .completed-order__info-section {
            display: flex;
            justify-content: space-between;
            color: var(--faded-text);
        }
        
        .completed-order__buttons-container {
            width: min(40em, 100%);
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 0.5em;
        }
        
        .completed-order__buttons-container__inner {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 1em;
        }
        
        .completed-order__button {
            width: 100%;
        }

        .completed-order__info.total {
            color: #0f1111;
            font-size: 1.5em;
            position: relative;
            margin-top: calc(1em / 1.5)
        }
        </style><div class='completed-order'>`;

        let copiedBody = outputBody.current.cloneNode(true);
        copiedBody.lastChild.parentNode.removeChild(copiedBody.lastChild);

        htmlToPrint += copiedBody.innerHTML;
        htmlToPrint += "</div>";

        let windowToPrint = window.open("");
        windowToPrint.document.write(htmlToPrint);
        windowToPrint.print();
        windowToPrint.close();
    }

    useEffect(() => {
        document.title = "Amazing - All done, enjoy your purchases!";
    }, []);

    useEffect(() => {
        const sendEmail = async () => {
            await axios
                .post("/history/sendSummaryEmail", {
                    userId,
                    shipmentInfo: orderInfo.shipmentInfo,
                    totalPayment: orderInfo.totalPayment,
                })
                .then((res) => console.log(res))
                .catch((err) => console.dir(err));
        };

        if (userId.length > 24) {
            return;
        }

        sendEmail();
    }, [userId]);

    return (
        <div className="completed-order" ref={outputBody}>
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
                        Intercom
                    </div>
                    {intercom}
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

            <div
                className="completed-order__buttons-container"
                ref={buttonsContainer}>
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
                        onClick={() => printPage()}>
                        Print order
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CompletedCheckout;
