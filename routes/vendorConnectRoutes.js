const express = require("express");
const {
  create,
  get,
  sentMoney,
} = require("../controllers/vendorConnectControllers");
const router = express.Router();
router.post("/createAccount", create);
router.get("/get", get);
router.get("/sendMoney", sentMoney);
module.exports = router;
