const needcontroller = require("../controller/needcontroller");
const express = require("express");
const auth = require("../controller/authcontroller");
const router = express.Router();
router
  .route("/")
  .post(auth.protect, needcontroller.addneed)
  .get(auth.protect, needcontroller.getAllneed);
router
  .route("/:id")
  .patch(auth.protect, needcontroller.updateneed)
  .delete(auth.protect, needcontroller.deleteneed);
module.exports = router;
