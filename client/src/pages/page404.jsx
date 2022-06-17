import { useContext, useEffect } from "react";
import NavBar from "../components/NavBar";
import "../styles/page404.css";

import Svg404 from "../styles/404.svg?component";

import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import siteContext from "../siteContext";

function page404() {
    const navigate = useNavigate();
    const { isSmall } = useContext(siteContext);

    useEffect(() => {
        document.title = "Amazing - 404!";
    }, []);

    return (
        <>
            <NavBar />

            <div className="page404">
                <Svg404 className="page404__number" />

                <div className="page404__text-container">
                    <div className="page404__text-title">Page not found</div>

                    <div className="page404__text">
                        We're sorry, but we don't know where you are!
                    </div>

                    <Button
                        size={isSmall ? "large" : "small"}
                        fullWidth
                        variant="contained"
                        onClick={() => navigate("/shopPage")}>
                        go back
                    </Button>
                </div>
            </div>
        </>
    );
}

export default page404;
