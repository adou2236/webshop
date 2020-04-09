const Joi = require("joi")//验证模块
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/webshop")
    .then(()=>{console.log("mongodb connect cuccessfully")})
    .catch((error)=>{console.log(error)})


const productSchema = new mongoose.Schema({
    name:{//商品名称
        type:String,
        required:true,
        min:3,
        max:255,
    },
    count:{//商品剩余量
        type:Number,
        default:0,
        min:0
    },
    price:{//商品价格
        type:Number,
        required:true,
        min:0.01,
    },
    discount:{//商品折扣
        type:Number,
        default:1,
        min:0.1,
        max:1
    },
    cover:{
        type:String
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category"
    },
    updateTime: {//更新时间（排序用）
        type: Date,
        default: Date.now()
    }
   
})

const Product = mongoose.model("product",productSchema)


function validateProduct(product){
    const scheme = {
        name:Joi.string().min(1).max(50).required(),
        cover:Joi.string(),
        count:Joi.number().min(0),
        price:Joi.number().min(0.01).required(),
        category:Joi.string(),
        discount:Joi.number().min(0.1).max(0.9)
    };
    return Joi.validate(product,scheme)

}

exports.Product = Product
exports.validateProduct = validateProduct
