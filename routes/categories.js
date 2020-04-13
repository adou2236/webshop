const express = require("express")
const {normalRes} = require("../modules/normalRES")
const router = express.Router()
const {Category,validateCategory} = require("../modules/category")
const moment = require('moment');



//列出所有分类
router.get('/',async(req,res)=>{
    const allCatgories = await Category.find().sort({updateTime: -1}).select({name:-1,updateTime:1})
    if(allCatgories.length!==0){
        res.send(normalRes("查询完毕",true,allCatgories))
    }else{
        res.status(400).send(normalRes("暂无分类"))
    }
})


//添加新分类
router.post('/newcategory',async(req,res)=>{
    const {error} = validateCategory(req.body)
  if(error){
    res.status(400).send({message:error.details[0].message})
  }else{
    const isRepid =await Category.find({name:req.body.name})
    if(isRepid.length!==0){
      res.status(400).send(normalRes("该分类已存在"))
    }
    else{
      const newCategory = new Category({
        name:req.body.name,
        updateTime: Date.now()
      })
      try {
        console.log("新的东西",newCategory)
        const result = newCategory.save()
        res.send(normalRes("新增成功",true,result))
      } catch (error) {
        res.status(400).send(normalRes("新增失败",false,error))
        
      }
    }
  }
})

//修改分类名
router.put('/:id',async(req,res)=>{
  const {error} = validateCategory(req.body)
if(error){
  res.status(400).send({message:error.details[0].message})
}else{
    const isRepid = await Category.find({name:req.body.name}).count()
    if(isRepid===0){
      const result =await Category.findByIdAndUpdate(req.params.id,{name:req.body.name},{new:true})
      if(!result){
        res.status(400).send(normalRes("修改失败，不存在该类型"))
      }else{
        res.send(normalRes("修改成功",true,result))
      }
    }
    else{
      res.status(400).send(normalRes("修改失败，该类型已存在"))
    }
   
  }
})

//删除分类
router.delete('/:id',async(req,res)=>{
  const result =await Category.findByIdAndRemove(req.params.id)
  if(!result){
    res.status(404).send(normalRes("该分类不存在"))
  }else{
    res.send(normalRes("删除成功",true,result))
  }
})



module.exports = router;
