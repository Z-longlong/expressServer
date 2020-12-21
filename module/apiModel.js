const db = require("../public/db.js");//
const md5 = require("js-md5");
const jwt = require("../public/jwt.js");//引入jsonwebtoke加密操作模块；
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const formidable = require("formidable");

exports._shop=(req,res)=>{
	let skip = req.query.skip;
	let limit = req.query.limit;
	console.log(skip,limit);
	db.find("shopList",{
		skip:skip*1,
		limit:limit*1
	},(err,shopRes)=>{
		res.send(shopRes);
	})
}


exports._yzm = (req,res)=>{
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
	//登录
	/*
	 * 用户集合判定手机号是否存在     存在  则是登录       不存在则是注册
	 * 判断验证码
	 * 		判定   时间是否过期   过期则打回      未过期
	 * 		判定   手机号与验证码是否匹配    匹配登录成功    token_id  id  xxxxxx
	 * 	注册时   
	 * 		写入用户集合   返回用户信息；
	 * 
	 */
	//tel,yzm
	let data = req.body;
	db.find("yzmList",{where:{tel:data.tel}},(err,result)=>{
		if(result[0].exp-new Date().getTime()>0){
			//未过期
			if(data.tel == result[0].tel && data.yzm == result[0].code){
				db.count("userList",{userTel:data.tel},(err,count)=>{
					if(count==0){
						//用户未注册
						db.insertOne("userList",{
							userName:"饿了么用户",
							userPass:"123123",
							userLogo:"http://localhost:8080/upload/user.png",
							userTel:data.tel,
							userWallet:0
						},function(err,zcRes){
							db.find("userList",{where:{userTel:data.tel}},(err,userRes)=>{
								res.send({
									status:200,
									status:"success",
									data:{
										userName:"饿了么用户",
										userId:userRes[0]._id,
										userLogo:userRes[0].userLogo,
										userTel:userRes[0].userTel,
										userWallet:0,
										token_Id:jwt.setToken({
											userId:userRes[0]._id,
											userTel:userRes[0].userTel,
											userName:userRes[0].userName,
											userLogo:userRes[0].userLogo,
											userWallet:userRes[0].userWallet
										},"7d")
									}
								})
							})
						})
					}else{
						db.find("userList",{where:{userTel:data.tel}},(err,userRes)=>{
							res.send({
									status:200,
									status:"success",
									data:{
										userName:"饿了么用户",
										userId:userRes[0]._id,
										userLogo:userRes[0].userLogo,
										userTel:userRes[0].userTel,
										userWallet:0,
										token_Id:jwt.setToken({
											userId:userRes[0]._id,
											userTel:userRes[0].userTel,
											userName:userRes[0].userName,
											userLogo:userRes[0].userLogo,
											userWallet:userRes[0].userWallet
										},"7d")
									}
								})
						})
					}
				})
			}else{
				//手机号与验证码不匹配
				res.status(403);
				res.send("Tel and Yzm not same")
			}
		}else{
			//过期
			res.status(401);
			res.send("time is over")
		}
	})
	
	
	
}

exports._shopOpt = (req,res)=>{
	let shopId = req.query.shopId;
	db.findById("shopList",shopId,(err,data)=>{
		res.send({
			status:1,
			statusText:"success",
			data
		})
	})
}

exports._goods = (req,res)=>{
	let shopId = req.query.shopId;
	let typeId = req.query.typeId;
	db.find("goodsList",{where:{shopId,typeId}},(err,data)=>{
		res.send({
			status:1,
			statusText:"success",
			data
		})
	})
}

/*
 * 商铺id
 * 商品id
 * 类别id
 * 用户id
 * token_id;验证用户身份是否过期；
 * 加减方式 
 */
exports._car = (req,res)=>{
	let data = req.body;
	//验证身份合法性
	jwt.getToken(data.token_id,(err,jwtRes)=>{
		if(err){
			res.status(401);
			res.send("身份验证过期，重新登录")
		}else{
			//商品是否重复出现
			db.count("carList",{goodsId:data.goodsId,userId:data.userId},(err,count)=>{
				//不存在
				if(count===0){
					
					db.insertOne("carList",{
						shopId:data.shopId,
						goodsId:data.goodsId,
						userId:data.userId,
						typeId:data.typeId,
						count:1
					},(err,insertRes)=>{
						res.send("ok")
					})
				}else{
					db.find("carList",{where:{goodsId:data.goodsId,userId:data.userId}},(err,findRes)=>{
						let count;
						if(data.type == "add"){
							 count = findRes[0].count*1+1;
						}else if(data.type == "cut"){
							 count = findRes[0].count-1;
							 if(count==0){
							 	db.deleteOne("carList",{goodsId:data.goodsId,userId:data.userId},(err,delRes)=>{
							 		res.send("删除")
							 	})
							 	return;
							 }
						}
						db.updateOne("carList",{goodsId:data.goodsId,userId:data.userId},{count:count},(err,updateRes)=>{
							res.send("更改")
						})
					})
				}
			})
		}
	})
}

exports._getCar = (req,res)=>{
	let userId = req.query.userId;
	let shopId = req.query.shopId?req.query.shopId:'';
	let typeId = req.query.typeId?req.query.typeId:null;
	if(typeId){
		db.find("carList",{where:{userId,shopId,typeId}},(err,findRes)=>{
			async function fn(){
				let arr = [];
				for(let i = 0 ; i < findRes.length ; i++){
					let obj = toPromise(findRes[i].goodsId,findRes[i]);
					arr.push(obj);
				}
				await Promise.all(arr);
			}
			fn().then(asyncRes=>{
				console.log(findRes);
				res.send({
					status:1,
					statusText:"success",
					data:findRes
				})
			})
		})
	}else{
		db.find("carList",{where:{userId,shopId}},(err,findRes)=>{
			async function fn(){
				let arr = [];
				for(let i = 0 ; i < findRes.length ; i++){
					let obj = toPromise(findRes[i].goodsId,findRes[i]);
					arr.push(obj);
				}
				await Promise.all(arr);
			}
			
			fn().then(asyncRes=>{
				console.log(findRes);
				db.findById("shopList",shopId,(err,shopRes)=>{
					console.log({
							shopId:shopId,
							shopName:shopRes.shopName,
							goods:findRes
						})
					res.send({
						status:1,
						statusText:"success",
						data:{
							shopId:shopId,
							shopName:shopRes.shopName,
							goods:findRes
						}
					})
				})
			})
		})
	}
}

function toPromise (id,obj){
	return new Promise((resolve,reject)=>{
		db.findById("goodsList",id,(err,gData)=>{
			if(err){
				reject(err)
			}else{
				obj.goodsPrice = gData.goodsPrice;
				obj.goodsName = gData.goodsName;
				obj.goodsLogo = gData.goodsLogo;
				resolve(gData)
			}
		})
	})
}

exports._getSum = (req,res)=>{
	let data = req.body;
	console.log(data)
	let goodsArr = JSON.parse(data.goods);
	let arr = [];
	for(var i = 0 ; i < goodsArr.length ; i++){
		arr.push(toPromise(goodsArr[i].goodsId,goodsArr[i]));
	}
	Promise.all(arr).then(allRes=>{
		let sum = 0;
		for(var i = 0 ; i < goodsArr.length ;i++){
			sum+=goodsArr[i].count*goodsArr[i].goodsPrice;
		}
		res.send({
			status:1,
			statusText:"success",
			data:{sum:sum}
		})
	})
}

exports._pay = (req,res)=>{
	let data = JSON.parse(req.body.data);
	const user_token = data.user_token;
	const userId = data.userId;
	console.log(userId)
	/*
	 * user_token:用户touken值，
	 * userId,
	 * opt:购买信息；
	 * {
	 * 	 user_token :  用户token,
	 * 	 userId:用户id,
	 * 	 shop：{
	 * 		shop_id:店铺id,
	 * 		shop_name:店铺名称，
	 * 		goods:[{
	 * 			count:购买数量，
	 * 			goods_id:商品id，
	 * 		}]	
	 * 	 },
	 * 	 address:{
	 * 		addressId:收获id;
	 * 		name:收货人，
	 * 		tel:收货人联系方式
	 * 		pos:收货人位置
	 * 	 }
	 * }
	 */
	jwt.getToken(data.user_token,(err,token_data)=>{
		console.log(1111111)
		if(err){
			
			res.status = 401;
			res.send({
				status:-1,
				statusText:"身份验证有误"
			})
		}else{
			if(token_data.userId == userId){
				db.findById("userList",userId,(err,userRes)=>{
					console.log(222222)
					data.shop.goods = JSON.parse(data.shop.goods);
					let goodsArr = data.shop.goods;
					let arr = [];
					for(var i = 0 ; i < goodsArr.length ; i++){
						arr.push(toPromise(goodsArr[i].goodsId,goodsArr[i]));
					}
					Promise.all(arr).then(allRes=>{
						console.log(3333333)
						let sum = 0;
						for(var i = 0 ; i < goodsArr.length ;i++){
							sum+=goodsArr[i].count*goodsArr[i].goodsPrice;
						}
						if(userRes.userWallet>=sum){
							console.log(444444444)
							db.updateById("userList",userId,{userWallet:userRes.userWallet-sum},(err,updataData)=>{
								console.log(5555555)
//								db.findById("地址集合",data.address.address_id,(err,result)+>{
									db.insertOne("orderList",{
										shop:{
											shop_id:data.shop.shop_id,
											shop_name:data.shop.shop_name,
											goods:data.shop.goods
										},
										opt:{
											exp:new Date().getTime(),
											payType:"钱包支付"
										},
										user:{
											userId:userId,
											userName:userRes.userName,
										},
										address:{
											address_id:data.address.address_id,
											name:data.address.name,
											tel:data.address.tel,
											pos:data.address.pos
										}
									},(err,orderRes)=>{
										
										db.deleteMany("carList",{shopId:data.shop.shop_id,userId:userId},(err,delRes)=>{
											res.send({
												status:0,
												statusText:"success",
												data:"支付成功"
											})
										})
									})
//								})
								
							})
						}else{
							console.log(6666666)
							res.status = 403;
							res.send({
								status:-2,
								statusText:"余额不足"
							})
						}
					})
				})
			}else{
				res.status = 401;
				res.send({
					status:-1,
					statusText:"身份验证有误"
				})
			}
		}
	})
}
