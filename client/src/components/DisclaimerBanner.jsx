import { Button } from "@mui/material";
import { useContext } from "react";
import siteContext from "../siteContext";
import "../styles/disclaimerBanner.css";

function DisclaimerBanner({ closeBanner }) {
    const { isSmall } = useContext(siteContext);

    return (
        <div className="disclaimer-banner">
            <div className="disclaimer-title">Disclaimer</div>

            <div className="disclaimer-text">
                This site <span>IS NOT</span> a real e-commerce website, it{" "}
                <span>DOES NOT</span> handle real transactions and it{" "}
                <span>DOES NOT</span> sell real products.
                <br />
                <br />
                All of the data inserted by our users is used and will be used
                only for academical purposes, without sharing them with third
                party organizations.
                <br />
                <br />
                The website name, general style and general functionalities has
                been copied by the famous e-commerce website{" "}
                <a
                    href="https://amazon.com"
                    no-referrer="true"
                    target="_blank"
                    clicktracking="off">
                    Amazon
                </a>
                , and all the legal rights goes to it. This site is not intended
                as a copy, it only takes free inspiration from its main design
                and operations.
            </div>

            <Button
                size={isSmall ? "large" : "small"}
                variant="contained"
                onClick={() => closeBanner(true)}>
                I understood
            </Button>
        </div>
    );
}

export default DisclaimerBanner;
