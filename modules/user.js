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
    },
    resiver: [{type: mongoose.Schema.Types.ObjectId, ref: 'resiver'}],

})

const User = mongoose.model("user",userSchema)


function validateUser(user){
    const scheme = {
        name:Joi.string().min(3).max(25).required(),
        password:Joi.string().required().min(8).max(16),
    };
    return Joi.validate(user,scheme)

}
function validateCode(code){
    const scheme = {
        oldcode:Joi.string().required(),
        newcode:Joi.string().required().min(8).max(16).disallow(Joi.ref('oldcode')),
    };
    return Joi.validate(code,scheme)

}

exports.User = User
exports.validateUser = validateUser
exports.validateCode = validateCode
