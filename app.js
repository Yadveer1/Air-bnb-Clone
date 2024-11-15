const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
// const Chat = require("./models/chat");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

main()  
    .then(() => {
    console.log("connected to DB");
})
.catch((err) => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get("/", (req,res) => {
    res.send("Hi, i am root");    
});

//Index Route
app.get("/listings", wrapAsync(async (req,res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings});
}));

//New Route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

//Create Route
app.post("/listings",
    wrapAsync(async (req,res,next) => {
        if (!req.body.listing) {
            throw new ExpressError(400, "Send valid data for listing");
        }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    }),
);

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
app.put("/listings/:id", wrapAsync(async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async(req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
}));





// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing({
//         title: "My new Home",
//         description: "By the beach",
//         price: 1200,
//         location: "Mumbai",
//         country: "India",
//     });

//     try {
//         await sampleListing.save();
//         console.log("sample was saved");
//         res.send("successful testing");
//     } catch (err) {
//         console.log(err);
//         res.status(500).send("Error saving listing");
//     }
    
// });

app.all("*", (req,res,next) => {
    next(new ExpressError(404, "Page not Found!"))
});

app.use((err,req,res,next) => {
    let{statusCode=500, message="something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
}); 

app.listen(8080, () => {
    console.log(`Listening`);
});
