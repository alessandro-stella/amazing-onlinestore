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
    const [purchases, setPurchases] = useState("loading");

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
                    <div className="title">Order history</div>
                    <Button
                        size={isSmall ? "large" : "small"}
                        style={{ minWidth: "30%" }}
                        variant="contained"
                        onClick={() => navigate("/userPage")}>
                        go back
                    </Button>
                </div>

                {purchases === "loading" ? (
                    <LoadingData />
                ) : (
                    <>
                        {purchases.length === 0 ? (
                            <h1>No purchases</h1>
                        ) : (
                            <div className="ordered-items__container">
                                {purchases.map((singlePurchase, index) => (
                                    <OrderCard
                                        key={index}
                                        orderData={singlePurchase}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default OrderHistory;
