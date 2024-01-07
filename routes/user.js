const express = require("express");
const {
  registerUser,
  loginUser,
  logoutuser,
  forgetPassword,
  resetPassword,
  getUserDetails,
  UpdatePassword,
  UpdateProfile,
  createAdmin
} = require("../controller/userControler");
const { isAuthenticatedUser } = require("../middleware/auth");
const {singleUpload} = require("../middleware/Multer");

const router = express.Router();

router.route("/register").post(singleUpload,registerUser);
router.route("/login").post(loginUser);
router.route("/forgetPassword").post(forgetPassword);
router.route("/password/reset/:token").patch(resetPassword);
router.route("/userDetails").get(isAuthenticatedUser, getUserDetails);
router.route("/updatePassword").patch(isAuthenticatedUser, UpdatePassword);
router.route("/updateProfile").patch(isAuthenticatedUser, UpdateProfile);
router.route("/logout").get(isAuthenticatedUser, logoutuser);
router.route("/create/admin").patch(isAuthenticatedUser, createAdmin);

module.exports = router;
