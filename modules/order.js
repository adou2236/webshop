const Joi = require("joi")//验证模块
const mongoose = require("mongoose")
const moment = require('moment');


// mongoose.connect("mongodb://localhost/webshop")
//     .then(()=>{console.log("mongodb connect cuccessfully")})
//     .catch((error)=>{console.log(error)})


const orderSchema = new mongoose.Schema({
    orderId: {//订单id,固定格式，用于查账,由后台生成
        type:String,
        required:true
    },
    resiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "resiver"
    },
    payMethod: {
        type:String,
        enum:["0","1"]//0微信支付1支付宝支付
    },//支付方式
    // deliverMethod: String,//快递方式
    createTime: {//订单创建时间
        type: Date,
        default: Date.now()
    },
    orderUser:{//下单用户
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    goodsList: [
        {product: {type: mongoose.Schema.Types.ObjectId, ref: 'product'}, 
        sum: Number,
        payPrice:Number, 
        _id: false}],//订单详情（商品，数量，折扣）
    status: {//订单状态
        type: Number, 
        default: 0//0待支付，1支付成功，2超时失效
    },
    totalMoney: {//总金额后台自己计算，防止前端篡改
        type:Number,
        required:true
    }
})

const Order = mongoose.model("order",orderSchema)


function validateOrder(order){
    const scheme = {
        orderUser:Joi.string().required(),
        resiver:Joi.string().required(),
        payMethod:Joi.string().valid(['0', '1']),
        goodsList:Joi.array()
    };
    return Joi.validate(order,scheme)

}





exports.Order = Order
exports.validateOrder = validateOrder
