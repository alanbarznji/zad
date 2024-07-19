const ApiError = require("../ErroreApi");
const { check } = require("express-validator");
const Review = require("../../model/Review");
const { promises } = require("dns");
const { log } = require("console");


exports.gr_review = [check("id").isMongoId().withMessage("Invalid ID")];
exports.cr_review = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("ratings value required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 to 5"),
  check("user").isMongoId().withMessage("Invalid Review id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom(async(val, { req }) =>
      // Check if logged user create review before
     await Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          console.log(review);
          if (review) {
            return Promise.reject(
              new Error("You already created a review before")
            );
          }
        }
      )
    ),
];
exports.ur_review = [ 
  check("id")
  .isMongoId()
  .withMessage("not have product in these ")
.custom((val,{req})=>
  Review.findById(val).then((val)=>{
    if(!val){
      return Promise.reject(
        new Error(`invalid`)
        );
      }
      console.log(
        val.user._id,
        req.user.id,
        val.user._id.toString() !== req.user._id.toString()
      );
        if (val.user._id.toString() !== req.user._id.toString()) {
          console.log(val, "alal");
  return Promise.reject(
    new Error(`Your are not allowed to perform this action`)
  )}
  })
)
];
exports.dr_review = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) =>
      // Check review ownership before update
      Review.findById(val).then((review) => {
        console.log(req.user._id);
        if (req.user.role == "user") {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review with id ${val}`)
            );
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error(`Your are not allowed to perform this action`)
            );
          }
        }
        return true
      })
    ),
];
