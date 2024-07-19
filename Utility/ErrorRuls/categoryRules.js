const { check } = require("express-validator");

exports.gr_category = [check("id").isMongoId().withMessage("Invalid ID")];
exports.cr_category = [
  check("name")
    .notEmpty()
    .withMessage("it is empty")
    .isLength({ min: 3 })
    .withMessage("to short")
    .isLength({
      max: 32,
    })
    .withMessage("to long"),
];
exports.ur_category = [
  check("id")
    .isMongoId()
    .withMessage("Injvalid ID")
    .isLength({ min: 3 })
    .withMessage("to short"),
];
exports.dr_category = [check("id").isMongoId().withMessage("Invalid ID")];
