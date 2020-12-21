const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;

const url = "mongodb://localhost:27017/ele1806";

//连接数据库
function connect(backFn){
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		var dbase = db.db("ele1806");
		backFn(dbase);
	})
}

/*
 * 插入一条数据
 * insertOne
 * collectionName：集合名称
 * insertData:插入的数据
 * callback:服务器端操作的回调函数
 */

exports.insertOne = function(collectionName,insertData,callback){
	connect(function(dbase){
		dbase.collection(collectionName).insertOne(insertData,function(err,data){
			callback(err,data);
		})
	})
}

/*
 * 插入多条数据
 * insertMany
 * collectionName:集合名称
 * insertArr:插入的数据集合
 * callback:数据插入成功后的回调函数；
 */

exports.insertMany = function(collectionName,insertArr,callback){
	connect(function(dbase){
		dbase.collection(collectionName).insertMany(insertArr,function(err,data){
			callback(err,data)
		})
	})
}

/*
 * 删除一条数据
 * deleteOne
 * collectionName:集合名称
 * query:查询条件
 * callback:数据删除成功后的回调函数；
 */

exports.deleteOne = function(collectionName,query,callback){
	connect(function(dbase){
		dbase.collection(collectionName).deleteOne(query,function(err,data){
			callback(err,data)
		})
	})
}

/*
 * 删除多条数据
 * deleteMany
 * collectionName:集合名称
 * query:查询条件
 * callback:数据删除成功后的回调函数；
 */

exports.deleteMany = function(collectionName,query,callback){
	connect(function(dbase){
		dbase.collection(collectionName).deleteMany(query,function(err,data){
			callback(err,data)
		})
	})
}

/*
 * 通过id删除数据
 * deleteById
 * collectionName:集合名称
 * id:被删除项的id
 * callback:数据删除成功后的回调函数；
 */

exports.deleteById = function(collectionName,id,callback){
	connect(function(dbase){
		dbase.collection(collectionName).deleteOne({_id:ObjectId(id)},function(err,data){
			callback(err,data)
		})
	})
}

/*
 * findById
 * collectionName:集合名称
 * id:被查询项的id
 * callback:数据查询成功后的回调函数；
 */

exports.findById = function(collectionName,id,callback){
	connect(function(dbase){
		dbase.collection(collectionName).find({_id:ObjectId(id)}).toArray(function(err,data){
			callback(err,data[0])
		})
	})
}
/*
 * 用于短租项目的类别商铺
 */
exports.findTypeById = function(collectionName,id,callback){
	connect(function(dbase){
		dbase.collection(collectionName).find({typeId:id}).toArray(function(err,data){
			callback(err,data)
		})
	})
}

/*
 * find
 * collectionName:集合名称
 * query:{搜索条件
 * 		where:{}//检索条件
 * 		sort:{}//排序条件
 * 		skip:num//跳过数据
 * 		limit:num//返回条数
 * }
 * callback:数据查询成功后的回调函数；
 */
exports.find = function(collectionName,query,callback){
	//默认处理
	if(query.where == undefined){
		query.where = {};
	}
	if (query.sort == undefined) {
		query.sort = {};
	}
	if (query.skip == undefined){
		query.skip = 0;
	}
	if (query.limit == undefined) {
		query.limit = 0;//limit 为0 时获取所有数据
	}
	connect(function(dbase){
		dbase.collection(collectionName).find(query.where).sort(query.sort).skip(query.skip).limit(query.limit).toArray(function(err,data){
			callback(err,data)
		})
	})
}

/*
 * 更新一条数据
 * deleteOne
 * collectionName:集合名称
 * query:查询条件，
 * updata:更新的数据
 * callback:数据更新成功后的回调函数；
 */

exports.updateOne = function(collectionName,query,update,callback){
	connect(function(dbase){
		dbase.collection(collectionName).updateOne(query,{$set:update},function(err,data){
			callback(err,data)
		})
	})
}

/*
 * 删除多条数据
 * updataMany
 * collectionName:集合名称
 * query:查询条件
 * update:更新的数据
 * callback:数据更新成功后的回调函数；
 */

exports.updateMany = function(collectionName,query,update,callback){
	connect(function(dbase){
		dbase.collection(collectionName).updateMany(query,{$set:update},function(err,data){
			callback(err,data)
		})
	})
}

/*
 * 通过id更新数据
 * updateById
 * collectionName:集合名称
 * id:被删除项的id
 * update:更新的数据
 * callback:数据更新成功后的回调函数；
 */

exports.updateById = function(collectionName,id,update,callback){
	connect(function(dbase){
		dbase.collection(collectionName).updateOne({_id:ObjectId(id)},{$set:update},function(err,data){
			callback(err,data)
		})
	})
}

/*
 * 返回符合条件的数据个数
 * count
 * collectionName:集合名称
 * query
 * callback
 */

exports.count = function(collectionName,query,callback){
	connect(function(dbase){
		dbase.collection(collectionName).count(query,function(err,data){
			callback(err,data)
		})
	})
}
