const express = require("express");
const {
  create,
  get,
  sentMoney,
  updateAccount,
} = require("../controllers/vendorConnectControllers");
const router = express.Router();
router.post("/createAccount", create);
router.post("/getAccount", get);
router.post("/sendMoney", sentMoney);
router.post("/getAgainUrl", updateAccount);
module.exports = router;
