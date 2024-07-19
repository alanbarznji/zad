const { check } = require("express-validator");

exports.gr_sub_category = [check("id").isMongoId().withMessage("Invalid ID")];
exports.cr_sub_category = [
  check("name")
    .notEmpty()
    .withMessage("it is empty")
    .isLength({ min: 3 })
    .withMessage("to short")
    .isLength({
      max: 32,
    })
    .withMessage("to long"),
  check("category").notEmpty().withMessage("kara").isMongoId().withMessage("it is empty"),
];
exports.ur_sub_category = [
  check("id")
    .isMongoId()
    .withMessage("Injvalid ID")
    .isLength({ min: 3 })
    .withMessage("to short"),
];
exports.dr_sub_category = [check("id").isMongoId().withMessage("Invalid ID")];
