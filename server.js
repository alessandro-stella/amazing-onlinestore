const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const historyRoutes = require("./routes/history");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");

const app = express();
const port = process.env.PORT || 5000;

mongoose
    .connect(process.env.DB, { useNewUrlParser: true })
    .then(() => console.log(`Connection to MongoDB established successfully`))
    .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/product", productRoutes);
app.use("/api/user", userRoutes);

app.use((err, req, res, next) => {
    console.log(err);
    next();
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
    });
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
