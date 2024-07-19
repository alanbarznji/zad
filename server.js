const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const db = require("./conf/db");
const hpp = require('hpp');
const apiError = require("./Utility/ErroreApi");
const globalError = require("./middleware/errormiddleware");
const compression = require("compression");
dotenv.config({ path: "config.env" });
const cors = require("cors");
const xss=require('xss-clean')
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const index = require("./router");
const bodyParser = require("body-parser");
db(); 
const app = express();
app.use(express.json({limit:'20kb'}));
app.use(express.urlencoded({ limit: "1kb" ,extended:true}));
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend domain
  credentials: true, // Enable sending cookies
}));
app.options('*',cors())
 
app.use(compression())
app.use(express.static(path.join(__dirname,'uploads')))

 app.use(mongoSanitize())
 app.use(xss())

 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

// Apply the rate limiting middleware to all requests
app.use('/api/',limiter);
if (process.env.NODE_ENV == "development") {
  console.log("it is development"); 
  app.use(morgan("dev"));
}
app.use(globalError);
 
index(app)
app.all("*", (res, req, next) => {
  next(new apiError(`this url is ${res.originalUrl}`, 400));
});
 
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.urlencoded({ extended: true }));
//schema 
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log("App good");
});
//routs
 
app.use(globalError)
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection:${err}`);
  server.close(() => {
    process.exit(1);
  });
});