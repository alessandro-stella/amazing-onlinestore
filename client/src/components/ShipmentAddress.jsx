import { useContext, useState } from "react";
import "../styles/checkoutPage.css";
import { Button } from "@mui/material";
import InputField from "./InputField";
import siteContext from "../siteContext";
import AlertMessage from "./AlertMessage";

function ShipmentAddress({
    intercom,
    setIntercom,
    address,
    setAddress,
    city,
    setCity,
    country,
    setCountry,
    postalCode,
    setPostalCode,
}) {
    const { isSmall } = useContext(siteContext);

    const [isEditing, setIsEditing] = useState(true);
    const [alertMessage, setAlertMessage] = useState("");

    function checkData() {
        setAlertMessage("");

        if (isEditing) {
            if (
                intercom.trim() !== "" &&
                address.trim() !== "" &&
                city.trim() !== "" &&
                country.trim() !== "" &&
                postalCode.trim() !== "" &&
                !isNaN(postalCode)
            ) {
                setIsEditing(!isEditing);
            } else {
                setAlertMessage("Missing or wrong data");
                resetAlert();
            }
        } else {
            setIsEditing(!isEditing);
        }
    }

    function resetAlert() {
        setTimeout(() => {
            setAlertMessage("");
        }, 2500);
    }

    return (
        <div className="shipment-address">
            <div className="shipment-address__inner">
                {isEditing ? (
                    <div className="editing-shipment">
                        <InputField
                            fieldValue={intercom}
                            fieldType="text"
                            fieldLabel="Intercom to call"
                            isRequired={true}
                            setValue={setIntercom}
                        />
                        <InputField
                            fieldValue={address}
                            fieldType="text"
                            fieldLabel="Address"
                            isRequired={true}
                            setValue={setAddress}
                        />
                        <InputField
                            fieldValue={city}
                            fieldType="text"
                            fieldLabel="City"
                            isRequired={true}
                            setValue={setCity}
                        />
                        <InputField
                            fieldValue={country}
                            fieldType="text"
                            fieldLabel="Country"
                            isRequired={true}
                            setValue={setCountry}
                        />
                        <InputField
                            fieldValue={postalCode}
                            fieldType="text"
                            fieldLabel="Postal Code"
                            isRequired={true}
                            setValue={setPostalCode}
                        />
                    </div>
                ) : (
                    <div className="confirmed-shipment-data">
                        <div className="shipment-data shipment-intercom">
                            {intercom}
                        </div>
                        <div className="shipment-data shipment-address">
                            {address}
                        </div>
                        <div className="shipment-data shipment-city">
                            {city}, {country} {postalCode}
                        </div>
                    </div>
                )}
            </div>

            {alertMessage && (
                <AlertMessage
                    className="alert-message"
                    alertMessage={alertMessage}
                />
            )}

            <Button
                className="shipment-button"
                size={isSmall ? "large" : "small"}
                variant={isEditing ? "contained" : "outlined"}
                onClick={() => checkData()}>
                {isEditing ? "Confirm" : "Edit"}
            </Button>
        </div>
    );
}

export default ShipmentAddress;
