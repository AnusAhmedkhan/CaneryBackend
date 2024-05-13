const express = require("express");
const app = express();
const cors = require("cors");
const vendor = require("./routes/vendorConnectRoutes");
const port = 5000;
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(express.json());
app.use("/vendor/connect", cors(corsOptions), vendor);
app.listen(port, () => {
  console.log("app is running on port " + port);
});
