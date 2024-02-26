const express = require("express");
const router = express.Router();
const userValidate = require("../../validates/client/user.validate");
const authMiddleware = require("../../middlewares/client/auth.middleware");
const controller = require("../../controllers/client/user.controller");

router.get("/register", controller.register);

router.post("/register", userValidate.registerPost, controller.registerPost);

router.get("/login", controller.login);

router.post("/login", userValidate.loginPost, controller.loginPost);

router.get("/logout", controller.logout);

router.get("/password/forgot", controller.forgotPassword);

router.post(
  "/password/forgot",
  userValidate.forgotPasswordPost,
  controller.forgotPasswordPost
);

router.get("/password/otp", controller.otpPassword);

router.post("/password/otp", controller.otpPasswordPost);

router.get("/password/reset", controller.resetPassword);

router.post(
  "/password/reset",
  userValidate.forgotPasswordPost,
  controller.resetPasswordPost
);

router.get("/info", authMiddleware.requireAuth, controller.info);

module.exports = router;
