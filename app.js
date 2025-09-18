const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("../AaramStay/models/listing.js");
var methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MONGO_URL = "mongodb://127.0.0.1:27017/AaramStay";
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

const Review = require("../AaramStay/models/review.js");
const listing = require("./routes/listing.js");
const review = require("./routes/review.js");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.use(cookieParser("secretcode"));

const sessionOptions = {
  secret:"secretcode",
  resave: false,
  saveUninitialized:true,
  cookie:{
     expires:Date.now() + 7 * 24* 60* 60 * 1000,
     maxAge: 7 * 24* 60* 60 * 1000,
     httpOnly:true,
  }
}

app.get("/", (req, res) => {
    
  res.send("hi");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      next(); 
});

app.use("/listing", listing);
app.use("/listing/:id/review", review);


app.use((req, res, next) => {
  next(new expressError(404, "Page not Found"));
});

app.use((err,req,res,next)=>{
    let{status =500,message="something went wrong!"} = err;
    res.status(status).render("error.ejs", { message });
})

const port = 8080;
app.listen(port, () => {
  console.log(`server is running on port :${port} `);
});
