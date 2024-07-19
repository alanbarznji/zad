const express = require("express");
 
const get_validation = require("../Validation/categoryvalidation");
const { H_GET, H_POST, H_DELETE, H_PUT } = require("../service/Hawkar");
const { protect, toAllow } = require("../service/Auth");

const router=express.Router()
router.route('/').get(protect,toAllow("Admin"),H_GET).post(protect,toAllow("Admin"),H_POST)
router.route('/:id').delete(protect,toAllow("Admin"),H_DELETE) 
module.exports=router