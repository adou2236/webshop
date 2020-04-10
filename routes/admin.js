const express = require("express")
const bcrypt = require("bcrypt")//密码加密存入数据库
const router = express.Router()
const {Admin,validateAdmin} = require("../modules/admin")
const jwt = require("jsonwebtoken")
const {normalRes} = require("../modules/normalRES")




//注册新管理员
router.post("/resign",async(req,res)=>{
  const {error} = validateAdmin(req.body)
  if(error){
    res.status(400).send({message:error.details[0].message})
  }else{
    const isRepid =await Admin.find({name:req.body.name})
    if(isRepid.length!==0){
      res.send(normalRes("用户名重复"))
    }
    else{
      const newAdmin = new Admin({
        name:req.body.name,
        password:bcrypt.hashSync(req.body.password,5)//密码加密
      })
      try {
        const result = newAdmin.save()
        res.send(normalRes("注册成功",true,result))
      } catch (error) {
        res.status(400).send("注册失败")
      }
    }
  }
    
})

//登录
router.post("/login",async(req,res)=>{
  const {error} = validateAdmin(req.body)
  if(error){
    res.status(400).send({message:error.details[0].message})
  }else{
    const secAdmin = await Admin.find({name:req.body.name})
    if(secAdmin.length===0){
      res.status(404).send(normalRes("用户不存在",false,secAdmin))
    }
    else{
      const secpas = secAdmin[0].password
      if(bcrypt.compareSync(req.body.password, secpas)){//将加密密码进行对比
        const token = jwt.sign(
          {name: req.body.name},'admin',{expiresIn: 60 * 60}
        )
        res.send(normalRes("登录成功",true,{token:token}))
      }
      else{
        res.send(normalRes("密码错误",false))
      }
    }
  }
})



module.exports = router;
