const Joi = require("joi")//验证模块
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/webshop")
    .then(()=>{console.log("mongodb connect cuccessfully")})
    .catch((error)=>{console.log(error)})


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:3,
        max:25,
    },
    password:{
        type:String,
        required:true,
        min:8,
        max:16,
    }
})

const User = mongoose.model("user",userSchema)


function validateUser(user){
    const scheme = {
        name:Joi.string().min(3).max(25).required(),
        password:Joi.string().required().min(8).max(16),
    };
    return Joi.validate(user,scheme)

}

exports.User = User
exports.validator = validateUser