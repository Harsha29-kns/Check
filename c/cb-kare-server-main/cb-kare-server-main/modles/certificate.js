const mongoose= require("mongoose")
const schema= new mongoose.Schema({
    Certificate_id:String,
    Name:String,
    reg_no:Number,
    Winning_Date:String,
    Winning_place:String,
    Img_url:String
})
const model=mongoose.model("certificate",schema)
module.exports=model