const asyncHandler = require("express-async-handler");
const Handler = require("./Handler");
const ApiError = require("../Utility/ErroreApi");
const Hawkar = require("../model/Hawkar");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const sharp = require("sharp");
 
exports.H_GET = Handler.getAll(Hawkar);
exports.H_POST = Handler.createOne(Hawkar);
exports.H_PUT = Handler.updateOne(Hawkar);
exports.H_DELETE = Handler.deleteOne(Hawkar);
