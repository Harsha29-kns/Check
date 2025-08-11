const mongoose=require("mongoose")
const schema=new mongoose.Schema(
    {
        teamname:String,
        food:Array,
        price:{type:Number,default:0}
    }
)
const food=mongoose.model("foods",schema)
module.exports=food;