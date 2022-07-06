import { Button } from "@mui/material";
import axios from "axios";
import {
    startTransition,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
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

    const [ordersDisplayed, setOrdersDisplayed] = useState(10);
    const [loadingMoreOrders, setLoadingMoreOrders] = useState(false);

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

    useEffect(() => {
        document.title = "Amazing - Your order history"

        window.scrollTo(0, 0);

        window.addEventListener("scroll", () => {
            scrolling = true;
        });

        let scrolling = false;

        let checkScrollInterval = setInterval(() => {
            if (scrolling) {
                scrolling = false;

                let documentHeight = document.body.scrollHeight;
                let currentScroll = window.scrollY + window.innerHeight;

                if (currentScroll + 100 > documentHeight) {
                    setLoadingMoreOrders(true);

                    setTimeout(() => {
                        setLoadingMoreOrders(false);

                        setOrdersDisplayed(
                            (ordersDisplayed) => ordersDisplayed + 5
                        );
                    }, 1000);
                }
            }
        }, 300);

        return () => {
            window.clearInterval(checkScrollInterval);

            window.removeEventListener("scroll", () => {
                scrolling = true;
            });
        };
    }, []);

    useEffect(() => {
        if (loadingMoreOrders) window.scrollTo(0, document.body.scrollHeight);
    }, [loadingMoreOrders]);

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
                                {purchases.map(
                                    (singlePurchase, index) =>
                                        index < ordersDisplayed && (
                                            <OrderCard
                                                key={index}
                                                orderData={singlePurchase}
                                            />
                                        )
                                )}

                                {loadingMoreOrders &&
                                    ordersDisplayed < purchases.length && (
                                        <div className="loading-more">
                                            <LoadingData />
                                        </div>
                                    )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default OrderHistory;
