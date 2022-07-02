import { Button } from "@mui/material";
import axios from "axios";
import { startTransition, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingData from "./LoadingData";
import NavBar from "./NavBar";
import siteContext from "../siteContext";
import OrderCard from "./OrderCard";
import "../styles/orderHistory.css";

function OrderHistory() {
    const navigate = useNavigate();
    const { isSmall, userId } = useContext(siteContext);
    const [purchases, setPurchases] = useState("Loading...");

    useEffect(() => {
        if (!userId) {
            navigate("/loginPage");
        } else {
            if (userId.length <= 24) {
                startTransition(() => {
                    axios
                        .post("/history/getUserOrders", {
                            userId,
                        })
                        .then((res) => {
                            setPurchases(res.data.orders);
                        })
                        .catch((err) => console.log(err));
                });
            }
        }
    }, [userId]);

    return (
        <>
            <NavBar />

            <div className="user-page">
                <div className="title-container">
                    <div className="title">order history</div>
                    <Button
                        size={isSmall ? "large" : "small"}
                        style={{ minWidth: "30%" }}
                        variant="contained"
                        onClick={() => navigate("/userPage")}>
                        go back
                    </Button>
                </div>

                {purchases === "Loading..." ? (
                    <LoadingData />
                ) : (
                    <>
                        {purchases.length === 0 ? (
                            <h1>No purchases</h1>
                        ) : (
                            <>
                                {purchases.map((singlePurchase, index) => (
                                    <OrderCard
                                        key={index}
                                        orderData={singlePurchase}
                                    />
                                ))}
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default OrderHistory;
