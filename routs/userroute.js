const express = require("express");
const auth = require("../controller/authcontroller");
const userController = require("../controller/usercontroller");
const router = express.Router();

router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.post("/forgetPassword", auth.forgetPassword);
router.patch("/resetpassword/:token", auth.resetPassword);
router.patch("/updatemypassword", auth.protect, auth.updateMyPassword);
router.patch("/updateme", auth.protect, userController.updateMe);
router.patch("/deleteme", auth.protect, userController.deleteMe);

module.exports = router;
