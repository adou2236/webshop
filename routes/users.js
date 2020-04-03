const express = require("express")
const bcrypt = require("bcrypt")//密码加密存入数据库
const router = express.Router()
const {User,validator} = require("../modules/user")
const jwt = require("jsonwebtoken")




//注册新用户
router.post("/resign",async(req,res)=>{
  const {error} = validator(req.body)
  if(error){
    res.status(400).send({message:error.details[0].message})
  }else{
    const isRepid =await User.find({name:req.body.name})
    if(isRepid.length!==0){
      res.send({
        message:"用户名重复"
      })
    }
    else{
      const newUser = new User({
        name:req.body.name,
        password:bcrypt.hashSync(req.body.password,2)//密码加密
      })
      try {
        const result = newUser.save()
        res.send({
          message:"注册成功"
        })
      } catch (error) {
        res.status(400).send("注册失败")
        
      }
    }
  }
    
})

//登录
router.post("/login",async(req,res)=>{
  const {error} = validator(req.body)
  if(error){
    res.status(400).send({message:error.details[0].message})
  }else{
    const secuser = await User.find({name:req.body.name})
    if(secuser.length===0){
      res.status(404).send({message:"用户不存在"})
    }
    else{
      const secpas = secuser[0].password
      if(bcrypt.compareSync(req.body.password, secpas)){//将加密密码进行对比
        const token = jwt.sign(
          {name: req.body.name},'suzhen',{expiresIn: 60 * 60}
        )
        res.send({
          message:"登录成功",
          token:token
        })
      }
      else{
        res.send({
          message:"密码错误",
        })
      }
    }
  }

})


module.exports = router;
