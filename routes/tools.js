const express = require("express")
const router = express.Router()
const {Rate}  = require("../modules/message")
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



module.exports = router;
