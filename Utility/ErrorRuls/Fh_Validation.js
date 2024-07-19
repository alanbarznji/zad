const { check,param } = require("express-validator");
const Hawkar = require("../../model/Hawkar");
const ApiError = require("../ErroreApi");
const IdValue = async (value, req, fields) => {
  const idField = `${fields}`;
  const idValue = req.body[idField];

  console.log('====================================');
  console.log(fields,idValue,  Number(value));
  console.log('====================================');
  if (idValue == 0) {
    return Promise.reject(new Error('Please select one option'));
  } else if (idValue == 3 && Number(value) !== 0) {
    return Promise.reject(new Error('هەڵە هەیە لە هەڵبژاردن'));
  } else if (idValue == 2 && Number( value) !== 5) {
    return Promise.reject(new Error('هەڵە هەیە لە هەڵبژاردن'));
  } else if (idValue == 1 && Number( value) !== 10) {
    return Promise.reject(new Error('هەڵە هەیە لە هەڵبژاردن'));
  }
};
exports.CR_FH = [
  check("NameH").notEmpty().withMessage("ناوی هاوکار پێوەستە داخل بکرێت")
  .custom(async (val,{req})=>
  await Hawkar.findOne({NameH:val}).then(e=>{
    if(!e){
      return   Promise.reject(new Error("هاوکاری بەو ناوە  بوونی نیە"))
    }
    return true
  }))
  ,
  check("NameS").notEmpty().withMessage("ناوی نەخۆش پێوەستە داخل بکرێت"),
  check("Number")
    .isMobilePhone("ar-IQ")
    .withMessage("رەقەم مۆبایل ببیت")
    .notEmpty()
    .withMessage("ڕەقەمنەخۆش پێوەستە داخل بکرێت"),
  check("Place").notEmpty().withMessage("گەڕەک پێوەستە داخل بکرێت"),
  check("House").notEmpty().withMessage("جۆری خانوو پێوەستە داخل بکرێت"),
  check("HouseValueId")
  .notEmpty()
  .withMessage("HouseValue پێوەستە داخل بکرێت")
  .isNumeric()
  .withMessage("HouseValue must be a number"),
  check("HouseValue")
    .notEmpty()
    .withMessage("HouseValue پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("HouseValue must be a number")
    .custom((val,{req})=>IdValue(val,req,'HouseValueId'))
    ,
  check("Car").notEmpty().withMessage("ئۆتۆمبێل پێوەستە داخل بکرێت"),
  check("CarValue")
    .notEmpty()
    .withMessage("CarValue پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("CarValue must be a number")
    .custom((val,{req})=>IdValue(val,req,'CarValueId')),
  check("CarValueId")
    .notEmpty()
    .withMessage("CarValue پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("CarValue must be a number"),
  check("Loan").notEmpty().withMessage("قەرزاری پێوەستە داخل بکرێت"),
  check("LoanValue")
    .notEmpty()
    .withMessage("LoanValue پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("LoanValue must be a number")
    .custom((val,{req})=>IdValue(val,req,'LoanValueId')),
    
  check("LoanValueId")
    .notEmpty()
    .withMessage("LoanValue پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("LoanValue must be a number"),
  check("LoanValueAds")
    .notEmpty()
    .withMessage("LoanValueAds پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("LoanValueAds must be a number"),
  check("Wage").notEmpty().withMessage("داهاتی مانگانە پێوەستە داخل بکرێت"),
  check("WageValue")
    .notEmpty()
    .withMessage("WageValue پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("WageValue must be a number")
    .custom((val,{req})=>IdValue(val,req,'WageValueId')),
  check("WageValueId")
    .notEmpty()
    .withMessage("WageValue پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("WageValue must be a number")
 ,
  check("WageValueAds")
    .notEmpty()
    .withMessage("WageValueAds پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("WageValueAds must be a number"),
  check("Children").notEmpty().withMessage("منداڵەکان پێوەستە داخل بکرێت"),
  check("ChildrenValue")
    .notEmpty()
    .withMessage("ChildrenValue پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("ChildrenValue must be a number")
    .custom((val,{req})=>IdValue(val,req,'ChildrenValueId')),
  check("ChildrenValueId")
    .notEmpty()
    .withMessage("ChildrenValue پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("ChildrenValue must be a number"),
  check("Sicks").notEmpty().withMessage("نەخۆشی تر پێوەستە داخل بکرێت"),
  check("SicksValue")
    .notEmpty()
    .withMessage("SicksValue پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("SicksValue must be a number")
    .custom((val,{req})=>IdValue(val,req,'SicksValueId')),
  check("SicksValueId")
    .notEmpty()
    .withMessage("SicksValue پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("SicksValue must be a number")
   ,
    
  check("SicksValueAds")
    .notEmpty()
    .withMessage("SicksValueAds پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("SicksValueAds must be a number"),
  check("Payment")
    .notEmpty()
    .withMessage("تێچووی نەشتەرگەری پێوەستە داخل بکرێت"),
  check("PaymentValue")
    .notEmpty()
    .withMessage("PaymentValue پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("PaymentValue must be a number")
    .custom((val,{req})=>IdValue(val,req,'PaymentValueId')),
    
  check("PaymentValueId")
    .notEmpty()
    .withMessage("PaymentValue پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("PaymentValue must be a number"),
  check("Trust").notEmpty().withMessage("ڕاستگۆیی ماڵەکە پێوەستە داخل بکرێت"),
  check("TrustValue")
    .notEmpty()
    .withMessage("TrustValue پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("TrustValue must be a number")
    .custom((val,{req})=>IdValue(val,req,'TrustValueId')),
    
  check("TrustValueId")
    .notEmpty()
    .withMessage("TrustValue پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("TrustValue must be a number"),
];
exports.CR_HD_FH = [
 param('id').isMongoId().notEmpty().withMessage("دووبارا داوای داتا بکەوە"),
  check("HDetails").notEmpty().withMessage("زانیاری هاوکار ماڵەکە پێوەستە داخل بکرێت"),
  check("HDetailsValue")
    .notEmpty()
    .withMessage("دەرەجەی هاوکار پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("TrustValue must be a number")
    .custom((val,{req})=>{
      console.log('====================================');
      console.log(val);
      console.log('====================================');
      if(val>30||val<0){
        return Promise.reject(new Error('پیوستە لە ٠ تا ٣٠ بێت'));
      }
      return true
    }),
];
exports.UR_FH = [
 param('id').isMongoId().notEmpty().withMessage("دووبارا داوای داتا بکەوە"),
  check("HDetails").notEmpty().withMessage("زانیاری هاوکار ماڵەکە پێوەستە داخل بکرێت"),
  check("HDetailsValue")
    .notEmpty()
    .withMessage("دەرەجەی هاوکار پێوەستە داخل بکرێت")
    .isNumeric()
    .withMessage("TrustValue must be a number")
    .custom((val,{req})=>{
      console.log('====================================');
      console.log(val);
      console.log('====================================');
      if(val>30||val<0){
        return Promise.reject(new Error('پیوستە لە ٠ تا ٣٠ بێت'));
      }
      return true
    }),
];
