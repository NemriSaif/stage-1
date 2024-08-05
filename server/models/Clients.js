const mongoose=require("mongoose")
//const { default: Environments } = require("../../client/src/Environments/Environments")

const ClientSchema=new mongoose.Schema({
    Name: String,
    Code:String,
    Contract:String,
    Address:String,
    Environments:[{type: mongoose.Schema.Types.ObjectId, ref:'Environment'}]
})

const ClientModel= mongoose.model("Client",ClientSchema)
module.exports=ClientModel    