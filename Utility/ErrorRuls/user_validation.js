const { check } = require("express-validator");
const user = require("../../model/user");
const ApiError = require("../ErroreApi");
const bcrypt = require("bcryptjs");
const User = require("../../model/user");
const { throws } = require("assert");
// const get_validation = require("../Validation/categoryvalidation");

exports.cr_user = [
  check("name")
    .notEmpty()
    .withMessage("it is empty")
    .isLength({ min: 3 })
    .withMessage("to short")
    .isLength({
      max: 32,
    })
    .withMessage("to long"),
  check("email")
    .notEmpty()
    .withMessage("kara")
    .isEmail()
    .withMessage("must me hae email")
    .custom((val)=>{
        return user.findOne({"email": val})
        .then(user=>
        {
            if(user){
                return Promise.reject(
                    new ApiError("these email for another acounte",400)
                )
            }
            return true}
            
    )
    }),
    check('password')
    .notEmpty()
    .withMessage("empty password")
    .isLength({min:6})
    .withMessage("short password")
    .custom((val,{req})=>{
        if (val!==req.body.passwordConfirm) {
          return Promise.reject(
            new ApiError("you must have same password")
          );
        }
            return true
    })
    ,
    check('passwordConfirm').notEmpty()
    .withMessage("must be requier")
    ,
 check('phone')
    .optional()
    .isMobilePhone('ar-IQ')
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
  check('profileImg').optional(),
  check('role').optional(),
 
];
exports.ur_user = [
  check("id")
  .isMongoId()
    .withMessage("Injvalid ID")
    .isLength({ min: 3 })
    .withMessage("to short"),
];
exports.changePasswords = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  check("currentPassword").notEmpty().withMessage("Old Password is required "),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("passwordConfirm is required "),
  check("password")
    .notEmpty()
    .withMessage("pk")
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      // 2) Verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    })
    .custom(async (val, { req }) => {
      return true;
    }),
];
exports.dr_user = [check("id").isMongoId().withMessage("Invalid ID")];

exports.gr_user = [
    check("id").isMongoId().withMessage("Invalid ID")];