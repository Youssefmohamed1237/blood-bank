const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const compression = require("compression");
const globalErrorHandler = require("./controller/globalcontroller");
const donorroute = require("./routs/donorrouter");
const needroute = require("./routs/needrouter");
const placeroute = require("./routs/placerouter");
const userroute = require("./routs/userroute");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

app.use(helmet());

app.use(express.json({ limit: "10kb" }));

app.use(cors());

app.use(express.static(path.join(__dirname, "uploads")));
app.use(compression());
const limit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limit);
app.use("/api/donor", donorroute);
app.use("/api/need", needroute);
app.use("/api/place", placeroute);
app.use("/api/user", userroute);

app.use(globalErrorHandler);
module.exports = app;
