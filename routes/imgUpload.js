var express = require('express');
var router = express.Router();
const {normalRes} = require("../modules/normalRES")



let qn = require('../tools/qiniu');  //导入七牛文件   上方组件文件我命名qiniu.js
//结果包装函数
let result = function (obj,bool){
    if(bool){
        return {status:0,data:obj};
    }else{
        return {status:1,data:obj};
    }
}
//上传图片
router.post("/upImg",function(req,res){
    try{
        qn.upImg(req,function(response){
            if(response.status == 0){
              res.send(normalRes('上传成功',true,response.data));
            }else{
              res.send(normalRes('上传失败',false,response.msg));
            }
        });
    }catch(err){
        if(err){
            console.log('trycatch报错====',err);
        }
    }
})

module.exports = router;
