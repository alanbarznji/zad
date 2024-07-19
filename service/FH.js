const asyncHandler = require("express-async-handler");
const Handler=require('./Handler');
const FH = require("../model/FH");
const ApiError = require("../Utility/ErroreApi");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const sharp = require("sharp");
const memoryStorage = multer.memoryStorage();
const filename = `hawkar-${uuidv4()}-${Date.now()}.jpeg`;
exports.Resize = asyncHandler(async (req, res, next) => {
  sharp(req.file.buffer)
  .toFormat("jpeg")
  .jpeg({ quality: 90 })
  .resize(600, 600)
  .toFile(`uploads/FH/${filename}`)
  req.body.image = filename;
  next();
});
const filter=asyncHandler(async(req,file,cb)=>{
  console.log('====================================');
  console.log(file);
  console.log('====================================');
    if(file.mimetype.startsWith('image')){
        cb(null,true)
      }
      else{
        cb(new ApiError("only image", 400), false);
      }
})
exports.Upload= multer({ storage: memoryStorage, fileFilter: filter }).single(
    "image"
    );
exports.FH_GET=Handler.getAll(FH)
exports.FH_POST=asyncHandler(async(req,res,next)=>{
  console.log('====================================');
  console.log('dddddddddd');
  console.log('====================================');
    const Form=await FH.create({
        NameH: req.body.NameH,
        NameS: req.body.NameS,
        Number: req.body.Number,
        Place: req.body.Place,
        House: req.body.House,
        HouseValue: req.body.HouseValue,
        Car: req.body.Car,
        CarValue: req.body.CarValue,
        Loan: req.body.Loan,
        LoanValue: req.body.LoanValue,
        LoanValueAds: req.body.LoanValueAds || 0,
        Wage: req.body.Wage,
        WageValue: req.body.WageValue,
        WageValueAds: req.body.WageValueAds || 0,
        Children: req.body.Children,
        ChildrenValue: req.body.ChildrenValue,
        Sicks: req.body.Sicks,
        SicksValue: req.body.SicksValue,
        SicksValueAds: req.body.SicksValueAds || 0,
        Payment: req.body.Payment,
        PaymentValue: req.body.PaymentValue,
        Trust: req.body.Trust,
        TrustValue: req.body.TrustValue,
        HDetails: req.body.HDetails,
    })
if(req.body.image){
  Form.image=req.body.image
}
    if(!Form){
        return next(new ApiError("فۆرمەکە کێشەی تیایە تکایە دووبرە پڕی بکەرەوە",400))
    }
    const SumAllVale=Form.HouseValue+
    Form.CarValue+
    Form.ChildrenValue+
    Form.PaymentValue+
    Form.TrustValue+
    (Form.SicksValue+Form.SicksValueAds)+
    (Form.WageValue+Form.WageValueAds)+
    (Form.LoanValue+Form.LoanValueAds)
    Form.AllSummation=SumAllVale
    await Form.save()
    res.status(201).json({data:Form})
})
exports.FH_HDetails_POST=asyncHandler(async(req,res,next)=>{
    const Form=await FH.findByIdAndUpdate(req.params.id,{
        HDetails: req.body.HDetails,
        HDetailsValue: req.body.HDetailsValue,
        Accept:'Waiting'
    },{new:true})
    Form.AllSummation+=Form.HDetailsValue
    await Form.save()
    res.status(202).json({data:Form})
})
exports.FH_PUT=  asyncHandler(async (req, res, next) => {
    console.log('sarchopy');
    const document = await FH.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    document.save()
    res.status(200).json({ data: document });
  });
exports.FH_One_Get=Handler.getOne(FH)