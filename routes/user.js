const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userscontrollers = require("../controllers/users");

router
  .route("/signup")
  .get( userscontrollers.rendersignup)
  .post( wrapAsync(userscontrollers.signup));

router
  .route("/login")
  .get(userscontrollers.renderlogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userscontrollers.login
  );

router.get("/logout", userscontrollers.logout);

module.exports = router;
