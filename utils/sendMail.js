const nodemailer = require("nodemailer");

function getEmailText(options, emailType) {
    let emailBody;

    switch (emailType) {
        case "resetPassword":
            emailBody = `<div
            style="
                color: #000;
                padding: 2em;
                border: 1px solid #ccc;
        
                margin: 0.5em;
                font-size: 1.25em;
        
                position: relative;
            "
        >
            <div style="font-size: 2em; font-weight: bold">
                Request for password reset
            </div>
        
            <div
                style="
                    width: 100%;
        
                    display: flex;
                    flex-direction: column;
                    align-items: center;
        
                    margin-top: 1em;
                    margin-bottom: 0.5em;
                "
            >
                It seems that you requested to reset your password. Click the
                button below to visit our site and complete the process. Be aware, the link will expire soon!
                <br />
                - Amazing Staff
            </div>
        
            <a
            href="https://amazing-onlinestore.herokuapp.com/resetPassword/${options.resetPasswordToken}"
                no-referrer
                target="_blank"
                clicktracking="off"
                style="
                    display: -webkit-inline-box;
                    display: -webkit-inline-flex;
                    display: -ms-inline-flexbox;
                    display: inline-flex;
                    -webkit-align-items: center;
                    -webkit-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    -webkit-box-pack: center;
                    -ms-flex-pack: center;
                    -webkit-justify-content: center;
                    justify-content: center;
                    position: relative;
                    box-sizing: border-box;
                    -webkit-tap-highlight-color: transparent;
                    background-color: transparent;
                    outline: 0;
                    border: 0;
                    margin: 0;
                    border-radius: 0;
                    padding: 0;
                    cursor: pointer;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    vertical-align: middle;
                    -moz-appearance: none;
                    -webkit-appearance: none;
                    -webkit-text-decoration: none;
                    text-decoration: none;
                    color: inherit;
                    font-family: amazonEmber, Helvetica, Arial;
                    font-weight: 500;
                    font-size: 0.875rem;
                    line-height: 1.75;
                    text-transform: uppercase;
                    min-width: 64px;
                    padding: 6px 16px;
                    border-radius: 4px;
                    color: rgba(0, 0, 0, 0.87);
                    background-color: hsl(166, 93%, 48%);
                    z-index: 1;
                "
                >Go to the reset password page</a
            >
            </div>`;
            break;

        case "welcomeEmail":
            emailBody = `<div
            style="
                color: #000;
                padding: 2em;
                border: 1px solid #ccc;
        
                margin: 0.5em;
                font-size: 1.25em;
            "
        >
            <div style="font-size: 2em; font-weight: bold">
                Welcome ${options.username}
            </div>
        
            <div
                style="
                    width: 100%;
        
                    display: flex;
                    flex-direction: column;
                    align-items: center;
        
                    margin-top: 1em;
                    margin-bottom: 0.5em;
                "
            >
                We're glad to have you as one of our many customers, and we'll
                do the best we can to ensure you a great experience. <br />
                Browse the infinity of products that our site has to offer, or
                sell what you want in your personal seller account. Enjoy!
                <br />
                - Amazing Staff
            </div>
        
            <a
                href="https://amazing-onlinestore.herokuapp.com/shopPage"
                no-referrer
                target="_blank"
                clicktracking="off"
                style="
                    display: -webkit-inline-box;
                    display: -webkit-inline-flex;
                    display: -ms-inline-flexbox;
                    display: inline-flex;
                    -webkit-align-items: center;
                    -webkit-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    -webkit-box-pack: center;
                    -ms-flex-pack: center;
                    -webkit-justify-content: center;
                    justify-content: center;
                    position: relative;
                    box-sizing: border-box;
                    -webkit-tap-highlight-color: transparent;
                    background-color: transparent;
                    outline: 0;
                    border: 0;
                    margin: 0;
                    border-radius: 0;
                    padding: 0;
                    cursor: pointer;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    vertical-align: middle;
                    -moz-appearance: none;
                    -webkit-appearance: none;
                    -webkit-text-decoration: none;
                    text-decoration: none;
                    color: inherit;
                    font-family: amazonEmber, Helvetica, Arial;
                    font-weight: 500;
                    font-size: 0.875rem;
                    line-height: 1.75;
                    text-transform: uppercase;
                    min-width: 64px;
                    padding: 6px 16px;
                    border-radius: 4px;
                    color: rgba(0, 0, 0, 0.87);
                    background-color: hsl(166, 93%, 48%);
                    "
                >Visit our website</a
            >
        
            <br />
            <br />
        
            <div
                style="
                    width: 100%;
        
                    display: flex;
                    align-items: center;
                    justify-content: center;
        
                    margin-top: 1em;
                    margin-bottom: 0.5em;
                "
            >
                If the registration happened without your consent or you want to
                delete your account, you can do it here
            </div>
            <a
                href="https://amazing-onlinestore.herokuapp.com/deleteAccountPage/${options.deleteAccountToken}"
                no-referrer
                target="_blank"
                clicktracking="off"
                style="
                    padding: 0.35em 0.75em;
                    text-align: center;
        
                    border: none;
                    border-radius: 0.25em;
        
                    cursor: pointer;
        
                    background-color: #eee;
                    border: 1px solid #bbb;
                    color: #000;
        
                    text-decoration: none;
                "
                >Delete account</a
            >
            </div>`;
            break;

        case "orderSummary":
            let shipmentInfo = JSON.parse(options.shipmentInfo);

            emailBody = `<div
                    class="completed-order"
                    style="
                        padding: 1em;
                        box-shadow: 0 0.2em 0.5em #ccc;
                        gap: 1em;
                        color: #0f1111
                    "
                >
                    <div
                        class="completed-order__title"
                        style="font-size: 2.5em; font-weight: bold"
                    >
                        Thanks for your purchase!
                    </div>
                    <div
                        class="completed-order__message"
                        style="margin-bottom: 3em"
                    >
                        Here's a brief summary with all the
                        informations about your order
                    </div>
                    <div
                        class="completed-order__info"
                    >
                        <div
                            class="completed-order__info__title"
                            style="font-size: 1.25em"
                        >
                            Shipment info
                        </div>
                        <div
                            class="completed-order__info-section"
                            style="
                                color: #0f111180;
                                display:flex;
                            "
                        >
                            <div class="completed-order__info-section__category" style="width:40%">
                                Intercom: ${shipmentInfo.intercom}
                            </div>
                        </div>
                        <div
                            class="completed-order__info-section"
                            style="
                                color: #0f111180;
                            "
                        >
                            <div class="completed-order__info-section__category">
                                Address: ${shipmentInfo.address}
                        </div>
                        <div
                            class="completed-order__info-section"
                            style="
                                color: #0f111180;
                            "
                        >
                            <div class="completed-order__info-section__category">
                                City: ${shipmentInfo.city}
                        </div>
                        <div
                            class="completed-order__info-section"
                            style="
                                color: #0f111180;
                            "
                        >
                            <div class="completed-order__info-section__category">
                                Country: ${shipmentInfo.country}
                        </div>
                        <div
                            class="completed-order__info-section"
                            style="
                                color: #0f111180;
                            "
                        >
                            <div class="completed-order__info-section__category">
                                Postal Code: ${shipmentInfo.postalCode}
                        </div>
                    </div>
                    <div
                        class="completed-order__info total"
                        style="
                            font-size: 1.5em;
                            position: relative;
                            margin-top: calc(1em / 1.5);
                        "
                    >
                        <div
                            class="completed-order__info-section"
                            style="
                                color: #0f1111;

                                margin-bottom: 1em;
                            "
                        >
                            <div class="completed-order__info-section__category">
                                Amount payed: $${options.totalPayment}
                        </div>
                    </div>
                    <div
                        class="completed-order__buttons-container"
                    >
                        <a
                            tabindex="0"
                            type="button"
                            style="
                                display: inline-flex;
                                -webkit-box-align: center;
                                align-items: center;
                                -webkit-box-pack: center;
                                justify-content: center;
                                position: relative;
                                box-sizing: border-box;
                                -webkit-tap-highlight-color: transparent;
                                outline: 0;
                                border: 0;
                                margin: 0;
                                cursor: pointer;
                                user-select: none;
                                vertical-align: middle;
                                -webkit-appearance: none;
                                text-decoration: none;
                                font-family: amazonEmber, Helvetica, Arial;
                                font-weight: 500;
                                font-size: 0.9375rem;
                                line-height: 1.75;
                                text-transform: uppercase;
                                min-width: 64px;
                                padding: 8px 22px;
                                border-radius: 4px;
                                color: rgba(0, 0, 0, 0.87);
                                background-color: hsl(166, 93%, 48%);
                                box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
                                    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
                                    0px 1px 5px 0px rgba(0, 0, 0, 0.12);
                                cursor: pointer;
                            "
                            href="https://amazing-onlinestore.herokuapp.com/shopPage"
                            no-referrer
                            target="_blank"
                            clicktracking="off"
                        >
                            Back to the shop
                        </a>
                        <a
                            style="
                                display: -webkit-inline-box;
                                display: -webkit-inline-flex;
                                display: -ms-inline-flexbox;
                                display: inline-flex;
                                -webkit-align-items: center;
                                -webkit-box-align: center;
                                -ms-flex-align: center;
                                align-items: center;
                                -webkit-box-pack: center;
                                -ms-flex-pack: center;
                                -webkit-justify-content: center;
                                justify-content: center;
                                position: relative;
                                box-sizing: border-box;
                                -webkit-tap-highlight-color: transparent;
                                background-color: transparent;
                                outline: 0;
                                border: 0;
                                margin: 0;
                                border-radius: 0;
                                padding: 0;
                                cursor: pointer;
                                -webkit-user-select: none;
                                -moz-user-select: none;
                                -ms-user-select: none;
                                user-select: none;
                                vertical-align: middle;
                                -moz-appearance: none;
                                -webkit-appearance: none;
                                -webkit-text-decoration: none;
                                text-decoration: none;
                                color: inherit;
                                font-family: amazonEmber, Helvetica, Arial;
                                font-weight: 500;
                                font-size: 0.8125rem;
                                line-height: 1.75;
                                text-transform: uppercase;
                                min-width: 64px;
                                padding: 8px 22px;
                                border-radius: 4px;
                                border: 1px solid hsla(166, 93%, 48%, 0.5);
                                color: hsl(166, 93%, 48%);
                            "
                            tabindex="0"
                            type="button"
                            href="https://amazing-onlinestore.herokuapp.com/userPage/orderHistory"
                            no-referrer
                            target="_blank"
                            clicktracking="off"
                        >
                            order history</span>
                        </a>
                    </div>
                </div>`;
            break;

        default:
            break;
    }

    return emailBody;
}

const sendEmail = (options, emailType) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const emailOptions = {
        from: process.env.FROM,
        to: options.to,
        subject: options.subject,
        html: getEmailText(options, emailType),
    };

    let returnValue;

    transporter.sendMail(emailOptions, function (err, info) {
        if (err) {
            returnValue = err;
        } else {
            returnValue = info;
        }
    });

    return returnValue;
};

module.exports = sendEmail;
