const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  // A single checked checkbox arrives as a plain string, not an array —
  // normalize it before validation so both cases are treated the same.
  if (req.body.listing && typeof req.body.listing.category === "string") {
    req.body.listing.category = [req.body.listing.category];
  }

  const { error } = listingSchema.validate(req.body); // Joi returns `error`, not `err`
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body); // Joi returns `error`, not `err`
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you do not have permissions to delete this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};