const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errmsg);
  } else {
    next();
  }
};

// index route

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listing/index.ejs", { alllisting });
  })
);

router.get("/new",isLoggedIn, (req, res) => {
 
  res.render("listing/new.ejs");
});

// show routes

router.get(
  "/:id", 
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
      req.flash("error", "Listing you are looking for does not exist !");
     return  res.redirect("/listing");
    }
    res.render("listing/show.ejs", { listing });
  })
);

// adding new listing
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let newlisting = new Listing(req.body.listing);
    newlisting.owner =  req.user._id;
    await newlisting.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listing");
  })
);

// updating form route
router.get(
  "/:id/edit",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
     if(!listing){
      req.flash("error", "Listing you are looking for does not exist !");
     return  res.redirect("/listing");
    }
    res.render("listing/edit.ejs", { listing });
  })
);

//updating route
router.put(
  "/:id/edit", isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body || !req.body.listing) {
      throw new expressError(400, "send valid data for listing");
    }
  
    let { id } = req.params;
  
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listing/${id}`);
  })
);

// delete route

router.delete(
  "/:id", isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedid = await Listing.findByIdAndDelete(id);
    
    req.flash("success","Listing Deleted!");
    res.redirect("/listing");
  })
);

module.exports = router;
