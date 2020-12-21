const express = require("express");
const http = express();
const bodyParser = require("body-parser");
const adminRouter = require("./router/admin");
const apiRouter = require("./router/api");
const eleRouter = require("./router/car");
http.listen(8080,function(){
	console.log("服务已启动,端口：8080");
})
//运行跨域访问
http.use(function(req,res,next){
	res.header("Access-Control-Allow-Origin","*");
	next();
})

http.use(bodyParser.urlencoded({extended:false}));

http.use("/admin",adminRouter);
//eleapp路由地址
//http.use("/api",apiRouter);
//客户端所有请求
http.use("/ele",eleRouter);

http.use('/', express.static(__dirname+"/eleadmin"));
http.all("*",function(req,res){
	res.sendFile(__dirname+req.url);
})
