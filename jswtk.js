const jwt = require("jsonwebtoken");
const key = "今天立冬";//加密时秘钥，自定义的  
//秘钥可以让jsonwebtoken对别人不可逆，对自己可逆破解
//let obj = {
//	id:"656484684616516516",
//	name:"lee"
//}

//加密
//const token = jwt.sign(obj,key,{expiresIn:2})
/*
 * obj 加密内容
 * key 秘钥
 * 
 * expiresIn 加密时间    时效性
 *     亦可以使用字符串  1d = 1天   1h=>1小时   直接写数字为秒数
 */

console.log(token)

//解密 
//setTimeout(function(){//模拟过期失效
//	jwt.verify(token,key,function(err,data){
//		console.log(err,data)
//	})	
//},5000)

//封装
export default {
	//设置token
	setToken(content,time){
		return jwt.sign(content,key,{expiresIn:time})
	},
	//解密token
	getTkoen(token,callback){
		jwt.verify(token,key,(err,data)=>{
			if(err){
				callback(err)
			}else{
				callback(null,data)
			}
		})
	},
}
