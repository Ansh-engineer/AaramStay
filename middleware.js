const Listing = require("./models/listing");
const Review = require("./models/review");



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        const listingId = req.params.id;
        req.session.redirectUrl = `/listing/${listingId}`;

        req.flash("error", "You must be logged in to make any changes");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
   

  next();
};

module.exports.isOwner = async (req, res, next) => {
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.curruser._id)) {
    req.flash("error", "You dont have permission to edit");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let{id,reviewid} = req.params;
  let review = await Review.findById(reviewid);
  if (!review.author.equals(res.locals.curruser._id)) {
    req.flash("error", "You are not the author of the listing");
    return res.redirect(`/listing/${id}`);
  }
  next();
};
