const db = require("../public/db.js");//
const md5 = require("js-md5");
const jwt = require("../public/jwt.js");//引入jsonwebtoke加密操作模块；
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const formidable = require("formidable");

exports._adminLogin = (req,res)=>{
	console.log(md5("123"))
	let data = req.body;
	db.find("adminList",{where:{adminName:data.adminName,adminPass:md5(data.adminPass)}},(err,result)=>{
		if(err){
			res.send({
				status:"0",
				msg:"数据库连接失败"
			})
		}else{
			if (result.length ==0) {
				res.send({
					status:"0",
					msg:"用户名与密码不匹配"
				})
			}else{
				db.insertOne("adminLog",{
					adminId:result[0]._id,
					type:'1000',
					typeText:"登录",
					time:(new Date()).getTime()
				},(err,logres)=>{
					res.send({
						status:"1",
						msg:"登录成功",
						data:{
							token_id:jwt.setToken({_id:result[0]._id},"7d"),
							adminId:result[0]._id,
							adminName:result[0].adminName,
							adminPower:result[0].adminPower
						}
					})
				})
			}
		}
	})
}

exports._adminToken = (req,res)=>{
	let token_id = req.query.token_id;
	jwt.getToken(token_id,(err,data)=>{
		if(err){
			res.status = 401;
			res.send({
				status:"-1",
				statusText:err.name
			});
		}else{
			res.send({
				status:"1",
				statusText:"验证成功",
				data:data
			})
		}
	})
}

exports._admin = (req,res)=>{
	db.find("adminList",{},(err,data)=>{
		res.send({
			status:"1",
			statusText:"success",
			data:data
		});
	})
}

exports._adminLog = (req,res)=>{
	db.find("adminLog",{where:{adminId:ObjectId(req.query.id)},limit:0,skip:0},(err,data)=>{
		res.send({
			status:"1",
			statusText:"success",
			data:data
		});
	})
}

exports._adminRepeat = (req,res)=>{
	let adminName = req.query.adminName;
	db.count("adminList",{adminName:adminName},(err,count)=>{
		res.send({
			status:"1",
			statusText:"success",
			count:count
		});
	})
}

exports._addAdmin = (req,res)=>{
	let data = req.body;
	let adminId = data.adminId;
	delete data.adminId;
	data.adminTime = (new Date()).getTime();
	data.adminPass = md5(data.adminPass);
	db.insertOne("adminList",data,function(err,result){
		db.insertOne("adminLog",{
			adminId:ObjectId(adminId),
			type:'1001',
			typeText:"添加了"+data.adminName+"管理员",
			time:data.adminTime
		},(err,logres)=>{
			res.send({
				status:"1",
				statusText:"success",
				data:result
			})
		})
	})
}

exports._makeSurePass = (req,res)=>{
	let data = req.body;
	db.findById("adminList",data.adminId,function(err,result){
		console.log(result);
		if(result.adminPass==md5(data.adminPass)&&result.adminName == data.adminName){
			res.send({
				status:"1",
				statusText:"密码正确"
			})
		}else{
			res.send({
				status:"-1",
				statusText:"密码有误无法修改密码"
			})
		}
		
	})
}

exports._resetPass = (req,res)=>{
	let data = req.body;
	db.updateById("adminList",data.adminId,{adminPass:md5(data.adminPass)},function(err,result){
		db.insertOne("adminLog",{
			adminId:ObjectId(data.adminId),
			type:'1002',
			typeText:"修改了"+data.adminName+"管理员的密码",
			time:(new Date()).getTime()
		},(err,logres)=>{
			res.send({
				status:"1",
				statusText:"修改成功",
			})
		})
	})
}

exports._isTypeIn = (req,res)=>{
	db.count("typeList",req.query,(err,count)=>{
		if(count>0){
			res.send({
				status:"-1",
				statusText:"类别已存在"
			})
		}else{
			res.send({
				status:"1",
				statusText:"通过"
			})
		}
	})
}

exports._shopType = (req,res)=>{
	let data = req.body;
	let adminId = data.adminId;
	db.findById("adminList",adminId,function(err,adminRes){
		if(adminRes.adminPower<=2){
			delete data.adminId;
			db.insertOne("typeList",data,(err,result)=>{
				db.insertOne("adminLog",{
					adminId:ObjectId(adminId),
					type:'1003',
					typeText:"添加了"+data.typeName+"店铺类别",
					time:(new Date()).getTime(),
				},(err,logres)=>{
					res.send({
						status:"1",
						statusText:"添加类别成功",
					})
				})
			})
		}else{
			res.send({
				status:"-1",
				statusText:"权限不足，无法写入"
			})
		}
	})
	
}

exports._getShopType = (req,res)=>{
	db.find("typeList",{},(err,result)=>{
		res.send({
			status:"1",
			statusText:"ok",
			data:result
		})
	})
}

exports._shop=(req,res)=>{
	var form = new formidable.IncomingForm();
	//设置字符编码
	form.encoding = "utf-8";
	form.parse(req,(err,obj,files)=>{
		let adminId = obj.adminId;
		db.findById("adminList",adminId,function(err,adminRes){
			delete obj.adminId;
			if(adminRes.adminPower<=2){
				db.insertOne("shopList",obj,function(err,result){
					db.insertOne("adminLog",{
						adminId:ObjectId(adminId),
						type:'1004',
						typeText:"添加了"+obj.shopName+"店铺",
						time:(new Date()).getTime(),
					},(err,logres)=>{
						res.send({
							status:"1",
							statusText:"添加店铺成功",
						})
					})
				})
			}else{
				res.send({
					status:"-1",
					statusText:"权限不足，无法写入"
				})
			}
		})
	})
}

exports._getShop = (req,res)=>{
	db.find("shopList",{},(err,data)=>{
		res.send({
			status:"1",
			statusText:"success",
			data
		})
	})
}

exports._goodsTypeRepeat= (req,res)=>{
	db.count("goodsType",{shopId:req.query.shopId,goodsTypeName:req.query.goodsTypeName},(err,count)=>{
		if(count>0){
			res.send({
				status:"-1",
				statusText:"店铺中已存在该类别",
			})
		}else{
			res.send({
				status:"1",
				statusText:"通过",
			})
		}
	})
}

exports._goodsType = (req,res)=>{
	let data = req.body;
	db.findById("adminList",data.adminId,(err,adminRes)=>{
		if(adminRes.adminPower>3){
			res.send({
				status:"-1",
				statusText:"权限不足，无法添加类别"
			})
		}else{
			db.insertOne("goodsType",{
				goodsTypeName:data.goodsTypeName,
				shopName:data.shopName,
				shopId:data.shopId
			},(err,typeRes)=>{
				db.insertOne("adminLog",{
					adminId:ObjectId(data.adminId),
					type:'1005',
					typeText:"添加了"+data.shopName+"店铺"+data.goodsTypeName+"类别",
					time:(new Date()).getTime(),
				},(err,logres)=>{
					res.send({
						status:"1",
						statusText:"添加类别成功",
					})
				})
			})
		}
	})
}

exports._getGoodsType = (req,res)=>{
	let shopId = req.query.shopId;
	db.find("goodsType",{where:{shopId}},(err,data)=>{
		res.send({
			status:"1",
			statusText:"success",
			data:data
		})
	})
}

exports._goods=(req,res)=>{
	var form = new formidable.IncomingForm();
	//设置字符编码
	form.encoding = "utf-8";
	form.parse(req,(err,obj,files)=>{
		console.log(obj);
		db.findById("adminList",obj.adminId,(err,adminRes)=>{
			if(adminRes >= 3){
				res.send({
					status:"-1",
					statusText:"权限不足"
				})
			}else{
				obj.goodsTry = JSON.parse(obj.goodsTry);
				db.insertOne("goodsList",{
					shopId:obj.addGoods_shop_id,
					shopName:obj.addGoods_shop_name,
					typeId:obj.addGoods_type_id,
					typeName:obj.addGoods_type_name,
					goodsLogo:obj.goodsLogoAddress,
					goodsName:obj.goodsName,
					goodsPrice:obj.goodsPrice,
					goodsCutPrice:obj.goodsCutPrice,
					goodsCount:obj.goodsCount,
					goodsRack:obj.goodsRack,
					goodsOpt:obj.goodsOpt,
					goodsType:obj.goodsType,
					goodsTry:obj.goodsTry
				},(err,goodsRes)=>{
					db.insertOne("adminLog",{
						adminId:ObjectId(obj.adminId),
						type:'1006',
						typeText:"添加了"+obj.addGoods_shop_name+"店铺"+obj.goodsName+"商品",
						time:(new Date()).getTime(),
					},(err,logres)=>{
						res.send({
							status:"1",
							statusText:"添加商品成功",
						})
					})
				})
				
			}
		})
	})
}