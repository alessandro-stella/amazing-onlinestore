import { Alert } from "@mui/material";
import { useEffect, useState } from "react";

function AlertMessage({ alertMessage }) {
    const [alertSeverity, setAlertSeverity] = useState("");
    const [alertTitle, setAlertTitle] = useState("");

    useEffect(() => {
        let tempAlertSeverity = "";
        let tempAlertTitle = "";

        switch (alertMessage) {
            case "Missing data":
                tempAlertSeverity = "warning";
                tempAlertTitle = "Warning";
                break;

            case "Missing or wrong data":
                tempAlertSeverity = "warning";
                tempAlertTitle = "Warning";
                break;

            case "Loading image...":
                tempAlertSeverity = "info";
                tempAlertTitle = "Processing";
                break;

            case "We're processing your request":
                tempAlertSeverity = "info";
                tempAlertTitle = "Processing";
                break;

            case "Image uploaded successfully":
                tempAlertSeverity = "success";
                tempAlertTitle = "Success";
                break;

            case "Username changed successfully":
                tempAlertSeverity = "success";
                tempAlertTitle = "Success";
                break;

            case "Product uploaded successfully":
                tempAlertSeverity = "success";
                tempAlertTitle = "Success";
                break;

            case "Product added successfully":
                tempAlertSeverity = "success";
                tempAlertTitle = "Success";
                break;

            case "Password changed successfully":
                tempAlertSeverity = "success";
                tempAlertTitle = "Success";
                break;

            case "We've sent you an email with the instructions to reset your password":
                tempAlertSeverity = "success";
                tempAlertTitle = "Success";
                break;

            case "Account deleted successfully":
                tempAlertSeverity = "success";
                tempAlertTitle = "Success";
                break;

            case "Wrong confirmation word":
                tempAlertSeverity = "warning";
                tempAlertTitle = "Warning";
                break;

            case "Exceeded maximum quantity":
                tempAlertSeverity = "warning";
                tempAlertTitle = "Warning";
                break;

            case "The passwords does not coincide":
                tempAlertSeverity = "warning";
                tempAlertTitle = "Warning";
                break;

            case "The usernames does not coincide":
                tempAlertSeverity = "warning";
                tempAlertTitle = "Warning";
                break;

            case "The password is too short":
                tempAlertSeverity = "warning";
                tempAlertTitle = "Warning";
                break;

            case "The username is too short":
                tempAlertSeverity = "warning";
                tempAlertTitle = "Warning";
                break;

            case "Missing shipment info":
                tempAlertSeverity = "warning";
                tempAlertTitle = "Warning";
                break;

            case "The seller has deleted this item":
                tempAlertSeverity = "warning";
                tempAlertTitle = "Warning";
                break;

            case "No products found with these criteria":
                tempAlertSeverity = "warning";
                tempAlertTitle = "Warning";
                break;

            default:
                tempAlertSeverity = "error";
                tempAlertTitle = "Error";
                break;
        }

        setAlertSeverity(tempAlertSeverity);
        setAlertTitle(tempAlertTitle);
    }, [alertMessage]);

    return (
        <div className="alert-message">
            {alertSeverity ? (
                <Alert severity={alertSeverity}>
                    <strong>{alertTitle}</strong> - {alertMessage}
                </Alert>
            ) : null}
        </div>
    );
}

export default AlertMessage;
