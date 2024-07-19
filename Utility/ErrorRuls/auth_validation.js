const { check } = require("express-validator");
const user = require("../../model/user");
const ApiError = require("../ErroreApi");
const bcrypt = require("bcryptjs");
const User = require("../../model/user");
const { throws } = require("assert");
// const get_validation = require("../Validation/categoryvalidation");

exports.authSignUp = [
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
exports.authLogin= [
  check("email")
    .notEmpty()
    .withMessage("kara")
    .isEmail()
    .withMessage("must me hae email"),
  check("password")
    .notEmpty()
    .withMessage("empty password")
    .isLength({ min: 6 })
    .withMessage("short password")

  ,
 
];