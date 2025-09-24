const User = require("../models/user");

module.exports.rendersignup = (req,res)=>{
    res.render("users/signup.ejs");
}


module.exports.signup = async(req,res)=>{
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
}

module.exports.renderlogin = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = (req,res)=>{
     req.flash("success","Welocme back to AaramStay");
     let redirectUrl = res.locals.redirectUrl || "/listing";
     delete req.session.redirectUrl;
     res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You logged out successfully!!");
        res.redirect("/listing");
    })
}