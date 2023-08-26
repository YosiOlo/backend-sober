require("dotenv").config({});
const cors = require("cors");
const fs = require('fs');
const express = require("express");
const https = require("https");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const app = express();
const key = fs.readFileSync(__dirname + '/certs/kuro.key');
const cert = fs.readFileSync(__dirname + '/certs/kuro.crt');

const credentials = {
  key: key,
  cert: cert
};
const port = process.env.PORT || 3000;

app.use(cors());
const mainRoutes = require("./src/routes/");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

app.use("/api", mainRoutes);

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, '127.0.0.1', () => {
    console.log(`Server running on port ${port}`);
    }
);
