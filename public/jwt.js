const jwt = require("jsonwebtoken");
const key = "dasojdpasdj";//自定义设置的字符串  作为加密秘钥使用；
module.exports = {
	//设置token
	setToken(content,time){
		return jwt.sign(content,key,{expiresIn:time})
	},
	//解密token
	getToken(token,callback){
		jwt.verify(token,key,(err,data)=>{
			if(err){
				callback(err)
			}else{
				callback(null,data)
			}
		})
	},
}

