const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync ( async(req,res)=>{
    try{
    let{email,username,password} = req.body;
    let newuser = new User({
       email,username
    });
    const registereduser = await User.register(newuser,password);
    console.log(registereduser);
    req.login(registereduser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to AaramStay");
    res.redirect("/listing");
    })
    
}  catch(e){
    req.flash("error",e.message);
    res.redirect("./signup");
}
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login" , failureFlash:true})  ,(req,res)=>{
     req.flash("success","Welocme back to AaramStay");
     let redirectUrl = res.locals.redirectUrl || "/listing";
     delete req.session.redirectUrl;
     res.redirect(redirectUrl);
})

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You logged out successfully!!");
        res.redirect("/listing");
    })
})

module.exports = router;