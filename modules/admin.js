const Joi = require("joi")//验证模块
const mongoose = require("mongoose")

// mongoose.connect("mongodb://localhost/webshop")
//     .then(()=>{console.log("mongodb connect cuccessfully")})
//     .catch((error)=>{console.log(error)})


const adminSchema = new mongoose.Schema({
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

const Admin = mongoose.model("admin",adminSchema)


function validateAdmin(admin){
    const scheme = {
        name:Joi.string().min(3).max(25).required(),
        password:Joi.string().required().min(8).max(16),
    };
    return Joi.validate(admin,scheme)

}


exports.Admin = Admin
exports.validateAdmin = validateAdmin
