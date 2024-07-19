const FHRoute=require('../router/FH')
const HRoute=require('../router/Hawkar')
const AuthRout=require('../router/Auth')
const index = (app) => {
    app.use("/api/v1/fh",FHRoute)
    app.use("/api/v1/h",HRoute)
    app.use("/api/v1/auth",AuthRout)
};
module.exports=index