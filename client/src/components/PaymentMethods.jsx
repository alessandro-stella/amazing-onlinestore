import "../styles/checkoutPage.css";

import PayPalIcon from "../icons/payPalIcon.svg?component";
import AppleIcon from "../icons/appleIcon.svg?component";
import CreditCardIcon from "../icons/creditCardIcon.svg?component";
import GoogleIcon from "../icons/googleIcon.svg?component";
import { useState } from "react";

function PaymentMethods() {
    const payments = [
        { method: "Credit / Debit Card", icon: CreditCardIcon },
        { method: "PayPal", icon: PayPalIcon },
        { method: "Apple Pay", icon: AppleIcon },
        { method: "Google Pay", icon: GoogleIcon },
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

                    <singleOption.icon className="logo" />
                </div>
            ))}
        </div>
    );
}

export default PaymentMethods;
