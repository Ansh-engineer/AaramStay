require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const initdata = require("./data.js");

const dbURL = process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(dbURL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
     initdata.data = initdata.data.map((obj)=>({
        ...obj,owner:"68cfbfacbe8210f5d04505cc",
     }));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initDB();

