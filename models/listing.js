const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const categories = require("../utils/categories.js");
const categoryValues = categories.map((c) => c.value);

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: Number,
  image: {
    url: String,
    filename: String,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  category: {
    type: [String],
    required: true,
    enum: categoryValues,
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length > 0,
      message: "Please choose at least one category.",
    },
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;