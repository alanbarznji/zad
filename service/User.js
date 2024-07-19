const  factor=require("./Handler");
const User = require("../model/User");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const sharp = require("sharp");
const MulterStorage=multer.memoryStorage()
exports.Resize = asyncHandler(async (req, res, next) => {
  console.log(req.file);
    if(req.file){
      const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(400, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toFile(`Upload/User/${filename}`)
      req.body.image=filename
      req.imageUploaded = true; // Flag to indicate image was uploaded
      }
      next()
  }); 

const Filter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true) 
    }
 else{
    cb(new ApiError("it is not image",401),false)
    }
}
exports.Upload= multer({ storage: MulterStorage, fileFilter: Filter }).single("image");

exports.Get_User=factor.getAll(User)
exports.GetOnes_User=factor.getOne(User)
exports.Post_User=factor.createOne(User)
exports.Update_User=asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const document = await User.findByIdAndUpdate(req.params.id, 
{
  password:req.body.password,
  passwordChangedAt:Date.now()
},
    {
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

exports.Delete_User=factor.deleteOne(User)
exports.Update_Drivers=  
asyncHandler(async (req, res, next) => {
    console.log(req.body);
    const document = await User.findByIdAndUpdate
    (req.user._id, {
      longitude:req.body.longitude,
      latitude:req.body.latitude
    }, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ data: document });
  }
)