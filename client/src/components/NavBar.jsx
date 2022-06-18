import { useContext } from "react";
import siteContext from "../siteContext";
import "../styles/navBar.css";

import { useNavigate } from "react-router-dom";
import LogoSmall from "../logo/logo-small.svg?component";
import LogoBig from "../logo/logo-white.svg?component";

import { faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";

import SearchBar from "./SearchBar";

function NavBar({ searchProducts }) {
    const navigate = useNavigate();

    const { userId, searchKeyword, setSearchKeyword, isMobile, isSmall } =
        useContext(siteContext);

    function startSearch() {
        if (window.location.pathname !== "/shopPage") {
            navigate("/shopPage");
            return;
        }

        searchProducts();
    }

    function checkUserLogged(url) {
        if (!userId) {
            navigate("/loginPage");
            return;
        }

        navigate(url);
    }

    function mouseDownHandler(event, target) {
        if (event.button === 1) {
            window.open(`/${target}`, "_blank");
        }
    }

    return (
        <div className="navbar">
            <div
                onMouseDown={(e) => mouseDownHandler(e, "shopPage")}
                className="navbar-logo-container"
                onClick={() => navigate("/shopPage")}>
                {isMobile || isSmall ? <LogoSmall /> : <LogoBig />}
            </div>

            <SearchBar
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                startSearch={startSearch}
            />

            <IconButton
                onMouseDown={(e) => mouseDownHandler(e, "userPage")}
                color="whiteIcon"
                onClick={() => checkUserLogged("/userPage")}>
                <FontAwesomeIcon icon={faUser} />
            </IconButton>

            <IconButton
                onMouseDown={(e) => mouseDownHandler(e, "cartPage")}
                color="whiteIcon"
                onClick={() => checkUserLogged("/cartPage")}>
                <FontAwesomeIcon icon={faCartShopping} />
            </IconButton>
        </div>
    );
}

export default NavBar;
