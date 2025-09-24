const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errmsg);
  } else {
    next();
  }
};

router
  .route("/")
  .get(wrapAsync(listingcontroller.index))
  .post(validateListing, wrapAsync(listingcontroller.postroute));

router.get("/new", isLoggedIn, listingcontroller.rendernewform);

router
  .route("/:id")
  .get(wrapAsync(listingcontroller.showalllistings))
  .delete(isLoggedIn, wrapAsync(listingcontroller.deleteroute));

router
  .route("/:id/edit")
  .get(isLoggedIn, wrapAsync(listingcontroller.rendereditform))
  .put(isLoggedIn, validateListing, wrapAsync(listingcontroller.updateroute));

module.exports = router;
