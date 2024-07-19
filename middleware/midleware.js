const AsyncHandler = require("express-async-handler");
const { model } = require("mongoose");

exports.uploadSingle = AsyncHandler( async(req,res,next)=>{
   const MemoryStorage = multer.memoryStorage(model)
    const filter = (req, file, cb) => {
      if (file.startsWidth("image")) {
        cb(null, true);
      } else {
        cb(new ApiError("only image", 400), false);
      }
    };
    const upload = multer({ dest: MemoryStorage, fileFilter: filter }).single(model)
return upload  
}
)
