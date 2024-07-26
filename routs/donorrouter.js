const donorcontroller = require("../controller/donorController");
const auth = require("../controller/authcontroller");
const express = require("express");
const Router = express.Router();
Router.route("/")
  .get(auth.protect, donorcontroller.getAllDonor)
  .post(
    auth.protect,
    donorcontroller.uploadUserImage,
    donorcontroller.resizeImage,
    donorcontroller.addDonor
  );
Router.route("/:id")
  .delete(auth.protect, donorcontroller.deleteDoner)
  .patch(auth.protect, donorcontroller.updateDoner);

module.exports = Router;
