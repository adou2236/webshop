const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/webshop")
    .then(()=>{console.log("mongodb connect cuccessfully")})
    .catch((error)=>{console.log(error)})


const rateSchema = new mongoose.Schema({
    userId:{
        type:String,
        default:'none'
    },
    rate:{
        type:Number,
        required:true,
        min:0,
        max:5,
    },
    message:{
        type:String,
        default:'',
        min:0,
        max:255,
    }
})

const Rate = mongoose.model("rate",rateSchema)




exports.Rate = Rate
