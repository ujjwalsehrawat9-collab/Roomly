const Listing = require("../models/listing");
const categories = require("../utils/categories.js");

const buildImageData = (file) => {
  if (!file) return null;

  if (file.path?.startsWith("http://") || file.path?.startsWith("https://")) {
    return { url: file.path, filename: file.filename };
  }

  return { url: `/uploads/${file.filename}`, filename: file.filename };
};

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings, categories });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs", { categories });
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  // console.log(typeof listing);

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing, categories });
};

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  const imageData = buildImageData(req.file);
  if (imageData) {
    newListing.image = imageData;
  }

  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image && listing.image.url;
  if (originalImageUrl) {
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_40,w_25");
  }
  res.render("./listings/edit.ejs", { listing, originalImageUrl, categories });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  const imageData = buildImageData(req.file);
  if (imageData) {
    listing.image = imageData;
    await listing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};

module.exports.filterListings = async (req, res) => {
  const { category } = req.params;

  if (category === "Trending" || category === "all") {
    const allListings = await Listing.find({});
    return res.render("./listings/index.ejs", { allListings, categories });
  }

  const allListings = await Listing.find({ category });

  if (allListings.length === 0) {
    req.flash("error", `No listings found for "${category.replace(/-/g, " ")}"`);
    return res.redirect("/listings");
  }

  res.locals.success = `Showing listings for "${category.replace(/-/g, " ")}"`;
  res.render("./listings/index.ejs", { allListings, categories });
};

module.exports.searchListings = async (req, res) => {
  const searchQuery = req.query.query?.trim();

  try {
    let filteredListings = [];

    if (!searchQuery) {
      filteredListings = await Listing.find();
    } else {
      const regex = new RegExp(searchQuery, "i");
      filteredListings = await Listing.find({
        $or: [
          { title: { $regex: regex } },
          { location: { $regex: regex } },
          { country: { $regex: regex } },
          { category: { $regex: regex } },
        ],
      });
    }

    console.log("SEARCH_QUERY", searchQuery);
    console.log("SEARCH_RESULTS", filteredListings.map((listing) => listing.title));

    res.render("listings/searchResults", {
      results: filteredListings,
      searchQuery,
    });
  } catch (err) {
    res.status(500).send("Search failed: " + err.message);
  }
};