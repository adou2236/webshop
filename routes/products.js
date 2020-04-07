const express = require("express")
const {normalRes} = require("../modules/normalRES")
const router = express.Router()
const {Product,validateProduct} = require("../modules/product")
const {Category} = require("../modules/category")



//列出所有商品
router.get('/',async(req,res)=>{
    const allProduct = await Product.find().sort({updateTime: -1}).populate("category")
    if(allProduct.length!==0){
        res.send(normalRes("查询完毕",true,allProduct))
    }else{
        res.status(400).send(normalRes("暂无商品"))
    }
})


//添加新商品
router.post('/newproduct',async(req,res)=>{
    const {error} = validateProduct(req.body)
  if(error){
    res.status(400).send({message:error.details[0].message})
  }else{
    const newProduct = new Product({
        name:req.body.name,
        price:req.body.price,
        cover:req.body.cover,
        category:req.body.category,
        updateTime: Date.now()
    })
    try {
    const result = newProduct.save()
    res.send(normalRes("新增成功",true,result))
    } catch (error) {
    res.status(400).send(normalRes("新增失败",false))
    }
  }
})

//修改商品
// router.put('/:id',async(req,res)=>{
//   const {error} = validateCategory(req.body)
// if(error){
//   res.status(400).send({message:error.details[0].message})
// }else{
//     const isRepid = await Category.find({name:req.body.name}).count()
//     if(isRepid===0){
//       const result =await Category.findByIdAndUpdate(req.params.id,{name:req.body.name},{new:true})
//       if(!result){
//         res.status(400).send(normalRes("修改失败，不存在该类型"))
//       }else{
//         res.send(normalRes("修改成功",true,result))
//       }
//     }
//     else{
//       res.status(400).send(normalRes("修改失败，该类型已存在"))
//     }
   
//   }
// })

// //删除商品
// router.delete('/:id',async(req,res)=>{
//   const result =await Category.findByIdAndRemove(req.params.id)
//   if(!result){
//     res.status(404).send(normalRes("该分类不存在"))
//   }else{
//     res.send(normalRes("删除成功",true,result))
//   }
// })



module.exports = router;
