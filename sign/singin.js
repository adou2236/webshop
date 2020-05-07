const mongoose = require("mongoose")
const express = require("express")
const Joi = require("joi")//验证模块
const bcrypt = require("bcrypt")//密码加密存入数据库
const router = express.Router()

// mongoose.connect("mongodb//localhost/webshop")
//     .then(()=>{console.log("mongodb connect cuccessfully")})
//     .catch((error)=>{console.log(error)})

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:3,
        max:25,
    },
    password:{
        type:String,
        required:true,
        min:8,
        max:16,
    }
})

const User = mongoose.model("user",userSchema)

router.post("/newUser",async(res,req)=>{
    
})

