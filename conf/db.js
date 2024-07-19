const mongoose = require('mongoose')
const db = () => {
    mongoose.connect(process.env.DB_URL).then((con) => {
    console.log(`is conected :${con.connection.host}`);
})
}
module.exports=db  