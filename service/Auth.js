const asyncHandler = require("express-async-handler");
const ApiError = require("../Utility/ErroreApi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Hawkar = require("../model/Hawkar");
const User = require("../model/User");
 exports.SignUp = asyncHandler(async (req, res, next) => {
 
  console.log(req.body,"helllo");
  const user = await User.create({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
 
    role: req.body.role,
 
  });
 
  if (!user) { 
    return ApiError("Connection Error", 401);
  }
  const token = jwt.sign({ user: user._id }, process.env.JWT_USERTOKEN, {
    expiresIn: process.env.JWT_EXPIER,
  });
  res.status(200).json({
    Data: user,
    Token: token,
 
  });
});
 
exports.Login = asyncHandler(async (req, res, next) => {
 console.log('====================================');
 console.log(req.body);
 console.log('====================================');
   const user=await User.findOne({
    email:req.body.email
  })
  if (user) {
    const password = await bcrypt.compare(req.body.password, user.password);
    if (!password) {
      return next(new ApiError("You Have Err In the Email or Password",401)) 
    }
    const token = jwt.sign({ user: user._id }, process.env.JWT_USERTOKEN, {
      expiresIn: '60d',
    });
    console.log(password,"hiiii");
    res.cookie('auth_token', token, {
      httpOnly: true, // The cookie is inaccessible to JavaScript
      secure: process.env.NODE_ENV === 'production', // Set to true if your using https
      sameSite: 'Strict', // Prevent CSRF attacks
      maxAge: 60 * 60 * 24 * 60 * 1000 // Cookie expiry time in milliseconds (60 days)
    });
    res.status(201).json({
      Data: user,
      Token:token
    })
  } else {
    return next( new ApiError("Not Have Account in These Email", 401))
  }
});

// .cookie("Token1", part2, {
//   path: "/", // Cookie is accessible from all paths
//   expires: new Date(Date.now() + 86400000), // Cookie expires in 1 day
//   secure: true, // Cookie will only be sent over HTTPS
//   httpOnly: true, // Cookie cannot be accessed via client-side scripts
//   sameSite: "None",
// })
exports.ForgetByEmail = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user) {
    return  next(new ApiError("not have account in these email", 400));
  }
  resetCode = Math.floor(100000 + Math.random() * 900000);
  console.log(resetCode.toString());
  const HashResetCode = crypto
    .createHash("sha256")
    .update(resetCode.toString())
    .digest("hex");
  console.log(user, HashResetCode);
  user.RestCode = HashResetCode;
  user.expires = Date.now() + 10 * 60 * 1000;
  user.isVerified = false;
  await user.save();
  try {
    SendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message: `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`,
    })

  } catch (error) {
    user.RestCode = undefined;
    user.expires = undefined;
    user.isVerified = undefined;
    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }
  console.log('alan');
  res.status(200).json({ data: "code sent" });
});
exports.Verified = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const HashResetCode = crypto
    .createHash("sha256")
    .update(req.body.RestCode)
    .digest("hex");
  console.log(HashResetCode);
  const user = await User.findOne({
    RestCode: HashResetCode,
    expires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("the code is invalid or expire", 500));
  }
  user.isVerified = true;
  await user.save();
  res.status(200).json({ data: "send" });
});
exports.RestPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    {
      email: req.body.email,
    },
    {
      password: req.body.NewPassword,
    },
    { new: true }
  );
  console.log(user, "alan");
  if (!user) {
    return next(new ApiError("the validation is false", 403));
  }
  if (!user.isVerified) {
    return next(new ApiError("this account has not been verified", 409));
  }
  user.RestCode = undefined;
  user.expires = undefined;
  user.isVerified = undefined;
  await user.save();
  const token = jwt.sign({ user: user._id }, process.env.JWT_USERTOKEN, {
    expiresIn: process.env.JWT_EXPIER,
  });
  res.status(200).json({ user,token });
});
exports.Active = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user) {
    return new ApiError("not have account in these email", 401);
  }
  ActiveCodes = Math.floor(100000 + Math.random() * 900000);
  console.log(ActiveCodes.toString());
  const HashActiveCode = crypto
    .createHash("sha256")
    .update(ActiveCodes.toString())
    .digest("hex");
  console.log(user, HashActiveCode);
  user.ActiveCode = HashActiveCode;
  user.expires = Date.now() + 10 * 60 * 1000;
  user.Active = false;
  await user.save();
  try {
    SendEmail({
      email: user.email,
      subject: "Your Active code (valid for 10 min)",
      message: `Hi ${user.name},\n We received a request to Active Account on your E-shop Account. \n ${ActiveCodes} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`,
    });
  } catch (error) {
    user.RestCode = undefined;
    user.expires = undefined;
    user.isVerified = undefined;
    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }
  res.status(200).json({ data: "code sent" });
});
exports.CheckActive = asyncHandler(async (req, res, next) => {
  const HashActiveCode = crypto
    .createHash("sha256")
    .update(req.body.ActiveCode)
    .digest("hex");

  const user = await User.findOne({
    ActiveCode: HashActiveCode,
    expires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("the code is invalid or expire", 500));
  }
  user.Active = true;
  user.ActiveCode = undefined;
  await user.save();
  res.status(201).json({ data: "send" });
});
exports.protect = asyncHandler(async (req, res, next) => {
  console.log('====================================');
  console.log(req.headers);
  console.log('====================================');
  let token = " ";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }
 
 
  let decoded
 
   decoded = jwt.verify(token, process.env.JWT_USERTOKEN);


   const user = await User.findById(decoded.user);
   console.log(decoded,user.LastLogin);

  if (!user ) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }
 
    if (user.passwordChangedAt) {
      const date = new Date(user.passwordChangedAt ); // Convert to milliseconds
      const isoString = date.toISOString();
      const passChangedTimestamp = parseInt(date.getTime() / 1000, 10);
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          'User recently changed his password. please login again..',
          401
        )
      );
    }
  }
  req.user = user;
  next();
});
exports.protectHN = asyncHandler(async (req, res, next) => {
const Hawkar=await Hawkar.findOne({NameH:req.body.NameH})
if(!Hawkar){
  return next(new ApiError('ببورە بوونت نیە لا لیستی هاوکارانی زاد',400))
}
  next();
});
exports.toAllow = (...role) =>
  asyncHandler(async (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(new ApiError("these role cant have authority", 402));
    }

    next();
  });

exports.ToAllows=(Active)=>
asyncHandler(async(req, res, next)=>{
  const user=req.user
  if (user.Active!==true) {
    return next(new ApiError("you are not active", 402));
  }
  next();
})
exports.Payment=asyncHandler(async (res,req,next)=>{
const PaymentResponse=await makePayment(
  req.body.client_id,
  req.body.client_secret,
  req.body.amount,
  AccountNumber
);
res.status(201).json({data:PaymentResponse})
})