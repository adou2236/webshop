// 校验token
const jwt=require('jsonwebtoken')
const checkTokenC = (token) => {
    console.log("客户端验证")
	return new Promise((resolve,reject)=>{
		jwt.verify(token,'customer',(err,data)=>{
			console.log(data)
            if(err) 
                reject('token 验证失败')
            else   
                resolve(data)
		})
	})
}

const checkTokenA = (token) => {
    console.log("服务端验证")
	return new Promise((resolve,reject)=>{
		jwt.verify(token,'admin',(err,data)=>{
			console.log(data)
            if(err) 
                reject('token 验证失败')
            else   
                resolve(data)
		})
	})
}

exports.checkTokenC = checkTokenC,
exports.checkTokenA = checkTokenA