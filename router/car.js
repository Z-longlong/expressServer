const express = require("express");
const router = express.Router();
const upFile = require("../public/upFile.js");
const db = require("../public/db.js");//
const eleM = require("../module/eleModel.js");
//获取验证码接口
router.post("/code",eleM._code);

//登陆注册接口
router.post("/login",eleM._login);

//获取一条店铺详情
router.get("/shop",eleM._shop);
//获取某店铺下的商品类别
router.get("/type",eleM._type);
//获取某类别下的商品
router.get("/goods",eleM._goods);

//添加至购物车接口
router.post("/car",eleM._car);
//获取购物车接口
router.get("/car",eleM._getCar);
//exports.router = router;
module.exports = router;