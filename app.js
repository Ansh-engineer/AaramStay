const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const Listing = require("../AaramStay/models/listing.js");
var methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const MONGO_URL = "mongodb://127.0.0.1:27017/AaramStay";
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
 const {listingSchema} = require("./schema.js")
 const Review = require("../AaramStay/models/review.js");
 const {reviewSchema} = require("./schema.js")
 


main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); 
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
     if(error){
        let errmsg = error.details.map(el=>el.message).join(",");
        throw new expressError(400,errmsg);
     }else{
        next();
     }
}

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



app.get("/",(req,res)=>{
    res.send("hi");
})



// index route

app.get("/listing",wrapAsync( async(req,res)=>{
    const alllisting = await Listing.find({});
    res.render("listing/index.ejs",{alllisting});
}));

app.get("/listing/new",(req,res)=>{
    res.render("listing/new.ejs");
})


// show routes

app.get("/listing/:id",wrapAsync( async(req,res)=>{
      let {id} = req.params;
      let listing = await Listing.findById(id).populate("reviews");
      res.render("listing/show.ejs",{listing});
}));


// adding new listing
app.post("/listing",validateListing, wrapAsync (async (req, res, next) => {
     
    let newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listing");
}));



// updating form route
app.get("/listing/:id/edit",wrapAsync( async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/edit.ejs",{listing});
}));

//updating route
app.put("/listing/:id/edit",validateListing, wrapAsync (async(req,res)=>{
      if(!req.body || !req.body.listing){
        throw new expressError(400,"send valid data for listing");
     }  
    let {id} = req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
       res.redirect(`/listing/${id}`);
}));

// delete route

app.delete("/listing/:id",wrapAsync( async(req,res)=>{
    let {id} = req.params;
    let deletedid = await Listing.findByIdAndDelete(id);
    console.log(deletedid);
    res.redirect("/listing");
}));

// review 
// Post route

app.post("/listing/:id/review",validatereview , wrapAsync( async(req,res)=>{
    let{id} = req.params;
   let listing  = await Listing.findById(id);
   let newreview = await new Review(req.body.review);
   listing.reviews.push(newreview);
   await newreview.save();
   await listing.save();
   res.redirect(`/listing/${id}`);
}));

//review
// delete route

app.delete("/listing/:id/review/:reviewid", wrapAsync( async(req,res)=>{
        let{id , reviewid} = req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
       await Review.findByIdAndDelete(reviewid);
       res.redirect(`/listing/${id}`);

}));



// app.get("/listingtesting",async(req,res)=>{
//      let sampletesting = new Listing({
//         title:"My home",
//         description:"near the beach",
//         price:999,
//         location:"Gurgaon",
//         country:"India",
//      });

//     await sampletesting.save()
//     console.log("sample was saved");
//     res.send("working");
// })

app.use((req,res,next)=>{
    next(new expressError(404,"Page not Found"));
})

app.use((err,req,res,next)=>{
    let{status =500,message="something went wrong!"} = err;
    res.status(status).render("error.ejs", { message });
})

const port = 8080;
app.listen(port,()=>{
   console.log(`server is running on port :${port} `);
})