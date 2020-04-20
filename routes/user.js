const express = require("express")
const bcrypt = require("bcrypt")//密码加密存入数据库
const router = express.Router()
const {User,validateUser , validateCode} = require("../modules/user")
const jwt = require("jsonwebtoken")
const {normalRes} = require("../modules/normalRES")





//注册新用户
router.post("/resign",async(req,res)=>{
  const {error} = validateUser(req.body)
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
  const {error} = validateUser(req.body)
  if(error){
    res.status(400).send(normalRes(error.details[0].message,false))
  }else{
    const secuser = await User.find({name:req.body.name})
    if(secuser.length===0){
      res.status(404).send(normalRes("用户不存在",false))
    }
    else{
      const secpas = secuser[0].password
      if(bcrypt.compareSync(req.body.password, secpas)){//将加密密码进行对比
        const token = jwt.sign(
          {name: req.body.name},'suzhen',{expiresIn: 60 * 60}
        )
        res.send(normalRes("登录成功",true,{name:secuser[0].name,userId:secuser[0]._id,token:token}))
      }
      else{
        res.status(400).send(normalRes("密码错误",false))
      }
    }
  }

})

//修改密码
router.put("/passowrd/:name",async(req,res)=>{
  const {error} = validateCode(req.body)
  if(error){
    res.status(400).send({message:error.details[0].message})
  }else{
    const changeingUser = await User.find({name:req.params.name})
    if(changeingUser.length===0){
      res.status(404).send({message:"该用户不存在"})
    }
    const secpas = changeingUser[0].password
    if(bcrypt.compareSync(req.body.oldcode, secpas)){//将加密密码进行对比
      changeingUser[0].password = bcrypt.hashSync(req.body.newcode,2)
      result = await changeingUser[0].save()
      res.send({
        message:"修改成功",
        data:result
      })
    }
    else{
      res.send({
        message:"原密码错误",
      })
    }
  }
})


//修改用户其他信息
//购物车变更


module.exports = router;
