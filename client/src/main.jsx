import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { BrowserRouter } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "hsl(166, 93%, 48%)",
        },

        lightButton: {
            main: "hsl(181, 93%, 51%)",
        },

        secondaryButton: {
            main: "#ccc",
        },

        whiteIcon: {
            main: "#fff",
        },

        searchBar: {
            main: "hsl(166, 93%, 48%)",
        },

        orangeIcon: {
            main: "hsl(166, 93%, 48%)",
        },
    },

    typography: {
        fontFamily: ["amazonEmber", "Helvetica", "Arial"].join(","),
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: `
            @font-face {
                font-family: amazonEmber;
                src: url("./AmazonEmber.ttf");
            }`,
        },
    },
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <ThemeProvider theme={theme}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ThemeProvider>
);
