const Joi = require("joi")//验证模块
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/webshop")
    .then(()=>{console.log("mongodb connect cuccessfully")})
    .catch((error)=>{console.log(error)})


const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:3,
        max:255,
    },
    updateTime: {//更新时间（排序用）
        type: Date,
        default: Date.now()
    }
   
})

const Category = mongoose.model("category",categorySchema)


function validateCategory(category){
    const scheme = {
        name:Joi.string().min(3).max(25).required(),
    };
    return Joi.validate(category,scheme)

}

exports.Category = Category
exports.validateCategory = validateCategory
