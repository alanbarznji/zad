const slugify = require("slugify");
const { check, body } = require("express-validator");
const category = require("../../model/model");
// const subcategory=require("../../model/sub")
// const category = require("../../model/model");
const SubCategory = require("../../model/sub");

exports.cr_product = [
  check("name")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 700 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("color")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),
  //  check("ImageCover")
  //  .notEmpty()
  //  .withMessage("Product imageCover is required"),
  check("image")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")

    .custom((categoryId) =>
      category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    )
    .isMongoId()
    .withMessage("Invalid ID formate"),

  check("subcategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((subcategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subcategoriesIds.length) {
            return Promise.reject(new Error(`Invalid subcategories Ids`));
          }
        }
      )
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesIdsInDB = [];
          subcategories.forEach((subCategory) => {
            subCategoriesIdsInDB.push(subCategory._id.toString());
          });
          const checker = (target, arr) => target.every((v) => arr.includes(v));

          if (!checker(val, subCategoriesIdsInDB)) {
            return Promise.reject(
              new Error(`subcategories not belong to category`)
            );
          }
        }
      )
    ),
  // .custom((val, { req }) =>
  //   SubCategory.find({ category: req.body.category }).then(
  //     (subcategories) => {
  //       const subCategoriesIdsInDB = [];
  //       subcategories.forEach((subCategory) => {
  //         subCategoriesIdsInDB.push(subCategory._id.toString());
  //       });
  //       // check if subcategories ids in db include subcategories in req.body (true)
  //       const checker = (target, arr) => target.every((v) => arr.includes(v));
  //       if (!checker(val, subCategoriesIdsInDB)) {
  //         return Promise.reject(
  //           new Error(`subcategories not belong to category`)
  //         );
  //       }
  //     }
  //   )
  // ),

  check("brand").optional().isMongoId().withMessage("Invalid ID formate"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
];

exports.gr_product = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  
];

exports.ur_product = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  body("title")
    .optional()

 
];

exports.dr_product = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  check("name").custom((val,{req})=>{
    req.body.slug=slugify(val)
    return true
  })];