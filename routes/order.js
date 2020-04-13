const express = require("express")
const {normalRes} = require("../modules/normalRES")
const router = express.Router()
const {Order,validateOrder} = require("../modules/order")
const createOrderId = require("../tools/createOrder")


// 列出用户所有订单
router.get('/',async(req,res)=>{
  const option = {}
  let pages = req.query.pages//页码
  const pageNumber = 10
  if(req.query.orderUser){ //不传查所有
    option.orderUser = req.query.orderUser
  }
  if(req.query.status){ //不传查所有0支付成功，1待支付，2失效
    option.status = req.query.status
  }
  if(req.query.payMethod){
    option.payMethod = req.query.payMethod//0微信，1支付宝
  }
  const count =  await Order.find(option).count()
  const orderList = await Order.find(option).sort({createTime:-1})
                                .populate({path: 'resiver'}).populate({path: 'product', select: 'name -_id'}).populate({path: 'user', select: 'name -_id'})
                                .limit(pageNumber).skip((pages-1)*pageNumber)
  res.send(normalRes("查询完毕",true,{orderList:orderList,count:count}))
})


//创建新订单
router.post('/newOrder',async(req,res)=>{
    const {error} = validateOrder(req.body)
  if(error){
    res.status(400).send({message:error.details[0].message})
  }else{
    let order = {}
    Object.keys(req.body).forEach(function (key) {
        order[key] = req.body[key]
    });
    order.orderId = createOrderId(req.body.orderUser,req.body.payMethod)
    order.totalMoney = 250
    let newOrder =await new Order(order)
    try {
        const result =await newOrder.save()
        res.send(normalRes("订单创建成功",true,result))
    } catch (error) {
        res.status(400).send(normalRes("订单创建失败",false,error))
    }
  }
})

module.exports = router;
