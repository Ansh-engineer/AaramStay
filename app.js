const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const Listing = require("../AaramStay/models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/AaramStay";

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


app.get("/",(req,res)=>{
    res.send("hi");
})

app.get("/listing",async(req,res)=>{
    const alllisting = await Listing.find({});
    res.render("listing/index.ejs",{alllisting});
});


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

const port = 8080;
app.listen(port,()=>{
   console.log(`server is running on port :${port} `);
})