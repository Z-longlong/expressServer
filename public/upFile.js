const formidable = require("formidable");
const fs = require("fs");
var fileArr = [];

exports.upFileCallBack =function(req,res){
	res.header("Access-Control-Allow-Origin","*");
	//获取form对象
	var form = new formidable.IncomingForm();
	//设置字符编码
	form.encoding = "utf-8";
	//设置文件上传的文件夹
	form.uploadDir = "./upload";
	//是否保留文件扩展名
	form.keepExtensions = true;
	//设置文件上传的大小
	form.maxFiledsSize = 2*1024*1024;//2M;
	//监听文件上传状态
	form.parse(req,(err,obj,files)=>{
		
		var file = files.upPic;
		var path = file.path;
		var ext = path.substr(path.lastIndexOf(".")+1).toLowerCase();
		if(fileArr.indexOf(file.name)>=0){
			fs.unlink(path,(err)=>{
				if(err) throw err;
				res.send("该文件已存在")
			})
		}else{
			fileArr.push(file.name)
			if(ext=="png"||ext == "jpg"||ext=="gif"||ext=="svg"){
				var times = (new Date()).getTime();
				fs.rename(path,"./upload/"+times+"."+ext,(err)=>{
					if(err) throw err;
					fileArr = [];
					res.send({
						id : times,
						name : file.name,
						url:"http://localhost:8080/upload/"+times+"."+ext,
						size : file.size,
						msg:"上传成功",
						ext:ext
					})
				})
			}else{
				fs.unlink(path,(err)=>{
					if(err) throw err;
					res.send("文件格式不正确，请重新上传")
				})
			}
		}
	})
}

exports.delPic = (req,res)=>{
	var id = req.query.id;
	var ext = req.query.ext;
	fs.unlink("./upload/"+id+"."+ext,(err)=>{
		if(err) throw err;
		res.send("删除成功")
	})
	
}
