const mongoose=require("mongoose")


const KeySchema= mongoose.Schema({
    Name:String,
    URL:String,
    Configuration:String,
    Type:String,
    Environment:{type: mongoose.Schema.Types.ObjectId, ref:'Environment'}
})

const KeyModel=mongoose.model("Key",KeySchema)
module.exports=KeyModel