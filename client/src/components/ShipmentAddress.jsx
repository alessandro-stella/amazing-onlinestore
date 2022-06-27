import { useContext, useEffect, useState } from "react";
import "../styles/checkoutPage.css";
import { Button } from "@mui/material";
import InputField from "./InputField";
import siteContext from "../siteContext";
import AlertMessage from "./AlertMessage";
import axios from "axios";
import LoadingData from "./LoadingData";

function ShipmentAddress() {
    const { isSmall, userId } = useContext(siteContext);

    const [isEditing, setIsEditing] = useState("loading");
    const [alertMessage, setAlertMessage] = useState("");

    const [intercom, setIntercom] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [postalCode, setPostalCode] = useState("");

    useEffect(() => {
        if (userId.length > 24) {
            return;
        }

        const getShipmentInfo = async () => {
            await axios
                .post("/user/getUserShipmentInfo", { userId })
                .then((res) => {
                    let data = res.data.shipmentInfo;
                    updateComponentData(data);

                    let allFull = true;

                    Object.keys(data)
                        .map((key) => data[key])
                        .forEach((singleProperty) => {
                            if (!allFull) {
                                return;
                            }

                            if (singleProperty === "") {
                                allFull = false;
                            }
                        });

                    setIsEditing(!allFull);
                })
                .catch((err) => setAlertMessage("requestError"));
        };

        getShipmentInfo();
    }, [userId]);

    function updateComponentData(data) {
        setIntercom(data.intercom);
        setAddress(data.address);
        setCity(data.city);
        setCountry(data.country);
        setPostalCode(data.postalCode);
    }

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
                let newShipmentInfo = {
                    intercom,
                    address,
                    city,
                    country,
                    postalCode,
                };

                setIsEditing("loading");

                const updateData = async () => {
                    await axios
                        .post("/user/updateUserShipmentInfo", {
                            userId,
                            newShipmentInfo,
                        })
                        .then((res) => {
                            updateComponentData(res.data.shipmentInfo);
                            setIsEditing(false);
                        })
                        .catch((err) => {
                            setAlertMessage("requestError");
                        });
                };

                updateData();
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
            <div
                className={`shipment-address__inner${
                    alertMessage === "requestError" ? " fetch-error" : ""
                }`}>
                {isEditing === "loading" ? (
                    <>
                        {alertMessage === "requestError" ? (
                            <AlertMessage alertMessage="There's been an error during the process, please try again later" />
                        ) : (
                            <LoadingData />
                        )}
                    </>
                ) : (
                    <>
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

                        {alertMessage && alertMessage !== "requestError" && (
                            <AlertMessage alertMessage={alertMessage} />
                        )}
                    </>
                )}
            </div>

            {(alertMessage === "" || alertMessage !== "requestError") && (
                <Button
                    className="shipment-button"
                    size={isSmall ? "large" : "small"}
                    variant={isEditing ? "contained" : "outlined"}
                    onClick={() => checkData()}>
                    {isEditing ? "Confirm" : "Edit"}
                </Button>
            )}
        </div>
    );
}

export default ShipmentAddress;
