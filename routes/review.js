const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewcontrollers = require("../controllers/review.js");


// server side validation for review
const validatereview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
     if(error){
        let errmsg = error.details.map(el=>el.message).join(",");
        throw new expressError(400,errmsg);
     }else{
        next();
     }
}


// review 
// Post route

router.post("/",validatereview ,isLoggedIn , wrapAsync(reviewcontrollers.addreview ));

//review
// delete route

router.delete("/:reviewid", isLoggedIn,isReviewAuthor , wrapAsync( reviewcontrollers.deletereview));


 module.exports = router;