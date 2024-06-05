const express = require("express");
const app = express();
const https = require("https");
const cors = require("cors");
const fs = require("fs");
const vendor = require("./routes/vendorConnectRoutes");
const port = 5000;
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
const privateKey = fs.readFileSync("./https/privkey.pem", "utf8");
const certificate = fs.readFileSync("./https/fullchain.pem", "utf8");
const ca = fs.readFileSync("./https/chain.pem", "utf8");
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

app.use(express.json());
app.use("/vendor/connect", cors(corsOptions), vendor);
// app.listen(port, () => {
//   console.log("app is running on port " + port);
// });

https.createServer(credentials, app).listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
