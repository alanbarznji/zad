const express = require("express");
const router = express.Router();
const get_validation = require("../Validation/categoryvalidation");
const { SignUp, Login ,protect, toAllow } = require("../service/Auth");
 
router
  .route("/signup")
  .post(SignUp)


  router
  .route("/login")
  .post(
 Login);
router
router.route("/signupUser")
.post(protect,toAllow("Admin"),SignUp);

const AuthRout=router
module.exports = AuthRout;     