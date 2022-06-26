import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import siteContext from "./siteContext";

import DisclaimerBanner from "./components/DisclaimerBanner.jsx";
import OrderHistory from "./components/OrderHistory";
import UploadedProducts from "./components/UploadedProducts";
import UploadProduct from "./components/UploadProduct";
import UserInfo from "./components/UserInfo";
import CartPage from "./pages/cartPage";
import CheckoutPage from "./pages/checkoutPage";
import DeleteAccountPage from "./pages/deleteAccountPage";
import ForgotPasswordPage from "./pages/forgotPasswordPage";
import LoginPage from "./pages/loginPage";
import Page404 from "./pages/page404";
import ProductPage from "./pages/productPage";
import ResetPasswordPage from "./pages/resetPasswordPage";
import SellerPage from "./pages/sellerPage";
import ShopPage from "./pages/shopPage";
import UserPage from "./pages/userPage";

/* Da rimuovere con il deploy finale */
if (process.env.NODE_ENV === "development") {
    axios.defaults.baseURL = "http://localhost:5000/api/";
} else {
    axios.defaults.baseURL = "https://amazing-onlinestore.herokuapp.com/api/";
}

function App() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState(localStorage.getItem("userId"));
    const [isSeller, setIsSeller] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    const [isMobile, setIsMobile] = useState(false);
    const [isSmall, setIsSmall] = useState("");

    const mqlWidth = window.matchMedia("screen and (min-width: 900px)");
    const mqlRatio = window.matchMedia("screen and (max-aspect-ratio: 1/2)");

    useEffect(() => {
        const browserIsMobile = checkMobileBrowser();

        if (browserIsMobile) {
            setIsMobile(true);
            setIsSmall(true);
        } else {
            checkOrientation(mqlWidth);

            mqlWidth.addEventListener("change", (e) => {
                checkOrientation(e);
            });
        }
    }, []);

    useEffect(() => {
        if (userId !== "" && userId !== null && username === "") {
            const setUserData = () => {
                axios
                    .post("/user/getUserData", { userId })
                    .then((res) => {
                        decryptId();
                        setUsername(res.data.user.username);
                        setIsSeller(res.data.user.isSeller);
                    })
                    .catch((err) => navigate("/loginPage"));
            };

            setUserData();
        }
    }, [userId]);

    function checkMobileBrowser() {
        const ua = navigator.userAgent;

        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
        } else if (
            /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
                ua
            )
        ) {
            return true;
        }

        return false;
    }

    function checkOrientation(e) {
        const matchRatio = !mqlRatio.matches;
        const matchWidth = !e.matches;

        setIsSmall((isSmall) => (isSmall = matchRatio && matchWidth));
    }

    function decryptId() {
        axios
            .post("/user/decryptUserId", { userId })
            .then((res) => {
                setUserId(res.data.decryptedId);
            })
            .catch((err) => navigate("/loginPage"));
    }

    return (
        <siteContext.Provider
            value={{
                username,
                setUsername,
                userId,
                setUserId,
                isSeller,
                setIsSeller,
                searchKeyword,
                setSearchKeyword,
                isMobile,
                setIsMobile,
                isSmall,
                setIsSmall,
            }}>
            <Routes>
                <Route path="/" element={<Navigate replace to="shopPage" />} />

                <Route path="loginPage" element={<LoginPage />} />

                <Route path="forgotPassword" element={<ForgotPasswordPage />} />

                <Route
                    path="resetPassword/:resetPasswordToken"
                    element={<ResetPasswordPage />}
                />

                <Route path="shopPage" element={<ShopPage />} />

                <Route path="userPage" element={<UserPage />} />

                <Route path="userPage/userInfo" element={<UserInfo />} />

                <Route
                    path="userPage/orderHistory"
                    element={<OrderHistory />}
                />

                <Route
                    path="userPage/uploadProduct"
                    element={<UploadProduct />}
                />

                <Route
                    path="userPage/uploadedProducts"
                    element={<UploadedProducts />}
                />

                <Route
                    path="deleteAccountPage/:deleteAccountToken"
                    element={<DeleteAccountPage />}
                />

                <Route path="cartPage" element={<CartPage />} />

                <Route
                    path="productPage/:productId"
                    element={<ProductPage />}
                />

                <Route
                    path="sellerPage/:sellerUsername"
                    element={<SellerPage />}
                />

                <Route path="checkoutPage" element={<CheckoutPage />} />

                <Route path="*" element={<Page404 />} />
            </Routes>

            {userId !== "" && userId !== null ? <DisclaimerBanner /> : null}
        </siteContext.Provider>
    );
}

export default App;
