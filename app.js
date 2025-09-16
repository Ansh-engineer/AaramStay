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
 const {listingSchema,reviewSchema} = require("./schema.js")

 const Review = require("../AaramStay/models/review.js");
 const listing = require("./routes/listing.js")
    const review = require("./routes/review.js")
 
 


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
 
app.use("/listing",listing);
app.use("/listing/:id/review",review);



app.get("/",(req,res)=>{
    res.send("hi");
})








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