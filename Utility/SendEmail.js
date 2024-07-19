const nodemailer = require("nodemailer");
const SendEmail=async (get)=>{
 
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: process.env.PROCESS_HOST,
      port: process.env.PROCESS_PORT,
      secure: true,
      auth: {
        user: process.env.PROCESS_EMAIL,
        pass: "lzofnfujrwzjmqzz",
      },
    }); 
    const mailOpts = transport.sendMail({
      from: "T_SHOP <alanbarznji91@gmail.com>",
      to: get.email,
      subject: get.subject,
      text: get.message,
    }); 
    console.log(mailOpts);
      await transport.sendMail(mailOpts);
} 
module.exports=SendEmail