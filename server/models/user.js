const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    fullname: String,
    password: String,
    birthDay: Date,
    phoneNumber: String,
    role: String,
    profilePic: String,
    twoFactorAuthToken: String,
    twoFactorAuthTokenExpiry: Date,

})
const UserModel = mongoose.model('Users', userSchema)
 module.exports = UserModel