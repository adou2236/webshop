const express = require("express")
const {normalRes} = require("../modules/normalRES")
const router = express.Router()
const {Order,validateOrder} = require("../modules/order")
const createOrderId = require("../tools/createOrder")
var ObjectID = require('mongodb').ObjectID;
const {Product} = require("../modules/product")


// 列出用户所有订单
router.get('/',async(req,res)=>{
  const option = {}
  let pages = req.query.pages//页码
  const pageNumber = 10
  if(req.query.orderUser){ //不传查所有
    option.orderUser = req.query.orderUser
  }
  if(req.query.status){ //不传查所有,1支付成功，0待支付，2失效
    option.status = req.query.status
  }
  if(req.query.payMethod){
    option.payMethod = req.query.payMethod//0微信，1支付宝
  }
  if(req.query.orderId){
    option.orderId = req.query.orderId//订单号
  }
  try {
    const count =  await Order.find(option).count()
    console.log("option",option)
    const orderList = await Order.find(option).sort({createTime:-1})
                                  .populate({path: 'resiver',select:'phone areaAddress detailAddress name'})
                                  .populate({path:'orderUser',select: 'name _id'})
                                  .populate({path:'goodsList.product',select: 'name _id price cover' })
                                  .select("-__v")
                                  .limit(pageNumber).skip((pages-1)*pageNumber)
    res.send(normalRes("查询完毕",true,{orderList:orderList,count:count}))
  } catch (error) {
    res.send(normalRes("查询错误",false))
  }
 
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
    order.orderId =await createOrderId(req.body.orderUser,req.body.payMethod)
    let value =await getMoney(req.body.goodsList)
    order.totalMoney = value.goodsList
    order.totalMoney =value.totalMoney
    let newOrder = new Order(order)
    try {
        const result =await newOrder.save()
        res.send(normalRes("订单创建成功",true,result))
    } catch (error) {
        res.status(400).send(normalRes("订单创建失败",false,error))
    }
  }
})

//成功付款
router.put('/correctPay',async(req,res)=>{
  if(req.body.orderId){
    let orderId = req.body.orderId
    let result = await Order.updateOne({orderId:orderId},{$set:{status:1}});
    if(result){
      res.send(normalRes("支付成功",true,result))
    }
    else{
      res.send(normalRes("支付失败",false))
    }
  }
  
})


//将订单置位失效
router.put('/overTime',async(req,res)=>{
  if(req.body.orderId){
    let orderId = req.body.orderId
    let result = await Order.updateOne({orderId:orderId},{$set:{status:2}});
    if(result){
      res.send(normalRes("设置成功",true,result))
    }
    else{
      res.send(normalRes("设置成功",false))
    }
  }
})

//删除失效订单
router.delete('/removeOrder',async(req,res)=>{
  if(req.body.orderId){
    let orderId = req.body.orderId
    let result = await Order.deleteOne({orderId:orderId,status:2});
    if(result.deletedCount!==0){
      res.send(normalRes("删除成功",true,result))
    }
    else{
      res.status(400).send(normalRes("删除失败",false))
    }
  }
})

async function getMoney(ArrList){
  let goodsList = []
  let totalMoney = 0
  for(let i=0;i<ArrList.length;i++){
     let tempProd = ArrList[i]
    let csa = await Product.findById({_id:ArrList[i].product})
    tempProd.payPrice = (csa.price*csa.discount).toFixed(2)
    goodsList.push(tempProd)
    totalMoney+=tempProd.payPrice*ArrList[i].sum
  }
  console.log(goodsList,totalMoney)
  return {goodsList,totalMoney}
}

module.exports = router;
