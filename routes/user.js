const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userscontrollers = require("../controllers/users");

router.get("/signup",userscontrollers.rendersignup);

router.post("/signup", wrapAsync (userscontrollers.signup));

router.get("/login",userscontrollers.renderlogin);

router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login" , failureFlash:true})  ,userscontrollers.login);

router.get("/logout",userscontrollers.logout);

module.exports = router;