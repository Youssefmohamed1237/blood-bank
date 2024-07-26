const placecontroller = require("../controller/placecontroller");
const express = require("express");
const auth = require("../controller/authcontroller");
const Router = express.Router();
Router.route("/")
  .get(auth.protect, placecontroller.getAllPlaces)
  .post(
    auth.protect,
    auth.allowTo("admin"),
    placecontroller.uploadplaceImage,
    placecontroller.resizeImage,
    placecontroller.addplace
  );
Router.route("/:id")
  .delete(auth.protect, auth.allowTo("admin"), placecontroller.deleteplace)
  .patch(auth.protect, auth.allowTo("admin"), placecontroller.updateplace);

module.exports = Router;
