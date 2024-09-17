const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.path, "...", req.originalUrl)
  if (!req.isAuthenticated()) {
    //redirect url
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to create a listing!");
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

// module.exports.isOwner = async (req, res, next) => {
//   let {id} = req.params;
//   let listing = await Listing.findById(id);
//     if(!listing.owner._id.equals(res.locals.currUser._id)){
//       req.flash("error", "You are not the owner of listing");
//       return res.redirect(`/listings/${id}`);
//     }
//   next();
// };

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }
  if (
    !res.locals.currUser ||
    !listing.owner._id.equals(res.locals.currUser._id)
  ) {
    req.flash("error", "You do not have permission to do that.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMessage = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMessage);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMessage = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMessage);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not a author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
