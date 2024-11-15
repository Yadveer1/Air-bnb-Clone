const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "defaultimage"
        },
        url: {
            type: String,
            default: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg",
            set: (v) => v === "" ? "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg" : v,
        },
    },
    price: Number,
    location: String,
    country: String,
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;