const { check } = require("express-validator");
const user = require("../../model/user");
const ApiError = require("../ErroreApi");
const bcrypt = require("bcryptjs");
const User = require("../../model/user");
const { throws } = require("assert");
const product = require("../../model/product");
// const get_validation = require("../Validation/categoryvalidation");

exports.cr_user = [
  check("productId")
  .isMongoId()
  .withMessage('Product id is not valid')
  .custom((val,{req})=>
  product.findById(val).then((p)=>{
    if(!p) throw new Error('these id not have product');
  }))
];
exports.dr_user = [
  check("productId")
  .isMongoId()
  .withMessage('Product id is not valid')
  .custom((val,{req})=> 
  User.findById(req.user._id).then((p)=>{
    console.log(p.wishlist.includes(req.params.id), "hhhhhhh");
    if (!p.wishlist.includes(req.params.id)) {
      throw new Error("not in the wish list");
    }
    return true
  }))
];
