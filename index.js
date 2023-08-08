require("dotenv").config({});
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
const mainRoutes = require("./src/routes/");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", mainRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    }
);
