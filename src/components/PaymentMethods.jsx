import "../styles/checkoutPage.css";

import {
    faApplePay, faGooglePay, faPaypal
} from "@fortawesome/free-brands-svg-icons";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function PaymentMethods() {
    const payments = [
        { method: "Credit / Debit Card", icon: faCreditCard },
        { method: "PayPal", icon: faPaypal },
        { method: "Apple Pay", icon: faApplePay },
        { method: "Google Pay", icon: faGooglePay },
    ];

    const [selected, setSelected] = useState(0);

    return (
        <div className="payment-methods">
            {payments.map((singleOption, index) => (
                <div
                    className={`payment-option${
                        selected === index ? " selected" : ""
                    }`}
                    key={index}
                    onClick={() => setSelected(index)}>
                    <div className="payment-option__title">
                        {singleOption.method}
                    </div>

                    <FontAwesomeIcon
                        icon={singleOption.icon}
                        size={index === 2 || index === 3 ? "4x" : "3x"}
                    />
                </div>
            ))}
        </div>
    );
}

export default PaymentMethods;
