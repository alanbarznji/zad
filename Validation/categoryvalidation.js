const { validationResult } = require("express-validator");

const get_validation = (req, res, next) => 
{      const errors = validationResult(req);
  console.log(errors.isEmpty()); 
      if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    }
    next() 
}
module.exports=get_validation  