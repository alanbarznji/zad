const express = require("express");
const { FH_GET, FH_POST, FH_HDetails_POST, FH_PUT, FH_One_Get, Upload, Resize } = require("../service/FH");
const { CR_FH, CR_HD_FH } = require("../Utility/ErrorRuls/Fh_Validation");
const get_validation = require("../Validation/categoryvalidation");
const { protect, toAllow } = require("../service/Auth");

const router=express.Router()
router.route('/').get(protect,toAllow("Admin"),FH_GET).post(Upload,Resize,CR_FH,get_validation,FH_POST)
router.route('/Hd/:id').post(CR_HD_FH,get_validation,FH_HDetails_POST)
router.route('/:id').put(protect,toAllow("Admin"),FH_PUT).get( FH_One_Get)
module.exports=router