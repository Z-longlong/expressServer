const db = require("../public/db.js");
const jwt = require("../public/jwt.js");//引入jsonwebtoken令牌
const md5 = require("js-md5");//不可逆加密方式

//获取验证码业务逻辑
exports._code = (req,res)=>{
	let tel = req.body.tel;
	db.count("yzmList",{tel},(err,count)=>{
		if(count==0){
			let yzm = Math.floor(Math.random()*899999)+100000;
			let time = new Date().getTime()+5*60*1000;//过期时间
			db.insertOne("yzmList",{tel,code:yzm,exp:time},function(err,data){
				res.send({
					status:200,
					statusText:"success",
					data:{
						code:yzm,
						tel:tel
					}
				})
			})
		}else{
			db.find("yzmList",{where:{tel}},(err,telRes)=>{
				let time = new Date().getTime();
				if(time - telRes[0].exp>0){
					let yzm = Math.floor(Math.random()*899999)+100000;
					let time = new Date().getTime()+5*60*1000;//过期时间
					db.updateOne("yzmList",{tel},{code:yzm,exp:time},function(err,data){
						res.send({
							status:200,
							statusText:"success",
							data:{
								code:yzm,
								tel:tel
							}
						})
					})
					
				}else{
					//未超时
					console.log(telRes)
					res.send({
						status:200,
						statusText:"success",
						data:{
							code:telRes[0].code,
							tel:tel
						}
					})
				}
			})
		}
	})
}

exports._login = (req,res)=>{
	const data = req.body ; //前台发生的数据    {tel,code};
	//验证验证码是否过期
	let date = new Date().getTime();
	db.find("yzmList",{where:{tel:data.tel}},(err,yzmRes)=>{
		if (err) throw err;
		if(date<yzmRes[0].exp){//未过期
			//验证手机号与验证码是否匹配
			if(data.tel == yzmRes[0].tel&&data.code == yzmRes[0].code){
				db.count("userList",{tel:data.tel},(err,count)=>{
					//验证用户是否为老用户
					if(count>0){
						db.find("userList",{where:{tel:data.tel}},(err,userRes)=>{
							userRes[0]
							res.send({
								status:"1",
								statusText:"登陆成功",
								data:{
									token_id:jwt.setToken({
										id:userRes[0]._id,
										name:userRes[0].userName
									},"7d"),
									id:userRes[0]._id,
									userName:userRes[0].userName,
									userLogo:userRes[0].userLogo,
									tel:userRes[0].tel
								}
							})
						})
					}else{
						db.insertOne("userList",{
							userName:"木鸟租客用户",
							userLogo:"http://localhost:8080/upload/user.png",
							tel:data.tel,
						},(err,insertRes)=>{
							db.find("userList",{where:{tel:data.tel}},(err,userData)=>{
								res.send({
									status:"1",
									statusText:"登陆成功",
									data:{
										token_id:jwt.setToken({
											id:userData[0]._id,
											name:userData[0].userName
										},"7d"),
										id:userData[0]._id,
										userName:userData[0].userName,
										userLogo:userData[0].userLogo,
										tel:userData[0].tel
									}
								})
							})
						})
					}
				})
			}else{
				res.send({
					status:"-2",
					statusText:"手机号与验证码不匹配",
					data:null
				})
			}
		}else{//过期了
			res.send({
				status:"-1",
				statusText:"验证码过期",
				data:null
			})
		}
	})
}


exports._shop = (req,res)=>{
	let typeId = req.query.shopId;
	db.findTypeById("shopList",typeId,(err,data)=>{
		res.send({
			status:"1",
			statusText:"ok",
			data:data
		});
	})
}
exports._type = (req,res)=>{
	let shopId = req.query.shopId;
	db.find("goodsType",{where:{shopId:shopId}},(err,data)=>{
		res.send({
			status:"1",
			statusText:"ok",
			data:data
		});
	})
}

exports._goods = (req,res)=>{
	let shopId = req.query.goodId;
//	let typeId = req.query.typeId;
	db.findById("shopList",shopId,(err,data)=>{
		console.log(data);
		res.send({
			status:"1",
			statusText:"ok",
			data:data
		});
	})
}

exports._car = (req,res)=>{
	const token_id = req.body.token_id;
	const userId = req.body.userId;
//	const shopId = req.body.shopId;
//	const typeId = req.body.typeId;
//	const goodsId = req.body.goodsId;
	const count = req.body.day;
	const userName = req.body.userName;
	const shopAddress = req.body.shopAddress;
	const price = req.body.price;
	const num = req.body.num;
	const zj = req.body.zj;
	const startTime = req.body.startTime;
	console.log(req.body)
	const endTime = req.body.endTime;
	jwt.getToken(token_id,(err,data)=>{
		if (err) {
			res.status(401);
			return;
		}
		if(data.id == userId ){
			//是否重复购买;
//				db.count("carList",{
//					userId
//				},(err,carCount)=>{
//					if(carCount==0){
						db.insertOne("carList",{
							userId,count,userName,price,num,zj,shopAddress,startTime,endTime
						},(err,insertRes)=>{
							res.send({
								status:"1",
								statusText:"ok",
								data:"添加成功"
							})
						})
//					}else{
//						db.updateOne("carList",{
//							userId,count,userName,price,num,zj
//						},{count},(err,updateRes)=>{
//							res.send({
//								status:"1",
//								statusText/\:"ok",
//								data:"添加成功"
//							})
//						}
//					}
//				})
				
//			}else if(count==0){
//				db.deleteOne("carList",{
//					userId
//				},(err,deldata)=>{
//					res.send({
//						status:"1",
//						statusText:"ok",
//						data:"添加成功"
//					})
//				})
//			}else if(count == 1){
				
//			}
		}else{
			res.status(401);
		}
	})
}
exports._getCar = (req,res)=>{
	const token_id = req.query.token_id;
	const userId = req.query.userId;
	console.log(userId)
//	const shopId = req.query.shopId;
	jwt.getToken(token_id,(err,data)=>{
		if (err) {
			res.status(401);
			return;
		}
		if(data.id == userId ){
			db.find("carList",{where:{
				userId
			}},(err,result)=>{
				console.log(result)
				if(err)throw err;
				res.send({
					status:"1",
					statusText:'ok',
					data:result
				})
//				let arr = result.map((item,index)=>{
//					return getDb(item.goodsId);
//				})
//				new Promise((resolve,reject)=>{
//					db.findById("shopList",shopId,(err,shopdata)=>{
//						if(err){
//							reject(err)
//						}else{
//							resolve(shopdata);
//						}
//					})
//				}).then(shopOpt=>{
//					let shopQsj = shopOpt.shopQsj*1;
//					Promise.all(arr).then(allres=>{
//						let sum = 0;
//						let txt = "";
//						for(var i = 0 ; i < allres.length ; i++){
//							sum += allres[i].goodsPrice*result[i].count;
//						}
//						if(sum>=shopQsj){
//							txt = "去结算"
//						}else{
//							txt = "还差$"+(shopQsj-sum)+"起送"
//						}
//						res.send({
//							status:"1",
//							statusText:"ok",
//							data:{
//								result:result,
//								sum:sum,
//								txt:txt
//							}
//						})
//					})
//				})
				
//				res.send({
//					status:"1",
//					statusText:"ok",
//					data:result
//				})
			})
		}else{
			res.status(401);
		}
	})
}

function getDb(goodsId){
	return new Promise((resolve,reject)=>{
		db.findById("goodsList",goodsId,(err,data)=>{
			if(err){
				reject(err)
			}else{
				resolve(data);
			}
		})
	})
}
