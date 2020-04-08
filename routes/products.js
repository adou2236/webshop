const express = require("express")
const {normalRes} = require("../modules/normalRES")
const router = express.Router()
const {Product,validateProduct} = require("../modules/product")
const {Category} = require("../modules/category")



//列出所有商品
router.get('/',async(req,res)=>{
    const allProduct = await Product.find().sort({updateTime: -1}).populate({path: 'category', select: 'name -_id'}).select({__v:0})
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
    const result =await newProduct.save()
    res.send(normalRes("新增成功",true,result))
    } catch (error) {
    res.status(400).send(normalRes("新增失败",false))
    }
  }
})

//修改商品
router.put('/:id',async(req,res)=>{
  let changedProduct = {}
  Object.keys(req.body).forEach(function (key) {
    changedProduct[key] = req.body[key]
  });
  console.log(changedProduct)
  const result =await Product.findByIdAndUpdate(req.params.id,changedProduct,{new:true})
  if(!result){
    res.status(404).send(normalRes("修改失败，不存在该商品"))
  }else{
    res.send(normalRes("修改成功",true,result))
  }
})

//删除商品
router.delete('/:id',async(req,res)=>{
  const result =await Product.findByIdAndRemove(req.params.id)
  if(!result){
    res.status(404).send(normalRes("该商品不存在"))
  }else{
    res.send(normalRes("删除成功",true,result))
  }
})



module.exports = router;
