const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//index route
router.route("/").get(wrapAsync(listingController.index)).post(
  //create
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);

// New route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

router.get("/search", wrapAsync(listingController.searchListings));

// Category filter route (e.g. /listings/filter/Beach)
router.get("/filter/:category", wrapAsync(listingController.filterListings));

router
  .route("/:id")
  .put(
    // Update route
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .get(wrapAsync(listingController.showListing)) // Show route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); // Delete route
module.exports = router;