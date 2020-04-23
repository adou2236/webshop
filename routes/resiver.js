const express = require("express")
const router = express.Router()
const {Resiver,validateResiver} = require("../modules/resiver")
const {User} = require("../modules/user")
const {normalRes} = require("../modules/normalRES")

//获得当前用户的地址列表
router.get('/', async(req, res) => {
    const userId = req.query.userId;
    const Arrlist = await Resiver.find({userId:userId}).sort({sort:-1}).select('-userId -__v')
    if(Arrlist.length===0){
        res.send(normalRes("无地址",true,Arrlist))
    }
    else{
        res.send(normalRes("查询成功",true,Arrlist))
    }
});

//添加新地址或修改地址
router.post("/updateAddress",async(req,res)=>{
    const id = req.body._id
    if (id) { // 更新
        let changedResiver = {}
        Object.keys(req.body).forEach(function (key) {
            changedResiver[key] = req.body[key]
        });
        const result = await Resiver.findByIdAndUpdate(id,changedResiver,{new:true})
        console.log("result",result)
        if(!result){
            res.status(404).send(normalRes("修改失败"))
          }else{
            res.send(normalRes("修改成功",true,result))
          }

    } else { // 新增
        const {error} = validateResiver(req.body)
        if(error){
          res.status(400).send({message:error.details[0].message})
        }else{
            let newAddress = await new Resiver(req.body);
            const selectdUser = await User.findById(req.body.userId).select({resiver:1}).populate({path: 'resiver'})
            if(!selectdUser){
                res.status(404).send(normalRes("当前用户不存在"))
            }
            else{
                if(selectdUser.resiver.length===0){
                    newAddress.isdefault=true
                }
                try {
                    selectdUser.resiver.push(newAddress)
                    const result = await selectdUser.save()
                    console.log("result",result)
                    const result2 = await newAddress.save()
                    console.log("err",result2)
                    res.send(normalRes("添加成功",true,result))
                } catch (error) {
                    console.log(error)
                    res.status(400).send(normalRes("添加失败",false,error))
                }
            }
        }
    }  
})

//删除地址
router.delete("/:id",async(req,res)=>{
    const result =await Resiver.findByIdAndRemove(req.params.id)
    if(!result){
      res.status(404).send(normalRes("该地址不存在"))
    }else{
      res.send(normalRes("删除成功",true,result))
      const restCount = await Resiver.find({userId:result.userId})
      //若只剩最后一个地址，将其设为默认地址
      if(restCount.length===1){
        restCount[0].isdefault=true;
        try {
          await restCount[0].save()
        } catch (error) {
            console.log(error)
        }
      }
    }
})



module.exports = router;
