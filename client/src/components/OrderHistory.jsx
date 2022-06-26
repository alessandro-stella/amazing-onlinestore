import { Button } from "@mui/material";
import axios from "axios";
import { startTransition, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingData from "./LoadingData";
import NavBar from "./NavBar";
import siteContext from "../siteContext";

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
                <div>order history</div>

                {purchases === "Loading..." ? (
                    <LoadingData />
                ) : (
                    <>
                        {purchases.length === 0 ? (
                            <h1>No purchases</h1>
                        ) : (
                            <h1>{purchases.length}</h1>
                        )}
                    </>
                )}

                <Button
                    size={isSmall ? "large" : "small"}
                    style={{ minWidth: "30%" }}
                    variant="contained"
                    onClick={() => navigate("/userPage")}>
                    go back
                </Button>
            </div>
        </>
    );
}

export default OrderHistory;
