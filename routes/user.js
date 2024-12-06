const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
//Requiring controller
const userController = require("../controllers/user.js");

//router.route for signup user
router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signup));

//signup user
// router.get("/signup", userController.renderSignUpForm);

// router.post("/signup", wrapAsync(userController.signup));

//router.route for login user
router
  .route("/login")
  .get(userController.renderLogInForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

//Login user
// router.get("/login", userController.renderLogInForm);

// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login
// );

router.get("/logout", userController.logout);

module.exports = router; //Exporting route
