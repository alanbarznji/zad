const mongoose=require('mongoose')
const HawkarSchema=mongoose.Schema({
NameH:{
    type:String,
    require:true
}
},{timestamps:true})
const Hawkar=HawkarSchema
module.exports= mongoose.model("Hawkar",Hawkar)