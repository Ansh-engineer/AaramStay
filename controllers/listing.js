const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listing/index.ejs", { alllisting });
  }

  module.exports.rendernewform = async (req, res) => {
 
  res.render("listing/new.ejs");
}

module.exports.showalllistings = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    console.log(listing.reviews);
    if(!listing){
      req.flash("error", "Listing you are looking for does not exist !");
     return  res.redirect("/listing");
    }
    res.render("listing/show.ejs", { listing });
  }

  module.exports.postroute = async (req, res, next) => {
      let newlisting = new Listing(req.body.listing);
      newlisting.owner =  req.user._id;
      await newlisting.save();
      req.flash("success","New Listing Created!");
      res.redirect("/listing");
    }

    module.exports.rendereditform = async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
         if(!listing){
          req.flash("error", "Listing you are looking for does not exist !");
         return  res.redirect("/listing");
        }
        res.render("listing/edit.ejs", { listing });
      }

module.exports.updateroute = async (req, res) => {
    if (!req.body || !req.body.listing) {
      throw new expressError(400, "send valid data for listing");
    }
  
    let { id } = req.params;
  
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listing/${id}`);
  }

  module.exports.deleteroute = async (req, res) => {
    let { id } = req.params;
    let deletedid = await Listing.findByIdAndDelete(id);
    
    req.flash("success","Listing Deleted!");
    res.redirect("/listing");
  }