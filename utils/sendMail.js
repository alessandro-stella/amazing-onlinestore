const nodemailer = require("nodemailer");

const sendEmail = (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const welcomeEmailText = `<div
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
        href="https://amazon-dei-poveri.herokuapp.com/shopPage"
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
            background-color: hsl(35, 100%, 55%);
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
        href="https://amazon-dei-poveri.herokuapp.com/deleteAccountPage/${options.deleteAccountToken}"
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

    const resetPasswordText = `<div
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
    href="https://amazon-dei-poveri.herokuapp.com/resetPassword/${options.resetPasswordToken}"
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
            background-color: hsl(35, 100%, 55%);
            z-index: 1;
        "
        >Go to the reset password page</a
    >
    </div>`;

    const mailOptions = {
        from: process.env.FROM,
        to: options.to,
        subject: options.subject,
        html: options.resetPasswordToken ? resetPasswordText : welcomeEmailText,
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log("email not sent");
        }
    });
};

module.exports = sendEmail;
