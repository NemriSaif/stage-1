const mongoose=require("mongoose")


const KeySchema= mongoose.Schema({
    Name:String,
    URL:String,
    Configuration:String,
    Type:String,
    Environment:{type: mongoose.Schema.Types.ObjectId, ref:'environment'}
})

const KeyModel=mongoose.model("Key",KeySchema)
module.exports=KeyModel