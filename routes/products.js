const express = require("express")
const {normalRes} = require("../modules/normalRES")
const router = express.Router()
const {Product,validateProduct} = require("../modules/product")
const {Category} = require("../modules/category")
const moment = require('moment');



//商品展示
router.get('/',async(req,res)=>{
  let condition = {}//查询条件为空则查所有
  if(req.query.category){
    condition.category = req.query.category
  }
  let sortType = {updateTime: -1}//若排序凡是为空则按更新时间排序
  if(req.query.sort){
    sortType={}
    sortType[req.query.sort]=req.query.order//升序或降序1升序-1降序
  }
  if( req.query.details ){
    const regex = new RegExp(req.query.details, 'i');//返回正则表达式，不区分大小写
    condition.name = regex
  }
  console.log(condition)
  let pages = req.query.pages//页码
  const pageNumber = 10
  const count = await Product.find(condition).count()
  const allProduct = await Product.find(condition)
                                  .sort(sortType)
                                  .populate({path: 'category', select: 'name'})
                                  .select({__v:0})
                                  .limit(pageNumber)
                                  .skip((pages-1)*pageNumber)
  if(count!==0){
    // res.status(400).send(normalRes("暂无商品"))

      res.send(normalRes("查询完毕",true,{count:count,data:allProduct}))
  }else{
      res.status(400).send(normalRes("暂无商品"))
  }
})


//商品详情
router.get('/:id',async(req,res)=>{
  const result = await Product.findById(req.params.id)
  if(!result){
    res.status(404).send(normalRes("不存在该商品"))
  }else{
    res.send(normalRes("success",true,result))
  }


})
//添加新商品
router.post('/newproduct',async(req,res)=>{
    const {error} = validateProduct(req.body)
  if(error){
    res.status(400).send({message:error.details[0].message})
  }else{
    let newProduct =new Product()
    Object.keys(req.body).forEach(function (key) {
      newProduct[key] = req.body[key]
    });
    newProduct.updateTime=Date.now()
    console.log(newProduct)

    try {
      const result =await newProduct.save()
      res.send(normalRes("新增成功",true,result))
    } catch (error) {
      console.log(error)
      res.status(400).send(normalRes("新增失败",false,error))
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

//商品模糊搜索
router.get('/search', async(req, res) => {
  let details = req.query.details;
  let pages = req.query.pages
  const pageNumber = 10
  const regex = new RegExp(details, 'i');//返回正则表达式，不区分大小写
  const count =  await Product.find({name: regex}).count()
  const result = await Product.find({name: regex}).limit(pageNumber).skip((pages-1)*pageNumber)//分页
  if(count===0){
    res.send((normalRes("查询无果",false,result)))
  }else{
    res.send((normalRes("查询成功",true,{count:count,data:result})))
  }
});



module.exports = router;
