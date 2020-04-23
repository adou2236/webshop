const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/webshop")
    .then(()=>{console.log("mongodb connect cuccessfully")})
    .catch((error)=>{console.log(error)})


const bannerSchema = new mongoose.Schema({
    imgUrl:{
        type:String,
        required:true
    },
    prodId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
        required:true
    }
})

const Banner = mongoose.model("banner",bannerSchema)


function validateBanner(Banner){
    const scheme = {
        imgUrl:Joi.string().required(),
        prodId:Joi.string().required()
    };
    return Joi.validate(Banner,scheme)

}


exports.validateBanner = validateBanner
exports.Banner = Banner
