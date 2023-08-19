require("dotenv").config({});
const cors = require("cors");
const express = require("express");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
const mainRoutes = require("./src/routes/");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

app.use("/api", mainRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    }
);
