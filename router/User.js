const express = require("express");
const router = express.Router();
const get_validation = require("../Validation/categoryvalidation");


const { Get_User, Post_User, Update_User, Delete_User, Update_Drivers, Resize, Upload } = require("../service/User");
const { protect, toAllow } = require("../service/Auth");

router
  .route("/")
  .get(Get_User).post(Post_User)
  router
  .route("/:id")
  .put(Update_User)
  .delete(Delete_User)
const UserRout=router
module.exports = UserRout;     