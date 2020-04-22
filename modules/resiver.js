const Joi = require("joi")//验证模块
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/webshop")
    .then(()=>{console.log("mongodb connect cuccessfully")})
    .catch((error)=>{console.log(error)})


const resiverSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:1,
        max:25,
    },
    isdefault:{//是否为默认地址
        type:Boolean,
        default:false,
    },
    phone:{
        type:String,
        required:true,
        validate: {//验证器
            validator: function(v) {
                return /^1/.test(v)&&v.length===11;
            },message: `手机号错误`
        }
    },
    areaAddress:{
        type:String,
        required:true
    },
    detailAddress:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }

})

const Resiver = mongoose.model("resiver",resiverSchema)


function validateResiver(Resiver){
    const scheme = {
        name:Joi.string().min(1).max(25).required(),
        phone:Joi.string().required().length(11).regex(/^1/),
        areaAddress:Joi.string(),
        detailAddress:Joi.string(),
        userId:Joi.string(),
        _id:Joi.string().allow(''),
    };
    return Joi.validate(Resiver,scheme)

}

exports.Resiver = Resiver
exports.validateResiver = validateResiver
