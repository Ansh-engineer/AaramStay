const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {listingSchema , reviewSchema} = require("../schema.js")


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

router.post("/",validatereview , wrapAsync( async(req,res)=>{
    let{id} = req.params;
   let listing  = await Listing.findById(id);
   let newreview = await new Review(req.body.review);
   listing.reviews.push(newreview);
   await newreview.save();
   await listing.save();
   req.flash("success","New Review Created!");
   res.redirect(`/listing/${id}`);
}));

//review
// delete route

router.delete("/:reviewid", wrapAsync( async(req,res)=>{
        let{id , reviewid} = req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
       await Review.findByIdAndDelete(reviewid);
       req.flash("success","Review Deleted!");
       res.redirect(`/listing/${id}`);

}));


 module.exports = router;