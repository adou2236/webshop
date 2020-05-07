const express = require("express")
const router = express.Router()
const {Rate}  = require("../modules/message")
const {Banner} = require("../modules/banner")
const {normalRes} = require("../modules/normalRES")



//评价相关
//查询所有评价
router.get("/rate",async(req,res)=>{
    const result = await Admin.findAll()
    res.send(normalRes("查询成功",true,result))
})
//添加新评价
router.post("/rate",async(req,res)=>{
    let obj ={}
    Object.keys(req.body).forEach(function (key) {
        obj[key] = req.body[key]
    });
    let newMessage = new Rate(obj)
    try {
        await newMessage.save()
        
    } catch (error) {
        console.log(error)
        
    }
    res.send()
})

//添加banner图
router.post("/banner",async(req,res)=>{
    let obj ={}
    Object.keys(req.body).forEach(function (key) {
        obj[key] = req.body[key]
    });
    let newBanner = new Banner(obj)  
    try {
        const result = await newBanner.save()
        res.send(normalRes("添加成功",true,result))        
    } catch (error) {
        res.status(400).send(normalRes("添加失败",false,error))
    }
})


//获取banner图
router.get("/banner",async(req,res)=>{
    const result = await Banner.find().populate({path: 'prodId' ,select: '_id name cover'}).select("-__v")
    res.send(normalRes("查询成功",true,result))
})


//删除banner
router.delete("/banner/:id",async(req,res)=>{
    const result =await Banner.findByIdAndRemove(req.params.id)
  if(!result){
    res.status(404).send(normalRes("该banner不存在",false))
  }else{
    res.send(normalRes("删除成功",true,result))
  }
})



module.exports = router;
