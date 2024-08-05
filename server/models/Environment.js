const mongoose=require("mongoose")

const EnvironmentSchema= mongoose.Schema({
    Name:String,
    Type:String,
    Client:{type: mongoose.Schema.Types.ObjectId, ref:'client'},
    Keys:[{type: mongoose.Schema.Types.ObjectId, ref:'keys'}]
})

const EnvironmentModel=mongoose.model("Environment",EnvironmentSchema)
module.exports=EnvironmentModel